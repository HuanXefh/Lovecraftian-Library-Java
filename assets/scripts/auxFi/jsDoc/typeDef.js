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


    /** @global mindustry.world.consumers.Consume */
    class Consume {};
    /** @global mindustry.world.consumers.ConsumeItems */
    class ConsumeItems extends Consume {};
    /** @global mindustry.world.consumers.ConsumeItemFilter */
    class ConsumeItemFilter extends Consume {};
    /** @global mindustry.world.consumers.ConsumeItemDynamic */
    class ConsumeItemDynamic extends Consume {};
    /** @global mindustry.world.consumers.ConsumeItemList */
    class ConsumeItemList extends ConsumeItemFilter {};
    /** @global mindustry.world.consumers.ConsumeItemEfficiency */
    class ConsumeItemEfficiency extends ConsumeItemFilter {};
    /** @global mindustry.world.consumers.ConsumeItemFlammable */
    class ConsumeItemFlammable extends ConsumeItemEfficiency {};
    /** @global mindustry.world.consumers.ConsumeItemExplosive */
    class ConsumeItemExplosive extends ConsumeItemEfficiency {};
    /** @global mindustry.world.consumers.ConsumeItemRadioactive */
    class ConsumeItemRadioactive extends ConsumeItemEfficiency {};
    /** @global mindustry.world.consumers.ConsumeItemCharged */
    class ConsumeItemCharged extends ConsumeItemEfficiency {};
    /** @global mindustry.world.consumers.ConsumeLiquidBase */
    class ConsumeLiquidBase extends Consume {};
    /** @global mindustry.world.consumers.ConsumeLiquid */
    class ConsumeLiquid extends ConsumeLiquidBase {};
    /** @global mindustry.world.consumers.ConsumeLiquids */
    class ConsumeLiquids extends Consume {};
    /** @global mindustry.world.consumers.ConsumeLiquidDynamic */
    class ConsumeLiquidDynamic extends Consume {};
    /** @global mindustry.world.consumers.ConsumeLiquidFilter */
    class ConsumeLiquidFilter extends ConsumeLiquidBase {};
    /** @global mindustry.world.consumers.ConsumeLiquidFlammable */
    class ConsumeLiquidFlammable extends ConsumeLiquidFilter {};
    /** @global mindustry.world.consumers.ConsumePower */
    class ConsumePower extends Consume {};
    /** @global mindustry.world.consumers.ConsumePowerDynamic */
    class ConsumePowerDynamic extends ConsumePower {};
    /** @global mindustry.world.consumers.ConsumePowerCondition */
    class ConsumePowerCondition extends ConsumePower {};
    /** @global mindustry.world.consumers.ConsumePayloads */
    class ConsumePayloads extends Consume {};
    /** @global mindustry.world.consumers.ConsumePayloadDynamic */
    class ConsumePayloadDynamic extends Consume {};
    /** @global mindustry.world.consumers.ConsumePayloadFilter */
    class ConsumePayloadFilter extends Consume {};
    /** @global mindustry.world.modules.BlockModule */
    class BlockModule {};
    /** @global mindustry.world.modules.ItemModule */
    class ItemModule extends BlockModule {};
    /** @global mindustry.world.modules.LiquidModule */
    class LiquidModule extends BlockModule {};
    /** @global mindustry.world.modules.PowerModule */
    class PowerModule extends BlockModule {};
    /** @global mindustry.world.blocks.power.PowerGraph */
    class PowerGraph {};
    /** @global mindustry.world.blocks.AutoTiler */
    class AutoTiler {};
    AutoTiler.SliceMode = class {};
    /** @global mindustry.world.blocks.TileBitmask */
    class TileBitmask {};
    /** @global mindustry.world.blocks.ItemSelection */
    class ItemSelection {};
    /** @global mindustry.world.blocks.payloads.Payload */
    class Payload {};
    /** @global mindustry.world.blocks.payloads.BuildPayload */
    class BuildPayload extends Payload {};
    /** @global mindustry.world.blocks.payloads.UnitPayload */
    class UnitPayload extends Payload {};
    /** @global mindustry.world.blocks.RotBlock */
    class RotBlock {};
    /** @global mindustry.world.blocks.ControlBlock */
    class ControlBlock {};
    /** @global mindustry.world.blocks.UnitTetherBlock */
    class UnitTetherBlock {};
    /** @global mindustry.world.blocks.distribution.ChainedBuilding */
    class ChainedBuilding {};
    /** @global mindustry.world.blocks.heat.HeatBlock */
    class HeatBlock {};
    /** @global mindustry.world.blocks.heat.HeatConsumer */
    class HeatConsumer {};


    /** @global mindustry.world.blocks.ConstructBlock */
    class ConstructBlock extends Block {};
    /** @global mindustry.world.blocks.campaign.Accelerator */
    class Accelerator extends Block {};
    /** @global mindustry.world.blocks.campaign.LaunchPad */
    class LaunchPad extends Block {};
    /** @global mindustry.world.blocks.campaign.LandingPad */
    class LandingPad extends Block {};
    /** @global mindustry.world.blocks.defense.Wall */
    class Wall extends Block {};
    /** @global mindustry.world.blocks.defense.ShieldWall */
    class ShieldWall extends Wall {};
    /** @global mindustry.world.blocks.defense.Thruster */
    class Thruster extends Wall {};
    /** @global mindustry.world.blocks.defense.Door */
    class Door extends Wall {};
    /** @global mindustry.world.blocks.defense.AutoDoor */
    class AutoDoor extends Wall {};
    /** @global mindustry.world.blocks.defense.MendProjector */
    class MendProjector extends Block {};
    /** @global mindustry.world.blocks.defense.RegenProjector */
    class RegenProjector extends Block {};
    /** @global mindustry.world.blocks.units.RepairTower */
    class RepairTower extends Block {};
    /** @global mindustry.world.blocks.units.RepairTurret */
    class RepairTurret extends Block {};
    /** @global mindustry.world.blocks.defense.OverdriveProjector */
    class OverdriveProjector extends Block {};
    /** @global mindustry.world.blocks.defense.BaseShield */
    class BaseShield extends Block {};
    /** @global mindustry.world.blocks.defense.ForceProjector */
    class ForceProjector extends Block {};
    /** @global mindustry.world.blocks.defense.Radar */
    class Radar extends Block {};
    /** @global mindustry.world.blocks.defense.ShockMine */
    class ShockMine extends Block {};
    /** @global mindustry.world.blocks.defense.ShockwaveTower */
    class ShockwaveTower extends Block {};
    /** @global mindustry.world.blocks.defense.turrets.BaseTurret */
    class BaseTurret extends Block {};
    /** @global mindustry.world.blocks.defense.BuildTurret */
    class BuildTurret extends BaseTurret {};
    /** @global mindustry.world.blocks.defense.turrets.TractorBeamTurret */
    class TractorBeamTurret extends BaseTurret {};
    /** @global mindustry.world.blocks.defense.turrets.ReloadTurret */
    class ReloadTurret extends BaseTurret {};
    /** @global mindustry.world.blocks.defense.turrets.PointDefenseTurret */
    class PointDefenseTurret extends ReloadTurret {};
    /** @global mindustry.world.blocks.defense.turrets.Turret */
    class Turret extends ReloadTurret {};
    /** @global mindustry.world.blocks.defense.turrets.ItemTurret */
    class ItemTurret extends Turret {};
    /** @global mindustry.world.blocks.defense.turrets.LiquidTurret */
    class LiquidTurret extends Turret {};
    /** @global mindustry.world.blocks.defense.turrets.PowerTurret */
    class PowerTurret extends Turret {};
    /** @global mindustry.world.blocks.defense.turrets.LaserTurret */
    class LaserTurret extends PowerTurret {};
    /** @global mindustry.world.blocks.defense.turrets.PayloadAmmoTurret */
    class PayloadAmmoTurret extends Turret {};
    /** @global mindustry.world.blocks.defense.turrets.ContinuousTurret */
    class ContinuousTurret extends Turret {};
    /** @global mindustry.world.blocks.defense.turrets.ContinuousLiquidTurret */
    class ContinuousLiquidTurret extends ContinuousTurret {};
    /** @global mindustry.world.blocks.distribution.Conveyor */
    class Conveyor extends Block {};
    /** @global mindustry.world.blocks.distribution.ArmoredConveyor */
    class ArmoredConveyor extends Conveyor {};
    /** @global mindustry.world.blocks.distribution.StackConveyor */
    class StackConveyor extends Block {};
    /** @global mindustry.world.blocks.distribution.Duct */
    class Duct extends Block {};
    /** @global mindustry.world.blocks.distribution.ItemBridge */
    class ItemBridge extends Block {};
    /** @global mindustry.world.blocks.distribution.BufferedItemBridge */
    class BufferedItemBridge extends ItemBridge {};
    /** @global mindustry.world.blocks.distribution.DirectionBridge */
    class DirectionBridge extends Block {};
    /** @global mindustry.world.blocks.distribution.DuctBridge */
    class DuctBridge extends DirectionBridge {};
    /** @global mindustry.world.blocks.distribution.Junction */
    class Junction extends Block {};
    /** @global mindustry.world.blocks.distribution.DuctJunction */
    class DuctJunction extends Block {};
    /** @global mindustry.world.blocks.distribution.Router */
    class Router extends Block {};
    /** @global mindustry.world.blocks.distribution.DuctRouter */
    class DuctRouter extends Block {};
    /** @global mindustry.world.blocks.distribution.StackRouter */
    class StackRouter extends DuctRouter {};
    /** @global mindustry.world.blocks.distribution.Sorter */
    class Sorter extends Block {};
    /** @global mindustry.world.blocks.distribution.OverflowGate */
    class OverflowGate extends Block {};
    /** @global mindustry.world.blocks.distribution.OverflowDuct */
    class OverflowDuct extends Block {};
    /** @global mindustry.world.blocks.storage.Unloader */
    class Unloader extends Block {};
    /** @global mindustry.world.blocks.distribution.DirectionalUnloader */
    class DirectionalUnloader extends Block {};
    /** @global mindustry.world.blocks.distribution.MassDriver */
    class MassDriver extends Block {};
    /** @global mindustry.world.blocks.storage.StorageBlock */
    class StorageBlock extends Block {};
    /** @global mindustry.world.blocks.storage.CoreBlock */
    class CoreBlock extends StorageBlock {};
    /** @global mindustry.world.blocks.sandbox.ItemSource */
    class ItemSource extends Block {};
    /** @global mindustry.world.blocks.sandbox.ItemVoid */
    class ItemVoid extends Block {};
    /** @global mindustry.world.blocks.heat.HeatConductor */
    class HeatConductor extends Block {};
    /** @global mindustry.world.blocks.power.HeaterGenerator */
    class HeaterGenerator extends ConsumeGenerator {};
    /** @global mindustry.world.blocks.heat.HeatProducer */
    class HeatProducer extends GenericCrafter {};
    /** @global mindustry.world.blocks.production.HeatCrafter */
    class HeatCrafter extends GenericCrafter {};
    /** @global mindustry.world.blocks.liquid.LiquidBlock */
    class LiquidBlock extends Block {};
    /** @global mindustry.world.blocks.liquid.Conduit */
    class Conduit extends LiquidBlock {};
    /** @global mindustry.world.blocks.liquid.ArmoredConduit */
    class ArmoredConduit extends Conduit {};
    /** @global mindustry.world.blocks.liquid.LiquidBridge */
    class LiquidBridge extends ItemBridge {};
    /** @global mindustry.world.blocks.liquid.LiquidJunction */
    class LiquidJunction extends LiquidBlock {};
    /** @global mindustry.world.blocks.distribution.DirectionLiquidBridge */
    class DirectionLiquidBridge extends DirectionBridge {};
    /** @global mindustry.world.blocks.sandbox.LiquidSource */
    class LiquidSource extends Block {};
    /** @global mindustry.world.blocks.sandbox.LiquidVoid */
    class LiquidVoid extends Block {};
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
    /** @global mindustry.world.blocks.payloads.PayloadBlock */
    class PayloadBlock extends Block {};
    /** @global mindustry.world.blocks.payloads.PayloadConveyor */
    class PayloadConveyor extends Block {};
    /** @global mindustry.world.blocks.payloads.PayloadRouter */
    class PayloadRouter extends PayloadConveyor {};
    /** @global mindustry.world.blocks.payloads.BlockProducer */
    class BlockProducer extends PayloadBlock {};
    /** @global mindustry.world.blocks.production.SingleBlockProducer */
    class SingleBlockProducer extends BlockProducer {};
    /** @global mindustry.world.blocks.payloads.Constructor */
    class Constructor extends BlockProducer {};
    /** @global mindustry.world.blocks.payloads.PayloadDeconstructor */
    class PayloadDeconstructor extends PayloadBlock {};
    /** @global mindustry.world.blocks.payloads.PayloadLoader */
    class PayloadLoader extends PayloadBlock {};
    /** @global mindustry.world.blocks.payloads.PayloadUnloader */
    class PayloadUnloader extends PayloadLoader {};
    /** @global mindustry.world.blocks.payloads.PayloadMassDriver */
    class PayloadMassDriver extends PayloadBlock {};
    /** @global mindustry.world.blocks.payloads.PayloadSource */
    class PayloadSource extends PayloadBlock {};
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
    /** @global mindustry.world.blocks.sandbox.PowerSource */
    class PowerSource extends PowerNode {};
    /** @global mindustry.world.blocks.sandbox.PowerVoid */
    class PowerVoid extends PowerBlock {};
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
