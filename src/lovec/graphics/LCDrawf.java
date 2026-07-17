package lovec.graphics;

import arc.Core;
import arc.graphics.Blending;
import arc.graphics.Color;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.Fill;
import arc.graphics.g2d.Lines;
import arc.graphics.g2d.TextureRegion;
import arc.math.Mathf;
import arc.math.geom.Vec2;
import arc.struct.Seq;
import arc.util.Nullable;
import arc.util.Time;
import arc.util.Tmp;
import lovec.utils.LCFormat;
import lovec.utils.LCScript;
import mindustry.Vars;
import mindustry.graphics.*;
import mindustry.world.Block;
import mindustry.world.Tile;
import mindustry.world.draw.DrawFade;
import mindustry.world.draw.DrawFlame;
import mindustry.world.draw.DrawSideRegion;
import mindustry.world.draw.DrawWeave;

import static lovec.utils.LCScript.VAR;

/**
 * Utility draw methods.
 */
public class LCDrawf {


    public static TextureRegion[] heatRegs;
    public static TextureRegion lightConeReg;
    public static Color lightColor = Color.valueOf("ffc999");
    public static Color heatColor = Color.valueOf("ff3838");


    static Seq<Tile> tmpTs = new Seq<>();
    static float
        bulFlameLay,
        randOvLay;


    public static void init() {
        bulFlameLay = LCScript.toFloat(LCScript.search(VAR, "layer", "bulFlame"));
        randOvLay = LCScript.toFloat(LCScript.search(VAR, "layer", "randOv"));

        heatRegs = new TextureRegion[16];
        for(int i = 0; i < heatRegs.length; i++) {
            heatRegs[i] = Vars.headless ? LCTexture.empty : Core.atlas.find("lovec-ast-block-heat" + i);
        };

        if(!Vars.headless) {
            lightConeReg = Core.atlas.find("lovec-efr-shadow-cone");
        };
    };


    /* <-------------------- line --------------------> */


    /* <-------------------- circle --------------------> */


    /* <-------------------- rectangle --------------------> */


    /* <-------------------- texture --------------------> */


    /**
     * Draws side region(s) like {@link DrawSideRegion}.
     */
    public static void side(float x, float y, @Nullable TextureRegion reg1, @Nullable TextureRegion reg2, int rot, Color color, float a, float z) {
        if(reg1 == null) return;

        LCDraw.processZ(z, LCDraw.NORMAL_REGION_Z_IND);
        Draw.color(color, a);
        Draw.rect((reg2 == null || Mathf.mod(rot, 4) < 2) ? reg1 : reg2, x, y, rot * 90f);
        Draw.color();
        LCDraw.processZ(-1f, LCDraw.NORMAL_REGION_Z_IND);
    };
    // Overload
    public static void side(float x, float y, @Nullable TextureRegion reg1, @Nullable TextureRegion reg2, int rot, Color color, float a) {
        side(x, y, reg1, reg2, rot, color, a, -1f);
    };
    public static void side(float x, float y, @Nullable TextureRegion reg1, @Nullable TextureRegion reg2, int rot, Color color) {
        side(x, y, reg1, reg2, rot, color, 1f);
    };
    public static void side(float x, float y, @Nullable TextureRegion reg1, @Nullable TextureRegion reg2, int rot) {
        side(x, y, reg1, reg2, rot, Color.white);
    };
    public static void side(float x, float y, @Nullable TextureRegion reg, int rot, Color color, float a, float z) {
        side(x, y, reg, null, rot, color, a, z);
    };
    public static void side(float x, float y, @Nullable TextureRegion reg, int rot, Color color, float a) {
        side(x, y, reg, null, rot, color, a, -1f);
    };
    public static void side(float x, float y, @Nullable TextureRegion reg, int rot, Color color) {
        side(x, y, reg, null, rot, color, 1f);
    };
    public static void side(float x, float y, @Nullable TextureRegion reg, int rot) {
        side(x, y, reg, null, rot, Color.white);
    };


