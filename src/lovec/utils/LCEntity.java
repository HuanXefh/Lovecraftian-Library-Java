package lovec.utils;

import arc.func.Boolf;
import arc.func.Boolf2;
import arc.func.Cons;
import arc.math.Mathf;
import arc.math.geom.Geometry;
import arc.math.geom.Position;
import arc.math.geom.Vec2;
import arc.struct.Seq;
import arc.util.Nullable;
import arc.util.Tmp;
import lovec.utils.extend.LCNativeArray;
import mindustry.Vars;
import mindustry.entities.Units;
import mindustry.game.Team;
import mindustry.gen.*;
import mindustry.type.UnitType;
import mindustry.world.Block;
import mindustry.world.Tile;
import rhino.NativeArray;

import java.util.concurrent.atomic.AtomicReference;

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
     * Iterates through buildings in a rectangular range.
     */
    public static void eachBuildRect(float x, float y, Team team, float w, @Nullable Boolf<Building> boolF, Cons<Building> cons) {
        if(w < 0.0001f) return;

        Vars.indexer.eachBlock(
            team,
            Tmp.r1.setCentered(x, y, w),
            boolF != null ? boolF : b -> true,
            cons
        );
    };


    /**
     * Gets buildings on given tiles.
     */
    public static NativeArray getBuildsByTiles(@Nullable NativeArray contArr, NativeArray ts) {
        NativeArray arr = contArr != null ? LCNativeArray.clear(contArr) : LCScript.newArray("LCEntity.getBuildsByTiles.newArr");

        Tile ot;
        for(Object rawOt : ts) {
            ot = (Tile) rawOt;
            if(ot.build != null && !LCNativeArray.includes(arr, ot.build)) {
                LCNativeArray.push(arr, ot.build);
            };
        };

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


    /**
     * Gets a random unit in a circular range.
     */
    public static @Nullable Unit getUnit(float x, float y, float rad) {
        return (Unit) LCNativeArray.random(getUnits(LCScript.ensureArray("LCEntity.getUnit.tmpArr"), x, y, rad));
    };
    // Overload
    public static @Nullable Unit getUnit(float x, float y) {
        return (Unit) LCNativeArray.first(getUnits(LCScript.ensureArray("LCEntity.getUnit.tmpArr"), x, y, 6f));
    };


    /**
     * Variant of {@link #getUnit} that excludes some unit.
     */
    public static @Nullable Unit getOtherUnit(float x, float y, float rad, Unit unit) {
        return (Unit) LCNativeArray.random(LCNativeArray.pullAll(getUnits(LCScript.ensureArray("LCEntity.getOtherUnit.tmpArr"), x, y, rad), unit));
    };
    // Overload
    public static @Nullable Unit getOtherUnit(float x, float y, Unit unit) {
        return (Unit) LCNativeArray.first(LCNativeArray.pullAll(getUnits(LCScript.ensureArray("LCEntity.getOtherUnit.tmpArr"), x, y, 6f), unit));
    };


    /**
     * Gets units in a circular range.
     */
    public static NativeArray getUnits(@Nullable NativeArray contArr, float x, float y, float rad) {
        NativeArray arr = contArr != null ? LCNativeArray.clear(contArr) : LCScript.newArray("LCEntity.getUnits.newArr");
        if(rad < 0.0001f) return contArr;

        Units.nearby(null, x, y, rad, ounit -> {
            if(!LCScriptUtil.checkCond("isIrregularUnit", ounit)) {
                LCNativeArray.push(arr, ounit);
            };
        });

        return arr;
    };


    /**
     * Iterates through units in a circular range.
     */
    public static void eachUnit(float x, float y, @Nullable Team team, float rad, @Nullable Boolf<Unit> boolF, Cons<Unit> cons) {
        if(rad < 0.0001f) return;

        Units.nearby(team, x, y, rad, ounit -> {
            if(!LCScriptUtil.checkCond("isIrregularUnit", ounit) && (boolF == null || boolF.get(ounit))) {
                cons.get(ounit);
            };
        });
    };


    /**
     * Iterates through units in a rectangular range.
     */
    public static void eachUnitRect(float x, float y, @Nullable Team team, float w, @Nullable Boolf<Unit> boolF, Cons<Unit> cons) {
        if(w < 0.0001f) return;

        Units.nearby(team, x, y, w, w, ounit -> {
            if(!LCScriptUtil.checkCond("isIrregularUnit", ounit) && (boolF == null || boolF.get(ounit))) {
                cons.get(ounit);
            };
        });
    };


    /**
     * Gets closest player unit.
     */
    public static @Nullable Unit getPlayerUnit(float x, float y, @Nullable Team team, float rad) {
        if(rad < 0.0001f) return null;

        AtomicReference<Unit> unitRef = new AtomicReference<>();
        Tmp.v1.set(0f, rad);
        Groups.player.each(player -> {
            Unit ounit = player.unit();
            if(ounit != null && (team == null || ounit.team == team)) {
                Tmp.v1.x = Mathf.dst(x, y, ounit.x, ounit.y);
                if(Tmp.v1.x < Tmp.v1.y) {
                    Tmp.v1.y = Tmp.v1.x;
                    unitRef.set(ounit);
                };
            };
        });

        return unitRef.get();
    };


    /**
     * Gets a player unit by player name.
     */
    public static @Nullable Unit getPlayerUnitByName(String name) {
        Player player = Groups.player.find(oplayer -> oplayer.name.equals(name));
        return player == null ? null : player.unit();
    };


    /* <-------------------- loot --------------------> */


    /**
     * Gets a random loot in a circular range.
     */
    public static @Nullable Unit getLoot(float x, float y, float rad) {
        return (Unit) LCNativeArray.random(getLoots(LCScript.ensureArray("LCEntity.getLoot.tmpArr"), x, y, rad));
    };
    // Overload
    public static @Nullable Unit getLoot(float x, float y) {
        return (Unit) LCNativeArray.first(getLoots(LCScript.ensureArray("LCEntity.getLoot.tmpArr"), x, y, 6f));
    };


    /**
     * Variant of {@link #getLoot} that excludes some loot.
     */
    public static @Nullable Unit getOtherLoot(float x, float y, float rad, Unit loot) {
        return (Unit) LCNativeArray.random(LCNativeArray.pullAll(getLoots(LCScript.ensureArray("LCEntity.getOtherLoot.tmpArr"), x, y, rad), loot));
    };
    // Overload
    public static @Nullable Unit getOtherLoot(float x, float y, Unit loot) {
        return (Unit) LCNativeArray.first(LCNativeArray.pullAll(getLoots(LCScript.ensureArray("LCEntity.getOtherLoot.tmpArr"), x, y, 6f), loot));
    };


    /**
     * Gets loots in a circular range.
     */
    public static NativeArray getLoots(@Nullable NativeArray contArr, float x, float y, float rad) {
        NativeArray arr = contArr != null ? LCNativeArray.clear(contArr) : LCScript.newArray("LCEntity.getLoots.newArr");
        if(rad < 0.0001f) return contArr;

        Units.nearby(null, x, y, rad, ounit -> {
            if(LCScriptUtil.checkCond("isLoot", ounit)) {
                LCNativeArray.push(arr, ounit);
            };
        });

        return arr;
    };


    /**
     * Gets loots on given tiles.
     */
    public static NativeArray getLootsByTiles(@Nullable NativeArray contArr, NativeArray ts) {
        NativeArray arr = contArr != null ? LCNativeArray.clear(contArr) : LCScript.newArray("LCEntity.getLootsByTiles.newArr");

        Tile ot;
        NativeArray loots;
        for(Object rawOt : ts) {
            ot = (Tile) rawOt;
            loots = getLoots(LCScript.ensureArray("LCEntity.getLootsByTiles.tmpArr"), ot.worldx() + Vars.tilesize * 0.5f, ot.worldy() + Vars.tilesize * 0.5f, 6f);
            for(Object loot : loots) {
                LCNativeArray.pushUnique(arr, loot);
            };
        };

        return arr;
    };


    /* <-------------------- bullets --------------------> */


    /**
     * Gets closest enemy bullet.
     */
    public static @Nullable Bullet getEnemyBullet(float x, float y, Team team, float rad, boolean ignoreHittable) {
        if(rad < 0.0001f) return null;

        AtomicReference<Bullet> bulRef = new AtomicReference<>();
        AtomicReference<Float> dstRef = new AtomicReference<>(999999999999f);
        eachBullet(
            x, y, team, rad,
            bul -> ignoreHittable || bul.type.hittable,
            bul -> {
                float dst = Mathf.dst(x, y, bul.x, bul.y);
                if(dst >= dstRef.get()) return;
                dstRef.set(dst);
                bulRef.set(bul);
            }
        );

        return bulRef.get();
    };
    // Overload
    public static @Nullable Bullet getEnemyBullet(float x, float y, Team team, float rad) {
        return getEnemyBullet(x, y, team, rad, false);
    };


    /**
     * Gets bullets in a circular range.
     */
    public static NativeArray getBullets(@Nullable NativeArray contArr, float x, float y, @Nullable Team team, float rad) {
        NativeArray arr = contArr != null ? LCNativeArray.clear(contArr) : LCScript.newArray("LCEntity.getBullets.newArr");
        if(rad < 0.0001f) return arr;

        Groups.bullet.intersect(x - rad, y - rad, rad * 2f, rad * 2f).each(obul -> obul.team != Team.derelict && (team == null || obul.team() != team) && obul.within(x, y, rad + obul.hitSize() / 2f), obul -> LCNativeArray.push(arr, obul));

        return arr;
    };


    /**
     * Iterate through bullets in a circular range.
     */
    public static void eachBullet(float x, float y, @Nullable Team team, float rad, @Nullable Boolf<Bullet> boolF, Cons<Bullet> cons) {
        if(rad < 0.0001f) return;

        Groups.bullet.intersect(x - rad, y - rad, rad * 2f, rad * 2f).each(obul -> obul.team != Team.derelict && (team == null || obul.team() != team) && obul.within(x, y, rad + obul.hitSize() / 2f) && (boolF == null || boolF.get(obul)), cons);
    };


    /* <-------------------- target --------------------> */


    /**
     * Gets closest target entity.
     */
    public static @Nullable Object getTarget(float x, float y, Team team, float rad, boolean targetAir, boolean targetGround, @Nullable Boolf boolF) {
        if(rad < 0.0001f) return null;

        return Units.closestTarget(team, x, y, rad, ounit -> ounit.checkTarget(targetAir, targetGround) && (boolF == null || boolF.get(ounit)), ot -> targetGround && boolF.get(ot));
    };
    // Overload
    public static @Nullable Object getTarget(float x, float y, Team team, float rad, boolean targetAir, boolean targetGround) {
        return getTarget(x, y, team, rad, targetAir, targetGround, null);
    };
    public static @Nullable Object getTarget(float x, float y, Team team, boolean targetAir, boolean targetGround, @Nullable Boolf boolF) {
        return getTarget(x, y, team, 999999999999f, targetAir, targetGround, boolF);
    };
    public static @Nullable Object getTarget(float x, float y, Team team, boolean targetAir, boolean targetGround) {
        return getTarget(x, y, team, targetAir, targetGround, null);
    };


    /**
     * Gets all valid target entities.
     */
    public static NativeArray getTargets(@Nullable NativeArray contArr, float x, float y, Team team, float rad) {
        NativeArray arr = contArr != null ? LCNativeArray.clear(contArr) : LCScript.newArray("LCEntity.getTargets.newArr");
        if(rad < 0.0001f) return arr;

        eachUnit(x, y, null, rad, ounit -> LCScriptUtil.checkCond("isEnemy", ounit, team), ounit -> LCNativeArray.push(arr, ounit));
        eachBuild(x, y, null, rad, ob -> LCScriptUtil.checkCond("isEnemy", ob, team), ob -> LCNativeArray.push(arr, ob));

        return arr;
    };
    // Overload
    public static NativeArray getTargets(@Nullable NativeArray contArr, float x, float y, Team team) {
        return getTargets(contArr, x, y, team, 999999999999f);
    };


    static Vec2 getChainTargetsVec1 = new Vec2();
    static Vec2 getChainTargetsVec2 = new Vec2();
    static Seq<Position> getChainTargetsSeq = new Seq<>();


    /**
     * Gets targets linked by a lightning chain.
     */
    public static NativeArray getChainTargets(@Nullable NativeArray contArr, float x, float y, Team team, float rad, float chainRad, float chainCap, @Nullable Boolf2 rayCheck) {
        NativeArray arr = contArr != null ? LCNativeArray.clear(contArr) : LCScript.newArray("LCEntity.getChainTargets.newArr");
        if(rad < 0.0001f) return arr;

        NativeArray tgs = getTargets(LCScript.ensureArray("LCEntity.getChainTargets.tmpArr"), x, y, team, rad * 2f);
        getChainTargetsSeq.clear();
        for(Object rawTg : tgs) {
            getChainTargetsSeq.add((Position) rawTg);
        };
        Position tmpTg;
        float tmpX = x;
        float tmpY = y;
        boolean isFirst = true;
        int i = 0;
        while(chainCap < 0 || i < chainCap) {
            tmpTg = Geometry.findClosest(tmpX, tmpY, getChainTargetsSeq);
            if(tmpTg == null) break;
            getChainTargetsVec1.set(tmpX, tmpY);
            getChainTargetsVec2.set(tmpTg.getX(), tmpTg.getY());
            if(getChainTargetsVec1.dst(getChainTargetsVec2) > (isFirst ? rad : chainRad) + 0.0001f || (rayCheck != null && rayCheck.get(getChainTargetsVec1, getChainTargetsVec2))) break;

            LCNativeArray.push(arr, tmpTg);
            getChainTargetsSeq.remove(tmpTg);
            tmpX = tmpTg.getX();
            tmpY = tmpTg.getY();
            isFirst = false;
            i++;
        };

        return arr;
    };
    // Overload
    public static NativeArray getChainTargets(@Nullable NativeArray contArr, float x, float y, Team team, float rad, float chainRad, float chainCap) {
        return getChainTargets(contArr, x, y, team, rad, chainRad, chainCap, null);
    };


};
