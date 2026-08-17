package lovec.graphics.drawer;

import arc.Core;
import arc.graphics.Color;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.TextureRegion;
import arc.math.Mathf;
import arc.util.Tmp;
import lovec.utils.LCScript;
import lovec.utils.LCScriptUtil;
import mindustry.gen.Building;
import mindustry.world.Block;
import mindustry.world.draw.DrawBlock;

/**
 * Draws liquid region, color is determined by all liquids in the building.
 */
public class LCDrawMixedLiquid extends DrawBlock {


    public String suffix = "-liquid";
    public float offX;
    public float offY;
    public boolean rotate = false;

    protected boolean firstLiq = false;
    protected TextureRegion liqReg;


    @Override
    public void load(Block blk) {
        if(!blk.hasLiquids) throw new ClassCastException(blk.name + " does not have liquid module!");
        liqReg = Core.atlas.find(blk.name + suffix);
    };


    @Override
    public void draw(Building b) {
        Tmp.c1.set(Color.clear);
        firstLiq = true;
        b.liquids.each((liq, amt) -> {
            if(amt > 0.01 && !liq.gas && !LCScriptUtil.checkCond("isAuxiliaryFluid", LCScript.wrap(liq))) {
                if(firstLiq) {
                    firstLiq = false;
                    Tmp.c1.set(liq.color).a(amt / b.block.liquidCapacity);
                } else {
                    Tmp.c1.lerp(Tmp.c2.set(liq.color).a(amt / b.block.liquidCapacity), 0.5f);
                };
            };
        });

        Draw.color(Tmp.c1, Tmp.c1.a);
        if(rotate) {
            Draw.rect(liqReg, b.x + offX * Mathf.cosDeg(b.drawrot()), b.y + offY * Mathf.sinDeg(b.drawrot()), b.drawrot());
        } else {
            Draw.rect(liqReg, b.x + offX, b.y + offY);
        };
        Draw.color();
    };


};
