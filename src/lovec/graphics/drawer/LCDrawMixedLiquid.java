package lovec.graphics.drawer;

import arc.Core;
import arc.graphics.Color;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.TextureRegion;
import arc.util.Tmp;
import lovec.annotation.JSONTypeClass;
import lovec.utils.LCScript;
import lovec.utils.LCScriptUtil;
import mindustry.gen.Building;
import mindustry.world.Block;

/**
 * Draws liquid region, color is determined by all liquids in the building.
 */
@JSONTypeClass
public class LCDrawMixedLiquid extends LCDrawer {


    public String suffix = "-liquid";
    public float alpha = 1f;

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

        Draw.color(Tmp.c1, Tmp.c1.a * alpha);
        calcRotatedOff(Tmp.v1, b.rotation).add(b);
        Draw.rect(liqReg, Tmp.v1.x, Tmp.v1.y, calcAng(b.rotation));
        Draw.color();
    };


};
