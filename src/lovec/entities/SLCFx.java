package lovec.entities;

import arc.graphics.g2d.Draw;
import arc.graphics.g2d.Fill;
import arc.graphics.g2d.Lines;
import arc.graphics.g2d.TextureRegion;
import arc.math.Angles;
import arc.math.Interp;
import arc.math.Mathf;
import arc.math.geom.Position;
import arc.math.geom.Vec2;
import arc.util.Nullable;
import arc.util.Tmp;
import lovec.graphics.SLCDraw;
import lovec.graphics.SLCDrawf;
import lovec.utils.SLCPos;
import lovec.utils.SLCScript;
import lovec.utils.SLCScriptUtil;
import mindustry.Vars;
import mindustry.entities.Effect;
import mindustry.gen.Building;
import mindustry.gen.Bullet;
import mindustry.gen.Unit;
import mindustry.graphics.Drawf;
import mindustry.graphics.Layer;
import mindustry.type.UnitType;
import mindustry.ui.Fonts;
import mindustry.world.Block;
import rhino.NativeArray;

import static lovec.utils.SLCScript.MDL_draw;

public class SLCFx {


    public static final Effect


        colorDust = new Effect(80f, eff -> {
            float
                frac1 = Interp.pow10Out.apply(Interp.pow10Out.apply(eff.fin())),
                frac2 = 1f - Interp.pow2In.apply(eff.fin());

            Draw.color(eff.color);
            Angles.randLenVectors(eff.id, 18, eff.finpow() * eff.rotation, (x, y) -> Fill.circle(eff.x + x * frac1, eff.y + y * frac1, frac2 * 3.5f));
            Draw.color(Tmp.c1.set(eff.color).mul(1.2f));
            Angles.randLenVectors(eff.id + 11, 14, eff.finpow() * eff.rotation * 0.9f, (x, y) -> Fill.circle(eff.x + x * frac1, eff.y + y * frac1, frac2 * 3f));
            Draw.color(Tmp.c1.set(eff.color).mul(1.35f));
            Angles.randLenVectors(eff.id + 22, 10, eff.finpow() * eff.rotation * 0.85f, (x, y) -> Fill.circle(eff.x + x * frac1, eff.y + y * frac1, frac2 * 2.5f));
        })
        .layer(14.01f),


        coreSignal = new Effect(200f, eff -> {
            NativeArray arr = SLCScript.toArray(eff.data);
            Building b = (Building) arr.get(0);
            float pad = SLCScript.toFloat(arr.get(1));
            boolean rev = SLCScript.toBoolean(arr.get(2));
            float
                ang = Mathf.angle(b.x - eff.x, b.y - eff.y),
                size = 18f - 14f * Interp.pow2Out.apply(eff.fin());

            Draw.color(eff.color, Interp.pow2In.apply(eff.fout()));
            Draw.rect(
                "lovec-efr-triangle-hollow",
                eff.x + eff.rotation * Mathf.cosDeg(ang) * eff.fin() + pad * Mathf.cosDeg(ang),
                eff.y + eff.rotation * Mathf.sinDeg(ang) * eff.fin() + pad * Mathf.sinDeg(ang),
                size, size,
                ang + 90f + 640f * eff.fin() * (rev ? -1 : 1)
            );
            Draw.color();
        }),


        corrosion = new Effect(120f, eff -> {
            boolean isClogging = SLCScript.toBoolean(eff.data);
            Draw.color(eff.color);
            if(isClogging) {
                Draw.rect(
                    "lovec-efr-glob",
                    eff.x, eff.y,
                    5f * Interp.pow5Out.apply(eff.fout()),
                    5f * Interp.pow5Out.apply(eff.fout()),
                    eff.rotation
                );
            } else {
                Fill.circle(eff.x, eff.y, 0.8f * Interp.pow5Out.apply(eff.fout()));
            };
            Draw.color();
        })
        .layer(69.13f),


        fadeRegion = new Effect(40f, eff -> {
            TextureRegion reg = (TextureRegion) eff.data;
            eff.lifetime = 40f * eff.rotation;

            SLCDraw.region(eff.x, eff.y, reg, 0f, 1f, eff.color, eff.fout() * eff.color.a);
        })
        .layer(136.13f),


