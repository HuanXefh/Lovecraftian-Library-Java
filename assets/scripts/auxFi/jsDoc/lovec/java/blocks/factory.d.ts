/** lovec.type.factory.MultiBlockLinkBlock */
declare class MultiBlockLinkBlock extends Block {}
declare namespace MultiBlockLinkBlock {
    class MultiBlockLinkBuild extends Building {}
}
/** lovec.type.factory.MultiBlockLinkConstructBlock */
declare class MultiBlockLinkConstructBlock extends Block {}
declare namespace MultiBlockLinkConstructBlock {
    class MultiBlockLinkConstructBuild extends Building {}
}
/** lovec.type.block.factory.MultiBlockLinkCenterBlockFrag */
interface MultiBlockLinkCenterBlockFrag {}
/** lovec.type.block.factory.MultiBlockLinkCenterBuildFrag */
interface MultiBlockLinkCenterBuildFrag {}
/** lovec.type.block.factory.MultiBlockUniqueLinkBlockHandler */
interface MultiBlockUniqueLinkBlockHandler {}
/** lovec.type.block.factory.MultiBlockCrafter */
declare class MultiBlockCrafter extends GenericCrafter implements MultiBlockLinkCenterBlockFrag {}
interface MultiBlockCrafter extends MultiBlockLinkCenterBlockFrag {}
declare namespace MultiBlockCrafter {
    class MultiBlockCrafterBuild extends GenericCrafter.GenericCrafterBuild implements MultiBlockLinkCenterBuildFrag {}
    interface MultiBlockCrafterBuild extends MultiBlockLinkCenterBuildFrag {}
}
/** lovec.type.block.factory.MultiBlockLiquidRouter */
declare class MultiBlockLiquidRouter extends LiquidRouter implements MultiBlockLinkCenterBlockFrag, MultiBlockUniqueLinkBlockHandler {}
interface MultiBlockLiquidRouter extends MultiBlockLinkCenterBlockFrag, MultiBlockUniqueLinkBlockHandler {}
declare namespace MultiBlockLiquidRouter {
    class MultiBlockLiquidRouterBuild extends LiquidRouter.LiquidRouterBuild implements MultiBlockLinkCenterBuildFrag {}
    interface MultiBlockLiquidRouterBuild extends MultiBlockLinkCenterBuildFrag {}
}
