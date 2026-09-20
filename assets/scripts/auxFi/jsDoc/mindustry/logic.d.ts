/** mindustry.logic.GlobalVars */
declare class GlobalVars {}


/** mindustry.logic.Ranged */
interface Ranged extends Posc, Teamc {}
/** mindustry.logic.Senseable */
interface Senseable {}
/** mindustry.logic.Settable */
interface Settable {}
/** mindustry.logic.Controllable */
interface Controllable {}
/** mindustry.logic.Displayable */
interface Displayable {}


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


/** mindustry.logic.LAccess */
declare class LAccess {
    static totalItems: LAccess;
    static firstItem: LAccess;
    static totalLiquids: LAccess;
    static totalPower: LAccess;
    static itemCapacity: LAccess;
    static liquidCapacity: LAccess;
    static powerCapacity: LAccess;
    static powerNetStored: LAccess;
    static powerNetCapacity: LAccess;
    static powerNetIn: LAccess;
    static powerNetOut: LAccess;
    static ammo: LAccess;
    static ammoCapacity: LAccess;
    static currentAmmoType: LAccess;
    static memoryCapacity: LAccess;
    static health: LAccess;
    static maxHealth: LAccess;
    static heat: LAccess;
    static shield: LAccess;
    static armor: LAccess;
    static efficiency: LAccess;
    static progress: LAccess;
    static timescale: LAccess;
    static rotation: LAccess;
    static x: LAccess;
    static y: LAccess;
    static velocityX: LAccess;
    static velocityY: LAccess;
    static shootX: LAccess;
    static shootY: LAccess;
    static cameraX: LAccess;
    static cameraY: LAccess;
    static cameraWidth: LAccess;
    static cameraHeight: LAccess;
    static displayWidth: LAccess;
    static displayHeight: LAccess;
    static bufferSize: LAccess;
    static operations: LAccess;
    static size: LAccess;
    static solid: LAccess;
    static dead: LAccess;
    static range: LAccess;
    static shooting: LAccess;
    static boosting: LAccess;
    static mineX: LAccess;
    static mineY: LAccess;
    static mining: LAccess;
    static buildX: LAccess;
    static buildY: LAccess;
    static pingX: LAccess;
    static pingY: LAccess;
    static pingText: LAccess;
    static building: LAccess;
    static breaking: LAccess;
    static speed: LAccess;
    static team: LAccess;
    static type: LAccess;
    static flag: LAccess;
    static flying: LAccess;
    static controlled: LAccess;
    static controller: LAccess;
    static name: LAccess;
    static payloadCount: LAccess;
    static payloadType: LAccess;
    static totalPayload: LAccess;
    static payloadCapacity: LAccess;
    static maxUnits: LAccess;
    static id: LAccess;
    static selectedBlock: LAccess;
    static selectedRotation: LAccess;
    static bulletLifetime: LAccess;
    static bulletTime: LAccess;
    static enabled: LAccess;
    static shoot: LAccess;
    static shootp: LAccess;
    static config: LAccess;
    static color: LAccess;
}
/** mindustry.logic.LCategory */
declare class LCategory implements java.lang.Comparable<LCategory> {
    static readonly all: Seq<LCategory>;
    static readonly unknown: LCategory;
    static readonly io: LCategory;
    static readonly block: LCategory;
    static readonly operation: LCategory;
    static readonly control: LCategory;
    static readonly unit: LCategory;
    static readonly world: LCategory;

    readonly name: string;
    readonly id: number;
    readonly color: Color;
    readonly icon: Drawable|null;

    constructor(name: string, color: Color, icon?: Drawable)

    localized(): string
    description(): string
}
interface LCategory extends java.lang.Comparable<LCategory> {}
/** mindustry.logic.LUnitControl */
declare class LUnitControl {
    static idle: LUnitControl;
    static stop: LUnitControl;
    static move: LUnitControl;
    static approach: LUnitControl;
    static pathfind: LUnitControl;
    static autoPathfind: LUnitControl;
    static boost: LUnitControl;
    static target: LUnitControl;
    static targetp: LUnitControl;
    static itemDrop: LUnitControl;
    static itemTake: LUnitControl;
    static payDrop: LUnitControl;
    static payTake: LUnitControl;
    static payEnter: LUnitControl;
    static mine: LUnitControl;
    static flag: LUnitControl;
    static build: LUnitControl;
    static deconstruct: LUnitControl;
    static getBlock: LUnitControl;
    static within: LUnitControl;
    static unbind: LUnitControl;