        fadeText = new Effect(80f, eff -> {
            Tmp.c1.set(eff.color).a(1f - Interp.pow2In.apply(eff.fin()));
            SLCScript.invoke("text", MDL_draw, eff.x, eff.y + 2f * eff.fin(), eff.data, Fonts.outline, 0.85f, Tmp.c1);
        }),


        flashBuild = new Effect(20f, eff -> {
            NativeArray arr = SLCScript.toArray(eff.data);
            TextureRegion reg = (TextureRegion) arr.get(0);
            Building b = (Building) arr.get(1);
            float rotSpd = SLCScript.toFloat(arr.get(2));

            SLCDraw.regionMixcol(b.x, b.y, reg, b.drawrot() + eff.rotation + eff.lifetime * eff.fin() * rotSpd, 1f, eff.color, eff.color.a * eff.fout(), 1f);
        })
        .layer(136.13f),


        laser = new Effect(30f, eff -> {
            NativeArray arr = SLCScript.toArray(eff.data);
            Position e_f = (Position) arr.get(0);
            Position e_t = (Position) arr.get(1);
            boolean hasLight = SLCScript.toBoolean(arr.get(2));

            SLCDrawf.laser(
                e_f == null ? eff.x : e_f.getX(),
                e_f == null ? eff.y : e_f.getY(),
                e_t.getX(), e_t.getY(),
                eff.rotation * Interp.pow2Out.apply(eff.fout()),
                eff.color, 1f, hasLight
            );
        }),


        line = new Effect(40f, eff -> {
            NativeArray arr = SLCScript.toArray(eff.data);
            Position e_f = (Position) arr.get(0);
            Position e_t = (Position) arr.get(1);
            boolean shouldDrawSpike = SLCScript.toBoolean(arr.get(2));
            boolean shouldInvertSpike = SLCScript.toBoolean(arr.get(3));

            Lines.stroke(2f * eff.rotation * eff.fout(shouldDrawSpike ? Interp.pow10Out : Interp.linear), eff.color);
            Draw.alpha(eff.color.a);
            if(shouldDrawSpike) {
                SLCPos.eachLinePoint(
                    e_f == null ? eff.x : e_f.getX(),
                    e_f == null ? eff.y : e_f.getY(),
                    e_t.getX(), e_t.getY(),
                    (x, y, ang) -> {
                        Drawf.tri(x, y, 6f * eff.fout() * eff.rotation, 12f * eff.rotation, shouldInvertSpike ? (ang + 35f) : (ang + 145f));
                        Drawf.tri(x, y, 8f * eff.fout() * eff.rotation, 18f * eff.rotation, shouldInvertSpike ? (ang - 35f) : (ang + 215f));
                    },
                    1.5f, !shouldInvertSpike, shouldInvertSpike
                );
            };
            Lines.line(
                e_f == null ? eff.x : e_f.getX(),
                e_f == null ? eff.y : e_f.getY(),
                e_t.getX(), e_t.getY()
            );
            Draw.reset();
        }),


        payloadDeposit = new Effect(30f, eff -> {
            NativeArray arr = SLCScript.toArray(eff.data);
            float x = SLCScript.toFloat(arr.get(0));
            float y = SLCScript.toFloat(arr.get(1));
            Object ct = arr.get(2);
            boolean isOut = SLCScript.toBoolean(arr.get(3));

            Tmp.v1.set(eff.x, eff.y).lerp(Tmp.v2.set(x, y), eff.fin(isOut ? Interp.pow5In : Interp.linear));
            SLCDraw.processScl((isOut ? eff.fin() : eff.fout(Interp.pow3Out)) * 1.05f);
            if(ct instanceof Block blk) {
                Drawf.squareShadow(Tmp.v1.x, Tmp.v1.y, blk.size * Vars.tilesize * 1.85f, 1f);
                Draw.rect(blk.fullIcon, Tmp.v1.x, Tmp.v1.y, 0f);
            } else if(ct instanceof UnitType utp) {
                utp.drawSoftShadow(Tmp.v1.x, Tmp.v1.y, eff.rotation - 90f, 1f);
                Drawf.shadow(Tmp.v1.x, Tmp.v1.y, 18f, 1f);
                Draw.rect(utp.fullIcon, Tmp.v1.x, Tmp.v1.y, eff.rotation - 90f);
            };
            SLCDraw.processScl(-1f);
        })
        .layer(Layer.flyingUnitLow - 5f),



