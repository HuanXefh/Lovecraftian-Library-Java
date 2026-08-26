package lovec.content;

import arc.math.Mathf;
import arc.util.Nullable;
import arc.util.Time;
import mindustry.gen.Building;
import mindustry.type.Liquid;

public class LCCraftingHandler {


    /* <-------------------- fluid --------------------> */


    /**
     * Adds liquid to some building.
     */
    public static float addLiquid(Building b, @Nullable Building b_f, Liquid liq, float rate, boolean forced, boolean returnFrac, boolean noDelta) {
        float amtTrans = 0f;
        if(b.liquids == null || (!forced && rate > 0f && !b.acceptLiquid(b_f != null ? b_f : b, liq))) return amtTrans;
        if(Math.abs(rate) < 0.0001f) return amtTrans;

        float delta = noDelta ?
            (
                b_f == null ?
                    1f :
                    b_f.efficiency * b_f.timeScale()
            ) :
            (
                b_f == null ?
                    Time.delta :
                    b_f.edelta()
            );

        amtTrans = rate > 0f ?
            Math.min(rate * delta, b.block.liquidCapacity - b.liquids.get(liq)) :
            -Math.min(-rate * delta, b.liquids.get(liq));
        b.handleLiquid(b_f != null ? b_f : b, liq, amtTrans);

        return !returnFrac ?
            Math.abs(amtTrans) :
            Math.abs(rate) < 0.0001f ?
                0f :
                Math.abs(amtTrans / rate);
    };
    // Overload
    public static float addLiquid(Building b, @Nullable Building b_f, Liquid liq, float rate, boolean forced, boolean returnFrac) {
        return addLiquid(b, b_f, liq, rate, forced, returnFrac, false);
    };
    public static float addLiquid(Building b, @Nullable Building b_f, Liquid liq, float rate, boolean forced) {
        return addLiquid(b, b_f, liq, rate, forced, false);
    };
    public static float addLiquid(Building b, @Nullable Building b_f, Liquid liq, float rate) {
        return addLiquid(b, b_f, liq, rate, false);
    };


    /**
     * Variant of {@link #addLiquid} where a large amount of liquid is produced at once.
     */
    public static float addLiquidBatch(Building b, @Nullable Building b_f, Liquid liq, float amt, boolean forced, boolean returnFrac) {
        float amtTrans = 0f;
        if(b.liquids == null || (!forced && amt > 0f && !b.acceptLiquid((b_f != null ? b_f : b), liq))) return amtTrans;
        if(Math.abs(amt) < 0.0001f) return amtTrans;

        amtTrans = amt > 0f ?
            Math.min(amt, b.block.liquidCapacity - b.liquids.get(liq)) :
            -Math.min(-amt, b.liquids.get(liq));
        b.handleLiquid(b_f != null ? b_f : b, liq, amtTrans);

        return !returnFrac ?
            Math.abs(amtTrans) :
            Math.abs(amt) < 0.0001f ?
                0f :
                Math.abs(amtTrans / amt);
    };
    // Overload
    public static float addLiquidBatch(Building b, @Nullable Building b_f, Liquid liq, float amt, boolean forced) {
        return addLiquidBatch(b, b_f, liq, amt, forced, false);
    };
    public static float addLiquidBatch(Building b, @Nullable Building b_f, Liquid liq, float amt) {
        return addLiquidBatch(b, b_f, liq, amt, false);
    };


    /**
     * Transfers liquid from <code>b</code> to <code>b_t</code>.
     */
    public static float transLiquid(Building b, @Nullable Building b_t, Liquid liq, float rate, boolean forced) {
        float amtTrans = 0f;
        if(b.liquids == null || b_t == null || b_t.liquids == null || (!forced && !b_t.acceptLiquid(b, liq))) return amtTrans;
        if(Math.abs(rate) < 0.0001f) return amtTrans;

        float amtCur = b.liquids.get(liq);
        if(amtCur < 0.0001f) return amtTrans;
        float amtCur_t = b_t.liquids.get(liq);
        float cap_t = b_t.block.liquidCapacity;
        amtTrans = Math.min(Mathf.clamp((forced ? b_t.edelta() : b.edelta()) * rate, 0f, cap_t - amtCur_t), amtCur);

        b_t.handleLiquid(b, liq, amtTrans);
        b.liquids.remove(liq, amtTrans);

        return amtTrans;
    };
    // Overload
    public static float transLiquid(Building b, @Nullable Building b_t, Liquid liq, float rate) {
        return transLiquid(b, b_t, liq, rate, false);
    };


};
