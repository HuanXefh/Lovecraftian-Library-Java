/** mindustry.world.blocks.logic.LogicBlock */
declare class LogicBlock extends Block {}
declare namespace LogicBlock {
    class LogicBuild extends Building implements Ranged, LogicReadable, LogicWritable {}
    interface LogicBuild extends Ranged, LogicReadable, LogicWritable {}
    class LogicLink {
        valid: boolean;
        x: number;
        y: number;
        name: string;
        lastBuild: Building;
        logicVar: LogicVar|null;
    }
}


/** mindustry.world.blocks.logic.CanvasBlock */
declare class CanvasBlock extends Block {}
declare namespace CanvasBlock {
    class CanvasBuild extends Building implements LogicReadable, LogicWritable {}
    interface CanvasBuild extends LogicReadable, LogicWritable {}
}


/** mindustry.world.blocks.logic.LogicDisplay */
declare class LogicDisplay extends Block {}
declare namespace LogicDisplay {
    class LogicDisplayBuild extends Building implements LogicDrawable {}
    interface LogicDisplayBuild extends LogicDrawable {}
}
/** mindustry.world.blocks.logic.TileableLogicDisplay */
declare class TileableLogicDisplay extends LogicDisplay {}
declare namespace TileableLogicDisplay {
    class TileableLogicDisplayBuild extends LogicDisplay.LogicDisplayBuild {}
}


/** mindustry.world.blocks.logic.MemoryBlock */
declare class MemoryBlock extends Block {}
declare namespace MemoryBlock {
    class MemoryBuild extends Building implements LogicReadable, LogicWritable {}
    interface MemoryBuild extends LogicReadable, LogicWritable {}
}


/** mindustry.world.blocks.logic.MessageBlock */
declare class MessageBlock extends Block {}
declare namespace MessageBlock {
    class MessageBuild extends Building implements LogicReadable, LogicPrintable {}
    interface MessageBuild extends LogicReadable, LogicPrintable {}
}


/** mindustry.world.blocks.logic.SwitchBlock */
declare class SwitchBlock extends Block {}
declare namespace SwitchBlock {
    class SwitchBuild extends Building {}
}
