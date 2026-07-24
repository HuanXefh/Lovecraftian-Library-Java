package lovec.graphics;

import arc.Core;
import arc.graphics.Blending;
import arc.graphics.Color;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.Fill;
import arc.graphics.g2d.Lines;
import arc.graphics.g2d.TextureRegion;
import arc.math.Interp;
import arc.math.Mathf;
import arc.math.geom.Vec2;
import arc.struct.ObjectMap;
import arc.struct.Seq;
import arc.util.Nullable;
import arc.util.Time;
import arc.util.Tmp;
import lovec.utils.LCPos;
import lovec.utils.LCScript;
import lovec.utils.extend.LCNativeArray;
import mindustry.Vars;
import mindustry.content.Fx;
import mindustry.core.Renderer;
import mindustry.gen.Building;
import mindustry.gen.Unit;
import mindustry.graphics.*;
import mindustry.type.StatusEffect;
import mindustry.world.Block;
import mindustry.world.Tile;
import mindustry.world.draw.DrawFade;
import mindustry.world.draw.DrawFlame;
import mindustry.world.draw.DrawSideRegion;
import mindustry.world.draw.DrawWeave;
import rhino.NativeArray;

import static lovec.utils.LCScript.*;

/**
 * Utility draw methods.
 * Originally <code>MDL_draw</code> in the JavaScript part.
 */
public class LCDrawf {


    public static TextureRegion arrowReg;
    public static TextureRegion[] heatRegs;
    public static TextureRegion lightConeReg;
    public static ObjectMap<String, TextureRegion> wireMatRegMap = new ObjectMap<>();
    public static ObjectMap<String, TextureRegion> wireMatEndRegMap = new ObjectMap<>();
    public static TextureRegion wireGlowReg;
    public static TextureRegion wireShaReg;

    public static Color lightColor = Color.valueOf("ffc999");
    public static Color heatColor = Color.valueOf("ff3838");


    static Vec2 tmpVec1 = new Vec2();
    static Vec2 tmpVec2 = new Vec2();
    static Vec2 tmpVec3 = new Vec2();
    static Seq<Tile> tmpTsSeq = new Seq<>();

    static float
        shapeLay,
        mineBeamLay,
        bulFlameLay,
        randOvLay;


    public static void init() {
        shapeLay = Layer.effect + LCScript.toFloat(LCScript.search(VAR, "layer", "offDraw"));
        mineBeamLay = LCScript.toFloat(LCScript.search(VAR, "layer", "mineBeam"));
        bulFlameLay = LCScript.toFloat(LCScript.search(VAR, "layer", "bulFlame"));
        randOvLay = LCScript.toFloat(LCScript.search(VAR, "layer", "randOv"));

        if(!Vars.headless) {
            arrowReg = Core.atlas.find("bridge-arrow");
            heatRegs = new TextureRegion[16];
            for(int i = 0; i < heatRegs.length; i++) {
                heatRegs[i] = Core.atlas.find("lovec-ast-block-heat" + i);
            };
            lightConeReg = Core.atlas.find("lovec-efr-shadow-cone");
            NativeArray wireMats = LCScript.toArray(LCScript.search(DB_block, "db", "grpParam", "wireMatReg"));
            LCNativeArray.forEachRow(wireMats, 2, rowArr -> {
                wireMatRegMap.put((String)(rowArr.get(0)), Core.atlas.find((String)(rowArr.get(1))));
                wireMatEndRegMap.put((String)(rowArr.get(0)), Core.atlas.find(rowArr.get(1) + "-end"));
            });
            wireGlowReg = Core.atlas.find("lovec-ast-wire-glow");
            wireShaReg = Core.atlas.find("lovec-ast-wire-shadow");
        };
    };


    /**
     * Debug draw method.
     */
    public static void debug(float x, float y, Color color) {
        LCDraw.processZ(Layer.max, LCDraw.DEBUG_Z_IND);
        Draw.color(color);
        Fill.circle(x, y, 3f);
        Draw.color();
        LCDraw.processZ(-1f, LCDraw.DEBUG_Z_IND);
    };
    // Overload
    public static void debug(float x, float y) {
        debug(x, y, Pal.heal);
    };
    public static void debug(float x1, float y1, float x2, float y2, Color color) {
        LCDraw.processZ(Layer.max, LCDraw.DEBUG_Z_IND);
        Lines.stroke(3f, color);
        Lines.line(x1, y1, x2, y2);
        Draw.reset();
        LCDraw.processZ(-1f, LCDraw.DEBUG_Z_IND);
    };
    public static void debug(float x1, float y1, float x2, float y2) {
        debug(x1, y1, x2, y2, Pal.heal);
    };


    /* <-------------------- line --------------------> */


    /**
     * Draws outlined line.
     */
    public static void line(float x1, float y1, float x2, float y2, boolean isDashed, Color color, float a, float z) {
        LCDraw.processZ(z, LCDraw.SHAPE_Z_IND);
        Lines.stroke(3f, Tmp.c1.set(Pal.gray).a(a));
        LCDraw.line(x1, y1, x2, y2, isDashed);
        Lines.stroke(1f, color);
        Draw.alpha(a);
        LCDraw.line(x1, y1, x2, y2, isDashed);
        Draw.reset();
        LCDraw.processZ(-1f, LCDraw.SHAPE_Z_IND);
    };
    // Overload
    public static void line(float x1, float y1, float x2, float y2, boolean isDashed, Color color, float a) {
        line(x1, y1, x2, y2, isDashed, color, a, shapeLay);
    };
    public static void line(float x1, float y1, float x2, float y2, boolean isDashed, Color color) {
        line(x1, y1, x2, y2, isDashed, color, 1f);
    };
    public static void line(float x1, float y1, float x2, float y2, boolean isDashed) {
        line(x1, y1, x2, y2, isDashed, Pal.accent);
    };
    public static void line(float x1, float y1, float x2, float y2) {
        line(x1, y1, x2, y2, false);
    };


