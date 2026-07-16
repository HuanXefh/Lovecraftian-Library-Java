package lovec.content.frag;

import arc.math.Mathf;
import lovec.content.ContentFrag;
import lovec.utils.LCScript;
import mindustry.entities.units.BuildPlan;
import mindustry.gen.Building;
import mindustry.world.Block;
import mindustry.world.Tile;
import mindustry.world.blocks.distribution.Conveyor;

import static lovec.utils.LCScript.MDL_cond;

public class BLKFragCable implements ContentFrag<Conveyor, BLKFragCable> {


    Conveyor lastThis;


    public Conveyor getThis() {
        return lastThis;
    };


    public BLKFragCable setThis(Conveyor thisVal) {
        lastThis = thisVal;
        return this;
    };


    public boolean blends(Tile t, int rot, int otx, int oty, int orot, Block oblk) {
        Conveyor blk = getThis();
        return (
            (oblk.consPower != null || oblk.outputsPower)
                && !(boolean)(LCScript.invoke("_isFluidConduit", MDL_cond, oblk))
                && !(boolean)(LCScript.invoke("_isArmoredCable", MDL_cond, oblk))
        ) || (
            blk.lookingAt(t, rot, otx, oty, oblk)
                && oblk.hasPower
                && !(boolean)(LCScript.invoke("_isFluidConduit", MDL_cond, oblk))
        );
    };
    // Overload
    public boolean blends(Tile t, int rot, BuildPlan[] bPlans, int dir, boolean shouldCheckWorld) {
        Conveyor blk = getThis();
        if(bPlans != null) {
            BuildPlan bPlan = bPlans[Mathf.mod(rot - dir, 4)];
            if(bPlan != null && blk.blends(t, rot, bPlan.x, bPlan.y, bPlan.rotation, bPlan.block)) return true;
        };
        return shouldCheckWorld && blk.blends(t, rot, dir);
    };
    public boolean blends(Tile t, int rot, int dir) {
        Conveyor blk = getThis();
        Building ob = t.nearbyBuild(Mathf.mod(rot - dir, 4));
        return ob != null && ob.team == t.team() && blk.blends(t, rot, ob.tileX(), ob.tileY(), ob.rotation, ob.block);
    };


}
