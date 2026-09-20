/** mindustry.game.Waves */
declare class Waves {}


/** mindustry.game.Rules */
declare class Rules {}
/** mindustry.game.CampaignRules */
declare class CampaignRules {}
/** mindustry.game.Difficulty */
declare class Difficulty {
    static casual: Difficulty;
    static easy: Difficulty;
    static normal: Difficulty;
    static hard: Difficulty;
    static eradication: Difficulty;

    enemyHealthMultiplier: number;
    enemySpawnMultiplier: number;
    waveTimeMultiplier: number;

    info(): string;
    localized(): string;
}


/** mindustry.game.Gamemode */
declare class Gamemode {
    static survival: Gamemode;
    static sandbox: Gamemode;
    static attack: Gamemode;
    static pvp: Gamemode;
    static editor: Gamemode;

    readonly hidden: boolean;

    apply(rule: Rules): Rules
    valid(map: mindustry.maps.Map): boolean
}
/** mindustry.game.GameStats */
declare class GameStats {
    enemyUnitsDestroyed: number;
    wavesLasted: number;
    buildingsBuilt: number;
    buildingsDeconstructed: number;
    buildingsDestroyed: number;
    unitsCreated: number;
    placedBlockCount: ObjectIntMap<Block>;
    destroyedBlockCount: ObjectIntMap<Block>;
    coreItemCount: ObjectIntMap<Item>;

    getPlaced(blk: Block): number
    getDestroyed(blk: Block): number
}


/** mindustry.game.Schematic */
declare class Schematic implements Publishable, java.lang.Comparable<Schematic> {}
interface Schematic extends Publishable, java.lang.Comparable<Schematic> {}
/** mindustry.game.Schematics */
declare class Schematics {}


/** mindustry.game.Team */
declare class Team implements java.lang.Comparable<Team>, Senseable {
    static derelict: Team;
    static sharded: Team;
    static crux: Team;
    static malis: Team;
    static green: Team;
    static blue: Team;
    static neoplastic: Team;

    static readonly all: Array<Team>;
    static readonly baseTeams: Array<Team>;

    readonly id: number;
    readonly color: Color;
    readonly palette: Array<Color>;
    readonly palettei: Array<number>;
    ignoreUnitCap: boolean;
    emoji: string;
    hasPalette: boolean;
    name: string;
}
interface Team extends java.lang.Comparable<Team>, Senseable {}
/** mindustry.game.Teams */
declare class Teams {}
declare namespace Teams {
    class TeamData {
        readonly team: Team;
        buildAi: BaseBuilderAI|null;
        rtsAi: RtsAI|null;
        coreEnemies: Array<Team>;
        plans: Queue<Teams.BlockPlan>;
        cores: Seq<CoreBlock.CoreBuild>;
        lastCore: CoreBlock.CoreBuild|null;
        buildingTree: QuadTree<Building>|null;
        turretTree: QuadTree<Building>|null;
        unitTree: QuadTree<Unit>|null;
        unitCap: number;
        unitCount: number;
        typeCounts: Array<number>|null;
        buildingTypes: ObjectMap<Block, Seq<Building>>;
        units: Seq<Unit>;
        players: Seq<Player>;
        buildings: Seq<Building>;
        unitsByType: Array<Seq<Unit>>;
    }
    class BlockPlan {
        readonly x: number;
        readonly y: number;
        readonly rotation: number;
        readonly block: Block;
        readonly config: Object;
        removed: boolean;
    }
}


/** mindustry.game.Universe */
declare class Universe {}


/** mindustry.game.FogControl */
declare class FogControl implements SaveFileReader.CustomChunk {}
interface FogControl extends SaveFileReader.CustomChunk {}


/** mindustry.game.MapObjectives */
declare class MapObjectives implements Iterable<MapObjectives.MapObjective>, Eachable<MapObjectives.MapObjective> {}
interface MapObjectives extends Iterable<MapObjectives.MapObjective>, Eachable<MapObjectives.MapObjective> {}
declare namespace MapObjectives {
    class MapObjective implements AllowSerialization {}
    interface MapObjective extends AllowSerialization {}
    class ResearchObjective extends MapObjective {}
    class ProduceObjective extends MapObjective {}
    class ItemObjective extends MapObjective {}
    class CoreItemObjective extends MapObjective {}
    class BuildCountObjective extends MapObjective {}
    class UnitCountObjective extends MapObjective {}
    class DestroyUnitsObjective extends MapObjective {}
    class TimerObjective extends MapObjective {}
    class DestroyBlockObjective extends MapObjective {}
    class DestroyBlocksObjective extends MapObjective {}
    class CommandModeObjective extends MapObjective {}
    class FlagObjective extends MapObjective {}
    class DestroyCoreObjective extends MapObjective {}

    class ObjectiveMarker implements Json.JsonSerializable {}
    interface ObjectiveMarker extends Json.JsonSerializable {}
    class PosMarker extends ObjectiveMarker {}
    class ShapeTextMarker extends PosMarker {}
    class PointMarker extends PosMarker {}
    class ShapeMarker extends PosMarker {}
    class TextMarker extends PosMarker {}
    class LineMarker extends PosMarker {}
    class TextureMarker extends PosMarker {}
    class QuadMarker extends ObjectiveMarker {}
    class LightMarker extends PosMarker {}

    class TextureHolder implements Json.JsonSerializable {}
    interface TextureHolder extends Json.JsonSerializable {}
}
/** mindustry.game.MapMarkers */
declare class MapMarkers implements Iterable<MapObjectives.ObjectiveMarker> {}
interface MapMarkers extends Iterable<MapObjectives.ObjectiveMarker> {}
