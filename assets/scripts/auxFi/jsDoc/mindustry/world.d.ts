/** mindustry.world.Tile */
declare class Tile {}
/** mindustry.world.editor.EditorTile */
declare class EditorTile extends Tile {}


/** mindustry.world.ColorMapper */
declare class ColorMapper {
    static get(rawColor: number): Block
}


/** mindustry.world.Edges */
declare class Edges {
    static getFacingEdge(b: Building, ob: Building): Tile
    static getFacingEdge(t: Tile, ot: Tile): Tile
    static getFacingEdge(blk: Block, tx: number, ty: number, ot: Tile): Tile
    static getPixelPolygon(rad: number): Array<Vec2>
    static getEdges(size: number): Array<Point2>
    static getInsideEdges(size: number): Array<Point2>
}


/** mindustry.world.Build */
declare class Build {
    static validPlace(blk: Block, team: Team, tx: number, ty: number, rot: number, checkVisible?: boolean, checkCoreRad?: boolean): boolean
    static checkNoUnitOverlap(blk: Block, tx: number, ty: number): boolean
    static validPlaceIgnoreUnits(blk: Block, team: Team, tx: number, ty: number, rot: number, checkVisible: boolean, checkCoreRad: boolean): boolean
    static getEnemyOverlap(blk: Block, team: Team, tx: number, ty: number): Building|null
    static contactsGround(tx: number, ty: number, blk: Block): boolean
    static contactsShallows(tx: number, ty: number, blk: Block): boolean
    static validBreak(team: Team, tx: number, ty: number): boolean
}


/** mindustry.world.ItemBuffer */
declare class ItemBuffer {}
/** mindustry.world.DirectionalItemBuffer */
declare class DirectionalItemBuffer {}


/** mindustry.world.meta.Attribute */
declare class Attribute {
    static heat: Attribute;
    static spores: Attribute;
    static water: Attribute;
    static oil: Attribute;
    static light: Attribute;
    static sand: Attribute;
    static steam: Attribute;

    static get(name: string): Attribute
    static getOrNull(name: string): Attribute|null
    static exists(name: string): boolean
    static add(name: string): Attribute
}


/** mindustry.world.meta.Env */
declare class Env {
    static readonly terrestrial: Env;
    static readonly space: Env;
    static readonly underwater: Env;
    static readonly spores: Env;
    static readonly scorching: Env;
    static readonly groundOil: Env;
    static readonly groundWater: Env;
    static readonly oxygen: Env;
    static readonly any: Env;
    static readonly none: Env;

    /** @deprecated Added in v9. */
    readonly id: number;
    /** @deprecated Added in v9. */
    readonly name: string;

    /** @deprecated Added in v9. */
    static get(name: string): Env|null
}


/**
 * mindustry.world.meta.Environments
 * @deprecated Added in v9.
 */
declare class Environments {
    static readonly none: Environments;
    static readonly any: Environments;

    static of(...envs: Array<Env>): Environments
    static of(...envSets: Array<Environments>): Environments
    static fromBits(legacyInt: number): Environments

    with(env: Env): Environments
    with(envSet: Environments): Environments
    without(env: Env): Environments
    without(envSet: Environments): Environments
    has(env: Env): boolean
    isEmpty(): boolean
    isAny(): boolean
    containsAny(envSet: Environments): boolean
    containsAll(envSet: Environments): boolean
    each(cons: Cons<Env>): void
}


/** mindustry.world.meta.BlockFlag */
declare class BlockFlag {
    static core: BlockFlag;
    static storage: BlockFlag;
    static generator: BlockFlag;
    static turret: BlockFlag;
    static factory: BlockFlag;
    static repair: BlockFlag;
    static battery: BlockFlag;
    static reactor: BlockFlag;
    static extinguisher: BlockFlag;
    static drill: BlockFlag;
    static shield: BlockFlag;

    static launchPad: BlockFlag;
    static unitCargoUnloadPoint: BlockFlag;
    static unitAssembler: BlockFlag;
    static hasFogRadius: BlockFlag;
    static steamVent: BlockFlag;
    static blockRepair: BlockFlag;
    static synced: BlockFlag;
}
/** mindustry.world.meta.BlockGroup */
declare class BlockGroup {
    static none: BlockGroup;
    static walls: BlockGroup;
    static projectors: BlockGroup;
    static turrets: BlockGroup;
    static transportation: BlockGroup;
    static power: BlockGroup;
    static liquids: BlockGroup;
    static drills: BlockGroup;
    static units: BlockGroup;
    static logic: BlockGroup;
}
/** mindustry.world.meta.BlockStatus */
declare class BlockStatus {
    static active: BlockStatus;
    static noOutput: BlockStatus;
    static noInput: BlockStatus;
    static logicDisable: BlockStatus;
    static inactive: BlockStatus;
    static inactiveUnitFactory: BlockStatus;
}
/** mindustry.world.meta.BuildVisibility */
declare class BuildVisibility {
    static hidden: BuildVisibility;
    static shown: BuildVisibility;
    static debugOnly: BuildVisibility;
    static editorOnly: BuildVisibility;
    static coreZoneOnly: BuildVisibility;
    static worldProcessorOnly: BuildVisibility;
    static sandboxOnly: BuildVisibility;
    static campaignOnly: BuildVisibility;
    static lightingOnly: BuildVisibility;
    static fogOnly: BuildVisibility;
}
