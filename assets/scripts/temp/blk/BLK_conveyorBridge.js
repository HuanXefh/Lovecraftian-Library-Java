/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<ItemBridge, BLK_conveyorBridge>} BLKConveyorBridge
     */


    /**
     * @typedef {TemplateInstance<ItemBridge.ItemBridgeBuild, B_conveyorBridge>} BConveyorBridge
     * @prop {BLKConveyorBridge} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseItemDistributor");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKConveyorBridge} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.add(Stat.range, blk.range, StatUnit.blocks);
    };


    /**
     * @private
     * @param {BConveyorBridge} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(GLB_timer.rsCur) {
            b.delegee.lastRs = b.items.first();
        };
    };


    /**
     * @private
     * @param {BConveyorBridge} b
     * @param {Building} b_f
     * @param {Item} item
     * @return {boolean}
     */
    function comp_acceptItem(b, b_f, item) {
        b.delegee.lastRs = item;
        return true;
    };


    /**
     * @private
     * @param {BConveyorBridge} b
     * @return {void}
     */
    function comp_drawSelect(b) {
        LCDraw.contentIcon(b.x, b.y, b.delegee.lastRs, b.block.size, 0.75);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Simply item bridge.
         * <br> `SINGLESIZE`
         * @class BLK_conveyorBridge
         * @extends BLK_baseItemDistributor
         */
        newClass()
        .extendClass(PARENT[0], "BLK_conveyorBridge")
        .initTemplate()
        .setParent(ItemBridge)
        .setTags()
        .setParam({


            /* <------------------------------ vanilla ------------------------------> */


            unloadable: true,


        })
        .setMethod({


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_conveyorBridge
             * @instance
             * @func
             * @return {boolean}
             */
            ex_isSingleSized: function() {
                return true;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


        /**
         * @class B_conveyorBridge
         * @extends B_baseItemDistributor
         */
        newClass()
        .extendClass(PARENT[1], "B_conveyorBridge")
        .initTemplate()
        .setParent(ItemBridge.ItemBridgeBuild)
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_conveyorBridge
             * @instance
             * @type {Item|null}
             */
            lastRs: null,


        })
        .setMethod({


            updateTile: function() {
                comp_updateTile(this);
            },


            acceptItem: function(b_f, item) {
                return comp_acceptItem(this, b_f, item);
            }
            .setProp({
                boolMode: "and",
            }),


            drawSelect: function() {
                comp_drawSelect(this);
            },


        }),


    ];
