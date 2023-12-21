"use client"

import {Fragment, useEffect, useState} from "react"
import {useSearchParams} from "next/navigation"
import {clsx} from "clsx"
import {ChatEvent, ChzzkChat} from "chzzk"

const emojiRegex = /{:([a-zA-Z0-9_]+):}/g

export default function Chat({chatChannelId, accessToken}) {
    const [chats, setChats] = useState([])
    const [chatOrder, setChatOrder] = useState(1); // Move chatOrder outside of the component

    const searchParams = useSearchParams()
    const small = searchParams.has("small")

    function onChat(chat: ChatEvent) {
        const id = `${chat.profile.userIdHash}-${chat.time}`
        const badges = chat.profile.activityBadges
            ?.filter(badge => badge.activated)
            ?.map(badge => ({name: badge.title, src: badge.imageUrl})) || []
        const emojis = chat.extras.emojis || {}
        const message = chat.message
        const order = chatOrder

        setChats((prevState) => {
            const newChats = prevState.concat([{
                id,
                badges,
                emojis,
                message,
                order
            }])

            if (newChats.length > 50) {
                newChats.splice(0, newChats.length - 50)
            }

            return newChats
        })

        setChatOrder((chatOrder) => chatOrder + 1);
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
            {chats.map(chat => {
                const match = chat.message.match(emojiRegex)

                return (
                    <div key={chat.id} className={`chat-order-${chat.order}`}>
                        <span className="message">
                            {match ? (
                                <Fragment>
                                    {chat.message.split(emojiRegex).map((part: string, i: number) => {
                                        if (i % 2 == 0) {
                                            return part
                                        } else {
                                            const src = chat.emojis[part]
                                            return (
                                                <span key={i} className="emote_wrap">
                                                    <img alt={`{:${part}:}`} className="emoticon" src={src}/>
                                                </span>
                                            )
                                        }
                                    })}
                                </Fragment>
                            ) : (
                                chat.message
                            )}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}
