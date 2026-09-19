/** mindustry.world.blocks.power.PowerGraph */
declare class PowerGraph {
    readonly producers: Seq<Building>;
    readonly consumers: Seq<Building>;
    readonly batteries: Seq<Building>;
    readonly all: Seq<Building>;

    getID(): number

    getLastScaledPowerIn(): number
    getLastScaledPowerOut(): number
    getLastCapacity(): number
    getPowerBalance(): number
    hasPowerBalanceSamples(): boolean
    getLastPowerNeeded(): number
    getLastPowerProduced(): number
    getLastPowerStored(): number
    getSatisfaction(): number
    getPowerProduced(): number
    getPowerNeeded(): number
    getBatteryStored(): number
    getBatteryCapacity(): number
    getTotalBatteryCapacity(): number

    add(b: Building): void
    addGraph(graph: PowerGraph): void
    remove(b: Building): void
    clear(): void
}


/** mindustry.world.blocks.Autotiler */
interface Autotiler {}
declare namespace Autotiler {
    class SliceMode {
        static none: SliceMode;
        static bottom: SliceMode;
        static top: SliceMode;
    }
}
/** mindustry.world.blocks.TileBitmask */
declare class TileBitmask {
    static readonly values: JavaArray<java.lang.Integer>;

    static load(regStr: string): Array<TextureRegion>
    static loadVariants(regStr: string, variants: number): D2Array<TextureRegion>
}


/** mindustry.world.blocks.ItemSelection */
declare class ItemSelection {
    static buildTable(tb: Table, itemSeq: Seq<Item>, ctF: Prov<UnlockableContent>, cfgC: Cons<UnlockableContent>): void
    static buildTable(tb: Table, itemSeq: Seq<Item>, ctF: Prov<UnlockableContent>, cfgC: Cons<UnlockableContent>, closeSelect: boolean): void
    static buildTable(tb: Table, itemSeq: Seq<Item>, ctF: Prov<UnlockableContent>, cfgC: Cons<UnlockableContent>, colAmt: number): void
    static buildTable(tb: Table, itemSeq: Seq<Item>, ctF: Prov<UnlockableContent>, cfgC: Cons<UnlockableContent>, rowAmt: number, colAmt: number): void
    static buildTable(blk: Block, tb: Table, itemSeq: Seq<Item>, ctF: Prov<UnlockableContent>, cfgC: Cons<UnlockableContent>): void
    static buildTable(blk: Block, tb: Table, itemSeq: Seq<Item>, ctF: Prov<UnlockableContent>, cfgC: Cons<UnlockableContent>, closeSelect: boolean): void
    static buildTable(blk: Block, tb: Table, itemSeq: Seq<Item>, ctF: Prov<UnlockableContent>, cfgC: Cons<UnlockableContent>, rowAmt: number, colAmt: number): void
    static buildTable(blk: Block, tb: Table, itemSeq: Seq<Item>, ctF: Prov<UnlockableContent>, cfgC: Cons<UnlockableContent>, closeSelect: boolean, rowAmt: number, colAmt: number): void
}
