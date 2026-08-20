package lovec.type.block.factory;

import arc.graphics.g2d.Draw;
import arc.math.geom.Point2;
import arc.struct.IntSeq;
import arc.struct.Seq;
import arc.util.Log;
import arc.util.Nullable;
import arc.util.Tmp;
import lovec.annotation.JSONTypeClass;
import lovec.annotation.NoJSON;
import lovec.graphics.LCDrawf;
import mindustry.Vars;
import mindustry.game.Team;
import mindustry.gen.Building;
import mindustry.input.Placement;
import mindustry.type.Item;
import mindustry.type.Liquid;
import mindustry.world.Block;
import mindustry.world.Tile;
import mindustry.world.blocks.production.GenericCrafter;
import mindustry.world.meta.Stat;

/**
 * Multi-block version of {@link GenericCrafter}.
 * <br> <code>DEDICATION</code>: Inspired by MultiBlockLib.
 */
@JSONTypeClass
public class MultiBlockCrafter extends GenericCrafter implements MultiBlockLinkCenterBlockFrag {


    public int[] linkValues = {};
    public @NoJSON Seq<Point2> linkPoints = new Seq<>();
    public @NoJSON IntSeq linkSizes = new IntSeq();
    public int[] linkRotations = {0, 1, 2, 3, 0, 1, 2, 3};


    public MultiBlockCrafter(String name) {
        super(name);

        hasItems = true;
        hasLiquids = true;
        rotate = true;
        quickRotate = false;
        allowDiagonal = false;
    };


    @Override
    public void init() {
        super.init();
        addLink(linkValues);

        hasItems = true;
        hasLiquids = true;
    };


    @Override
    public void setStats() {
        super.setStats();
        stats.remove(Stat.size);
        calcMaxSize(Tmp.p1, size, 0);
        stats.add(Stat.size, "@x@", Tmp.p1.x, Tmp.p1.y);
    };


    @Override
    public void setBars() {
        super.setBars();
        if(outputLiquid == null && (outputLiquids == null || outputLiquids.length == 0)) {
            removeBar("liquid");
        };
    };


    @Override
    public void placeBegan(Tile t, Block prevBlk) {
        createLinkConstructBuilds(t, size);
    };


    @Override
    public void changePlacementPath(Seq<Point2> pons, int rot) {
        Placement.calculateNodes(pons, this, rot, (pon, opon) -> rot % 2 == 0 ?
            Math.abs(pon.x - opon.x) <= calcMaxSize(Tmp.p1, size, rot).x :
            Math.abs(pon.y - opon.y) <= calcMaxSize(Tmp.p1, size, rot).y
        );
    };


    @Override
    public boolean canPlaceOn(Tile t, Team team, int rot) {
        return super.canPlaceOn(t, team, rot) && checkLink(t, team, size, rot);
    };


    @Override
    public Seq<Point2> getLinkPoints() {
        return linkPoints;
    };


    @Override
    public IntSeq getLinkSizes() {
        return linkSizes;
    };




    public class MultiBlockCrafterBuild extends GenericCrafterBuild implements MultiBlockLinkCenterBuildFrag {


        public boolean isLinkCreated = false;
        public boolean isLinkValid = true;
        public Seq<Building> linkedBuilds = new Seq<>();
        public Seq<Building[]> linkedProximityMap;

        protected Tile teamOverlayPos;
        protected Tile statusOverlayPos;
        protected int dumpInd = 0;


        @Override
        public void created() {
            super.created();
            linkedProximityMap = new Seq<>();
        };


        @Override
        public void onRemoved() {
            createLinkConstructBuilds(tile, size);
        };


        @Override
        public void onProximityUpdate() {
            super.onProximityUpdate();
            updateLinkProximity();
        };


        @Override
        public void updateTile() {
            updateLinkedBuilds();
            super.updateTile();
        };


        public void incrementDumpIndex(int prox) {
            dumpInd = ((dumpInd + 1) % prox);
        };


        @Override
        public boolean dump(@Nullable Item itm) {
            if(!block.hasItems || items.total() == 0 || linkedProximityMap.size == 0 || (itm != null && !items.has(itm))) return false;

            Building[] pair;
            Building b_f;
            Building b_t;
            for(int i = 0; i < linkedProximityMap.size; i++) {
                pair = linkedProximityMap.get((i + dumpInd) % linkedProximityMap.size);
                b_f = pair[1];
                b_t = pair[0];
                if(itm == null) {
                    Item itmCur;
                    for(int j = 0; j < Vars.content.items().size; j++) {
                        if(!items.has(j)) continue;
                        itmCur = Vars.content.item(j);
                        if(b_t.acceptItem(b_f, itmCur) && canDump(b_t, itmCur)) {
                            b_t.handleItem(b_f, itmCur);
                            items.remove(itmCur, 1);
                            incrementDumpIndex(linkedProximityMap.size);
                            return true;
                        };
                    };
                } else {
                    if(b_t.acceptItem(b_f, itm) && canDump(b_t, itm)) {
                        b_t.handleItem(b_f, itm);
                        items.remove(itm, 1);
                        incrementDumpIndex(linkedProximityMap.size);
                        return true;
                    };
                };
                incrementDumpIndex(linkedProximityMap.size);
            };
            return false;
        };


