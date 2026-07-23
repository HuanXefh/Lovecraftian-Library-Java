package lovec.graphics;

import arc.graphics.Color;
import arc.graphics.g2d.*;
import arc.math.Mathf;
import arc.scene.ui.layout.Scl;
import arc.util.Align;
import arc.util.Nullable;
import arc.util.pooling.Pools;
import lovec.utils.LCPos;
import mindustry.gen.Building;
import mindustry.Vars;
import mindustry.ctype.UnlockableContent;
import mindustry.graphics.Layer;

/**
 * Elementary draw methods used in Lovec.
 * These are defined in Java for better performance.
 */
public class LCDraw {


    static Color[] tmpColors = {
        new Color(), new Color(), new Color(), new Color(), new Color(),
        new Color(), new Color(), new Color(), new Color(), new Color(),
    };
    static float[] zs = {
        0f, 0f, 0f, 0f, 0f,
        0f, 0f, 0f, 0f, 0f,
        0f, 0f, 0f, 0f, 0f,
        0f, 0f, 0f, 0f, 0f,
    };
    static boolean[] zTailBools = {
        false, false, false, false, false,
        false, false, false, false, false,
        false, false, false, false, false,
        false, false, false, false, false,
    };
    static float[] xScls = {
        1f, 1f, 1f, 1f, 1f,
        1f, 1f, 1f, 1f, 1f,
        1f, 1f, 1f, 1f, 1f,
        1f, 1f, 1f, 1f, 1f,
    };
    static float[] yScls = {
        1f, 1f, 1f, 1f, 1f,
        1f, 1f, 1f, 1f, 1f,
        1f, 1f, 1f, 1f, 1f,
        1f, 1f, 1f, 1f, 1f,
    };
    static boolean[] sclTailBools = {
        false, false, false, false, false,
        false, false, false, false, false,
        false, false, false, false, false,
        false, false, false, false, false,
    };
    static final int
        NORMAL_REGION_Z_IND = 10,
        SHADOW_REGION_Z_IND = 11,
        GLOW_REGION_Z_IND = 12,
        ICON_REGION_Z_IND = 13,
        BULLET_REGION_Z_IND = 14,
        UI_REGION_Z_IND = 15,
        SHAPE_Z_IND = 16,
        DEBUG_Z_IND = 19;


    /* <-------------------- auxiliary --------------------> */


    /**
     * Temporarily changes z-layer.
     * Should always be called twice!
     */
    public static void processZ(float z, int ind) {
        if(!zTailBools[ind]) {
            zs[ind] = Draw.z();
            if(z >= 0f) {
                Draw.z(z);
            };
        } else {
            Draw.z(zs[ind]);
        };
        zTailBools[ind] = !zTailBools[ind];
    };
    // Overload
    public static void processZ(float z) {
        processZ(z, 0);
    };


    /**
     * Temporarily changes scaling.
     * Should always be called twice!
     */
    public static void processScl(float xscl, float yscl, int ind) {
        if(!sclTailBools[ind]) {
            xScls[ind] = Draw.xscl;
            yScls[ind] = Draw.yscl;
            Draw.scl(xscl, yscl);
        } else {
            Draw.scl(xScls[ind], yScls[ind]);
        };
        sclTailBools[ind] = !sclTailBools[ind];
    };
    // Overload
    public static void processScl(float xscl, float yscl) {
        processScl(xscl, yscl, 0);
    };
    public static void processScl(float scl, int ind) {
        processScl(scl, scl, ind);
    };
    public static void processScl(float scl) {
        processScl(scl, 0);
    };


    /* <-------------------- line --------------------> */


    /**
     * Draws colored line.
     */
    public static void line(float x1, float y1, float x2, float y2, boolean isDashed) {
        var amtSeg = (int)(!isDashed ? 0 : Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) / Vars.tilesize * 2);

