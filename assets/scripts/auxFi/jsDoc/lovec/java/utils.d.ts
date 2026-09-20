/** lovec.utils.LCAirObjects */
declare class LCAirObjects {
    static readonly seq: Seq<Object>;
    static readonly objectSet: ObjectSet<Object>;
    static readonly objectMap: ObjectMap<Object, Object>;

    static readonly point2: Point2;
    static readonly point3: Point3;
    static readonly vec2: Vec2;
    static readonly vec3: Vec3;

    static readonly textureRegion: TextureRegion;
    static readonly pixmap: Pixmap;
}


/** lovec.utils.LCCheck */
declare class LCCheck {
    static checkPosInTriangle(x: number, y: number, cx: number, cy: number, rad: number, ang?: number): boolean
    static checkPosInHexagon(x: number, y: number, cx: number, cy: number, rad: number, ang?: number): boolean
    static checkPosVisible(x: number, y: number, clipSize?: number): boolean
    static checkPosHovered(x: number, y: number, rad: number): boolean
    static checkPosHoveredRect(x: number, y: number): boolean
    static checkPosHoveredRect(x: number, y: number, r: number, size: number): boolean
    static checkPosCanShadow(x: number, y: number): boolean

    static checkEntityVisible(obj: Object): boolean
    static checkHostile(e: Teamc, team: Team|null): boolean
    static checkHealable(e: Healthc, team: Team|null): boolean
}


/** lovec.utils.LCEntity */
declare class LCEntity {
    static getBuildCount(blk: Block, team: Team): number
    static eachSomeBlock(blk: Block, team: Team, cons: Cons<Building>): void
    static getBuildBy(x: number, y: number, team: Team, boolF: Boolf<Building>): Building|null
    static getBuildBy(x: number, y: number, team: Team, rad: number, boolF: Boolf<Building>): Building|null
    static getBuilds(contArr: Array<Object>|null, x: number, y: number, rad: number): Array<Building>
    static eachBuild(x: number, y: number, team: Team|null, rad: number, boolF: Boolf<Building>|null, cons: Cons<Building>): void
    static eachBuildRect(x: number, y: number, team: Team, w: number, boolF: Boolf<Building>|null, cons: Cons<Building>): void
    static getBuildsByTiles(contArr: Array<Object>|null, ts: Array<Tile>): Array<Building>

    static getUnitCount(utp: UnitType, team: Team): number
    static eachSomeUnitType(utp: UnitType, team: Team, cons: Cons<Unit>): void
    static getUnit(x: number, y: number, rad?: number): Unit|null
    static getOtherUnit(x: number, y: number, unit: Unit): Unit|null
    static getOtherUnit(x: number, y: number, rad: number, unit: Unit): Unit|null
    static getUnits(contArr: Array<Object>|null, x: number, y: number, rad: number): Array<Unit>
    static eachUnit(x: number, y: number, team: Team|null, rad: number, boolF: Boolf<Unit>|null, cons: Cons<Unit>): void
    static eachUnitRect(x: number, y: number, team: Team|null, w: number, boolF: Boolf<Unit>|null, cons: Cons<Unit>): void
    static getPlayerUnit(x: number, y: number, team: Team|null, rad: number): Unit|null
    static getPlayerUnitByName(name: string): Unit|null

    static getLoot(x: number, y: number, rad?: number): LootUnit|null
    static getOtherLoot(x: number, y: number, loot: LootUnit): LootUnit|null
    static getOtherLoot(x: number, y: number, rad: number, loot: LootUnit): LootUnit|null
    static getLoots(contArr: Array<Object>|null, x: number, y: number, rad: number): Array<LootUnit>
    static getLootsByTiles(contArr: Array<Object>|null, ts: Array<Tile>): Array<LootUnit>

    static getEnemyBullet(x: number, y: number, team: Team, rad: number, ignoreHittable?: boolean): Bullet|null
    static getBullets(contArr: Array<Object>|null, x: number, y: number, team: Team|null, rad: number): Array<Bullet>
    static eachBullet(x: number, y: number, team: Team|null, rad: number, boolF: Boolf<Bullet>|null, cons: Cons<Bullet>): void

    static getTarget(x: number, y: number, team: Team, targetAir: boolean, targetGround: boolean, boolF?: Boolf<Teamc>|null): Teamc
    static getTarget(x: number, y: number, team: Team, rad: number, targetAir: boolean, targetGround: boolean, boolF?: Boolf<Teamc>|null): Teamc
    static getTargets(contArr: Array<Object>|null, x: number, y: number, team: Team, rad?: number): Array<Teamc>
    static getChainTargets(contArr: Array<Object>|null, x: number, y: number, team: Team, rad: number, chainRad: number, chainCap: number, rayCheck?: Boolf2<Vec2, Vec2>): Array<Teamc>
}


