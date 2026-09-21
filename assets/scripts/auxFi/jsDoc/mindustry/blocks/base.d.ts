/** mindustry.world.blocks.ConstructBlock */
declare class ConstructBlock extends Block {
    static get(size: number): ConstructBlock
    static playRepairSound(team: Team, t: Tile): void
    static constructed(t: Tile, blk: Block, builder: Unit, rot: java.lang.Byte, team: Team, config: Object): void
}
declare namespace ConstructBlock {
    class ConstructBuild extends Building {
        current: Block;
        previous: Block;
        prevBuild: Seq<Building>|null;
        progress: number;
        buildCost: number;
        lastConfig: Object|null;
        lastBuilder: Unit|null;
        wasConstructing: boolean;
        activeDeconstruct: boolean;
        constructColor: java.lang.Float;
    }
}


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
/** mindustry.world.blocks.ShieldProvider */
interface ShieldProvider {
    absorbExplosion(x: number, y: number, dmg: number): number
    getShieldBounds(): number
    intersectLaser(x1: number, y1: number, x2: number, y2: number, dmg: number): Vec2|null
    absorbLaser(x: number, y: number, dmg: number): number
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
