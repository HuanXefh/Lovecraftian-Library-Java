/** mindustry.world.blocks.defense.turrets.BaseTurret */
declare class BaseTurret extends Block {}
declare namespace BaseTurret {
    class BaseTurretBuild extends Building implements Ranged, RotBlock {}
    interface BaseTurretBuild extends Ranged, RotBlock {}
}


/** mindustry.world.blocks.defense.BuildTurret */
declare class BuildTurret extends BaseTurret {}
declare namespace BuildTurret {
    class BuildTurretBuild extends BaseTurret.BaseTurretBuild implements ControlBlock, RotBlock {}
    interface BuildTurretBuild extends ControlBlock, RotBlock {}
}


/** mindustry.world.blocks.defense.turrets.TractorBeamTurret */
declare class TractorBeamTurret extends BaseTurret {}
declare namespace TractorBeamTurret {
    class TractorBeamTurretBuild extends BaseTurret.BaseTurretBuild {}
}
/** mindustry.world.blocks.defense.turrets.ReloadTurret */
declare class ReloadTurret extends BaseTurret {}
declare namespace ReloadTurret {
    class ReloadTurretBuild extends BaseTurret.BaseTurretBuild {}
}
/** mindustry.world.blocks.defense.turrets.PointDefenseTurret */
declare class PointDefenseTurret extends ReloadTurret {}
declare namespace PointDefenseTurret {
    class PointDefenseTurretBuild extends ReloadTurret.ReloadTurretBuild {}
}
/** mindustry.world.blocks.defense.turrets.Turret */
declare class Turret extends ReloadTurret {}
declare namespace Turret {
    class TurretBuild extends ReloadTurret.ReloadTurretBuild implements ControlBlock {}
    interface TurretBuild extends ControlBlock {}
}
/** mindustry.world.blocks.defense.turrets.ItemTurret */
declare class ItemTurret extends Turret {}
declare namespace ItemTurret {
    class ItemTurretBuild extends Turret.TurretBuild {}
}
/** mindustry.world.blocks.defense.turrets.LiquidTurret */
declare class LiquidTurret extends Turret {}
declare namespace LiquidTurret {
    class LiquidTurretBuild extends Turret.TurretBuild {}
}
/** mindustry.world.blocks.defense.turrets.PowerTurret */
declare class PowerTurret extends Turret {}
declare namespace PowerTurret {
    class PowerTurretBuild extends Turret.TurretBuild {}
}
/** mindustry.world.blocks.defense.turrets.LaserTurret */
declare class LaserTurret extends PowerTurret {}
declare namespace LaserTurret {
    class LaserTurretBuild extends PowerTurret.PowerTurretBuild {}
}
/** mindustry.world.blocks.defense.turrets.PayloadAmmoTurret */
declare class PayloadAmmoTurret extends Turret {}
declare namespace PayloadAmmoTurret {
    class PayloadAmmoTurretBuild extends Turret.TurretBuild {}
}
/** mindustry.world.blocks.defense.turrets.ContinuousTurret */
declare class ContinuousTurret extends Turret {}
declare namespace ContinuousTurret {
    class ContinuousTurretBuild extends Turret.TurretBuild {}
}
/** mindustry.world.blocks.defense.turrets.ContinuousLiquidTurret */
declare class ContinuousLiquidTurret extends ContinuousTurret {}
declare namespace ContinuousLiquidTurret {
    class ContinuousLiquidTurret extends ContinuousTurret.ContinuousTurretBuild {}
}
