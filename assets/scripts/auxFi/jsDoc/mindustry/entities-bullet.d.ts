/** mindustry.entities.Mover */
interface Mover {}
/** mindustry.entities.Predict */
declare class Predict {
    static intercept(shooterX: number, shooterY: number, targetX: number, targetY: number, targetVelX: number, targetVelY: number, vel: number): Vec2
    static intercept(shooter: Position, target: Position, vel: number): Vec2
    static intercept(shooter: Position, target: Position, btp: BulletType): Vec2
    static intercept(shooter: Position, target: Position, offX: number, offY: number, useShooterVel: boolean, vel: number): Vec2
    static intercept(shooter: Hitboxc, target: Hitboxc, vel: number): Vec2
}


/** mindustry.entities.bullet.BulletType */
declare class BulletType extends Content implements java.lang.Cloneable {}


/** mindustry.entities.bullet.MultiBulletType */
declare class MultiBulletType extends BulletType {
    bullets: Array<BulletType>;
    repeat: number;
}
/** mindustry.entities.bullet.EmptyBulletType */
declare class EmptyBulletType extends BulletType {}
/** mindustry.entities.bullet.ExplosionBulletType */
declare class ExplosionBulletType extends BulletType {}
/** mindustry.entities.bullet.FireBulletType */
declare class FireBulletType extends BulletType {}
/** mindustry.entities.bullet.BasicBulletType */
declare class BasicBulletType extends BulletType {}
/** mindustry.entities.bullet.LaserBulletType */
declare class LaserBulletType extends BulletType {}
/** mindustry.entities.bullet.LightningBulletType */
declare class LightningBulletType extends BulletType {}
/** mindustry.entities.bullet.LiquidBulletType */
declare class LiquidBulletType extends BulletType {}
/** mindustry.entities.bullet.SpaceLiquidBulletType */
declare class SpaceLiquidBulletType extends BulletType {}
/** mindustry.entities.bullet.PointBulletType */
declare class PointBulletType extends BulletType {}
/** mindustry.entities.bullet.PointLaserBulletType */
declare class PointLaserBulletType extends BulletType {}
/** mindustry.entities.bullet.RailBulletType */
declare class RailBulletType extends BulletType {}
/** mindustry.entities.bullet.SapBulletType */
declare class SapBulletType extends BulletType {}
/** mindustry.entities.bullet.ShrapnelBulletType */
declare class ShrapnelBulletType extends BulletType {}
/** mindustry.entities.bullet.ArtilleryBulletType */
declare class ArtilleryBulletType extends BasicBulletType {}
/** mindustry.entities.bullet.BombBulletType */
declare class BombBulletType extends BasicBulletType {}
/** mindustry.entities.bullet.EmpBulletType */
declare class EmpBulletType extends BasicBulletType {}
/** mindustry.entities.bullet.FlakBulletType */
declare class FlakBulletType extends BasicBulletType {}
/** mindustry.entities.bullet.InterceptorBulletType */
declare class InterceptorBulletType extends BasicBulletType {}
/** mindustry.entities.bullet.LaserBoltBulletType */
declare class LaserBoltBulletType extends BasicBulletType {}
/** mindustry.entities.bullet.MissileBulletType */
declare class MissileBulletType extends BasicBulletType {}
/** mindustry.entities.bullet.ContinuousBulletType */
declare class ContinuousBulletType extends BulletType {}
/** mindustry.entities.bullet.ContinuousFlameBulletType */
declare class ContinuousFlameBulletType extends ContinuousBulletType {}
/** mindustry.entities.bullet.ContinuousLaserBulletType */
declare class ContinuousLaserBulletType extends ContinuousBulletType {}
/** mindustry.entities.bullet.MassDriverBolt */
declare class MassDriverBolt extends BasicBulletType {}
