package lovec.graphics.drawer.multiblock;

import arc.math.Mathf;
import arc.math.geom.Vec2;
import arc.util.Tmp;
import lovec.graphics.drawer.LCDrawer;
import lovec.type.block.factory.MultiBlockLinkCenterBlockFrag;
import mindustry.world.Block;

public abstract class LCDrawMultiBlock extends LCDrawer {


    public boolean isSymmetric = false;

    protected boolean evenWidth = false;
    protected boolean evenHeight = false;
    protected float[] multiBlockCenterOff = new float[2];


    @Override
    public void load(Block blk) {
        super.load(blk);
        if(blk instanceof MultiBlockLinkCenterBlockFrag mblk) {
            mblk.calcMaxSize(Tmp.p1, blk.size, 0);
            evenWidth = Mathf.mod(Tmp.p1.x, 2) == 0;
            evenHeight = Mathf.mod(Tmp.p1.y, 2) == 0;
            if(blk.size % 2 == 0) {
                evenWidth = !evenWidth;
                evenHeight = !evenHeight;
            };
            mblk.calcCenterOff(Tmp.v1, blk.size);
            multiBlockCenterOff[0] = Tmp.v1.x;
            multiBlockCenterOff[1] = Tmp.v1.y;
        };
    };

    @Override
    public float calcAng(int rot) {
        return !isSymmetric ?
            super.calcAng(rot) :
            (!rotate || (rot % 2 == 0)) ? 0f : 90f;
    };


    public Vec2 calcMultiBlockOff(Vec2 out, int rot) {
        return calcEvenOff(out, rot).add(calcRotatedOff(Tmp.v3, rot));
    };


    public Vec2 calcCenterOff(Vec2 out, int rot) {
        out.set(multiBlockCenterOff[0], multiBlockCenterOff[1]);
        out.rotate(calcAng(rot));
        return out;
    };


    @Override
    public float calcRotatedOff(int rot, boolean isY) {
        if(!rotate || !isSymmetric) return super.calcRotatedOff(rot, isY);

        if(spread < 0f) {
            return rot % 2 == 0 ?
                (!isY ? offX : offY) :
                (!isY ? -offY : offX);
        };

        float offX_fi = offX + Mathf.range(spread);
        float offY_fi = offY + Mathf.range(spread);
        return rot % 2 == 0 ?
            (!isY ? offX_fi : offY_fi) :
            (!isY ? -offY_fi : offX_fi);
    };


    public float calcEvenOff(int rot, boolean isY) {
        return switch(rot) {
            case 2 -> !isY ? (!evenWidth ? 0f : -8f) : (!evenHeight ? 0f : 8f);
            case 3 -> !isY ? (!evenHeight ? 0f : 8f) : (!evenWidth ? 0f : -8f);
            default -> 0f;
        };
    };
    // Overload
    public Vec2 calcEvenOff(Vec2 out, int rot) {
        return out.set(calcEvenOff(rot, false), calcEvenOff(rot, true));
    };


};
