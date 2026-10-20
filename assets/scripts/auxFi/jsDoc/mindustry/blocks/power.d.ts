/** mindustry.world.blocks.power.PowerBlock */
declare class PowerBlock extends Block {}
/** mindustry.world.blocks.power.PowerDistributor */
declare class PowerDistributor extends PowerBlock {}


/** mindustry.world.blocks.power.BeamNode */
declare class BeamNode extends PowerBlock {}
declare namespace BeamNode {
    class BeamNodeBuild extends Building {}
}


/** mindustry.world.blocks.power.PowerNode */
declare class PowerNode extends PowerBlock {}
declare namespace PowerNode {
    class PowerNodeBuild extends Building {}
}
/** mindustry.world.blocks.power.LongPowerNode */
declare class LongPowerNode extends PowerNode {}
declare namespace LongPowerNode {
    class LongPowerNodeBuild extends PowerNode.PowerNodeBuild {}
}


/** mindustry.world.blocks.power.Battery */
declare class Battery extends PowerDistributor {}
declare namespace Battery {
    class BatteryBuild extends Building {}
}


/** mindustry.world.blocks.power.PowerDiode */
declare class PowerDiode extends Block {}
declare namespace PowerDiode {
    class PowerDiodeBuild extends Building {}
}


/** mindustry.world.blocks.power.PowerGenerator */
declare class PowerGenerator extends PowerDistributor {}
declare namespace PowerGenerator {
    class GeneratorBuild extends Building {}
}


/** mindustry.world.blocks.power.ConsumeGenerator */
declare class ConsumeGenerator extends PowerGenerator {}
declare namespace ConsumeGenerator {
    class ConsumeGeneratorBuild extends PowerGenerator.GeneratorBuild {}
}


/** mindustry.world.blocks.power.ThermalGenerator */
declare class ThermalGenerator extends PowerGenerator {}
declare namespace ThermalGenerator {
    class ThermalGeneratorBuild extends PowerGenerator.GeneratorBuild {}
}


/** mindustry.world.blocks.power.ThermalGenerator */
declare class NuclearReactor extends PowerGenerator {}
declare namespace NuclearReactor {
    class NuclearReactorBuild extends PowerGenerator.GeneratorBuild implements HeatBlock {}
    interface NuclearReactorBuild extends HeatBlock {}
}


/** mindustry.world.blocks.power.ImpactReactor */
declare class ImpactReactor extends PowerGenerator {}
declare namespace ImpactReactor {
    class ImpactReactorBuild extends PowerGenerator.GeneratorBuild {}
}


/** mindustry.world.blocks.power.VariableReactor */
declare class VariableReactor extends PowerGenerator {}
declare namespace VariableReactor {
    class VariableReactorBuild extends PowerGenerator.GeneratorBuild implements HeatConsumer {}
    interface VariableReactorBuild extends HeatConsumer {}
}


/** mindustry.world.blocks.power.SolarGenerator */
declare class SolarGenerator extends PowerGenerator {}
declare namespace SolarGenerator {
    class SolarGeneratorBuild extends PowerGenerator.GeneratorBuild {}
}


/** mindustry.world.blocks.power.LightBlock */
declare class LightBlock extends Block {}
declare namespace LightBlock {
    class LightBuild extends Building {}
}
