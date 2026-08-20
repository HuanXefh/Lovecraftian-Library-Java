package lovec.graphics.drawer.multiblock;

import arc.Core;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.TextureRegion;
import arc.math.Mathf;
import arc.util.Tmp;
import lovec.annotation.JSONTypeClass;
import mindustry.gen.Building;
import mindustry.world.Block;

/**
 * Draws fading region for non-square structure.
 */
@JSONTypeClass
public class LCDrawMultiBlockFade extends LCDrawMultiBlock {


    public String suffix = "-top";
    public float alpha = 0.6f;
    public float scl = 3f;

    protected TextureRegion fadeReg;


    public LCDrawMultiBlockFade() {
        super();

        rotate = true;
    };


    @Override
    public void load(Block blk) {
        super.load(blk);
        fadeReg = Core.atlas.find(blk.name + suffix);
    };


    @Override
    public void draw(Building b) {
        Draw.alpha(Mathf.absin(b.totalProgress(), scl, alpha) * b.warmup());
        calcMultiBlockOff(Tmp.v1, b.rotation).add(b);
        Draw.rect(fadeReg, Tmp.v1.x, Tmp.v1.y, calcAng(b.rotation));
        Draw.color();
    };


};
