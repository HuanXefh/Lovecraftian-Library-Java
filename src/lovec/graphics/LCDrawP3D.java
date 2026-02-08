package lovec.graphics;

import arc.Core;
import arc.graphics.Color;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.Fill;
import arc.graphics.g2d.Lines;
import arc.graphics.g2d.TextureRegion;
import arc.math.Mathf;
import arc.util.Nullable;
import arc.util.Tmp;

/**
 * Draw methods used for pseudo-3D things.
 * This runs much faster when defined in Java.
 */
public class LCDrawP3D {


    static final float camOffY = 48f;
    static final float camOffScl = 0.06f;


    /**
     * Calculates the offset coordinate.
     */
    public static float toP3dCoord(float coord, float z3d, boolean isY) {
        return coord + (coord - (isY ? (Core.camera.position.y - camOffY) : Core.camera.position.x)) * z3d * camOffScl;
    }


    /**
     * Calculates offset x.
     */
    public static float toP3dX(float x, float z3d) {
        return toP3dCoord(x, z3d, false);
    }


    /**
     * Calculates offset y.
     */
    public static float toP3dY(float y, float z3d) {
        return toP3dCoord(y, z3d, true);
    }

    /**
     * Calculates z-offset for proper rendering.
     * @param zInd 0 for bottom, 1 for right, 2 for top, 3 for left.
     */
    public static float calcOffZ(int zInd, float x, float y) {
        var condX = x - Core.camera.position.x >= 0f;
        var condY = y - Core.camera.position.y + camOffY >= 0f;
        if(condX && condY) {
            if(zInd == 0) return 0.0003f;
            if(zInd == 1) return 0.0001f;
            if(zInd == 2) return 0.0002f;
            if(zInd == 3) return 0.0004f;
        } else if(!condX && condY) {
            if(zInd == 0) return 0.0003f;
            if(zInd == 1) return 0.0004f;
            if(zInd == 2) return 0.0002f;
            if(zInd == 3) return 0.0001f;
        } else if(!condX) {
            if(zInd == 0) return 0.0002f;
            if(zInd == 1) return 0.0004f;
            if(zInd == 2) return 0.0003f;
            if(zInd == 3) return 0.0001f;
        } else {
            if(zInd == 0) return 0.0002f;
            if(zInd == 1) return 0.0001f;
            if(zInd == 2) return 0.0003f;
            if(zInd == 3) return 0.0004f;
        }

        return 0f;
    }


    /**
     * Draws a pseudo-3D wall.
     */
    public static void wall(
            float x1, float y1, float x2, float y2, float z3d,
            Color colorIn, Color colorOut
    ) {
        var fBits1 = colorIn.toFloatBits();
        var fBits2 = colorOut.toFloatBits();
        Fill.quad(
          x1, y1, fBits1,
          x2, y2, fBits1,
          toP3dX(x2, z3d), toP3dY(y2, z3d), fBits2,
          toP3dX(x1, z3d), toP3dY(y1, z3d), fBits2
        );
    }
    // Overloading
    public static void wall(
            float x1, float y1, float x2, float y2, float z3d,
            Color color
    ) {
        wall(x1, y1, x2, y2, z3d, color, color);
    }


    /**
     * Draws four pseudo-3D walls.
     */
    public static void room(
            float x, float y, float z3d,
            float w, float h, Color colorIn, Color colorOut
    ) {
        var zCur = Draw.z();
        Draw.z(zCur - 0.1f + calcOffZ(0, x, y - h * 0.5f));
        wall(x - w * 0.5f, y - h * 0.5f, x + w * 0.5f, y - h * 0.5f, z3d, Tmp.c1.set(colorIn).mul(0.75f), Tmp.c2.set(colorOut).mul(0.75f));
        Draw.z(zCur - 0.1f + calcOffZ(2, x, y + h * 0.5f));
        wall(x - w * 0.5f, y + h * 0.5f, x + w * 0.5f, y + h * 0.5f, z3d, Tmp.c1.set(colorIn).mul(1.2f), Tmp.c2.set(colorOut).mul(1.2f));
        Draw.z(zCur - 0.1f + calcOffZ(3, x - w * 0.5f, y));
        wall(x - w * 0.5f, y - h * 0.5f, x - w * 0.5f, y + h * 0.5f, z3d, Tmp.c1.set(colorIn), Tmp.c2.set(colorOut));
        Draw.z(zCur - 0.1f + calcOffZ(1, x + w * 0.5f, y));
        wall(x + w * 0.5f, y - h * 0.5f, x + w * 0.5f, y + h * 0.5f, z3d, Tmp.c1.set(colorIn), Tmp.c2.set(colorOut));
        Draw.z(zCur);
    }
    // Overloading
    public static void room(
            float x, float y, float z3d,
            float w, float h, Color color
    ) {
        room(x, y, z3d, w, h, color, color);
    }
    public static void room(
            float x, float y, float z3d,
            float w, Color colorIn, Color colorOut
    ) {
        room(x, y, z3d, w, w, colorIn, colorOut);
    }
    public static void room(
            float x, float y, float z3d,
            float w, Color color
    ) {
        room(x, y, z3d, w, color, color);
    }


    /**
     * Variant of {@link #room} for range display.
     */
    public static void roomFade(
            float x, float y, float z3d,
            float w, float h, Color color
    ) {
        room(x, y, z3d, w, h, color, Tmp.c3.set(color).a(0f));
    }
    // Overloading
    public static void roomFade(
            float x, float y, float z3d,
            float w, Color color
    ) {
        roomFade(x, y, z3d, w, w, color);
    }


    /**
     * Draws a cylinder made of pseudo-3D walls.
     */
    public static void cylinder(
            float x, float y, float z3d,
            float rad, Color colorIn, Color colorOut
    ) {
        var sideAmt = Lines.circleVertices(rad);
        var angSide = 360f / sideAmt;
        var ang_i = 0f;
        for(int i = 0; i < sideAmt; i++) {
            ang_i = angSide * i;
            wall(
                    x + rad * Mathf.cosDeg(ang_i),
                    y + rad * Mathf.sinDeg(ang_i),
                    x + rad * Mathf.cosDeg(ang_i + angSide),
                    y + rad * Mathf.sinDeg(ang_i + angSide),
                    z3d, colorIn, colorOut
            );
        }
    }
    // Overloading
    public static void cylinder(
            float x, float y, float z3d,
            float rad, Color color
    ) {
        cylinder(x, y, z3d, rad, color, color);
    }


    /**
     * Variant of {@link #cylinder} for range display.
     */
    public static void cylinderFade(
            float x, float y, float z3d,
            float rad, Color color
    ) {
        cylinder(x, y, z3d, rad, color, Tmp.c3.set(color).a(0f));
    }


    /**
     * {@link Draw#rect} but pseudo-3D.
     */
    public static void reg(
            float x, float y, float z3d,
            TextureRegion reg, float regScl, @Nullable Color colorMix
    ) {
        if(colorMix != null) {
            Draw.mixcol(colorMix, colorMix.a);
        }
        Draw.rect(reg, toP3dX(x, z3d), toP3dY(y, z3d), reg.width * reg.scl() * regScl, reg.height * reg.scl() * regScl);
        Draw.reset();
    }


}
