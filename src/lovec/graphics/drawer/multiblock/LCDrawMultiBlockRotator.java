package lovec.graphics.drawer.multiblock;

import arc.Core;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.TextureRegion;
import arc.math.Mathf;
import arc.util.Eachable;
import arc.util.Tmp;
import lovec.annotation.JSONTypeClass;
import lovec.graphics.drawer.SpinSpriteFrag;
import mindustry.entities.units.BuildPlan;
import mindustry.gen.Building;
import mindustry.world.Block;

/**
 * Draws rotator for non-square structure.
 */
@JSONTypeClass
public class LCDrawMultiBlockRotator extends LCDrawMultiBlock implements SpinSpriteFrag {


    public String suffix = "-rotator";
    public float angle;
    public float speed;
    public boolean spinSprite = true;

    protected TextureRegion rotReg;


    public LCDrawMultiBlockRotator() {
        super();

        rotate = true;
    };


    @Override
    public void load(Block blk) {
        super.load(blk);
        rotReg = Core.atlas.find(blk.name + suffix);
    };


    @Override
    public TextureRegion[] icons(Block blk) {
        return new TextureRegion[]{rotReg};
    };


    @Override
    public void drawPlan(Block blk, BuildPlan bPlan, Eachable<BuildPlan> bPlans) {
        calcMultiBlockOff(Tmp.v1, bPlan.rotation).add(bPlan.drawx(), bPlan.drawy());
        Draw.rect(rotReg, Tmp.v1.x, Tmp.v1.y, angle);
    };


    @Override
    public void draw(Building b) {
        float ang = Mathf.mod(b.totalProgress() * Math.abs(speed) + angle, 90f);

        calcMultiBlockOff(Tmp.v1, b.rotation).add(b);
        if(!spinSprite) {
            Draw.rect(rotReg, Tmp.v1.x, Tmp.v1.y, ang);
        } else {
            drawRotator(rotReg, Tmp.v1.x, Tmp.v1.y, ang, speed);
        };
    };


};
