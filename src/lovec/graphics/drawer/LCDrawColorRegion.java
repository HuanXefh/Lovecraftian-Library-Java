package lovec.graphics.drawer;

import arc.Core;
import arc.func.Func;
import arc.graphics.Color;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.TextureRegion;
import arc.util.Tmp;
import lovec.annotation.JSONTypeClass;
import lovec.annotation.NoJSON;
import mindustry.gen.Building;
import mindustry.world.Block;

/**
 * Draws region with dynamic color.
 */
@JSONTypeClass
public class LCDrawColorRegion extends LCDrawer {


    public String suffix = "-color";
    public Color color;
    public @NoJSON Func<Building, Color> colorF;

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

        Draw.color(color0, color0.a);
        calcRotatedOff(Tmp.v1, b.rotation).add(b);
        Draw.rect(colorReg, Tmp.v1.x, Tmp.v1.y, calcAng(b.rotation));
        Draw.color();
    };


};