        pointLaserLine = new Effect(30f, 300f, eff -> {
            NativeArray arr = (NativeArray) eff.data;
            @Nullable Position e_f = (Position) arr.get(0);
            Position e_t = (Position) arr.get(1);
            Vec2 lastPos = (Vec2) arr.get(2);
            boolean removed = (boolean) arr.get(3);
            float x_f, y_f, x_t, y_t;
            if(removed) {
                x_t = lastPos.x;
                y_t = lastPos.y;
            } else {
                if(e_t instanceof Bullet bul) {
                    if(bul.isAdded() && !SLCPos.posAtWorldOrigin(bul)) {
                        x_t = SLCScriptUtil.getBulX(bul);
                        y_t = SLCScriptUtil.getBulY(bul);
                    } else {
                        arr.put(3, arr, true);
                        x_t = lastPos.x;
                        y_t = lastPos.y;
                    };
                } else {
                    x_t = e_t.getX();
                    y_t = e_t.getY();
                };
                lastPos.set(x_t, y_t);
            };
            if(SLCPos.posAtWorldOrigin(lastPos)) return;
            x_f = e_f == null ? eff.x : e_f.getX();
            y_f = e_f == null ? eff.y : e_f.getY();

            Draw.color(eff.color, eff.fout());
            Lines.stroke(2f);
            Lines.line(x_f, y_f, x_t, y_t);
            Drawf.light(x_f, y_f, x_t, y_t, 20f, eff.color, 0.65f * eff.fout());
            Draw.reset();
        }),


        pointLaserEnd = new Effect(30f, eff -> {
            NativeArray arr = (NativeArray) eff.data;
            @Nullable Position e = (Position) arr.get(0);
            Vec2 lastPos = (Vec2) arr.get(1);
            boolean removed = (boolean) arr.get(2);
            float x, y;
            if(removed) {
                x = lastPos.x;
                y = lastPos.y;
            } else {
                if(e == null) {
                    x = eff.x;
                    y = eff.y;
                    arr.put(2, arr, true);
                } else if (e instanceof Bullet bul) {
                    if(bul.isAdded() && !SLCPos.posAtWorldOrigin(bul)) {
                        x = SLCScriptUtil.getBulX(bul);
                        y = SLCScriptUtil.getBulY(bul);
                    } else {
                        arr.put(2, arr, true);
                        x = lastPos.x;
                        y = lastPos.y;
                    };
                } else {
                    x = e.getX();
                    y = e.getY();
                };
                lastPos.set(x, y);
            };
            if(SLCPos.posAtWorldOrigin(lastPos)) return;

            Draw.color(eff.color, eff.fout());
            Fill.circle(x, y, 2f + eff.fout());
        }),


        ripple = new Effect(30f, eff -> {
            eff.lifetime = 30f * eff.rotation * 0.25f;

            Draw.color(Tmp.c1.set(eff.color).mul(1.5f));
            Lines.stroke(eff.fout() * 1.4f);
            Lines.circle(eff.x, eff.y, eff.fin() * eff.rotation);
            Draw.reset();
        })
        .layer(Layer.debris - 0.0001f),


        trailCircle = new Effect(50f, eff -> {
            Draw.color(eff.color);
            Fill.circle(eff.x, eff.y, eff.fout() * eff.rotation);
            Draw.color();
        }),


        trailJet = new Effect(50f, eff -> {
            Unit unit = (Unit) eff.data;
            Draw.alpha(Interp.pow2In.apply(eff.fout()) * 0.08f);
            Draw.rect(
                "lovec-efr-jet-trail",
                unit.x - Mathf.cosDeg(eff.rotation + 90f) * unit.hitSize * 6f * eff.fin(),
                unit.y - Mathf.sinDeg(eff.rotation + 90f) * unit.hitSize * 6f * eff.fin(),
                unit.hitSize * (8f + eff.fin() * 8f),
                unit.hitSize * (4f + eff.fin() * 4f),
                eff.rotation
            );
            Draw.color();
        })
        .layer(116.004f);


};
