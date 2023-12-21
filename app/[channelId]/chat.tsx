"use client"

import {Fragment, useEffect, useState} from "react"
import {useSearchParams} from "next/navigation"
import {clsx} from "clsx"
import {ChatEvent, ChzzkChat} from "chzzk"

const colors = [
    "rgb(219, 74, 63)",
    "rgb(95, 158, 160)",
    "rgb(218, 165, 32)",
    "rgb(0, 255, 127)",
    "rgb(180, 84, 255)",
    "rgb(30, 144, 255)"
]

const emojiRegex = /{:([a-zA-Z0-9_]+):}/g

export default function Chat({chatChannelId, accessToken}) {
    const [chats, setChats] = useState([])

    const searchParams = useSearchParams()
    const small = searchParams.has("small")

    function onChat(chat: ChatEvent) {
        const id = `${chat.profile.userIdHash}-${chat.time}`
        const nickname = chat.profile.nickname
        const color = nickname.split("")
            .map(c => c.charCodeAt(0))
            .reduce((a, b) => a + b, 0) % colors.length
        const badges = chat.profile.activityBadges
            ?.filter(badge => badge.activated)
            ?.map(badge => ({name: badge.title, src: badge.imageUrl})) || []
        const emojis = chat.extras.emojis || {}
        const message = chat.message

        setChats((prevState) => {
            const newChats = prevState.concat([{
                id,
                badges,
                color,
                nickname,
                emojis,
                message
            }])

            if (newChats.length > 50) {
                newChats.splice(0, newChats.length - 50)
            }

            return newChats
        })
    }

    useEffect(() => {
        const chzzkChat = ChzzkChat.fromAccessToken(chatChannelId, accessToken)
        chzzkChat.on("chat", onChat.bind(this))
        chzzkChat.on("connect", () => chzzkChat.requestRecentChat(50))
        chzzkChat.connect()
    }, [])

    useEffect(() => {
        window.scrollTo(0, document.body.scrollHeight)
    }, [chats])

    return (
        <div id="log" className={clsx(small && "small")}>
            {chats.map((chat, index) => {
                const match = chat.message.match(emojiRegex);

                // Determine if the chat is even or odd
                const isEvenChat = index % 2 === 0;
                const chatClasses = clsx("chat", isEvenChat && "even", !isEvenChat && "odd");

                return (
                    <div key={chat.id} className={chatClasses} data-from={chat.nickname}>
                        <span className="message">
                            {match ? (
                                <Fragment>
                                    {chat.message.split(emojiRegex).map((part, i) => {
                                        if (i % 2 === 0) {
                                            return part;
                                        } else {
                                            const src = chat.emojis[part];
                                            return (
                                                <span key={i} className="emote_wrap">
                                                    <img alt={`{:${part}:}`} className="emoticon" src={src}/>
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
