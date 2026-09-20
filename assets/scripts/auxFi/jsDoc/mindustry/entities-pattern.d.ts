/** mindustry.entities.pattern.ShootPattern */
declare class ShootPattern implements java.lang.Cloneable {
    shots: number;
    firstShotDelay: number;
    shotDelay: number;
}
interface ShootPattern extends java.lang.Cloneable {}
declare namespace ShootPattern {
    interface BulletHandler {
        shoot(x: number, y: number, rotation: number, delay: number): void
    }
}


/** mindustry.entities.pattern.ShootMulti */
declare class ShootMulti extends ShootPattern {
    source: ShootPattern;
    dest: Array<ShootPattern>;
}
/** mindustry.entities.pattern.ShootAlternate */
declare class ShootAlternate extends ShootPattern {
    barrels: number;
    spread: number;
    barrelOffset: number;
    mirror: boolean;
}
/** mindustry.entities.pattern.ShootBarrel */
declare class ShootBarrel extends ShootPattern {
    barrels: Array<number>;
    barrelOffset: number;
}
/** mindustry.entities.pattern.ShootHelix */
declare class ShootHelix extends ShootPattern {
    scl: number;
    mag: number;
    offset: number;
}
/** mindustry.entities.pattern.ShootSine */
declare class ShootSine extends ShootPattern {
    scl: number;
    mag: number;
}
/** mindustry.entities.pattern.ShootSpread */
declare class ShootSpread extends ShootPattern {
    spread: number;

    static circle(points: number): ShootSpread
}
/** mindustry.entities.pattern.ShootSummon */
declare class ShootSummon extends ShootPattern {
    x: number;
    y: number;
    radius: number;
    spread: number;
}
