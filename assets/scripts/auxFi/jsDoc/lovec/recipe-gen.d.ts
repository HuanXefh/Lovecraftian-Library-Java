type RecipeMetaObject = {
    objF?: CFunction<RecipeObject>

    amt?: number;
    p?: number;
    amtI?: number;
    pI?: number;
    amtO?: number;
    pO?: number;
    payAmt?: number;
    payAmtI?: number;
    payAmtO?: number;
    heatOScl?: number;
    time?: number;

    target?: ContentGn;
    mode?: string;
    tier?: number;

    sizeCap?: number;
    maxTemp?: number;
    maxFlam?: number;
    tempGap?: number;
    minHardness?: number;
    maxHardness?: number;
    abrasionFactor?: number;

    includeItem?: boolean;
    includeLiquid?: boolean;
    includeGas?: boolean;
    fuelType?: ENumber;
    noSawdust?: boolean;
    noAggregateConvert?: boolean;

    isItemFilter?: boolean;
    isBallMill?: boolean;
    isGasReactor?: boolean;
    isConcentrate?: boolean;
}


type RecipeParamObject = {
    category?: string;
    tag?: string;

    icon?: string;
    tint?: Color;
    keyCt?: Plural<ContentGn>;
    validCheck?: FFunction<Building, boolean>;
    lockedBy?: Array<ContentGn>;
    timeScl?: number;
    pollution?: number;
    ignoreItemFullness?: boolean;
    erekirHeatI?: number;
    erekirHeatO?: number;
    attr?: string;
    attrMin?: number;
    attrMax?: number;
    attrBoostScl?: number;
    attrBoostCap?: number;
    tooltip?: BundlePiece;
    tempReq?: number;
    tempAllowed?: number;

    liqI?: LiquidGn;
    itemI?: ItemGn;
    payI?: BlockGn|UnitTypeGn;
    liqO?: LiquidGn;
    itemO?: ItemGn;
    payO?: BlockGn|UnitTypeGn;

    liqIMapper?: FFunction<UnlockableContent, LiquidGn>;
    itemIMapper?: FFunction<UnlockableContent, ItemGn>;
    payIMapper?: FFunction<UnlockableContent, BlockGn|UnitTypeGn>;
    liqOMapper?: FFunction<UnlockableContent, LiquidGn>;
    itemOMapper?: FFunction<UnlockableContent, ItemGn>;
    payOMapper?: FFunction<UnlockableContent, BlockGn|UnitTypeGn>;

    ci?: RecipeIo2Array;
    payCi?: RecipeIo2Array;
    bi?: RecipeIo3Array;
    liqBi?: RecipeIo3Array;
    payBi?: RecipeIo3Array;
    aux?: RecipeIo2Array;
    payAux?: RecipeIo2Array;
    payi?: RecipeIo2Array;
    co?: RecipeIo2Array;
    payCo?: RecipeIo2Array;
    bo?: RecipeIo3Array;
    liqBo?: RecipeIo3Array;
    payBo?: RecipeIo3Array;
    payo?: RecipeIo2Array;
    heatO?: number;

    amtI?: number;
    payAmtI?: number;
    amtIScl?: number;
    amtO?: number;
    payAmtO?: number;
    amtOScl?: number;
}


type RecipeGroupData = {
    amtScl?: number;
    pScl?: number;
}


/** `ROW`: nameCt, paramObj. */
type RecipeRawData2Array = F2Array<string, RecipeParamObject>
/** `ROW`: nameCt, num. */
type RecipeRawDataNumberArray = F2Array<string, number>
