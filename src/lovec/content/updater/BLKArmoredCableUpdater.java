package lovec.content.updater;

import arc.math.Mathf;
import arc.math.geom.Geometry;
import arc.math.geom.Point2;
import lovec.content.BuildUpdater;
import lovec.content.ContentUpdater;
import lovec.utils.LCScriptUtil;
import mindustry.entities.units.BuildPlan;
import mindustry.gen.Building;
import mindustry.world.Block;
import mindustry.world.Edges;
import mindustry.world.Tile;
import mindustry.world.blocks.distribution.ArmoredConveyor;

public class BLKArmoredCableUpdater extends ContentUpdater<ArmoredConveyor> {


    public BLKArmoredCableUpdater(ArmoredConveyor blk) throws NoSuchFieldException, IllegalAccessException {
        super(blk);
    };


    @FragMethod
    public boolean blends(Tile t, int rot, int otx, int oty, int orot, Block oblk) {
        return (
            (oblk.consPower != null || oblk.outputsPower)
                && !LCScriptUtil.checkCond("isFluidConduit", oblk)
                && target.blendsArmored(t, rot, otx, oty, orot, oblk)
        ) || (
            target.lookingAt(t, rot, otx, oty, oblk)
                && oblk.hasPower
                && !LCScriptUtil.checkCond("isFluidConduit", oblk)
        );
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


    @FragMethod
    public boolean blendsArmored(Tile t, int rot, int otx, int oty, int orot, Block oblk) {
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




    public class BArmoredCableUpdater extends BuildUpdater<ArmoredConveyor.ArmoredConveyorBuild, ArmoredConveyor> {


        public BArmoredCableUpdater(ArmoredConveyor.ArmoredConveyorBuild b) throws NoSuchFieldException, IllegalAccessException {
            super(b);
        };


    };


};
