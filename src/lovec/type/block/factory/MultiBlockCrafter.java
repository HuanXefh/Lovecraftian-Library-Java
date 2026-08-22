package lovec.type.block.factory;

import arc.math.geom.Point2;
import arc.struct.IntSeq;
import arc.struct.Seq;
import arc.util.Nullable;
import lovec.annotation.JSONTypeClass;
import lovec.annotation.NoJSON;
import lovec.content.frag.BLKFragMultiBlock;
import mindustry.game.Team;
import mindustry.gen.Building;
import mindustry.type.Item;
import mindustry.type.Liquid;
import mindustry.world.Block;
import mindustry.world.Tile;
import mindustry.world.blocks.production.GenericCrafter;

/**
 * Multi-block version of {@link GenericCrafter}.
 * <br> <code>DEDICATION</code>: Inspired by MultiBlockLib.
 */
@JSONTypeClass
public class MultiBlockCrafter extends GenericCrafter implements MultiBlockLinkCenterBlockFrag {


    private static final BLKFragMultiBlock blkFrag = new BLKFragMultiBlock();
    private static final BLKFragMultiBlock.BFragMultiBlock bFrag = new BLKFragMultiBlock.BFragMultiBlock();

    public int[] linkValues = {};
    public @NoJSON Seq<Point2> linkPoints = new Seq<>();
    public @NoJSON IntSeq linkSizes = new IntSeq();
    public @NoJSON int[] multiBlockSizes = new int[2];
    public int[] linkRotations = {0, 1, 2, 3, 0, 1, 2, 3};


    public MultiBlockCrafter(String name) {
        super(name);

        hasItems = true;
        hasLiquids = true;
        rotate = true;
        quickRotate = false;
        allowDiagonal = false;
        drawArrow = false;
    };


    @Override
    public void init() {
        super.init();
        blkFrag.setThis(this).init();
    };


    @Override
    public void setStats() {
        super.setStats();
        blkFrag.setThis(this).setStats();
    };


    @Override
    public void setBars() {
        super.setBars();
        if(outputLiquid == null && (outputLiquids == null || outputLiquids.length == 0)) {
            removeBar("liquid");
        };
    };


    @Override
    public void placeBegan(Tile t, Block blkPrev) {
        blkFrag.setThis(this).placeBegan(t, blkPrev);
    };


    @Override
    public void changePlacementPath(Seq<Point2> ponSeq, int rot) {
        blkFrag.setThis(this).changePlacementPath(ponSeq, rot);
    };


    @Override
    public boolean canPlaceOn(Tile t, Team team, int rot) {
        return super.canPlaceOn(t, team, rot) && blkFrag.setThis(this).canPlaceOn(t, team, rot);
    };


    @Override
    public int[] getLinkValues() {
        return linkValues;
    };


    @Override
    public Seq<Point2> getLinkPoints() {
        return linkPoints;
    };


    @Override
    public IntSeq getLinkSizes() {
        return linkSizes;
    };


    @Override
    public int[] getMultiBlockSizes() {
        return multiBlockSizes;
    };


    @Override
    public void setMultiBlockSizes(int w, int h) {
        multiBlockSizes[0] = w;
        multiBlockSizes[1] = h;
    };




    public class MultiBlockCrafterBuild extends GenericCrafterBuild implements MultiBlockLinkCenterBuildFrag {


        public boolean isLinkCreated = false;
        public boolean isLinkValid = true;
        public Seq<Building> linkedBuilds = new Seq<>();
        public Seq<Building[]> linkedProximityMap = new Seq<>();
        public int dumpIndex = 0;


        @Override
        public void created() {
            super.created();
            linkedProximityMap = new Seq<>();
        };


        @Override
        public void onRemoved() {
            super.onRemoved();
            bFrag.setThis(this).onRemoved();
        };


        @Override
        public void onProximityUpdate() {
            super.onProximityUpdate();
            bFrag.setThis(this).onProximityUpdate();
        };


        @Override
        public void updateTile() {
            bFrag.setThis(this).updateTile();
            super.updateTile();
        };


        @Override
        public boolean dump(@Nullable Item itm) {
            return bFrag.setThis(this).dump(itm);
        };


        @Override
        public void offload(Item itm) {
            bFrag.setThis(this).offload(itm);
        };


        @Override
        public void dumpLiquid(Liquid liq, float scl, int dir) {
            bFrag.setThis(this).dumpLiquid(liq, scl, dir);
        };


        @Override
        public boolean canPickup() {
            return false;
        };


        @Override
        public void drawTeam() {
            bFrag.setThis(this).drawTeam();
        };


        public boolean shouldDrawStatus() {
            return block.enableDrawStatus && block.consumers.length > 0;
        };


        @Override
        public void drawStatus() {
            if(shouldDrawStatus()) {
                bFrag.setThis(this).drawStatus();
            };
        };


        @Override
        public boolean getIsLinkCreated() {
            return isLinkCreated;
        };


        @Override
        public void setIsLinkCreated(boolean bool) {
            isLinkCreated = bool;
        };


        @Override
        public boolean getIsLinkValid() {
            return isLinkValid;
        };


        @Override
        public Seq<Building> getLinkedBuilds() {
            return linkedBuilds;
        };


        @Override
        public Seq<Building[]> getLinkedProximityMap() {
            return linkedProximityMap;
        };


        @Override
        public int getDumpIndex() {
            return dumpIndex;
        };


        @Override
        public void setDumpIndex(int num) {
            dumpIndex = num;
        };


        @Override
        public void updateLinkedBuilds() {
            bFrag.setThis(this).updateLinkedBuilds();
        };


        @Override
        public void updateLinkProximity() {
            bFrag.setThis(this).updateLinkProximity();
        };


    };


};
