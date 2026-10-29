package lovec.graphics.drawer;

import arc.func.Func3;
import arc.graphics.Color;
import arc.math.Mathf;
import arc.math.geom.Vec2;
import arc.util.Nullable;
import lovec.annotation.LCJSONTypeClass;
import lovec.annotation.LCNoJSON;
import lovec.utils.func.Floatf3;
import mindustry.Vars;
import mindustry.content.Fx;
import mindustry.entities.Effect;
import mindustry.gen.Building;
import mindustry.world.Block;

/**
 * A drawer that spawns effect.
 */
@LCJSONTypeClass
public class LCDrawEffect extends LCDrawer {


    public Effect effect = Fx.none;
    public float effectChance = 0.02f;
    public boolean rotate = false;
    public float angle = -1f;
    public boolean randomAngle = false;
    public @LCNoJSON @Nullable Floatf3<Building, Float, Float> angleF;
    public @Nullable Color color;
    public @LCNoJSON @Nullable Func3<Building, Float, Float, Color> colorF;
    public @LCNoJSON @Nullable Object data;
    public @LCNoJSON @Nullable Func3<Building, Float, Float, Object> dataF;

    protected Vec2 lastEffPos = new Vec2();


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

        calcRotatedOff(lastEffPos, b.rotation).add(b);
        effect.at(
            lastEffPos.x, lastEffPos.y,
            angleF == null ? 0f : angleF.get(b, lastEffPos.x, lastEffPos.y),
            colorF == null ? Color.white : colorF.get(b, lastEffPos.x, lastEffPos.y),
            dataF == null ? null : dataF.get(b, lastEffPos.x, lastEffPos.y)
        );
    };


};