    /**
     * Draws edge region(s) four times.
     */
    public static void edge(float x, float y, @Nullable TextureRegion reg1, @Nullable TextureRegion reg2, Color color, float a, float z) {
        if(reg1 == null) return;

        LCDraw.processZ(z, LCDraw.NORMAL_REGION_Z_IND);
        Draw.color(color, a);
        if(reg2 == null) {
            for(int i = 0; i < 4; i++) {
                Draw.rect(reg1, x, y, i * 90f);
            };
        } else {
            for(int i = 0; i < 4; i++) {
                Draw.rect(i < 2 ? reg1 : reg2, x, y, i * 90f);
            };
        };
        Draw.color();
        LCDraw.processZ(-1f, LCDraw.NORMAL_REGION_Z_IND);
    };
    // Overload
    public static void edge(float x, float y, @Nullable TextureRegion reg1, @Nullable TextureRegion reg2, Color color, float a) {
        edge(x, y, reg1, reg2, color, a, -1f);
    };
    public static void edge(float x, float y, @Nullable TextureRegion reg1, @Nullable TextureRegion reg2, Color color) {
        edge(x, y, reg1, reg2, color, 1f);
    };
    public static void edge(float x, float y, @Nullable TextureRegion reg1, @Nullable TextureRegion reg2) {
        edge(x, y, reg1, reg2, Color.white);
    };
    public static void edge(float x, float y, @Nullable TextureRegion reg, Color color, float a, float z) {
        edge(x, y, reg, null, color, a, z);
    };
    public static void edge(float x, float y, @Nullable TextureRegion reg, Color color, float a) {
        edge(x, y, reg, null, color, a, -1f);
    };
    public static void edge(float x, float y, @Nullable TextureRegion reg, Color color) {
        edge(x, y, reg, null, color, 1f);
    };
    public static void edge(float x, float y, @Nullable TextureRegion reg) {
        edge(x, y, reg, null, Color.white);
    };


    /**
     * Draws rotating region.
     * Supports both directions.
     */
    public static void spin(float x, float y, @Nullable TextureRegion reg, float prog, float spd, float ang, float regScl, int sideAmt, Color color, float a, float z) {
        if(reg == null) return;

        float
            w = reg.width * reg.scl() * regScl,
            h = reg.width * reg.scl() * regScl,
            ang_fd = 360f / sideAmt,
            ang_fi = Mathf.mod(prog * spd + ang, ang_fd);

        LCDraw.processZ(z, LCDraw.NORMAL_REGION_Z_IND);
        Draw.color(color, a);
        if(spd < 0f) {
            Draw.rect(reg, x, y, w, h, -ang_fi + ang_fd);
            Draw.alpha((1f - ang_fi / ang_fd) * a);
            Draw.rect(reg, x, y, w, h, -ang_fi);
        } else {
            Draw.rect(reg, x, y, w, h, ang_fi);
            Draw.alpha(ang_fi / ang_fd * a);
            Draw.rect(reg, x, y, w, h, ang_fi - ang_fd);
        };
        Draw.color();
        LCDraw.processZ(-1f, LCDraw.NORMAL_REGION_Z_IND);
    };
    // Overload
    public static void spin(float x, float y, @Nullable TextureRegion reg, float prog, float spd, float ang, float regScl, int sideAmt, Color color, float a) {
        spin(x, y, reg, prog, spd, ang, regScl, sideAmt, color, a, -1f);
    };
    public static void spin(float x, float y, @Nullable TextureRegion reg, float prog, float spd, float ang, float regScl, int sideAmt, Color color) {
        spin(x, y, reg, prog, spd, ang, regScl, sideAmt, color, 1f);
    };
    public static void spin(float x, float y, @Nullable TextureRegion reg, float prog, float spd, float ang, float regScl, int sideAmt) {
        spin(x, y, reg, prog, spd, ang, regScl, sideAmt, Color.white);
    };
    public static void spin(float x, float y, @Nullable TextureRegion reg, float prog, float spd, float ang, float regScl) {
        spin(x, y, reg, prog, spd, ang, regScl, 4);
    };
    public static void spin(float x, float y, @Nullable TextureRegion reg, float prog, float spd, float ang) {
        spin(x, y, reg, prog, spd, ang, 1f);
    };
    public static void spin(float x, float y, @Nullable TextureRegion reg, float prog, float spd) {
        spin(x, y, reg, prog, spd, 0f);
    };


