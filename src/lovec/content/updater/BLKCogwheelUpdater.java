package lovec.content.updater;

import arc.graphics.g2d.Draw;
import arc.graphics.g2d.TextureRegion;
import arc.math.Mathf;
import lovec.content.BuildUpdater;
import lovec.content.ContentUpdater;
import lovec.graphics.LCDraw;
import lovec.utils.LCScript;
import mindustry.graphics.Layer;
import mindustry.world.blocks.defense.Wall;

public class BLKCogwheelUpdater extends ContentUpdater<Wall> {


    protected float cogInvOffAng;
    protected float cogDrawW;
    protected TextureRegion invReg;


    public BLKCogwheelUpdater(Wall blk) throws NoSuchFieldException, IllegalAccessException {
        super(blk);
    };


    @Override
    protected void targetSetInit() throws NoSuchFieldException, IllegalAccessException {
        cogInvOffAng = LCScript.toFloat(get("cogInvOffAng"));
        cogDrawW = LCScript.toFloat(get("cogDrawW"));
    };


    @Override
    protected void clientLoadInit() throws NoSuchFieldException, IllegalAccessException {
        invReg = (TextureRegion) get("invReg");
    };




    public class BCogwheelUpdater extends BuildUpdater<Wall.WallBuild, Wall> {


        public BCogwheelUpdater(Wall.WallBuild b) throws NoSuchFieldException, IllegalAccessException {
            super(b);
        };


        @FragMethod
        public void ex_drawCog() throws NoSuchFieldException, IllegalAccessException {
            float ang = Mathf.mod(LCScript.toFloat(get("torProg")), 90f);

            LCDraw.processZ(Layer.block + b.block.size * 0.001f + 0.72f, 1);
            if((boolean) get("isInv")) {
                Draw.rect(invReg, b.x, b.y, cogDrawW, cogDrawW, -ang + 90f + cogInvOffAng);
                Draw.alpha(1f - ang / 90f);
                Draw.rect(invReg, b.x, b.y, cogDrawW, cogDrawW, -ang + cogInvOffAng);
            } else {
                Draw.rect(blk.region, b.x, b.y, cogDrawW, cogDrawW, ang);
                Draw.alpha(ang / 90f);
                Draw.rect(blk.region, b.x, b.y, cogDrawW, cogDrawW, ang - 90f);
            };
            Draw.color();
            LCDraw.processZ(-1f, 1);
        };


    };


};
