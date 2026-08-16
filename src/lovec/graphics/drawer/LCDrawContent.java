package lovec.graphics.drawer;

import arc.func.Func;
import arc.graphics.Color;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.TextureRegion;
import arc.util.Tmp;
import mindustry.ctype.UnlockableContent;
import mindustry.gen.Building;
import mindustry.world.Block;
import mindustry.world.draw.DrawBlock;

/**
 * Draws icon of some content.
 */
public class LCDrawContent extends DrawBlock {


    public float offX;
    public float offY;
    public float regScl = 1f;
    public UnlockableContent content;
    public Func<Building, UnlockableContent> contentF;
    public Color color;
    public Func<Building, Color> colorF;


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
        if(colorF == null) {
            Draw.rect(reg, b.x + offX, b.y + offY, reg.width * reg.scl() * regScl, reg.height * reg.scl() * regScl);
        } else {
            Tmp.c1.set(colorF.get(b));
            Draw.color(Tmp.c1, Tmp.c1.a);
            Draw.rect(reg, b.x + offX, b.y + offY, reg.width * reg.scl() * regScl, reg.height * reg.scl() * regScl);
            Draw.color();
        };
    };


};
