/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, BLK_baseItemBlock>} BLKBaseItemBlock
     */


    /**
     * @typedef {TemplateInstance<Building, B_baseItemBlock>} BBaseItemBlock
     * @prop {BLKBaseItemBlock} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKBaseItemBlock} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.isExposed = MDL_cond.isExposedBlock(blk);
    };


    /**
     * @private
     * @param {BLKBaseItemBlock} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        if(blk.hasItems) {
            stats.add(fetchStat("lovec", "blk0item-unloadable"), blk.unloadable);
        };
        if(blk.isExposed) {
            stats.add(fetchStat("lovec", "blk0item-exposed"), true);
        };
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Blocks related to item distribution and storage.
         * Item reaction will happen in these blocks.
         * @class BLK_baseItemBlock
         * @extends BLK_baseBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_baseItemBlock")
        .initTemplate()
        .setParent(null)
        .setTags()
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_baseItemBlock
             * @instance
             * @type {boolean}
             */
            isExposed: false,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


        }),


        /**
         * @class B_baseItemBlock
         * @extends B_baseBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_baseItemBlock")
        .initTemplate()
        .setParent(null)
        .setParam({})
        .setMethod({


            updateTile: function() {
                this.self.ex_updateExposed();
            },


            /**
             * @memberof B_baseItemBlock
             * @instance
             * @func
             * @return {void}
             */
            ex_updateExposed: function() {
                if(
                    !Vars.net.client()
                        && this.block.delegee.isExposed
                        && this.items != null && this.items.any() && !this.block.delegee.noReac
                        && Mathf.chanceDelta(0.025)
                ) {
                    this.items.each((item, amt) => MDL_reaction.handleReaction(item, "GROUP: air", 40.0, this));
                };
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
