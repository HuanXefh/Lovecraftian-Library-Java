package lovec.graphics.drawer;

import arc.Core;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.TextureRegion;
import arc.math.Mathf;
import arc.util.Tmp;
import lovec.annotation.JSONTypeClass;
import mindustry.gen.Building;
import mindustry.world.Block;

/**
 * Better <code>DrawFade</code>.
 */
@JSONTypeClass
public class LCDrawFade extends LCDrawer {


    public String suffix = "-top";
    public float alpha = 0.6f;
    public float scale = 3f;
    public float progressOffset = 0f;

    protected TextureRegion fadeReg;


    @Override
    public void load(Block blk) {
        fadeReg = Core.atlas.find(blk.name + suffix);
    };


    @Override
    public void draw(Building b) {
        Draw.alpha(Mathf.absin(b.totalProgress() + progressOffset, scale, alpha) * b.warmup());
        calcRotatedOff(Tmp.v1, b.rotation).add(b);
        Draw.rect(fadeReg, Tmp.v1.x, Tmp.v1.y, calcAng(b.rotation));
        Draw.color();
    };


};
