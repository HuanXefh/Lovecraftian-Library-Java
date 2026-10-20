/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<GenericCrafter, BLK_furnaceHeater>} BLKFurnaceHeater
     */


    /**
     * @typedef {TemplateInstance<GenericCrafter.GenericCrafterBuild, B_furnaceHeater>} BFurnaceHeater
     * @prop {BLKFurnaceHeater} block
     */


    const PARENT = require("lovec/temp/blk/BLK_heatProducer");
    const INTF_BLK_furnaceBlock = require("lovec/temp/intf/INTF_BLK_furnaceBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKFurnaceHeater} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.config(JAVA.string, (b, str) => {
            if(str.startsWith("FUEL: ")) {
                b.delegee.fuelSel = MDL_content.getCt(str.replace("FUEL: ", ""), ContentGetModes.RS);
            };
        });
    };


    /**
     * @private
     * @param {BFurnaceHeater} b
     * @param {Table} tb
     * @return {void}
     */
    function comp_buildConfiguration(b, tb) {
        tb.row();
        b.self.ex_buildFuelSelector(tb);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * @class BLK_furnaceHeater
         * @extends BLK_heatProducer
         * @extend INTF_BLK_furnaceBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_furnaceHeater")
        .implement(INTF_BLK_furnaceBlock[0])
        .initTemplate()
        .setParent(GenericCrafter)
        .setTags()
        .setParam({


            /**
            * `PARAM`: Maximum heat produced by this heater.
            * @override
            * @memberof BLK_furnaceHeater
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
         * @class B_furnaceHeater
         * @extends B_heatProducer
         * @extends INTF_B_furnaceBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_furnaceHeater")
        .implement(INTF_BLK_furnaceBlock[1])
        .initTemplate()
        .setParent(GenericCrafter.GenericCrafterBuild)
        .setParam({})
        .setMethod({


            acceptItem: function thisFun(b_f, item) {
                return thisFun.funPrev.apply(this, arguments);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            acceptLiquid: function thisFun(b_f, liq) {
                return thisFun.funPrev.apply(this, arguments);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            config: function() {
                return this.delegee.fuelSel;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            buildConfiguration: function(tb) {
                comp_buildConfiguration(this, tb);
            }
            .setProp({
                noSuper: true,
            }),


            write: function(wr) {
                this.self.ex_processData(wr);
            },


            read: function(rd, revi) {
                this.self.ex_processData(rd);
            },


            /**
             * `REALIZED`
             * @override
             * @memberof B_furnaceHeater
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
             * @memberof B_furnaceHeater
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
             * @memberof B_furnaceHeater
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
