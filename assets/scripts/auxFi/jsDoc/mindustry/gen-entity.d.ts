/** mindustry.gen.Building */
declare class Building implements Buildingc, Entityc, Healthc, IndexableEntity__build, Posc, Teamc, Timerc {
    id: number;
    x: number;
    y: number;
    health: number;
    maxHealth: number;
    team: Team;
    dead: boolean;
    tile: Tile;
    block: Block;
    proximity: Seq<Building>;
    cdump: number;
    rotation: number;
    lastAccessed: string;
    visualLiquid: number;
    visibleFlags: number;
    enabled: boolean;
    lastDisabler: Building|null;
    power: PowerModule|null;
    items: ItemModule|null;
    liquids: LiquidModule|null;
    efficiency: number;
    optionalEfficiency: number;
    potentialEfficiency: number;
    shouldConsumePower: boolean;
    healSuppressionTime: number;
    lastHealTime: number;
    suppressColor: Color;
    lastDamageTime: number;
    timeScale: number;
    timeScaleDuration: number;
    dumpAccum: number;
    sleeping: boolean;
    sleepTime: number;
    initialized: boolean;
    wasDamaged: boolean;
    indexerBuildIndex: number;
    indexerBuildTypeIndex: number;

    tileX(): number
    tileY(): number
    nearby(rot: number): Building|null
    nearby(dx: number, dy: number): Building|null
    relativeTo(ot: Tile): number
    relativeTo(ob: Building): number
    relativeTo(tx: number, ty: number): number
    relativeToEdge(ot: Tile): number
    front(): Building|null
    back(): Building|null
    left(): Building|null
    right(): Building|null
    pos(): number
    rotdeg(): number
    drawrot(): number
}
interface Building extends Buildingc, Entityc, Healthc, IndexableEntity__build, Posc, Teamc, Timerc {}
/** mindustry.gen.Unit */
declare class Unit implements Builderc, Drawc, Entityc, Healthc, Hitboxc, IndexableEntity__draw, IndexableEntity__sync, IndexableEntity__unit, Itemsc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Unitc, Velc, Weaponsc {
    id: number;
    x: number;
    y: number;
    rotation: number;
    health: number;
    maxHealth: number;
    armor: number;
    armorOverride: number;
    shield: number;
    vel: Vec2;
    drag: number;
    hitSize: number;
    speedMultiplier: number;
    dragMultiplier: number;
    team: Team;
    dead: boolean;
    mounts: Array<WeaponMount>;
    disarmed: boolean;
    hasTarget: boolean;
    resupplyTime: number;
    stack: ItemStack;
    mineTile: Tile|null;
    abilities: Array<Ability>;
    type: UnitType;
    dockedType: UnitType;
    wasFlying: boolean;
    drownTime: number;
    splashTimer: number;
    lastDrownFloor: Floor|null;
    controller: UnitController;
    spawnedByCore: boolean;
    wasPlayer: boolean;
    flag: number;
    lastCommanded: string;
    trail: Trail|null;
    shadowAlpha: number;
    healTime: number;
    wasHealed: boolean;
    lastFogPos: number;