/** lovec.utils.LCFormat */
declare class LCFormat {
    static numToStr(num: number, deciAmt?: number): string
    static perc(num: number, deciAmt?: number): string
    static sci(num: number, pow: number, deciAmt?: number): string
    static time(num: number, deciAmt?: number): string
    static color(str: string, color: Color): string
    static colorNum(num: number, color: Color, deciAmt?: number): string
    static percColor(num: number, deciAmt?: number): string
    static percColor(num: number, deciAmt: number, overColor: Color, lessColor: Color, midColor?: Color, midTol?: number): string
    static plain(str: string): string
}


/** lovec.utils.LCGeometry */
declare class LCGeometry {
    static accept(b_f: Building, b_t: Building, fromRouter: boolean, canSideBlend: boolean): boolean
    static showBackSide(b: Building): boolean
    static showFrontSide(b: Building): boolean
}


/** lovec.utils.LCPos */
declare class LCPos {
    static readonly sizeOffs: D2Array<Point2>;

    static toIntCoord(x: number): number
    static toFCoord(x: number, size?: number): number
    static calcRectW(r: number, size: number): number
    static calcRectHW(r: number, size: number): number

    static calcTileDst(t1: Tile|null, t2: Tile|null): number
    static calcTileDst(tx1: number, ty1: number, tx2: number, ty2: number): number

    static getRotation(b_f: Building, b_t: Building): number
    static getRotation(t_f: Tile, t_t: Tile): number
    static getRotation(x1: number, y1: number, x2: number, y2: number): number

    static getCoordsBack(out: Vec2, x: number, y: number, size: number, rot: number): Vec2
    static getCoordsRectRotCenter(out: Vec2, x: number, y: number, r: number, rot: number, size: number): Vec2
    static getCoordsPlayer(out: Vec2): Vec2
    static eachLinePoint(x1: number, y1: number, x2: number, y2: number, cons: Cons3<java.lang.Float, java.lang.Float, java.lang.Float>, segScl: number, noStart: boolean, noEnd: boolean): void

    static getTileRectRotCenter(t: Tile|null, tCenter: Tile|null, rot: number, size: number, sizeCenter: number): Tile|null
    static getTileOre(x: number, y: number, item: Item): Tile|null
    static getTileMouse(): Tile|null

    static getTilesRot(contArr: Array<Object>|null, t: Tile|null, rot: number, size: number): Array<Tile>
    static getTilesEdge(contArr: Array<Object>|null, t: Tile|null, size: number, isInnerEdge?: boolean): Array<Tile>
    static getTilesRect(contArr: Array<Object>|null, t: Tile|null, r: number, size: number): Array<Tile>
    static getTilesBlock(contArr: Array<Object>|null, blk: Block, tx: number, ty: number): Array<Tile>
    static getTilesBuild(contArr: Array<Object>|null, b: Building): Array<Tile>
    static getTilesRectRotCenter(contArr: Array<Object>|null, t: Tile|null, r: number, rot: number, size: number): Array<Tile>
    static getTilesCircle(contArr: Array<Object>|null, t: Tile|null, r: number, size: number): Array<Tile>
    static getTilesDstManhattan(contArr: Array<Object>|null, t: Tile|null, r: number): Array<Tile>
    static getTilesLinked(contArr: Array<Object>|null, t: Tile|null): Array<Tile>
    static eachTileLinked(t: Tile|null, cons: Cons<Tile>): void
}


/** lovec.utils.LCProp */
declare class LCProp {
    static getSize(obj: Object): number
    static getHitSize(obj: Object): number
    static getClipSize(obj: Object): number
    static getLayer(obj: Object): number
    static getHealthFrac(obj: Object): number
    static getArmor(obj: Object): number
    static getPayloadFrac(obj: Object, nearCap?: boolean): number
    static getElevation(obj: Object): number
    static getReloadMultiplier(obj: Object, isClamped?: boolean): number
    static getAi(obj: Object): AIController|null
}


/** lovec.utils.LCRand */
declare class LCRand {
    static randomInt(rand: Rand): java.lang.Integer
    static randomInt(rand: Rand, to: number): java.lang.Integer
    static randomInt(rand: Rand, from: number, to: number): java.lang.Integer
    static rangeInt(rand: Rand, to: number): java.lang.Integer
    static rangeInt(rand: Rand, from: number, to: number): java.lang.Integer
    static randomFloat(rand: Rand): java.lang.Float
    static randomFloat(rand: Rand, to: number): java.lang.Float
    static randomFloat(rand: Rand, from: number, to: number): java.lang.Float
    static rangeFloat(rand: Rand, to: number): java.lang.Float
    static rangeFloat(rand: Rand, from: number, to: number): java.lang.Float
    static randomBoolean(rand: Rand, trueChance?: number): boolean
    static randomSign(rand: Rand): java.lang.Integer
    static chance(rand: Rand, trueChance: number): boolean
    static chanceDelta(rand: Rand, trueChance: number): boolean
}


