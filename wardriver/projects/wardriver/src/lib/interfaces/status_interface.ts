export interface Header {
    objid: string;
    datetime: string;
    msg: string;
}

export interface Message {
    type: string;
    datetime: string;
    msg: string;
}

export interface RootObject {
    header: Header;
    messages: Message[];
}