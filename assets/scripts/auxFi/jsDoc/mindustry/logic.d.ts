/** mindustry.logic.GlobalVars */
declare class GlobalVars {}


/** mindustry.logic.Ranged */
interface Ranged extends Posc, Teamc {}
/** mindustry.logic.LogicSenseable */
interface LogicSenseable {}
/** mindustry.logic.LogicSettable */
interface LogicSettable {}
/** mindustry.logic.LogicControllable */
interface LogicControllable {}


/** mindustry.logic.LogicOp */
declare class LogicOp {
    static add: LogicOp;
    static sub: LogicOp;
    static mul: LogicOp;
    static div: LogicOp;
    static idiv: LogicOp;
    static mod: LogicOp;
    static emod: LogicOp;
    static pow: LogicOp;
    static equal: LogicOp;
    static notEqual: LogicOp;
    static land: LogicOp;
    static lessThan: LogicOp;
    static lessThanEq: LogicOp;
    static greaterThan: LogicOp;
    static greaterThanEq: LogicOp;
    static strictEqual: LogicOp;
    static shl: LogicOp;
    static shr: LogicOp;
    static ushr: LogicOp;
    static or: LogicOp;
    static and: LogicOp;
    static xor: LogicOp;
    static not: LogicOp;
    static max: LogicOp;
    static min: LogicOp;
    static angle: LogicOp;
    static angleDiff: LogicOp;
    static len: LogicOp;
    static noise: LogicOp;
    static abs: LogicOp;
    static sign: LogicOp;
    static log: LogicOp;
    static logn: LogicOp;
    static log10: LogicOp;
    static floor: LogicOp;
    static ceil: LogicOp;
    static round: LogicOp;
    static sqrt: LogicOp;
    static rand: LogicOp;
    static sin: LogicOp;
    static cos: LogicOp;
    static tan: LogicOp;
    static asin: LogicOp;
    static acos: LogicOp;
    static atan: LogicOp;

    readonly function1: LogicOp.OpLambda1;
    readonly function2: LogicOp.OpLambda2;
    readonly objFunction2: LogicOp.OpObjLambda2;
    readonly unary: boolean;
    readonly func: boolean;
    readonly symbol: string;
}
declare namespace LogicOp {
    interface OpLambda1 {
        get(a: number): number
    }
    interface OpLambda2 {
        get(a: number, b: number): number
    }
    interface OpObjLambda2 {
        get(a: Object, b: Object): number
    }
}
/** mindustry.logic.ConditionOp */
declare class ConditionOp {
    static equal: ConditionOp;
    static notEqual: ConditionOp;
    static lessThan: ConditionOp;
    static lessThanEq: ConditionOp;
    static greaterThan: ConditionOp;
    static greaterThanEq: ConditionOp;
    static strictEqual: ConditionOp;
    static always: ConditionOp;

    function: ConditionOp.CondOpLambda;
    objFunction: ConditionOp.CondObjOpLambda;
    symbol: string;
}
declare namespace ConditionOp {
    interface CondOpLambda {
        get(a: number, b: number): boolean
    }
    interface CondObjOpLambda {
        get(a: Object, b: Object): boolean
    }
}


/** mindustry.logic.LogicProp */
declare class LogicProp {
    static totalItems: LogicProp;
    static firstItem: LogicProp;
    static totalLiquids: LogicProp;
    static totalPower: LogicProp;
    static itemCapacity: LogicProp;
    static liquidCapacity: LogicProp;
    static powerCapacity: LogicProp;
    static powerNetStored: LogicProp;
    static powerNetCapacity: LogicProp;
    static powerNetIn: LogicProp;
    static powerNetOut: LogicProp;
    static ammo: LogicProp;
    static ammoCapacity: LogicProp;
    static currentAmmoType: LogicProp;
    static memoryCapacity: LogicProp;
    static health: LogicProp;
    static maxHealth: LogicProp;
    static heat: LogicProp;
    static shield: LogicProp;
    static armor: LogicProp;
    static efficiency: LogicProp;
    static progress: LogicProp;
    static timescale: LogicProp;
    static rotation: LogicProp;
    static x: LogicProp;
    static y: LogicProp;
    static velocityX: LogicProp;
    static velocityY: LogicProp;
    static shootX: LogicProp;
    static shootY: LogicProp;
    static cameraX: LogicProp;
    static cameraY: LogicProp;
    static cameraWidth: LogicProp;
    static cameraHeight: LogicProp;
    static displayWidth: LogicProp;
    static displayHeight: LogicProp;
    static bufferSize: LogicProp;
    static operations: LogicProp;
    static size: LogicProp;
    static solid: LogicProp;
    static dead: LogicProp;
    static range: LogicProp;
    static shooting: LogicProp;
    static boosting: LogicProp;
    static mineX: LogicProp;
    static mineY: LogicProp;
    static mining: LogicProp;
    static buildX: LogicProp;
    static buildY: LogicProp;
    static pingX: LogicProp;
    static pingY: LogicProp;
    static pingText: LogicProp;
    static building: LogicProp;
    static breaking: LogicProp;
    static speed: LogicProp;
    static team: LogicProp;
    static type: LogicProp;
    static flag: LogicProp;
    static flying: LogicProp;
    static controlled: LogicProp;
    static controller: LogicProp;
    static name: LogicProp;
    static payloadCount: LogicProp;
    static payloadType: LogicProp;
    static totalPayload: LogicProp;
    static payloadCapacity: LogicProp;
    static maxUnits: LogicProp;
    static id: LogicProp;
    static selectedBlock: LogicProp;
    static selectedRotation: LogicProp;
    static bulletLifetime: LogicProp;
    static bulletTime: LogicProp;
    static enabled: LogicProp;
    static shoot: LogicProp;
    static shootp: LogicProp;
    static config: LogicProp;
    static color: LogicProp;
}
/** mindustry.logic.LogicCategory */
declare class LogicCategory implements java.lang.Comparable<LogicCategory> {
    static readonly all: Seq<LogicCategory>;
    static readonly unknown: LogicCategory;
    static readonly io: LogicCategory;
    static readonly block: LogicCategory;
    static readonly operation: LogicCategory;
    static readonly control: LogicCategory;
    static readonly unit: LogicCategory;
    static readonly world: LogicCategory;

