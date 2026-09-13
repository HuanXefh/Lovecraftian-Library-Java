/** `ROW`: target, amt. */
type RecipeIo2Array = F2Array<ContentGn|Array<Object>, number>
/** `ROW`: target, amt, p. */
type RecipeIo3Array = F3Array<ContentGn|Array<Object>, number, number>
/** `ROW`: target, amt, p, mtp. */
type RecipeIo4Array = F4Array<ContentGn, number, number, number>
type RecipeIoArray = RecipeIo2Array|RecipeIo3Array|RecipeIo4Array


type RecipeModule = {
    rc: RecipeRC;
}
type RecipeRC = {
    base: RecipeBase;
    /** `ROW`: header, rcObj. */
    recipe: F2Array<string, RecipeObject>;
}
type RecipeBase = {
    baseAttr?: string;
    baseAttrMin?: number;
    baseAttrMax?: number;
    baseAttrBoostScl?: number;
    baseAttrBoostCap?: number;
    baseCi?: RecipeIo2Array;
    baseBi?: RecipeIo3Array;
    baseAux?: RecipeIo2Array;
    baseOpt?: RecipeIo4Array;
    basePayi?: RecipeIo2Array;
    baseCo?: RecipeIo2Array;
    baseBo?: RecipeIo3Array;
    baseFo?: RecipeIo3Array;
    basePayo?: RecipeIo2Array;
    baseUpdateScr?: CFunction<Building>;
    baseRunScr?: CFunction<Building>;
    baseCraftScr?: CFunction<Building>;
    baseStopScr?: CFunction<Building>;
}
type RecipeObject = {
    /** Content icon used. */
    icon?: string;
    /** Tint color of icon. */
    tint?: Color;
    /** Key item/fluid of this recipe. For auto-selection. */
    keyCt?: Plural<ContentGn>;
    /** Category this recipe is in. */
    category?: string;
    /** Text description of this recipe. */
    tooltip?: BundlePiece;
    /**
     * Whether this recipe is created through recipe generation.
     * @internal
     */
    isGenerated?: boolean;
    /**
     * Whether there are missing contents in this recipe.
     * @internal
     */
    isIncomplete?: boolean;
    /**
     * Missing contents.
     * @internal
     */
    erroredNames?: Array<string>;
    /** Whether this recipe is available right row. */
    validCheck?: FFunction<Building, boolean>;
    /** Recipe is locked until all these contents are unlocked. */
    lockedBy?: Array<ContentGn>;
    /** Multiplier on craft time. */
    timeScl?: number;
    /** Extra block pollution. */
    pollution?: number;
    /** If true, the crafter will remain active even when full of output item. */
    ignoreItemFullness?: boolean;
    /** Requirement of vanilla heat. Incompatible with production. */
    erekirHeatReq?: number;
    /** Production amount of vanilla heat. Incompatible with consumption. */
    erekirHeatProd?: number;
    /** Attribute required. */
    attr?: string;
    /** Attribute sum for 0% efficiency. */
    attrMin?: number;
    /** Attribute sum for 100% efficiency. */
    attrMax?: number;
    /** Extra multiplier on final attribute efficiency. */
    attrBoostScl?: number;
    /** Maximum attribute efficiency. */
    attrBoostCap?: number;
    /** Multiplier on power production amount. For {@link BLK_generatorRecipeFactory}. */
    powProdMtp?: number;
    /** Temperature required for this recipe. For {@link BLK_furnaceRecipeFactory}. */
    tempReq?: number;
    /** Temperature above which efficiency decreases. For {@link BLK_furnaceRecipeFactory}. */
    tempAllowed?: number;
    /** Multiplier on durability decrease rate. For {@link BLK_durabilityRecipeFactory}. */
    durabDecMtp?: number;

    /** Continuous input. */
    ci?: RecipeIo2Array;
    /** Batch input. */
    bi?: RecipeIo3Array;
    /** Auxiliary input. */
    aux?: RecipeIo2Array;
    /** If true, at least one optional input should exist for the crafter to run. */
    reqOpt?: boolean;
    /** Optional input. */
    opt?: RecipeIo4Array;
    /** Payload input. */
    payi?: RecipeIo2Array;

    /** Continuous output. */
    co?: RecipeIo2Array;
    /** Batch output. */
    bo?: RecipeIo3Array;
    /** Chance to fail this recipe. */
    failP?: number;
    /** Failed output. */
    fo?: RecipeIo3Array;
    /** Payload output. */
    payo?: RecipeIo2Array;

    /** Called when this crafter updates. */
    updateScr?: CFunction<Building>;
    /** Called when this crafter is active. */
    runScr?: CFunction<Building>;
    /** Called when this crafter crafts. */
    craftScr?: CFunction<Building>;
    /** Called when this crafter has run before and is inactive now. */
    stopScr?: CFunction<Building>;
    /** Called when this crafter failed its recipe. */
    failScr?: CFunction<Building>;

    /** Effect used when this crafter failed its recipe. */
    failEff?: Effect;
    /** Drawer for this recipe. Should be used in combination with "DrawRecipe" in {@link TP_drawer}. */
    drawer?: DrawBlock;
}
