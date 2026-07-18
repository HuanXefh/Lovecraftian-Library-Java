package lovec.utils;

import arc.math.Mathf;
import mindustry.Vars;
import mindustry.gen.Building;
import mindustry.world.Tile;
import mindustry.world.blocks.distribution.ItemBridge;

import static lovec.utils.LCScript.MDL_cond;

public class LCGeometry {


    /* <-------------------- input --------------------> */


    public static boolean acceptLine(Building b_f, Building b_t, boolean canSideBlend) {
        return b_f.relativeTo(b_t) == b_f.rotation && (!b_t.block.rotate || (canSideBlend ? b_t.relativeTo(b_f) != b_t.rotation : b_f.relativeTo(b_t) == b_t.rotation));
    };


    public static boolean acceptRouter(Building b_f, Building b_t, boolean canSideBlend) {
        return b_f.relativeTo(b_t) != Mathf.mod(b_f.rotation + 2, 4) && (!b_t.block.rotate || (canSideBlend ? b_t.relativeTo(b_f) != b_t.rotation : b_f.relativeTo(b_t) == b_t.rotation));
    };


    public static boolean acceptBlock(Building b_f, Building b_t, boolean canSideBlend) {
        return !b_t.block.rotate || (boolean)(LCScript.invoke("_isFullRouter", MDL_cond, b_f.block)) ?
            canSideBlend :
            (canSideBlend ? b_t.relativeTo(b_f) != b_t.rotation : b_f.relativeTo(b_t) == b_t.rotation);
    };


    public static boolean acceptBridge(ItemBridge.ItemBridgeBuild b, Building b_t, boolean canSideBlend) {
        if(((ItemBridge)(b.block)).linkValid(b.tile, Vars.world.tile(b.link)) || b.incoming.size == 0) return false;
        int rot;
        Tile ot;
        Building ob;
        for(int i = 0; i < b.incoming.size; i++) {
            ot = Vars.world.tile(b.incoming.get(i));
            if(ot != null) {
                rot = LCPos.getRotation(b.tile, ot);
                ob = b.nearby(rot);
                return ob != b_t && acceptBlock(b, b_t, canSideBlend);
            };
        };
        return acceptBlock(b, b_t, canSideBlend);
    };


    /**
     * Whether a building accepts input from another building.
     */
    public static boolean accept(Building b_f, Building b_t, boolean fromRouter, boolean canSideBlend) {
        if(b_f instanceof ItemBridge.ItemBridgeBuild b && !(b_t instanceof ItemBridge.ItemBridgeBuild)) {
            return acceptBridge(b, b_t, canSideBlend);
        };

        return (!b_f.block.rotate || (boolean)(LCScript.invoke("_isFullRouter", MDL_cond, b_f.block)) ?
            acceptBlock(b_f, b_t, canSideBlend) :
            !fromRouter ?
                acceptLine(b_f, b_t, canSideBlend) :
                acceptRouter(b_f, b_t, canSideBlend));
    };


    /* <-------------------- side display --------------------> */


    private static boolean backSideFromRouter(Building b_s) {
        return b_s != null && (boolean)(LCScript.invoke("_isGenericRouter", MDL_cond, b_s.block));
    };


    private static boolean backSideCanSideBlend(Building b, Building b_s) {
        if(b_s == null) return false;
        var noSideTo = (boolean)(LCScript.invoke("_isNoSideBlock", MDL_cond, b.block));
        var noSideBoth = (boolean)(LCScript.invoke("_isSameNoSideBlock", MDL_cond, b.block, b_s.block));

        return noSideBoth || !noSideTo;
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
