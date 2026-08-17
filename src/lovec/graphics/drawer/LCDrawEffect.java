package lovec.graphics.drawer;

import arc.func.Func3;
import arc.graphics.Color;
import arc.math.Mathf;
import lovec.utils.func.Floatf3;
import mindustry.Vars;
import mindustry.content.Fx;
import mindustry.entities.Effect;
import mindustry.gen.Building;
import mindustry.world.Block;
import mindustry.world.draw.DrawBlock;

/**
 * A drawer that spawns effect.
 */
public class LCDrawEffect extends DrawBlock {


    public Effect effect = Fx.none;
    public float effectChance = 0.02f;
    public float offX;
    public float offY;
    public float radius;
    public boolean rotate = false;
    public float angle = -1f;
    public boolean randomAngle = false;
    public Floatf3<Building, Float, Float> angleF;
    public Color color;
    public Func3<Building, Float, Float, Color> colorF;
    public Object data;
    public Func3<Building, Float, Float, Object> dataF;


    @Override
    public void load(Block blk) {
        if(angle >= 0f) {
            angleF = (b, x, y) -> angle;
        } else if(randomAngle) {
            if(angle < 0f) {
                angle = 360f;
            };
            angleF = (b, x, y) -> Mathf.random(angle);
        };
        if(color != null) {
            colorF = (b, x, y) -> color;
        };
        if(data != null) {
            dataF = (b, x, y) -> data;
        };
    };


    @Override
    public void draw(Building b) {
        if(Vars.state.isPaused() || !Mathf.chance(effectChance * b.edelta())) return;

        float
            x = b.x + (offX + Mathf.range(radius)) * (!rotate ? 1f : Mathf.cosDeg(b.drawrot())),
            y = b.y + (offY + Mathf.range(radius)) * (!rotate ? 1f : Mathf.sinDeg(b.drawrot()));

        effect.at(
            x, y,
            angleF == null ? 0f : angleF.get(b, x, y),
            colorF == null ? Color.white : colorF.get(b, x, y),
            dataF == null ? null : dataF.get(b, x, y)
        );
    };


};
