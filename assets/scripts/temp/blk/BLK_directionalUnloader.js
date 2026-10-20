/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<DirectionalUnloader, BLK_directionalUnloader>} BLKDirectionalUnloader
     */


    /**
     * @typedef {TemplateInstance<DirectionalUnloader.DirectionalUnloaderBuild, B_directionalUnloader>} BDirectionalUnloader
     * @prop {BLKDirectionalUnloader} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseItemGate");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BDirectionalUnloader} b
     * @param {Table} tb
     * @return {void}
     */
    function comp_buildConfiguration(b, tb) {
        MDL_table.setCtSelect(
            tb, b.block, GLB_varGen.allItems,
            () => b.unloadItem, val => b.configure(val),
            null,
            {rowAmt: b.block.selectionRows, colAmt: b.block.selectionColumns, closeSelect: false},
        );
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Erekir unloader.
         * <br> `SINGLESIZE`
         * @class BLK_directionalUnloader
         * @extends BLK_baseItemGate
         */
        newClass()
        .extendClass(PARENT[0], "BLK_directionalUnloader")
        .initTemplate()
        .setParent(DirectionalUnloader)
        .setTags()
        .setParam({


            /* <------------------------------ vanilla ------------------------------> */


            isDuct: false,
            regionRotated1: 1,


        })
        .setMethod({


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_directionalUnloader
             * @instance
             * @func
             * @return {boolean}
             */
            ex_noSideOutput: function() {
                return true;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


        /**
         * @class B_directionalUnloader
         * @extends B_baseItemGate
         */
        newClass().extendClass(PARENT[1], "B_directionalUnloader").initClass()
        .setParent(DirectionalUnloader.DirectionalUnloaderBuild)
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
