/** See {@link BLK_baseBlock}. */
type JSONConfigObject = Object
/** Starts with "CONFIG: ". See {@link BLK_baseBlock}. */
type JSONConfigString = string


/** See {@link BLK_crop}. */
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
    drawF?: CFunction<Building>;
    /** Called when this crop updates. */
    updateScr?: CFunction<Building>;
    /** Called when this crop is harvested. */
    harvestScr?: CFunction<Building>;
    /** Called when this crop gets destroyed. */
    destroyScr?: CFunction<Building>;
}


/** See {@link ENV_baseTree}. */
type TreeData = {
    scl?: number;
    mag?: number;
    wob?: number;
    attrsF?: F0Function<Array<AttrGn>>;
}


type LootUnit = Unit&{
    type: UNITLootUnit;
}
