/** mindustry.world.blocks.storage.StorageBlock */
declare class StorageBlock extends Block {}
declare namespace StorageBlock {
    class StorageBuild extends Building {}
}


/** mindustry.world.blocks.storage.CoreBlock */
declare class CoreBlock extends StorageBlock {}
declare namespace CoreBlock {
    class CoreBuild extends StorageBlock.StorageBuild {}
}
