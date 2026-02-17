package lovec.math;


import arc.func.Boolf2;
import arc.func.Func2;
import arc.struct.Seq;
import arc.util.Nullable;
import lovec.utils.LCFormat;
import mindustry.core.World;

/**
 * Utility class that handles raycast calculation.
 */
public class LCRaycast {


    static Object rayFindObj;
    static Seq rayFindObjSeq = new Seq();


    /* <-------------------- check --------------------> */


    /**
     * Base method for raycast methods that return a boolean.
     */
    public static boolean rayCheck(float x1, float y1, float x2, float y2, Boolf2 boolF) {
        return World.raycast(LCFormat.toIntCoord(x1), LCFormat.toIntCoord(y1), LCFormat.toIntCoord(x2), LCFormat.toIntCoord(y2), boolF::get);
    }


    /* <-------------------- find --------------------> */


    /**
     * Base method for raycast methods that return the first matching object.
     */
    public static @Nullable Object rayFind(float x1, float y1, float x2, float y2, Func2 func) {
        return World.raycast(LCFormat.toIntCoord(x1), LCFormat.toIntCoord(y1), LCFormat.toIntCoord(x2), LCFormat.toIntCoord(y2), (tx, ty) -> {
            rayFindObj = func.get(tx, ty);
            return rayFindObj != null;
        }) ? rayFindObj : null;
    }


    /* <-------------------- find all --------------------> */


    /**
     * Base method for raycast methods that return all matching objects.
     */
    public static Seq rayFindAll(float x1, float y1, float x2, float y2, Func2 func) {
        rayFindObjSeq.clear();
        World.raycast(LCFormat.toIntCoord(x1), LCFormat.toIntCoord(y1), LCFormat.toIntCoord(x2), LCFormat.toIntCoord(y2), (tx, ty) -> {
            rayFindObj = func.get(tx, ty);
            if(rayFindObj != null) {
                rayFindObjSeq.add(rayFindObj);
            }
            return false;
        });
        return rayFindObjSeq;
    }


}