/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<GenericCrafter, BLK_fuelLight>} BLKFuelLight
     */


    /**
     * @typedef {TemplateInstance<GenericCrafter.GenericCrafterBuild, B_fuelLight>} BFuelLight
     * @prop {BLKFuelLight} block
     */


    const PARENT = require("lovec/temp/blk/BLK_light");
    const INTF_BLK_furnaceBlock = require("lovec/temp/intf/INTF_BLK_furnaceBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKFuelLight} blk
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
     * @param {BFuelLight} b
     * @param {Table} tb
     * @return {void}
     */
    function comp_buildConfiguration(b, tb) {
        tb.row();
        b.self.ex_buildFuelSelector(tb);
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Light blocks that consume fuels, essentially a furnace.
         * @class BLK_fuelLight
         * @extends BLK_light
         * @extends INTF_BLK_furnaceBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_fuelLight")
        .implement(INTF_BLK_furnaceBlock[0])
        .initTemplate()
        .setParent("GenericCrafter")
        .setTags("blk-non-fac")
        .setParam({


            /**
             * `PARAM`: Temperature at which light radius is maximized.
             * @memberof BLK_fuelLight
             * @instance
             * @type {number}
             * @default 1000.0
             */
            maxLightTemp: 1000.0,
            /**
             * @override
             * @memberof BLK_fuelLight
             * @instance
             * @type {boolean}
             * @default false
             */
            shouldDrawHeatLight: false,


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`: Have you ever seen an externally heated light?
             * <br> `REALIZED`
             * @override
             * @memberof BLK_fuelLight
             * @instance
             * @type {number}
             */
            tempExtMtp: 0.0,
            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_fuelLight
             * @instance
             * @type {boolean}
             */
            andOperForFuelAccept: true,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


        }),


        /**
         * @class B_fuelLight
         * @extends B_light
         * @extends INTF_B_furnaceBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_fuelLight")
        .implement(INTF_BLK_furnaceBlock[1])
        .initTemplate()
        .setParent("GenericCrafter.GenericCrafterBuild")
        .setParam({})
        .setMethod({


            acceptItem: function(b_f, item) {
                return true;
            }
            .setProp({
                noSuper: true,
                boolMode: "and",
            }),


            acceptLiquid: function(b_f, liq) {
                return true;
            }
            .setProp({
                noSuper: true,
                boolMode: "and",
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


            /**
             * `REALIZED`
             * @override
             * @memberof B_fuelLight
             * @instance
             * @func
             * @return {number}
             */
            ex_getHeatTarget: function() {
                return this.block.delegee.maxLightTemp;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


    ];
