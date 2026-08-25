package lovec.graphics;

import arc.graphics.g2d.Draw;
import arc.graphics.g2d.Fill;
import arc.graphics.g2d.Lines;
import arc.graphics.g2d.TextureRegion;
import arc.math.Angles;
import arc.math.Interp;
import arc.math.Mathf;
import arc.math.geom.Position;
import arc.util.Tmp;
import lovec.utils.LCPos;
import lovec.utils.LCScript;
import mindustry.Vars;
import mindustry.ctype.UnlockableContent;
import mindustry.entities.Effect;
import mindustry.gen.Building;
import mindustry.gen.Unit;
import mindustry.graphics.Drawf;
import mindustry.graphics.Layer;
import mindustry.type.UnitType;
import mindustry.ui.Fonts;
import mindustry.world.Block;
import rhino.NativeArray;

public class LCFx {


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
            NativeArray arr = LCScript.toArray(eff.data);
            Building b = (Building) arr.get(0);
            float pad = LCScript.toFloat(arr.get(1));
            boolean rev = LCScript.toBoolean(arr.get(2));
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
            boolean isClogging = LCScript.toBoolean(eff.data);
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

            LCDraw.region(eff.x, eff.y, reg, 0f, 1f, eff.color, eff.fout() * eff.color.a);
        })
        .layer(136.13f),


        fadeText = new Effect(80f, eff -> {
            Tmp.c1.set(eff.color).a(1f - Interp.pow2In.apply(eff.fin()));
            LCDraw.text(eff.x, eff.y + 2f * eff.fin(), (String) eff.data, Fonts.outline, 0.85f, Tmp.c1);
        }),


        flashBuild = new Effect(20f, eff -> {
            NativeArray arr = LCScript.toArray(eff.data);
            TextureRegion reg = (TextureRegion) arr.get(0);
            Building b = (Building) arr.get(1);
            float rotSpd = LCScript.toFloat(arr.get(2));

            LCDraw.regionMixcol(b.x, b.y, reg, b.drawrot() + eff.rotation + eff.lifetime * eff.fin() * rotSpd, 1f, eff.color, eff.color.a * eff.fout(), 1f);
        })
        .layer(136.13f),


        laser = new Effect(30f, eff -> {
            NativeArray arr = LCScript.toArray(eff.data);
            Position e_f = (Position) arr.get(0);
            Position e_t = (Position) arr.get(1);
            boolean hasLight = LCScript.toBoolean(arr.get(2));

            LCDrawf.laser(
                e_f == null ? eff.x : e_f.getX(),
                e_f == null ? eff.y : e_f.getY(),
                e_t.getX(), e_t.getY(),
                eff.rotation * Interp.pow2Out.apply(eff.fout()),
                eff.color, 1f, hasLight
            );
        }),


        line = new Effect(40f, eff -> {
            NativeArray arr = LCScript.toArray(eff.data);
            Position e_f = (Position) arr.get(0);
            Position e_t = (Position) arr.get(1);
            boolean shouldDrawSpike = LCScript.toBoolean(arr.get(2));
            boolean shouldInvertSpike = LCScript.toBoolean(arr.get(3));

            Lines.stroke(2f * eff.rotation * eff.fout(shouldDrawSpike ? Interp.pow10Out : Interp.linear), eff.color);
            Draw.alpha(eff.color.a);
            if(shouldDrawSpike) {
                LCPos.forEachLinePoint(
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
            NativeArray arr = LCScript.toArray(eff.data);
            float x = LCScript.toFloat(arr.get(0));
            float y = LCScript.toFloat(arr.get(1));
            UnlockableContent ct = (UnlockableContent) arr.get(2);
            boolean isOut = LCScript.toBoolean(arr.get(3));

            Tmp.v1.set(eff.x, eff.y).lerp(Tmp.v2.set(x, y), eff.fin(isOut ? Interp.pow5In : Interp.linear));
            LCDraw.processScl((isOut ? eff.fin() : eff.fout(Interp.pow3Out)) * 1.05f);
            if(ct instanceof Block blk) {
                Drawf.squareShadow(Tmp.v1.x, Tmp.v1.y, blk.size * Vars.tilesize * 1.85f, 1f);
                Draw.rect(blk.fullIcon, Tmp.v1.x, Tmp.v1.y, 0f);
            } else if(ct instanceof UnitType utp) {
                utp.drawSoftShadow(Tmp.v1.x, Tmp.v1.y, eff.rotation - 90f, 1f);
                Drawf.shadow(Tmp.v1.x, Tmp.v1.y, 18f, 1f);
                Draw.rect(utp.fullIcon, Tmp.v1.x, Tmp.v1.y, eff.rotation - 90f);
            };
            LCDraw.processScl(-1f);
        })
        .layer(Layer.flyingUnitLow - 5f),


        pointLaserLine = new Effect(30f, 300f, eff -> {
            Position e = (Position) eff.data;

            Draw.color(eff.color, eff.fout());
            Lines.stroke(2f);
            Lines.line(eff.x, eff.y, e.getX(), e.getY());
            Drawf.light(eff.x, eff.y, e.getX(), e.getY(), 20f, eff.color, 0.65f * eff.fout());
            Draw.reset();
        }),


        pointLaserEnd = new Effect(30f, eff -> {
            Position e = (Position) eff.data;

            Draw.color(eff.color, eff.fout());
            Fill.circle(e == null ? eff.x : e.getX(), e == null ? eff.y : e.getY(), 2f + eff.fout());
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
