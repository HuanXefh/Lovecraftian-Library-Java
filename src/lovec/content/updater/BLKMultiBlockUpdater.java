package lovec.content.updater;

import arc.graphics.g2d.Draw;
import arc.graphics.g2d.Fill;
import arc.math.geom.Point2;
import arc.struct.Seq;
import arc.util.Nullable;
import arc.util.Tmp;
import lovec.content.BuildUpdater;
import lovec.content.ContentUpdater;
import lovec.type.block.factory.MultiBlockLinkCenterBlockFrag;
import lovec.type.block.factory.MultiBlockLinkCenterBuildFrag;
import mindustry.Vars;
import mindustry.game.Team;
import mindustry.gen.Building;
import mindustry.graphics.Layer;
import mindustry.graphics.Pal;
import mindustry.input.Placement;
import mindustry.type.Item;
import mindustry.type.Liquid;
import mindustry.world.Block;
import mindustry.world.Tile;
import mindustry.world.meta.Stat;

public class BLKMultiBlockUpdater extends ContentUpdater<Block> {


    public BLKMultiBlockUpdater(Block blk) throws NoSuchFieldException, IllegalAccessException {
        super(blk);
    };


    @FragMethod(superMode = "after")
    public void init() {
        if(target instanceof MultiBlockLinkCenterBlockFrag mblk) {
            mblk.addLink(mblk.getLinkValues());
            mblk.calcMaxSize(Tmp.p1, target.size, 0);
            mblk.setMultiBlockSizes(Tmp.p1.x, Tmp.p1.y);
            target.clipSize += (Math.max(Tmp.p1.x, Tmp.p1.y) - target.size) * Vars.tilesize;
            target.hasItems = true;
            target.hasLiquids = true;
        };
    };


    @FragMethod(superMode = "after")
    public void setStats() {
        if(target instanceof MultiBlockLinkCenterBlockFrag mblk) {
            target.stats.remove(Stat.size);
            target.stats.add(Stat.size, "@x@", mblk.getMultiBlockSizes()[0], mblk.getMultiBlockSizes()[1]);
        };
    };


    @FragMethod
    public void placeBegan(Tile t, Block blkPrev) {
        if(target instanceof MultiBlockLinkCenterBlockFrag mblk) {
            mblk.createLinkConstructBuilds(t, target.size);
        };
    };


    @FragMethod
    public void changePlacementPath(Seq<Point2> ponSeq, int rot) {
        if(target instanceof MultiBlockLinkCenterBlockFrag mblk) {
            Placement.calculateNodes(ponSeq, target, rot, (pon, opon) -> rot % 2 == 0 ?
                    Math.abs(pon.x - opon.x) <= mblk.getMultiBlockSizes()[0] :
                    Math.abs(pon.y - opon.y) <= mblk.getMultiBlockSizes()[0]
            );
        };
    };


    @FragMethod(boolMode = "and")
    public boolean canPlaceOn(Tile t, Team team, int rot) {
        if(target instanceof MultiBlockLinkCenterBlockFrag mblk) {
            return mblk.checkLink(t, team, target.size, rot);
        };
        return false;
    };




    public class BMultiBlockUpdater extends BuildUpdater<Building, Block> {


        protected Point2 statusOverlayOffset = new Point2();
        protected Point2 teamOverlayOffset = new Point2();


        public BMultiBlockUpdater(Building b) throws NoSuchFieldException, IllegalAccessException {
            super(b);
        };


        @FragMethod(superMode = "after")
        public void onRemoved() {
            if(b instanceof MultiBlockLinkCenterBuildFrag mb && blk instanceof MultiBlockLinkCenterBlockFrag mblk) {
                mblk.createLinkConstructBuilds(b.tile, blk.size);
            };
        };


        @FragMethod(superMode = "after")
        public void onProximityUpdate() {
            if(b instanceof MultiBlockLinkCenterBuildFrag mb && blk instanceof MultiBlockLinkCenterBlockFrag mblk) {
                mb.updateLinkProximity();
                mblk.calcPosTeamOverlay(teamOverlayOffset, blk.size, b.rotation);
                mblk.calcPosStatusOverlay(statusOverlayOffset, blk.size, b.rotation);
            };
        };


