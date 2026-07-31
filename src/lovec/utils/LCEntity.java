package lovec.utils;

import arc.func.Boolf;
import arc.func.Cons;
import arc.struct.Seq;
import arc.util.Nullable;
import lovec.utils.extend.LCNativeArray;
import mindustry.Vars;
import mindustry.game.Team;
import mindustry.gen.Building;
import mindustry.gen.Unit;
import mindustry.type.UnitType;
import mindustry.world.Block;
import mindustry.world.Tile;
import rhino.NativeArray;

/**
 * Handles entity search.
 */
public class LCEntity {


    /* <-------------------- building --------------------> */


    /**
     * Gets amount of buildings of some type for a team.
     */
    public static int getBuildCount(Block blk, Team team) {
        Seq<Building> bSeq = team.data().buildingTypes.get(blk);
        return bSeq == null ? 0 : bSeq.size;
    };


    /**
     * Iterates through buildings of the same type in a team.
     */
    public static void eachSomeBlock(Block blk, Team team, Cons<Building> cons) {
        Seq<Building> bSeq = team.data().buildingTypes.get(blk);
        if(bSeq != null) {
            bSeq.each(cons);
        };
    };


    /**
     * Gets a valid building in range.
     */
    public static @Nullable Building getBuildBy(float x, float y, Team team, float rad, Boolf<Building> boolF) {
        if(rad < 0.0001f) return null;

        return Vars.indexer.findTile(team, x, y, rad, boolF);
    };
    // Overload
    public static @Nullable Building getBuildBy(float x, float y, Team team, Boolf<Building> boolF) {
        return getBuildBy(x, y, team, 999999999999f, boolF);
    };


    /**
     * Gets buildings in a circular range.
     */
    public static NativeArray getBuilds(@Nullable NativeArray contArr, float x, float y, float rad) {
        NativeArray arr = contArr != null ? LCNativeArray.clear(contArr) : LCScript.newArray("LCEntity.getBuilds.newArr");
        if(rad < 0.0001f) return arr;

        Vars.indexer.eachBlock(
            null, x, y, rad,
            ob -> true,
            ob -> LCNativeArray.push(arr, ob)
        );

        return arr;
    };


    /**
     * Iterates through buildings in a circular range.
     */
    public static void eachBuild(float x, float y, @Nullable Team team, float rad, @Nullable Boolf<Building> boolF, Cons<Building> cons) {
        if(rad < 0.0001f) return;

        Vars.indexer.eachBlock(
            team, x, y, rad,
            boolF != null ? boolF : b -> true,
            cons
        );
    };


    /**
     * Gets buildings on given tiles.
     */
    public static NativeArray getBuildsByTiles(@Nullable NativeArray contArr, NativeArray ts) {
        NativeArray arr = contArr != null ? LCNativeArray.clear(contArr) : LCScript.newArray("LCEntity.getBuildsByTiles.newArr");

        LCNativeArray.forEachFast(ts, ot -> {
            Tile ot_fi = (Tile)(ot);
            if(ot_fi.build != null && !LCNativeArray.includes(arr, ot_fi.build)) {
                LCNativeArray.push(arr, ot_fi.build);
            };
        });

        return arr;
    };


    /* <-------------------- unit --------------------> */


    /**
     * Gets amount of units of some type for a team.
     */
    public static int getUnitCount(UnitType utp, Team team) {
        Seq<Unit> unitSeq = team.data().unitsByType[utp.id];
        return unitSeq == null ? 0 : unitSeq.size;
    };


    /**
     * Iterates through units of the same type in a team.
     */
    public static void eachSomeUnitType(UnitType utp, Team team, Cons<Unit> cons) {
        Seq<Unit> unitSeq = team.data().unitsByType[utp.id];
        if(unitSeq != null) {
            unitSeq.each(cons);
        };
    };


};
