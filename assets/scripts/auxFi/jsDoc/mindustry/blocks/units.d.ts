/** mindustry.world.blocks.units.RepairTower */
declare class RepairTower extends Block {}
declare namespace RepairTower {
    class RepairTowerBuild extends Building implements Ranged {}
    interface RepairTowerBuild extends Ranged {}
}
/** mindustry.world.blocks.units.RepairTurret */
declare class RepairTurret extends Block {}
declare namespace RepairTurret {
    class RepairTurretBuild extends Building implements Ranged, RotBlock {}
    interface RepairTurretBuild extends Ranged, RotBlock {}
}


/** mindustry.world.blocks.units.UnitBlock */
declare class UnitBlock extends PayloadBlock {}
declare namespace UnitBlock {
    class UnitBuild extends PayloadBlock.PayloadBlockBuild<UnitPayload> {}
}
/** mindustry.world.blocks.units.UnitFactory */
declare class UnitFactory extends UnitBlock {}
declare namespace UnitFactory {
    class UnitFactoryBuild extends UnitBlock.UnitBuild {}
    class UnitPlan {
        unit: UnitType;
        requirements: Array<ItemStack>;
        time: number;

        constructor(utp: UnitType, time: number, req: Array<ItemStack>)
    }
}
/** mindustry.world.blocks.units.Reconstructor */
declare class Reconstructor extends UnitBlock {}
declare namespace Reconstructor {
    class ReconstructorBuild extends UnitBlock.UnitBuild {}
}
/** mindustry.world.blocks.units.UnitAssembler */
declare class UnitAssembler extends PayloadBlock {}
declare namespace UnitAssembler {
    class UnitAssemblerBuild extends PayloadBlock.PayloadBlockBuild<Payload> {}
    class AssemblerData {
        unit: UnitType;
        requirements: Seq<PayloadStack>|null;
        itemReq: Array<ItemStack>|null;
        liquidReq: Array<LiquidStack>|null;
        time: number;

        constructor(utp: UnitType, time: number, req: Seq<PayloadStack>)
    }
    class YeetData {
        target: Vec2;
        item: UnlockableContent;

        constructor(target: Vec2, ct: UnlockableContent)
    }
}
/** mindustry.world.blocks.units.UnitAssemblerModule */
declare class UnitAssemblerModule extends PayloadBlock {}
declare namespace UnitAssemblerModule {
    class UnitAssemblerModuleBuild extends PayloadBlock.PayloadBlockBuild<Payload> {}
}


/** mindustry.world.blocks.units.UnitCargoLoader */
declare class UnitCargoLoader extends Block {}
declare namespace UnitCargoLoader {
    class UnitTransportSourceBuild extends Building implements UnitTetherBlock {}
    interface UnitTransportSourceBuild extends UnitTetherBlock {}
}
/** mindustry.world.blocks.units.UnitCargoUnloadPoint */
declare class UnitCargoUnloadPoint extends Block {}
declare namespace UnitCargoUnloadPoint {
    class UnitCargoUnloadPointBuild extends Building {}
}
