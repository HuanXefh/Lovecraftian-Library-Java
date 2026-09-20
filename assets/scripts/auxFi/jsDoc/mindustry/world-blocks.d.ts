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


/** mindustry.world.blocks.RotBlock */
interface RotBlock {
    buildRotation(): number
}
/** mindustry.world.blocks.ControlBlock */
interface ControlBlock {
    unit(): Unit
    isControlled(): boolean
    canControl(): boolean
    shouldAutoTarget(): boolean
}
/** mindustry.world.blocks.UnitTetherBlock */
interface UnitTetherBlock {
    spawned(id: number): void
}
/** mindustry.world.blocks.ChainedBuilding */
interface ChainedBuilding {
    next(): Building
}
/** mindustry.world.blocks.HeatBlock */
interface HeatBlock {
    heat(): number
    heatFrac(): number
}
/** mindustry.world.blocks.HeatConsumer */
interface HeatConsumer {
    sideHeat(): JavaArray<java.lang.Float>
    heatRequirement(): number
}


/** mindustry.world.blocks.Autotiler */
interface Autotiler {
    sliced(reg: TextureRegion, mode: Autotiler.SliceMode): TextureRegion
    topHalf(reg: TextureRegion): TextureRegion
    botHalf(reg: TextureRegion): TextureRegion
    getTiling(bPlan: BuildPlan, bPlans: Eachable<BuildPlan>): JavaArray<java.lang.Integer>|null
    buildBlending(t: Tile, rot: number, directional: Array<BuildPlan>, checkWorld: boolean): JavaArray<java.lang.Integer>
    transformCase(num: number, bits: JavaArray<java.lang.Integer>): void
    facing(tx: number, ty: number, rot: number, tx2: number, ty2: number): boolean
    blends(t: Tile, rot: number, directional: Array<BuildPlan>|null, dir: number, checkWorld: boolean): boolean
    blends(t: Tile, rot: number, dir: number): boolean
    blendsArmored(t: Tile, rot: number, otx: number, oty: number, orot: number, oblk: Block): boolean
    notLookingAt(t: Tile, rot: number, otx: number, oty: number, orot: number, oblk: Block): boolean
    lookingAtEither(t: Tile, rot: number, otx: number, oty: number, orot: number, oblk: Block): boolean
    lookingAt(t: Tile, rot: number, otx: number, oty: number, orot: number, oblk: Block): boolean
}
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
/** mindustry.world.blocks.LaunchAnimator */
interface LaunchAnimator {
    launchDuration(): number
    zoomLaunch(): number
    landMusic(): Music|null
    drawLaunch(): void
    beginLaunch(launching: boolean): void
    endLaunch(): void
    updateLaunch(): void
    drawLaunchGlobalZ(): number
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