    /**
     * Draws fading line.
     */
    public static void lineFlick(float x1, float y1, float x2, float y2, boolean isDashed, float stroke, float scl, Color color, float z) {
        LCDraw.processZ(z, LCDraw.SHAPE_Z_IND);
        Lines.stroke(stroke, color);
        Draw.alpha(0.35f + Mathf.sin(Time.globalTime / scl / 15f) * 0.25f);
        LCDraw.line(x1, y1, x2, y2, isDashed);
        Draw.reset();
        LCDraw.processZ(-1f, LCDraw.SHAPE_Z_IND);
    };
    // Overload
    public static void lineFlick(float x1, float y1, float x2, float y2, boolean isDashed, float stroke, float scl, Color color) {
        lineFlick(x1, y1, x2, y2, isDashed, stroke, scl, color, shapeLay);
    };
    public static void lineFlick(float x1, float y1, float x2, float y2, boolean isDashed, float stroke, float scl) {
        lineFlick(x1, y1, x2, y2, isDashed, stroke, scl, Pal.accent);
    };
    public static void lineFlick(float x1, float y1, float x2, float y2, boolean isDashed, float stroke) {
        lineFlick(x1, y1, x2, y2, isDashed, stroke, 1f);
    };
    public static void lineFlick(float x1, float y1, float x2, float y2, boolean isDashed) {
        lineFlick(x1, y1, x2, y2, isDashed, 1.5f);
    };
    public static void lineFlick(float x1, float y1, float x2, float y2) {
        lineFlick(x1, y1, x2, y2, false);
    };


    /**
     * Calculates laser alpha using {@link Lod}.
     */
    public static float getLaserA(float strokeScl, boolean useLaserA, boolean useUnitLaserA, boolean useLod) {
        float a1 = !useLod ?
            1f :
            strokeScl < 3.3333f ? Lod.alpha1 : Lod.alpha2;
        float a2 = !useUnitLaserA ?
            1f :
            Renderer.unitLaserOpacity;
        float a3 = !useLaserA ?
            1f :
            Renderer.laserOpacity;

        return a1 * a2 * a3;
    };


    /**
     * Draws laser line.
     */
    public static void laser(float x1, float y1, float x2, float y2, float strokeScl, Color color1, Color color2, float a, boolean hasLight, float z) {
        float strokeScl_fi = (1f + Mathf.sin(Time.time * 0.065f) * 0.2f) * strokeScl;

        LCDraw.processZ(z, LCDraw.SHAPE_Z_IND);
        Lines.stroke(3f * strokeScl_fi, color1);
        Draw.alpha(a);
        Lines.line(x1, y1, x2, y2);
        Fill.circle(x1, y1, 2.4f * strokeScl_fi);
        Fill.circle(x2, y2, 2.4f * strokeScl_fi);
        Lines.stroke(strokeScl_fi, color2);
        Draw.alpha(a);
        Lines.line(x1, y1, x2, y2);
        Fill.circle(x1, y1, 1.2f * strokeScl_fi);
        Fill.circle(x2, y2, 1.2f * strokeScl_fi);
        Draw.reset();
        LCDraw.processZ(-1f, LCDraw.SHAPE_Z_IND);
        if(hasLight) {
            Drawf.light(x1, y1, x2, y2);
        };
    };
    // Overload
    public static void laser(float x1, float y1, float x2, float y2, float strokeScl, Color color1, Color color2, float a, boolean hasLight) {
        laser(x1, y1, x2, y2, strokeScl, color1, color2, a, hasLight, shapeLay);
    };
    public static void laser(float x1, float y1, float x2, float y2, float strokeScl, Color color1, Color color2, float a) {
        laser(x1, y1, x2, y2, strokeScl, color1, color2, a, false);
    };
    public static void laser(float x1, float y1, float x2, float y2, float strokeScl, Color color1, Color color2) {
        laser(x1, y1, x2, y2, strokeScl, color1, color2, 1f);
    };
    public static void laser(float x1, float y1, float x2, float y2, float strokeScl, Color color, float a, boolean hasLight, float z) {
        laser(x1, y1, x2, y2, strokeScl, color, Color.white, a, hasLight, z);
    };
    public static void laser(float x1, float y1, float x2, float y2, float strokeScl, Color color, float a, boolean hasLight) {
        laser(x1, y1, x2, y2, strokeScl, color, a, hasLight, shapeLay);
    };
    public static void laser(float x1, float y1, float x2, float y2, float strokeScl, Color color, float a) {
        laser(x1, y1, x2, y2, strokeScl, color, a, false);
    };
    public static void laser(float x1, float y1, float x2, float y2, float strokeScl, Color color) {
        laser(x1, y1, x2, y2, strokeScl, color, 1f);
    };


