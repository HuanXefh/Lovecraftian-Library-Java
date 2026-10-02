/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<ArmoredConduit, BLK_armoredFluidPipe>} BLKArmoredFluidPipe
     */


    /**
     * @typedef {TemplateInstance<ArmoredConduit.ArmoredConduitBuild, B_armoredFluidPipe>} BArmoredFluidPipe
     * @prop {BLKArmoredFluidPipe} block
     */


    const PARENT = require("lovec/temp/blk/BLK_fluidPipe");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Similar to vanilla armored conduit.
         * <br> `SINGLESIZE`
         * @class BLK_armoredFluidPipe
         * @extends BLK_fluidPipe
         */
        newClass()
        .extendClass(PARENT[0], "BLK_armoredFluidPipe")
        .initTemplate()
        .setParent(ArmoredConduit)
        .setTags()
        .setParam({})
        .setMethod({


            blends: function() {
                // No need to modify this for armored conduit, use vanilla method only
                return true;
            }
            .setProp({
                override: true,
                boolMode: "and",
            }),


        }),


        /**
         * @class B_armoredFluidPipe
         * @extends B_fluidPipe
         */
        newClass()
        .extendClass(PARENT[1], "B_armoredFluidPipe")
        .initTemplate()
        .setParent(ArmoredConduit.ArmoredConduitBuild)
        .setParam({})
        .setMethod({}),


    ];
