/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, BLK_baseHeatBlock>} BLKBaseHeatBlock
     */


    /**
     * @typedef {TemplateInstance<Building, B_baseHeatBlock>} BBaseHeatBlock
     * @prop {BLKBaseHeatBlock} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseBlock");
    const INTF_BLK_heatBlock = require("lovec/temp/intf/INTF_BLK_heatBlock");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Any block related to Lovec heat.
         * Heaters are not included, since every factory type can be a heater in Lovec.
         * @class BLK_baseHeatBlock
         * @extends BLK_baseBlock
         * @extends INTF_BLK_heatBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_baseHeatBlock")
        .implement(INTF_BLK_heatBlock[0])
        .initTemplate()
        .setParent(null)
        .setTags()
        .setParam({})
        .setMethod({}),


        /**
         * @class B_baseHeatBlock
         * @extends B_baseBlock
         * @extends INTF_B_heatBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_baseHeatBlock")
        .implement(INTF_BLK_heatBlock[1])
        .initTemplate()
        .setParent(null)
        .setParam({})
        .setMethod({


            write: function(wr) {
                this.self.ex_processData(wr);
            },


            read: function(rd, revi) {
                if(this.LCRevi === 5) {
                    rd.s();
                };
                this.self.ex_processData(rd);
            },


        }),


    ];
