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

        ConsumeItemFilter, (blk, cons, data, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          Vars.content.items().each(itm => {
            if(blk.itemFilter[itm.id]) dictConsItm[itm.id].push(blk, 1, mergeObj({icon: DB_block.db["class"]["group"]["turret"]["class"].hasIns(blk) ? "lovec-icon-ammo" : null}, data));
          });
        },

        ConsumeItems, (blk, cons, data, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          cons.items.forEachFast(itmStack => dictConsItm[itmStack.item.id].push(blk, itmStack.amount, mergeObj({icon: cons.optional ? "lovec-icon-boost" : DB_block.db["class"]["group"]["turret"]["class"].hasIns(blk) ? "lovec-icon-ammo" : null}, data)));
        },

        ConsumeItemFlammable, (blk, cons, data, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          Vars.content.items().each(itm => itm.flammability >= cons.minFlammability, itm => dictConsItm[itm.id].push(blk, 1, mergeObj(data)));
        },

        ConsumeItemExplosive, (blk, cons, data, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          Vars.content.items().each(itm => itm.explosiveness >= cons.minExplosiveness && !(consFlam != null && itm.flammability >= consFlam.minFlammability), itm => dictConsItm[itm.id].push(blk, 1, mergeObj(data)));
        },

        ConsumeItemRadioactive, (blk, cons, data, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          Vars.content.items().each(itm => itm.radioactivity >= cons.minRadioactivity, itm => dictConsItm[itm.id].push(blk, 1, mergeObj(data)));
        },

        ConsumeItemCharged, (blk, cons, data, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          Vars.content.items().each(itm => itm.charge >= cons.minCharge, itm => dictConsItm[itm.id].push(blk, 1, mergeObj(data)));
        },

        ConsumeItemExplode, (blk, cons, data, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          // Do nothing
        },

        /* <---------- liquid ----------> */

        ConsumeLiquidFilter, (blk, cons, data, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          Vars.content.liquids().each(liq => {
            if(blk.liquidFilter[liq.id]) dictConsFld[liq.id].push(blk, cons.amount, mergeObj({icon: DB_block.db["class"]["group"]["turret"]["class"].hasIns(blk) ? "lovec-icon-ammo" : null}, data));
          });
        },

        ConsumeLiquid, (blk, cons, data, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          if(blk instanceof LandingPad) {
            // Why is it not another consumer class...
            dictConsFld[blk.consumeLiquid.id].push(blk, blk.consumeLiquidAmount / blk.cooldownTime, {});
          } else {
            dictConsFld[cons.liquid.id].push(blk, cons.amount, mergeObj({icon: cons.optional ? "lovec-icon-boost" : DB_block.db["class"]["group"]["turret"]["class"].hasIns(blk) ? "lovec-icon-ammo" : null}, data));
          };
        },

        ConsumeLiquids, (blk, cons, data, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          cons.liquids.forEachFast(liqStack => dictConsFld[liqStack.liquid.id].push(blk, liqStack.amount, mergeObj({icon: cons.optional ? "lovec-icon-boost" : DB_block.db["class"]["group"]["turret"]["class"].hasIns(blk) ? "lovec-icon-ammo" : null}, data)));
        },

        ConsumeCoolant, (blk, cons, data, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          Vars.content.liquids().each(liq => liq.coolant && (!liq.gas && cons.allowLiquid || liq.gas && cons.allowGas) && liq.temperature <= cons.maxTemp && liq.flammability < cons.maxFlammability, liq => {
            dictConsFld[liq.id].push(blk, cons.amount, mergeObj({icon: "lovec-icon-coolant"}, data));
          });
        },

        ConsumeLiquidFlammable, (blk, cons, data, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          Vars.content.liquids().each(liq => liq.flammability >= cons.minFlammability, liq => dictConsFld[liq.id].push(blk, cons.amount, mergeObj(data)));
        },

        /* <---------- payload ----------> */

        ConsumePayloads, (blk, cons, data, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          cons.payloads.each(payStack => {
            (payStack.item instanceof Block ? dictConsBlk : dictConsUtp)[payStack.item.id].push(blk, payStack.amount, mergeObj({icon: DB_block.db["class"]["group"]["turret"].hasIns(blk) ? "lovec-icon-ammo" : null}, data));
          });
        },

        /* <---------- block ----------> */

        UnitFactory, (blk, cons, data, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          blk.plans.each(uPlan => {
            uPlan.requirements.forEachFast(itmStack => {
              dictConsItm[itmStack.item.id].push(blk, itmStack.amount, mergeObj({time: uPlan.time, ct: uPlan.unit}, data));
            });
          });
        },

        UnitAssembler, (blk, cons, data, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          blk.plans.each(uPlan => {
            if(uPlan.itemReq != null) uPlan.itemReq.forEachFast(itmStack => {
              dictConsItm[itmStack.item.id].push(blk, itmStack.amount, mergeObj({time: uPlan.time, ct: uPlan.unit}, data));
            });
            if(uPlan.liquidReq != null) uPlan.liquidReq.forEachFast(liqStack => {
              dictConsFld[liqStack.liquid.id].push(blk, liqStack.amount, mergeObj({ct: uPlan.unit}, data));
            });
            if(uPlan.requirements != null) uPlan.requirements.each(payStack => {
              (payStack.item instanceof Block ? dictConsBlk : dictConsUtp)[payStack.item.id].push(blk, payStack.amount, mergeObj({time: uPlan.time, ct: uPlan.unit}, data));
            });
          });
        },

        Reconstructor, (blk, cons, data, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          blk.upgrades.each(arr => {
            dictConsUtp[arr[0].id].push(blk, 1, mergeObj({ct: arr[1]}, data));
          });
        },

        /* <---------- Carpe Diem (consumer) ----------> */

        fetchClass("carpediem.world.consumers.ConsumeItemsUses", true), (blk, cons, data, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          cons.items.forEachFast(itmStack => dictConsItm[itmStack.item.id].push(blk, itmStack.amount / cons.uses, mergeObj({icon: cons.optional ? "lovec-icon-boost" : DB_block.db["class"]["group"]["turret"]["class"].hasIns(blk) ? "lovec-icon-ammo" : null}, data)));
        },

        /* <---------- Carpe Diem ----------> */

        fetchClass("carpediem.world.blocks.storage.LandingPod", true), (blk, cons, data, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          db["dict"]["reader"]["consume"].read(fetchClass("carpediem.world.blocks.crafting.RecipeCrafter"), Function.air)(blk, cons, data, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp);
        },

        fetchClass("carpediem.world.blocks.crafting.RecipeCrafter", true), (blk, cons, data, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          let dictCaller;
          blk.recipes.each(rc => {
            rc.consumes.each(rcI => {
              dictCaller = readClassFunMap(db["dict"]["reader"]["consume"], rcI, null);
              if(dictCaller != null) {
                dictCaller(blk, rcI, mergeObj({time: rc.craftTime, ct: rc.primaryOutput}, data), dictConsItm, dictConsFld, dictConsBlk, dictConsUtp);
              };
            });
          });
        },

        fetchClass("carpediem.world.blocks.payloads.PayloadBurner", true), (blk, cons, data, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          dictConsBlk[blk.consumedBlock.id].push(blk, 1, mergeObj(data));
        },

        fetchClass("carpediem.world.blocks.payloads.FanBlock", true), (blk, cons, data, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          let ProcessableBlock = fetchClass("carpediem.world.blocks.payloads.ProcessableBlock");
          Vars.content.blocks().each(
            oblk => oblk instanceof ProcessableBlock,
            oblk => blk.processingTypes.each(rc => dictConsBlk[oblk.id].push(blk, 1, mergeObj({time: rc.baseTime, ct: oblk}, data))),
          );
        },

        /* <---------- New Horizon ----------> */

        fetchClass("newhorizon.expand.block.production.factory.RecipeGenericCrafter", true), (blk, cons, data, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          let i = 0, ordText;
          blk.recipes.each(rc => {
            i++;
            ordText = ("[" + i + "]").color(Pal.accent);
            rc.inputItem.each(itmStack => dictConsItm[itmStack.item.id].push(blk, itmStack.amount, mergeObj({time: rc.craftTime, iconText: ordText}, data)));
            rc.inputLiquid.each(liqStack => dictConsFld[liqStack.liquid.id].push(blk, liqStack.amount, mergeObj({time: rc.craftTime, iconText: ordText}, data)));
            rc.inputPayload.each(payStack => (payStack.item instanceof Block ? dictConsBlk : dictConsUtp)[payStack.item.id].push(blk, payStack.amount, mergeObj({time: rc.craftTime, iconText: ordText}, data)));
          });
        },

        fetchClass("newhorizon.expand.block.special.JumpGate", true), (blk, cons, data, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
          let rc;
          blk.recipeList.each(unitRc => {
            rc = unitRc.recipe;
            rc.inputItem.each(itmStack => dictConsItm[itmStack.item.id].push(blk, itmStack.amount, mergeObj({time: unitRc.craftTime, ct: unitRc.unitType}, data)));
            rc.inputLiquid.each(liqStack => dictConsFld[liqStack.liquid.id].push(blk, liqStack.amount, mergeObj({time: unitRc.craftTime, ct: unitRc.unitType}, data)));
            rc.inputPayload.each(payStack => (payStack.item instanceof Block ? dictConsBlk : dictConsUtp)[payStack.item.id].push(blk, payStack.amount, mergeObj({time: unitRc.craftTime, ct: unitRc.unitType}, data)));
          });
        },

      ],


      /**
       * Used to read a particular block class to get production list for recipe dictionary.
       * <br> <ROW>: javaCls, rcReader.
       * <br> <ARGS>: blk, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp.
       */
      produce: [

        Drill, (blk, data, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          if(tryJsProp(blk, "shouldDropPay", false)) return;
          Vars.content.items().each(itm => {
            if(blk.blockedItems != null && blk.blockedItems.contains(itm)) return;
            let oblks = Vars.content.blocks().select(oblk => oblk.itemDrop === itm && ((oblk instanceof Floor && !(oblk instanceof OverlayFloor)) || (oblk instanceof OverlayFloor && !oblk.wallOre)) && (blk.ex_canMine == null || blk.ex_canMine(oblk, itm, !MDL_cond._isDepthOre(oblk) ? 1.0 : tryJsProp(blk, "canMineDepthOre", true) ? tryJsProp(blk, "depthTierMtp", 1.0) : 0.0))).toArray();
            if(oblks.length > 0) {
              dictProdItm[itm.id].push(blk, Math.pow(blk.size, 2) * (blk instanceof BurstDrill ? 1.0 : blk.drillTime / blk.getDrillTime(itm)) * tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), mergeObj({icon: "lovec-icon-mining", iconCts: oblks}, data));
            };
          });
        },

        BeamDrill, (blk, data, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          if(tryJsProp(blk, "shouldDropPay", false)) return;
          Vars.content.items().each(itm => {
            if(blk.blockedItems != null && blk.blockedItems.contains(itm)) return;
            let oblks = Vars.content.blocks().select(oblk => oblk.itemDrop === itm && (instanceOfAny(oblk, Prop, TallBlock) || (oblk instanceof OverlayFloor && oblk.wallOre)) && (blk.ex_canMine == null || blk.ex_canMine(oblk, itm, 1.0))).toArray();
            if(oblks.length > 0) {
              dictProdItm[itm.id].push(blk, blk.size * tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), mergeObj({icon: "lovec-icon-mining", iconCts: oblks}, data));
            };
          });
        },

        WallCrafter, (blk, data, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          let oblks = Vars.content.blocks().select(oblk => oblk.solid && !(oblk instanceof Floor) && oblk.attributes.get(blk.attribute) > 0.0).toArray();
          if(oblks.length > 0) {
            dictProdItm[blk.output.id].push(blk, tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), mergeObj({icon: "lovec-icon-mining", iconCts: oblks}, data));
          };
        },

        Pump, (blk, data, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          Vars.content.liquids().each(liq => {
            let oblks = Vars.content.blocks().select(oblk => oblk instanceof Floor && oblk.liquidDrop === liq).toArray();
            if(oblks.length > 0) {
              dictProdFld[liq.id].push(blk, blk.pumpAmount * Math.pow(blk.size, 2) * tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), mergeObj({icon: "lovec-icon-pumping", iconCts: oblks}, data));
            };
          });
        },

        SolidPump, (blk, data, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          let oblks = Vars.content.blocks().select(oblk => oblk instanceof Floor && oblk.attributes.get(blk.attribute) > 0.0).toArray();
          if(oblks.length > 0) {
            dictProdFld[blk.result.id].push(blk, blk.pumpAmount * Math.pow(blk.size, 2) * tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), mergeObj({icon: "lovec-icon-pumping", iconCts: oblks}, data));
          };
        },

        ConsumeGenerator, (blk, data, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          if(blk.outputLiquid != null) dictProdFld[blk.outputLiquid.liquid.id].push(blk, blk.outputLiquid.amount * tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), mergeObj(data));
        },

        ThermalGenerator, (blk, data, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          if(blk.outputLiquid != null) dictProdFld[blk.outputLiquid.liquid.id].push(blk, blk.outputLiquid.amount * Math.pow(blk.size, 2) * tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), mergeObj(data));
        },

        GenericCrafter, (blk, data, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          if(blk.outputItems != null) blk.outputItems.forEachFast(itmStack => dictProdItm[itmStack.item.id].push(blk, itmStack.amount * tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), mergeObj(data)));
          if(blk.outputLiquids != null) blk.outputLiquids.forEachFast(liqStack => dictProdFld[liqStack.liquid.id].push(blk, liqStack.amount * tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), mergeObj(data)));
        },

        Constructor, (blk, data, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          Vars.content.blocks().each(
            oblk => oblk.synthetic() && !(oblk instanceof CoreBlock) && oblk.size >= blk.minBlockSize && oblk.size <= blk.maxBlockSize && (blk.filter.size === 0 || blk.filter.contains(oblk)),
            oblk => dictProdBlk[oblk.id].push(blk, tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), mergeObj({time: oblk.buildTime / blk.buildSpeed}, data)),
          );
        },

        UnitFactory, (blk, data, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          blk.plans.each(uPlan => {
            dictProdUtp[uPlan.unit.id].push(blk, tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), mergeObj({time: uPlan.time}, data));
          });
        },

        UnitAssembler, (blk, data, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          blk.plans.each(uPlan => {
            dictProdUtp[uPlan.unit.id].push(blk, tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), mergeObj({time: uPlan.time}, data));
          });
        },

        Reconstructor, (blk, data, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          blk.upgrades.each(arr => {
            dictProdUtp[arr[1].id].push(blk, tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), mergeObj({ct: arr[0]}, data));
          });
        },

        /* <---------- Carpe Diem ----------> */

        fetchClass("carpediem.world.blocks.storage.LandingPod", true), (blk, data, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          db["dict"]["reader"]["produce"].read(fetchClass("carpediem.world.blocks.crafting.RecipeCrafter"), Function.air)(blk, data, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp);
        },

        fetchClass("carpediem.world.blocks.crafting.RecipeCrafter", true), (blk, data, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          blk.recipes.each(rc => {
            rc.outputs.each(rcO => {
              if(instanceOfAny(rcO, fetchClass("carpediem.world.outputs.OutputItems", true))) {
                rcO.items.forEachFast(itmStack => dictProdItm[itmStack.item.id].push(blk, itmStack.amount, mergeObj({time: rc.craftTime, ct: rc.primaryOutput}, data)));
              } else if(instanceOfAny(rcO, fetchClass("carpediem.world.outputs.OutputItems", true))) {
                rcO.liquids.forEachFast(liqStack => dictProdFld[liqStack.liquid.id].push(blk, liqStack.amount, mergeObj({time: rc.craftTime, ct: rc.primaryOutput}, data)));
              };
            });
          });
        },

        fetchClass("carpediem.world.blocks.payloads.FanBlock", true), (blk, data, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          let ProcessableBlock = fetchClass("carpediem.world.blocks.payloads.ProcessableBlock");
          Vars.content.blocks().each(
            oblk => oblk instanceof ProcessableBlock,
            oblk => blk.processingTypes.each(rc => dictProdBlk[oblk.resultBlock.id].push(blk, 1, mergeObj({time: rc.baseTime, ct: oblk}, data))),
          );
        },

        /* <---------- New Horizon ----------> */

        fetchClass("newhorizon.expand.block.production.factory.MultiBlockCrafter", true), (blk, data, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          if(blk.outputItems != null) blk.outputItems.forEachFast(itmStack => dictProdItm[itmStack.item.id].push(blk, itmStack.amount, mergeObj(data)));
          if(blk.outputLiquids != null) blk.outputLiquids.forEachFast(liqStack => dictProdFld[liqStack.liquid.id].push(blk, liqStack.amount, mergeObj(data)));
        },

        fetchClass("newhorizon.expand.block.production.factory.RecipeGenericCrafter", true), (blk, data, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          let i = 0, ordText;
          blk.recipes.each(rc => {
            i++;
            ordText = ("[" + i + "]").color(Pal.accent);
            rc.outputItem.each(itmStack => dictProdItm[itmStack.item.id].push(blk, itmStack.amount, mergeObj({time: rc.craftTime, iconText: ordText}, data)));
            rc.outputLiquid.each(liqStack => dictProdFld[liqStack.liquid.id].push(blk, liqStack.amount, mergeObj({time: rc.craftTime, iconText: ordText}, data)));
            rc.outputPayload.each(payStack => (payStack.item instanceof Block ? dictProdBlk : dictProdUtp)[payStack.item.id].push(blk, payStack.amount, mergeObj({time: rc.craftTime, iconText: ordText}, data)));
          });
        },

        fetchClass("newhorizon.expand.block.special.JumpGate", true), (blk, data, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          let rc;
          blk.recipeList.each(unitRc => {
            rc = unitRc.recipe;
            rc.outputItem.each(itmStack => dictProdItm[itmStack.item.id].push(blk, itmStack.amount, mergeObj({time: unitRc.craftTime, ct: unitRc.unitType}, data)));
            rc.outputLiquid.each(liqStack => dictProdFld[liqStack.liquid.id].push(blk, liqStack.amount, mergeObj({time: unitRc.craftTime, ct: unitRc.unitType}, data)));
            rc.outputPayload.each(payStack => (payStack.item instanceof Block ? dictProdBlk : dictProdUtp)[payStack.item.id].push(blk, payStack.amount, mergeObj({time: unitRc.craftTime, ct: unitRc.unitType}, data)));
            dictProdUtp[unitRc.unitType.id].push(blk, 1, mergeObj({time: unitRc.craftTime, ct: unitRc.unitType}, data));
          });
        },

      ],


      /**
       * Used to add consumption term for a particular block in recipe dictionary.
       * <br> <ROW>: nmBlk, rcReader.
       * <br> <ARGS>: blk, cons, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp.
       */
      consumeSpec: [],


      /**
       * Used to add production term for a particular block in recipe dictionary.
       * <br> <ROW>: nmBlk, rcReader.
       * <br> <ARGS>: blk, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp.
       */
      produceSpec: [

        /* <---------- New Horizon ----------> */

        "new-horizon-photothermal-generator", (blk, data, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          dictProdItm[Vars.content.item("new-horizon-hard-light").id].push(blk, 1, mergeObj({time: 120.0}, data));
        },

        "new-horizon-geological-photothermal-generator", (blk, data, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          dictProdItm[Vars.content.item("new-horizon-hard-light").id].push(blk, 1, mergeObj({time: 120.0}, data));
        },

        "new-horizon-vector-condenser", (blk, data, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          dictProdItm[Vars.content.item("new-horizon-hard-light").id].push(blk, 2, mergeObj({time: 120.0}, data));
        },

        "new-horizon-differential-reactor", (blk, data, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          dictProdItm[Vars.content.item("new-horizon-hard-light").id].push(blk, 1, mergeObj({time: 120.0}, data));
        },

        "new-horizon-photon-panel", (blk, data, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
          dictProdItm[Vars.content.item("new-horizon-hard-light").id].push(blk, 1, mergeObj({time: 300.0}, data));
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
