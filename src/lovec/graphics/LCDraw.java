package lovec.graphics;

import arc.graphics.Color;
import arc.graphics.g2d.*;
import arc.math.Mathf;
import arc.scene.ui.layout.Scl;
import arc.util.Align;
import arc.util.Nullable;
import arc.util.Time;
import arc.util.pooling.Pools;
import mindustry.gen.Building;
import mindustry.Vars;
import mindustry.ctype.UnlockableContent;
import mindustry.graphics.Layer;
import mindustry.world.Tile;

/**
 * Basic draw methods used in Lovec.
 * These are defined in Java for better performance.
 */
public class LCDraw {


    static final Color[] tmpColors = new Color[]{new Color()};


    /**
     * Draws colored line.
     */
    public static void line(float x1, float y1, float x2, float y2, boolean isDashed) {
        var amtSeg = (int)(!isDashed ? 0 : Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) / Vars.tilesize * 2);

        if(isDashed) {
            Lines.dashLine(x1, y1, x2, y2, amtSeg);
        } else {
            Lines.line(x1, y1, x2, y2);
        }
    }
    // Overloading
    public static void line(float x1, float y1, float x2, float y2) {
        line(x1, y1, x2, y2, false);
    }


    /**
     * Draws rectangle with colored lines.
     */
    public static void rect(float x, float y, float r, float size, boolean isDashed) {
        var hw = (size * 0.5f + r) * Vars.tilesize;
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
        }
    }
    // Overloading
    public static void rect(float x, float y, float r, float size) {
        rect(x, y, r, size, true);
    }


    /**
     * Draws colored filled square.
     */
    public static void area(float x, float y, float size) {
        Fill.rect(x, y, size * Vars.tilesize, size * Vars.tilesize);
    }


    /**
     * Draws circle with colored line.
     */
    public static void circle(float x, float y, float rad, boolean isDashed) {
        if(isDashed) {
            Lines.dashCircle(x, y, rad);
        } else {
            Lines.circle(x, y, rad);
        }
    }
    // Overloading
    public static void circle(float x, float y, float rad) {
        circle(x, y, rad, true);
    }


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
        }
    }
    // Overloading
    public static void ring(float x, float y, float radIn, float radOut, float ang, float frac) {
        ring(x, y, radIn, radOut, ang, frac, false);
    }
    public static void ring(float x, float y, float radIn, float radOut, float ang) {
        ring(x, y, radIn, radOut, ang, 1f);
    }
    public static void ring(float x, float y, float radIn, float radOut) {
        ring(x, y, radIn, radOut, 0f);
    }


    /**
     * Draws colored filled circle (disk).
     */
    public static void disk(float x, float y, float rad) {
        Fill.circle(x, y, rad);
    }


    /**
     * Draws circular shield, not force shield.
     */
    public static void shieldCircle(float x, float y, float rad, Color color, float a) {
        Fill.light(x, y, Lines.circleVertices(rad), rad, Color.clear, tmpColors[0].set(color).a(a * 0.7f));
    }
    // Overloading
    public static void shieldCircle(float x, float y, float rad, Color color) {
        shieldCircle(x, y, rad, color, color.a);
    };


    /**
     * Draws content UI icon.
     */
    public static void content(float x, float y, @Nullable UnlockableContent ct, float size) {
        if(ct == null) return;

        var w = size * Vars.tilesize * (ct.uiIcon.width > ct.uiIcon.height ? 1f : (float)(ct.uiIcon.width / ct.uiIcon.height));
        var h = size * Vars.tilesize * (ct.uiIcon.height > ct.uiIcon.width ? 1f : (float)(ct.uiIcon.height / ct.uiIcon.width));

        Draw.rect(ct.uiIcon, x, y, w, h);
    }
    // Overloading
    public static void content(float x, float y, @Nullable UnlockableContent ct) {
        content(x, y, ct, 1);
    }


    /**
     * Variant of {@link #content} that usually used for {@link Building#drawSelect}, like in drills.
     */
    public static void contentIcon(float x, float y, @Nullable UnlockableContent ct, float size) {
        if(ct == null) return;

        regionIcon(x, y, ct.uiIcon, size);
    }
    // Overloading
    public static void contentIcon(float x, float y, @Nullable UnlockableContent ct) {
        regionIcon(x, y, ct.uiIcon);
    }


    /**
     * Variant of {@link #contentIcon} that uses a drawable texture region instead of unlockable content.
     */
    public static void regionIcon(float x, float y, TextureRegion reg, float size) {
        float
                x_fi = x - Vars.tilesize * size * 0.5f,
                y_fi = y + Vars.tilesize * size * 0.5f,
                w = reg.width > reg.height ? 8f : ((reg.width * 8f) / reg.height),
                h = reg.height > reg.width ? 8f : ((reg.height * 8f) / reg.width);

        Draw.mixcol(Color.darkGray, 1f);
        Draw.rect(reg, x_fi, y_fi - 1f, w, h);
        Draw.mixcol();
        Draw.rect(reg, x_fi, y_fi, w, h);
    }
    // Overloading
    public static void regionIcon(float x, float y, TextureRegion reg) {
        regionIcon(x, y, reg, 1);
    }


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
        font.draw(str, x + offX, y + offY, 0, align, false);
        Draw.reset();
        Draw.z(zPrev);

        Pools.free(layout);
        font.getData().setScale(1f);
        font.setColor(Color.white);
        font.setUseIntegerPositions(useInt);
    }
    // Overloading
    public static void text(
            float x, float y, @Nullable String str, Font font,
            float sizeScl, Color color, int align, float offX, float offY
    ) {
        text(x, y, str, font, sizeScl, color, align, offX, offY, 0f);
    }
    public static void text(
            float x, float y, @Nullable String str, Font font,
            float sizeScl, Color color, int align
    ) {
        text(x, y, str, font, sizeScl, color, align, 0f, 0f);
    }
    public static void text(
            float x, float y, @Nullable String str, Font font,
            float sizeScl, Color color
    ) {
        text(x, y, str, font, sizeScl, color, Align.center);
    }


    /**
     * Generic method to draw a tree.
     */
    public static void tree(
            TextureRegion reg, TextureRegion shaReg,
            Tile t, float offSha, float scl, float mag, float wob, float a, float z,
            boolean shouldDrawWobble, boolean shouldCheckDst
    ) {
        if(a < 0.01) return;

        var zPrev = Draw.z();
        if(shaReg.found()) {
            Draw.z(z - 0.01f);
            Draw.rect(shaReg, t.worldx() + offSha, t.worldy() + offSha, Mathf.randomSeed(t.pos(), 0f, 360f));
        }
        if(!shouldCheckDst) {
            Draw.alpha(a);
        } else {
            var unitPl = Vars.player.unit();
            var dst = unitPl == null ? 99999999f : Mathf.dst(t.worldx(), t.worldy(), unitPl.x, unitPl.y);
            Draw.alpha(a * dst < reg.width * 0.15f ? 0.37f : 1f);
        }
        Draw.z(z);
        if(!shouldDrawWobble) {
            Draw.rect(reg, t.worldx(), t.worldy(), Mathf.randomSeed(t.pos(), 0f, 360f));
        } else {
            Draw.rectv(
                    reg, t.worldx(), t.worldy(),
                    reg.width * reg.scl(), reg.height * reg.scl(),
                    Mathf.randomSeed(t.pos(), 0f, 360f) + Mathf.sin(Time.time + t.worldx(), 50f, 0.5f) + Mathf.sin(Time.time - t.worldy(), 65f, 0.9f) + Mathf.sin(Time.time + t.worldy() - t.worldx(), 85f, 0.9f),
                    vec2 -> vec2.add(
                            (Mathf.sin(vec2.y * 3f + Time.time, 60f * scl, 0.5f * mag) + Mathf.sin(vec2.x * 3f - Time.time, 70f * scl, 0.8f * mag)) * 1.5f * wob,
                            (Mathf.sin(vec2.x * 3f + Time.time + 8f, 66f * scl, 0.55f * mag) + Mathf.sin(vec2.y * 3f - Time.time, 50f * scl, 0.2f * mag)) * 1.5f * wob
                    )
            );
        }
        Draw.color();
        Draw.z(zPrev);
    }
    // Overloading
    public static void tree(
            TextureRegion reg, TextureRegion shaReg,
            Tile t, float offSha, float scl, float mag, float wob, float a, float z,
            boolean shouldDrawWobble
    ) {
        tree(reg, shaReg, t, offSha, scl, mag, wob, a, z, shouldDrawWobble, false);
    }
    public static void tree(
            TextureRegion reg, TextureRegion shaReg,
            Tile t, float offSha, float scl, float mag, float wob, float a, float z
    ) {
        tree(reg, shaReg, t, offSha, scl, mag, wob, a, z, true);
    }


}
