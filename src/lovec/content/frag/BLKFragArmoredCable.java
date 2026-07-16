package lovec.content.frag;

import arc.math.Mathf;
import arc.math.geom.Geometry;
import arc.math.geom.Point2;
import lovec.content.ContentFrag;
import lovec.utils.LCScript;
import mindustry.entities.units.BuildPlan;
import mindustry.gen.Building;
import mindustry.world.Block;
import mindustry.world.Edges;
import mindustry.world.Tile;
import mindustry.world.blocks.distribution.ArmoredConveyor;

import static lovec.utils.LCScript.MDL_cond;

public class BLKFragArmoredCable implements ContentFrag<ArmoredConveyor, BLKFragArmoredCable> {


    ArmoredConveyor lastThis;


    public ArmoredConveyor getThis() {
        return lastThis;
    };


    public BLKFragArmoredCable setThis(ArmoredConveyor thisVal) {
        lastThis = thisVal;
        return this;
    };


    public boolean blends(Tile t, int rot, int otx, int oty, int orot, Block oblk) {
        ArmoredConveyor blk = getThis();
        return (
            (oblk.consPower != null || oblk.outputsPower)
                && !(boolean)(LCScript.invoke("_isFluidConduit", MDL_cond, oblk))
                && blk.blendsArmored(t, rot, otx, oty, orot, oblk)
        ) || (
            blk.lookingAt(t, rot, otx, oty, oblk)
                && oblk.hasPower
                && !(boolean)(LCScript.invoke("_isFluidConduit", MDL_cond, oblk))
        );
    };
    // Overload
    public boolean blends(Tile t, int rot, BuildPlan[] bPlans, int dir, boolean shouldCheckWorld) {
        ArmoredConveyor blk = getThis();
        if(bPlans != null) {
            BuildPlan bPlan = bPlans[Mathf.mod(rot - dir, 4)];
            if(bPlan != null && blk.blends(t, rot, bPlan.x, bPlan.y, bPlan.rotation, bPlan.block)) return true;
        };
        return shouldCheckWorld && blk.blends(t, rot, dir);
    };
    public boolean blends(Tile t, int rot, int dir) {
        ArmoredConveyor blk = getThis();
        Building ob = t.nearbyBuild(Mathf.mod(rot - dir, 4));
        return ob != null && ob.team == t.team() && blk.blends(t, rot, ob.tileX(), ob.tileY(), ob.rotation, ob.block);
    };


    public boolean blendsArmored(Tile t, int rot, int otx, int oty, int orot, Block oblk) {
        ArmoredConveyor blk = getThis();

        // WTF is going on here
        return Point2.equals(t.x + Geometry.d4(rot).x, t.y + Geometry.d4(rot).y, otx, oty)
            || (
                (
                    !oblk.rotatedOutput(otx, oty, t)
                        && Edges.getFacingEdge(oblk, otx, oty, t) != null
                        && Edges.getFacingEdge(oblk, otx, oty, t).relativeTo(t) == rot
                ) || (
                    (boolean)(LCScript.invoke("_isArmoredCable", MDL_cond, oblk))
                        && oblk.rotatedOutput(otx, oty, t)
                        && Point2.equals(otx + Geometry.d4(orot).x, oty + Geometry.d4(orot).y, t.x, t.y)
                )
            );
    };


}
