/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<StorageBlock, BLK_lootHopper>} BLKLootHopper
     */


    /**
     * @typedef {TemplateInstance<StorageBlock.StorageBuild, B_lootHopper>} BLootHopper
     * @prop {BLKLootHopper} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseLootBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKLootHopper} blk
     * @return {void}
     */
    function comp_init(blk) {
        resetBlockFlag(blk, []);

        blk.update = true;
        blk.canOverdrive = true;
    };


    /**
     * @private
     * @param {BLKLootHopper} blk
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
     * @param {BLootHopper} b
     * @return {void}
     */
    function comp_updateTile(b) {
        b.delegee.dumpTimeCur += b.delta();
        if(b.delegee.dumpTimeCur >= b.block.dumpTime) {
            b.delegee.dumpTimeCur %= b.block.dumpTime;
            b.dump();
        };
    };


    /**
     * @private
     * @param {BLootHopper} b
     * @return {void}
     */
    function comp_ex_updateLootTs(b) {
        SLCPos.getTilesRect(b.delegee.lootTs, b.tile, 1, b.block.size);
    };


    /**
     * @private
     * @param {BLootHopper} b
     * @param {Array<LootUnit>} loots
     * @param {number} amt
     * @return {void}
     */
    function comp_ex_lootCall(b, loots, amt) {
        let loot = loots.first();
        if(loot != null) {
            if(FRAG_item.takeLoot(b, loot, amt, true)) {
                loot.time = 0.0;
                MDL_effect.itemTransfer(loot.x, loot.y, b);
            };
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Collects loot on top of the block.
         * @class BLK_lootHopper
         * @extends BLK_baseLootBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_lootHopper")
        .initTemplate()
        .setParent("StorageBlock")
        .setTags("blk-non-cont")
        .setParam({


            /* <------------------------------ vanilla ------------------------------> */


            solid: false,
            underBullets: true,
            coreMerge: false,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            outputsItems: function() {
                return true;
            }
            .setProp({
                noSuper: true,
            }),


        }),


        /**
         * @class B_lootHopper
         * @extends B_baseLootBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_lootHopper")
        .initTemplate()
        .setParent("StorageBlock.StorageBuild")
        .setParam({})
        .setMethod({


            updateTile: function() {
                comp_updateTile(this);
            },


            acceptItem: function(b_f, item) {
                return false;
            }
            .setProp({
                noSuper: true,
                boolMode: "and",
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof B_baseLootBlock
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
             * @memberof B_baseLootBlock
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
