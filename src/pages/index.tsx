// pages/index.tsx
import Head from "next/head";
import { Inter } from "next/font/google";
import { useState } from "react";
import { ToastContainer } from 'react-toastify';
import { Button, FormControl, Form } from "react-bootstrap";
import styled from "styled-components";

import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export const ChatBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 800px;
  margin: auto;
  .chat-inputs {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    margin-top: 15px;
    gap: 20px;
    width: 100%;
  }
`;
const LoginWrapper = styled(ChatBox)`
  width: 400px; /* Adjust the width */
  padding: 20px; /* Adjust the padding */
  border: 2px solid #1677ff; /* Adjust the border color and thickness */
  border-radius: 8px; /* Add border-radius for rounded corners */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add a subtle box shadow */
  margin-top: 50px; /* Adjust the margin-top */
`;

export default function Home() {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const router = useRouter();

  const verifyEmail = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);

    // Email validation using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(inputEmail));
  };

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
        <LoginWrapper>
        <Form.Control type="email"
            value={email}
            onChange={(e) => verifyEmail(e)}
            placeholder="Enter your email"
            height={40}
          />
          {!isValidEmail && (
            <FormControl.Feedback type="invalid">
              <p>Please enter a valid email address.</p>
            </FormControl.Feedback>
          )}
          <Button
            onClick={() => router.push(`/chat/${email}`)}
            style={{ marginTop: "10px" }}
            color="#3f6600"
            disabled={!isValidEmail}
          >
            Lets Chat!!!
          </Button>
        </LoginWrapper>
      </main>
    </>
  );
}