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


/** mindustry.world.blocks.payloads */
interface Payload extends Position {
    content(): UnlockableContent
    contentEquals(opay: Payload): boolean
    isDead(): boolean
    fits(size: number): boolean
    x(): number
    y(): number
    rotation(): number
    size(): number
    requirements(): Array<ItemStack>
    buildTime(): number
    icon(): TextureRegion
    set(x: number, y: number, rot: number): void
    remove(): void
}
/** mindustry.world.blocks.BuildPayload */
declare class BuildPayload implements Payload {
    build: Building;

    constructor(b: Building)
    constructor(blk: Block, team: Team)

    block(): Block
    place(t: Tile, rot?: number): void
}
interface BuildPayload extends Payload {}
/** mindustry.world.blocks.UnitPayload */
declare class UnitPayload implements Payload {
    static readonly overlayDuration: number;
    unit: Unit;
    overlayTime: number;
    overlayRegion: TextureRegion|null;

    constructor(unit: Unit)

    showOverlay(icon: TextureRegion): void
    showOverlay(icon: TextureRegionDrawable): void
}
interface UnitPayload extends Payload {}


/** mindustry.world.blocks.Attributes */
declare class Attributes implements Json.JsonSerializable {
    get(attr: Attribute): number
    set(attr: Attribute, val: number): void
    add(attributes: Attributes, scl?: number): void
    clear(): void
}
interface Attributes extends Json.JsonSerializable {}


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
