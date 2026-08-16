package lovec.graphics.drawer;

import arc.Events;
import arc.graphics.Color;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.Fill;
import arc.graphics.g2d.Lines;
import arc.math.Rand;
import arc.struct.IntFloatMap;
import arc.util.Time;
import lovec.utils.LCScriptUtil;
import mindustry.game.EventType;
import mindustry.gen.Building;
import mindustry.world.Block;
import mindustry.world.draw.DrawBlock;

/**
 * Draws bubbles.
 */
public class LCDrawRipple extends DrawBlock {


    public float offX;
    public float offY;
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


    @Override
    public void load(Block blk) {
        if(!blk.hasLiquids) throw new ClassCastException(blk.name + " has no liquid module!");

        Events.on(EventType.WorldLoadEvent.class, ev -> noLiqCdMap.clear());
    };


    @Override
    public void draw(Building b) {
        float warmup = b.warmup();
        if(warmup < 0.01f) return;
        if(hasNoLiqCheck) {
            int posInt = b.pos();
            float cd = noLiqCdMap.get(posInt, 0f);
            noLiq = true;
            b.liquids.each((liq, amt) -> {
                if(!noLiq) return;
                if(amt > 0.01f && !liq.gas && !LCScriptUtil.checkCond("_isAuxiliaryFluid", liq)) {
                    noLiq = false;
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

        Draw.color(color, color.a * warmup);
        rand.setSeed(b.id);
        int i = 0;
        while(i < amount) {
            float offX_fi = rand.range(radius) + offX;
            float offY_fi = rand.range(radius) + offY;
            float life = 1f - ((Time.time / scl + rand.random(recur)) % recur);
            if(life > 0f) {
                if(filled) {
                    Fill.circle(b.x + offX_fi, b.y + offY_fi, size);
                } else {
                    Lines.stroke(warmup * (life + minStroke));
                    Lines.poly(b.x + offX_fi, b.y + offY_fi, 8, (1f - life) * size);
                };
            };
            i++;
        };
        Draw.color();
    };


};
