/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseFactory");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.outputsLiquid = blk.isUnpacker || (blk.outputLiquids != null && blk.outputLiquids.length > 0);

    MDL_event.onLoadPost(() => {
      if(!blk.isUnpacker) {
        global.fcell.fluidItemMap.each((liq, item) => {
          MDL_recipeDict.addFldConsTerm(blk, liq, blk.packageAmt * blk.liqPerCellItem / blk.craftTime);
          MDL_recipeDict.addItemProdTerm(blk, item, blk.packageAmt, 1.0);
        });
      } else {
        global.fcell.fluidItemMap.each((liq, item) => {
          MDL_recipeDict.addItemConsTerm(blk, item, blk.packageAmt, 1.0);
          MDL_recipeDict.addFldProdTerm(blk, liq, blk.packageAmt * blk.liqPerCellItem / blk.craftTime);
        });
      };
    });
  };


  function comp_setStats(blk) {
    blk.stats.remove(Stat.productionTime);
    blk.stats.add(Stat.productionTime, blk.craftTime / 60.0, StatUnit.seconds);
    !blk.isUnpacker ?
      blk.stats.add(fetchStat("lovec", "blk0fac-prodspd"), blk.packageAmt / blk.craftTime * 60.0, StatUnit.itemsSecond) :
      blk.stats.add(fetchStat("lovec", "blk0fac-prodspd"), blk.packageAmt * blk.liqPerCellItem / blk.craftTime * 60.0, StatUnit.liquidSecond);
  };


  function comp_setBars(blk) {
    blk.removeBar("liquid");
    blk.addLiquidBar(b => blk.isUnpacker ? b.delegee.packageOutputCur : b.delegee.packLiqCur);
  };


  function comp_updateTile(b) {
    if(TIMER.secQuarter) {
      b.justCrafted = false;
    };
    if(b.efficiency < 0.0001) {
      b.progress = 0.0;
    };

    if(b.unpackItemCur != null && b.items.get(b.unpackItemCur) < b.block.delegee.packageAmt) {
      b.unpackItemCur = null;
    };
    if(b.packLiqCur != null && b.liquids.get(b.packLiqCur) < b.block.delegee.packageAmt * b.block.delegee.liqPerCellItem) {
      b.packLiqCur = null;
    };
  };


  function comp_craft(b) {
    if(!b.block.delegee.isUnpacker) {
      LCCraftingHandler.addLiquidBatch(b, b, b.packLiqCur, -b.block.delegee.packageAmt * b.block.delegee.liqPerCellItem, true);
      FRAG_item.produceItem(b, b.packageOutputCur, b.block.delegee.packageAmt);
    } else {
      FRAG_item.consumeItem(b, b.unpackItemCur, b.block.delegee.packageAmt);
      LCCraftingHandler.addLiquidBatch(b, b, b.packageOutputCur, b.block.delegee.packageAmt * b.block.delegee.liqPerCellItem, true);
    };
    b.unpackItemCur = null;
    b.packLiqCur = null;
    b.justCrafted = true;
  };


  function comp_dumpOutputs(b) {
    if(b.packageOutputCur instanceof Item) {
      if(b.packageDumpTimer.get(b.block.dumpTime / b.timeScale)) {
        b.dump(b.packageOutputCur);
      };
    } else if(b.packageOutputCur instanceof Liquid) {
      b.dumpLiquid(b.packageOutputCur, 2.0, tryVal(b.block.liquidOutputDirections[b.block.liquidOutputDirections.length - 1], -1));
    };
  };


  function comp_shouldConsume(b) {
    return !b.block.delegee.isUnpacker ?
      (b.packLiqCur != null && b.liquids.get(b.packLiqCur) >= b.block.delegee.packageAmt * b.block.delegee.liqPerCellItem && b.items.get(b.packageOutputCur) <= b.getMaximumAccepted(b.packageOutputCur) - b.block.delegee.packageAmt) :
      (b.unpackItemCur != null && b.items.get(b.unpackItemCur) >= b.block.delegee.packageAmt && b.liquids.get(b.packageOutputCur) <= b.block.liquidCapacity - b.block.delegee.packageAmt * b.block.delegee.liqPerCellItem);
  };


  function comp_acceptItem(b, b_f, item) {
    if(b.items.get(item) >= b.getMaximumAccepted(item)) return false;
    if(b.block.consumesItem(item)) return true;
    if(!b.block.delegee.isUnpacker) return false;
    if(b.unpackItemCur != null && b.unpackItemCur !== item) return false;
    if(item.ex_getFluid == null) return false;

    b.unpackItemCur = item;
    b.packageOutputCur = item.ex_getFluid();

    return true;
  };


  function comp_acceptLiquid(b, b_f, liq) {
    if(b.liquids.get(liq) / b.block.liquidCapacity >= 0.98) return false;
    if(b.block.consumesLiquid(liq)) return true;
    if(b.block.delegee.isUnpacker) return false;
    if(b.packLiqCur != null && b.packLiqCur !== liq) return false;
    if(!global.fcell.fluidItemMap.containsKey(liq)) return false;

    b.packLiqCur = liq;
    b.packageOutputCur = global.fcell.fluidItemMap.get(liq);

    return true;
  };


  function comp_drawSelect(b) {
    LCDraw.contentIcon(b.x, b.y, b.packageOutputCur, b.block.size, 0.75);
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
    newClass().extendClass(PARENT[0], "BLK_fluidPackager").initClass()
    .setParent(GenericCrafter)
    .setTags()
    .setParam({


      /**
       * `PARAM`: Whether this block is a fluid unpacker.
       * @memberof BLK_fluidPackager
       * @instance
       */
      isUnpacker: false,
      /**
       * `PARAM`: Amount of items consumes/produced.
       * @memberof BLK_fluidPackager
       * @instance
       */
      packageAmt: 1,
      /**
       * `PARAM`: Amount of fluid for one item.
       * @memberof BLK_fluidPackager
       * @instance
       */
      liqPerCellItem: 6.0,


    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      setBars: function() {
        comp_setBars(this);
      },


      outputsItems: function() {
        return !this.isUnpacker || (this.outputItems != null && this.outputItems.length > 0);
      }
      .setProp({
        noSuper: true,
      }),


    }),


    /**
     * @class B_fluidPackager
     * @extends B_baseFactory
     */
    newClass().extendClass(PARENT[1], "B_fluidPackager").initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * `INTERNAL`
       * @memberof B_fluidPackager
       * @instance
       */
      unpackItemCur: null,
      /**
       * `INTERNAL`
       * @memberof B_fluidPackager
       * @instance
       */
      packLiqCur: null,
      /**
       * `INTERNAL`
       * @memberof B_fluidPackager
       * @instance
       */
      packageOutputCur: null,
      /**
       * `INTERNAL`
       * @memberof B_fluidPackager
       * @instance
       */
      packageDumpTimer: tprov(() => new Interval(1)),
      /**
       * `INTERNAL`
       * @memberof B_fluidPackager
       * @instance
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
        return this.justCrafted ?
          BlockStatus.active :
          this.super$status();
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      write: function(wr) {
        MDL_io.ct(wr, this.unpackItemCur);
        MDL_io.ct(wr, this.packLiqCur);
        MDL_io.ct(wr, this.packageOutputCur);
      },


      read: function(rd, revi) {
        this.unpackItemCur = MDL_io.ct(rd);
        this.packLiqCur = MDL_io.ct(rd);
        this.packageOutputCur = MDL_io.ct(rd);
      },


    }),


  ];
