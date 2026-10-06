/** mindustry.world.blocks.liquid.LiquidBlock */
declare class LiquidBlock extends Block {}
declare namespace LiquidBlock {
    class LiquidBuild extends Building {}
}


/** mindustry.world.blocks.liquid.Conduit */
declare class Conduit extends LiquidBlock {}
declare namespace Conduit {
    class ConduitBuild extends LiquidBlock.LiquidBuild {}
}
/** mindustry.world.blocks.liquid.ArmoredConduit */
declare class ArmoredConduit extends Conduit {}
declare namespace ArmoredConduit {
    class ArmoredConduitBuild extends Conduit.ConduitBuild {}
}


/** mindustry.world.blocks.liquid.LiquidBridge */
declare class LiquidBridge extends ItemBridge {}
declare namespace LiquidBridge {
    class LiquidBridgeBuild extends ItemBridge.ItemBridgeBuild {}
}
/** mindustry.world.blocks.liquid.DirectionLiquidBridge */
declare class DirectionLiquidBridge extends DirectionBridge {}
declare namespace DirectionLiquidBridge {
    class DirectionLiquidBridgeBuild extends DirectionBridge.DirectionBridgeBuild {}
}


/** mindustry.world.blocks.liquid.LiquidJunction */
declare class LiquidJunction extends LiquidBlock {}
declare namespace LiquidJunction {
    class LiquidJunctionBuild extends LiquidBlock.LiquidBuild {}
}
