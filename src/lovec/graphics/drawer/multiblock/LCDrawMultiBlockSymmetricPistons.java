package lovec.graphics.drawer.multiblock;

import arc.Core;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.TextureRegion;
import arc.math.Mathf;
import arc.util.Eachable;
import arc.util.Tmp;
import lovec.annotation.JSONTypeClass;
import mindustry.entities.units.BuildPlan;
import mindustry.gen.Building;
import mindustry.world.Block;

/**
 * Draws pistons for non-square structure.
 */
@JSONTypeClass
public class LCDrawMultiBlockSymmetricPistons extends LCDrawMultiBlock {


    public String suffix = "-piston";
    public int sides = 4;
    public float sinMag = 4f;
    public float sinScl = 6f;
    public float sinOffset = 50f;
    public float sideOffset = 0f;
    public float lenOffset = 0f;
    public float horiOffset = 0f;
    public float angleOffset = 0f;

    protected TextureRegion pistonReg1, pistonReg2;
    protected TextureRegion pistonTReg;
    protected TextureRegion iconReg;


    public LCDrawMultiBlockSymmetricPistons() {
        super();

        rotate = true;
        isSymmetric = true;
    };


    @Override
    public void load(Block blk) {
        super.load(blk);
        pistonReg1 = Core.atlas.find(blk.name + suffix + "-0", blk.name + suffix);
        pistonReg2 = Core.atlas.find(blk.name + suffix + "-1", blk.name + suffix);
        pistonTReg = Core.atlas.find(blk.name + suffix + "-t");
        iconReg = Core.atlas.find(blk.name + suffix + "-icon");
    };


    @Override
    public TextureRegion[] icons(Block blk) {
        return new TextureRegion[]{iconReg};
    };


    @Override
    public void drawPlan(Block blk, BuildPlan bPlan, Eachable<BuildPlan> bPlans) {
        TextureRegion reg = iconReg;
        if(reg.found()) {
            calcMultiBlockOff(Tmp.v1, bPlan.rotation).add(bPlan.drawx(), bPlan.drawy());
            Draw.rect(reg, Tmp.v1.x, Tmp.v1.y, calcAng(bPlan.rotation));
        };
    };


    @Override
    public void draw(Building b) {
        int ind = b.rotation % 2;
        float len_i;
        float ang_i;
        TextureRegion reg_i;
        calcMultiBlockOff(Tmp.v1, b.rotation).add(b);
        for(int i = 0; i < sides; i++) {
            len_i = Mathf.absin(b.totalProgress() + sinOffset + sideOffset * sinScl * i, sinScl, sinMag) + lenOffset;
            ang_i = Mathf.mod(calcAng(b.rotation) + angleOffset + i * 360f / sides, 360f);
            reg_i = pistonTReg.found() && (Mathf.equal(ang_i, 315) || Mathf.equal(ang_i, 135)) ?
                pistonTReg :
                ang_i >= 135 && ang_i < 315 ?
                    pistonReg2 :
                    pistonReg1;

            if(Mathf.equal(ang_i, 315)) {
                Draw.yscl = -1f;
            };

            Tmp.v2.trns(ang_i, len_i, -horiOffset).add(Tmp.v1);
            Draw.rect(reg_i, Tmp.v2.x, Tmp.v2.y, ang_i);

            Draw.yscl = 1f;
        };
    };


};
