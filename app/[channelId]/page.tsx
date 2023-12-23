import ChatBox from "./ChatBox"
import {notFound} from "next/navigation"

export const dynamic = "force-dynamic"

export default async function ChatPage({params: {channelId}}) {
    const {signal} = new AbortController()
    var chatOrder = 1

    const chatChannelId = await fetch(
        `https://api.chzzk.naver.com/polling/v1/channels/${channelId}/live-status`,
        {signal}
    ).then(r => r.json()).then(data => data['content']?.['chatChannelId'])

    if (!chatChannelId) return notFound()

    const accessToken = await fetch(
        `https://comm-api.game.naver.com/nng_main/v1/chats/access-token?channelId=${chatChannelId}&chatType=STREAMING`,
        {signal}
    ).then(r => r.json()).then(data => data['content']['accessToken'])

    return (
        <ChatBox chatChannelId={chatChannelId} accessToken={accessToken} chatOrder={chatOrder}/>
    )
    chatOrder = chatOrder + 1
}
