/** mindustry.game.Waves */
declare class Waves {}


/** mindustry.game.Rules */
declare class Rules {}
/** mindustry.game.CampaignRules */
declare class CampaignRules {}
/** mindustry.game.Difficulty */
declare class Difficulty {
    static readonly casual: Difficulty;
    static readonly easy: Difficulty;
    static readonly normal: Difficulty;
    static readonly hard: Difficulty;
    static readonly eradication: Difficulty;

    name: string
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


/** mindustry.game.conditions */
interface UnlockCondition {
    complete(): boolean
    display(): string
    build(tb: Table): void
}
/** mindustry.game.Research */
declare class Research implements UnlockCondition {
    content: UnlockableContent;

    constructor()
    constructor(ct: UnlockableContent)
}
interface Research extends UnlockCondition {}
/** mindustry.game.Produce */
declare class Produce implements UnlockCondition {
    content: UnlockableContent;

    constructor()
    constructor(ct: UnlockableContent)
}
interface Produce extends UnlockCondition {}
/** mindustry.game.OnPlanet */
declare class OnPlanet implements UnlockCondition {
    planet: Planet;

    constructor()
    constructor(pla: Planet)
}
interface OnPlanet extends UnlockCondition {}
/** mindustry.game.OnSector */
declare class OnSector implements UnlockCondition {
    preset: SectorPreset;

    constructor()
    constructor(sec: SectorPreset)
}
interface OnSector extends UnlockCondition {}
/** mindustry.game.SectorComplete */
declare class SectorComplete implements UnlockCondition {
    preset: SectorPreset;

    constructor()
    constructor(sec: SectorPreset)
}
interface SectorComplete extends UnlockCondition {}


/** mindustry.game.objectives.MapObjectives */
declare class MapObjectives implements Iterable<MapObjectives.MapObjective>, Eachable<MapObjectives.MapObjective> {}
/** mindustry.game.objectives.MapObjective */
declare class MapObjective implements AllowSerialization {}
interface MapObjective extends AllowSerialization {}
/** mindustry.game.objectives.ResearchObjective */
declare class ResearchObjective extends MapObjective {}
/** mindustry.game.objectives.ProduceObjective */
declare class ProduceObjective extends MapObjective {}
/** mindustry.game.objectives.ItemObjective */
declare class ItemObjective extends MapObjective {}
/** mindustry.game.objectives.CoreItemObjective */
declare class CoreItemObjective extends MapObjective {}
/** mindustry.game.objectives.BuildCountObjective */
declare class BuildCountObjective extends MapObjective {}
/** mindustry.game.objectives.UnitCountObjective */
declare class UnitCountObjective extends MapObjective {}
/** mindustry.game.objectives.DestroyUnitsObjective */
declare class DestroyUnitsObjective extends MapObjective {}
/** mindustry.game.markers.TimerObjective */
declare class TimerObjective extends MapObjective {}
/** mindustry.game.objectives.DestroyBlockObjective */
declare class DestroyBlockObjective extends MapObjective {}
/** mindustry.game.objectives.DestroyBlocksObjective */
declare class DestroyBlocksObjective extends MapObjective {}
/** mindustry.game.objectives.CommandModeObjective */
declare class CommandModeObjective extends MapObjective {}
/** mindustry.game.objectives.FlagObjective */
declare class FlagObjective extends MapObjective {}
/** mindustry.game.objectives.DestroyCoreObjective */
declare class DestroyCoreObjective extends MapObjective {}

/** mindustry.game.markers.ObjectiveMarker */
declare class ObjectiveMarker implements Json.JsonSerializable {}
interface ObjectiveMarker extends Json.JsonSerializable {}
/** mindustry.game.markers.PosMarker */
declare class PosMarker extends ObjectiveMarker {}
/** mindustry.game.markers.ShapeMarker */
declare class ShapeTextMarker extends PosMarker {}
/** mindustry.game.markers.PointMarker */
declare class PointMarker extends PosMarker {}
/** mindustry.game.markers.ShapeMarker */
declare class ShapeMarker extends PosMarker {}
/** mindustry.game.markers.TextMarker */
declare class TextMarker extends PosMarker {}
/** mindustry.game.markers.LineMarker */
declare class LineMarker extends PosMarker {}
/** mindustry.game.markers.TextureMarker */
declare class TextureMarker extends PosMarker {}
/** mindustry.game.markers.QuadMarker */
declare class QuadMarker extends ObjectiveMarker {}
/** mindustry.game.markers.LightMarker */
declare class LightMarker extends PosMarker {}
/** mindustry.game.markers.TextureHolder */
declare class TextureHolder implements Json.JsonSerializable {
    value: Object;
}
interface TextureHolder extends Json.JsonSerializable {}
/** mindustry.game.markers.MapMarkers */
declare class MapMarkers implements Iterable<MapObjectives.ObjectiveMarker> {}
interface MapMarkers extends Iterable<MapObjectives.ObjectiveMarker> {}
