package lovec.graphics.drawer;

import arc.Core;
import arc.func.Func;
import arc.graphics.Color;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.TextureRegion;
import arc.math.Mathf;
import mindustry.gen.Building;
import mindustry.world.Block;
import mindustry.world.draw.DrawBlock;

/**
 * Draws region with dynamic color.
 */
public class LCDrawColorRegion extends DrawBlock {


    public String suffix = "-color";
    public float offX;
    public float offY;
    public boolean rotate = false;
    public Color color;
    public Func<Building, Color> colorF;

    protected TextureRegion colorReg;


    @Override
    public void load(Block blk) {
        colorReg = Core.atlas.find(blk.name + suffix);
        if(color != null) {
            colorF = b -> color;
        };
    };


    @Override
    public void draw(Building b) {
        if(colorF == null) return;
        Color color0 = colorF.get(b);
        if(color0 == null) return;

        float
            x = b.x + offX * (!rotate ? 1f : Mathf.cosDeg(b.drawrot())),
            y = b.y + offY * (!rotate ? 1f : Mathf.sinDeg(b.drawrot()));

        Draw.color(color0, color0.a);
        Draw.rect(colorReg, x, y, !rotate ? 0f : b.drawrot());
        Draw.color();
    };


};
