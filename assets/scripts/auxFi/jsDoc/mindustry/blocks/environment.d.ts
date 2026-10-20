/** mindustry.world.blocks.environment.Cliff */
declare class Cliff extends Block {}


/** mindustry.world.blocks.environment.Floor */
declare class Floor extends Block {}
declare namespace Floor {
    class UpdateRenderState {
        tile: Tile;
        floor: Floor;
        data: number;

        constructor(t: Tile, flr: Floor)
    }
}
/** mindustry.world.blocks.environment.AirBlock */
declare class AirBlock extends Floor {}
/** mindustry.world.blocks.environment.EmptyFloor */
declare class EmptyFloor extends Floor {}
/** mindustry.world.blocks.environment.ShallowLiquid */
declare class ShallowLiquid extends Floor {}
/** mindustry.world.blocks.environment.SteamVent */
declare class SteamVent extends Floor {}
/** mindustry.world.blocks.environment.TiledFloor */
declare class TiledFloor extends Floor {}
/** mindustry.world.blocks.environment.ColoredFloor */
declare class ColoredFloor extends Floor {}


/** mindustry.world.blocks.environment.OverlayFloor */
declare class OverlayFloor extends Floor {}
/** mindustry.world.blocks.environment.RemoveOre */
declare class RemoveOre extends OverlayFloor {}
/** mindustry.world.blocks.environment.SpawnBlock */
declare class SpawnBlock extends OverlayFloor {}
/** mindustry.world.blocks.environment.OreBlock */
declare class OreBlock extends OverlayFloor {}
/** mindustry.world.blocks.environment.CharacterOverlay */
declare class CharacterOverlay extends OverlayFloor {}
/** mindustry.world.blocks.environment.RuneOverlay */
declare class RuneOverlay extends OverlayFloor {}


/** mindustry.world.blocks.environment.Prop */
declare class Prop extends Block {}
/** mindustry.world.blocks.environment.RemoveWall */
declare class RemoveWall extends Block {}
/** mindustry.world.blocks.environment.StaticProp */
declare class StaticProp extends Prop {}
/** mindustry.world.blocks.environment.StaticWall */
declare class StaticWall extends Prop {}
/** mindustry.world.blocks.environment.StaticTree */
declare class StaticTree extends StaticWall {}
/** mindustry.world.blocks.environment.TiledWall */
declare class TiledWall extends StaticWall {}
/** mindustry.world.blocks.environment.ColoredWall */
declare class ColoredWall extends StaticWall {}


/** mindustry.world.blocks.environment.TallBlock */
declare class TallBlock extends Block {}
/** mindustry.world.blocks.environment.TreeBlock */
declare class TreeBlock extends Block {}


/** mindustry.world.blocks.environment.SeaBush */
declare class SeaBush extends Prop {}
/** mindustry.world.blocks.environment.Seaweed */
declare class Seaweed extends Prop {}
/** mindustry.world.blocks.environment.WobbleProp */
declare class WobbleProp extends Prop {}
