/** mindustry.world.blocks.sandbox.ItemSource */
declare class ItemSource extends Block {}
declare namespace ItemSource {
    class ItemSourceBuild extends Building {}
}
/** mindustry.world.blocks.sandbox.ItemVoid */
declare class ItemVoid extends Block {}
declare namespace ItemVoid {
    class ItemVoidBuild extends Building {}
}


/** mindustry.world.blocks.sandbox.LiquidSource */
declare class LiquidSource extends Block {}
declare namespace LiquidSource {
    class LiquidSourceBuild extends Building {}
}
/** mindustry.world.blocks.sandbox.LiquidVoid */
declare class LiquidVoid extends Block {}
declare namespace LiquidVoid {
    class LiquidVoidBuild extends Building {}
}


/** mindustry.world.blocks.sandbox.PowerSource */
declare class PowerSource extends Block {}
declare namespace PowerSource {
    class PowerSourceBuild extends Building {}
}
/** mindustry.world.blocks.sandbox.PowerVoid */
declare class PowerVoid extends Block {}
declare namespace PowerVoid {
    class PowerVoidBuild extends Building {}
}


/** mindustry.world.blocks.payloads.PayloadSource */
declare class PayloadSource extends PayloadBlock {}
declare namespace PayloadSource {
    class PayloadSourceBuild extends PayloadBlock.PayloadBlockBuild<Payload> {}
}
/** mindustry.world.blocks.payloads.PayloadVoid */
declare class PayloadVoid extends PayloadBlock {}
declare namespace PayloadVoid {
    class PayloadVoidBuild extends PayloadBlock.PayloadBlockBuild<Payload> {}
}
