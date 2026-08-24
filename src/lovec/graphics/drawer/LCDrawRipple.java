package lovec.graphics.drawer;

import arc.Events;
import arc.graphics.Color;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.Fill;
import arc.graphics.g2d.Lines;
import arc.math.Rand;
import arc.struct.IntFloatMap;
import arc.util.Time;
import arc.util.Tmp;
import lovec.annotation.JSONTypeClass;
import lovec.utils.LCScriptUtil;
import mindustry.game.EventType;
import mindustry.gen.Building;
import mindustry.world.Block;

/**
 * Draws bubbles.
 */
@JSONTypeClass
public class LCDrawRipple extends LCDrawer {


    public int amount = 12;
    public float radius = 3f;
    public float size = 3f;
    public float minStroke = 0.2f;
    public Color color = Color.valueOf("ffffff40");
    public float scl = 30f;
    public float recur = 6f;
    public boolean filled = false;
    public boolean hasNoLiqCheck = false;

    protected Rand rand = new Rand();
    protected IntFloatMap noLiqCdMap = new IntFloatMap();
    protected boolean noLiq = false;
    protected float lastA;


    @Override
    public void load(Block blk) {
        if(!blk.hasLiquids) throw new ClassCastException(blk.name + " has no liquid module!");

        Events.on(EventType.WorldLoadEvent.class, ev -> noLiqCdMap.clear());
    };


    @Override
    public void draw(Building b) {
        float warmup = b.warmup();
        if(warmup < 0.01f) return;
        lastA = 1f;
        if(hasNoLiqCheck) {
            int posInt = b.pos();
            float cd = noLiqCdMap.get(posInt, 0f);
            noLiq = true;
            b.liquids.each((liq, amt) -> {
                if(!noLiq) return;
                if(amt > 0.01f && !liq.gas && !LCScriptUtil.checkCond("isAuxiliaryFluid", liq)) {
                    noLiq = false;
                    lastA = Math.min(amt / b.block.liquidCapacity, lastA);
                };
            });
            if(noLiq) {
                cd = Math.min(cd + 1f, 20f);
                noLiqCdMap.put(posInt, cd);
            } else {
                cd = 0f;
                noLiqCdMap.put(posInt, cd);
            };
            if(cd >= 20f) return;
        };

        Draw.color(color, color.a * warmup * lastA);
        rand.setSeed(b.id);
        int i = 0;
        while(i < amount) {
            calcRotatedOff(Tmp.v1, b.rotation).add(b).add(rand.range(radius), rand.range(radius));
            float life = 1f - ((Time.time / scl + rand.random(recur)) % recur);
            if(life > 0f) {
                if(filled) {
                    Fill.circle(Tmp.v1.x, Tmp.v1.y, size);
                } else {
                    Lines.stroke(warmup * (life + minStroke));
                    Lines.poly(Tmp.v1.x, Tmp.v1.y, 8, (1f - life) * size);
                };
            };
            i++;
        };
        Draw.color();
    };


};