        @FragMethod(superMode = "before")
        public void updateTile() {
            if(b instanceof MultiBlockLinkCenterBuildFrag mb) {
                mb.updateLinkedBuilds();
            };
        };


        public void incrementDumpIndex(int prox) {
            var mb = (MultiBlockLinkCenterBuildFrag) b;
            mb.setDumpIndex((mb.getDumpIndex() + 1) % prox);
        };


        @FragMethod
        public boolean dump(@Nullable Item item) {
            if(b instanceof MultiBlockLinkCenterBuildFrag mb && blk instanceof MultiBlockLinkCenterBlockFrag mblk) {
                if(!blk.hasItems || b.items.total() == 0 || mb.getLinkedProximityMap().size == 0 || (item != null && !b.items.has(item))) return false;

                Building[] pair;
                Building b_f;
                Building b_t;
                int dumpInd = mb.getDumpIndex();
                int iCap = mb.getLinkedProximityMap().size;
                for(int i = 0; i < iCap; i++) {
                    pair = mb.getLinkedProximityMap().get((i + dumpInd) % iCap);
                    b_f = pair[1];
                    b_t = pair[0];
                    if(item == null) {
                        Item itemCur;
                        for(int j = 0; j < Vars.content.items().size; j++) {
                            if(!b.items.has(j)) continue;
                            itemCur = Vars.content.item(j);
                            if(b_t.acceptItem(b_f, itemCur) && b.canDump(b_t, itemCur)) {
                                b_t.handleItem(b_f, itemCur);
                                b.items.remove(itemCur, 1);
                                incrementDumpIndex(iCap);
                                return true;
                            };
                        };
                    } else {
                        if(b_t.acceptItem(b_f, item) && b.canDump(b_t, item)) {
                            b_t.handleItem(b_f, item);
                            b.items.remove(item, 1);
                            incrementDumpIndex(iCap);
                            return true;
                        };
                    };
                    incrementDumpIndex(iCap);
                };
            };

            return false;
        };


        @FragMethod
        public void offload(Item item) {
            if(b instanceof MultiBlockLinkCenterBuildFrag mb && blk instanceof MultiBlockLinkCenterBlockFrag mblk) {
                b.produced(item, 1);

                Building[] pair;
                Building b_f;
                Building b_t;
                int dumpInd = mb.getDumpIndex();
                int iCap = mb.getLinkedProximityMap().size;
                for(int i = 0; i < iCap; i++) {
                    incrementDumpIndex(iCap);
                    pair = mb.getLinkedProximityMap().get((i + dumpInd) % iCap);
                    b_f = pair[1];
                    b_t = pair[0];
                    if(b_t.acceptItem(b_f, item) && b.canDump(b_t, item)) {
                        b_t.handleItem(b_f, item);
                        return;
                    };
                };
                b.handleItem(b, item);
            };
        };


        @FragMethod
        public void dumpLiquid(Liquid liq, float scl, int dir) {
            if(b instanceof MultiBlockLinkCenterBuildFrag mb && blk instanceof MultiBlockLinkCenterBlockFrag mblk) {
                if(b.liquids.get(liq) < 0.0001f) return;
                if(!Vars.net.client() && Vars.state.isCampaign() && b.team == Vars.state.rules.defaultTeam) {
                    liq.unlock();
                };

                Building[] pair;
                Building b_t;
                float frac = b.liquids.get(liq) / blk.liquidCapacity;
                float ofrac;
                int dumpInd = mb.getDumpIndex();
                int iCap = mb.getLinkedProximityMap().size;
                for(int i = 0; i < iCap; i++) {
                    incrementDumpIndex(iCap);
                    pair = mb.getLinkedProximityMap().get((i + dumpInd) % iCap);
                    b_t = pair[0];
                    if(dir != -1 && (dir + b.rotation) % 4 != b.relativeTo(b_t)) continue;
                    b_t = b_t.getLiquidDestination(b, liq);
                    if(b_t != null && b_t.block.hasLiquids && b.canDumpLiquid(b_t, liq) && b_t.liquids != null) {
                        ofrac = b_t.liquids.get(liq) / b_t.block.liquidCapacity;
                        if(ofrac < frac) {
                            b.transferLiquid(b_t, (frac - ofrac) * blk.liquidCapacity / scl, liq);
                        };
                    };
                };
            };
        };