    /**
     * {@link DrawFade}.
     */
    public static void fade(float x, float y, @Nullable TextureRegion reg, float fadeScl, float ang, float regScl, Color color, float a, float z) {
        if(reg == null) return;

        float a_fi = a * Math.abs(Mathf.sin(Time.time * 0.065f / fadeScl));
        LCDraw.region(x, y, reg, ang, regScl, color, a_fi, z);
    };
    // Overload
    public static void fade(float x, float y, @Nullable TextureRegion reg, float fadeScl, float ang, float regScl, Color color, float a) {
        fade(x, y, reg, fadeScl, ang, regScl, color, a, -1f);
    };
    public static void fade(float x, float y, @Nullable TextureRegion reg, float fadeScl, float ang, float regScl, Color color) {
        fade(x, y, reg, fadeScl, ang, regScl, color, 1f);
    };
    public static void fade(float x, float y, @Nullable TextureRegion reg, float fadeScl, float ang, float regScl) {
        fade(x, y, reg, fadeScl, ang, regScl, Color.white);
    };
    public static void fade(float x, float y, @Nullable TextureRegion reg, float fadeScl, float ang) {
        fade(x, y, reg, fadeScl, ang, 1f);
    };
    public static void fade(float x, float y, @Nullable TextureRegion reg, float fadeScl) {
        fade(x, y, reg, fadeScl, 0f);
    };
    public static void fade(float x, float y, @Nullable TextureRegion reg) {
        fade(x, y, reg, 1f);
    };


    /**
     * Variant of {@link LCDrawf#fade} where progress is controlled by <code>prog</code> instead of <code>Time.time</code>.
     */
    public static void fadeProg(float x, float y, @Nullable TextureRegion reg, float prog, float fadeScl, float ang, float regScl, Color color, float a, float z) {
        if(reg == null) return;

        float a_fi = a * Math.abs(Mathf.sin(prog * 0.15f / fadeScl));
        LCDraw.region(x, y, reg, ang, regScl, color, a_fi, z);
    };
    // Overload
    public static void fadeProg(float x, float y, @Nullable TextureRegion reg, float prog, float fadeScl, float ang, float regScl, Color color, float a) {
        fadeProg(x, y, reg, prog, fadeScl, ang, regScl, color, a, -1f);
    };
    public static void fadeProg(float x, float y, @Nullable TextureRegion reg, float prog, float fadeScl, float ang, float regScl, Color color) {
        fadeProg(x, y, reg, prog, fadeScl, ang, regScl, color, 1f);
    };
    public static void fadeProg(float x, float y, @Nullable TextureRegion reg, float prog, float fadeScl, float ang, float regScl) {
        fadeProg(x, y, reg, prog, fadeScl, ang, regScl, Color.white);
    };
    public static void fadeProg(float x, float y, @Nullable TextureRegion reg, float prog, float fadeScl, float ang) {
        fadeProg(x, y, reg, prog, fadeScl, ang, 1f);
    };
    public static void fadeProg(float x, float y, @Nullable TextureRegion reg, float prog, float fadeScl) {
        fadeProg(x, y, reg, prog, fadeScl, 0f);
    };
    public static void fadeProg(float x, float y, @Nullable TextureRegion reg, float prog) {
        fadeProg(x, y, reg, prog, 1f);
    };


    /**
     * Variant of {@link LCDrawf#fade} where the region becomes opaque when <code>frac</code> approaches 1.0.
     */
    public static void fadeAlert(float x, float y, @Nullable TextureRegion reg, float frac, float ang, float regScl, Color color, float a, float z) {
        if(reg == null) return;

        float a_fi = 1f - Mathf.pow(Mathf.clamp(frac) - 1f, 2f);
        fade(x, y, reg, ang, regScl, 0.3f, color, a_fi, z);
    };
    // Overload
    public static void fadeAlert(float x, float y, @Nullable TextureRegion reg, float frac, float ang, float regScl, Color color, float a) {
        fadeAlert(x, y, reg, frac, ang, regScl, color, a, -1f);
    };
    public static void fadeAlert(float x, float y, @Nullable TextureRegion reg, float frac, float ang, float regScl, Color color) {
        fadeAlert(x, y, reg, frac, ang, regScl, color, 1f);
    };
    public static void fadeAlert(float x, float y, @Nullable TextureRegion reg, float frac, float ang, float regScl) {
        fadeAlert(x, y, reg, frac, ang, regScl, Color.white);
    };
    public static void fadeAlert(float x, float y, @Nullable TextureRegion reg, float frac, float ang) {
        fadeAlert(x, y, reg, frac, ang, 1f);
    };
    public static void fadeAlert(float x, float y, @Nullable TextureRegion reg, float frac) {
        fadeAlert(x, y, reg, frac, 0f);
    };


