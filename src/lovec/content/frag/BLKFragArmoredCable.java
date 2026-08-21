package lovec.content.frag;

import arc.math.Mathf;
import arc.math.geom.Geometry;
import arc.math.geom.Point2;
import lovec.content.ContentFrag;
import lovec.utils.LCScriptUtil;
import mindustry.entities.units.BuildPlan;
import mindustry.gen.Building;
import mindustry.world.Block;
import mindustry.world.Edges;
import mindustry.world.Tile;
import mindustry.world.blocks.distribution.ArmoredConveyor;

public class BLKFragArmoredCable extends ContentFrag<ArmoredConveyor, BLKFragArmoredCable> {


    @FragMethod
    public boolean blends(Tile t, int rot, int otx, int oty, int orot, Block oblk) {
        ArmoredConveyor blk = getThis();

        return (
            (oblk.consPower != null || oblk.outputsPower)
                && !LCScriptUtil.checkCond("isFluidConduit", oblk)
                && blk.blendsArmored(t, rot, otx, oty, orot, oblk)
        ) || (
            blk.lookingAt(t, rot, otx, oty, oblk)
                && oblk.hasPower
                && !LCScriptUtil.checkCond("isFluidConduit", oblk)
        );
    };
    // Overload
    @FragMethod
    public boolean blends(Tile t, int rot, BuildPlan[] bPlans, int dir, boolean shouldCheckWorld) {
        ArmoredConveyor blk = getThis();

        if(bPlans != null) {
            BuildPlan bPlan = bPlans[Mathf.mod(rot - dir, 4)];
            if(bPlan != null && blk.blends(t, rot, bPlan.x, bPlan.y, bPlan.rotation, bPlan.block)) return true;
        };
        return shouldCheckWorld && blk.blends(t, rot, dir);
    };
    @FragMethod
    public boolean blends(Tile t, int rot, int dir) {
        ArmoredConveyor blk = getThis();

        Building ob = t.nearbyBuild(Mathf.mod(rot - dir, 4));
        return ob != null && ob.team == t.team() && blk.blends(t, rot, ob.tileX(), ob.tileY(), ob.rotation, ob.block);
    };


    @FragMethod
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
                    LCScriptUtil.checkCond("isArmoredCable", oblk)
                        && oblk.rotatedOutput(otx, oty, t)
                        && Point2.equals(otx + Geometry.d4(orot).x, oty + Geometry.d4(orot).y, t.x, t.y)
                )
            );
    };


}