        @Override
        public void offload(Item itm) {
            produced(itm, 1);

            Building[] pair;
            Building b_f;
            Building b_t;
            for(int i = 0; i < linkedProximityMap.size; i++) {
                incrementDumpIndex(linkedProximityMap.size);
                pair = linkedProximityMap.get((i + dumpInd) % linkedProximityMap.size);
                b_f = pair[1];
                b_t = pair[0];
                if(b_t.acceptItem(b_f, itm) && canDump(b_t, itm)) {
                    b_t.handleItem(b_f, itm);
                    return;
                };
            };
            handleItem(this, itm);
        };


        @Override
        public void dumpLiquid(Liquid liq, float scl, int dir) {
            if(liquids.get(liq) < 0.0001f) return;
            if(!Vars.net.client() && Vars.state.isCampaign() && team == Vars.state.rules.defaultTeam) {
                liq.unlock();
            };

            Building[] pair;
            Building b_t;
            float frac = liquids.get(liq) / block.liquidCapacity;
            float ofrac;
            for(int i = 0; i < linkedProximityMap.size; i++) {
                incrementDumpIndex(linkedProximityMap.size);
                pair = linkedProximityMap.get((i + dumpInd) % linkedProximityMap.size);
                b_t = pair[0];
                if(dir != -1 && (dir + rotation) % 4 != relativeTo(b_t)) continue;
                b_t = b_t.getLiquidDestination(this, liq);
                if(b_t != null && b_t.block.hasLiquids && canDumpLiquid(b_t, liq) && b_t.liquids != null) {
                    ofrac = b_t.liquids.get(liq) / b_t.block.liquidCapacity;
                    if(ofrac < frac) {
                        transferLiquid(b_t, (frac - ofrac) * block.liquidCapacity / scl, liq);
                    };
                };
            };
        };


        @Override
        public boolean canPickup() {
            return false;
        };


        @Override
        public void drawTeam() {
            Point2 pon = calcPosTeamOverlay(Tmp.p1, size, rotation);
            teamOverlayPos = Vars.world.tile(tileX() + pon.x, tileY() + pon.y);
            if(teamOverlayPos != null) {
                Draw.color(team.color);
                Draw.rect("block-border", teamOverlayPos.worldx(), teamOverlayPos.worldy());
                Draw.color();
            };
        };


        public boolean shouldDrawStatus() {
            return block.enableDrawStatus && block.consumers.length > 0;
        };


        @Override
        public void drawStatus() {
            if(shouldDrawStatus()) {
                Point2 pon = calcPosStatusOverlay(Tmp.p1, size, rotation);
                statusOverlayPos = Vars.world.tile(tileX() + pon.x, tileY() + pon.y);
                LCDrawf.blockStatus(statusOverlayPos.worldx(), statusOverlayPos.worldy(), size, status().color);
            };
        };


        protected boolean checkLinkPairValid(Building b_t, Building b_f) {
            Building pairB_f;
            Building pairB_t;
            for(Building[] pair : linkedProximityMap) {
                pairB_f = pair[1];
                pairB_t = pair[0];
                if(b_t == pairB_t && b_t.relativeTo(pairB_f) == b_t.relativeTo(b_f)) return false;
            };
            return true;
        };


        @Override
        public void updateLinkProximity() {
            if(linkedBuilds != null) {
                linkedProximityMap.clear();
                for(Building linked : linkedBuilds) {
                    for(Building ob : linked.proximity) {
                        if(ob != this && !linkedBuilds.contains(ob) && checkLinkPairValid(ob, linked)) {
                            linkedProximityMap.add(new Building[]{ob, linked});
                        };
                    };
                };
                for(Building ob : proximity) {
                    if(!linkedBuilds.contains(ob) && checkLinkPairValid(ob, this)) {
                        linkedProximityMap.add(new Building[]{ob, this});
                    };
                };
            };
        };


        public void updateLinkedBuilds() {
            if(!isPayload()) {
                if(!isLinkCreated) {
                    isLinkCreated = true;
                    createLinkBuilds(linkedBuilds, this, block, tile, team, size, rotation);
                    updateLinkProximity();
                };
                if(!isLinkValid) {
                    linkedBuilds.each(Building::kill);
                    kill();
                };
            };
        };


    };


};
