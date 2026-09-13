/** mindustry.game.EventType */
declare class EventType {}


/** mindustry.game.EventType$Trigger */
declare class Trigger {
    static shock: Trigger;
    static cannotUpgrade: Trigger;
    static fireCreate: Trigger;
    static openConsole: Trigger;
    static blastFreeze: Trigger;
    static impactPower: Trigger;
    static blastGenerator: Trigger;
    static shockwaveTowerUse: Trigger;
    static forceProjectorBreak: Trigger;
    static thoriumReactorOverheat: Trigger;
    static neoplasmReact: Trigger;
    static fireExtinguish: Trigger;
    static acceleratorUse: Trigger;
    static newGame: Trigger;
    static tutorialComplete: Trigger;
    static flameAmmo: Trigger;
    static resupplyTurret: Trigger;
    static turretCool: Trigger;
    static enablePixelation: Trigger;
    static exclusionDeath: Trigger;
    static suicideBomb: Trigger;
    static openWiki: Trigger;
    static teamCoreDamage: Trigger;
    static socketConfigChanged: Trigger;
    static update: Trigger;
    static beforeGameUpdate: Trigger;
    static afterGameUpdate: Trigger;
    static unitCommandChange: Trigger;
    static unitCommandPosition: Trigger;
    static unitCommandAttack: Trigger;
    static unitCommandBoost: Trigger;
    static importMod: Trigger;
    static draw: Trigger;
    static drawOver: Trigger;
    static preDraw: Trigger;
    static postDraw: Trigger;
    static uiDrawBegin: Trigger;
    static uiDrawEnd: Trigger;
    static universeDrawBegin: Trigger;
    static universeDraw: Trigger;
    static universeDrawEnd: Trigger;
}


declare class AtlasPackEvent {
    readonly multiPacker: MultiPacker;
}
declare class FileTreeInitEvent {}
declare class DisposeEvent {}
declare class ModContentLoadEvent {}
declare class ContentInitEvent {}
declare class ClientLoadEvent {}
declare class MusicRegisterEvent {}
declare class StateChangeEvent {
    readonly from: GameState.State;
    readonly to: GameState.State;
}


declare class WithdrawEvent {
    readonly tile: Building;
    readonly player: Player;
    readonly item: Item;
    readonly amount: number;
}
declare class DepositEvent {
    readonly tile: Building;
    readonly player: Player;
    readonly item: Item;
    readonly amount: number;
}
declare class TapEvent {
    readonly player: Player;
    readonly tile: Tile;
}
declare class ConfigEvent {
    readonly tile: Building;
    readonly player: Player;
    readonly value: Object;
}
declare class UnitControlEvent {
    readonly player: Player;
    readonly unit: Unit|null;
}
declare class UnitChangeEvent {
    readonly player: Player;
    readonly unit: Unit;
}
declare class PickupEvent {
    readonly carrier: Unit;
    readonly unit: Unit|null;
    readonly build: Building|null;
}
declare class PayloadDropEvent {
    readonly carrier: Unit;
    readonly unit: Unit|null;
    readonly build: Building|null;
}
declare class BuildingCommandEvent {
    readonly player: Player;
    readonly building: Building;
    readonly position: Vec2;
}


declare class UnlockEvent {
    readonly content: UnlockableContent;
}
declare class ResearchEvent {
    readonly content: UnlockableContent;
}
declare class BlockBuildBeginEvent {
    readonly tile: Tile;
    readonly team: Team;
    readonly unit: Unit|null;
    readonly breaking: boolean;
}
declare class BlockBuildEndEvent {
    readonly tile: Tile;
    readonly team: Team;
    readonly unit: Unit|null;
    readonly breaking: boolean;
    readonly config: Object|null;
}
declare class BuildRotateEvent {
    readonly build: Building;
    readonly unit: Unit|null;
    readonly previous: number;
}
declare class BuildSelectEvent {
    readonly tile: Tile;
    readonly team: Team;
    readonly builder: Unit;
    readonly breaking: boolean;
}
declare class BuildDamageEvent {
    build: Building;
    source: Bullet;
}
declare class BlockDestroyEvent {
    readonly tile: Tile;
}
declare class BuildingBulletDestroyEvent {
    build: Building;
    bullet: Bullet;
}
declare class GeneratorPressureExplodeEvent {
    build: Building;
}
declare class BuildTeamChangeEvent {
    previous: Team;
    build: Building;
}
declare class UnitCreateEvent {
    readonly unit: Unit;
    readonly spawner: Building|null;
    readonly spawnerUnit: Unit|null;
}
declare class UnitSpawnEvent {
    readonly unit: Unit;
}
declare class UnitUnloadEvent {
    readonly unit: Unit;
}
declare class UnitDamageEvent {
    unit: Unit;
    bullet: Bullet;
}
declare class UnitDestroyEvent {
    readonly unit: Unit;
}
declare class UnitBulletDestroyEvent {
    unit: Unit;
    bullet: Bullet;
}
declare class UnitDrownEvent {
    readonly unit: Unit;
}
declare class CoreChangeEvent {
    core: CoreBlock.coreBuild;
}
declare class BulletCreateEvent {
    bullet: Bullet;
}


