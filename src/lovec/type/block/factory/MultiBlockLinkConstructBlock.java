package lovec.type.block.factory;

import arc.Core;
import arc.graphics.g2d.TextureRegion;
import mindustry.Vars;
import mindustry.game.Team;
import mindustry.gen.Building;
import mindustry.world.Block;
import mindustry.world.Tile;
import mindustry.world.blocks.ConstructBlock;
import mindustry.world.meta.BuildVisibility;

/**
 * Internal block type for multi-block structure in construction.
 * <br> <code>DEDICATION</code>: Inspired by MultiBlockLib.
 */
public class MultiBlockLinkConstructBlock extends Block {


    public MultiBlockLinkConstructBlock(String name) {
        super(name);

        update = true;
        buildVisibility = BuildVisibility.hidden;
        inEditor = false;
        destructible = true;
        breakable = false;
        rebuildable = false;
        solid = true;
        squareSprite = false;
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




    public class MultiBlockLinkConstructBuild extends Building {


        public Tile linkedTile;
        public ConstructBlock.ConstructBuild linkedBuild;
        public boolean shouldCheck = false;


        @Override
        public void updateTile() {
            super.updateTile();

            if(!shouldCheck && linkedBuild == null) {
                if(linkedTile != null) {
                    updateLink(linkedTile);
                    shouldCheck = true;
                };
            };

            if(linkedBuild == null || !linkedBuild.isAdded()) {
                tile.removeNet();
            };
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
        public void draw() {
            // Do nothing
        };


        public void updateLink(Tile t) {
            linkedTile = t;
            if(t.build instanceof ConstructBlock.ConstructBuild) {
                linkedBuild = (ConstructBlock.ConstructBuild) t.build;
            };
        };


    };


};