        if(isDashed) {
            Lines.dashLine(x1, y1, x2, y2, amtSeg);
        } else {
            Lines.line(x1, y1, x2, y2);
        };
    };
    // Overload
    public static void line(float x1, float y1, float x2, float y2) {
        line(x1, y1, x2, y2, false);
    };


    /* <-------------------- rectangle --------------------> */


    /**
     * Draws rectangle with colored lines.
     */
    public static void rect(float x, float y, float r, float size, boolean isDashed) {
        var hw = LCPos.calcRectHW(r, size);
        var amtSeg = (int)(!isDashed ? 0 : (size + r * 2) * 2);

        if(isDashed) {
            Lines.dashLine(x - hw, y - hw, x + hw, y - hw, amtSeg);
            Lines.dashLine(x + hw, y - hw, x + hw, y + hw, amtSeg);
            Lines.dashLine(x + hw, y + hw, x - hw, y + hw, amtSeg);
            Lines.dashLine(x - hw, y + hw, x - hw, y - hw, amtSeg);
        } else {
            Lines.line(x - hw, y - hw, x + hw, y - hw);
            Lines.line(x + hw, y - hw, x + hw, y + hw);
            Lines.line(x + hw, y + hw, x - hw, y + hw);
            Lines.line(x - hw, y + hw, x - hw, y - hw);
        };
    };
    // Overload
    public static void rect(float x, float y, float r, float size) {
        rect(x, y, r, size, true);
    };


    /**
     * Draws colored filled square.
     */
    public static void area(float x, float y, float size) {
        Fill.rect(x, y, size * Vars.tilesize, size * Vars.tilesize);
    };


    /* <-------------------- circle --------------------> */


    /**
     * Draws circle with colored line.
     */
    public static void circle(float x, float y, float rad, boolean isDashed) {
        if(isDashed) {
            Lines.dashCircle(x, y, rad);
        } else {
            Lines.circle(x, y, rad);
        };
    };
    // Overload
    public static void circle(float x, float y, float rad) {
        circle(x, y, rad, true);
    };


    /**
     * Draws colored ring shape that can be cut.
     */
    public static void ring(float x, float y, float radIn, float radOut, float ang, float frac, boolean rev) {
        var sideAmt = Lines.circleVertices((radIn + radOut) * 0.5f);
        var angSide = 360f / sideAmt * (rev ? -1f : 1f);
        var iCap = Math.round(sideAmt * Mathf.clamp(frac));

        var ang_i = 0f;
        for (int i = 0; i < iCap; i++) {
            ang_i = angSide * i + ang;
            Fill.quad(
                x + radIn * Mathf.cosDeg(ang_i),
                y + radIn * Mathf.sinDeg(ang_i),
                x + radIn * Mathf.cosDeg(ang_i + angSide),
                y + radIn * Mathf.sinDeg(ang_i + angSide),
                x + radOut * Mathf.cosDeg(ang_i + angSide),
                y + radOut * Mathf.sinDeg(ang_i + angSide),
                x + radOut * Mathf.cosDeg(ang_i),
                y + radOut * Mathf.sinDeg(ang_i)
            );
        };
    };
    // Overload
    public static void ring(float x, float y, float radIn, float radOut, float ang, float frac) {
        ring(x, y, radIn, radOut, ang, frac, false);
    };
    public static void ring(float x, float y, float radIn, float radOut, float ang) {
        ring(x, y, radIn, radOut, ang, 1f);
    };
    public static void ring(float x, float y, float radIn, float radOut) {
        ring(x, y, radIn, radOut, 0f);
    };


    /**
     * Draws colored filled circle (disk).
     */
    public static void disk(float x, float y, float rad) {
        Fill.circle(x, y, rad);
    };


    /**
     * Draws circular shield, not force shield.
     */
    public static void shieldCircle(float x, float y, float rad, Color color, float a) {
        Fill.light(x, y, Lines.circleVertices(rad), rad, Color.clear, tmpColors[0].set(color).a(a * 0.7f));
    };
    // Overload
    public static void shieldCircle(float x, float y, float rad, Color color) {
        shieldCircle(x, y, rad, color, color.a);
    };


    /* <-------------------- texture --------------------> */


    /**
     * Draw a region.
     */
    public static void region(float x, float y, @Nullable TextureRegion reg, float ang, float regScl, Color color, float a, float z) {
        if(reg == null) return;

        processZ(z, NORMAL_REGION_Z_IND);
        Draw.color(color);
        Draw.alpha(a);
        Draw.rect(
            reg, x, y,
            reg.width * reg.scl() * regScl,
            reg.height * reg.scl() * regScl,
            ang
        );
        Draw.color();
        processZ(-1, NORMAL_REGION_Z_IND);
    };
    // Overload
    public static void region(float x, float y, @Nullable TextureRegion reg, float ang, float regScl, Color color, float a) {
        region(x, y, reg, ang, regScl, color, a, -1);
    };
    public static void region(float x, float y, @Nullable TextureRegion reg, float ang, float regScl, Color color) {
        region(x, y, reg, ang, regScl, color, 1f);
    };
    public static void region(float x, float y, @Nullable TextureRegion reg, float ang, float regScl) {
        region(x, y, reg, ang, regScl, Color.white);
    };
    public static void region(float x, float y, @Nullable TextureRegion reg, float ang) {
        region(x, y, reg, ang, 1f);
    };
    public static void region(float x, float y, @Nullable TextureRegion reg) {
        region(x, y, reg, 0f);
    };


    /**
     * Draws a region mixed with some color.
     */
    public static void regionMixcol(float x, float y, @Nullable TextureRegion reg, float ang, float regScl, Color color, float a, float mixcolA, float z) {
        if(reg == null) return;

        processZ(z, NORMAL_REGION_Z_IND);
        Draw.mixcol(color, mixcolA);
        Draw.alpha(a);
        Draw.rect(
            reg, x, y,
            reg.width * reg.scl() * regScl,
            reg.height * reg.scl() * regScl,
            ang
        );
        Draw.reset();
        processZ(-1f, NORMAL_REGION_Z_IND);
    };
    // Overload
    public static void regionMixcol(float x, float y, @Nullable TextureRegion reg, float ang, float regScl, Color color, float a, float mixcolA) {
        regionMixcol(x, y, reg, ang, regScl, color, a, mixcolA, -1f);
    };
    public static void regionMixcol(float x, float y, @Nullable TextureRegion reg, float ang, float regScl, Color color, float a) {
        regionMixcol(x, y, reg, ang, regScl, color, a, 1f);
    };
    public static void regionMixcol(float x, float y, @Nullable TextureRegion reg, float ang, float regScl, Color color) {
        regionMixcol(x, y, reg, ang, regScl, color, 1f);
    };
    public static void regionMixcol(float x, float y, @Nullable TextureRegion reg, float ang, float regScl) {
        regionMixcol(x, y, reg, ang, regScl, Color.white);
    };
    public static void regionMixcol(float x, float y, @Nullable TextureRegion reg, float ang) {
        regionMixcol(x, y, reg, ang, 1f);
    };
    public static void regionMixcol(float x, float y, @Nullable TextureRegion reg) {
        regionMixcol(x, y, reg, 0f);
    };


    /**
     * Variant of {@link #contentIcon} that uses a drawable texture region instead of unlockable content.
     */
    public static void regionIcon(float x, float y, @Nullable TextureRegion reg, float size, float wScl, float z) {
        if(reg == null) return;

        float
            x_fi = x - Vars.tilesize * size * 0.5f,
            y_fi = y + Vars.tilesize * size * 0.5f,
            w = (reg.width > reg.height ? 8f : ((reg.width * 8f) / reg.height)) * wScl,
            h = (reg.height > reg.width ? 8f : ((reg.height * 8f) / reg.width)) * wScl;

        processZ(z, ICON_REGION_Z_IND);
        Draw.mixcol(Color.darkGray, 1f);
        Draw.rect(reg, x_fi, y_fi - 1f, w, h);
        Draw.mixcol();
        Draw.rect(reg, x_fi, y_fi, w, h);
        processZ(-1f, ICON_REGION_Z_IND);
    };
    // Overload
    public static void regionIcon(float x, float y, @Nullable TextureRegion reg, float size, float wScl) {
        regionIcon(x, y, reg, size, wScl, -1f);
    };
    public static void regionIcon(float x, float y, @Nullable TextureRegion reg, float size) {
        regionIcon(x, y, reg, size, 1f);
    };
    public static void regionIcon(float x, float y, @Nullable TextureRegion reg) {
        regionIcon(x, y, reg, 1);
    };


    /**
     * Draws content icon.
     */
    public static void content(float x, float y, @Nullable UnlockableContent ct, float size, float z) {
        if(ct == null) return;

        var w = size * Vars.tilesize * (ct.fullIcon.width > ct.fullIcon.height ? 1f : (float)(ct.fullIcon.width / ct.fullIcon.height));
        var h = size * Vars.tilesize * (ct.fullIcon.height > ct.fullIcon.width ? 1f : (float)(ct.fullIcon.height / ct.fullIcon.width));

        processZ(z, ICON_REGION_Z_IND);
        Draw.rect(ct.fullIcon, x, y, w, h);
        processZ(-1f, ICON_REGION_Z_IND);
    };
    // Overload
    public static void content(float x, float y, @Nullable UnlockableContent ct, float size) {
        content(x, y, ct, size, -1f);
    };
    public static void content(float x, float y, @Nullable UnlockableContent ct) {
        content(x, y, ct, 1f);
    };


    /**
     * Variant of {@link #content} that usually used for {@link Building#drawSelect}, like in drills.
     */
    public static void contentIcon(float x, float y, @Nullable UnlockableContent ct, float size, float wScl) {
        if(ct == null) return;
        regionIcon(x, y, ct.fullIcon, size, wScl);
    };
    // Overload
    public static void contentIcon(float x, float y, @Nullable UnlockableContent ct, float size) {
        if(ct == null) return;
        regionIcon(x, y, ct.fullIcon, size);
    };
    public static void contentIcon(float x, float y, @Nullable UnlockableContent ct) {
        if(ct == null) return;
        regionIcon(x, y, ct.fullIcon);
    };


    /* <-------------------- text --------------------> */


    /**
     * Draws text.
     */
    public static void text(
        float x, float y, @Nullable String str, Font font,
        float sizeScl, Color color, int align, float offX, float offY, float offZ
    ) {
        if(str == null || str.isEmpty()) return;

        var zPrev = Draw.z();
        var layout = Pools.obtain(GlyphLayout.class, GlyphLayout::new);
        var useInt = font.usesIntegerPositions();
        Draw.z(Layer.playerName + 0.5f + offZ);
        font.setUseIntegerPositions(false);
        font.getData().setScale(0.25f / Scl.scl(1f) * sizeScl);
        layout.setText(font, str);
        font.setColor(color);
        font.draw(str, x + offX, y + offY, 0f, align, false);
        Draw.reset();
        Draw.z(zPrev);

        Pools.free(layout);
        font.getData().setScale(1f);
        font.setColor(Color.white);
        font.setUseIntegerPositions(useInt);
    };
    // Overload
    public static void text(
        float x, float y, @Nullable String str, Font font,
        float sizeScl, Color color, int align, float offX, float offY
    ) {
        text(x, y, str, font, sizeScl, color, align, offX, offY, 0f);
    };
    public static void text(
        float x, float y, @Nullable String str, Font font,
        float sizeScl, Color color, int align
    ) {
        text(x, y, str, font, sizeScl, color, align, 0f, 0f);
    };
    public static void text(
        float x, float y, @Nullable String str, Font font,
        float sizeScl, Color color
    ) {
        text(x, y, str, font, sizeScl, color, Align.center);
    };


};
