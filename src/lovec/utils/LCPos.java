package lovec.utils;

import mindustry.gen.Building;
import mindustry.world.Tile;

public class LCPos {


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


};
