/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Wall, BLK_lootFilter>} BLKLootFilter
     */


    /**
     * @typedef {TemplateInstance<Wall.WallBuild, B_lootFilter>} BLootFilter
     * @prop {BLKLootFilter} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseLootBlock");
    const INTF_BLK_contentSelector = require("lovec/temp/intf/INTF_BLK_contentSelector");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKLootFilter} blk
     * @return {void}
     */
    function comp_init(blk) {
        resetBlockFlag(blk, []);
        blk.group = BlockGroup.none;
        blk.priority = TargetPriority.base;

        blk.rotate = true;
        blk.update = true;
        blk.drawDynamic = true;
        blk.drawCached = false;
    };


    /**
     * @private
     * @param {BLKLootFilter} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.delegee.sideReg1 = fetchRegion(blk, "-side1", "-side");
        blk.delegee.sideReg2 = fetchRegion(blk, "-side2", "-side");
        blk.delegee.itemReg = fetchRegion(blk, "-item");
    };


    /**
     * @private
     * @param {BLKLootFilter} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        if(blk.delegee.lootCallCooldown > 0.0) {
            stats.add(Stat.itemsMoved, blk.delegee.lootCallAmt / blk.delegee.lootCallCooldown * 60.0, StatUnit.itemsSecond);
        };
    };


    /**
     * @private
     * @param {BLootFilter} b
     * @return {void}
     */
    function comp_onProximityUpdate(b) {
        SLCPos.getCoordsBack(b.delegee.lootDumpVec, b.x, b.y, b.block.size, b.rotation);
    };


    /**
     * @private
     * @param {BLootFilter} b
     * @return {void}
     */
    function comp_pickedUp(b) {
        b.delegee.lootDumpVec.set(-1.0, -1.0);
    };


    /**
     * @private
     * @param {BLootFilter} b
     * @return {void}
     */
    function comp_draw(b) {
        Draw.rect(b.block.region, b.x, b.y);
        SLCDrawf.side(b.x, b.y, b.block.delegee.sideReg1, b.block.delegee.sideReg2, b.rotation);
        if(b.delegee.ctTarget != null) {
            Draw.color(b.delegee.ctTarget.color);
            Draw.rect(b.block.delegee.itemReg, b.x, b.y, b.drawrot());
            Draw.color();
        };
    };


    /**
     * @private
     * @param {BLootFilter} b
     * @return {void}
     */
    function comp_drawSelect(b) {
        b.self.ex_drawSelected();
    };


    /**
     * @private
     * @param {BLootFilter} b
     * @return {void}
     */
    function comp_ex_updateLootTs(b) {
        SLCPos.getTilesRot(b.delegee.lootTs, b.tile, b.rotation, b.block.size);
    };


    /**
     * @private
     * @param {BLootFilter} b
     * @param {Array<LootUnit>} loots
     * @param {number} amt
     * @return {void}
     */
    function comp_ex_lootCall(b, loots, amt) {
        let loot = loots.find(loot => loot.item() === b.delegee.ctTarget);
        if(loot != null) {
            MDL_effect.itemTransfer(loot.x, loot.y, b);
            MDL_effect.itemTransfer(b.x, b.y, b.delegee.lootDumpVec);
            if(loot.stack.amount <= amt) {
                loot.x = b.delegee.lootDumpVec.x;
                loot.y = b.delegee.lootDumpVec.y;
                loot.time = 0.0;
            } else {
                MDL_call.spawnLoot_server(b.delegee.lootDumpVec.x, b.delegee.lootDumpVec.y, loot.item(), amt);
                loot.stack.amount -= amt;
            };
        };
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Transports matching loots to the back side.
         * @class BLK_lootFilter
         * @extends BLK_baseLootBlock
         * @extends INTF_BLK_contentSelector
         */
        newClass()
        .extendClass(PARENT[0], "BLK_lootFilter")
        .implement(INTF_BLK_contentSelector[0])
        .initTemplate()
        .setParent("Wall")
        .setTags("blk-non-wall")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_lootFilter
             * @instance
             * @type {TextureRegion}
             */
            sideReg1: null,
            /**
             * `INTERNAL`
             * @memberof BLK_lootFilter
             * @instance
             * @type {TextureRegion}
             */
            sideReg2: null,
            /**
             * `INTERNAL`
             * @memberof BLK_lootFilter
             * @instance
             * @type {TextureRegion}
             */
            itemReg: null,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            load: function() {
                comp_load(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


        }),


        /**
         * @class B_lootFilter
         * @extends B_baseLootBlock
         * @extends INTF_B_contentSelector
         */
        newClass()
        .extendClass(PARENT[1], "B_lootFilter")
        .implement(INTF_BLK_contentSelector[1])
        .initTemplate()
        .setParent("Wall.WallBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_lootFilter
             * @instance
             * @type {TDynamic<Vec2>}
             */
            lootDumpVec: tprov(() => new Vec2(-1.0, -1.0)),


        })
        .setMethod({


            onProximityUpdate: function() {
                comp_onProximityUpdate(this);
            },


            pickedUp: function() {
                comp_pickedUp(this);
            },


            draw: function() {
                comp_draw(this);
                this.self.ex_drawRcIcon();
            }
            .setProp({
                noSuper: true,
            }),


            drawSelect: function() {
                comp_drawSelect(this);
            },


            write: function(wr) {
                this.self.ex_processData(wr);
            },


            read: function(rd, revi) {
                this.self.ex_processData(rd);
            },


            /**
             * `REALIZED`
             * @override
             * @memberof B_lootFilter
             * @instance
             * @func
             * @return {void}
             */
            ex_updateLootTs: function() {
                comp_ex_updateLootTs(this);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * `REALIZED`
             * @memberof B_lootFilter
             * @instance
             * @func
             * @param {Array<LootUnit>} loots
             * @param {number} amt
             * @return {void}
             */
            ex_lootCall: function(loots, amt) {
                comp_ex_lootCall(this, loots, amt);
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
