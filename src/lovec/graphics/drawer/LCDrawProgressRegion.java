package lovec.graphics.drawer;

import arc.Core;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.TextureRegion;
import arc.math.Mathf;
import arc.util.Tmp;
import lovec.annotation.LCJSONTypeClass;
import lovec.graphics.SLCDraw;
import mindustry.gen.Building;
import mindustry.world.Block;
import mindustry.world.blocks.production.GenericCrafter;

/**
 * Draws a sprite where alpha is controlled by crafter progress.
 */
@LCJSONTypeClass
public class LCDrawProgressRegion extends LCDrawer {


    public String suffix = "-top";
    public float alphaFrom = 0f;
    public float alphaTo = 1f;
    public float targetProgress = 1f;
    public float z = -1f;

    protected TextureRegion progReg;


    @Override
    public void load(Block blk) {
        if(!(blk instanceof GenericCrafter)) throw new ClassCastException(blk.name + " is not a crafter!");
        progReg = Core.atlas.find(blk.name + suffix);
    };


    @Override
    public void draw(Building b) {
        if(b instanceof GenericCrafter.GenericCrafterBuild cb) {
            SLCDraw.processZ(z);
            Draw.alpha(Mathf.lerp(alphaFrom, alphaTo, Mathf.clamp(cb.progress / targetProgress)));
            calcRotatedOff(Tmp.v1, b.rotation).add(b);
            Draw.rect(progReg, Tmp.v1.x, Tmp.v1.y, calcAng(b.rotation));
            Draw.color();
            SLCDraw.processZ(-1f);
        };
    };


};
