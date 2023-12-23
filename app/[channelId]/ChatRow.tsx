import {Fragment, memo} from "react"

export interface Badge {
    name: string;
    src: string;
}

export interface Chat {
    uuid: string;
    emojis: Record<string, string>;
    order: number;
    message: string;
}

const emojiRegex = /{:([a-zA-Z0-9_]+):}/g

function ChatRow(props: Chat) {
    const {emojis, order, message} = props
    const match = message.match(emojiRegex)

    return (
        <div class={clsx(order % 2 === 0 && "even", order % 2 !== 0 && "odd")}>
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
