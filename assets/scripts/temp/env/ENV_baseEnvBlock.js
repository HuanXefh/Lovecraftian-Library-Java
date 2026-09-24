/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, ENV_baseEnvBlock>} ENVBaseEnvBlock
     */


    const PARENT = CLS_contentTemplate;


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {ENVBaseEnvBlock} blk
     * @return {void}
     */
    function comp_init(blk) {
        Core.app.post(() => {
            // Set drop hardness of this env block
            if(blk.itemDrop != null) {
                if(blk.dropHardness < 0.0) {
                    blk.dropHardness = blk.itemDrop.hardness;
                };
            } else {
                blk.dropHardness = Number.n4;
            };
        });
    };


    /**
     * @private
     * @param {ENVBaseEnvBlock} blk
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        if(blk.itemDrop != null) {
            stats.add(fetchStat("lovec", "rs-hardness"), blk.dropHardness);
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Root for all environmental blocks.
     * @class ENV_baseEnvBlock
     * @extends CLS_contentTemplate
     */
    module.exports = newClass()
    .extendClass(PARENT, "ENV_baseEnvBlock")
    .initTemplate()
    .setParent(null)
    .setTags()
    .setParam({


        /**
         * `PARAM`: See {@link RS_baseResource}.
         * @memberof ENV_baseEnvBlock
         * @instance
         * @type {boolean}
         */
        setupVanillaStat: true,
        /**
         * `PARAM`: See {@link RS_baseResource}.
         * @memberof ENV_baseEnvBlock
         * @instance
         * @type {boolean}
         */
        setupVanillaProp: true,
        /**
         * `PARAM`: If not negative, this will be used as hardness of the item drop. Only affects placement, does not affect real drill time!
         * @memberof ENV_baseEnvBlock
         * @instance
         * @type {number}
         */
        dropHardness: -1.0,


    })
    .setMethod({


        init: function() {
            comp_init(this);
        },


        setStats: function(stats) {
            comp_setStats(this, getCtStats(this, stats));
        },


    });
