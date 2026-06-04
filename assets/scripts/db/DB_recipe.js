/**
 * Database of recipe data.
 */


const db = {


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  dict: {


    reader: {


      /**
       * Used to read a particular consumer for recipe dictionary.
       * The Java class can be a consumer class or block class.
       * <br> <ROW>: javaCls, rcReader.
       * <br> <ARGS>: blk, cons, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp.
       */
      consume: [

        /* <---------- item ----------> */

        ConsumeItemFilter, (blk, cons, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          Vars.content.items().each(itm => {
            if(blk.itemFilter[itm.id]) dictConsItm[itm.id].push(blk, 1, {});
          });
        },

        ConsumeItems, (blk, cons, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          cons.items.forEachFast(itmStack => dictConsItm[itmStack.item.id].push(blk, itmStack.amount, {icon: cons.optional ? "lovec-icon-boost" : null}));
        },

        ConsumeItemFlammable, (blk, cons, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          Vars.content.items().each(itm => itm.flammability >= cons.minFlammability, itm => dictConsItm[itm.id].push(blk, 1, {}));
        },

        ConsumeItemExplosive, (blk, cons, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          Vars.content.items().each(itm => itm.explosiveness >= cons.minExplosiveness && !(consFlam != null && itm.flammability >= consFlam.minFlammability), itm => dictConsItm[itm.id].push(blk, 1, {}));
        },

        ConsumeItemRadioactive, (blk, cons, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          Vars.content.items().each(itm => itm.radioactivity >= cons.minRadioactivity, itm => dictConsItm[itm.id].push(blk, 1, {}));
        },

        ConsumeItemCharged, (blk, cons, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          Vars.content.items().each(itm => itm.charge >= cons.minCharge, itm => dictConsItm[itm.id].push(blk, 1, {}));
        },

        ConsumeItemExplode, (blk, cons, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          // Do nothing
        },

        /* <---------- liquid ----------> */

        ConsumeLiquidFilter, (blk, cons, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          Vars.content.liquids().each(liq => {
            if(blk.liquidFilter[liq.id]) dictConsFld[liq.id].push(blk, cons.amount, {});
          });
        },

        ConsumeLiquid, (blk, cons, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          if(blk instanceof LandingPad) {
            // Why is it not another consumer class...
            dictConsFld[blk.consumeLiquid.id].push(blk, blk.consumeLiquidAmount / blk.cooldownTime, {});
          } else {
            dictConsFld[cons.liquid.id].push(blk, cons.amount, {icon: cons.optional ? "lovec-icon-boost" : null});
          };
        },

        ConsumeLiquids, (blk, cons, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          cons.liquids.forEachFast(liqStack => dictConsFld[liqStack.liquid.id].push(blk, liqStack.amount, {icon: cons.optional ? "lovec-icon-boost" : null}));
        },

        ConsumeCoolant, (blk, cons, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          Vars.content.liquids().each(liq => liq.coolant && (!liq.gas && cons.allowLiquid || liq.gas && cons.allowGas) && liq.temperature <= cons.maxTemp && liq.flammability < cons.maxFlammability, liq => {
            dictConsFld[liq.id].push(blk, cons.amount, {icon: "lovec-icon-coolant"});
          });
        },

        ConsumeLiquidFlammable, (blk, cons, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          Vars.content.liquids().each(liq => liq.flammability >= cons.minFlammability, liq => dictConsFld[liq.id].push(blk, cons.amount, {}));
        },

        /* <---------- payload ----------> */

        ConsumePayloads, (blk, cons, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          cons.payloads.each(payStack => {
            (payStack.item instanceof Block ? dictConsBlk : dictConsUtp)[payStack.item.id].push(blk, payStack.amount, {});
          });
        },

        /* <---------- block ----------> */

        UnitFactory, (blk, cons, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          blk.plans.each(uPlan => {
            uPlan.requirements.forEachFast(itmStack => {
              dictConsItm[itmStack.item.id].push(blk, itmStack.amount, {time: uPlan.time, ct: uPlan.unit});
            });
          });
        },

        UnitAssembler, (blk, cons, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          blk.plans.each(uPlan => {
            if(uPlan.itemReq != null) uPlan.itemReq.forEachFast(itmStack => {
              dictConsItm[itmStack.item.id].push(blk, itmStack.amount, {time: uPlan.time, ct: uPlan.unit});
            });
            if(uPlan.liquidReq != null) uPlan.liquidReq.forEachFast(liqStack => {
              dictConsFld[liqStack.liquid.id].push(blk, liqStack.amount, {ct: uPlan.unit});
            });
            if(uPlan.requirements != null) uPlan.requirements.each(payStack => {
              (payStack.item instanceof Block ? dictConsBlk : dictConsUtp)[payStack.item.id].push(blk, payStack.amount, {time: uPlan.time, ct: uPlan.unit});
            });
          });
        },

        Reconstructor, (blk, cons, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          blk.upgrades.each(arr => {
            dictConsUtp[arr[0].id].push(blk, 1, {ct: arr[1]});
          });
        },

      ],


      /**
       * Used to read a particular block class to get production list for recipe dictionary.
       * <br> <ROW>: javaCls, rcReader.
       * <br> <ARGS>: blk, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp.
       */
      produce: [

        Drill, (blk, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          if(tryJsProp(blk, "shouldDropPay", false)) return;
          Vars.content.items().each(itm => itm.hardness <= blk.tier && !((blk.blockedItems != null && blk.blockedItems.contains(itm)) || ((blk.blockedItems == null || blk.blockedItems.size === 0) && tryJsProp(blk, "itmWhiteList") != null && !tryJsProp(blk, "itmWhiteList").includes(itm))) && Vars.content.blocks().toArray().some(oblk => ((oblk instanceof Floor && !(oblk instanceof OverlayFloor)) || (oblk instanceof OverlayFloor && !oblk.wallOre)) && oblk.itemDrop === itm), itm => dictProdItm[itm.id].push(blk, Math.pow(blk.size, 2) * (blk instanceof BurstDrill ? 1.0 : blk.drillTime / blk.getDrillTime(itm)) * tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), {icon: "lovec-icon-mining"}));
        },

        BeamDrill, (blk, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          if(tryJsProp(blk, "shouldDropPay", false)) return;
          Vars.content.items().each(itm => itm.hardness <= blk.tier && !((blk.blockedItems != null && blk.blockedItems.contains(itm)) || ((blk.blockedItems == null || blk.blockedItems.size === 0) && tryJsProp(blk, "itmWhiteList") != null && !tryJsProp(blk, "itmWhiteList").includes(itm))) && Vars.content.blocks().toArray().some(oblk => (oblk instanceof Prop || oblk instanceof TallBlock || (oblk instanceof OverlayFloor && oblk.wallOre)) && oblk.itemDrop === itm), itm => dictProdItm[itm.id].push(blk, blk.size * tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), {icon: "lovec-icon-mining"}));
        },

        WallCrafter, (blk, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          dictProdItm[blk.output.id].push(blk, tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), {icon: "lovec-icon-mining"});
        },

        Pump, (blk, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          Vars.content.liquids().each(liq => Vars.content.blocks().toArray().some(blk => blk instanceof Floor && blk.liquidDrop === liq), liq => dictProdFld[liq.id].push(blk, blk.pumpAmount * Math.pow(blk.size, 2) * tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), {icon: "lovec-icon-pumping"}));
        },

        SolidPump, (blk, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          dictProdFld[blk.result.id].push(blk, blk.pumpAmount * Math.pow(blk.size, 2) * tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), {icon: "lovec-icon-pumping"});
        },

        ConsumeGenerator, (blk, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          if(blk.outputLiquid != null) dictProdFld[blk.outputLiquid.liquid.id].push(blk, blk.outputLiquid.amount * tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), {});
        },

        ThermalGenerator, (blk, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          if(blk.outputLiquid != null) dictProdFld[blk.outputLiquid.liquid.id].push(blk, blk.outputLiquid.amount * Math.pow(blk.size, 2) * tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), {});
        },

        GenericCrafter, (blk, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          if(blk.outputItems != null) blk.outputItems.forEachFast(itmStack => dictProdItm[itmStack.item.id].push(blk, itmStack.amount * tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), {}));
          if(blk.outputLiquids != null) blk.outputLiquids.forEachFast(liqStack => dictProdFld[liqStack.liquid.id].push(blk, liqStack.amount * tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), {}));
        },

        Constructor, (blk, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          Vars.content.blocks().each(
            oblk => oblk.synthetic() && !(oblk instanceof CoreBlock) && oblk.size >= blk.minBlockSize && oblk.size <= blk.maxBlockSize && (blk.filter.size === 0 || blk.filter.contains(oblk)),
            oblk => dictProdBlk[oblk.id].push(blk, tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), {time: oblk.buildTime / blk.buildSpeed}),
          );
        },

        UnitFactory, (blk, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          blk.plans.each(uPlan => {
            dictProdUtp[uPlan.unit.id].push(blk, tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), {time: uPlan.time});
          });
        },

        UnitAssembler, (blk, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          blk.plans.each(uPlan => {
            dictProdUtp[uPlan.unit.id].push(blk, tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), {time: uPlan.time});
          });
        },

        Reconstructor, (blk, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          blk.upgrades.each(arr => {
            dictProdUtp[arr[1].id].push(blk, tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), {ct: arr[0]});
          });
        },

      ],


    },


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  oreDict: {


    /**
     * Used to generate default files for ore dictionary.
     * For other mods, simply put .csv files in "Mindustry/saves/mods/data/sharedData/ore-dict".
     * DO NOT MODIFY THIS IN OTHER MODS!
     * <br> <ROW>: rsTg, rss.
     */
    def: [

      "beryllium", [],
      "blast-compound", [],
      "carbide", [],
      "coal", ["loveclab-item0chem-coal"],
      "copper", ["loveclab-item0chem-copper"],
      "graphite", ["loveclab-item0chem-graphite"],
      "lead", ["loveclab-item0chem-lead"],
      "metaglass", ["loveclab-item0buil-glass"],
      "oxide", [],
      "phase-fabric", [],
      "plastanium", [],
      "pyratite", [],
      "sand", ["loveclab-item0ore-sand"],
      "scrap", ["loveclab-item0was-scrap-steel"],
      "spore-pod", [],
      "surge-alloy", [],
      "silicon", [],
      "thorium", [],
      "titanium", [],
      "tungsten", [],

      "arkycite", [],
      "cryofluid", [],
      "neoplasm", [],
      "oil", ["loveclab-liq0ore-crude-oil"],
      "slag", [],
      "water", ["loveclab-liq0ore-water"],

      "cyanogen", [],
      "hydrogen", ["loveclab-gas0chem-hydrogen"],
      "nitrogen", ["loveclab-gas0chem-nitrogen"],
      "ozone", ["loveclab-gas0chem-ozone"],

    ],


    setter: {


      /**
       * Used to modify consumers for ore dictionary.
       * <br> <ROW>: javaCls, setter.
       * <br> <ARGS>: blk, cons, oreDict.
       */
      consume: [

        ConsumeItems, (blk, cons, oreDict) => {
          cons.items.forEachFast(itmStack => {
            itmStack.item = oreDict.get(itmStack.item, itmStack.item);
          });
        },

        ConsumeLiquids, (blk, cons, oreDict) => {
          cons.liquids.forEachFast(liqStack => {
            liqStack.liquid = oreDict.get(liqStack.liquid, liqStack.liquid);
          });
        },

      ],


      /**
       * Used to modify producers for ore dictionary.
       * <br> <ROW>: javaCls, setter.
       * <br> <ARGS>: blk, oreDict.
       */
      produce: [

        WallCrafter, (blk, oreDict) => {
          blk.output = oreDict.get(blk.output, blk.output);
        },

        SolidPump, (blk, oreDict) => {
          blk.result = oreDict.get(blk.result, blk.result);
        },

        ConsumeGenerator, (blk, oreDict) => {
          if(blk.outputLiquid != null) blk.outputLiquid.liquid = oreDict.get(blk.outputLiquid.liquid, blk.outputLiquid.liquid);
        },

        ThermalGenerator, (blk, oreDict) => {
          if(blk.outputLiquid != null) blk.outputLiquid.liquid = oreDict.get(blk.outputLiquid.liquid, blk.outputLiquid.liquid);
        },

        GenericCrafter, (blk, oreDict) => {
          if(blk.outputItems != null) blk.outputItems.forEachFast(itmStack => itmStack.item = oreDict.get(itmStack.item, itmStack.item));
          if(blk.outputLiquids != null) blk.outputLiquids.forEachFast(liqStack => liqStack.liquid = oreDict.get(liqStack.liquid, liqStack.liquid));
        },

      ],


    },


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  gen: {


    /**
     * Used to check if recipe should be created for some content.
     * <br> <ROW>: boolF.
     * <br> <ARGS>: ct, metaObj, paramObj.
     */
    validCheck: [

      // Check `shouldSkip`
      function(ct, metaObj, paramObj) {
        return !readParam(paramObj, "shouldSkip", false);
      },

      // Check filter in `paramObj`
      function(ct, metaObj, paramObj) {
        return readParam(metaObj, "boolF", Function.airTrue)(ct) && readParam(paramObj, "boolF", Function.airTrue)(ct);
      },

      // Check hardness
      function(ct, metaObj, paramObj) {
        let minHardness = readParam(metaObj, "minHardness");
        let maxHardness = readParam(metaObj, "maxHardness");
        let hardness = readParam(paramObj, "hardness");
        return minHardness == null && maxHardness == null ?
          true :
          hardness == null ?
            true :
            (hardness >= tryVal(minHardness, 0) && hardness <= tryVal(maxHardness, Infinity));
      },

      // Check temperature requirement
      function(ct, metaObj, paramObj) {
        if(!(ct instanceof Item)) return true;
        let tempReq = readParam(metaObj, "ignoreTempReq", false) ? Infinity : readParam(paramObj, "tempReq");
        if(tempReq == null) return true;
        if(tempReq < 0.0) return false;
        return tempReq <= readParam(metaObj, "maxTemp", Infinity) && ct.flammability <= readParam(metaObj, "maxFlam", Infinity);
      },

      // Check payload size
      function(ct, metaObj, paramObj) {
        if(!instanceOfAny(ct, Block, UnitType)) return true;
        return MDL_entity._size(ct) <= readParam(metaObj, "sizeCap", Infinity);
      },

    ],


    /**
     * Used to modify final recipe object.
     * <br> <ROW>: boolF, objF.
     * <br> <ARGS-boolF>: ct, metaObj, paramObj.
     * <br> <ARGS-objF>: obj, metaObj, paramObj.
     */
    objF: [

      // If `ignoreTempReq` is true, no temperature requirement
      function(ct, metaObj, paramObj) {
        return readParam(metaObj, "ignoreTempReq", false);
      },
      function(obj, metaObj, paramObj) {
        delete obj.tempReq;
        delete obj.tempAllowed;
      },

      // Apply `abrasionFactor`
      function(ct, metaObj, paramObj) {
        return readParam(metaObj, "abrasionFactor") != null;
      },
      function(obj, metaObj, paramObj) {
        let hardness = readParam(paramObj, "hardness");
        if(hardness == null) return;
        obj.durabDecMtp = Mathf.lerp(1.0, 2.0 * readParam(metaObj, "abrasionFactor"), Mathf.maxZero(hardness - readParam(metaObj, "minHardness", 0)) / 10.0);
      },

      // If `useCalculatedHardness` is true, hardness is calculated from BI data
      function(ct, metaObj, paramObj) {
        return readParam(metaObj, "abrasionFactor") != null && readParam(metaObj, "useCalculatedHardness", false);
      },
      function(obj, metaObj, paramObj) {
        let bi = this.parseRawBi(readParam(paramObj, "bi", Array.air), 1, 1.0);
        if(bi.length === 0) return;
        let hardness = Math.max.apply(null, bi.flatten().pullAll(-1.0).readCol(3, 0).inSituMap(nmRs => MDL_content._ct(nmRs, "rs").hardness).compact().unshiftAll(0.0));
        obj.durabDecMtp = Mathf.lerp(1.0, 2.0 * readParam(metaObj, "abrasionFactor"), Mathf.maxZero(hardness - readParam(metaObj, "minHardness", 0)) / 10.0);
      },

    ],


    /**
     * "GROUP: xxx" in recipe I/O arrays.
     * <br> <ROW>: grpStr, [nmRs, paramObj].
     */
    group: [],


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  /**
   * Collection of raw recipe data used in {@link TP_recipeGen}.
   * <br> <EXTENSIBLE>
   */
  genData: {


    alloying: [],


    brickBaking: [],


    carbonization: [],


    casting: [],


    condensation: [],


    dryingItem: [],


    dryingLiquid: [],


    dryingLiquidAcidic: [],


    dryingLiquidBasic: [],


    dryingGas: [],


    dryingGasAcidic: [],


    dryingGasBasic: [],


    dryingFreeze: [],


    filtration: [],


    filtrationLiquid: [],


    forging: [],


    heatingExchange: [],


    heatingGas: [],


    mixing: [],


    ballMillMixing: [],


    mixingLiquid: [],


    pulverization: [],


    purificationI: [],


    purificationII: [],


    purificationMagnetic: [],


    purificationFloat: [],


    reactionGas: [],


    reactionLiquid: [],


    reactionMelt: [],


    reactionBurnGas: [],


    reactionBurnLiquid: [],


    reactionBurnSolid: [],


    roasting: [],


    rockCrushing: [],


    concentrateRoasting: [],


    smelting: [],


    concentrateSmelting: [],


  },


};


LCModDbRegister
.apply("rcGenData", db["genData"]);


Object.mergeDB(db, "DB_recipe");


exports.db = db;
