export interface Probes {
    Int64: number;
    Valid: boolean;
}

export interface BroadcastProbes {
    Int64: number;
    Valid: boolean;
}

export interface DirectProbes {
    Int64: number;
    Valid: boolean;
}

export interface Client {
    client_mac: string;
    ap_mac: string;
    ap_channel: number;
    data: number;
    broadcast_probes: BroadcastProbes;
    direct_probes: DirectProbes;
    last_seen: string;
}

export interface APResult {
    ssid: string;
    bssid: string;
    encryption: number;
    hidden: number;
    wps: number;
    channel: number;
    signal: number;
    data: number;
    last_seen: number;
    probes: Probes;
    clients: Client[];
}

export interface ReconResult {
    APResults: APResult[];
    OutOfRangeClientResults?: any;
    UnassociatedClientResults?: any;
}

