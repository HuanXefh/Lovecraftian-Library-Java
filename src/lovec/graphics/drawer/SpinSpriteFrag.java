package lovec.graphics.drawer;

import arc.graphics.g2d.Draw;
import arc.graphics.g2d.TextureRegion;

public interface SpinSpriteFrag {


    default void drawRotator(TextureRegion reg, float x, float y, float ang, float speed, float sideAng) {
        if(speed < 0f) {
            Draw.rect(reg, x, y, -ang + sideAng);
            Draw.alpha(1f - ang / sideAng);
            Draw.rect(reg, x, y, -ang);
        } else {
            Draw.rect(reg, x, y, ang);
            Draw.alpha(ang / sideAng);
            Draw.rect(reg, x, y, ang - sideAng);
        };
        Draw.color();
    };


};
