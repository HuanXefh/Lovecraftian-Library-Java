package lovec.content.updater;

import arc.math.Mathf;
import lovec.content.BuildUpdater;
import lovec.content.ContentUpdater;
import lovec.content.LCCraftingHandler;
import lovec.utils.LCScriptUtil;
import mindustry.Vars;
import mindustry.entities.units.BuildPlan;
import mindustry.gen.Building;
import mindustry.type.Liquid;
import mindustry.world.Block;
import mindustry.world.Tile;
import mindustry.world.blocks.liquid.Conduit;

public class BLKFluidPipeUpdater extends ContentUpdater<Conduit> {


    public BLKFluidPipeUpdater(Conduit blk) throws NoSuchFieldException, IllegalAccessException {
        super(blk);
    };


    @FragMethod
    public boolean blends(Tile t, int rot, int otx, int oty, int orot, Block oblk) {
        return oblk.hasLiquids
            && (oblk.outputsLiquid || target.lookingAt(t, rot, otx, oty, oblk))
            && (target.lookingAtEither(t, rot, otx, oty, orot, oblk) || LCScriptUtil.checkCond("isFluidRouter", oblk) || LCScriptUtil.checkCond("isFullRouter", oblk));
    };
    // Overload
    @FragMethod
    public boolean blends(Tile t, int rot, BuildPlan[] bPlans, int dir, boolean shouldCheckWorld) {
        if(bPlans != null) {
            BuildPlan bPlan = bPlans[Mathf.mod(rot - dir, 4)];
            if(bPlan != null && target.blends(t, rot, bPlan.x, bPlan.y, bPlan.rotation, bPlan.block)) return true;
        };
        return shouldCheckWorld && target.blends(t, rot, dir);
    };
    @FragMethod
    public boolean blends(Tile t, int rot, int dir) {
        Building ob = t.nearbyBuild(Mathf.mod(rot - dir, 4));
        return ob != null && ob.team == t.team() && target.blends(t, rot, ob.tileX(), ob.tileY(), ob.rotation, ob.block);
    };




    public class BFluidPipeUpdater extends BuildUpdater<Conduit.ConduitBuild, Conduit> {


        public BFluidPipeUpdater(Conduit.ConduitBuild b) throws NoSuchFieldException, IllegalAccessException {
            super(b);
        };


        @FragMethod
        public float moveLiquid(Building b_t, Liquid liq) {
            float amtTrans = 0f;
            if(b_t == null) return amtTrans;
            b_t = b_t.getLiquidDestination(b, liq);
            if(b_t == null || b_t.liquids == null) return amtTrans;

            amtTrans = LCCraftingHandler.transLiquid(
                b, b_t, liq,
                blk.liquidCapacity * Math.max(b.liquids.get(liq) / blk.liquidCapacity - b_t.liquids.get(liq) / b_t.block.liquidCapacity, 0f)
            );
            Liquid oliq = b_t.liquids.current();

            if(
                !Vars.net.client()
                    && Mathf.chanceDelta(0.1f)
                    && !b_t.block.consumesLiquid(liq)
                    && b.liquids.get(liq) / b.block.liquidCapacity > 0.1f
                    && b_t.liquids.get(oliq) / b_t.block.liquidCapacity > 0.1f
            ) {
                LCScriptUtil.handleReaction(liq, oliq, 10f, b_t);
            };

            return amtTrans;
        };


    };


};
