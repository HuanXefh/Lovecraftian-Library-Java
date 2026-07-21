package lovec.utils;

import arc.math.Mathf;
import arc.math.geom.Vec2;
import mindustry.Vars;
import mindustry.gen.Building;
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


};
