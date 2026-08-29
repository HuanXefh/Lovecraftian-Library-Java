package lovec.content.updater;

import arc.math.Mathf;
import lovec.content.BuildUpdater;
import lovec.content.ContentUpdater;
import lovec.utils.LCScriptUtil;
import mindustry.entities.units.BuildPlan;
import mindustry.gen.Building;
import mindustry.world.Block;
import mindustry.world.Tile;
import mindustry.world.blocks.distribution.Conveyor;

public class BLKCableUpdater extends ContentUpdater<Conveyor> {


    public BLKCableUpdater(Conveyor blk) throws NoSuchFieldException, IllegalAccessException {
        super(blk);
    };


    @FragMethod
    public boolean blends(Tile t, int rot, int otx, int oty, int orot, Block oblk) {
        return (
            (oblk.consPower != null || oblk.outputsPower)
                && !LCScriptUtil.checkCond("isFluidConduit", oblk)
                && !LCScriptUtil.checkCond("isArmoredCable", oblk)
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




    public class BCableUpdater extends BuildUpdater<Conveyor.ConveyorBuild, Conveyor> {


        public BCableUpdater(Conveyor.ConveyorBuild b) throws NoSuchFieldException, IllegalAccessException {
            super(b);
        };


    };


};
