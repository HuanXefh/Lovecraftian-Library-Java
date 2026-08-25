package lovec.content.frag;

import arc.graphics.g2d.Draw;
import arc.graphics.g2d.Fill;
import arc.math.geom.Point2;
import arc.struct.Seq;
import arc.util.Nullable;
import arc.util.Tmp;
import lovec.content.BuildContentFrag;
import lovec.content.ContentFrag;
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

public class BLKFragMultiBlock extends ContentFrag<Block, BLKFragMultiBlock> {


    @FragMethod(superMode = "after")
    public void init() {
        Block blk = getThis();

        if(blk instanceof MultiBlockLinkCenterBlockFrag mblk) {
            mblk.addLink(mblk.getLinkValues());
            mblk.calcMaxSize(Tmp.p1, blk.size, 0);
            mblk.setMultiBlockSizes(Tmp.p1.x, Tmp.p1.y);
            blk.clipSize += (Math.max(Tmp.p1.x, Tmp.p1.y) - blk.size) * Vars.tilesize;
            blk.hasItems = true;
            blk.hasLiquids = true;
        };
    };


    @FragMethod(superMode = "after")
    public void setStats() {
        Block blk = getThis();

        if(blk instanceof MultiBlockLinkCenterBlockFrag mblk) {
            blk.stats.remove(Stat.size);
            blk.stats.add(Stat.size, "@x@", mblk.getMultiBlockSizes()[0], mblk.getMultiBlockSizes()[1]);
        };
    };


    @FragMethod
    public void placeBegan(Tile t, Block blkPrev) {
        Block blk = getThis();

        if(blk instanceof MultiBlockLinkCenterBlockFrag mblk) {
            mblk.createLinkConstructBuilds(t, blk.size);
        };
    };


    @FragMethod
    public void changePlacementPath(Seq<Point2> ponSeq, int rot) {
        Block blk = getThis();

        if(blk instanceof MultiBlockLinkCenterBlockFrag mblk) {
            Placement.calculateNodes(ponSeq, blk, rot, (pon, opon) -> rot % 2 == 0 ?
                Math.abs(pon.x - opon.x) <= mblk.getMultiBlockSizes()[0] :
                Math.abs(pon.y - opon.y) <= mblk.getMultiBlockSizes()[0]
            );
        };
    };


    @FragMethod(boolMode = "and")
    public boolean canPlaceOn(Tile t, Team team, int rot) {
        Block blk = getThis();

        if(blk instanceof MultiBlockLinkCenterBlockFrag mblk) {
            return mblk.checkLink(t, team, blk.size, rot);
        };
        return false;
    };




    public static class BFragMultiBlock extends BuildContentFrag<Building, Block, BFragMultiBlock> {


        public static Point2 statusOverlayOffset = new Point2();
        public static Point2 teamOverlayOffset = new Point2();


        @FragMethod(superMode = "after")
        public void onRemoved() {
            Building b = getThis();
            resolve();

            if(b instanceof MultiBlockLinkCenterBuildFrag mb && blk instanceof MultiBlockLinkCenterBlockFrag mblk) {
                mblk.createLinkConstructBuilds(b.tile, blk.size);
            };
        };


        @FragMethod(superMode = "after")
        public void onProximityUpdate() {
            Building b = getThis();

            if(b instanceof MultiBlockLinkCenterBuildFrag mb) {
                mb.updateLinkProximity();
            };
        };


        @FragMethod(superMode = "before")
        public void updateTile() {
            Building b = getThis();

            if(b instanceof MultiBlockLinkCenterBuildFrag mb) {
                mb.updateLinkedBuilds();
            };
        };


        public void incrementDumpIndex(int prox) {
            var mb = (MultiBlockLinkCenterBuildFrag) getThis();
            mb.setDumpIndex((mb.getDumpIndex() + 1) % prox);
        };


        @FragMethod
        public boolean dump(@Nullable Item itm) {
            Building b = getThis();
            resolve();

            if(b instanceof MultiBlockLinkCenterBuildFrag mb && blk instanceof MultiBlockLinkCenterBlockFrag mblk) {
                if(!blk.hasItems || b.items.total() == 0 || mb.getLinkedProximityMap().size == 0 || (itm != null && !b.items.has(itm))) return false;

                Building[] pair;
                Building b_f;
                Building b_t;
                int dumpInd = mb.getDumpIndex();
                int iCap = mb.getLinkedProximityMap().size;
                for(int i = 0; i < iCap; i++) {
                    pair = mb.getLinkedProximityMap().get((i + dumpInd) % iCap);
                    b_f = pair[1];
                    b_t = pair[0];
                    if(itm == null) {
                        Item itmCur;
                        for(int j = 0; j < Vars.content.items().size; j++) {
                            if(!b.items.has(j)) continue;
                            itmCur = Vars.content.item(j);
                            if(b_t.acceptItem(b_f, itmCur) && b.canDump(b_t, itmCur)) {
                                b_t.handleItem(b_f, itmCur);
                                b.items.remove(itmCur, 1);
                                incrementDumpIndex(iCap);
                                return true;
                            };
                        };
                    } else {
                        if(b_t.acceptItem(b_f, itm) && b.canDump(b_t, itm)) {
                            b_t.handleItem(b_f, itm);
                            b.items.remove(itm, 1);
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
        public void offload(Item itm) {
            Building b = getThis();
            resolve();

            if(b instanceof MultiBlockLinkCenterBuildFrag mb && blk instanceof MultiBlockLinkCenterBlockFrag mblk) {
                b.produced(itm, 1);

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
                    if(b_t.acceptItem(b_f, itm) && b.canDump(b_t, itm)) {
                        b_t.handleItem(b_f, itm);
                        return;
                    };
                };
                b.handleItem(b, itm);
            };
        };


        @FragMethod
        public void dumpLiquid(Liquid liq, float scl, int dir) {
            Building b = getThis();
            resolve();

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
            Building b = getThis();
            resolve();

            if(b instanceof MultiBlockLinkCenterBuildFrag mb && blk instanceof MultiBlockLinkCenterBlockFrag mblk) {
                mblk.calcPosTeamOverlay(teamOverlayOffset, blk.size, b.rotation);
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
            Building b = getThis();
            resolve();

            if(b instanceof MultiBlockLinkCenterBuildFrag mb && blk instanceof MultiBlockLinkCenterBlockFrag mblk) {
                mblk.calcPosStatusOverlay(statusOverlayOffset, blk.size, b.rotation);
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
            Building b = getThis();

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
            Building b = getThis();

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
            Building b = getThis();
            resolve();

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
