"use client";

import Image from "next/image";
import { useChat } from "ai/react";
import styles from "./page.module.css";
import { useRef, useEffect } from "react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const scrollMeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollMeRef.current) {
      scrollMeRef.current.scrollIntoView();
    }
  }, [messages]);

  return (
    <main className={styles.main}>
      <div className={styles.messages}>
        {messages.length === 0 ? (
          <div className={styles.banner}>
            <div>
              <Image src="/brushy.gif" alt="Brushy" width={100} height={100} />
            </div>
            <div>Ask me about artists and artworks on Artsy</div>
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <div key={m.id} className={styles.message}>
                <div className={styles.role}>
                  {m.role === "user" ? "You" : "Artsy"}
                </div>
                <div className={styles.content}>{m.content}</div>
              </div>
            ))}

            <div ref={scrollMeRef}>
              {/* invisible element that will be scrolled into view as `messages` gets updated */}
            </div>
          </>
        )}
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.userInput}
          value={input}
          placeholder="Chat with Artsy"
          onChange={handleInputChange}
        />
      </form>
    </main>
  );
}
