package lovec.math;

import arc.func.Boolf2;
import arc.func.Func2;
import arc.struct.Seq;
import arc.util.Nullable;
import lovec.utils.SLCPos;
import mindustry.core.World;

/**
 * Utility class that handles raycast calculation.
 */
public class SLCRaycast {


    public static Object rayFindObj;
    public static final Seq rayFindObjSeq = new Seq();


    /**
     * Base method for raycast methods that return a boolean.
     */
    public static boolean rayCheck(float x1, float y1, float x2, float y2, Boolf2<Integer, Integer> boolF) {
        return World.raycast(SLCPos.toIntCoord(x1), SLCPos.toIntCoord(y1), SLCPos.toIntCoord(x2), SLCPos.toIntCoord(y2), boolF::get);
    };


    /**
     * Base method for raycast methods that return the first matching object.
     */
    public static @Nullable Object rayFind(float x1, float y1, float x2, float y2, Func2<Integer, Integer, Object> func) {
        return World.raycast(SLCPos.toIntCoord(x1), SLCPos.toIntCoord(y1), SLCPos.toIntCoord(x2), SLCPos.toIntCoord(y2), (tx, ty) -> {
            rayFindObj = func.get(tx, ty);
            return rayFindObj != null;
        }) ? rayFindObj : null;
    };


    /**
     * Base method for raycast methods that return all matching objects.
     */
    public static Seq rayFindAll(float x1, float y1, float x2, float y2, Func2<Integer, Integer, Object> func) {
        rayFindObjSeq.clear();
        World.raycast(SLCPos.toIntCoord(x1), SLCPos.toIntCoord(y1), SLCPos.toIntCoord(x2), SLCPos.toIntCoord(y2), (tx, ty) -> {
            rayFindObj = func.get(tx, ty);
            if(rayFindObj != null) {
                rayFindObjSeq.add(rayFindObj);
            };
            return false;
        });
        return rayFindObjSeq;
    };


};