/** lovec.utils.LCRaycastf */
declare class LCRaycastf {
    static checkInsulated(x1: number, y1: number, x2: number, y2: number, team: Team|null): boolean
    static checkLaser(x1: number, y1: number, x2: number, y2: number, team: Team|null): boolean
    static checkSolid(x1: number, y1: number, x2: number, y2: number): boolean
    static checkLegSolid(x1: number, y1: number, x2: number, y2: number): boolean
    static checkMobileFloor(x1: number, y1: number, x2: number, y2: number, minRad: number): boolean

    static findInsulated(x1: number, y1: number, x2: number, y2: number, team: Team|null): Building|null
    static findLaser(x1: number, y1: number, x2: number, y2: number, team: Team|null): Building|null
    static findSolid(x1: number, y1: number, x2: number, y2: number): Tile|null
    static findSolidSolid(x1: number, y1: number, x2: number, y2: number): Tile|null
    static findUnit(x1: number, y1: number, x2: number, y2: number, boolF: Boolf<Unit>): Unit|null
}


/** lovec.utils.LCScript */
declare class LCScript {
    static isUndefined(val: Object): boolean
    static isNull(val: Object): boolean
    static toInt(val: Object): java.lang.Integer
    static toByte(val: Object): java.lang.Byte
    static toShort(val: Object): java.lang.Short
    static toLong(val: Object): java.lang.Long
    static toFloat(val: Object): java.lang.Float
    static toDouble(val: Object): java.lang.Double
    static toBoolean(val: Object): java.lang.Boolean
    static toString(val: Object): java.lang.String
    static toArray(val: Object): rhino.NativeArray
    static toObject(val: Object): rhino.NativeObject
    static toFunction(val: Object): rhino.Function

    static newArray(name: string): rhino.NativeArray
    static newArray(name: string, scope: rhino.Scriptable, ...eles: Array<Object>): rhino.NativeArray
    static ensureArray(name: string, scope?: rhino.Scriptable): rhino.NativeArray
    static ensureLength(arr: Array<Object>, len: number, def?: Object|null): rhino.NativeArray
    static newObject(name: string): rhino.NativeObject
    static newObject(name: string, scope: rhino.Scriptable, ...args: Array<Object>): rhino.NativeObject
    static ensureObject(name: string, scope?: rhino.Scriptable): rhino.NativeObject

    static get(nameProp: string, scope?: rhino.Scriptable): any
    static set(nameProp: string, val: Object, scope?: rhino.Scriptable): void
    static search(scope: rhino.Scriptable, ...nameProps: Array<string>): any
    static invoke(nameFun: string, scope: rhino.Scriptable, ...args: Array<Object>): any
    static invoke(fun: rhino.Function, scope: rhino.Scriptable, ...args: Array<Object>): any
    static thisInvoke(nameFun: string, scope: rhino.Scriptable, thisObj: rhino.Scriptable, ...args: Array<Object>): any
    static thisInvoke(fun: rhino.Function, scope: rhino.Scriptable, thisObj: rhino.Scriptable, ...args: Array<Object>): any
    static protoInvoke(nameFun: string, ins: rhino.Scriptable, ...args: Array<Object>): any

    static hasDelegee(ins: Object): boolean
    static getDelegee(ins: Object): rhino.NativeObject|null
    static instanceHas(ins: Object, nameProp: string): boolean
    static instanceGet(ins: Object, nameProp: string): any
    static instanceSet(ins: Object, nameProp: string, val: Object): void
    static instanceSet(ins: Object, nameProps: Array<string>, ...vals: Array<Object>): void
    static instanceInvoke(ins: Object, nameFun: string, ...args: Array<Object>): any
}


/** lovec.utils.LCScriptUtil */
declare class LCScriptUtil {
    static packSplitterPayload(args: IArguments): string
    static unpackSplitterPayload(payload: string, ind?: number): Array<Object>
}


/** lovec.utils.TmpStateTag */
declare class TmpStateTag {
    static alias: TmpStateTag;
    static customValue: TmpStateTag;
    static error: TmpStateTag;
    static needReplace: TmpStateTag;
    static pending: TmpStateTag;
    static undefined: TmpStateTag;
}
