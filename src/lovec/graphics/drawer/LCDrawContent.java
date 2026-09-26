package lovec.graphics.drawer;

import arc.func.Func;
import arc.graphics.Color;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.TextureRegion;
import arc.util.Tmp;
import lovec.annotation.JSONTypeClass;
import lovec.annotation.NoJSON;
import lovec.utils.LCCompatibilityHandler;
import mindustry.gen.Building;
import mindustry.world.Block;

/**
 * Draws icon of some content.
 */
@JSONTypeClass
public class LCDrawContent extends LCDrawer {


    public float regScl = 1f;
    public Object content;
    public @NoJSON Func<Building, Object> contentF;
    public Color color;
    public @NoJSON Func<Building, Color> colorF;

    private Object lastCt;
    private TextureRegion lastReg;


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
        Object ct = contentF.get(b);
        if(ct == null) return;

        if(ct != lastCt) {
            try {
                lastReg = (TextureRegion) LCCompatibilityHandler.UnlockableContent.getField("fullIcon").get(ct);
                lastCt = ct;
            } catch(Exception err) {
                lastReg = null;
            };
        };
        if(lastReg == null) return;

        calcRotatedOff(Tmp.v1, b.rotation).add(b);
        if(colorF == null) {
            Draw.rect(lastReg, Tmp.v1.x, Tmp.v1.y, lastReg.width * lastReg.scl() * regScl, lastReg.height * lastReg.scl() * regScl, calcAng(b.rotation));
        } else {
            Tmp.c1.set(colorF.get(b));
            Draw.color(Tmp.c1, Tmp.c1.a);
            Draw.rect(lastReg, Tmp.v1.x, Tmp.v1.y, lastReg.width * lastReg.scl() * regScl, lastReg.height * lastReg.scl() * regScl, calcAng(b.rotation));
            Draw.color();
        };
    };


};
