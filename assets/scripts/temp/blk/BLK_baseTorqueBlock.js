/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, BLK_baseTorqueBlock>} BLKBaseTorqueBlock
     */


    /**
     * @typedef {TemplateInstance<Building, B_baseTorqueBlock>} BBaseTorqueBlock
     * @prop {BLKBaseTorqueBlock} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseBlock");
    const INTF_BLK_torqueBlock = require("lovec/temp/intf/INTF_BLK_torqueBlock");


    /* <------------------------------ component ------------------------------> */


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Base template for all torque related blocks (no producer).
         * @class BLK_baseTorqueBlock
         * @extends BLK_baseBlock
         * @extends INTF_BLK_torqueBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_baseTorqueBlock")
        .implement(INTF_BLK_torqueBlock[0])
        .initTemplate()
        .setParent(null)
        .setTags()
        .setParam({})
        .setMethod({}),


        /**
         * @class B_baseTorqueBlock
         * @extends B_baseBlock
         * @extends INTF_B_torqueBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_baseTorqueBlock")
        .implement(INTF_BLK_torqueBlock[1])
        .initTemplate()
        .setParent(null)
        .setParam({})
        .setMethod({


            write: function(wr) {
                this.self.ex_processData(wr);
            },


            read: function(rd, revi) {
                if(this.delegee.LCRevi === 5) {
                    rd.s();
                };
                this.self.ex_processData(rd);
            },


        }),


    ];