    /**
     * Draws laser that randomly walks in a rectangular range.
     */
    public static Vec2 laserRandWalk(
        float x, float y, float cx, float cy, float rad, float offTime, int rot, float strokeScl,
        Color color1, Color color2, float a, boolean hasLight, float z
    ) {
        Vec2 vec = getRandWalkVec(tmpVec1, Time.time + offTime).rotate90(rot);
        laser(x, y, cx + vec.x * rad, cy + vec.y * rad, strokeScl, color1, color2, a, hasLight, z);
        return vec;
    };
    // Overload
    public static Vec2 laserRandWalk(
        float x, float y, float cx, float cy, float rad, float offTime, int rot, float strokeScl,
        Color color1, Color color2, float a, boolean hasLight
    ) {
        return laserRandWalk(x, y, cx, cy, rad, offTime, rot, strokeScl, color1, color2, a, hasLight, shapeLay);
    };
    public static Vec2 laserRandWalk(
        float x, float y, float cx, float cy, float rad, float offTime, int rot, float strokeScl,
        Color color1, Color color2, float a
    ) {
        return laserRandWalk(x, y, cx, cy, rad, offTime, rot, strokeScl, color1, color2, a, false);
    };
    public static Vec2 laserRandWalk(
        float x, float y, float cx, float cy, float rad, float offTime, int rot, float strokeScl,
        Color color1, Color color2
    ) {
        return laserRandWalk(x, y, cx, cy, rad, offTime, rot, strokeScl, color1, color2, 1f);
    };
    public static Vec2 laserRandWalk(
        float x, float y, float cx, float cy, float rad, float offTime, int rot, float strokeScl,
        Color color, float a, boolean hasLight, float z
    ) {
        return laserRandWalk(x, y, cx, cy, rad, offTime, rot, strokeScl, color, Color.white, a, hasLight, z);
    };
    public static Vec2 laserRandWalk(
        float x, float y, float cx, float cy, float rad, float offTime, int rot, float strokeScl,
        Color color, float a, boolean hasLight
    ) {
        return laserRandWalk(x, y, cx, cy, rad, offTime, rot, strokeScl, color, a, hasLight, shapeLay);
    };
    public static Vec2 laserRandWalk(
        float x, float y, float cx, float cy, float rad, float offTime, int rot, float strokeScl,
        Color color, float a
    ) {
        return laserRandWalk(x, y, cx, cy, rad, offTime, rot, strokeScl, color, a, false);
    };
    public static Vec2 laserRandWalk(
        float x, float y, float cx, float cy, float rad, float offTime, int rot, float strokeScl,
        Color color
    ) {
        return laserRandWalk(x, y, cx, cy, rad, offTime, rot, strokeScl, color, 1f);
    };


    /**
     * Variant of {@link #laserRandWalk} for mining beam.
     */
    public static Vec2 laserRandMine(
        float x, float y, float cx, float cy, float rad, float offTime, int rot, float strokeScl,
        Color color1, Color color2, float a, boolean hasLight, float z
    ) {
        laserRandWalk(
            x, y,
            cx + Mathf.cos(Time.time * 0.025f) * 4f,
            cy + Mathf.sin(Time.time * 0.025f) * 4f,
            rad, offTime, rot, strokeScl, color1, color2, a, hasLight, z
        );
        if(!Vars.state.isPaused() && LCScript.toBoolean(LCScript.get("trailCircle", TIMER))) {
            float
                offX = tmpVec1.x * rad,
                offY = tmpVec1.y * rad;

            LCScript.invoke("_e_trailCircle", MDL_effect, cx + offX, cy + offY, strokeScl, color1);
            if(Mathf.chanceDelta(0.15f)) {
                Fx.mineSmall.at(cx + offX, cy + offY);
            };
        };
        return tmpVec1;
    };
    // Overload
    public static Vec2 laserRandMine(
        float x, float y, float cx, float cy, float rad, float offTime, int rot, float strokeScl,
        Color color1, Color color2, float a, boolean hasLight
    ) {
        return laserRandMine(x, y, cx, cy, rad, offTime, rot, strokeScl, color1, color2, a, hasLight, shapeLay);
    };
    public static Vec2 laserRandMine(
        float x, float y, float cx, float cy, float rad, float offTime, int rot, float strokeScl,
        Color color1, Color color2, float a
    ) {
        return laserRandMine(x, y, cx, cy, rad, offTime, rot, strokeScl, color1, color2, a, false);
    };
    public static Vec2 laserRandMine(
        float x, float y, float cx, float cy, float rad, float offTime, int rot, float strokeScl,
        Color color1, Color color2
    ) {
        return laserRandMine(x, y, cx, cy, rad, offTime, rot, strokeScl, color1, color2, 1f);
    };
    public static Vec2 laserRandMine(
        float x, float y, float cx, float cy, float rad, float offTime, int rot, float strokeScl,
        Color color, float a, boolean hasLight, float z
    ) {
        return laserRandMine(x, y, cx, cy, rad, offTime, rot, strokeScl, color, Color.white, a, hasLight, z);
    };
    public static Vec2 laserRandMine(
        float x, float y, float cx, float cy, float rad, float offTime, int rot, float strokeScl,
        Color color, float a, boolean hasLight
    ) {
        return laserRandMine(x, y, cx, cy, rad, offTime, rot, strokeScl, color, Color.white, a, hasLight, shapeLay);
    };
    public static Vec2 laserRandMine(
        float x, float y, float cx, float cy, float rad, float offTime, int rot, float strokeScl,
        Color color, float a
    ) {
        return laserRandMine(x, y, cx, cy, rad, offTime, rot, strokeScl, color, Color.white, a, false);
    };
    public static Vec2 laserRandMine(
        float x, float y, float cx, float cy, float rad, float offTime, int rot, float strokeScl,
        Color color
    ) {
        return laserRandMine(x, y, cx, cy, rad, offTime, rot, strokeScl, color, Color.white, 1f);
    };


