package lovec.graphics.drawer;

import arc.func.Func3;
import arc.graphics.Color;
import arc.math.Mathf;
import arc.util.Tmp;
import lovec.annotation.JSONTypeClass;
import lovec.annotation.NoJSON;
import lovec.utils.func.Floatf3;
import mindustry.Vars;
import mindustry.content.Fx;
import mindustry.entities.Effect;
import mindustry.gen.Building;
import mindustry.world.Block;

/**
 * A drawer that spawns effect.
 */
@JSONTypeClass
public class LCDrawEffect extends LCDrawer {


    public Effect effect = Fx.none;
    public float effectChance = 0.02f;
    public boolean rotate = false;
    public float angle = -1f;
    public boolean randomAngle = false;
    public @NoJSON Floatf3<Building, Float, Float> angleF;
    public Color color;
    public @NoJSON Func3<Building, Float, Float, Color> colorF;
    public @NoJSON Object data;
    public @NoJSON Func3<Building, Float, Float, Object> dataF;


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

        calcRotatedOff(Tmp.v1, b.rotation).add(b);
        effect.at(
            Tmp.v1.x, Tmp.v1.y,
            angleF == null ? 0f : angleF.get(b, Tmp.v1.x, Tmp.v1.y),
            colorF == null ? Color.white : colorF.get(b, Tmp.v1.x, Tmp.v1.y),
            dataF == null ? null : dataF.get(b, Tmp.v1.x, Tmp.v1.y)
        );
    };


};
