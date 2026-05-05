/*
  ========================================
  Section: Application
  ========================================
*/




  MDL_event._c_onPostRun(() => {


    MDL_event._c_onLoad(() => {
      Core.app.post(() => {
        try {
          Vars.content.blocks().each(blk => {
            if(tryFun(blk.ABL, blk, false)) {
              blk.getrecm().forEachFast(rcObj => {
                rcObj.input.item.forEachFast(itmObj => MDL_recipeDict.addItmConsTerm(blk, itmObj.item, itmObj.amo, 1.0, {time: rcObj.crafttime}));
                rcObj.input.oritem.forEachFast(itmObj => MDL_recipeDict.addItmConsTerm(blk, itmObj.item, itmObj.amo, 1.0, {time: rcObj.crafttime}));
                rcObj.input.liquid.forEachFast(liqObj => MDL_recipeDict.addFldConsTerm(blk, liqObj.liquid, liqObj.amo / rcObj.crafttime));
                rcObj.input.orliquid.forEachFast(liqObj => MDL_recipeDict.addFldConsTerm(blk, liqObj.liquid, liqObj.amo / rcObj.crafttime));
                rcObj.input.boostliquid.forEachFast(liqObj => MDL_recipeDict.addFldConsTerm(blk, liqObj.liquid, liqObj.amo / rcObj.crafttime, {icon: "lovec-icon-boost"}));
                rcObj.input.cat.forEachFast(itmObj => MDL_recipeDict.addItmConsTerm(blk, itmObj.item, itmObj.amo, 1.0, {time: Infinity, icon: "lovec-icon-boost"}));
                rcObj.output.item.forEachFast(itmObj => MDL_recipeDict.addItmProdTerm(blk, itmObj.item, itmObj.amo, 1.0, {time: rcObj.crafttime}));
                rcObj.output.productitem.forEachFast(itmObj => MDL_recipeDict.addItmProdTerm(blk, itmObj.item, itmObj.amo, 1.0, {time: rcObj.crafttime}));
                rcObj.output.resultBoostFromOrItem.forEachFast(itmObj => MDL_recipeDict.addItmProdTerm(blk, itmObj.item, itmObj.amo, 1.0, {time: rcObj.crafttime}));
                rcObj.output.result.forEachFast(itmObj => MDL_recipeDict.addItmProdTerm(blk, itmObj.item, 1, itmObj.amo, {time: rcObj.crafttime}));
                rcObj.output.liquid.forEachFast(liqObj => MDL_recipeDict.addFldProdTerm(blk, liqObj.liquid, liqObj.amo / rcObj.crafttime));
                rcObj.output.productliquid.forEachFast(liqObj => MDL_recipeDict.addFldProdTerm(blk, liqObj.liquid, liqObj.amo / rcObj.crafttime));
                rcObj.output.resultBoostFromOrLiquid.forEachFast(liqObj => MDL_recipeDict.addFldProdTerm(blk, liqObj.liquid, liqObj.amo / rcObj.crafttime));
              });
            };
          });
          console.log("[LOVEC] Registered recipes from GI to recipe dictionary.");
        } catch(err) {
          console.warn("[LOVEC] Failed to process recipes from GI:\n" + err);
        };
      });
    });


  }, 25312127);
