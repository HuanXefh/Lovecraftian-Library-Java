/** mindustry.entities.Sized */
interface Sized extends Position {}


/** mindustry.entities.Damage */
declare class Damage {
    static applySuppression(team: Team, x: number, y: number, rad: number, reload: number, maxDelay: number, effP: number, e_f: Position|null, effColor?: Color): void
    static dynamicExplosion(x: number, y: number, flam: number, explo: number, charge: number, rad: number, dealDamage: boolean, exploEff?: Effect, baseShake?: number): void
    static dynamicExplosion(x: number, y: number, flam: number, explo: number, charge: number, rad: number, dealDamage: boolean, createFire: boolean, ignoreTeam: Team|null, exploEff?: Effect, baseShake?: number): void
    static createIncend(x: number, y: number, w: number, amt: number): void
    static findAbsorber(team: Team, x1: number, y1: number, x2: number, y2: number): void
    static findLength(bul: Bullet, len: number, isLaser: boolean, pierceCap: number): number
    static findLaserLength(bul: Bullet, len: number): number
    static findPierceLength(bul: Bullet, pierceCap: number, isLaser: boolean, len: number): number
    static collideLaser(bul: Bullet, len: number, isLarge: boolean, isLaser: boolean, pierceCap: number): void
    static collideLine(bul: Bullet, team: Team, x: number, y: number, ang: number, len: number, isLarge?: boolean, isLaser?: boolean, pierceCap?: number): void
    static collidePoint(bul: Bullet, team: Team, eff: Effect, x: number, y: number): void
    static lineCast(bul: Bullet, x: number, y: number, ang: number, len: number): Healthc
    static damageUnits(x: number, y: number, rad: number, dmg: number): void
    static damageUnits(team: Team, x: number, y: number, rad: number, dmg: number): void
    static damageUnits(team: Team, x: number, y: number, rad: number, dmg: number, targetAir: boolean, targetGound: boolean): void
    static damageUnits(team: Team, x: number, y: number, rad: number, dmg: number, boolF: Boolf<Unit>, cons: Cons<Unit>): void
    static status(team: Team, x: number, y: number, rad: number, sta: StatusEffect, dur: number, targetAir: boolean, targetGound: boolean, p?: number): void
    static damage(team: Team, x: number, y: number, rad: number, dmg: number, complete: boolean): void
    static damage(team: Team, x: number, y: number, rad: number, dmg: number, complete: boolean, targetAir: boolean, targetGound: boolean): void
    static damage(team: Team, x: number, y: number, rad: number, dmg: number, complete: boolean, targetAir: boolean, targetGound: boolean, scaled: boolean, bul: Bullet|null): void
    static damage(team: Team, x: number, y: number, rad: number, dmg: number, complete: boolean, targetAir: boolean, targetGound: boolean, scaled: boolean, bul: Bullet|null, armorMtp: number): void
    static tileDamage(team: Team, tx: number, ty: number, baseRad: number, dmg: number, bul?: Bullet|null): void
    static applyArmor(dmg: number, armor: number): number
}
declare namespace Damage {
    class Collided implements Pool.Poolable {
        x: number;
        y: number;
        target: Teamc;

        set(x: number, y: number, target: Teamc): this
    }
}


/** mindustry.entities.Lightning */
declare class Lightning {
    static create(btp: BulletType, team: Team, color: Color, dmg: number, x: number, y: number, ang: number, len: number): void
    static create(team: Team, color: Color, dmg: number, x: number, y: number, ang: number, len: number): void
    static create(bul: Bullet, color: Color, dmg: number, x: number, y: number, ang: number, len: number): void
}


/** mindustry.entities.EntityGroup */
// @ts-ignore
declare class EntityGroup<T> implements Iterable<T> {
    static nextId(): number

    each(cons: Cons<T>): void
    each(boolF: Boolf<T>, cons: Cons<T>): void

    getByID(id: number): T
    removeByID(id: number): void
    isEmpty(): boolean
    contains(boolF: Boolf<T>): boolean
    add(e: T): void
    addIndex(e: T): number
    index(ind: number): T
    remove(e: T): void
    removeIndex(e: T, ind: number): void
    clear(): void
    count(boolF: Boolf<T>): number
    size(): number
    first(): T
    find(boolF: Boolf<T>): T
    intersect(x: number, y: number, w: number, h: number): Seq<T>
    intersect(x: number, y: number, w: number, h: number, cons: Cons<T>): void
    intersect(x: number, y: number, w: number, h: number, boolF: Boolf<T>): boolean
}


