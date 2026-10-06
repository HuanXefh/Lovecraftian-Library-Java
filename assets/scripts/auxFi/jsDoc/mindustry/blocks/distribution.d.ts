/** mindustry.world.blocks.distribution.Conveyor */
declare class Conveyor extends Block {}
declare namespace Conveyor {
    class ConveyorBuild extends Building {}
}
/** mindustry.world.blocks.distribution.ArmoredConveyor */
declare class ArmoredConveyor extends Conveyor {}
declare namespace ArmoredConveyor {
    class ArmoredConveyorBuild extends Conveyor.ConveyorBuild {}
}
/** mindustry.world.blocks.distribution.StackConveyor */
declare class StackConveyor extends Block {}
declare namespace StackConveyor {
    class StackConveyorBuild extends Building {}
}
/** mindustry.world.blocks.distribution.Duct */
declare class Duct extends Block {}
declare namespace Duct {
    class DuctBuild extends Building {}
}


/** mindustry.world.blocks.distribution.ItemBridge */
declare class ItemBridge extends Block {}
declare namespace ItemBridge {
    class ItemBridgeBuild extends Building {}
}
/** mindustry.world.blocks.distribution.BufferedItemBridge */
declare class BufferedItemBridge extends ItemBridge {}
declare namespace BufferedItemBridge {
    class BufferedItemBridgeBuild extends ItemBridge.ItemBridgeBuild {}
}
/** mindustry.world.blocks.distribution.DirectionBridge */
declare class DirectionBridge extends Block {}
declare namespace DirectionBridge {
    class DirectionBridgeBuild extends Building {}
}


/** mindustry.world.blocks.distribution.Junction */
declare class Junction extends Block {}
declare namespace Junction {
    class JunctionBuild extends Building {}
}
/** mindustry.world.blocks.distribution.DuctJunction */
declare class DuctJunction extends Block {}
declare namespace DuctJunction {
    class DuctJunctionBuild extends Building {}
}
/** mindustry.world.blocks.distribution.Router */
declare class Router extends Block {}
declare namespace Router {
    class RouterBuild extends Building implements ControlBlock {}
    interface RouterBuild extends ControlBlock {}
}
/** mindustry.world.blocks.distribution.DuctRouter */
declare class DuctRouter extends Block {}
declare namespace DuctRouter {
    class DuctRouterBuild extends Building {}
}
/** mindustry.world.blocks.distribution.StackRouter */
declare class StackRouter extends DuctRouter {}
declare namespace StackRouter {
    class StackRouterBuild extends DuctRouter.DuctRouterBuild {}
}
/** mindustry.world.blocks.distribution.Sorter */
declare class Sorter extends Block {}
declare namespace Sorter {
    class SorterBuild extends Building {}
}
/** mindustry.world.blocks.distribution.OverflowGate */
declare class OverflowGate extends Block {}
declare namespace OverflowGate {
    class OverflowGateBuild extends Building {}
}
/** mindustry.world.blocks.distribution.OverflowDuct */
declare class OverflowDuct extends Block {}
declare namespace OverflowDuct {
    class OverflowDuctBuild extends Building {}
}
/** mindustry.world.blocks.storage.Unloader */
declare class Unloader extends Block {}
declare namespace Unloader {
    class UnloaderBuild extends Building {}
}
/** mindustry.world.blocks.distribution.DirectionalUnloader */
declare class DirectionalUnloader extends Block {}
declare namespace DirectionalUnloader {
    class DirectionalUnloaderBuild extends Building {}
}


/** mindustry.world.blocks.distribution.MassDriver */
declare class MassDriver extends Block {}
declare namespace MassDriver {
    class MassDriverBuild extends Building implements RotBlock {}
    interface MassDriverBuild extends RotBlock {}
    class DriverState {
        static idle: DriverState;
        static accepting: DriverState;
        static shooting: DriverState;
    }
}