    /**
     * Draws glow region.
     */
    public static void glow(float x, float y, @Nullable TextureRegion reg, float ang, Color color, float a, float pulse, float pulseScl, float z) {
        if(reg == null) return;

        LCDraw.processZ(z, LCDraw.GLOW_REGION_Z_IND);
        Draw.color(color, a * (1f - pulse + Mathf.absin(pulseScl, pulse)));
        Draw.blend(Blending.additive);
        Draw.rect(reg, x, y, ang);
        Draw.blend();
        Draw.color();
        LCDraw.processZ(-1f, LCDraw.GLOW_REGION_Z_IND);
    };
    // Overload
    public static void glow(float x, float y, @Nullable TextureRegion reg, float ang, Color color, float a, float pulse, float pulseScl) {
        glow(x, y, reg, ang, color, a, pulse, pulseScl, Layer.blockAdditive);
    };
    public static void glow(float x, float y, @Nullable TextureRegion reg, float ang, Color color, float a, float z) {
        glow(x, y, reg, ang, color, a, 0.3f, 10f, z);
    };
    public static void glow(float x, float y, @Nullable TextureRegion reg, float ang, Color color, float a) {
        glow(x, y, reg, ang, color, a, 0.3f, 10f);
    };
    public static void glow(float x, float y, @Nullable TextureRegion reg, float ang, Color color) {
        glow(x, y, reg, ang, color, 1f);
    };
    public static void glow(float x, float y, @Nullable TextureRegion reg, float ang) {
        glow(x, y, reg, ang, Color.white);
    };
    public static void glow(float x, float y, @Nullable TextureRegion reg) {
        glow(x, y, reg, 0f);
    };


    /**
     * Draws heat region.
     */
    public static void heat(float x, float y, @Nullable TextureRegion reg, float frac, int size, float ang, Color color, float z) {
        if(reg == null) {
            reg = heatRegs[size];
        };
        glow(x, y, reg, ang, color, Mathf.clamp(frac), z);
    };
    // Overload
    public static void heat(float x, float y, @Nullable TextureRegion reg, float frac, int size, float ang, Color color) {
        heat(x, y, reg, frac, size, ang, color, -1f);
    };
    public static void heat(float x, float y, @Nullable TextureRegion reg, float frac, int size, float ang) {
        heat(x, y, reg, frac, size, ang, heatColor);
    };
    public static void heat(float x, float y, @Nullable TextureRegion reg, float frac, int size) {
        heat(x, y, reg, frac, size, 0f);
    };


    /**
     * Draws frame animation.
     */
    public static void frame(float x, float y, TextureRegion[] regs, float prog, float intv, float ang, int offInd, Color color, float a, float z) {
        if(regs.length == 0) return;

        LCDraw.processZ(z, LCDraw.NORMAL_REGION_Z_IND);
        Draw.color(color, a);
        Draw.rect(regs[Mathf.mod(Mathf.floor(prog / intv) + offInd, regs.length)], x, y, ang);
        Draw.color();
        LCDraw.processZ(-1f, LCDraw.NORMAL_REGION_Z_IND);
    };
    // Overload
    public static void frame(float x, float y, TextureRegion[] regs, float prog, float intv, float ang, int offInd, Color color, float a) {
        frame(x, y, regs, prog, intv, ang, offInd, color, a, -1f);
    };
    public static void frame(float x, float y, TextureRegion[] regs, float prog, float intv, float ang, int offInd, Color color) {
        frame(x, y, regs, prog, intv, ang, offInd, color, 1f);
    };
    public static void frame(float x, float y, TextureRegion[] regs, float prog, float intv, float ang, int offInd) {
        frame(x, y, regs, prog, intv, ang, offInd, Color.white);
    };
    public static void frame(float x, float y, TextureRegion[] regs, float prog, float intv, float ang) {
        frame(x, y, regs, prog, intv, ang, 0);
    };
    public static void frame(float x, float y, TextureRegion[] regs, float prog, float intv) {
        frame(x, y, regs, prog, intv, 0f);
    };


