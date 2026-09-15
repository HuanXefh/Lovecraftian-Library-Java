/** mindustry.logic.GlobalVars */
declare class GlobalVars {}


/** mindustry.logic.Senseable */
interface Senseable {}
/** mindustry.logic.Settable */
interface Settable {}
/** mindustry.logic.Controllable */
interface Controllable {}
/** mindustry.logic.Displayable */
interface Displayable {}


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
    static mermoryCapacity: LAccess;
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
/** mindustry.logic.LLocate */
declare class LLocate {
    static ore: LLocate;
    static building: LLocate;
    static spawn: LLocate;
    static damaged: LLocate;
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
