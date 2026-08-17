package lovec.content.frag;

import arc.math.Mathf;
import lovec.content.ContentFrag;
import lovec.utils.LCScriptUtil;
import mindustry.entities.units.BuildPlan;
import mindustry.gen.Building;
import mindustry.world.Block;
import mindustry.world.Tile;
import mindustry.world.blocks.liquid.Conduit;

public class BLKFragFluidPipe extends ContentFrag<Conduit> {


    @FragMethod
    public boolean blends(Tile t, int rot, int otx, int oty, int orot, Block oblk) {
        Conduit blk = getThis();

        return oblk.hasLiquids
            && (oblk.outputsLiquid || blk.lookingAt(t, rot, otx, oty, oblk))
            && (blk.lookingAtEither(t, rot, otx, oty, orot, oblk) || LCScriptUtil.checkCond("isFluidRouter", oblk));
    };
    // Overload
    @FragMethod
    public boolean blends(Tile t, int rot, BuildPlan[] bPlans, int dir, boolean shouldCheckWorld) {
        Conduit blk = getThis();

        if(bPlans != null) {
            BuildPlan bPlan = bPlans[Mathf.mod(rot - dir, 4)];
            if(bPlan != null && blk.blends(t, rot, bPlan.x, bPlan.y, bPlan.rotation, bPlan.block)) return true;
        };
        return shouldCheckWorld && blk.blends(t, rot, dir);
    };
    @FragMethod
    public boolean blends(Tile t, int rot, int dir) {
        Conduit blk = getThis();

        Building ob = t.nearbyBuild(Mathf.mod(rot - dir, 4));
        return ob != null && ob.team == t.team() && blk.blends(t, rot, ob.tileX(), ob.tileY(), ob.rotation, ob.block);
    };


};
