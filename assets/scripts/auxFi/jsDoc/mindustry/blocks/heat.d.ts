/**
 * mindustry.world.blocks.heat.HeatBlock
 * @deprecated Removed in v9.
 */
interface HeatBlock {
    heat(): number
    heatFrac(): number
}
/**
 * mindustry.world.blocks.heat.HeatConsumer
 * @deprecated Removed in v9.
 */
interface HeatConsumer {
    sideHeat(): JavaArray<java.lang.Float>
    heatRequirement(): number
}
/**
 * mindustry.world.blocks.heat.HeatProducer
 * @deprecated Removed in v9.
 */
declare class HeatProducer extends GenericCrafter {}
declare namespace HeatProducer {
    class HeatProducerBuild extends GenericCrafter.GenericCrafterBuild implements HeatBlock {}
    interface HeatProducerBuild extends HeatBlock {}
}
/**
 * mindustry.world.blocks.heat.HeatCrafter
 * @deprecated Removed in v9.
 */
declare class HeatCrafter extends GenericCrafter {}
declare namespace HeatCrafter {
    class HeatCrafterBuild extends GenericCrafter.GenericCrafterBuild implements HeatConsumer {}
    interface HeatCrafterBuild extends HeatConsumer {}
}
/**
 * mindustry.world.blocks.power.HeaterGenerator
 * @deprecated Removed in v9.
 */
declare class HeaterGenerator extends ConsumeGenerator {}
declare namespace HeaterGenerator {
    class HeaterGeneratorBuild extends ConsumeGenerator.ConsumeGeneratorBuild implements HeatBlock {}
    interface HeaterGeneratorBuild extends HeatBlock {}
}


/** mindustry.world.blocks.heat.HeatConductor */
declare class HeatConductor extends Block {}
declare namespace HeatConductor {
    class HeatConductorBuild extends Building implements HeatBlock, HeatConsumer {}
    interface HeatConductorBuild extends HeatBlock, HeatConsumer {}
}
