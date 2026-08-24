package lovec.graphics.drawer;

import arc.Core;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.TextureRegion;
import arc.math.Mathf;
import arc.util.Eachable;
import arc.util.Tmp;
import lovec.annotation.JSONTypeClass;
import lovec.graphics.LCDraw;
import mindustry.entities.units.BuildPlan;
import mindustry.gen.Building;
import mindustry.world.Block;

/**
 * Draws rotating sprite.
 * Supports clockwise rotation.
 */
@JSONTypeClass
public class LCDrawRotator extends LCDrawer implements SpinSpriteFrag {


    public String suffix = "-rotator";
    public String blurSuffix = "-blur";
    public float z = -1f;
    public float angle;
    public float speed;
    public int sides = 4;
    public boolean spinSprite = true;
    public float blurThreshold = 0.7f;

    protected float sideAng;
    protected boolean blurred;
    protected TextureRegion rotReg;
    protected TextureRegion blurRotReg;


    @Override
    public void load(Block blk) {
        sideAng = 360f / sides;

        rotReg = Core.atlas.find(blk.name + suffix);
        blurRotReg = Core.atlas.find(blk.name + suffix + blurSuffix);
    };


    @Override
    public TextureRegion[] icons(Block blk) {
        return new TextureRegion[]{rotReg};
    };


    @Override
    public void drawPlan(Block blk, BuildPlan bPlan, Eachable<BuildPlan> bPlans) {
        calcRotatedOff(Tmp.v1, bPlan.rotation).add(bPlan.drawx(), bPlan.drawy());
        Draw.rect(rotReg, Tmp.v1.x, Tmp.v1.y, angle);
    };


    @Override
    public void draw(Building b) {
        float ang = b.totalProgress() * Math.abs(speed) + angle;
        blurred = blurRotReg.found() && b.warmup() >= blurThreshold;
        ang = Mathf.mod(ang, sideAng);

        LCDraw.processZ(z);
        calcRotatedOff(Tmp.v1, b.rotation).add(b);
        if(!spinSprite) {
            Draw.rect(blurred ? blurRotReg : rotReg, Tmp.v1.x, Tmp.v1.y, ang);
        } else {
            drawRotator(blurred ? blurRotReg : rotReg, Tmp.v1.x, Tmp.v1.y, ang, speed, sideAng);
        };
        LCDraw.processZ(-1f);
    };





};