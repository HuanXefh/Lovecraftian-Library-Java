package lovec.utils;

import arc.math.Mathf;
import mindustry.gen.Building;

import static lovec.utils.LCScript.MDL_cond;
import static lovec.utils.LCScript.invoke;

public class LCGeometry {


    /* <-------------------- input --------------------> */


    private static boolean acceptLine(Building b_f, Building b_t, boolean canSideBlend) {
        return b_f.relativeTo(b_t) == b_f.rotation && (!b_t.block.rotate || ((canSideBlend ? b_t.relativeTo(b_f) : b_f.relativeTo(b_t)) != b_t.rotation));
    };


    private static boolean acceptRouter(Building b_f, Building b_t, boolean canSideBlend) {
        return b_f.relativeTo(b_t) != Mathf.mod(b_f.rotation + 2, 4) && (!b_t.block.rotate || ((canSideBlend ? b_t.relativeTo(b_f) : b_f.relativeTo(b_t)) != b_t.rotation));
    };


    private static boolean acceptBlock(Building b_f, Building b_t, boolean canSideBlend) {
        return !b_t.block.rotate || ((canSideBlend ? b_t.relativeTo(b_f) : b_f.relativeTo(b_t)) != b_t.rotation);
    };


    /**
     * Whether a building accepts input from another building.
     */
    public static boolean accept(Building b_f, Building b_t, boolean fromRouter, boolean canSideBlend) {
        return !b_f.block.rotate ?
            acceptBlock(b_f, b_t, canSideBlend) :
            !fromRouter ?
                acceptLine(b_f, b_t, canSideBlend) :
                acceptRouter(b_f, b_t, canSideBlend);
    };


    /* <-------------------- side display --------------------> */


    private static boolean backSideFromRouter(Building b_s) {
        return b_s != null && (boolean)(invoke("_isGenericRouter", MDL_cond, b_s.block));
    };


    private static boolean backSideCanSideBlend(Building b, Building b_s) {
        return b_s != null && (
            (boolean)(invoke("_isNoSideBlock", MDL_cond, b.block))
                || (boolean)(invoke("_isNoSideBlock", MDL_cond, b_s.block))
                || (boolean)(invoke("_isSameNoSideBlock", MDL_cond, b.block, b_s.block))
        );
    };


    /**
     * Whether back side region should be displayed.
     * <br> <code>JSFUN</code>: b.ex_shouldBlendBackSide
     * <br> <code>JSFUN</code>: b.ex_shouldBlendFlankSide
     */
    public static boolean showBackSide(Building b) {
        Building b_f = b.nearby((b.rotation + 2) % 4);
        Building b_t = b.nearby(b.rotation);
        Building b_s1 = b.nearby((b.rotation + 1) % 4);
        Building b_s2 = b.nearby((b.rotation + 3) % 4);

        return !(
            (b_f != null && b_f.team == b.team && (boolean)(LCScript.instanceInvoke(b.block, "ex_shouldBlendBackSide", b_f)))
                || (b_s1 != null && b_s1.team == b.team && accept(b_s1, b, backSideFromRouter(b_s1), backSideCanSideBlend(b, b_s1)) && (boolean)(LCScript.instanceInvoke(b.block, "ex_shouldBlendFlankSide", b_s1)))
                || (b_s2 != null && b_s2.team == b.team && accept(b_s2, b, backSideFromRouter(b_s2), backSideCanSideBlend(b, b_s2)) && (boolean)(LCScript.instanceInvoke(b.block, "ex_shouldBlendFlankSide", b_s2)))
        );
    };


    /**
     * Whether back side region should be displayed.
     * <br> <code>JSFUN</code>: b.ex_shouldBlendFrontSide
     */
    public static boolean showFrontSide(Building b) {
        Building b_t = b.nearby(b.rotation);
        return !(b_t != null && b_t.team == b.team && (boolean)(LCScript.instanceInvoke(b.block, "ex_shouldBlendFrontSide", b_t)));
    };


};