    readonly name: string;
    readonly id: number;
    readonly color: Color;
    readonly icon: Drawable|null;

    constructor(name: string, color: Color, icon?: Drawable)

    localized(): string
    description(): string
}
interface LogicCategory extends java.lang.Comparable<LogicCategory> {}
/** mindustry.logic.LogicUnitControl */
declare class LogicUnitControl {
    static idle: LogicUnitControl;
    static stop: LogicUnitControl;
    static move: LogicUnitControl;
    static approach: LogicUnitControl;
    static pathfind: LogicUnitControl;
    static autoPathfind: LogicUnitControl;
    static boost: LogicUnitControl;
    static target: LogicUnitControl;
    static targetp: LogicUnitControl;
    static itemDrop: LogicUnitControl;
    static itemTake: LogicUnitControl;
    static payDrop: LogicUnitControl;
    static payTake: LogicUnitControl;
    static payEnter: LogicUnitControl;
    static mine: LogicUnitControl;
    static flag: LogicUnitControl;
    static build: LogicUnitControl;
    static deconstruct: LogicUnitControl;
    static getBlock: LogicUnitControl;
    static within: LogicUnitControl;
    static unbind: LogicUnitControl;

    readonly params: Array<string>;
}
/** mindustry.logic.LogicLocate */
declare class LogicLocate {
    static ore: LogicLocate;
    static building: LogicLocate;
    static spawn: LogicLocate;
    static damaged: LogicLocate;
}
/** mindustry.logic.LogicDrawable */
interface LogicDrawable {
    drawable(exec: LogicExecutor): boolean
    draw(buffer: LongSeq): void
}
/** mindustry.logic.LogicCanvas */
declare class LogicCanvas extends Table {}
declare namespace LogicCanvas {
    class StatementElem extends Table {
        st: LogicStatement;
        index: number;
    }
}
/** mindustry.logic.LogicPrintable */
interface LogicPrintable {
    printable(exec: LogicExecutor): boolean
    print(strBuilder: java.lang.StringBuilder): void
}
/** mindustry.logic.LogicReadable */
interface LogicReadable {
    readable(exce: LogicExecutor): boolean
    read(pos: LogicVar, output: LogicVar): void
}
/** mindustry.logic.LogicWritable */
interface LogicWritable {
    writable(exce: LogicExecutor): boolean
    write(pos: LogicVar, output: LogicVar): void
}
/** mindustry.logic.LogicVar */
declare class LogicVar {
    readonly name: string;
    id: number;
    isobj: boolean;
    constant: boolean;
    objval: Object;
    numval: number;
    syncTime: java.lang.Long;

    constructor(name: string, id?: number, constant?: boolean)

    static invalid(num: number): boolean

