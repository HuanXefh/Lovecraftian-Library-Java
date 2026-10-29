/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<GenericCrafter, BLK_electricHeater>} BLKElectricHeater
     */


    /**
     * @typedef {TemplateInstance<GenericCrafter.GenericCrafterBuild, B_electricHeater>} BElectricHeater
     * @prop {BLKElectricHeater} block
     */


    const PARENT = require("lovec/temp/blk/BLK_heatProducer");
    const INTF_BLK_electricFurnaceBlock = require("lovec/temp/intf/INTF_BLK_electricFurnaceBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKElectricHeater} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.self.ex_addConfigM("tempSet", (b, val) => b.delegee.tempSet = val);
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * A heater that consumes power dynamically, with the target temperature controlled by a slider.
         * @class BLK_electricHeater
         * @extends BLK_heatProducer
         * @extend INTF_BLK_electricFurnaceBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_electricHeater")
        .implement(INTF_BLK_electricFurnaceBlock[0])
        .initTemplate()
        .setParent("GenericCrafter")
        .setTags()
        .setParam({


            /**
             * @inheritdoc
             * @memberof BLK_electricHeater
             * @instance
             * @type {number}
             */
            heatProd: 100.0,


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_furnaceHeater
             * @instance
             * @type {boolean}
             */
            useAndOperForAccept: true,
            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_furnaceHeater
             * @instance
             * @type {boolean}
             */
            skipHeatFetch: true,
            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_furnaceHeater
             * @instance
             * @type {boolean}
             */
            skipHeatSupply: false,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


        }),


        /**
         * @class B_electricHeater
         * @extends B_heatProducer
         * @extends INTF_B_electricFurnaceBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_electricHeater")
        .implement(INTF_BLK_electricFurnaceBlock[1])
        .initTemplate()
        .setParent("GenericCrafter.GenericCrafterBuild")
        .setParam({})
        .setMethod({


            write: function(wr) {
                this.self.ex_processData(wr);
            },


            read: function(rd, revi) {
                this.self.ex_processData(rd);
            },


            /**
             * `REALIZED`
             * @override
             * @memberof B_electricHeater
             * @instance
             * @func
             * @return {number}
             */
            ex_calcHeatSupplied: function() {
                return this.self.ex_getHeatProd();
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof B_electricHeater
             * @instance
             * @func
             * @return {number}
             */
            ex_getHeatTarget: function() {
                return this.delegee.blk$heatProd;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof B_electricHeater
             * @instance
             * @func
             * @return {number}
             */
            ex_getTempSetMax: function() {
                return this.delegee.blk$heatProd * this.block.delegee.maxOverheatScl;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof B_electricHeater
             * @instance
             * @func
             * @return {number}
             * @lovecAttached
             */
            ex_getHeatProd: function() {
                return Math.min(this.delegee.tempCur, this.delegee.blk$heatProd);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


    ];
