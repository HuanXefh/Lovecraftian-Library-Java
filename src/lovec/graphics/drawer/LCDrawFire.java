package lovec.graphics.drawer;

import arc.Core;
import arc.Events;
import arc.graphics.Color;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.TextureRegion;
import arc.math.Mathf;
import arc.struct.IntFloatMap;
import arc.util.Time;
import arc.util.Tmp;
import lovec.annotation.JSONTypeClass;
import lovec.graphics.LCDraw;
import mindustry.Vars;
import mindustry.game.EventType;
import mindustry.gen.Building;
import mindustry.world.Block;

/**
 * Draws fake fire that won't spread.
 */
@JSONTypeClass
public class LCDrawFire extends LCDrawer {


    public String sprite = "fire";
    public float frameDuration = 2.25f;
    public int frameCap = 40;

    protected IntFloatMap frameCurMap = new IntFloatMap();
    protected TextureRegion[] regs;


    @Override
    public void load(Block blk) {
        regs = new TextureRegion[frameCap];
        for(int i = 0; i < frameCap; i++) {
            regs[i] = Core.atlas.find(sprite + i);
        };

        Events.on(EventType.WorldLoadEvent.class, ev -> frameCurMap.clear());
    };


    @Override
    public void draw(Building b) {
        int posInt = b.pos();
        if(!frameCurMap.containsKey(posInt)) {
            frameCurMap.put(posInt, frameCap * Mathf.random());
        };
        if(!Vars.state.isPaused()) {
            frameCurMap.put(posInt, (frameCurMap.get(posInt) + Time.delta / frameDuration) % frameCap);
        };
        float warmup = b.warmup();
        Draw.color(Color.white, warmup > 0f ? 1f : 0f);
        LCDraw.processScl(warmup);
        calcRotatedOff(Tmp.v1, b.rotation).add(b);
        Draw.rect(regs[Mathf.floor(frameCurMap.get(posInt))], Tmp.v1.x, Tmp.v1.y);
        LCDraw.processScl(-1f);
        Draw.color();
    };


};
