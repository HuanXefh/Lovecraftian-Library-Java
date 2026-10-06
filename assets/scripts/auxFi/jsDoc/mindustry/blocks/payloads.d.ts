/** mindustry.world.blocks.payloads.PayloadBlock */
declare class PayloadBlock extends Block {}
declare namespace PayloadBlock {
    class PayloadBlockBuild<T extends Payload> extends Building {}
}


/** mindustry.world.blocks.payloads.PayloadConveyor */
declare class PayloadConveyor extends Block {}
declare namespace PayloadConveyor {
    class PayloadConveyorBuild extends Building {}
}
/** mindustry.world.blocks.payloads.PayloadRouter */
declare class PayloadRouter extends PayloadConveyor {}
declare namespace PayloadRouter {
    class PayloadRouterBuild extends PayloadConveyor.PayloadConveyorBuild {}
}


/** mindustry.world.blocks.payloads.BlockProducer */
declare class BlockProducer extends PayloadBlock {}
declare namespace BlockProducer {
    class BlockProducerBuild extends PayloadBlock.PayloadBlockBuild<BuildPayload> {}
}
/** mindustry.world.blocks.payloads.SingleBlockProducer */
declare class SingleBlockProducer extends BlockProducer {}
declare namespace SingleBlockProducer {
    class SingleBlockProducerBuild extends BlockProducer.BlockProducerBuild {}
}
/** mindustry.world.blocks.payloads.Constructor */
declare class Constructor extends BlockProducer {}
declare namespace Constructor {
    class ConstructorBuild extends BlockProducer.BlockProducerBuild {}
}
/** mindustry.world.blocks.payloads.PayloadDeconstructor */
declare class PayloadDeconstructor extends PayloadBlock {}
declare namespace PayloadDeconstructor {
    class PayloadDeconstructorBuild extends PayloadBlock.PayloadBlockBuild<Payload> {}
}


/** mindustry.world.blocks.payloads.PayloadLoader */
declare class PayloadLoader extends PayloadBlock {}
declare namespace PayloadLoader {
    class PayloadLoaderBuild extends PayloadBlock.PayloadBlockBuild<BuildPayload> {}
}
/** mindustry.world.blocks.payloads.PayloadUnloader */
declare class PayloadUnloader extends PayloadLoader {}
declare namespace PayloadUnloader {
    class PayloadUnloaderBuild extends PayloadLoader.PayloadLoaderBuild {}
}


/** mindustry.world.blocks.payloads.PayloadMassDriver */
declare class PayloadMassDriver extends PayloadBlock {}
declare namespace PayloadMassDriver {
    class PayloadMassDriverBuild extends PayloadBlock.PayloadBlockBuild<Payload> implements RotBlock {}
    interface PayloadMassDriverBuild extends RotBlock {}
}