    speed(): number
    item(): Item
    count(): number
    cap(): number
    isPathImpassable(tx: number, ty: number): boolean
    inFogTo(team: Team): boolean
}
interface Unit extends Builderc, Drawc, Entityc, Healthc, Hitboxc, IndexableEntity__draw, IndexableEntity__sync, IndexableEntity__unit, Itemsc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Unitc, Velc, Weaponsc {}
/** mindustry.gen.UnitEntity */
declare class UnitEntity extends Unit implements Builderc, Drawc, Entityc, Healthc, Hitboxc, Itemsc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Unitc, Velc, Weaponsc {}
interface UnitEntity extends Builderc, Drawc, Entityc, Healthc, Hitboxc, Itemsc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Unitc, Velc, Weaponsc {}
/** mindustry.gen.Bullet */
declare class Bullet implements Pool.Poolable, Bulletc, Damagec, Drawc, Entityc, Hitboxc, IndexableEntity__bullet, IndexableEntity__draw, Ownerc, Posc, Shielderc, Teamc, Timedc, Timerc {}
interface Bullet extends Pool.Poolable, Bulletc, Damagec, Drawc, Entityc, Hitboxc, IndexableEntity__bullet, IndexableEntity__draw, Ownerc, Posc, Shielderc, Teamc, Timedc, Timerc {}
/** mindustry.gen.WeatherState */
declare class WeatherState implements Pool.Poolable, Drawc, Entityc, IndexableEntity__all, IndexableEntity__draw, IndexableEntity__sync, IndexableEntity__weather, Posc, Syncc, WeatherStatec {
    weather: Weather;
    intensity: number;
    opacity: number;
    life: number;
    effectTimer: number;
    windVector: Vec2;
}
interface WeatherState extends Pool.Poolable, Drawc, Entityc, IndexableEntity__all, IndexableEntity__draw, IndexableEntity__sync, IndexableEntity__weather, Posc, Syncc, WeatherStatec {}
/** mindustry.gen.Player */
declare class Player implements Drawc, Entityc, IndexableEntity__draw, IndexableEntity__player, IndexableEntity__sync, Playerc, Posc, Syncc, Timerc {
    unit(): Unit|null
}
interface Player extends Drawc, Entityc, IndexableEntity__draw, IndexableEntity__player, IndexableEntity__sync, Playerc, Posc, Syncc, Timerc {}
/** mindustry.gen.EffectState */
declare class EffectState implements Pool.Poolable, Childc, Drawc, EffectStatec, Entityc, IndexableEntity__draw, IndexableEntity__effect, Posc, Rotc, Timedc {}
interface EffectState extends Pool.Poolable, Childc, Drawc, EffectStatec, Entityc, IndexableEntity__draw, IndexableEntity__effect, Posc, Rotc, Timedc {}
/** mindustry.gen.PowerGraphUpdater */
declare class PowerGraphUpdater implements Entityc, IndexableEntity__powerGraph, PowerGraphUpdaterc {}
interface PowerGraphUpdater extends Entityc, IndexableEntity__powerGraph, PowerGraphUpdaterc {}
/** mindustry.gen.Puddle */
declare class Puddle implements Pool.Poolable, Drawc, Entityc, IndexableEntity__all, IndexableEntity__draw, IndexableEntity__sync, Posc, Puddlec, Syncc {
    id: number;
    liquid: Liquid;
    amount: number;
    tile: Tile;
    x: number;
    y: number;
    accepting: number;
    effectTime: number;
    lastRipple: number;
    lastUpdated: number;
    updateSpacing: number;
    updateTime: number;

    classId(): number
    clipSize(): number

    tileOn(): Tile|null
    tileX(): number
    tileY(): number
    blockOn(): Block
    floorOn(): Block
    buildOn(): Building|null

    getFlamability(): number

    isAdded(): boolean
    isLocal(): boolean
    isRemote(): boolean
    isSyncHidden(team: Team): boolean
    serialize(): boolean
}
interface Puddle extends Pool.Poolable, Drawc, Entityc, IndexableEntity__all, IndexableEntity__draw, IndexableEntity__sync, Posc, Puddlec, Syncc {}
/** mindustry.gen.Fire */
declare class Fire implements Pool.Poolable, Drawc, Entityc, Firec, IndexableEntity__all, IndexableEntity__draw, IndexableEntity__sync, Posc, Syncc, Timedc {}
interface Fire extends Pool.Poolable, Drawc, Entityc, Firec, IndexableEntity__all, IndexableEntity__draw, IndexableEntity__sync, Posc, Syncc, Timedc {}
/** mindustry.gen.Decal */
declare class Decal implements Pool.Poolable, Decalc, Drawc, Entityc, IndexableEntity__all, IndexableEntity__draw, Posc, Rotc, Timedc {}
interface Decal extends Pool.Poolable, Decalc, Drawc, Entityc, IndexableEntity__all, IndexableEntity__draw, Posc, Rotc, Timedc {}


/** mindustry.gen.Groups */
declare class Groups {
    static all: EntityGroup<Entityc>;
    static build: EntityGroup<Building>;
    static unit: EntityGroup<Unit>;
    static bullet: EntityGroup<Bullet>;
    static weather: EntityGroup<WeatherState>;
    static player: EntityGroup<Player>;
    static draw: EntityGroup<Drawc>;
    static effect: EntityGroup<EffectState>;
    static powerGraph: EntityGroup<PowerGraphUpdaterc>;
    static sync: EntityGroup<Syncc>;
}