    /**
     * Variant of {@link LCDrawf#frame} with frame fading transition.
     */
    public static void frameFade(float x, float y, TextureRegion[] regs, float prog, float intv, float ang, int offInd, Color color, float a, float z) {
        if(regs.length == 0) return;

        float a1 = Mathf.mod(prog, intv) / intv;
        frame(x, y, regs, prog, intv, ang, offInd, color, a * (1f - a1), z);
        frame(x, y, regs, prog, intv, ang, offInd + 1, color, a * a1, z);
    };
    // Overload
    public static void frameFade(float x, float y, TextureRegion[] regs, float prog, float intv, float ang, int offInd, Color color, float a) {
        frameFade(x, y, regs, prog, intv, ang, offInd, color, a, -1f);
    };
    public static void frameFade(float x, float y, TextureRegion[] regs, float prog, float intv, float ang, int offInd, Color color) {
        frameFade(x, y, regs, prog, intv, ang, offInd, color, 1f);
    };
    public static void frameFade(float x, float y, TextureRegion[] regs, float prog, float intv, float ang, int offInd) {
        frameFade(x, y, regs, prog, intv, ang, offInd, Color.white);
    };
    public static void frameFade(float x, float y, TextureRegion[] regs, float prog, float intv, float ang) {
        frameFade(x, y, regs, prog, intv, ang, 0);
    };
    public static void frameFade(float x, float y, TextureRegion[] regs, float prog, float intv) {
        frameFade(x, y, regs, prog, intv, 0f);
    };


    /**
     * {@link DrawWeave} but no region used.
     */
    public static void scan(float x, float y, float prog, float warmup, float size, Color color, float a, float z) {
        LCDraw.processZ(z, LCDraw.NORMAL_REGION_Z_IND);
        Draw.color(color, warmup * a);
        Lines.lineAngleCenter(
            x + Mathf.sin(prog, 6f, size * Vars.tilesize / 3f),
            y,
            90f,
            size * Vars.tilesize / 2f
        );
        Draw.color();
        LCDraw.processZ(-1f, LCDraw.NORMAL_REGION_Z_IND);
    };
    // Overload
    public static void scan(float x, float y, float prog, float warmup, float size, Color color, float a) {
        scan(x, y, prog, warmup, size, color, a, -1f);
    };
    public static void scan(float x, float y, float prog, float warmup, float size, Color color) {
        scan(x, y, prog, warmup, size, color, 1f);
    };
    public static void scan(float x, float y, float prog, float warmup, float size) {
        scan(x, y, prog, warmup, size, Pal.accent);
    };


    /**
     * {@link DrawFlame} without "-top" region.
     * Light is not included.
     */
    public static void flame(float x, float y, @Nullable TextureRegion reg, float warmup, float rad, float radIn, float radScl, float radMag, float radInMag, Color color, float a, float z) {
        if(reg == null) return;

        float
            param1 = 0.3f,
            param2 = 0.06f,
            param3 = Mathf.random(0.1f),
            a_fi = a * ((1f - param1) + Mathf.absin(Time.time, 8f, param1) + Mathf.random(param2) - param2) * warmup,
            rad_fi = rad + Mathf.absin(Time.time, radScl, radMag) + param3,
            radIn_fi = radIn + Mathf.absin(Time.time, radScl, radInMag) + param3;

        LCDraw.processZ(z, LCDraw.NORMAL_REGION_Z_IND);
        Draw.alpha(a * warmup);
        Draw.rect(reg, x, y);
        Draw.alpha(a_fi);
        Draw.tint(color);
        Fill.circle(x, y, rad_fi);
        Draw.color(1f, 1f, 1f, a * warmup);
        Fill.circle(x, y, radIn_fi);
        Draw.reset();
        LCDraw.processZ(-1f, LCDraw.NORMAL_REGION_Z_IND);
    };
    // Overload
    public static void flame(float x, float y, @Nullable TextureRegion reg, float warmup, float rad, float radIn, float radScl, float radMag, float radInMag, Color color, float a) {
        flame(x, y, reg, warmup, rad, radIn, radScl, radMag, radInMag, color, a, -1f);
    };
    public static void flame(float x, float y, @Nullable TextureRegion reg, float warmup, float rad, float radIn, float radScl, float radMag, float radInMag, Color color) {
        flame(x, y, reg, warmup, rad, radIn, radScl, radMag, radInMag, color, 1f);
    };
    public static void flame(float x, float y, @Nullable TextureRegion reg, float warmup, float rad, float radIn, float radScl, float radMag, float radInMag) {
        flame(x, y, reg, warmup, rad, radIn, radScl, radMag, radInMag, Color.white);
    };
    public static void flame(float x, float y, @Nullable TextureRegion reg, float warmup, float rad, float radScl, Color color, float a, float z) {
        flame(x, y, reg, warmup, rad, rad * 0.6f, radScl, 2f, 1f, color, a, z);
    };
    public static void flame(float x, float y, @Nullable TextureRegion reg, float warmup, float rad, float radScl, Color color, float a) {
        flame(x, y, reg, warmup, rad, radScl, color, a, -1f);
    };
    public static void flame(float x, float y, @Nullable TextureRegion reg, float warmup, float rad, float radScl, Color color) {
        flame(x, y, reg, warmup, rad, radScl, color, 1f);
    };
    public static void flame(float x, float y, @Nullable TextureRegion reg, float warmup, float rad, float radScl) {
        flame(x, y, reg, warmup, rad, radScl, Color.white);
    };
    public static void flame(float x, float y, @Nullable TextureRegion reg, float warmup, float rad, Color color, float a, float z) {
        flame(x, y, reg, warmup, rad, 5f, color, a, z);
    };
    public static void flame(float x, float y, @Nullable TextureRegion reg, float warmup, float rad, Color color, float a) {
        flame(x, y, reg, warmup, rad, 5f, color, a, -1f);
    };
    public static void flame(float x, float y, @Nullable TextureRegion reg, float warmup, float rad, Color color) {
        flame(x, y, reg, warmup, rad, 5f, color, 1f);
    };
    public static void flame(float x, float y, @Nullable TextureRegion reg, float warmup, float rad) {
        flame(x, y, reg, warmup, rad, 5f, Color.white);
    };


