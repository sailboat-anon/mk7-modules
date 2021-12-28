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

export interface StatusRootObject {
    header: Header;
    messages: Message[];
}