    /**
     * Draws line with moving arrows.
     */
    public static void arrowLine(float x1, float y1, float x2, float y2, float strokeScl, float scl, Color color, float a, float z) {
        float
            frac1 = Time.globalTime / scl % 100f / 100f,
            frac2 = (frac1 + 0.5f) % 1f,
            ang = Mathf.angle(x2 - x1, y2 - y1);

        LCDraw.processZ(z, LCDraw.SHAPE_Z_IND);
        Lines.stroke(strokeScl, color);
        Draw.alpha(a);
        LCDraw.line(x1, y1, x2, y2, false);
        Tmp.v1.set(x1, y1).lerp(x2, y2, frac1);
        LCDraw.processScl(strokeScl * Interp.pow2Out.apply(1f - frac1));
        Draw.rect(arrowReg, Tmp.v1.x, Tmp.v1.y, ang);
        LCDraw.processScl(1f);
        Tmp.v1.set(x1, y1).lerp(x2, y2, frac2);
        LCDraw.processScl(strokeScl * Interp.pow2Out.apply(1f - frac2));
        Draw.rect(arrowReg, Tmp.v1.x, Tmp.v1.y, ang);
        LCDraw.processScl(1f);
        Draw.reset();
        LCDraw.processZ(-1f, LCDraw.SHAPE_Z_IND);
    };
    // Overload
    public static void arrowLine(float x1, float y1, float x2, float y2, float strokeScl, float scl, Color color, float a) {
        arrowLine(x1, y1, x2, y2, strokeScl, scl, color, a, shapeLay);
    };
    public static void arrowLine(float x1, float y1, float x2, float y2, float strokeScl, float scl, Color color) {
        arrowLine(x1, y1, x2, y2, strokeScl, scl, color, 1f);
    };
    public static void arrowLine(float x1, float y1, float x2, float y2, float strokeScl, float scl) {
        arrowLine(x1, y1, x2, y2, strokeScl, scl, Pal.accent);
    };


    /**
     * Draws wire that connects two positions.
     */
    public static void wire(float x1, float y1, float x2, float y2, String wireMat, float strokeScl, float glowA, float z) {
        TextureRegion wireReg = wireMatRegMap.get(wireMat);
        TextureRegion wireEndReg = wireMatEndRegMap.get(wireMat);
        if(wireReg == null || wireEndReg == null) return;

        float
            ang = Mathf.angle(x2 - x1, y2 - y1),
            dx = Mathf.cosDeg(ang) * Draw.scl * 4f * strokeScl,
            dy = Mathf.sinDeg(ang) * Draw.scl * 4f * strokeScl;

        LCDraw.processZ(z, LCDraw.NORMAL_REGION_Z_IND);
        Draw.color(Color.white, 1f);
        Draw.rect(wireEndReg, x1, y1, wireEndReg.width * wireEndReg.scl() * 0.5f * strokeScl, wireEndReg.height * wireEndReg.scl() * 0.5f * strokeScl, ang + 180f);
        Draw.rect(wireEndReg, x2, y2, wireEndReg.width * wireEndReg.scl() * 0.5f * strokeScl, wireEndReg.height * wireEndReg.scl() * 0.5f * strokeScl, ang);
        Lines.stroke(6f * strokeScl);
        Lines.line(wireReg, x1 + dx, y1 + dy, x2 - dx, y2 - dy, false);
        LCDraw.processZ(-1f, LCDraw.NORMAL_REGION_Z_IND);
        LCDraw.processZ(Layer.block + 0.1f, LCDraw.SHADOW_REGION_Z_IND);
        Lines.stroke(20f * strokeScl);
        Draw.alpha(0.3f);
        Lines.line(wireShaReg, x1 + dx, y1 + dy, x2 - dx, y2 - dy, false);
        LCDraw.processZ(-1f, LCDraw.SHADOW_REGION_Z_IND);
        LCDraw.processZ(Layer.block + 0.11f, LCDraw.GLOW_REGION_Z_IND);
        Lines.stroke(8f * strokeScl);
        Draw.alpha(glowA * (0.4f + Mathf.absin(15f, 0.6f)) * 0.25f);
        Draw.blend(Blending.additive);
        Lines.line(wireGlowReg, x1 + dx, y1 + dy, x2 - dx, y2 - dy, false);
        Draw.blend();
        Draw.reset();
        LCDraw.processZ(-1f, LCDraw.GLOW_REGION_Z_IND);
    };
    // Overload
    public static void wire(float x1, float y1, float x2, float y2, String wireMat, float strokeScl, float glowA) {
        wire(x1, y1, x2, y2, wireMat, strokeScl, glowA, Layer.power);
    };
    public static void wire(float x1, float y1, float x2, float y2, String wireMat, float strokeScl) {
        wire(x1, y1, x2, y2, wireMat, strokeScl, 1f);
    };
    public static void wire(float x1, float y1, float x2, float y2, String wireMat) {
        wire(x1, y1, x2, y2, wireMat, 1f);
    };


    /* <-------------------- rectangle --------------------> */


    /**
     * Draws outlined rectangle.
     */
    public static void rect(float x, float y, float r, float size, boolean isDashed, Color color, float a, float z) {
        LCDraw.processZ(z, LCDraw.SHAPE_Z_IND);
        Lines.stroke(3f, Tmp.c1.set(Pal.gray).a(a));
        LCDraw.rect(x, y, r, size, isDashed);
        Lines.stroke(1f, color);
        Draw.alpha(a);
        LCDraw.rect(x, y, r, size, isDashed);
        Draw.reset();
        LCDraw.processZ(-1f, LCDraw.SHAPE_Z_IND);
    };
    // Overload
    public static void rect(float x, float y, float r, float size, boolean isDashed, Color color, float a) {
        rect(x, y, r, size, isDashed, color, a, shapeLay);
    };
    public static void rect(float x, float y, float r, float size, boolean isDashed, Color color) {
        rect(x, y, r, size, isDashed, color, 1f);
    };
    public static void rect(float x, float y, float r, float size, boolean isDashed) {
        rect(x, y, r, size, isDashed, Pal.accent);
    };
    public static void rect(float x, float y, float r, float size) {
        rect(x, y, r, size, false);
    };


