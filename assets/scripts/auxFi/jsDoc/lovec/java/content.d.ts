/** lovec.content.LCContentUpdater */
declare class LCContentUpdater<T> {
    constructor(target: T)
}
/** lovec.content.LCBuildUpdater */
declare class LCBuildUpdater<T, K> extends LCContentUpdater<T> {
    constructor(b: T)
}


/** lovec.content.SLCCraftingHandler */
declare class SLCCraftingHandler {
    static addLiquid(b: Buliding, b_f: Building|null, liq: Liquid, rate: number, forced?: boolean, returnFrac?: boolean, noDelta?: boolean): number
    static addLiquidBatch(b: Building, b_f: Building|null, liq: Liquid, amt: number, forced?: boolean, returnFrac?: boolean): number
    static transLiquid(b:, Building, b_t: Building|null, liq: Liquid, rate: number, forced?: boolean)
}