    /**
     * Draws Sublimate torch.
     * No flare included.
     */
    public static void torch(float x, float y, float warmup, float len, float w, float size, Color color, Color colorIn, float ang, float a, float z) {
        if(len < 0.1f) return;

        float
            offRad = size * Vars.tilesize / 2f,
            x_fi = x + Mathf.cosDeg(ang) * offRad,
            y_fi = y + Mathf.sinDeg(ang) * offRad,
            len_f = len * 0.4f * warmup,
            len_t = len * warmup,
            w_f = w * 0.3f * warmup,
            w_t = w * 1.2f * warmup,
            lenScl = 1f + Mathf.sin(Time.time, 1f, 0.07f);

        Drawf.light(x_fi, y_fi, x + Mathf.cosDeg(ang) * len * 1.2f, y + Mathf.sinDeg(ang) * len * 1.2f, w_t * 6f, color, a * 0.65f);
        LCDraw.processZ(z, LCDraw.BULLET_REGION_Z_IND);
        float frac_i, a_i, len_i, w_i;
        for(int i = 0; i < 4; i++) {
            frac_i = 1f - i / 3f;
            a_i = Mathf.lerp(a, a * 0.4f, frac_i);
            len_i = Mathf.lerp(len_f, len_t, frac_i);
            w_i = Mathf.lerp(w_f, w_t, frac_i);
            Draw.color(Tmp.c1.set(colorIn).lerp(color, frac_i));
            Draw.alpha(a_i);
            Drawf.flame(x_fi, y_fi, 12, ang, len_i * lenScl, w_i, 0.2f);
        };
        Draw.reset();
        LCDraw.processZ(-1f, LCDraw.BULLET_REGION_Z_IND);
    };
    // Overload
    public static void torch(float x, float y, float warmup, float len, float w, float size, Color color, Color colorIn, float ang, float a) {
        torch(x, y, warmup, len, w, size, color, colorIn, ang, a, bulFlameLay);
    };
    public static void torch(float x, float y, float warmup, float len, float w, float size, Color color, Color colorIn, float ang) {
        torch(x, y, warmup, len, w, size, color, colorIn, ang, 1f);
    };
    public static void torch(float x, float y, float warmup, float len, float w, float size, Color color, Color colorIn) {
        torch(x, y, warmup, len, w, size, color, colorIn, 0f);
    };


    /* <-------------------- light --------------------> */