    /**
     * Variant of {@link #rect} for block placement.
     */
    public static void rectPlace(Block blk, int tx, int ty, float r, boolean isDashed, Color color) {
        rect(LCPos.toFCoord(tx, blk.size), LCPos.toFCoord(ty, blk.size), r, blk.size, isDashed, color);
    };


    /**
     * Variant of {@link #rectPlace} for rotated range.
     */
    public static void rectPlaceRot(Block blk, int tx, int ty, float r, int rot, boolean isDashed, Color color) {
        Vec2 vec = LCPos.getCoordsRectRotCenter(tmpVec1, LCPos.toFCoord(tx, blk.size), LCPos.toFCoord(ty, blk.size), r, rot, blk.size);
        rect(vec.x, vec.y, r, 0, isDashed, color);
    };


    /**
     * Variant of {@link #rect} for building selection.
     */
    public static void rectSelect(Building b, float r, boolean isDashed, Color color) {
        rect(b.x, b.y, r, b.block.size, isDashed, color);
    };


    /**
     * Variant of {@link #rectSelect} for rotated range.
     */
    public static void rectSelectRot(Building b, float r, int rot, boolean isDashed, Color color) {
        rectPlaceRot(b.block, b.tileX(), b.tileY(), r, rot, isDashed, color);
    };


    /**
     * Draws filled square.
     */
    public static void area(float x, float y, float size, Color color, float a, float z) {
        LCDraw.processZ(z, LCDraw.SHAPE_Z_IND);
        Draw.color(color, a * 0.7f);
        LCDraw.area(x, y, size);
        Draw.color();
        LCDraw.processZ(-1f, LCDraw.SHAPE_Z_IND);
    };
    // Overload
    public static void area(float x, float y, float size, Color color, float a) {
        area(x, y, size, color, a, shapeLay);
    };
    public static void area(float x, float y, float size, Color color) {
        area(x, y, size, color, 1f);
    };
    public static void area(float x, float y, float size) {
        area(x, y, size, Pal.accent);
    };
    public static void area(float x, float y) {
        area(x, y, 1f);
    };


    /**
     * Variant of {@link #area} for tile indication.
     */
    public static void areaShrink(@Nullable Tile t, int size, Color color, float a, float z) {
        if(t == null) return;

        float off = size % 2 == 0 ? 4f : 0f;
        area(t.worldx() + off, t.worldy() + off, (0.75f + Mathf.sin(Time.globalTime * 0.065f) * 0.2f * size), color, a, z);
    };
    // Overload
    public static void areaShrink(@Nullable Tile t, int size, Color color, float a) {
        areaShrink(t, size, color, a, shapeLay);
    };
    public static void areaShrink(@Nullable Tile t, int size, Color color) {
        areaShrink(t, size, color, 1f);
    };
    public static void areaShrink(@Nullable Tile t, int size) {
        areaShrink(t, size, Pal.accent);
    };
    public static void areaShrink(@Nullable Tile t) {
        areaShrink(t, 1);
    };


    /**
     * Variant of {@link #area} for building indication.
     */
    public static void areaBuild(Building b, float pad, Color color, float a, float z) {
        LCDraw.processZ(z, LCDraw.SHAPE_Z_IND);
        Draw.color(color, a * 0.5f);
        LCDraw.area(b.x, b.y, b.block.size - pad * 2f / Vars.tilesize);
        Draw.color();
        LCDraw.processZ(-1f, LCDraw.SHAPE_Z_IND);
    };
    // Overload
    public static void areaBuild(Building b, float pad, Color color, float a) {
        areaBuild(b, pad, color, a, shapeLay);
    };
    public static void areaBuild(Building b, float pad, Color color) {
        areaBuild(b, pad, color, 1f);
    };
    public static void areaBuild(Building b, float pad) {
        areaBuild(b, pad, Pal.accent);
    };
    public static void areaBuild(Building b) {
        areaBuild(b, 0f);
    };


    private static float[] pulseRectRads = new float[2];


    /**
     * Draws hollow squares that expand and disappear.
     */
    public static void pulseRect(float x, float y, float rad, float scl, Color color, float a, float z) {
        if(rad < 0.0001f) return;

        float
            stroke_f = rad * 0.25f,
            stroke_t = 0.2f,
            frac1 = 1f - (Time.globalTime / scl / 150f) % 1f,
            frac2 = (frac1 + 0.5f) % 1f;

        pulseRectRads[0] = Math.min(1f + Mathf.pow(1f - frac1, 0.5f) * rad, rad);
        pulseRectRads[1] = Math.min(1f + Mathf.pow(1f - frac2, 0.5f) * rad, rad);
        LCDraw.processZ(z, LCDraw.SHAPE_Z_IND);
        Draw.color(color, a * 0.7f);
        float rad_i;
        for(int i = 0; i < 2; i++) {
            rad_i = pulseRectRads[i];
            Lines.stroke(Mathf.lerp(stroke_f, stroke_t, rad_i / rad));
            Lines.line(x - rad_i, y - rad_i, x + rad_i, y - rad_i);
            Lines.line(x + rad_i, y - rad_i, x + rad_i, y + rad_i);
            Lines.line(x + rad_i, y + rad_i, x - rad_i, y + rad_i);
            Lines.line(x - rad_i, y + rad_i, x - rad_i, y - rad_i);
        };
        Draw.reset();
        LCDraw.processZ(-1f, LCDraw.SHAPE_Z_IND);
    };
    // Overload
    public static void pulseRect(float x, float y, float rad, float scl, Color color, float a) {
        pulseRect(x, y, rad, scl, color, a, shapeLay);
    };
    public static void pulseRect(float x, float y, float rad, float scl, Color color) {
        pulseRect(x, y, rad, scl, color, 1f);
    };
    public static void pulseRect(float x, float y, float rad, float scl) {
        pulseRect(x, y, rad, scl, Pal.accent);
    };
    public static void pulseRect(float x, float y, float rad) {
        pulseRect(x, y, rad, 1f);
    };


