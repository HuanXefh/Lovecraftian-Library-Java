package lovec.type.block.factory;

import arc.Core;
import arc.func.Func;
import arc.graphics.g2d.TextureRegion;
import arc.scene.ui.layout.Table;
import mindustry.Vars;
import mindustry.game.Team;
import mindustry.gen.Building;
import mindustry.gen.Sounds;
import mindustry.gen.Teamc;
import mindustry.type.Item;
import mindustry.type.Liquid;
import mindustry.ui.Bar;
import mindustry.world.Block;
import mindustry.world.Tile;
import mindustry.world.blocks.sandbox.PowerSource;
import mindustry.world.consumers.Consume;
import mindustry.world.meta.BuildVisibility;
import mindustry.world.modules.ItemModule;
import mindustry.world.modules.LiquidModule;
import mindustry.world.modules.PowerModule;

/**
 * Internal block type for multi-block structure.
 * <br> <code>DEDICATION</code>: Inspired by MultiBlockLib.
 */
public class MultiBlockLinkBlock extends Block {


    public MultiBlockLinkBlock(String name) {
        super(name);

        update = true;
        canOverdrive = false;
        buildVisibility = BuildVisibility.hidden;
        inEditor = false;
        destructible = true;
        breakable = false;
        rebuildable = false;
        instantDeconstruct = true;
        solid = true;
        hasItems = true;
        hasLiquids = true;
        hasPower = false;
        conductivePower = true;
        squareSprite = false;
        drawCracks = false;
        drawArrow = false;
        drawTeamOverlay = false;
        enableDrawStatus = false;
        ambientSound = Sounds.none;
        breakSound = Sounds.none;
        destroySound = Sounds.none;
        placeSound = Sounds.none;
    };


    @Override
    public void load() {
        super.load();
        localizedName = Core.bundle.get("block.lovec-multiblock-link-block.name");
        region = Core.atlas.find("lovec-ast-link-block");
    };


    @Override
    public void loadIcon() {
        fullIcon = uiIcon = Core.atlas.find("lovec-ast-link-block");
    };


    @Override
    public boolean isHidden() {
        return true;
    };


    @Override
    public boolean canBreak(Tile tile) {
        return false;
    };




    public class MultiBlockLinkBuild extends Building {


        public Building linkedBuild;


        @Override
        public void created() {
            Core.app.post(this::updatePowerGraph);
        };


        @Override
        public void onDestroyed() {
            // Do nothing
        };


        @Override
        public void onProximityUpdate() {
            if(linkedBuild != null) {
                ((MultiBlockLinkCenterBuildFrag) linkedBuild).updateLinkProximity();
            };
            super.onProximityUpdate();
        };


        @Override
        public void updateTile() {
            if(linkedBuild == null || !linkedBuild.isValid()) {
                kill();
            };
        };


        @Override
        public boolean acceptItem(Building b_f, Item itm) {
            return linkedBuild != null && linkedBuild.acceptItem(b_f, itm);
        };


        @Override
        public int acceptStack(Item itm, int amt, Teamc e_f) {
            return linkedBuild == null ? 0 : linkedBuild.acceptStack(itm, amt, e_f);
        };


        @Override
        public void handleItem(Building b_f, Item itm) {
            if(linkedBuild == null) return;
            linkedBuild.handleItem(b_f, itm);
        };


        @Override
        public void handleStack(Item itm, int amt, Teamc e_f) {
            if(linkedBuild == null) return;
            linkedBuild.handleStack(itm, amt, e_f);
        };


        @Override
        public boolean acceptLiquid(Building b_f, Liquid liq) {
            return linkedBuild != null && linkedBuild.acceptLiquid(b_f, liq);
        };


        @Override
        public void handleLiquid(Building b_f, Liquid liq, float amt) {
            if(linkedBuild == null) return;
            linkedBuild.handleLiquid(b_f, liq, amt);
        };


        @Override
        public boolean conductsTo(Building ob) {
            if(linkedBuild == null) return false;
            if(ob == linkedBuild || linkedBuild.block.conductivePower) return true;

            if(ob instanceof MultiBlockLinkBuild omb) {
                return omb.linkedBuild == linkedBuild;
            };

            return (ob.block.conductivePower || ob.block instanceof PowerSource) && ob.conductsTo(this);
        };


        @Override
        public boolean canPickup() {
            return false;
        };


        @Override
        public void damage(float dmg) {
            if(linkedBuild == null) return;
            linkedBuild.damage(dmg);
        };


        @Override
        public float handleDamage(float amt) {
            return linkedBuild == null ? 0f : linkedBuild.handleDamage(amt);
        };


        @Override
        public TextureRegion getDisplayIcon() {
            return linkedBuild == null ?
                block.uiIcon :
                linkedBuild.getDisplayIcon();
        };


        @Override
        public String getDisplayName() {
            String name = linkedBuild == null ?
                block.localizedName :
                linkedBuild.block.localizedName;
            return team == Team.derelict ?
                (name + "\n" + Core.bundle.get("block.derelict")) :
                (name + ((team != Vars.player.team() && !team.emoji.isEmpty()) ? " " + team.emoji : ""));
        };


        @Override
        public void displayBars(Table tb) {
            if(linkedBuild == null) return;
            for(Func<Building, Bar> barF : linkedBuild.block.listBars()) {
                Bar bar = barF.get(linkedBuild);
                if(bar != null) {
                    tb.add(bar).growX().row();
                };
            };
        };


        @Override
        public void displayConsumption(Table tb) {
            if(linkedBuild == null) return;
            tb.left();
            for(Consume cons : linkedBuild.block.consumers) {
                if(cons.optional && cons.booster) continue;
                cons.build(linkedBuild, tb);
            };
        };


        @Override
        public void draw() {
            // Do nothing
        };


        @Override
        public void drawSelect() {
            if(linkedBuild != null) {
                linkedBuild.drawSelect();
            };
        };


        public void updateLink(Building newLinked) {
            if(newLinked instanceof MultiBlockLinkCenterBuildFrag) {
                linkedBuild = newLinked;
                items = newLinked.items;
                liquids = newLinked.liquids;
            } else {
                linkedBuild = null;
                tile.remove();
            };

            if(items == null) {
                items = new ItemModule();
            };
            if(liquids == null) {
                liquids = new LiquidModule();
            };
            if(block.hasPower && power == null) {
                power = new PowerModule();
            };
        };


    };


};
