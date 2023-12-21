"use client"

import { Fragment, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { clsx } from "clsx";
import { ChatEvent, ChzzkChat } from "chzzk";

const emojiRegex = /{:([a-zA-Z0-9_]+):}/g;

export default function Chat({ chatChannelId, accessToken }) {
  const [chats, setChats] = useState([]);
  const searchParams = useSearchParams();
  const small = searchParams.has("small");

  function onChat(chat: ChatEvent) {
    setChats((prevChats) => {
      const id = `${chat.profile.userIdHash}-${chat.time}`;
      const nickname = chat.profile.nickname;
      const badges = chat.profile.activityBadges
        ?.filter((badge) => badge.activated)
        ?.map((badge) => ({ name: badge.title, src: badge.imageUrl })) || [];
      const emojis = chat.extras.emojis || {};
      const message = chat.message;

      const newChats = prevChats.concat([
        {
          id,
          badges,
          nickname,
          emojis,
          message,
        },
      ]);

      if (newChats.length > 50) {
        newChats.splice(0, newChats.length - 50);
      }

      return newChats;
    });
  }

  useEffect(() => {
    const chzzkChat = ChzzkChat.fromAccessToken(chatChannelId, accessToken);
    chzzkChat.on("chat", onChat.bind(this));
    chzzkChat.on("connect", () => chzzkChat.requestRecentChat(50));
    chzzkChat.connect();
  }, []);

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [chats]);

  return (
    <div id="log" className={clsx(small && "small")}>
      {chats.map((chat, index) => {
        const match = chat.message.match(emojiRegex);

        return (
          <div
            key={chat.id}
            data-from={chat.nickname}
            className={`chat-order-${index + 1}`} // Add class based on chat order
          >
            <span className="message">
              {match ? (
                <Fragment>
                  {chat.message.split(emojiRegex).map((part: string, i: number) => {
                    if (i % 2 == 0) {
                      return part;
                    } else {
                      const src = chat.emojis[part];
                      return (
                        <span key={i} className="emote_wrap">
                          <img alt={`{:${part}:}`} className="emoticon" src={src} />
                        </span>
                      );
                    }
                  })}
                </Fragment>
              ) : (
                chat.message
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