    /* <-------------------- circle --------------------> */


    /**
     * Draws outlined circle.
     */
    public static void circle(float x, float y, float rad, boolean isDashed, Color color, float a, float z) {
        if(rad < 0.0001f) return;

        LCDraw.processZ(z, LCDraw.SHAPE_Z_IND);
        Lines.stroke(3f, Tmp.c1.set(Pal.gray).a(a));
        LCDraw.circle(x, y, rad, isDashed);
        Lines.stroke(1f, color);
        Draw.alpha(a);
        LCDraw.circle(x, y, rad, isDashed);
        Draw.reset();
        LCDraw.processZ(-1f, LCDraw.SHAPE_Z_IND);
    };
    // Overload
    public static void circle(float x, float y, float rad, boolean isDashed, Color color, float a) {
        circle(x, y, rad, isDashed, color, a, shapeLay);
    };
    public static void circle(float x, float y, float rad, boolean isDashed, Color color) {
        circle(x, y, rad, isDashed, color, 1f);
    };
    public static void circle(float x, float y, float rad, boolean isDashed) {
        circle(x, y, rad, isDashed, Pal.accent);
    };
    public static void circle(float x, float y, float rad) {
        circle(x, y, rad, false);
    };


    /**
     * Variant of {@link #circle} for block placement.
     */
    public static void circlePlace(Block blk, int tx, int ty, float rad, boolean isDashed, Color color) {
        circle(LCPos.toFCoord(tx, blk.size), LCPos.toFCoord(ty, blk.size), rad, isDashed, color);
    };


    /**
     * Variant of {@link #circle} for building selection.
     */
    public static void circleSelect(Building b, float rad, boolean isDashed, Color color) {
        circle(b.x, b.y, rad, isDashed, color);
    };


    /**
     * Draws expanding disk.
     */
    public static void diskExpand(float x, float y, float rad, float scl, Color color, float a, float z) {
        if(rad < 0.0001f) return;

        float frac = Time.globalTime % (90f * scl) / (90f * scl);
        LCDraw.processZ(z, LCDraw.SHAPE_Z_IND);
        Draw.color(color, Mathf.lerp(a, 0f, frac));
        LCDraw.disk(x, y, Mathf.lerp(0f, rad, frac));
        Draw.color();
        LCDraw.processZ(-1f, LCDraw.SHAPE_Z_IND);
    };
    // Overload
    public static void diskExpand(float x, float y, float rad, float scl, Color color, float a) {
        diskExpand(x, y, rad, scl, color, a, shapeLay);
    };
    public static void diskExpand(float x, float y, float rad, float scl, Color color) {
        diskExpand(x, y, rad, scl, color, 1f);
    };
    public static void diskExpand(float x, float y, float rad, float scl) {
        diskExpand(x, y, rad, scl, Pal.accent);
    };
    public static void diskExpand(float x, float y, float rad) {
        diskExpand(x, y, rad, 1f);
    };


    /**
     * Draws disk that fades in and out.
     * Usually used to indicate explosion radius.
     */
    public static void diskWarning(float x, float y, float rad, float scl, Color color, float a, float z) {
        if(rad < 0.0001f) return;

        LCDraw.processZ(z, LCDraw.SHAPE_Z_IND);
        Draw.color(color, a * (0.15f + Mathf.sin(Time.globalTime / scl / 15f) * 0.15f));
        LCDraw.disk(x, y, rad);
        Draw.color();
        LCDraw.processZ(-1f, LCDraw.SHAPE_Z_IND);
    };
    // Overload
    public static void diskWarning(float x, float y, float rad, float scl, Color color, float a) {
        diskWarning(x, y, rad, scl, color, a, shapeLay);
    };
    public static void diskWarning(float x, float y, float rad, float scl, Color color) {
        diskWarning(x, y, rad, scl, color, 1f);
    };
    public static void diskWarning(float x, float y, float rad, float scl) {
        diskWarning(x, y, rad, scl, Pal.remove);
    };
    public static void diskWarning(float x, float y, float rad) {
        diskWarning(x, y, rad, 1f);
    };


    private static float[] pulseCircleRads = new float[4];


    /**
     * Draws circles that expand and disappear.
     */
    public static void pulseCircle(float x, float y, float rad, float scl, Color color, float a, float z) {
        if(rad < 0.0001f) return;

        float
            stroke_f = rad * 0.1f,
            stroke_t = 0.2f,
            frac1 = 1f - (Time.globalTime / scl / 150f) % 1f,
            frac2 = (frac1 + 0.25f) % 1f,
            frac3 = (frac2 + 0.25f) % 1f,
            frac4 = (frac3 + 0.25f) % 1f;

        pulseCircleRads[0] = Math.min(1f + (1f - frac1) * rad, rad);
        pulseCircleRads[1] = Math.min(1f + (1f - frac2) * rad, rad);
        pulseCircleRads[2] = Math.min(1f + (1f - frac3) * rad, rad);
        pulseCircleRads[3] = Math.min(1f + (1f - frac4) * rad, rad);
        LCDraw.processZ(z, LCDraw.SHAPE_Z_IND);
        Draw.color(color, a * 0.3f);
        float rad_i;
        for(int i = 0; i < 4; i++) {
            rad_i = pulseCircleRads[i];
            Lines.stroke(Mathf.lerp(stroke_f, stroke_t, rad_i / rad));
            Lines.circle(x, y, rad_i);
        };
        Draw.reset();
        LCDraw.processZ(-1f, LCDraw.SHAPE_Z_IND);
    };
    // Overload
    public static void pulseCircle(float x, float y, float rad, float scl, Color color, float a) {
        pulseCircle(x, y, rad, scl, color, a, shapeLay);
    };
    public static void pulseCircle(float x, float y, float rad, float scl, Color color) {
        pulseCircle(x, y, rad, scl, color, 1f);
    };
    public static void pulseCircle(float x, float y, float rad, float scl) {
        pulseCircle(x, y, rad, scl, Pal.accent);
    };
    public static void pulseCircle(float x, float y, float rad) {
        pulseCircle(x, y, rad, 1f);
    };


