/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<GenericCrafter, BLK_pressurePump>} BLKPressurePump
     */


    /**
     * @typedef {TemplateInstance<GenericCrafter.GenericCrafterBuild, B_pressurePump>} BPressurePump
     * @prop {BLKPressurePump} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseFactory");
    const INTF_BLK_pressureProducer = require("lovec/temp/intf/INTF_BLK_pressureProducer");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKPressurePump} blk
     * @return {void}
     */
    function comp_init(blk) {
        // Forced to true for proper blending
        blk.outputsLiquid = true;
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * A crafter that produces pressure/vacuum.
         * Torque/heat can be produced by a crafter as abstract fluid, but it's different for pressure/vacuum since pressure producers are not all crafters.
         * @class BLK_pressurePump
         * @extends BLK_baseFactory
         * @extends INTF_BLK_pressureProducer
         */
        newClass()
        .extendClass(PARENT[0], "BLK_pressurePump")
        .implement(INTF_BLK_pressureProducer[0])
        .initTemplate()
        .setParent("GenericCrafter")
        .setTags("blk-non-fac")
        .setParam({})
        .setMethod({


            init: function() {
                comp_init(this);
            },


        }),


        /**
         * @class B_pressurePump
         * @extends B_baseFactory
         * @extends INTF_B_pressureProducer
         */
        newClass()
        .extendClass(PARENT[1], "B_pressurePump")
        .implement(INTF_BLK_pressureProducer[1])
        .initTemplate()
        .setParent("GenericCrafter.GenericCrafterBuild")
        .setParam({})
        .setMethod({}),


    ];
