/** mindustry.net.ServerGroup */
declare class ServerGroup {}


/** mindustry.net.Net */
declare class Net {}


/** mindustry.net.BeControl */
declare class BeControl {}


/** mindustry.net.Host */
declare class Host {
    readonly name: string;
    readonly address: string;
    readonly mapname: string;
    readonly description: string;
    readonly wave: number;
    readonly players: number;
    readonly playerLimit: number;
    readonly version: number;
    readonly versionType: string;
    readonly mode: Gamemode;
    readonly modeName: String|null;
    ping: number;
    port: number;

    constructor(ping: number, name: string, address: string, mapname: string, wave: number, players: number, version: number, versionType: string, mode: Gamemode, playerLimit: number, description: string, modeName: string)
    constructor(ping: number, name: string, address: string, port: number, mapname: string, wave: number, players: number, version: number, versionType: string, mode: Gamemode, playerLimit: number, description: string, modeName: string)
}
/** mindustry.net.NetConnection */
declare class NetConnection {}


/** mindustry.net.Packet */
declare class Packet {
    static readonly priorityLow: number;
    static readonly priorityNormal: number;
    static readonly priorityHigh: number;

    allow(isServer: boolean): boolean
    getPriority(): number

    handled(): void
    handleClient(): void
    handleServer(con: NetConnection): void

    write(wr: Writes): void
    read(rd: Reads, len?: number): void
}
/** mindustry.net.Streamable */
declare class Streamable extends Packet {
    stream: java.io.ByteArrayInputStream;
}
/** mindustry.net.Packets */
declare class Packets {}
declare namespace Packets {
    class KickReason {
        static readonly kick: KickReason;
        static readonly clientOutdated: KickReason;
        static readonly serverOutdated: KickReason;
        static readonly banned: KickReason;
        static readonly gameover: KickReason;
        static readonly recentKick: KickReason;
        static readonly nameInUse: KickReason;
        static readonly idInUse: KickReason;
        static readonly nameEmpty: KickReason;
        static readonly customClient: KickReason;
        static readonly serverClosed: KickReason;
        static readonly vote: KickReason;
        static readonly typeMismatch: KickReason;
        static readonly whitelist: KickReason;
        static readonly playerLimit: KickReason;
        static readonly serverRestarting: KickReason;

        readonly quiet: boolean;
    }
    class AdminAction {
        static kick: AdminAction;
        static ban: AdminAction;
        static trace: AdminAction;
        static wave: AdminAction;
        static switchTeam: AdminAction;
    }

    class Connect extends Packet {
        addressTCP: string;
    }
    class Disconnect extends Packet {
        reason: string;
    }
    class ConnectPacket extends Packet {
        version: number;
        versionType: string;
        mods: Seq<string>;
        name: string;
        locale: string;
        uuid: string;
        usid: string;
        mobile: boolean;
        color: number;
    }
    class StreamBegin extends Packet {
        id: number;
        total: number;
        type: java.lang.Byte;
        incrementalStream: java.io.InputStream|null;
    }
    class StreamChunk extends Packet {
        id: number;
        data: Array<java.lang.Byte>;
    }

    class WorldStream extends Streamable {}
    class TextureStream extends Streamable {}
    class AssetRequirementStream extends Streamable {}
    class AssetStream extends Streamable {}
}
