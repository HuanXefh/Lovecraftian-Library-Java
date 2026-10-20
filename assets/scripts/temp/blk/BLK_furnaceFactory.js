/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<GenericCrafter, BLK_furnaceFactory>} BLKFurnaceFactory
     */


    /**
     * @typedef {TemplateInstance<GenericCrafter.GenericCrafterBuild, B_furnaceFactory>} BFurnaceFactory
     * @prop {BLKFurnaceFactory} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseFactory");
    const INTF_BLK_furnaceBlock = require("lovec/temp/intf/INTF_BLK_furnaceBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKFurnaceFactory} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.add(fetchStat("lovec", "blk0heat-tempreq"), blk.delegee.tempReq, fetchStatUnit("lovec", "heatunits"));
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Crafters with generalized fuel consumption.
         * @class BLK_furnaceFactory
         * @extends BLK_baseFactory
         * @extends INTF_BLK_furnaceBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_furnaceFactory")
        .implement(INTF_BLK_furnaceBlock[0])
        .initTemplate()
        .setParent(GenericCrafter)
        .setTags()
        .setParam({


            /**
             * `PARAM`: Temperature required.
             * @memberof BLK_furnaceFactory
             * @instance
             * @type {number}
             */
            tempReq: 100.0,


        })
        .setMethod({


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


        }),


        /**
         * @class B_furnaceFactory
         * @extends B_baseFactory
         * @extends INTF_B_furnaceBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_furnaceFactory")
        .implement(INTF_BLK_furnaceBlock[1])
        .initTemplate()
        .setParent(GenericCrafter.GenericCrafterBuild)
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


            /**
             * `REALIZED`
             * @override
             * @memberof B_boiler
             * @instance
             * @func
             * @return {number}
             */
            ex_getHeatTarget: function() {
                return this.block.delegee.tempReq;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


    ];
