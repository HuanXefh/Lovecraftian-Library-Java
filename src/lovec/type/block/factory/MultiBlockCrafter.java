package lovec.type.block.factory;

import arc.math.geom.Point2;
import arc.struct.IntSeq;
import arc.struct.Seq;
import arc.util.Nullable;
import lovec.annotation.JSONTypeClass;
import lovec.annotation.NoJSON;
import lovec.content.updater.BLKMultiBlockUpdater;
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


    public @NoJSON @Nullable BLKMultiBlockUpdater multiBlockUpdater;

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
        try {
            multiBlockUpdater = new BLKMultiBlockUpdater(this);
        } catch(Exception err) {
            throw new RuntimeException(err);
        };
        multiBlockUpdater.init();
    };


    @Override
    public void setStats() {
        super.setStats();
        multiBlockUpdater.setStats();
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
        multiBlockUpdater.placeBegan(t, blkPrev);
    };


    @Override
    public void changePlacementPath(Seq<Point2> ponSeq, int rot) {
        multiBlockUpdater.changePlacementPath(ponSeq, rot);
    };


    @Override
    public boolean canPlaceOn(Tile t, Team team, int rot) {
        return super.canPlaceOn(t, team, rot) && multiBlockUpdater.canPlaceOn(t, team, rot);
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


        public @NoJSON @Nullable BLKMultiBlockUpdater.BMultiBlockUpdater multiBlockBuildUpdater;

        public boolean isLinkCreated = false;
        public boolean isLinkValid = true;
        public Seq<Building> linkedBuilds = new Seq<>();
        public Seq<Building[]> linkedProximityMap = new Seq<>();
        public int dumpIndex = 0;


        @Override
        public void created() {
            super.created();
            try {
                multiBlockBuildUpdater = multiBlockUpdater.new BMultiBlockUpdater(this);
            } catch(Exception err) {
                throw new RuntimeException(err);
            };
            linkedProximityMap = new Seq<>();
        };


        @Override
        public void onRemoved() {
            super.onRemoved();
            multiBlockBuildUpdater.onRemoved();
        };


        @Override
        public void onProximityUpdate() {
            super.onProximityUpdate();
            multiBlockBuildUpdater.onProximityUpdate();
        };


        @Override
        public void updateTile() {
            multiBlockBuildUpdater.updateTile();
            super.updateTile();
        };


        @Override
        public boolean dump(@Nullable Item item) {
            return multiBlockBuildUpdater.dump(item);
        };


        @Override
        public void offload(Item item) {
            multiBlockBuildUpdater.offload(item);
        };


        @Override
        public void dumpLiquid(Liquid liq, float scl, int dir) {
            multiBlockBuildUpdater.dumpLiquid(liq, scl, dir);
        };


        @Override
        public boolean canPickup() {
            return false;
        };


        @Override
        public void drawTeam() {
            multiBlockBuildUpdater.drawTeam();
        };


        public boolean shouldDrawStatus() {
            return block.enableDrawStatus && block.consumers.length > 0;
        };


        @Override
        public void drawStatus() {
            if(shouldDrawStatus()) {
                multiBlockBuildUpdater.drawStatus();
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
            multiBlockBuildUpdater.updateLinkedBuilds();
        };


        @Override
        public void updateLinkProximity() {
            multiBlockBuildUpdater.updateLinkProximity();
        };


    };


};
