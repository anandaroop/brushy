"use client";

import { useState } from "react";
import { useUIState, useActions } from "ai/rsc";
import type { AI } from "./action";
import style from "./page.module.css";
import Image from "next/image";

export default function Page() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions<typeof AI>();

  return (
    <main className={style.main}>
      <div className={style.messages}>
        {messages.length === 0 ? (
          <div className={style.banner}>
            <div>
              <Image src="/brushy.gif" alt="Brushy" width={100} height={100} />
            </div>
            <div>Ask me about artists and artworks on Artsy</div>
          </div>
        ) : (
          // View messages in UI state
          messages.map((message) => {
            return (
              <div key={message.id} className={style.message}>
                {message.display}
              </div>
            );
          })
        )}
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          // Add user message to UI state
          setMessages((currentMessages) => [
            ...currentMessages,
            {
              id: Date.now(),
              display: <div>{inputValue}</div>,
            },
          ]);

          // Submit and get response message
          const responseMessage = await submitUserMessage(inputValue);
          setMessages((currentMessages) => [
            ...currentMessages,
            responseMessage,
          ]);

          setInputValue("");
        }}
      >
        <input
          className={style.userInput}
          placeholder="Chat with Artsy"
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value);
          }}
        />
      </form>
    </main>
  );
}