    /**
     * Draws circular light.
     */
    public static void light(float x, float y, float warmup, float rad, float size, Color color, float a, float sinScl, float sinMag) {
        Drawf.light(x, y, (rad + Mathf.absin(sinScl, sinMag)) * warmup * size, color, a);
    };
    // Overload
    public static void light(float x, float y, float warmup, float rad, float size, Color color, float a) {
        light(x, y, warmup, rad, size, color, a, 16f, 6f);
    };
    public static void light(float x, float y, float warmup, float rad, float size, Color color) {
        light(x, y, warmup, rad, size, color, 0.65f);
    };
    public static void light(float x, float y, float warmup, float rad, float size) {
        light(x, y, warmup, rad, size, lightColor);
    };
    public static void light(float x, float y, float warmup, float rad) {
        light(x, y, warmup, rad, 1);
    };


    /**
     * Draws conical light.
     */
    public static void lightArc(float x, float y, float warmup, float rad, float coneScl, float ang, Color color, float a) {
        if(Vars.renderer == null || lightConeReg == null) return;

        float
            w = rad * lightConeReg.scl() * Vars.tilesize * coneScl * warmup,
            h = rad * lightConeReg.scl() * Vars.tilesize * warmup;

        Vars.renderer.lights.add(() -> {
            Draw.color(color);
            Draw.alpha(a);
            Draw.rect(lightConeReg, x, y, w, h, ang);
            Draw.color();
        });
    };
    // Overload
    public static void lightArc(float x, float y, float warmup, float rad, float coneScl, float ang, Color color) {
        lightArc(x, y, warmup, rad, coneScl, ang, color, 0.65f);
    };
    public static void lightArc(float x, float y, float warmup, float rad, float coneScl, float ang) {
        lightArc(x, y, warmup, rad, coneScl, ang, lightColor);
    };


    /* <-------------------- specific --------------------> */


    /**
     * Draws block status.
     */
    public static void blockStatus(float x, float y, float size, Color color, float z) {
        float mtp = size > 1f ? 1f : 0.64f;
        float x_fi = x + size * Vars.tilesize / 2f - mtp * Vars.tilesize / 2f;
        float y_fi = y - size * Vars.tilesize / 2f + mtp * Vars.tilesize / 2f;

        LCDraw.processZ(z, LCDraw.UI_REGION_Z_IND);
        Draw.color(Pal.gray, Lod.alpha2);
        Fill.square(x_fi, y_fi, mtp * 2.5f, 45f);
        Draw.color(color, Lod.alpha2);
        Fill.square(x_fi, y_fi, mtp * 1.5f, 45f);
        Draw.color();
        LCDraw.processZ(-1f, LCDraw.UI_REGION_Z_IND);
    };
    // Overload
    public static void blockStatus(float x, float y, float size, Color color) {
        blockStatus(x, y, size, color, Layer.power + 1f);
    };


    /**
     * Calculates position for random walk in a square (width of 1).
     */
    public static Vec2 getRandWalkVec(Vec2 out, float time) {
        float time_fi = time / 60f;
        return out.set(
            0.7f * Mathf.cos(time_fi) * Mathf.sin(0.5f * time_fi) - 0.3f * Mathf.cos(time_fi),
            0.3f * Mathf.sin(time_fi) + 0.6f * Mathf.cos(0.5f * time_fi) * Mathf.sin(time_fi) + 0.1f * Mathf.cos(time_fi + 2.5f)
        );
    };


    /**
     * Draws random overlay on floor at a tile.
     */
    public static void randomOverlay(Tile t, TextureRegion[] regs, int denom, float off1, float off2) {
        if(regs.length == 0 || Mathf.floor(Mathf.randomSeed((long)(t.pos() + off1), 0, denom)) != 0) return;
        LCDraw.region(
            t.worldx(), t.worldy(),
            regs[Mathf.round(Mathf.randomSeed((long)(t.pos() + 114514 + off2), 0, regs.length - 1))],
            0f, 1f, Color.white, 1f, randOvLay
        );
    };


    /**
     * Draws construction.
     */
    public static void construct(float x, float y, @Nullable TextureRegion reg, float frac, float ang, Color color, float z) {
        if(reg == null) return;

        Draw.draw(z, () -> {
            Shaders.blockbuild.region = reg;
            Shaders.blockbuild.time = Time.time;
            Shaders.blockbuild.progress = frac;
            Draw.color(color);
            Draw.rect(reg, x, y, ang);
            Draw.color();

            Draw.flush();
        });
    };
    // Overload
    public static void construct(float x, float y, @Nullable TextureRegion reg, float frac, float ang, Color color) {
        construct(x, y, reg, frac, ang, color, Layer.blockBuilding);
    };
    public static void construct(float x, float y, @Nullable TextureRegion reg, float frac, float ang) {
        construct(x, y, reg, frac, ang, Pal.accent);
    };
    public static void construct(float x, float y, @Nullable TextureRegion reg, float frac) {
        construct(x, y, reg, frac, 0f);
    };