/** mindustry.entities.Puddles */
declare class Puddles {
    static readonly maxLiquid: number;

    static deposit(t: Tile, liq: Liquid, amt: number): void
    static deposit(t: Tile, t_f: Tile, liq: Liquid, amt: number, initial?: boolean, capped?: boolean): void
    static get(t: Tile): Puddle|null
    static hasLiquid(t: Tile, liq: Liquid): boolean
    static remove(t: Tile): void
    static register(puddle: Puddle): void
}


/** mindustry.entities.Fires */
declare class Fires {
    static get(t: Tile): Fire|null
    static get(tx: number, y: number): Fire|null
    static has(tx: number, y: number): boolean
    static create(t: Tile): void
    static remove(t: Tile): void
    static register(fire: Fire): void
    static extinguish(t: Tile, intens: number): void
}


/** mindustry.entities.TargetPriority */
declare class TargetPriority {
    static wall: number;
    static under: number;
    static transport: number;
    static base: number;
    static turret: number;
    static core: number;
}


/** mindustry.entities.UnitSorts */
declare class UnitSorts {
    static closest: Units.Sortf;
    static farthest: Units.Sortf;
    static strongest: Units.Sortf;
    static weakest: Units.Sortf;
    static mostArmor: Units.Sortf;
    static leastArmor: Units.Sortf;
    static mostShield: Units.Sortf;
    static leastShield: Units.Sortf;
    static grouped: Units.Sortf;

    static buildingDefault: Units.BuildingPriorityf;
    static buildingWater: Units.BuildingPriorityf;
}


/** mindustry.entities.Units */
declare class Units {}
declare namespace Units {
    interface Sortf {
        cost(unit: Unit, x: number, y: number): number
    }
    interface BuildingPriorityf {
        cost(b: Building): number
    }
    class UnitSyncContainer {
        unit: Unit;
    }
}


/** mindustry.entities.BuildPlan */
declare class BuildPlan implements Position, QuadTree.QuadTreeObject {
    x: number;
    y: number;
    rotation: number;
    block: Block|null;
    breaking: boolean;
    config: Object;
    progress: number;
    initialized: boolean;
    stuck: boolean;
    cachedValid: boolean;
    worldContext: boolean;
    animScale: number;

    constructor()
    constructor(x: number, y: number)
    constructor(x: number, y: number, rotation: number, block: Block, cfg?: Object)

    placeable(team: Team): boolean
    isRotation(team: Team): boolean
    isDerelictRepair(): boolean
    samePos(obPlan: BuildPlan): boolean
    drawx(): number
    drawy(): number
    isDone(): boolean
    tile(): Tile|null
    build(): Building|null

    bounds(rect: Rect): Rect
    set(x: number, y: number, rotation: number, blk: Block): void

    static pointConfig(blk: Block, cfg: Object, cons: Cons<Point2>): Object
    pointConfig(cons: Cons<Point2>): void
}


/** mindustry.entities.units.StatusEntry */
declare class StatusEntry {
    effect: StatusEffect;
    time: number;
    damageTime: number;
    damageMultiplier: number;
    healthMultiplier: number;
    speedMultiplier: number;
    reloadMultiplier: number;
    buildSpeedMultiplier: number;
    dragMultiplier: number;
    armorOverride: number;

    set(sta: StatusEffect, time: number): this
}


/** mindustry.entities.units.WeaponMount */
declare class WeaponMount {
    readonly weapon: Weapon;
    reload: number;
    rotation: number;
    recoil: number;
    recoils: Array<number>|null;
    targetRotation: number;
    heat: number;
    warmup: number;
    charging: boolean;
    charge: number;
    smoothReload: number;
    aimX: number;
    aimY: number;
    shoot: boolean;
    allowShootEffects: boolean;
    rotate: boolean;
    side: boolean;
    totalShots: number;
    barrelCounter: number;
    lastLength: number;
    bullet: Bullet|null;
    sound: SoundLoop|null;
    target: Teamc|null;
    retarget: number;
}


/** mindustry.entities.EntityCollisions */
declare class EntityCollisions {}
