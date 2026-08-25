package lovec.graphics.drawer.multiblock;

import arc.Core;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.TextureRegion;
import arc.util.Eachable;
import arc.util.Tmp;
import lovec.annotation.JSONTypeClass;
import lovec.graphics.LCDraw;
import mindustry.entities.units.BuildPlan;
import mindustry.gen.Building;
import mindustry.world.Block;

/**
 * Draw a non-square region that is symmetric.
 * For multi-block structure.
 * <br> <code>DEDICATION</code>: Inspired by MultiBlockLib.
 */
@JSONTypeClass
public class LCDrawMultiBlockSymmetricRegion extends LCDrawMultiBlock {


    public String suffix = "";
    public float z = -1;

    protected TextureRegion[] regs;


    public LCDrawMultiBlockSymmetricRegion() {
        super();

        rotate = true;
        isSymmetric = true;
    };


    @Override
    public void load(Block blk) {
        super.load(blk);
        regs = new TextureRegion[2];
        for(int i = 0; i < 2; i++) {
            regs[i] = Core.atlas.find(blk.name + suffix + "-" + i);
        };
    };


    @Override
    public void drawPlan(Block blk, BuildPlan bPlan, Eachable<BuildPlan> bPlans) {
        calcMultiBlockOff(Tmp.v1, bPlan.rotation).add(bPlan.drawx(), bPlan.drawy());
        Draw.rect(regs[bPlan.rotation % 2], Tmp.v1.x, Tmp.v1.y);
    };


    @Override
    public void draw(Building b) {
        LCDraw.processZ(z);
        calcMultiBlockOff(Tmp.v1, b.rotation).add(b);
        Draw.rect(regs[b.rotation % 2], Tmp.v1.x, Tmp.v1.y);
        LCDraw.processZ(-1f);
    };


};
