/** mindustry.world.blocks.production.Drill */
declare class Drill extends Block {}
declare namespace Drill {
    class DrillBuild extends Building {}
}
/** mindustry.world.blocks.production.BurstDrill */
declare class BurstDrill extends Drill {}
declare namespace BurstDrill {
    class BurstDrillBuild extends Drill.DrillBuild {}
}
/** mindustry.world.blocks.production.BeamDrill */
declare class BeamDrill extends Block {}
declare namespace BeamDrill {
    class BeamDrillBuild extends Building {}
}
/** mindustry.world.blocks.production.WallCrafter */
declare class WallCrafter extends Block {}
declare namespace WallCrafter {
    class WallCrafterBuild extends Building {}
}


/** mindustry.world.blocks.production.Pump */
declare class Pump extends LiquidBlock {}
declare namespace Pump {
    class PumpBuild extends LiquidBlock.LiquidBuild {}
}
/**
 * mindustry.world.blocks.production.SolidPump
 * @deprecated Removed in v9.
 */
declare class SolidPump extends Pump {}
declare namespace SolidPump {
    class SolidPumpBuild extends Pump.PumpBuild {}
}
/**
 * mindustry.world.blocks.production.Fracker
 * @deprecated Removed in v9.
 */
declare class Fracker extends SolidPump {}
declare namespace Fracker {
    class FrackerBuild extends SolidPump.SolidPumpBuild {}
}


/** mindustry.world.blocks.production.Incinerator */
declare class Incinerator extends Block {}
declare namespace Incinerator {
    class IncineratorBuild extends Building {}
}
/** mindustry.world.blocks.production.ItemIncinerator */
declare class ItemIncinerator extends Block {}
declare namespace ItemIncinerator {
    class ItemIncineratorBuild extends Building {}
}


/** mindustry.world.blocks.production.Separator */
declare class Separator extends Block {}
declare namespace Separator {
    class SeparatorBuild extends Building {}
}
/** mindustry.world.blocks.production.GenericCrafter */
declare class GenericCrafter extends Block {}
declare namespace GenericCrafter {
    class GenericCrafterBuild extends Building {}
}
/**
 * mindustry.world.blocks.production.AttributeCrafter
 * @deprecated Removed in v9.
 */
declare class AttributeCrafter extends GenericCrafter {}
declare namespace AttributeCrafter {
    class AttributeCrafterBuild extends GenericCrafter.GenericCrafterBuild {}
}
