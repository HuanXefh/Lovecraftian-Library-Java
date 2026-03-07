package lovec.utils;

import mindustry.Vars;

public class LCFormat {


    /* <-------------------- coordinate --------------------> */


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
    // Overloading
    public static float toFCoord(int tx) {
        return toFCoord(tx, 1);
    };


    /* <-------------------- width --------------------> */


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


};