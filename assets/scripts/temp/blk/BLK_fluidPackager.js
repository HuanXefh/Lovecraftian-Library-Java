/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<GenericCrafter, BLK_fluidPackager>} BLKFluidPackager
     */


    /**
     * @typedef {TemplateInstance<GenericCrafter.GenericCrafterBuild, B_fluidPackager>} BFluidPackager
     * @prop {BLKFluidPackager} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseFactory");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKFluidPackager} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.outputsLiquid = blk.delegee.isUnpacker || (blk.outputLiquids != null && blk.outputLiquids.length > 0);

        MDL_event.onLoadPost(() => {
            if(!blk.delegee.isUnpacker) {
                global.fcell.eachPair((liq, item) => {
                    MDL_recipeDict.addFldConsTerm(blk, liq, blk.delegee.packageAmt * blk.delegee.liqPerCellItem / blk.craftTime, {hidden: true});
                    MDL_recipeDict.addItemProdTerm(blk, item, blk.delegee.packageAmt, 1.0, {hidden: true});
                });
            } else {
                global.fcell.eachPair((liq, item) => {
                    MDL_recipeDict.addItemConsTerm(blk, item, blk.delegee.packageAmt, 1.0, {hidden: true});
                    MDL_recipeDict.addFldProdTerm(blk, liq, blk.delegee.packageAmt * blk.delegee.liqPerCellItem / blk.craftTime, {hidden: true});
                });
            };
        });
    };


    /**
     * @private
     * @param {BLKFluidPackager} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.remove(Stat.productionTime);
        stats.add(Stat.productionTime, blk.craftTime / 60.0, StatUnit.seconds);
        !blk.delegee.isUnpacker ?
            stats.add(fetchStat("lovec", "blk0fac-prodspd"), blk.delegee.packageAmt / blk.craftTime * 60.0, StatUnit.itemsSecond) :
            stats.add(fetchStat("lovec", "blk0fac-prodspd"), blk.delegee.packageAmt * blk.delegee.liqPerCellItem / blk.craftTime * 60.0, StatUnit.liquidSecond);
    };


    /**
     * @private
     * @param {BLKFluidPackager} blk
     * @return {void}
     */
    function comp_setBars(blk) {
        blk.removeBar("liquid");
        blk.addLiquidBar(b => blk.delegee.isUnpacker ? b.delegee.packageOutputCur : b.delegee.packLiqCur);
    };


    /**
     * @private
     * @param {BFluidPackager} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(GLB_timer.secQuarter) {
            b.delegee.justCrafted = false;
        };
        if(b.efficiency < 0.0001) {
            b.progress = 0.0;
        };

        if(b.delegee.unpackItemCur != null && b.items.get(b.delegee.unpackItemCur) < b.block.delegee.packageAmt) {
            b.delegee.unpackItemCur = null;
        };
        if(b.delegee.packLiqCur != null && b.liquids.get(b.delegee.packLiqCur) < b.block.delegee.packageAmt * b.block.delegee.liqPerCellItem) {
            b.delegee.packLiqCur = null;
        };
    };


    /**
     * @private
     * @param {BFluidPackager} b
     * @return {void}
     */
    function comp_craft(b) {
        if(!b.block.delegee.isUnpacker) {
            LCCraftingHandler.addLiquidBatch(b, b, b.delegee.packLiqCur, -b.block.delegee.packageAmt * b.block.delegee.liqPerCellItem, true);
            FRAG_item.produceItem(b, b.delegee.packageOutputCur, b.block.delegee.packageAmt);
        } else {
            FRAG_item.consumeItem(b, b.delegee.unpackItemCur, b.block.delegee.packageAmt);
            LCCraftingHandler.addLiquidBatch(b, b, b.delegee.packageOutputCur, b.block.delegee.packageAmt * b.block.delegee.liqPerCellItem, true);
        };
        b.delegee.unpackItemCur = null;
        b.delegee.packLiqCur = null;
        b.delegee.justCrafted = true;
    };


    /**
     * @private
     * @param {BFluidPackager} b
     * @return {void}
     */
    function comp_dumpOutputs(b) {
        if(b.delegee.packageOutputCur instanceof Item) {
            if(b.delegee.packageDumpTimer.get(b.block.dumpTime / b.timeScale)) {
                b.dump(b.delegee.packageOutputCur);
            };
        } else if(b.delegee.packageOutputCur instanceof Liquid) {
            b.dumpLiquid(b.delegee.packageOutputCur, 2.0, tryVal(b.block.liquidOutputDirections[b.block.liquidOutputDirections.length - 1], -1));
        };
    };


    /**
     * @private
     * @param {BFluidPackager} b
     * @return {boolean}
     */
    function comp_shouldConsume(b) {
        return !b.block.delegee.isUnpacker ?
            (b.delegee.packLiqCur != null && b.liquids.get(b.delegee.packLiqCur) >= b.block.delegee.packageAmt * b.block.delegee.liqPerCellItem && b.items.get(b.delegee.packageOutputCur) <= b.getMaximumAccepted(b.delegee.packageOutputCur) - b.block.delegee.packageAmt) :
            (b.delegee.unpackItemCur != null && b.items.get(b.delegee.unpackItemCur) >= b.block.delegee.packageAmt && b.liquids.get(b.delegee.packageOutputCur) <= b.block.liquidCapacity - b.block.delegee.packageAmt * b.block.delegee.liqPerCellItem);
    };


    /**
     * @private
     * @param {BFluidPackager} b
     * @param {Building} b_f
     * @param {Item} item
     * @return {boolean}
     */
    function comp_acceptItem(b, b_f, item) {
        if(b.items.get(item) >= b.getMaximumAccepted(item)) return false;
        if(b.block.consumesItem(item)) return true;
        if(!b.block.delegee.isUnpacker) return false;
        if(b.delegee.unpackItemCur != null && b.delegee.unpackItemCur !== item) return false;
        if(!global.fcell.isCell(item)) return false;

        b.delegee.unpackItemCur = item;
        b.delegee.packageOutputCur = item.self.ex_getFluid();

        return true;
    };


    /**
     * @private
     * @param {BFluidPackager} b
     * @param {Building} b_f
     * @param {Liquid} liq
     * @return {boolean}
     */
    function comp_acceptLiquid(b, b_f, liq) {
        if(b.liquids.get(liq) / b.block.liquidCapacity >= 0.98) return false;
        if(b.block.consumesLiquid(liq)) return true;
        if(b.block.delegee.isUnpacker) return false;
        if(b.delegee.packLiqCur != null && b.delegee.packLiqCur !== liq) return false;
        if(!global.fcell.hasCell(liq)) return false;

        b.delegee.packLiqCur = liq;
        b.delegee.packageOutputCur = global.fcell.getCell(liq);

        return true;
    };


    /**
     * @private
     * @param {BFluidPackager} b
     * @return {void}
     */
    function comp_drawSelect(b) {
        LCDraw.contentIcon(b.x, b.y, b.delegee.packageOutputCur, b.block.size, 0.75);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Converts fluid into cell item.
         * <br> `IMPORTANT`: Requires Fluid Cells mod.
         * @class BLK_fluidPackager
         * @extends BLK_baseFactory
         */
        newClass()
        .extendClass(PARENT[0], "BLK_fluidPackager")
        .initTemplate()
        .setParent("GenericCrafter")
        .setTags()
        .setParam({


            /**
             * `PARAM`: Whether this block is a fluid unpacker (cell item to fluid).
             * @memberof BLK_fluidPackager
             * @instance
             * @type {boolean}
             */
            isUnpacker: false,
            /**
             * `PARAM`: Amount of items consumes/produced.
             * @memberof BLK_fluidPackager
             * @instance
             * @type {number}
             */
            packageAmt: 1,
            /**
             * `PARAM`: Amount of fluid for one cell item.
             * @memberof BLK_fluidPackager
             * @instance
             * @type {number}
             */
            liqPerCellItem: 6.0,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            setBars: function() {
                comp_setBars(this);
            },


            outputsItems: function() {
                return !this.delegee.isUnpacker || (this.outputItems != null && this.outputItems.length > 0);
            }
            .setProp({
                noSuper: true,
            }),


        }),


        /**
         * @class B_fluidPackager
         * @extends B_baseFactory
         */
        newClass()
        .extendClass(PARENT[1], "B_fluidPackager")
        .initTemplate()
        .setParent("GenericCrafter.GenericCrafterBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_fluidPackager
             * @instance
             * @type {Item|null}
             */
            unpackItemCur: null,
            /**
             * `INTERNAL`
             * @memberof B_fluidPackager
             * @instance
             * @type {Liquid|null}
             */
            packLiqCur: null,
            /**
             * `INTERNAL`
             * @memberof B_fluidPackager
             * @instance
             * @type {Resource|null}
             */
            packageOutputCur: null,
            /**
             * `INTERNAL`
             * @memberof B_fluidPackager
             * @instance
             * @type {TDynamic<Interval>}
             */
            packageDumpTimer: tprov(() => new Interval(1)),
            /**
             * `INTERNAL`
             * @memberof B_fluidPackager
             * @instance
             * @type {boolean}
             */
            justCrafted: false,


        })
        .setMethod({


            updateTile: function() {
                comp_updateTile(this);
            },


            craft: function() {
                comp_craft(this);
            },


            dumpOutputs: function() {
                comp_dumpOutputs(this);
            },


            shouldConsume: function() {
                return comp_shouldConsume(this);
            }
            .setProp({
                boolMode: "and",
            }),


            acceptItem: function(b_f, item) {
                return comp_acceptItem(this, b_f, item);
            }
            .setProp({
                noSuper: true,
                boolMode: "and",
            }),


            acceptLiquid: function(b_f, liq) {
                return comp_acceptLiquid(this, b_f, liq);
            }
            .setProp({
                noSuper: true,
                boolMode: "and",
            }),


            drawSelect: function() {
                comp_drawSelect(this);
            },


            status: function() {
                return this.delegee.justCrafted ?
                    BlockStatus.active :
                    this.super$status();
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            write: function(wr) {
                MDL_io.ct(wr, this.delegee.unpackItemCur);
                MDL_io.ct(wr, this.delegee.packLiqCur);
                MDL_io.ct(wr, this.delegee.packageOutputCur);
            },


            read: function(rd, revi) {
                this.delegee.unpackItemCur = MDL_io.ct(rd);
                this.delegee.packLiqCur = MDL_io.ct(rd);
                this.delegee.packageOutputCur = MDL_io.ct(rd);
            },


        }),


    ];
