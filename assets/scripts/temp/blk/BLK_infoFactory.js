/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<GenericCrafter, BLK_infoFactory>} BLKInfoFactory
     */


    /**
     * @typedef {TemplateInstance<GenericCrafter.GenericCrafterBuild, B_infoFactory>} BInfoFactory
     * @prop {BLKInfoFactory} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseFactory");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BInfoFactory} b
     * @return {void}
     */
    function comp_craft(b) {
        if(b.block.delegee.infoF != null) {
            b.delegee.infoCur = b.block.delegee.infoF.get(b);
        };
    };


    /**
     * @private
     * @param {BInfoFactory} b
     * @return {void}
     */
    function comp_drawSelect(b) {
        if(b.delegee.infoCur != null) {
            SLCDrawf.textSelect(b, b.delegee.infoCur, b.efficiency > 0.0001, b.block.delegee.infoOffTy);
        };
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * A crafter that updates some information every time it crafts.
         * @class BLK_infoFactory
         * @extends BLK_baseFactory
         */
        newClass()
        .extendClass(PARENT[0], "BLK_infoFactory")
        .initTemplate()
        .setParent("GenericCrafter")
        .setTags()
        .setParam({


            /**
             * `PARAM`: Gets information to display.
             * <br> `ARGS`: b.
             * @memberof BLK_infoFactory
             * @instance
             * @type {Func<Building, String|null>}
             */
            infoF: null,
            /**
             * `PARAM`: Integer offset for information text.
             * @memberof BLK_infoFactory
             * @instance
             * @type {number}
             */
            infoOffTy: 0,


        })
        .setMethod({}),


        /**
         * @class B_infoFactory
         * @extends B_baseFactory
         */
        newClass()
        .extendClass(PARENT[1], "B_infoFactory")
        .initTemplate()
        .setParent("GenericCrafter.GenericCrafterBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_infoFactory
             * @instance
             * @type {String|null}
             */
            infoCur: null,


        })
        .setMethod({


            craft: function() {
                comp_craft(this);
            },


            drawSelect: function() {
                comp_drawSelect(this);
            },


        }),


    ];
