/** mindustry.ai.BaseRegistry */
declare class BaseRegistry {}


/** mindustry.ai.WaveSpawner */
declare class WaveSpawner {}


/** mindustry.ai.BlockIndexer */
declare class BlockIndexer {}


/** mindustry.ai.Pathfinder */
declare class Pathfinder implements java.lang._Runnable {}
/** mindustry.ai.ControlPathFinder */
declare class ControlPathFinder implements java.lang._Runnable {}


/** mindustry.ai.UnitCommand */
declare class UnitCommand extends MappableContent {
    static moveCommand: UnitCommand;
    static repairCommand: UnitCommand;
    static rebuildCommand: UnitCommand;
    static assistCommand: UnitCommand;
    static mineCommand: UnitCommand;
    static enterPayloadCommand: UnitCommand;
    static loadUnitsCommand: UnitCommand;
    static loadBlocksCommand: UnitCommand;
    static unloadPayloadCommand: UnitCommand;
    static loopPayloadCommand: UnitCommand;
}
/** mindustry.ai.UnitStance */
declare class UnitStance extends MappableContent {
    static stop: UnitStance;
    static holdFire: UnitStance;
    static pursueTarget: UnitStance;
    static patrol: UnitStance;
    static ram: UnitStance;
    static boost: UnitStance;
    static holdPosition: UnitStance;
    static mineAuto: UnitStance;
}


/** mindustry.ai.UnitGroup */
declare class UnitGroup {}


/** mindustry.entities.units.UnitController */
interface UnitController {}
/** mindustry.ai.types.NoAI */
declare class NoAI implements UnitController {}
/** mindustry.entities.units.AIController */
declare class AIController implements UnitController {}
/** mindustry.ai.types.AssemblerAI */
declare class AssemblerAI extends AIController {}
/** mindustry.ai.types.BoostAI */
declare class BoostAI extends AIController {}
/** mindustry.ai.types.BuilderAI */
declare class BuilderAI extends AIController {}
/** mindustry.ai.types.BaseBuilderAI */
declare class BaseBuilderAI extends AIController {}
/** mindustry.ai.types.CargoAI */
declare class CargoAI extends AIController {}
/** mindustry.ai.types.CommandAI */
declare class CommandAI extends AIController {}
/** mindustry.ai.types.DefenderAI */
declare class DefenderAI extends AIController {}
/** mindustry.ai.types.FlyingAI */
declare class FlyingAI extends AIController {}
/** mindustry.ai.types.FlyingFollowAI */
declare class FlyingFollowAI extends AIController {}
/** mindustry.ai.types.GroundAI */
declare class GroundAI extends AIController {}
/** mindustry.ai.types.HugAI */
declare class HugAI extends AIController {}
/** mindustry.ai.types.LogicAI */
declare class LogicAI extends AIController {}
/** mindustry.ai.types.MinerAI */
declare class MinerAI extends AIController {}
/** mindustry.ai.types.MissileAI */
declare class MissileAI extends AIController {}
/** mindustry.ai.types.PrebuildAI */
declare class PrebuildAI extends AIController {}
/** mindustry.ai.types.RepairAI */
declare class RepairAI extends AIController {}
/** mindustry.ai.types.RtsAI */
declare class RtsAI extends AIController {}
/** mindustry.ai.types.SuicideAI */
declare class SuicideAI extends AIController {}