    building(): Building|null
    obj(): Object|null
    team(): Team|null
    bool(): boolean
    num(): number
    numOrNan(): number
    numf(): java.lang.Float
    numfWorld(): java.lang.Float
    numfOrNan(): java.lang.Float
    numi(): java.lang.Integer
    setbool(bool: boolean): void
    setnum(num: number): void
    setobj(obj: Object): void
    setconst(obj: Object): void
    setlink(obj: Object): void
    set(other: LogicVar): void
}
/** mindustry.logic.LogicParser */
declare class LogicParser {}
/** mindustry.logic.LogicStatement */
declare class LogicStatement {}
/** mindustry.logic.LogicAssembler */
declare class LogicAssembler {}
/** mindustry.logic.LogicExecutor */
declare class LogicExecutor {}
/** mindustry.logic.LogicMarkerControl */
declare class LogicMarkerControl {
    static remove: LogicMarkerControl;
    static world: LogicMarkerControl;
    static minimap: LogicMarkerControl;
    static light: LogicMarkerControl;
    static autoscale: LogicMarkerControl;
    static pos: LogicMarkerControl;
    static endPos: LogicMarkerControl;
    static drawLayer: LogicMarkerControl;
    static color: LogicMarkerControl;
    static radius: LogicMarkerControl;
    static stroke: LogicMarkerControl;
    static outline: LogicMarkerControl;
    static rotation: LogicMarkerControl;
    static shape: LogicMarkerControl;
    static arc: LogicMarkerControl;
    static flushText: LogicMarkerControl;
    static fontSize: LogicMarkerControl;
    static textHeight: LogicMarkerControl;
    static textAlign: LogicMarkerControl;
    static lineAlign: LogicMarkerControl;
    static labelFlags: LogicMarkerControl;
    static texture: LogicMarkerControl;
    static textureSize: LogicMarkerControl;
    static posi: LogicMarkerControl;
    static uvi: LogicMarkerControl;
    static colori: LogicMarkerControl;

    readonly params: Array<string>;
}


/** mindustry.logic.FetchType */
declare class FetchType {
    static unit: FetchType;
    static unitCount: FetchType;
    static player: FetchType;
    static playerCount: FetchType;
    static core: FetchType;
    static coreCount: FetchType;
    static build: FetchType;
    static buildCount: FetchType;
}
/** mindustry.logic.RadarTarget */
declare class RadarTarget {
    static any: RadarTarget;
    static enemy: RadarTarget;
    static ally: RadarTarget;
    static player: RadarTarget;
    static attacker: RadarTarget;
    static flying: RadarTarget;
    static boss: RadarTarget;
    static ground: RadarTarget;

    readonly func: RadarTarget.RadarTargetFunc;
}
declare namespace RadarTarget {
    interface RadarTargetFunc {
        get(team: Team, ounit: Unit): boolean
    }
}
/** mindustry.logic.RadarSort */
declare class RadarSort {
    static distance: RadarSort;
    static health: RadarSort;
    static shield: RadarSort;
    static armor: RadarSort;
    static maxHealth: RadarSort;

    readonly func: RadarSort.RadarSortFunc;
}
declare namespace RadarSort {
    interface RadarSortFunc {
        get(posIns: Position, ounit: Unit): number
    }
}


/** mindustry.logic.LogicScript */
declare class LogicScript {}
/** mindustry.logic.TileLayer */
declare class TileLayer {
    static floor: TileLayer;
    static ore: TileLayer;
    static block: TileLayer;
    static building: TileLayer;
}
/** mindustry.logic.LogicRule */
declare class LogicRule {
    static currentWaveTime: LogicRule;
    static waveTimer: LogicRule;
    static waves: LogicRule;
    static wave: LogicRule;
    static waveSpacing: LogicRule;
    static waveSending: LogicRule;
    static attackMode: LogicRule;
    static enemyCoreBuildRadius: LogicRule;
    static dropZoneRadius: LogicRule;
    static unitCap: LogicRule;
    static mapArea: LogicRule;
    static lighting: LogicRule;
    static canGameOver: LogicRule;
    static ambientLight: LogicRule;
    static unitLight: LogicRule;
    static solarMultiplier: LogicRule;
    static dragMultiplier: LogicRule;
    static ban: LogicRule;
    static unban: LogicRule;
    static pauseDisabled: LogicRule;
    static musicVolume: LogicRule;

    static buildSpeed: LogicRule;
    static unitHealth: LogicRule;
    static unitBuildSpeed: LogicRule;
    static unitMineSpeed: LogicRule;
    static unitCost: LogicRule;
    static unitDamage: LogicRule;
    static blockHealth: LogicRule;
    static blockDamage: LogicRule;
    static rtsMinWeight: LogicRule;
    static rtsMinSquad: LogicRule;
}
/** mindustry.logic.LogicFx */
declare class LogicFx {}
/** mindustry.logic.MessageType */
declare class MessageType {
    static nofity: MessageType;
    static announce: MessageType;
    static toast: MessageType;
    static mission: MessageType;
}
/** mindustry.logic.QueryType */
declare class QueryType {
    static unit: QueryType;
    static building: QueryType;
    static bullet: QueryType;
}
/** mindustry.logic.QueryShape */
declare class QueryShape {
    static circle: QueryShape;
    static rect: QueryShape;
}
/** mindustry.logic.CutsceneAction */
declare class CutsceneAction {
    static active: CutsceneAction;
    static pan: CutsceneAction;
    static zoom: CutsceneAction;
    static stop: CutsceneAction;
    static shake: CutsceneAction;
    static getHud: CutsceneAction;
    static setHud: CutsceneAction;
}
