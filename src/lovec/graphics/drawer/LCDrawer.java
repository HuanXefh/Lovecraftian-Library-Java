package lovec.graphics.drawer;

import arc.math.Mathf;
import arc.math.geom.Vec2;
import mindustry.world.draw.DrawBlock;

public abstract class LCDrawer extends DrawBlock {


    public float offX;
    public float offY;
    public float spread = -1f;
    public boolean rotate = false;


    public float calcAng(int rot) {
        return !rotate ? 0f : (rot * 90f);
    };


    public float calcRotatedOff(int rot, boolean isY) {
        if(spread < 0f) {
            if(!rotate) return 0f;
            return switch(rot) {
                case 1 -> !isY ? -offY : offX;
                case 2 -> !isY ? -offX : -offY;
                case 3 -> !isY ? offY : -offX;
                default -> !isY ? offX : offY;
            };
        };

        if(!rotate) return (!isY ? offX : offY) + Mathf.range(spread);
        float offX_fi = offX + Mathf.range(spread);
        float offY_fi = offY + Mathf.range(spread);
        return switch(rot) {
            case 1 -> !isY ? -offY_fi : offX_fi;
            case 2 -> !isY ? -offX_fi : -offY_fi;
            case 3 -> !isY ? offY_fi : -offX_fi;
            default -> !isY ? offX_fi : offY_fi;
        };
    };
    // Overload
    public Vec2 calcRotatedOff(Vec2 out, int rot) {
        return out.set(calcRotatedOff(rot, false), calcRotatedOff(rot, true));
    };


};
