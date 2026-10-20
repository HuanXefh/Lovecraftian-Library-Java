/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, BLK_baseFluidDistributor>} BLKBaseFluidDistributor
     */


    /**
     * @typedef {TemplateInstance<Building, B_baseFluidDistributor>} BBaseFluidDistributor
     * @prop {BLKBaseFluidDistributor} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseFluidBlock");
    const INTF_BLK_fluidTypeFilter = require("lovec/temp/intf/INTF_BLK_fluidTypeFilter");
    const INTF_BLK_corrosionAcceptor = require("lovec/temp/intf/INTF_BLK_corrosionAcceptor");
    const INTF_BLK_fluidHeatAcceptor = require("lovec/temp/intf/INTF_BLK_fluidHeatAcceptor");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKBaseFluidDistributor} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.priority = TargetPriority.transport;
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Blocks that transport fluids.
         * These blocks will be affected by most fluid-related mechanics, like corrosion.
         * @class BLK_baseFluidDistributor
         * @extends BLK_baseFluidBlock
         * @extends INTF_BLK_fluidTypeFilter
         * @extends INTF_BLK_corrosionAcceptor
         * @extends INTF_BLK_fluidHeatAcceptor
         */
        newClass()
        .extendClass(PARENT[0], "BLK_baseFluidDistributor")
        .implement(INTF_BLK_fluidTypeFilter[0])
        .implement(INTF_BLK_corrosionAcceptor[0])
        .implement(INTF_BLK_fluidHeatAcceptor[0])
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
         * @class B_baseFluidDistributor
         * @extends B_baseFluidBlock
         * @extends INTF_B_fluidTypeFilter
         * @extends INTF_B_corrosionAcceptor
         * @extends INTF_B_fluidHeatAcceptor
         */
        newClass()
        .extendClass(PARENT[1], "B_baseFluidDistributor")
        .implement(INTF_BLK_fluidTypeFilter[1])
        .implement(INTF_BLK_corrosionAcceptor[1])
        .implement(INTF_BLK_fluidHeatAcceptor[1])
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
