package lovec.graphics.drawer;

import arc.Core;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.TextureRegion;
import arc.util.Eachable;
import lovec.annotation.JSONTypeClass;
import lovec.graphics.LCDraw;
import mindustry.entities.units.BuildPlan;
import mindustry.gen.Building;
import mindustry.world.Block;

/**
 * Draws different regions for each rotation.
 */
@JSONTypeClass
public class LCDrawFourSideRegions extends LCDrawer {


    public String suffix = "-side";
    public float z = -1f;

    protected TextureRegion[] sideRegs;


    @Override
    public void load(Block blk) {
        super.load(blk);

        sideRegs = new TextureRegion[4];
        for(int i = 0; i < 4; i++) {
            sideRegs[i] = Core.atlas.find(blk.name + suffix + i, blk.name);
        };
    };


    @Override
    public void drawPlan(Block blk, BuildPlan bPlan, Eachable<BuildPlan> bPlans) {
        Draw.rect(sideRegs[bPlan.rotation % 4], bPlan.drawx(), bPlan.drawy());
    };


    @Override
    public void draw(Building b) {
        LCDraw.processZ(z);
        Draw.rect(sideRegs[b.rotation % 4], b.x, b.y);
        LCDraw.processZ(-1f);
    };


};