    /**
     * Draws placement plan.
     */
    public static void plan(float x, float y, @Nullable TextureRegion reg, float ang, float regScl, Color color, float a, float z) {
        if(reg == null) return;

        float
            regScl_fi = regScl * (0.825f + Mathf.sin(Time.globalTime * 0.065f) * 0.075f),
            w = reg.width * reg.scl() * regScl_fi,
            h = reg.height * reg.scl() * regScl_fi;

        LCDraw.processZ(z, LCDraw.UI_REGION_Z_IND);
        Draw.color(color, a * 0.75f);
        Draw.rect(reg, x, y, w, h, ang);
        Draw.color();
        LCDraw.processZ(-1f, LCDraw.UI_REGION_Z_IND);
    };
    // Overload
    public static void plan(float x, float y, @Nullable TextureRegion reg, float ang, float regScl, Color color, float a) {
        plan(x, y, reg, ang, regScl, color, a, Layer.power - 0.01f);
    };
    public static void plan(float x, float y, @Nullable TextureRegion reg, float ang, float regScl, Color color) {
        plan(x, y, reg, ang, regScl, color, 1f);
    };
    public static void plan(float x, float y, @Nullable TextureRegion reg, float ang, float regScl) {
        plan(x, y, reg, ang, regScl, Color.white);
    };
    public static void plan(float x, float y, @Nullable TextureRegion reg, float ang) {
        plan(x, y, reg, ang, 1f);
    };
    public static void plan(float x, float y, @Nullable TextureRegion reg) {
        plan(x, y, reg, 0f);
    };


    /**
     * Variant of {@link LCDrawf#plan} for block placement.
     */
    public static void planPlace(Block blk, @Nullable Tile t, float ang) {
        if(t == null) return;
        Color color = t.getLinkedTilesAs(blk, tmpTs).find(ot -> ot.solid() || ot.build != null) == null ? Color.white : Pal.remove;
        plan(LCFormat.toFCoord(t.x, blk.size), LCFormat.toFCoord(t.y, blk.size), LCTexture.getBlockRegion(blk), ang, 1f, color);
    };
    // Overload
    public static void planPlace(Block blk, @Nullable Tile t) {
        planPlace(blk, t, 0f);
    };


    /**
     * Draws a wobbling tree.
     */
    public static void tree(
        TextureRegion reg, TextureRegion shaReg,
        Tile t, float rad, float offSha, float scl, float mag, float wob, float a, float z,
        boolean shouldDrawWobble, boolean shouldCheckDst
    ) {
        if(a < 0.01f) return;

        var zPrev = Draw.z();
        if(shaReg.found()) {
            Draw.z(z - 0.001f);
            Draw.rect(shaReg, t.worldx() + offSha, t.worldy() + offSha, Mathf.randomSeed(t.pos(), 0f, 360f));
        };
        if(!shouldCheckDst) {
            Draw.alpha(a);
        } else {
            var unitPl = Vars.player.unit();
            var dst = unitPl == null ? 99999999f : Mathf.dst(t.worldx(), t.worldy(), unitPl.x, unitPl.y);
            Draw.alpha(a * dst < rad ? 0.37f : 1f);
        };
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
        };
        Draw.color();
        Draw.z(zPrev);
    };
    // Overload
    public static void tree(
        TextureRegion reg, TextureRegion shaReg,
        Tile t, float rad, float offSha, float scl, float mag, float wob, float a, float z,
        boolean shouldDrawWobble
    ) {
        tree(reg, shaReg, t, rad, offSha, scl, mag, wob, a, z, shouldDrawWobble, false);
    };
    public static void tree(
        TextureRegion reg, TextureRegion shaReg,
        Tile t, float rad, float offSha, float scl, float mag, float wob, float a, float z
    ) {
        tree(reg, shaReg, t, rad, offSha, scl, mag, wob, a, z, true);
    };


};
