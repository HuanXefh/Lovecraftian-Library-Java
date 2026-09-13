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
    static terrestrial: number;
    static space: number;
    static underwater: number;
    static spores: number;
    static scorching: number;
    static groundOil: number;
    static groundWater: number;
    static oxygen: number;
    static any: number;
    static none: number;
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
