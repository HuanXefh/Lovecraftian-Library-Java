package lovec.content.frag;

import arc.math.Mathf;
import lovec.content.ContentFrag;
import lovec.utils.LCScript;
import mindustry.entities.units.BuildPlan;
import mindustry.gen.Building;
import mindustry.world.Block;
import mindustry.world.Tile;
import mindustry.world.blocks.liquid.Conduit;

import static lovec.utils.LCScript.MDL_cond;

public class BLKFragFluidPipe implements ContentFrag<Conduit, BLKFragFluidPipe> {


    Conduit lastThis;


    public Conduit getThis() {
        return lastThis;
    };


    public BLKFragFluidPipe setThis(Conduit thisVal) {
        lastThis = thisVal;
        return this;
    };


    public boolean blends(Tile t, int rot, int otx, int oty, int orot, Block oblk) {
        Conduit blk = getThis();
        return oblk.hasLiquids
            && (oblk.outputsLiquid || blk.lookingAt(t, rot, otx, oty, oblk))
            && (blk.lookingAtEither(t, rot, otx, oty, orot, oblk) || (boolean)(LCScript.invoke("_isFluidRouter", MDL_cond, oblk)));
    };
    // Overload
    public boolean blends(Tile t, int rot, BuildPlan[] bPlans, int dir, boolean shouldCheckWorld) {
        Conduit blk = getThis();
        if(bPlans != null) {
            BuildPlan bPlan = bPlans[Mathf.mod(rot - dir, 4)];
            if(bPlan != null && blk.blends(t, rot, bPlan.x, bPlan.y, bPlan.rotation, bPlan.block)) return true;
        };
        return shouldCheckWorld && blk.blends(t, rot, dir);
    };
    public boolean blends(Tile t, int rot, int dir) {
        Conduit blk = getThis();
        Building ob = t.nearbyBuild(Mathf.mod(rot - dir, 4));
        return ob != null && ob.team == t.team() && blk.blends(t, rot, ob.tileX(), ob.tileY(), ob.rotation, ob.block);
    };


};
