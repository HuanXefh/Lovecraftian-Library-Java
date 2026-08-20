package lovec.graphics.drawer;

import arc.func.Func;
import arc.graphics.Color;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.TextureRegion;
import arc.util.Tmp;
import lovec.annotation.JSONTypeClass;
import lovec.annotation.NoJSON;
import mindustry.ctype.UnlockableContent;
import mindustry.gen.Building;
import mindustry.world.Block;

/**
 * Draws icon of some content.
 */
@JSONTypeClass
public class LCDrawContent extends LCDrawer {


    public float regScl = 1f;
    public UnlockableContent content;
    public @NoJSON Func<Building, UnlockableContent> contentF;
    public Color color;
    public @NoJSON Func<Building, Color> colorF;


    @Override
    public void load(Block blk) {
        if(content != null) {
            contentF = b -> content;
        };
        if(color != null) {
            colorF = b -> color;
        };
    };


    @Override
    public void draw(Building b) {
        if(contentF == null) return;
        UnlockableContent ct = contentF.get(b);
        if(ct == null) return;

        TextureRegion reg = ct.fullIcon;
        calcRotatedOff(Tmp.v1, b.rotation).add(b);
        if(colorF == null) {
            Draw.rect(reg, Tmp.v1.x, Tmp.v1.y, reg.width * reg.scl() * regScl, reg.height * reg.scl() * regScl, calcAng(b.rotation));
        } else {
            Tmp.c1.set(colorF.get(b));
            Draw.color(Tmp.c1, Tmp.c1.a);
            Draw.rect(reg, Tmp.v1.x, Tmp.v1.y, reg.width * reg.scl() * regScl, reg.height * reg.scl() * regScl, calcAng(b.rotation));
            Draw.color();
        };
    };


};
