package lovec.content.frag;

import arc.graphics.g2d.Draw;
import arc.graphics.g2d.TextureRegion;
import arc.math.Mathf;
import lovec.content.ContentFrag;
import lovec.graphics.LCDraw;
import lovec.utils.LCScript;
import mindustry.graphics.Layer;
import mindustry.world.blocks.defense.Wall;

public class BLKFragCogwheel implements ContentFrag<Wall, BLKFragCogwheel> {


    Wall lastThis;


    public Wall getThis() {
        return lastThis;
    };


    public BLKFragCogwheel setThis(Wall thisVal) {
        lastThis = thisVal;
        return this;
    };




    public static class BFragCogwheel implements ContentFrag<Wall.WallBuild, BFragCogwheel> {


        Wall.WallBuild lastThis;


        public Wall.WallBuild getThis() {
            return lastThis;
        };


        public BFragCogwheel setThis(Wall.WallBuild thisVal) {
            lastThis = thisVal;
            return this;
        };


        public void ex_drawCog() {
            Wall.WallBuild b = getThis();

            float
                ang = Mathf.mod(LCScript.toFloat(LCScript.instanceGet(b, "torProg")), 90f),
                offAng = LCScript.toFloat(LCScript.instanceGet(b.block, "cogInvOffAng")),
                w = LCScript.toFloat(LCScript.instanceGet(b.block, "cogDrawW"));

            LCDraw.processZ(Layer.block + b.block.size * 0.001f + 0.72f, 1);
            TextureRegion reg;
            if(LCScript.toBoolean(LCScript.instanceGet(b, "isInv"))) {
                reg = (TextureRegion)(LCScript.instanceGet(b.block, "invReg"));
                Draw.rect(reg, b.x, b.y, w, w, -ang + 90f + offAng);
                Draw.alpha(1f - ang / 90f);
                Draw.rect(reg, b.x, b.y, w, w, -ang + offAng);
            } else {
                reg = b.block.region;
                Draw.rect(reg, b.x, b.y, w, w, ang);
                Draw.alpha(ang / 90f);
                Draw.rect(reg, b.x, b.y, w, w, ang - 90f);
            };
            Draw.color();
            LCDraw.processZ(-1f, 1);
        };


    };


};