    /* <-------------------- connector --------------------> */


    /**
     * Draws connector with dashed rectangles and a dashed line.
     */
    public static void connectorRect(@Nullable Building b, @Nullable Building ob) {
        if(b == null || ob == null) return;

        rectSelect(b, 0, true, Pal.accent);
        rectSelect(ob, 0, true, Pal.accent);
        line(b.x, b.y, ob.x, ob.y, true);
    };


    /**
     * Draws connector with filled squares and a flickering line.
     */
    public static void connectorArea(@Nullable Building b, @Nullable Building ob) {
        if(b == null || ob == null) return;

        areaBuild(b);
        areaBuild(ob);
        lineFlick(b.x, b.y, ob.x, ob.y);
    };


    /**
     * Vanilla mass driver connector.
     */
    public static void connectorCircleArrow(@Nullable Building b, @Nullable Building b_f, @Nullable Building b_t, @Nullable Building[] bs_f, @Nullable Building[] bs_t) {
        if(b == null) return;

        float
            param = Mathf.absin(Time.globalTime, 6f, 1f),
            param1 = b.block.size == 1 ? 1f : b.block.size * 0.5f + 1f,
            param2;

        Drawf.circles(b.x, b.y, param1 * Vars.tilesize + param - 2f, Pal.accent);
        if(b_f != null) {
            Drawf.circles(b_f.x, b_f.y, param1 * Vars.tilesize + param - 2f, Pal.place);
            Drawf.arrow(b_f.x, b_f.y, b.x, b.y, b.block.size * Vars.tilesize + param, param + 4f, Pal.place);
        };
        if(b_t != null) {
            param2 = b_t.block.size == 1 ? 1f : b_t.block.size * 0.5f + 1f;
            Drawf.circles(b_t.x, b_t.y, param2 * Vars.tilesize + param - 2f, Pal.place);
            Drawf.arrow(b.x, b.y, b_t.x, b_t.y, b.block.size * Vars.tilesize + param, param + 4f, Pal.accent);
        };
        if(bs_f != null) {
            for(Building ob : bs_f) {
                Drawf.circles(ob.x, ob.y, param1 * Vars.tilesize + param - 2f, Pal.place);
                Drawf.arrow(ob.x, ob.y, b.x, b.y, b.block.size * Vars.tilesize + param, param + 4f, Pal.place);
            };
        };
        if(bs_t != null) {
            for(Building ob : bs_t) {
                param2 = ob.block.size == 1 ? 1f : ob.block.size * 0.5f + 1f;
                Drawf.circles(ob.x, ob.y, param2 * Vars.tilesize + param - 2f, Pal.place);
                Drawf.arrow(b.x, b.y, ob.x, ob.y, b.block.size * Vars.tilesize + param, param + 4f, Pal.accent);
            };
        };
    };
    // Overload
    public static void connectorCircleArrow(@Nullable Building b, @Nullable Building b_f, @Nullable Building b_t) {
        connectorCircleArrow(b, b_f, b_t, null, null);
    };


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
     * Variant of {@link #fade} where progress is controlled by <code>prog</code> instead of <code>Time.time</code>.
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
     * Variant of {@link #fade} where the region becomes opaque when <code>frac</code> approaches 1.0.
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
     * Variant of {@link #frame} with frame fading transition.
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


    /* <-------------------- progress --------------------> */


    /**
     * Draws regular progress bar.
     */
    public static void progressBar(float x, float y, float frac, float size, Color color, float a, float offW, float offTy, float z) {
        float
            w = (size + 1f) * Vars.tilesize + offW,
            offY = (offTy + size * 0.5f + 0.5f) * Vars.tilesize;

        LCDraw.processZ(z, LCDraw.UI_REGION_Z_IND);
        Lines.stroke(5f, Tmp.c1.set(Pal.gray).a(a * 0.7f));
        Lines.line(x - w * 0.5f, y + offY, x + w * 0.5f, y + offY);
        Lines.stroke(3f, color);
        Draw.alpha(a * 0.2f);
        Lines.line(x - w * 0.5f, y + offY, x + w * 0.5f, y + offY);
        Draw.alpha(a * 0.7f);
        Lines.line(x - w * 0.5f, y + offY, Mathf.lerp(x - w * 0.5f, x + w * 0.5f, Mathf.clamp(frac)), y + offY);
        Draw.reset();
        LCDraw.processZ(-1f, LCDraw.UI_REGION_Z_IND);
    };
    // Overload
    public static void progressBar(float x, float y, float frac, float size, Color color, float a, float offW, float offTy) {
        progressBar(x, y, frac, size, color, a, offW, offTy, shapeLay);
    };
    public static void progressBar(float x, float y, float frac, float size, Color color, float a, float offW) {
        progressBar(x, y, frac, size, color, a, offW, 0f);
    };
    public static void progressBar(float x, float y, float frac, float size, Color color, float a) {
        progressBar(x, y, frac, size, color, a, 0f);
    };
    public static void progressBar(float x, float y, float frac, float size, Color color) {
        progressBar(x, y, frac, size, color, 1f);
    };
    public static void progressBar(float x, float y, float frac, float size) {
        progressBar(x, y, frac, size, Pal.accent);
    };
    public static void progressBar(float x, float y, float frac) {
        progressBar(x, y, frac, 1f);
    };


    /**
     * Draws regular progress ring.
     */
    public static void progressRing(float x, float y, float frac, boolean rev, float stroke, float rad, float ang, Color color, float a, float z) {
        LCDraw.processZ(z, LCDraw.UI_REGION_Z_IND);
        Lines.stroke(stroke, Tmp.c1.set(Pal.gray).a(a * 0.7f));
        Lines.circle(x, y, rad);
        Lines.stroke(stroke * 0.6f, color);
        Draw.alpha(a * 0.2f);
        Lines.circle(x, y, rad);
        Draw.color(color, a * 0.7f);
        LCDraw.ring(x, y, rad - stroke * 0.3f, rad + stroke * 0.3f, ang, frac, rev);
        Draw.reset();
        LCDraw.processZ(-1f, LCDraw.UI_REGION_Z_IND);
    };
    // Overload
    public static void progressRing(float x, float y, float frac, boolean rev, float stroke, float rad, float ang, Color color, float a) {
        progressRing(x, y, frac, rev, stroke, rad, ang, color, a, shapeLay);
    };
    public static void progressRing(float x, float y, float frac, boolean rev, float stroke, float rad, float ang, Color color) {
        progressRing(x, y, frac, rev, stroke, rad, ang, color, 1f);
    };
    public static void progressRing(float x, float y, float frac, boolean rev, float stroke, float rad, float ang) {
        progressRing(x, y, frac, rev, stroke, rad, ang, Pal.accent);
    };
    public static void progressRing(float x, float y, float frac, boolean rev, float stroke, float rad) {
        progressRing(x, y, frac, rev, stroke, rad, 0f);
    };


    /* <-------------------- text --------------------> */


    /**
     * Draws text for block placement.
     */
    public static void textPlace(Block blk, int tx, int ty, String str, boolean valid, float offTy) {
        blk.drawPlaceText(str, tx + (int)(blk.offset / Vars.tilesize), ty + (int)(blk.offset / Vars.tilesize + offTy), valid);
    };
    // Overload
    public static void textPlace(Block blk, int tx, int ty, String str, boolean valid) {
        textPlace(blk, tx, ty, str, valid, 0f);
    };
    public static void textPlace(Block blk, int tx, int ty, String str) {
        textPlace(blk, tx, ty, str, true);
    };


    /**
     * Draws text for building selection.
     */
    public static void textSelect(Building b, String str, boolean valid, float offTy) {
        b.block.drawPlaceText(str, (int)(b.x / Vars.tilesize), (int)(b.y / Vars.tilesize + offTy), valid);
    };
    // Overload
    public static void textSelect(Building b, String str, boolean valid) {
        textSelect(b, str, valid, 0f);
    };
    public static void textSelect(Building b, String str) {
        textSelect(b, str, true);
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
     * Shows ring UI for stackable status effects on a unit.
     */
    public static void stackStatus(Unit unit) {
        NativeArray tmpArr = LCScript.ensureArray("LCDrawf.stackStatus.tmpArr");
        LCScript.invoke("_stackStas", MDL_entity, tmpArr, unit);

        int i = 0;
        long iCap = tmpArr.getLength();
        StatusEffect sta;
        float x_i;
        float y = unit.y - unit.hitSize * 0.5f - 8f;
        float w = 4f * iCap;
        while(i < iCap) {
            sta = (StatusEffect)(tmpArr.get(i));
            x_i = iCap == 1 ? unit.x : (unit.x - w * (0.5f - (float)(i) / (iCap - 1)));
            progressRing(
                x_i, y,
                Mathf.clamp(1f - unit.getDuration(sta) / LCScript.toFloat(LCScript.instanceGet(sta, "burstTime")))   ,
                true, 2.25f, 2.75f, 90f, Color.white
            );
            Draw.rect(sta.fullIcon, x_i, y, 4f, 4f);
            i++;
        };
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
     * Variant of {@link #plan} for block placement.
     */
    public static void planPlace(Block blk, @Nullable Tile t, float ang) {
        if(t == null) return;
        Color color = t.getLinkedTilesAs(blk, tmpTsSeq).find(ot -> ot.solid() || ot.build != null) == null ? Color.white : Pal.remove;
        plan(LCPos.toFCoord(t.x, blk.size), LCPos.toFCoord(t.y, blk.size), LCTexture.getBlockRegion(blk), ang, 1f, color);
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


    /* <-------------------- very specific --------------------> */


    public static void baseBlockDrawPlace(Block blk, int tx, int ty, int rot, boolean valid) {
        blk.drawPotentialLinks(tx, ty);
        blk.drawOverlay(LCPos.toFCoord(tx, blk.size), LCPos.toFCoord(ty, blk.size), rot);
    };


    public static void baseBuildingDraw(Building b) {
        if (b.block.variants == 0 || b.block.variantRegions == null) {
            Draw.rect(b.block.region, b.x, b.y, b.drawrot());
        } else {
            Draw.rect(b.block.variantRegions[Mathf.randomSeed(b.tile.pos(), 0, Math.max(b.block.variantRegions.length - 1, 0))], b.x, b.y, b.drawrot());
        };
    };


};