        @FragMethod
        public void drawTeam() {
            if(b instanceof MultiBlockLinkCenterBuildFrag mb && blk instanceof MultiBlockLinkCenterBlockFrag mblk) {
                Tile t = Vars.world.tile(b.tileX() + teamOverlayOffset.x, b.tileY() + teamOverlayOffset.y);
                if(t != null) {
                    Draw.color(b.team.color);
                    Draw.rect("block-border", t.worldx(), t.worldy());
                    Draw.color();
                };
            };
        };


        @FragMethod
        public void drawStatus() {
            if(b instanceof MultiBlockLinkCenterBuildFrag mb && blk instanceof MultiBlockLinkCenterBlockFrag mblk) {
                Tile t = Vars.world.tile(b.tileX() + statusOverlayOffset.x, b.tileY() + statusOverlayOffset.y);
                if(t != null) {
                    float mtp = mblk.getMultiBlockSizes()[0] > 1 && mblk.getMultiBlockSizes()[1] > 1 ? 1f : 0.64f;
                    float off = mtp == 1f ? 0f : (mtp * Vars.tilesize / 4f);
                    float x = t.worldx() + off;
                    float y = t.worldy() - off;
                    Draw.z(Layer.power + 1f);
                    Draw.color(Pal.gray);
                    Fill.square(x, y, 2.5f * mtp, 45f);
                    Draw.color(b.status().color);
                    Fill.square(x, y, 1.5f * mtp, 45f);
                    Draw.color();
                };
            };
        };


        private boolean checkLinkPairValid(Building b_t, Building b_f) {
            if(b instanceof MultiBlockLinkCenterBuildFrag mb) {
                Building pairB_f;
                Building pairB_t;
                for(Building[] pair : mb.getLinkedProximityMap()) {
                    pairB_f = pair[1];
                    pairB_t = pair[0];
                    if(b_t == pairB_t && b_t.relativeTo(pairB_f) == b_t.relativeTo(b_f)) return false;
                };
                return true;
            };
            return false;
        };


        @FragMethod
        public void updateLinkProximity() {
            if(b instanceof MultiBlockLinkCenterBuildFrag mb) {
                if(mb.getLinkedBuilds() != null) {
                    mb.getLinkedProximityMap().clear();
                    for(Building linked : mb.getLinkedBuilds()) {
                        for(Building ob : linked.proximity) {
                            if(ob != b && !mb.getLinkedBuilds().contains(ob) && checkLinkPairValid(ob, linked)) {
                                mb.getLinkedProximityMap().add(new Building[]{ob, linked});
                            };
                        };
                    };
                    for(Building ob : b.proximity) {
                        if(!mb.getLinkedBuilds().contains(ob) && checkLinkPairValid(ob, b)) {
                            mb.getLinkedProximityMap().add(new Building[]{ob, b});
                        };
                    };
                };
            };
        };


        @FragMethod
        public void updateLinkedBuilds() {
            if(b instanceof MultiBlockLinkCenterBuildFrag mb && blk instanceof MultiBlockLinkCenterBlockFrag mblk) {
                if(!b.isPayload()) {
                    if(!mb.getIsLinkCreated()) {
                        mb.setIsLinkCreated(true);
                        mblk.createLinkBuilds(mb.getLinkedBuilds(), b, blk, b.tile, b.team, blk.size, b.rotation);
                        mb.updateLinkProximity();
                    };
                    if(!mb.getIsLinkValid()) {
                        mb.getLinkedBuilds().each(Building::kill);
                        b.kill();
                    };
                };
            };
        };


    };


};
