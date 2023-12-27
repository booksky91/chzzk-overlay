import {Fragment, memo} from "react"
import {nicknameColors} from "../chat/constants"
import {Chat} from "../chat/types"

const emojiRegex = /{:([a-zA-Z0-9_]+):}/g

function ChatRow(props: Chat) {
    const {nickname, badges, color, emojis, message} = props
    const match = message.match(emojiRegex)

    return (
        <div data-from={nickname}>
            <span className="message">
                {match ? message.split(emojiRegex).map((part, i) => (
                    <Fragment key={i}>
                        {i % 2 == 0 ? part : <span className="emote_wrap">
                            <img className="emoticon" alt={`{:${part}:}`} src={emojis[part]}/>
                        </span>}
                    </Fragment>
                )) : message}
            </span>
        </div>
    )
}

export default memo(ChatRow)
