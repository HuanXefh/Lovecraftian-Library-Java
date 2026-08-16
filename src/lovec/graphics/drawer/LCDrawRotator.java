package lovec.graphics.drawer;

import arc.Core;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.TextureRegion;
import arc.math.Mathf;
import arc.util.Eachable;
import mindustry.entities.units.BuildPlan;
import mindustry.gen.Building;
import mindustry.world.Block;
import mindustry.world.draw.DrawBlock;

/**
 * Draws rotating sprite.
 * Supports clockwise rotation.
 */
public class LCDrawRotator extends DrawBlock {


    public String suffix = "-rotator";
    public float offX;
    public float offY;
    public float angle;
    public float speed;
    public boolean spinSprite = true;

    protected TextureRegion rotReg;


    @Override
    public void load(Block blk) {
        rotReg = Core.atlas.find(blk.name + suffix);
    };


    @Override
    public TextureRegion[] icons(Block blk) {
        return new TextureRegion[]{rotReg};
    };


    @Override
    public void drawPlan(Block blk, BuildPlan plan, Eachable<BuildPlan> plans) {
        Draw.rect(rotReg, plan.drawx() + offX, plan.drawy() + offY, angle);
    };


    @Override
    public void draw(Building b) {
        float ang = Mathf.mod(b.totalProgress() * speed + angle, 90f);
        if(!spinSprite) {
            Draw.rect(rotReg, b.x + offX, b.y + offY, ang);
        } else {
            if(speed < 0f) {
                Draw.rect(rotReg, b.x + offX, b.y + offY, -ang + 90f);
                Draw.alpha(1f - ang / 90f);
                Draw.rect(rotReg, b.x + offX, b.y + offY, -ang);
            } else {
                Draw.rect(rotReg, b.x + offX, b.y + offY, ang);
                Draw.alpha(ang / 90f);
                Draw.rect(rotReg, b.x + offX, b.y + offY, ang - 90f);
            };
            Draw.color();
        };
    };


};