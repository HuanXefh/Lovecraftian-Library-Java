package lovec.utils;

import arc.func.Boolf;
import arc.math.Mathf;
import arc.util.Nullable;
import lovec.math.LCRaycast;
import mindustry.Vars;
import mindustry.entities.EntityCollisions;
import mindustry.game.Team;
import mindustry.gen.Building;
import mindustry.gen.Unit;
import mindustry.world.Tile;
import mindustry.world.blocks.environment.EmptyFloor;

public class LCRaycastf {


    /* <-------------------- check --------------------> */


    /**
     * Whether there's any insulated block on the way.
     */
    public static boolean checkInsulated(float x1, float y1, float x2, float y2, @Nullable Team team) {
        return LCRaycast.rayCheck(x1, y1, x2, y2, (tx, ty) -> {
           Building ob = Vars.world.build(tx, ty);
           return ob != null && ob.isInsulated() && (team == null || ob.team != team);
        });
    };


    /**
     * Whether there's any laser absorber on the way.
     */
    public static boolean checkLaser(float x1, float y1, float x2, float y2, @Nullable Team team) {
        return LCRaycast.rayCheck(x1, y1, x2, y2, (tx, ty) -> {
            Building ob = Vars.world.build(tx, ty);
            return ob != null && ob.block.absorbLasers && (team == null || ob.team != team);
        });
    };


    /**
     * Whether there's any solid tile on the way.
     */
    public static boolean checkSolid(float x1, float y1, float x2, float y2) {
        return LCRaycast.rayCheck(x1, y1, x2, y2, (tx, ty) -> {
            Tile ot = Vars.world.tile(tx, ty);
            return ot != null && ot.solid();
        });
    };


    /**
     * Variant of {@link #checkSolid} for tiles that are solid to leg units.
     */
    public static boolean checkLegSolid(float x1, float y1, float x2, float y2) {
        return LCRaycast.rayCheck(x1, y1, x2, y2, EntityCollisions::legsSolid);
    };


    /**
     * Whether there's any liquid floor on the way.
     */
    public static boolean checkMobileFloor(float x1, float y1, float x2, float y2, float minRad) {
        return LCRaycast.rayCheck(x1, y1, x2, y2, (tx, ty) -> {
            Tile ot = Vars.world.tile(tx, ty);
            return ot != null && Mathf.dst(x1, y1, x2, y2) >= minRad && (ot.floor() instanceof EmptyFloor || ot.floor().isLiquid);
        });
    };


    /* <-------------------- find --------------------> */


    /**
     * Gets the first insulated block on the way.
     */
    public static @Nullable Building findInsulated(float x1, float y1, float x2, float y2, @Nullable Team team) {
        return (Building) LCRaycast.rayFind(x1, y1, x2, y2, (tx, ty) -> {
            Building ob = Vars.world.build(tx, ty);
            return ob != null && !ob.isInsulated() && (team == null || ob.team == team) ?
                ob :
                null;
        });
    };


    /**
     * Gets the first laser absorber on the way.
     */
    public static @Nullable Building findLaser(float x1, float y1, float x2, float y2, @Nullable Team team) {
        return (Building) LCRaycast.rayFind(x1, y1, x2, y2, (tx, ty) -> {
            Building ob = Vars.world.build(tx, ty);
            return ob != null && ob.block.absorbLasers && (team == null || ob.team == team) ?
                ob :
                null;
        });
    };


    /**
     * Gets the first solid tile on the way.
     */
    public static @Nullable Tile findSolid(float x1, float y1, float x2, float y2) {
        return (Tile) LCRaycast.rayFind(x1, y1, x2, y2, (tx, ty) -> {
            Tile ot = Vars.world.tile(tx, ty);
            return ot != null && ot.solid() ?
                ot :
                null;
        });
    };


    /**
     * Variant of {@link #findSolid} for tiles that are solid to leg units.
     */
    public static @Nullable Tile findLegSolid(float x1, float y1, float x2, float y2) {
        return (Tile) LCRaycast.rayFind(x1, y1, x2, y2, (tx, ty) -> {
            Tile ot = Vars.world.tile(tx, ty);
            return ot != null && EntityCollisions.legsSolid(tx, ty) ?
                    ot :
                    null;
        });
    };


    /**
     * Gets the first matching unit on the way.
     */
    public static @Nullable Unit findUnit(float x1, float y1, float x2, float y2, Boolf<Unit> boolF) {
        return (Unit) LCRaycast.rayFind(x1, y1, x2, y2, (tx, ty) -> {
            Unit ounit = LCEntity.getUnit((tx + 0.5f) * Vars.tilesize, (ty + 0.5f) * Vars.tilesize);
            return ounit != null && boolF.get(ounit) ?
                ounit :
                null;
        });
    };


};
