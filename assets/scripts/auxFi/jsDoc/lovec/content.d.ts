/** See {@link BLK_baseBlock}. */
type JSONConfigObject = Object
/** Starts with "CONFIG: ". See {@link BLK_baseBlock}. */
type JSONConfigString = string


/** See {@link BLK_baseBlock#ex_addLogicControl}. */
type LogicControlFunction = (b: Building, param1?: Object, param2?: Object, param3?: Object, param4?: Object) => void


/** See {@link BLK_crop#cropData}. */
type CropData = {
    /** Duration of this stage. */
    dur: number;
    /** Item produced when harvested, null if not harvestable. */
    item?: ItemGn;
    /** Amount of items produced. */
    amt?: number;
    /** Chance to produce each item. */
    p?: number;
    /** Stage to move back to after being harvested. */
    stageTo?: number;
    /** Visual radius of this crop. */
    rad?: number;
    /** Whether this crop can hide units like a tree. */
    hidable?: boolean;
    /** Whether the sprite does not wobble. */
    static?: boolean;
    /** Wobble time scaling. */
    scl?: number;
    /** Wobble magnitude. */
    mag?: number;
    /** Wobble range. */
    wob?: number;
    /** Z-layer. */
    z?: number;
    /** shadow offset. */
    offSha?: number;
    /** How to draw the crop. */
    drawF?: CFunction<BCrop>;
    /** Called when this crop updates. */
    updateScr?: CFunction<BCrop>;
    /** Called when this crop is harvested. */
    harvestScr?: CFunction<BCrop>;
    /** Called when this crop gets destroyed. */
    destroyScr?: CFunction<BCrop>;
}


type ConstructionRawData = D2Array<(string|BlockGn)|(Tup2<string|BlockGn, number>)>
type ConstructionUnitaryData = {
    blk: Block;
    rot: number;
}
type ConstructionParsedData = D2Array<ConstructionUnitaryData>
/** `TUP`: blk, t, rot. */
type ConstructionPlan = F3Array<Block, Tile, number>


/** See {@link DB_env.db.grpParam.tree}. */
type TreeData = {
    scl?: number;
    mag?: number;
    wob?: number;
    attrsF?: F0Function<Array<AttrGn>>;
}


type LootUnit = Unit&{
    type: UNITLootUnit;
}
