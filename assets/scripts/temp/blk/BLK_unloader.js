/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Unloader, BLK_unloader>} BLKUnloader
     */


    /**
     * @typedef {TemplateInstance<Unloader.UnloaderBuild, B_unloader>} BUnloader
     * @prop {BLKUnloader} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseItemGate");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKUnloader} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.group = BlockGroup.transportation;
    };


    /**
     * @private
     * @param {BUnloader} b
     * @param {Table} tb
     * @return {void}
     */
    function comp_buildConfiguration(b, tb) {
        MDL_table.setCtSelect(
            tb, b.block, GLB_varGen.allItems,
            () => b.sortItem, val => b.configure(val),
            null,
            {rowAmt: b.block.selectionRows, colAmt: b.block.selectionColumns, closeSelect: false},
        );
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Serpulo unloader.
         * <br> `SINGLESIZE`
         * @class BLK_unloader
         * @extends BLK_baseItemGate
         */
        newClass()
        .extendClass(PARENT[0], "BLK_unloader")
        .initTemplate()
        .setParent("Unloader")
        .setTags()
        .setParam({})
        .setMethod({


            init: function() {
                comp_init(this);
            },


        }),


        /**
         * @class B_unloader
         * @extends B_baseItemGate
         */
        newClass()
        .extendClass(PARENT[1], "B_unloader")
        .initTemplate()
        .setParent("Unloader.UnloaderBuild")
        .setParam({})
        .setMethod({


            buildConfiguration: function(tb) {
                comp_buildConfiguration(this, tb);
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
