/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, BLK_baseMiner>} BLKBaseMiner
     */


    /**
     * @typedef {TemplateInstance<Building, B_baseMiner>} BBaseMiner
     * @prop {BLKBaseMiner} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseBlock");
    const INTF_BLK_durabilityBlock = require("lovec/temp/intf/INTF_BLK_durabilityBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKBaseMiner} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.priority = GLB_var.priority.min;
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Any block that can collects something from the environment.
         * @class BLK_baseMiner
         * @extends BLK_baseBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_baseMiner")
        .implement(INTF_BLK_durabilityBlock[0])
        .initTemplate()
        .setParent(null)
        .setTags()
        .setParam({})
        .setMethod({


            init: function() {
                comp_init(this);
            },


        }),


        /**
         * @class B_baseMiner
         * @extends B_baseBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_baseMiner")
        .implement(INTF_BLK_durabilityBlock[1])
        .initTemplate()
        .setParent(null)
        .setParam({})
        .setMethod({


            write: function(wr) {
                this.self.ex_processData(wr);
            },


            read: function(rd, revi) {
                this.self.ex_processData(rd);
            },


        }),


    ];
