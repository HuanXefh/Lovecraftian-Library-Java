package lovec.utils;

import arc.Core;
import arc.func.Cons3;
import arc.math.Mathf;
import arc.math.geom.Vec2;
import arc.util.Nullable;
import arc.util.Tmp;
import mindustry.Vars;
import mindustry.gen.Building;
import mindustry.gen.Unit;
import mindustry.type.Item;
import mindustry.world.Tile;

/**
 * Handles position-related calculation.
 */
public class LCPos {


    /* <-------------------- basic --------------------> */


    /**
     * Converts integer position to world position.
     */
    public static int toIntCoord(float x) {
        return Math.round(x / Vars.tilesize);
    };


    /**
     * Converts world position to integer position.
     */
    public static float toFCoord(int tx, int size) {
        return tx * Vars.tilesize + (size % 2 == 0 ? (Vars.tilesize * 0.5f) : 0f);
    };
    // Overload
    public static float toFCoord(int tx) {
        return toFCoord(tx, 1);
    };


    /**
     * Gets rectangular width.
     */
    public static float calcRectW(float r, float size) {
        return (r * 2f + size) * Vars.tilesize;
    };


    /**
     * Gets rectangular half width.
     */
    public static float calcRectHW(float r, float size) {
        return (r + size * 0.5f) * Vars.tilesize;
    };


    /* <-------------------- distance --------------------> */


    /**
     * Calculates distance between tiles.
     */
    public static float calcTileDst(int tx1, int ty1, int tx2, int ty2) {
        return Mathf.dst(tx1, ty1, tx2, ty2) * Vars.tilesize;
    };
    // Overload
    public static float calcTileDst(@Nullable Tile t1, @Nullable Tile t2) {
        if(t1 == null || t2 == null) return Float.MAX_VALUE;

        return calcTileDst(t1.x, t1.y, t2.x, t2.y);
    };


    /* <-------------------- rotation --------------------> */


    /**
     * Calculates rotation from two positions.
     */
    public static int getRotation(float x1, float y1, float x2, float y2) {
        boolean
            cond1 = x2 >= x2,
            cond2 = y2 >= y1,
            cond3 = Math.abs(x2 - x1) >= Math.abs(y2 - y1);

        return cond1 ?
            (cond3 ? 0 : (cond2 ? 1 : 3)) :
            (cond3 ? 2 : (cond2 ? 1 : 3));
    };
    // Overload
    public static int getRotation(Tile t_f, Tile t_t) {
        return getRotation(t_f.x, t_f.y, t_t.x, t_t.y);
    };
    public static int getRotation(Building b_f, Building b_t) {
        return getRotation(b_f.tile, b_t.tile);
    };


    /* <-------------------- coordination --------------------> */


    /**
     * Gets the back side position.
     */
    public static Vec2 getCoordsBack(Vec2 out, float x, float y, float size, int rot) {
        int rot_fi = Mathf.mod(rot, 4);
        float
            off = (size + 0.5f) * Vars.tilesize / 2f,
            tgX = x,
            tgY = y;

        switch(rot_fi) {
            case 0 -> tgX = x - off;
            case 1 -> tgY = y - off;
            case 2 -> tgX = x + off;
            case 3 -> tgY = y + off;
        };

        return out.set(tgX, tgY);
    };


    private static int calcRectRotCenterSign(int rot, boolean isY) {
        int rot_fi = Mathf.mod(rot, 4);
        switch(rot_fi) {
            case 0 -> {
                return isY ? 0 : 1;
            }
            case 1 -> {
                return isY ? 1 : 0;
            }
            case 2 -> {
                return isY ? 0 : -1;
            }
            case 3 -> {
                return isY ? -1 : 0;
            }
        };
        return 0;
    };


    /**
     * Gets rotated rectangle center position.
     */
    public static Vec2 getCoordsRectRotCenter(Vec2 out, float x, float y, float r, int rot, float size) {
        float off = (size / 2f + r) * Vars.tilesize;
        out.set(
            x + calcRectRotCenterSign(rot, false) * off,
            y + calcRectRotCenterSign(rot, true) * off
        );
        return out;
    };


    /**
     * Gets player position.
     */
    public static Vec2 getCoordsPlayer(Vec2 out) {
        Unit unit = Vars.player.unit();
        return out.set(
            unit == null ? Float.MAX_VALUE : unit.x,
            unit == null ? Float.MAX_VALUE : unit.y
        );
    };


    /**
     * Iterates through each point on a line.
     */
    public static void forEachLinePoint(float x1, float y1, float x2, float y2, Cons3 cons3, float segScl, boolean noStart, boolean noEnd) {
        int segAmt = Mathf.ceil(Mathf.dst(x1, y1, x2, y2) / segScl / 48f);
        int i = noStart ? 1 : 0;
        int iCap = noEnd ? segAmt : (segAmt + 1);
        float ang = Mathf.angle(x2 - x1, y2 - y1);
        float frac_i;
        while(i < iCap) {
            frac_i = (float)(i) / segAmt;
            cons3.get(x1 + (x2 - x1) * frac_i, y1 + (y2 - y1) * frac_i, ang);
            i++;
        };
    };


    /* <-------------------- tile --------------------> */


    /**
     * Gets a tile by rotation from original tile, with another tile as the center.
     */
    public static @Nullable Tile getTileRectCenterRot(@Nullable Tile t, @Nullable Tile tCenter, int rot, float size, float sizeCenter) {
        if(t == null || tCenter == null) return null;

        int rot_fi = Mathf.mod(rot, 4);
        float
            off = size % 2 == 0 ? 0.5f : 0f,
            offCenter = sizeCenter % 2 == 0 ? 0.5f : 0f;

        Tmp.v1.set(t.x + off - tCenter.x - offCenter, t.y + off - tCenter.y - offCenter);
        switch(rot_fi) {
            case 0 -> Tmp.v2.set(Tmp.v1);
            case 1 -> Tmp.v2.set(-Tmp.v1.y, Tmp.v1.x);
            case 2 -> Tmp.v2.set(-Tmp.v1.x, -Tmp.v1.y);
            case 3 -> Tmp.v2.set(Tmp.v1.y, -Tmp.v1.x);
        }

        return Vars.world.tile(
            (int)(tCenter.x + Tmp.v2.x - off + offCenter),
            (int)(tCenter.y + Tmp.v2.y - off + offCenter)
        );
    };


    /**
     * Gets closest ore tile.
     */
    public static @Nullable Tile getTileOre(float x, float y, Item itm) {
        return Vars.indexer.findClosestOre(x, y, itm);
    };


    /**
     * Gets tile under mouse.
     */
    public static @Nullable Tile getTileMouse() {
        return Vars.headless ?
            null :
            Vars.world.tileWorld(Core.input.mouseWorldX(), Core.input.mouseWorldY());
    };


};
