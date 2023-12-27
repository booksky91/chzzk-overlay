export interface Chat {
    uid: string;
    time: number;
    nickname: string;
    badges: string[];
    color: number | string;
    emojis: Record<string, string>;
    message: string;
}

export enum ChatCmd {
    PING = 0,
    PONG = 10000,
    CONNECT = 100,
    CONNECTED = 10100,
    REQUEST_RECENT_CHAT = 5101,
    RECENT_CHAT = 15101,
    CHAT = 93101
}
