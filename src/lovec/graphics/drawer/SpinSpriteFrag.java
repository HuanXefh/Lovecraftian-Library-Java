package lovec.graphics.drawer;

import arc.graphics.g2d.Draw;
import arc.graphics.g2d.TextureRegion;

public interface SpinSpriteFrag {


    default void drawRotator(TextureRegion reg, float x, float y, float ang, float speed) {
        if(speed < 0f) {
            Draw.rect(reg, x, y, -ang + 90f);
            Draw.alpha(1f - ang / 90f);
            Draw.rect(reg, x, y, -ang);
        } else {
            Draw.rect(reg, x, y, ang);
            Draw.alpha(ang / 90f);
            Draw.rect(reg, x, y, ang - 90f);
        };
        Draw.color();
    };


};
