// src/components/Messages/index.tsx
import React from "react";
// import Avatar from 'react-avatar';
import { Comment } from "@ant-design/compatible";
import styled from "styled-components";

const Wrapper = styled.div`
  height: 60vh;
  width: 800px;
  padding: 0 30px;
  overflow: auto;
`;

const SelfMesssage = styled.div`
  display: flex;
  justify-content: flex-end;
  .self-message {
    color: #ffffff;
    background-color: #108ee9;
    border-radius: 10px;
    padding: 10px;
    margin-top: 10px;
    box-shadow: 0 4px 8px rgba(16, 142, 233, 0.2), 0 8px 16px rgba(16, 142, 233, 0.3); /* Add more intense box shadow */
  }
`;

interface iMessage {
  messages?: any[];
  currentUser?: string;
}

const Messages: React.FC<iMessage> = ({ messages, currentUser }) => {
  if (messages && messages?.length >= 1) {
    return (
      <Wrapper>
        {messages.map((message, id) => {
          
          if (message.sender === currentUser) {
            return (
              <SelfMesssage key={id}>
                <div className="self-message">{message.message}</div>
              </SelfMesssage>
            );
          }
          return (
            <Comment
              key={id}
              author={<a>{message.sender?.split("@")[0]}</a>}
              avatar={`https://ui-avatars.com/api/?name=${message.sender?.split("@")[0]}`}
              content={<p>{message.message}</p>}
            />
          );
        })}
      </Wrapper>
    );
  }
  return (
    <Wrapper>
    </Wrapper>
  );
};

export { Messages };