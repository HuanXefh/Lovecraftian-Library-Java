package lovec.type.block.factory;

import arc.math.geom.Point2;
import arc.struct.IntSeq;
import arc.struct.Seq;
import arc.util.Tmp;
import lovec.content.LCMultiBlockHandler;
import mindustry.Vars;
import mindustry.game.Team;
import mindustry.gen.Building;
import mindustry.world.Block;
import mindustry.world.Build;
import mindustry.world.Tile;

/**
 * <code>DEDICATION</code>: Inspired by MultiBlockLib.
 */
public interface MultiBlockLinkCenterBlockFrag {


    Seq<Point2> getLinkPoints();
    IntSeq getLinkSizes();


    default void addLink(int... linkVals) {
        for(int i = 0; i < linkVals.length; i += 3) {
            getLinkPoints().add(new Point2(linkVals[i], linkVals[i + 1]));
            getLinkSizes().add(linkVals[i + 2]);
        };
    };


    default void createLinkConstructBuilds(Tile t, int size) {
        if(Vars.state.rules.infiniteResources || t == null || t.build == null) return;

        Seq<Point2> seq1 = getLinkPoints();
        IntSeq seq2 = getLinkSizes();
        Point2 pon_i;
        Point2 ponRot_i;
        int size_i;
        Tile t_i;
        for(int i = 0; i < seq1.size; i++) {
            pon_i = seq1.get(i);
            size_i = seq2.get(i);
            ponRot_i = rotateLinkPos(Tmp.p3, pon_i, size, size_i, t.build.rotation);
            t_i = Vars.world.tile(t.x + ponRot_i.x, t.y + ponRot_i.y);
            t_i.setBlock(LCMultiBlockHandler.linkConstructBlocks[size_i - 1], t.team(), 0);
            ((MultiBlockLinkConstructBlock.MultiBlockLinkConstructBuild) t_i.build).updateLink(t);
        };
    };


    default Seq<Building> createLinkBuilds(Seq<Building> out, Building b, Block blk, Tile t, Team team, int size, int rot) {
        out.clear();
        Seq<Point2> seq1 = getLinkPoints();
        IntSeq seq2 = getLinkSizes();
        Point2 pon_i;
        Point2 ponRot_i;
        int size_i;
        Tile t_i;
        MultiBlockLinkBlock.MultiBlockLinkBuild b_i;
        for(int i = 0; i < seq1.size; i++) {
            pon_i = seq1.get(i);
            size_i = seq2.get(i);
            ponRot_i = rotateLinkPos(Tmp.p3, pon_i, size, size_i, t.build.rotation);
            t_i = Vars.world.tile(t.x + ponRot_i.x, t.y + ponRot_i.y);
            t_i.setBlock(
                (blk.outputsLiquid ? LCMultiBlockHandler.linkLiquidBlocks : LCMultiBlockHandler.linkBlocks)[size_i - 1],
                team, 0
            );
            b_i = (MultiBlockLinkBlock.MultiBlockLinkBuild) t_i.build;
            b_i.updateLink(b);
            out.add(b_i);
        };
        return out;
    };


    default Point2 rotateLinkPos(Point2 out, Point2 pon, int centerSize, int linkSize, int rot) {
        int
            centerOff = (centerSize + 1) % 2,
            linkOff = (linkSize + 1) % 2;

        return switch(rot) {
            case 1 -> out.set(-pon.y + centerOff - linkOff, pon.x);
            case 2 -> out.set(-pon.x + centerOff - linkOff, -pon.y + centerOff - linkOff);
            case 3 -> out.set(pon.y, -pon.x + centerOff - linkOff);
            default -> out.set(pon.x, pon.y);
        };
    };


    default boolean checkLink(Tile t, Team team, int size, int rot) {
        Seq<Point2> seq1 = getLinkPoints();
        IntSeq seq2 = getLinkSizes();
        Point2 pon_i;
        Point2 ponRot_i;
        int size_i;
        for(int i = 0; i < seq1.size; i++) {
            pon_i = seq1.get(i);
            size_i = seq2.get(i);
            ponRot_i = rotateLinkPos(Tmp.p3, pon_i, size, size_i, rot);
            if(!Build.validPlace(LCMultiBlockHandler.linkBlocks[size_i - 1], team, t.x + ponRot_i.x, t.y + ponRot_i.y, 0, false)) return false;
        };
        return true;
    };


    default Point2 calcMaxSize(Point2 out, int size, int rot) {
        int
            off = (size + 1) % 2,
            left = -size / 2 + off,
            right = size / 2,
            top = size / 2,
            bottom = -size / 2 + off;

        out.set(size, size);
        Seq<Point2> seq1 = getLinkPoints();
        IntSeq seq2 = getLinkSizes();
        Point2 pon_i;
        Point2 ponRot_i;
        int size_i;
        for(int i = 0; i < seq1.size; i++) {
            pon_i = seq1.get(i);
            size_i = seq2.get(i);
            ponRot_i = rotateLinkPos(Tmp.p3, pon_i, size, size_i, rot);
            left = Math.min(left, ponRot_i.x);
            right = Math.max(right, ponRot_i.x);
            top = Math.max(top, ponRot_i.y);
            bottom = Math.min(bottom, ponRot_i.y);
        };

        return out.set(right - left + 1, top - bottom + 1);
    };


    default Point2 calcPosLeftBottom(Point2 out, int size) {
        int off = (size + 1) % 2;
        return out.set(-size / 2 + off, -size / 2 + off);
    };


    default Point2 calcPosRightBottom(Point2 out, int size) {
        int off = (size + 1) % 2;
        return out.set(size / 2, -size / 2 + off);
    };


    default Point2 calcPosTeamOverlay(Point2 out, int size, int rot) {
        calcPosLeftBottom(out, size);

        Seq<Point2> seq1 = getLinkPoints();
        IntSeq seq2 = getLinkSizes();
        Point2 pon_i;
        Point2 ponRot_i;
        Point2 ponLB_i;
        int size_i;
        for(int i = 0; i < seq1.size; i++) {
            pon_i = seq1.get(i);
            size_i = seq2.get(i);
            ponRot_i = rotateLinkPos(Tmp.p3, pon_i, size, size_i, rot);
            ponLB_i = calcPosLeftBottom(Tmp.p2, size).add(ponRot_i);
            if((ponLB_i.x + ponLB_i.y) < (out.x + out.y)) {
                out.set(ponLB_i.x, ponLB_i.y);
            };
        };

        return out;
    };


    default Point2 calcPosStatusOverlay(Point2 out, int size, int rot) {
        calcPosRightBottom(out, size);

        Seq<Point2> seq1 = getLinkPoints();
        IntSeq seq2 = getLinkSizes();
        Point2 pon_i;
        Point2 ponRot_i;
        Point2 ponRB_i;
        int size_i;
        for(int i = 0; i < seq1.size; i++) {
            pon_i = seq1.get(i);
            size_i = seq2.get(i);
            ponRot_i = rotateLinkPos(Tmp.p3, pon_i, size, size_i, rot);
            ponRB_i = calcPosRightBottom(Tmp.p2, size).add(ponRot_i);
            if((ponRB_i.x - ponRB_i.y) > (out.x - out.y)) {
                out.set(ponRB_i.x, ponRB_i.y);
            };
        };

        return out;
    };


};