    readonly params: Array<string>;
}
/** mindustry.logic.LLocate */
declare class LLocate {
    static ore: LLocate;
    static building: LLocate;
    static spawn: LLocate;
    static damaged: LLocate;
}
/** mindustry.logic.LDrawable */
interface LDrawable {
    drawable(exec: LExecutor): boolean
    draw(buffer: LongSeq): void
}
/** mindustry.logic.LCanvas */
declare class LCanvas extends Table {}
declare namespace LCanvas {
    class StatementElem extends Table {
        st: LStatement;
        index: number;
    }
}
/** mindustry.logic.LPrintable */
interface LPrintable {
    printable(exec: LExecutor): boolean
    print(strBuilder: java.lang.StringBuilder): void
}
/** mindustry.logic.LReadable */
interface LReadable {
    readable(exce: LExecutor): boolean
    read(pos: LVar, output: LVar): void
}
/** mindustry.logic.LWritable */
interface LWritable {
    writable(exce: LExecutor): boolean
    write(pos: LVar, output: LVar): void
}
/** mindustry.logic.LVar */
declare class LVar {
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
    set(other: LVar): void
}
/** mindustry.logic.LParser */
declare class LParser {}
/** mindustry.logic.LStatement */
declare class LStatement {}
/** mindustry.logic.LStatements */
declare class LStatements {}
declare namespace LStatements {
    class CommentStatement extends LStatement {
        comment: string;
    }
    class InvalidStatement extends LStatement {}
    class ReadStatement extends LStatement {
        output: string;
        target: string;
        address: string;
    }
    class WriteStatement extends LStatement {
        input: string;
        target: string;
        address: string;
    }
    class DrawStatement extends LStatement {
        type: LogicDisplay.GraphicsType;
        x: string;
        y: string;
        p1: string;
        p2: string;
        p3: string;
        p4: string;
    }
    class PrintStatement extends LStatement {
        value: string;
    }
    class PrintCharStatement extends LStatement {
        value: string;
    }
    class FormatStatement extends LStatement {
        value: string;
    }
    class DrawFlushStatement extends LStatement {
        target: string;
    }
    class PrintFlushStatement extends LStatement {
        target: string;
    }
    class GetLinkStatement extends LStatement {
        output: string;
        address: string;
    }
    class ControlStatement extends LStatement {
        type: LAccess;
        target: string;
        p1: string;
        p2: string;
        p3: string;
        p4: string;
    }
    class RadarStatement extends LStatement {
        target1: RadarTarget;
        target2: RadarTarget;
        target3: RadarTarget;
        sort: RadarSort;
        radar: string;
        sortOrder: string;
        output: string;
    }
    class SensorStatement extends LStatement {
        to: string;
        from: string;
        type: string;
    }
    class SetStatement extends LStatement {
        to: string;
        from: string;
    }
    class OperationStatement extends LStatement {
        op: LogicOp;
        dest: string;
        a: string;
        b: string;
    }
    class SelectStatement extends LStatement {
        result: string;
        op: ConditionOp;
        comp0: string;
        comp1: string;
        a: string;
        b: string;
    }
    class WaitStatement extends LStatement {
        value: string;
    }
    class StopStatement extends LStatement {}
    class LookupStatement extends LStatement {
        type: ContentType;
        result: string;
        id: string;
    }
    class PackColorStatement extends LStatement {
        result: string;
        r: string;
        g: string;
        b: string;
        a: string;
    }
    class UnpackColorStatement extends LStatement {
        r: string;
        g: string;
        b: string;
        a: string;
        value: string;
    }
    class EndStatement extends LStatement {}
    class JumpStatement extends LStatement {
        dest: LCanvas.StatementElem;
        destIndex: number;
        op: ConditionOp;
        value: string;
        compare: string;
    }
    class UnitBindStatement extends LStatement {
        type: string;
    }
    class UnitControlStatement extends LStatement {
        type: LUnitControl;
        p1: string;
        p2: string;
        p3: string;
        p4: string;
        p5: string;
    }
    class UnitRadarStatement extends RadarStatement {}
    class UnitLocateStatement extends LStatement {
        locate: LLocate;
        flag: BlockFlag;
        enemy: string;
        ore: string;
        outX: string;
        outY: string;
        outFound: string;
        outBuild: string;
    }
    class QueryStatement extends LStatement {
        shape: QueryShape;
        type: QueryType;
        team: string;
        x: string;
        y: string;
        w: string;
        h: string;
    }
    class GetBlockStatement extends LStatement {
        layer: TileLayer;
        result: string;
        x: string;
        y: string;
    }
    class SetBlockStatement extends LStatement {
        layer: TileLayer;
        block: string;
        x: string;
        y: string;
        team: string;
        rotation: string;
    }
    class SpawnUnitStatement extends LStatement {
        type: string;
        x: string;
        y: string;
        rotation: string;
        team: string;
        result: string;
        effect: string;
    }
    class SpawnBulletStatement extends LStatement {
        result: string;
        from: string;
        index: string;
        x: string;
        y: string;
        rotation: string;
        team: string;
        owner: string;
        damage: string;
        velocityScl: string;
        lifeScl: string;
        aimX: string;
        aimY: string;
    }
    class ApplyStatusStatement extends LStatement {
        clear: boolean;
        effect: string;
        unit: string;
        duration: string;
    }
    class WeatherSenseStatement extends LStatement {
        to: string;
        weather: string;
    }
    class WeatherSetStatement extends LStatement {
        weather: string;
        state: string;
    }
    class SpawnWaveStatement extends LStatement {
        x: string;
        y: string;
        natural: string;
    }
    class SetRuleStatement extends LStatement {
        rule: LogicRule;
        value: string;
        p1: string;
        p2: string;
        p3: string;
        p4: string;
    }
    class FlushMessageStatement extends LStatement {
        type: MessageType;
        duration: string;
        outSuccess: string;
    }
    class CutsceneStatement extends LStatement {
        action: CutsceneAction;
        p1: string;
        p2: string;
        p3: string;
        p4: string;
    }
    class EffectStatement extends LStatement {
        type: string;
        x: string;
        y: string;
        sizerot: string;
        color: string;
        data: string;
    }
    class ExplosionStatement extends LStatement {
        team: string;
        x: string;
        y: string;
        radius: string;
        damage: string;
        air: string;
        ground: string;
        pierce: string;
        effect: string;
    }
    class SetRateStatement extends LStatement {
        amount: string;
    }
    class FetchStatStatement extends LStatement {
        type: FetchType;
        result: string;
        team: string;
        index: string;
        extra: string;
    }
    class SyncStatement extends LStatement {
        variable: string;
    }
    class ClientDataStatement extends LStatement {
        channel: string;
        value: string;
        reliable: string;
    }
    class GetFlagStatement extends LStatement {
        result: string;
        flag: string;
    }
    class SetFlagStatement extends LStatement {
        flag: string;
        value: string;
    }
    class SetPropStatement extends LStatement {
        type: string;
        of: string;
        value: string;
    }
    class PlaySoundStatement extends LStatement {
        positional: boolean;
        id: string;
        volume: string;
        pitch: string;
        pan: string;
        x: string;
        y: string;
        limit: string;
    }
    class PlayMusicStatement extends LStatement {
        name: string;
        interrupt: string;
    }
    class SetMarkerStatement extends LStatement {
        type: LMarkerControl;
        id: string;
        p1: string;
        p2: string;
        p3: string;
    }
    class MakeMarkerStatement extends LStatement {
        type: string;
        id: string;
        x: string;
        y: string;
        replace: string;
    }
    class LogicPrintStatement extends LStatement {
        value: string;
    }
}
/** mindustry.logic.LAssembler */
declare class LAssembler {}
/** mindustry.logic.LExecutor */
declare class LExecutor {}
/** mindustry.logic.LMarkerControl */
declare class LMarkerControl {
    static remove: LMarkerControl;
    static world: LMarkerControl;
    static minimap: LMarkerControl;
    static light: LMarkerControl;
    static autoscale: LMarkerControl;
    static pos: LMarkerControl;
    static endPos: LMarkerControl;
    static drawLayer: LMarkerControl;
    static color: LMarkerControl;
    static radius: LMarkerControl;
    static stroke: LMarkerControl;
    static outline: LMarkerControl;
    static rotation: LMarkerControl;
    static shape: LMarkerControl;
    static arc: LMarkerControl;
    static flushText: LMarkerControl;
    static fontSize: LMarkerControl;
    static textHeight: LMarkerControl;
    static textAlign: LMarkerControl;
    static lineAlign: LMarkerControl;
    static labelFlags: LMarkerControl;
    static texture: LMarkerControl;
    static textureSize: LMarkerControl;
    static posi: LMarkerControl;
    static uvi: LMarkerControl;
    static colori: LMarkerControl;

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