/** mindustry.gen.ElevationMoveUnit */
declare class ElevationMoveUnit extends Unit implements Builderc, Drawc, ElevationMovec, Entityc, Healthc, Hitboxc, Itemsc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Unitc, Velc, Weaponsc {}
interface ElevationMoveUnit extends Builderc, Drawc, ElevationMovec, Entityc, Healthc, Hitboxc, Itemsc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Unitc, Velc, Weaponsc {}
/** mindustry.gen.UnitWaterMove */
declare class UnitWaterMove extends Unit implements Builderc, Drawc, Entityc, Healthc, Hitboxc, Itemsc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Unitc, Velc, WaterMovec, Weaponsc {}
interface UnitWaterMove extends Builderc, Drawc, Entityc, Healthc, Hitboxc, Itemsc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Unitc, Velc, WaterMovec, Weaponsc {}
/** mindustry.gen.MechUnit */
declare class MechUnit extends Unit implements Builderc, Drawc, ElevationMovec, Entityc, Healthc, Hitboxc, Itemsc, Mechc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Unitc, Velc, Weaponsc {}
interface MechUnit extends Builderc, Drawc, ElevationMovec, Entityc, Healthc, Hitboxc, Itemsc, Mechc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Unitc, Velc, Weaponsc {}
/** mindustry.gen.LegsUnit */
declare class LegsUnit extends Unit implements Builderc, Drawc, Entityc, Healthc, Hitboxc, Itemsc, Legsc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Unitc, Velc, Weaponsc {}
interface LegsUnit extends Builderc, Drawc, Entityc, Healthc, Hitboxc, Itemsc, Legsc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Unitc, Velc, Weaponsc {}
/** mindustry.gen.PayloadUnit */
declare class PayloadUnit extends Unit implements Builderc, Drawc, Entityc, Healthc, Hitboxc, Itemsc, Minerc, Payloadc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Unitc, Velc, Weaponsc {}
interface PayloadUnit extends Builderc, Drawc, Entityc, Healthc, Hitboxc, Itemsc, Minerc, Payloadc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Unitc, Velc, Weaponsc {}
/** mindustry.gen.TankUnit */
declare class TankUnit extends Unit implements Builderc, Drawc, ElevationMovec, Entityc, Healthc, Hitboxc, Itemsc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Tankc, Teamc, Unitc, Velc, Weaponsc {}
interface TankUnit extends Builderc, Drawc, ElevationMovec, Entityc, Healthc, Hitboxc, Itemsc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Tankc, Teamc, Unitc, Velc, Weaponsc {}
/** mindustry.gen.TimedKillUnit */
declare class TimedKillUnit extends Unit implements Builderc, Drawc, Entityc, Healthc, Hitboxc, Itemsc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, TimedKillc, Unitc, Velc, Weaponsc {}
interface TimedKillUnit extends Builderc, Drawc, Entityc, Healthc, Hitboxc, Itemsc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, TimedKillc, Unitc, Velc, Weaponsc {}
/** mindustry.gen.BuildingTetherPayloadUnit */
declare class BuildingTetherPayloadUnit extends Unit implements Builderc, BuildingTetherc, Drawc, Entityc, Healthc, Hitboxc, Itemsc, Minerc, Payloadc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Unitc, Velc, Weaponsc {}
interface BuildingTetherPayloadUnit extends Builderc, BuildingTetherc, Drawc, Entityc, Healthc, Hitboxc, Itemsc, Minerc, Payloadc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Unitc, Velc, Weaponsc {}
/** mindustry.gen.CrawlUnit */
declare class CrawlUnit extends Unit implements Builderc, Crawlc, Drawc, Entityc, Healthc, Hitboxc, Itemsc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Unitc, Velc, Weaponsc {}
interface CrawlUnit extends Builderc, Crawlc, Drawc, Entityc, Healthc, Hitboxc, Itemsc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Unitc, Velc, Weaponsc {}