declare class WinEvent {}
declare class LoseEvent {}
declare class GameOverEvent {
    readonly winner: Team;
}
declare class PlayEvent {}
declare class LineConfirmEvent {}
declare class BlockInfoEvent {}
declare class WaveEvent {}
declare class TurnEvent {}
declare class LaunchItemEvent {
    readonly stack: ItemStack
}
declare class SectorLaunchEvent {
    readonly sector: Sector;
}
declare class SectorLaunchLoadoutEvent {
    readonly sector: Sector;
    readonly loadout: Schematic;
}
declare class SectorLoseEvent {
    readonly sector: Sector;
}
declare class SectorInvasionEvent {
    readonly sector: Sector;
}
declare class SectorCaptureEvent {
    readonly sector: Sector;
    readonly initialCapture: boolean;
}


declare class ResizeEvent {}
declare class ResetEvent {}


declare class TilePreChangeEvent {
    tile: Tile;
}
declare class TileChangeEvent {
    tile: Tile;
}
declare class TileFloorChangeEvent {
    tile: Tile;
    previous: Floor;
    floor: Floor;
}
declare class TileOverlayChangeEvent {
    tile: Tile;
    previous: Floor;
    overlay: Floor;
}
declare class WorldLoadEvent {}
declare class WorldLoadBeginEvent {}
declare class WorldLoadEndEvent {}
declare class RulesLoadEvent {
    readonly rules: Rules;
    readonly fromSave: boolean;
}
declare class DataPatchLoadEvent {
    readonly assets: Seq<DataAsset>;
}
declare class TextureStreamEvent {
    readonly name: string;
}
declare class SaveLoadEvent {
    readonly isMap: boolean;
}
declare class SaveWriteEvent {}
declare class SchematicCreateEvent {
    readonly schematic: Schematic;
}
declare class MapMakeEvent {}
declare class MapPublishEvent {}


declare class HostEvent {}
declare class ClientCreateEvent {}
declare class ServerLoadEvent {}
declare class ClientPreConnectEvent {
    readonly host: Host;
}
declare class ClientServerConnectEvent {
    readonly ip: string;
    readonly port: number;
}
declare class ConnectionEvent {
    readonly connection: NetConnection;
}
declare class ConnectPacketEvent {
    readonly connection: NetConnection;
    readonly packet: Packets.ConnectPacket;
}
declare class PlayerConnectionConfirmed {
    readonly player: Player;
}
declare class PlayerJoin {
    readonly player: Player;
}
declare class PlayerConnect {
    readonly player: Player;
}
declare class PlayerLeave {
    readonly player: Player;
}
declare class PlayerBanEvent {
    readonly player: Player;
    readonly uuid: string;
}
declare class PlayerUnbanEvent {
    readonly player: Player;
    readonly uuid: string;
}
declare class PlayerIpBanEvent {
    readonly ip: string;
}
declare class PlayerIpUnbanEvent {
    readonly ip: string;
}
declare class PlayerChatEvent {
    readonly player: Player;
    readonly message: string;
}
declare class ClientChatEvent {
    readonly message: string;
}
declare class AdminRequestEvent {
    readonly player: Player;
    readonly other: Player|null;
    readonly action: Packets.AdminAction;
}
