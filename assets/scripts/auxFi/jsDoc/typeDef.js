/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
    * This file is only used for JSDoc.
    */


/*
  ========================================
  Section: Definition (Mindustry)
  ========================================
*/


    /** @global mindustry.world.blocks.units.RepairTower */
    class RepairTower extends Block {};
    /** @global mindustry.world.blocks.units.RepairTurret */
    class RepairTurret extends Block {};
    /** @global mindustry.world.blocks.power.HeaterGenerator */
    class HeaterGenerator extends ConsumeGenerator {};
    /** @global mindustry.world.blocks.production.HeatCrafter */
    class HeatCrafter extends GenericCrafter {};
    /** @global mindustry.world.blocks.logic.LogicBlock */
    class LogicBlock extends Block {};
    /** @global mindustry.world.blocks.logic.CanvasBlock */
    class CanvasBlock extends Block {};
    /** @global mindustry.world.blocks.logic.LogicDisplay */
    class LogicDisplay extends Block {};
    /** @global mindustry.world.blocks.logic.TileableLogicDisplay */
    class TileableLogicDisplay extends LogicDisplay {};
    /** @global mindustry.world.blocks.logic.MemoryBlock */
    class MemoryBlock extends Block {};
    /** @global mindustry.world.blocks.logic.MessageBlock */
    class MessageBlock extends Block {};
    /** @global mindustry.world.blocks.logic.SwitchBlock */
    class SwitchBlock extends Block {};
    /** @global mindustry.world.blocks.units.UnitBlock */
    class UnitBlock extends PayloadBlock {};
    /** @global mindustry.world.blocks.units.UnitFactory */
    class UnitFactory extends UnitBlock {};
    /** @global mindustry.world.blocks.units.Reconstructor */
    class Reconstructor extends UnitBlock {};
    /** @global mindustry.world.blocks.units.UnitAssembler */
    class UnitAssembler extends PayloadBlock {};
    /** @global mindustry.world.blocks.units.UnitAssemblerModule */
    class UnitAssemblerModule extends PayloadBlock {};
    /** @global mindustry.world.blocks.units.UnitCargoLoader */
    class UnitCargoLoader extends Block {};
    /** @global mindustry.world.blocks.units.UnitCargoUnloadPoint */
    class UnitCargoUnloadPoint extends Block {};
    /** @global mindustry.world.blocks.payloads.PayloadVoid */
    class PayloadVoid extends PayloadBlock {};
    /** @global mindustry.world.blocks.power.PowerBlock */
    class PowerBlock extends Block {};
    /** @global mindustry.world.blocks.power.PowerDistributor */
    class PowerDistributor extends PowerBlock {};
    /** @global mindustry.world.blocks.power.BeamNode */
    class BeamNode extends PowerBlock {};
    /** @global mindustry.world.blocks.power.PowerNode */
    class PowerNode extends PowerBlock {};
    /** @global mindustry.world.blocks.power.LongPowerNode */
    class LongPowerNode extends PowerNode {};
    /** @global mindustry.world.blocks.power.Battery */
    class Battery extends PowerDistributor {};
    /** @global mindustry.world.blocks.power.PowerDiode */
    class PowerDiode extends Block {};
    /** @global mindustry.world.blocks.power.PowerGenerator */
    class PowerGenerator extends PowerDistributor {};
    /** @global mindustry.world.blocks.power.ConsumeGenerator */
    class ConsumeGenerator extends PowerGenerator {};
    /** @global mindustry.world.blocks.power.ThermalGenerator */
    class ThermalGenerator extends PowerGenerator {};
    /** @global mindustry.world.blocks.power.NuclearReactor */
    class NuclearReactor extends PowerGenerator {};
    /** @global mindustry.world.blocks.power.ImpactReactor */
    class ImpactReactor extends PowerGenerator {};
    /** @global mindustry.world.blocks.power.VariableReactor */
    class VariableReactor extends PowerGenerator {};
    /** @global mindustry.world.blocks.power.SolarGenerator */
    class SolarGenerator extends PowerGenerator {};
    /** @global mindustry.world.blocks.power.LightBlock */
    class LightBlock extends Block {};
    /** @global mindustry.world.blocks.production.Incinerator */
    class Incinerator extends Block {};
    /** @global mindustry.world.blocks.production.ItemIncinerator */
    class ItemIncinerator extends Block {};
    /** @global mindustry.world.blocks.production.Drill */
    class Drill extends Block {};
    /** @global mindustry.world.blocks.production.BurstDrill */
    class BurstDrill extends Drill {};
    /** @global mindustry.world.blocks.production.BeamDrill */
    class BeamDrill extends Block {};
    /** @global mindustry.world.blocks.production.WallCrafter */
    class WallCrafter extends Block {};
    /** @global mindustry.world.blocks.production.Pump */
    class Pump extends LiquidBlock {};
    /** @global mindustry.world.blocks.production.SolidPump */
    class SolidPump extends Pump {};
    /** @global mindustry.world.blocks.production.Fracker */
    class Fracker extends SolidPump {};
    /** @global mindustry.world.blocks.production.Separator */
    class Separator extends Block {};
    /** @global mindustry.world.blocks.production.GenericCrafter */
    class GenericCrafter extends Block {};
    /** @global mindustry.world.blocks.production.AttributeCrafter */
    class AttributeCrafter extends GenericCrafter {};


    /** @global mindustry.world.blocks.environment.Cliff */
    class Cliff extends Block {};
    /** @global mindustry.world.blocks.environment.Floor */
    class Floor extends Block {};
    /** @global mindustry.world.blocks.environment.AirBlock */
    class AirBlock extends Floor {};
    /** @global mindustry.world.blocks.environment.EmptyFloor */
    class EmptyFloor extends Floor {};
    /** @global mindustry.world.blocks.environment.ShallowLiquid */
    class ShallowLiquid extends Floor {};
    /** @global mindustry.world.blocks.environment.SteamVent */
    class SteamVent extends Floor {};
    /** @global mindustry.world.blocks.environment.TiledFloor */
    class TiledFloor extends Floor {};
    /** @global mindustry.world.blocks.environment.ColoredFloor */
    class ColoredFloor extends Floor {};
    /** @global mindustry.world.blocks.environment.OverlayFloor */
    class OverlayFloor extends Floor {};
    /** @global mindustry.world.blocks.environment.RemoveOre */
    class RemoveOre extends OverlayFloor {};
    /** @global mindustry.world.blocks.environment.SpawnBlock */
    class SpawnBlock extends OverlayFloor {};
    /** @global mindustry.world.blocks.environment.OreBlock */
    class OreBlock extends OverlayFloor {};
    /** @global mindustry.world.blocks.environment.CharacterOverlay */
    class CharacterOverlay extends OverlayFloor {};
    /** @global mindustry.world.blocks.environment.RuneOverlay */
    class RuneOverlay extends OverlayFloor {};
    /** @global mindustry.world.blocks.environment.Prop */
    class Prop extends Block {};
    /** @global mindustry.world.blocks.environment.StaticProp */
    class StaticProp extends Prop {};
    /** @global mindustry.world.blocks.environment.RemoveWall */
    class RemoveWall extends Block {};
    /** @global mindustry.world.blocks.environment.StaticWall */
    class StaticWall extends Prop {};
    /** @global mindustry.world.blocks.environment.StaticTree */
    class StaticTree extends StaticWall {};
    /** @global mindustry.world.blocks.environment.TiledWall */
    class TiledWall extends StaticWall {};
    /** @global mindustry.world.blocks.environment.ColoredWall */
    class ColoredWall extends StaticWall {};
    /** @global mindustry.world.blocks.environment.SeaBush */
    class SeaBush extends Prop {};
    /** @global mindustry.world.blocks.environment.Seaweed */
    class Seaweed extends Prop {};
    /** @global mindustry.world.blocks.environment.WobbleProp */
    class WobbleProp extends Prop {};
    /** @global mindustry.world.blocks.environment.TallBlock */
    class TallBlock extends Block {};
    /** @global mindustry.world.blocks.environment.TreeBlock */
    class TreeBlock extends Block {};
