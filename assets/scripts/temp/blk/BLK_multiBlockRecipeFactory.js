/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<MultiBlockCrafter, BLK_multiBlockRecipeFactory>} BLKMultiBlockRecipeFactory
     */


    /**
     * @typedef {TemplateInstance<MultiBlockCrafter.MultiBlockCrafterBuild, B_multiBlockRecipeFactory>} BMultiBlockRecipeFactory
     * @prop {BLKMultiBlockRecipeFactory} block
     */


    const PARENT = require("lovec/temp/blk/BLK_recipeFactory");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Non-square multi-crafter.
         * @class BLK_multiBlockRecipeFactory
         * @extends BLK_recipeFactory
         */
        newClass()
        .extendClass(PARENT[0], "BLK_multiBlockRecipeFactory")
        .initTemplate()
        .setParent(MultiBlockCrafter)
        .setTags()
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_multiBlockRecipeFactory
             * @instance
             * @type {ENumber}
             */
            payInputSideFracMode: SideFracModes.ALL,
            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_multiBlockRecipeFactory
             * @instance
             * @type {ENumber}
             */
            payOutputSideFracMode: SideFracModes.ALL,


        })
        .setMethod({


            setStats: function(stats) {
                this.multiBlockUpdater.setStats(getCtStats(this, stats));
            },


            /**
             * @override
             * @memberof BLK_multiBlockRecipeFactory
             * @instance
             * @func
             * @return {number}
             */
            ex_calcPayRoomDef: function() {
                this.calcMaxSize(Tmp.p1, this.size, 0);
                return Math.round((Tmp.p1.x + Tmp.p1.y) * 0.5);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_multiBlockRecipeFactory
             * @instance
             * @func
             * @return {boolean}
             */
            ex_canSwitchDisable: function() {
                return false;
            }
            .setProp({
                noSuper: true,
            }),


        }),


        /**
         * @class B_multiBlockRecipeFactory
         * @extends B_recipeFactory
         */
        newClass()
        .extendClass(PARENT[1], "B_multiBlockRecipeFactory")
        .initTemplate()
        .setParent(MultiBlockCrafterBuild)
        .setParam({})
        .setMethod({


            updateTile: function thisFun() {
                this.updateLinkedBuilds();
                thisFun.funPrev.call(this);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            shouldDrawStatus: function() {
                return this.block.enableDrawStatus;
            }
            .setProp({
                noSuper: true,
            }),


            drawStatus: function() {
                // Use Java class method instead
            }
            .setProp({
                override: true,
            }),


            /**
             * @override
             * @memberof B_multiBlockRecipeFactory
             * @instance
             * @func
             * @return {void}
             */
            ex_showRcChangeEff: function() {
                this.linkedBuilds.each(ob => GLB_eff.fadePlacePack[ob.block.size].at(ob));
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
