import { Messages } from "@/components/messages";
import { Status } from "@/components/status";
import { PageHeader } from "@ant-design/pro-layout";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Form, FormControl } from "react-bootstrap";
import Head from "next/head";
import { useState, useEffect, ChangeEvent, SetStateAction } from "react";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { ChatBox } from "..";
import styled from "styled-components";

const LoginWrapper = styled(ChatBox)`
  width: 400px; /* Adjust the width */
  padding: 20px; /* Adjust the padding */
`;

export default function ChatRoomEntry(props: { userId: string }) {
  const { userId } = props;

  const [ws, setWs] = useState<WebSocket | undefined>(undefined);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [roomID, setRoomID] = useState("")
  const [newRoom, setNewRoom] = useState(false)

  const GenerateRoomID = Math.floor(100000 + Math.random() * 900000);

  const baseURL = `ws:localhost:8080/ws?id=${userId}&roomid=${roomID}`;

  const router = useRouter();

  const enterChat = (roomId: SetStateAction<string>) => {
    setRoomID(roomId)
    const ws = new WebSocket(baseURL);
    setWs(ws);
    ws.onopen = () => {
      ws?.send(
        JSON.stringify({
          action: "join-room",
          message: "Joining Room",
          roomId: roomId,
          sender: `${userId}`,
        })
      );
      // setMessage("");
      toast.success(`Websocket opened!`);
    };

    ws.onclose = () => {
      toast.success(`Websocket closed!`);
      setWs(undefined);
    };

    ws.onmessage = (msg) => {
      setMessagesFnc(JSON.parse(msg.data));
    };

    ws.onerror = (error) => {
      toast.error(`Websocket error: ${error}`);
    };
  };

  const sendMessage = (roomId: string) => {
    if (message && message !== "") {
      
      ws?.send(
        JSON.stringify({
          action: "send-message",
          message: message,
          roomId: roomId,
          sender: `${userId}`,
        })
      );
      setMessage("");
    }
  };

  const handleLogout = () => {
    ws?.close();
    router.push("/");
  };

  const setMessagesFnc = (value: any) => {
    setMessages((prev) => [...prev, value]);
  };

  const HandleRoomID = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const inputRoomID = e.target.value.replace(/\D/g, '');
    setRoomID(inputRoomID)
  }

  const verifyRoomID = (e: string) => {
    const isValidRoomID = /^\d{6}$/.test(e);
    if (isValidRoomID) {
      return true
    }
  }

  useEffect(() => {
    // This code will run every time roomID changes
    if (roomID !== undefined && roomID !== '' && newRoom === true) {
      enterChat(roomID);
    }
    setNewRoom(false)
  }, [roomID]);

  const generateNewRoom = () => {
    setRoomID(GenerateRoomID.toString())
    setNewRoom(true)
  }

  return (
    <>
      <Head>
        <title>Simple chat application</title>
        <meta
          name="description"
          content="Simple chat application creating using web socket"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <>
          <PageHeader
            className="site-page-header-responsive"
            title="WebChat"
            extra={[
              <Button key="1" variant="danger" onClick={handleLogout}>
                Logout
              </Button>,
            ]}
          />
          {ws ? (
            <ChatBox>
              <h1>WebChat --- {roomID}</h1>
              <Status status="You are online" color="green" />
              <Messages messages={messages} currentUser={userId} />
              <div className="chat-inputs">
                <form onSubmit={(e) => {
                  e.preventDefault()
                  sendMessage(roomID)}
                  }>
              <LoginWrapper>
                  <Form.Control
                    // size="lg"
                    type="text"
                    placeholder="Write message"
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                  />
                  <Button
                    style={{ marginTop: "10px" }}
                    variant="success"
                    // onClick={() => sendMessage(roomID)}
                    type="submit"
                    size="sm"
                  >
                    Send Message
                  </Button>
              </LoginWrapper>
                  </form>
              </div>
            </ChatBox>
          ) : (
            <ChatBox style={{ marginTop: "50px" }}>
              <h1>WebChat</h1>
              <Status status="You are offline" color="red" />

              <Button style={{ marginTop: "5px" }}
                variant="primary"
                onClick={() => generateNewRoom()}
                >
                Create New Chat Room
              </Button>

              <form onSubmit={(e) => {
                e.preventDefault()
                enterChat(roomID.toString())
                }}>
                  
                <LoginWrapper>
                  <Form.Control type="text" style={{ marginTop: "50px", marginBottom: "10px"}}
                    value={roomID}
                    onChange={(e) => HandleRoomID(e)}
                    placeholder="Enter Room ID"
                    height={40}
                  />

                  {roomID === "" && (
                    <Status status="Please Enter Room ID" color="red" />
                  )}

                  <Button style={{ marginTop: "10px" }}
                    
                    as="input"
                    variant="primary"
                    // onClick={() => enterChat(roomID.toString())}
                    disabled={!verifyRoomID(roomID)}
                    type="submit"
                    value="Join Room"
                  />
                </LoginWrapper>
              </form>

            </ChatBox>
          )}
        </>
      </main>
    </>
  );
}
export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  const query = ctx.query;
  return {
    props: { userId: query.userId },
  };
};