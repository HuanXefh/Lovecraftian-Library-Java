/**
 * Database of recipe data.
 * @module lovec/db/DB_recipe
 */


const db = {


    /* <------------------------------ CHUNK SPLITTER ------------------------------ */


    dict: {


        /**
         * Used to register new custom fields in recipe dictionary.
         * @type {Array}
         * @lovecRow `string` - name
         * @lovecRow `{mod: string|unset, icon: string, isContinuous: boolean|unset, isStatic: boolean|unset}`
         */
        customField: [

            "power", {icon: "lovec-icon-power", isContinuous: true},
            "heat", {icon: "lovec-icon-erekir-heat", isStatic: true},

            "cd-pressure", {mod: "carpe-diem", icon: "lovec-icon-cd-pressure", isStatic: true},

        ],


        reader: {


            /**
             * Used to read a particular consumer for recipe dictionary.
             * The Java class can be a consumer class or block class.
             * @type {Array}
             * @lovecRow `ContentTypeGn` - type
             * @lovecRow `RecipeDictionaryConsumeReader` - reader
             */
            consume: [

                /* <------------------------------ item ------------------------------ */

                ConsumeItemFilter, function(blk, cons, data, dictConsItem, dictConsFld, dictConsBlk, dictConsUtp) {
                    Vars.content.items().each(item => {
                        if(blk.itemFilter[item.id]) dictConsItem[item.id].push(blk, 1, mergeObj({icon: MDL_cond.isTurret(blk) ? "lovec-icon-ammo" : null}, data));
                    });
                },

                ConsumeItems, function(blk, cons, data, dictConsItem, dictConsFld, dictConsBlk, dictConsUtp) {
                    cons.items.forEachFast(itemStack => {
                        if(itemStack.amount <= 0) return;
                        dictConsItem[itemStack.item.id].push(blk, itemStack.amount, mergeObj({icon: cons.optional ? "lovec-icon-boost" : MDL_cond.isTurret(blk) ? "lovec-icon-ammo" : null}, data));
                    }, true);
                },

                ConsumeItemFlammable, function(blk, cons, data, dictConsItem, dictConsFld, dictConsBlk, dictConsUtp) {
                    Vars.content.items().each(item => item.flammability >= cons.minFlammability, item => dictConsItem[item.id].push(blk, 1, mergeObj(data)));
                },

                ConsumeItemExplosive, function(blk, cons, data, dictConsItem, dictConsFld, dictConsBlk, dictConsUtp) {
                    Vars.content.items().each(item => item.explosiveness >= cons.minExplosiveness, item => dictConsItem[item.id].push(blk, 1, mergeObj(data)));
                },

                ConsumeItemRadioactive, function(blk, cons, data, dictConsItem, dictConsFld, dictConsBlk, dictConsUtp) {
                    Vars.content.items().each(item => item.radioactivity >= cons.minRadioactivity, item => dictConsItem[item.id].push(blk, 1, mergeObj(data)));
                },

                ConsumeItemCharged, function(blk, cons, data, dictConsItem, dictConsFld, dictConsBlk, dictConsUtp) {
                    Vars.content.items().each(item => item.charge >= cons.minCharge, item => dictConsItem[item.id].push(blk, 1, mergeObj(data)));
                },

                ConsumeItemExplode, function(blk, cons, data, dictConsItem, dictConsFld, dictConsBlk, dictConsUtp) {
                    // Do nothing
                },

                /* <------------------------------ liquid ------------------------------ */

                ConsumeLiquidFilter, function(blk, cons, data, dictConsItem, dictConsFld, dictConsBlk, dictConsUtp) {
                    Vars.content.liquids().each(liq => {
                        if(cons.amount < 0.0001) return;
                        if(blk.liquidFilter[liq.id]) dictConsFld[liq.id].push(blk, cons.amount, mergeObj({icon: MDL_cond.isTurret(blk) ? "lovec-icon-ammo" : null}, data));
                    });
                },

                ConsumeLiquid, function(blk, cons, data, dictConsItem, dictConsFld, dictConsBlk, dictConsUtp) {
                    if(blk instanceof LandingPad) {
                        // Why is it not another consumer class...
                        dictConsFld[blk.consumeLiquid.id].push(blk, blk.consumeLiquidAmount / blk.cooldownTime, {});
                    } else {
                        if(cons.amount < 0.0001) return;
                        dictConsFld[cons.liquid.id].push(blk, cons.amount, mergeObj({icon: cons.optional ? "lovec-icon-boost" : MDL_cond.isTurret(blk) ? "lovec-icon-ammo" : null}, data));
                    };
                },

                ConsumeLiquids, function(blk, cons, data, dictConsItem, dictConsFld, dictConsBlk, dictConsUtp) {
                    cons.liquids.forEachFast(liqStack => {
                        if(liqStack.amount < 0.0001) return;
                        dictConsFld[liqStack.liquid.id].push(blk, liqStack.amount, mergeObj({icon: cons.optional ? "lovec-icon-boost" : MDL_cond.isTurret(blk) ? "lovec-icon-ammo" : null}, data));
                    }, true);
                },

                ConsumeCoolant, function(blk, cons, data, dictConsItem, dictConsFld, dictConsBlk, dictConsUtp) {
                    if(cons.amount < 0.0001) return;
                    Vars.content.liquids().each(liq => liq.coolant && (!liq.gas && cons.allowLiquid || liq.gas && cons.allowGas) && liq.temperature <= cons.maxTemp && liq.flammability < cons.maxFlammability, liq => {
                        dictConsFld[liq.id].push(blk, cons.amount, mergeObj({icon: "lovec-icon-coolant"}, data));
                    });
                },

                ConsumeLiquidFlammable, function(blk, cons, data, dictConsItem, dictConsFld, dictConsBlk, dictConsUtp) {
                    if(cons.amount < 0.0001) return;
                    Vars.content.liquids().each(liq => liq.flammability >= cons.minFlammability, liq => dictConsFld[liq.id].push(blk, cons.amount, mergeObj(data)));
                },

                /* <------------------------------ power ------------------------------ */

                ConsumePower, function(blk, cons, data, dictConsItem, dictConsFld, dictConsBlk, dictConsUtp) {
                    if(cons.usage < 0.0001 || cons.buffered || blk instanceof PowerVoid) return;
                    MDL_recipeDict.addCustomConsTerm(blk, "power", cons.usage, mergeObj(data));
                },

                /* <------------------------------ payload ------------------------------ */

                ConsumePayloads, function(blk, cons, data, dictConsItem, dictConsFld, dictConsBlk, dictConsUtp) {
                    cons.payloads.each(payStack => {
                        if(payStack.amount <= 0) return;
                        (payStack.item instanceof Block ? dictConsBlk : dictConsUtp)[payStack.item.id].push(blk, payStack.amount, mergeObj({icon: MDL_cond.isTurret(blk) ? "lovec-icon-ammo" : null}, data));
                    });
                },

                /* <------------------------------ block ------------------------------ */

                HeatCrafter, function(blk, cons, data, dictConsItem, dictConsFld, dictConsBlk, dictConsUtp) {
                    if(blk.heatRequirement < 0.0001) return;
                    MDL_recipeDict.addCustomConsTerm(blk, "heat", blk.heatRequirement, mergeObj(data));
                },

                UnitFactory, function(blk, cons, data, dictConsItem, dictConsFld, dictConsBlk, dictConsUtp) {
                    blk.plans.each(uPlan => {
                        uPlan.requirements.forEachFast(itemStack => {
                            if(itemStack.amount <= 0) return;
                            dictConsItem[itemStack.item.id].push(blk, itemStack.amount, mergeObj({time: uPlan.time, ct: uPlan.unit}, data));
                        }, true);
                    });
                },

                UnitAssembler, function(blk, cons, data, dictConsItem, dictConsFld, dictConsBlk, dictConsUtp) {
                    blk.plans.each(uPlan => {
                        if(uPlan.itemReq != null) uPlan.itemReq.forEachFast(itemStack => {
                            if(itemStack.amount <= 0) return;
                            dictConsItem[itemStack.item.id].push(blk, itemStack.amount, mergeObj({time: uPlan.time, ct: uPlan.unit}, data));
                        }, true);
                        if(uPlan.liquidReq != null) uPlan.liquidReq.forEachFast(liqStack => {
                            if(liqStack.amount < 0.0001) return;
                            dictConsFld[liqStack.liquid.id].push(blk, liqStack.amount, mergeObj({ct: uPlan.unit}, data));
                        }, true);
                        if(uPlan.requirements != null) uPlan.requirements.each(payStack => {
                            if(payStack.amount <= 0) return;
                            (payStack.item instanceof Block ? dictConsBlk : dictConsUtp)[payStack.item.id].push(blk, payStack.amount, mergeObj({time: uPlan.time, ct: uPlan.unit}, data));
                        });
                    });
                },

                Reconstructor, function(blk, cons, data, dictConsItem, dictConsFld, dictConsBlk, dictConsUtp) {
                    blk.upgrades.each(arr => {
                        dictConsUtp[arr[0].id].push(blk, 1, mergeObj({ct: arr[1]}, data));
                    });
                },

                /* <------------------------------ Carpe Diem (consumer) ------------------------------ */

                fetchClass("carpediem.world.consumers.ConsumeItemsUses", true), function(blk, cons, data, dictConsItem, dictConsFld, dictConsBlk, dictConsUtp) {
                    cons.items.forEachFast(itemStack => {
                        if(itemStack.amount <= 0) return;
                        dictConsItem[itemStack.item.id].push(blk, itemStack.amount / cons.uses, mergeObj({icon: cons.optional ? "lovec-icon-boost" : MDL_cond.isTurret(blk) ? "lovec-icon-ammo" : null}, data));
                    }, true);
                },

                fetchClass("carpediem.world.consumers.ConsumePressure", true), function(blk, cons, data, dictConsItem, dictConsFld, dictConsBlk, dictConsUtp) {
                    if(cons.usage < 0.0001) return;
                    MDL_recipeDict.addCustomConsTerm(blk, "cd-pressure", cons.usage, mergeObj({icon: cons.optional ? "lovec-icon-boost" : null}, data));
                },

                /* <------------------------------ Carpe Diem ------------------------------ */

                fetchClass("carpediem.world.blocks.storage.LandingPod", true), function(blk, cons, data, dictConsItem, dictConsFld, dictConsBlk, dictConsUtp) {
                    db["dict"]["reader"]["consume"].read(fetchClass("carpediem.world.blocks.crafting.RecipeCrafter"), Function.air).apply(this, arguments);
                },

                fetchClass("carpediem.world.blocks.crafting.RecipeCrafter", true), function(blk, cons, data, dictConsItem, dictConsFld, dictConsBlk, dictConsUtp) {
                    let dictC;
                    blk.recipes.each(rc => {
                        rc.consumes.each(rcI => {
                            dictC = readClassFunMap(db["dict"]["reader"]["consume"], rcI, null);
                            if(dictC != null) {
                                dictC(blk, rcI, mergeObj({time: rc.craftTime, ct: rc.primaryOutput}, data), dictConsItem, dictConsFld, dictConsBlk, dictConsUtp);
                            };
                        });
                    });
                },

                fetchClass("carpediem.world.blocks.payloads.PayloadBurner", true), function(blk, cons, data, dictConsItem, dictConsFld, dictConsBlk, dictConsUtp) {
                    dictConsBlk[blk.consumedBlock.id].push(blk, 1, mergeObj(data));
                },

                fetchClass("carpediem.world.blocks.payloads.FanBlock", true), function(blk, cons, data, dictConsItem, dictConsFld, dictConsBlk, dictConsUtp) {
                    let ProcessableBlock = fetchClass("carpediem.world.blocks.payloads.ProcessableBlock");
                    Vars.content.blocks().each(
                        oblk => oblk instanceof ProcessableBlock,
                        oblk => blk.processingTypes.each(rc => dictConsBlk[oblk.id].push(blk, 1, mergeObj({time: rc.baseTime, ct: oblk}, data))),
                    );
                },

                /* <------------------------------ MultiCrafter ------------------------------ */

                fetchClass("dev.jojofr.multicrafter.MultiCrafterBlock", true), function(blk, cons, data, dictConsItem, dictConsFld, dictConsBlk, dictConsUtp) {
                    let i = 0, ordText;
                    blk.recipes.each(rc => {
                        i++;
                        ordText = ("[" + i + "]").color(Pal.accent);
                        if(rc.input.items != null) {
                            rc.input.items.forEachFast(itemStack => {
                                if(itemStack.amount <= 0) return;
                                dictConsItem[itemStack.item.id].push(blk, itemStack.amount, mergeObj({time: rc.craftTime, iconText: ordText}, data));
                            }, true);
                        };
                        if(rc.input.liquids != null) {
                            rc.input.liquids.forEachFast(liqStack => {
                                if(liqStack.amount < 0.0001) return;
                                dictConsFld[liqStack.liquid.id].push(blk, liqStack.amount, mergeObj({time: rc.craftTime, iconText: ordText}, data));
                            }, true);
                        };
                        if(rc.input.payloads != null) {
                            rc.input.payloads.forEachFast(payStack => {
                                if(payStack.amount <= 0) return;
                                (payStack.item instanceof Block ? dictConsBlk : dictConsUtp)[payStack.item.id].push(blk, payStack.amount, mergeObj({time: rc.craftTime, iconText: ordText}, data));
                            }, true);
                        };
                        if(rc.input.power > 0.0) {
                            MDL_recipeDict.addCustomConsTerm(blk, "power", rc.input.power, mergeObj({time: rc.craftTime, iconText: ordText}, data))
                        };
                        if(rc.input.heat > 0.0) {
                            MDL_recipeDict.addCustomConsTerm(blk, "heat", rc.input.heat, mergeObj({time: rc.craftTime, iconText: ordText}, data))
                        };
                    });
                },

                /* <------------------------------ New Horizon ------------------------------ */

                fetchClass("newhorizon.expand.block.production.factory.RecipeGenericCrafter", true), function(blk, cons, data, dictConsItem, dictConsFld, dictConsBlk, dictConsUtp) {
                    let i = 0, ordText;
                    blk.recipes.each(rc => {
                        i++;
                        ordText = ("[" + i + "]").color(Pal.accent);
                        rc.inputItem.each(itemStack => {
                            if(itemStack.amount <= 0) return;
                            dictConsItem[itemStack.item.id].push(blk, itemStack.amount, mergeObj({time: rc.craftTime, iconText: ordText}, data));
                        });
                        rc.inputLiquid.each(liqStack => {
                            if(liqStack.amount < 0.0001) return;
                            dictConsFld[liqStack.liquid.id].push(blk, liqStack.amount, mergeObj({time: rc.craftTime, iconText: ordText}, data));
                        });
                        rc.inputPayload.each(payStack => {
                            if(payStack.amount <= 0) return;
                            (payStack.item instanceof Block ? dictConsBlk : dictConsUtp)[payStack.item.id].push(blk, payStack.amount, mergeObj({time: rc.craftTime, iconText: ordText}, data));
                        });
                    });
                },

                fetchClass("newhorizon.expand.block.special.JumpGate", true), function(blk, cons, data, dictConsItem, dictConsFld, dictConsBlk, dictConsUtp) {
                    let rc;
                    blk.recipeList.each(unitRc => {
                        rc = unitRc.recipe;
                        rc.inputItem.each(itemStack => {
                            if(itemStack.amount <= 0) return;
                            dictConsItem[itemStack.item.id].push(blk, itemStack.amount, mergeObj({time: unitRc.craftTime, ct: unitRc.unitType}, data));
                        });
                        rc.inputLiquid.each(liqStack => {
                            if(liqStack.amount < 0.0001) return;
                            dictConsFld[liqStack.liquid.id].push(blk, liqStack.amount, mergeObj({time: unitRc.craftTime, ct: unitRc.unitType}, data));
                        });
                        rc.inputPayload.each(payStack => {
                            if(payStack.amount <= 0) return;
                            (payStack.item instanceof Block ? dictConsBlk : dictConsUtp)[payStack.item.id].push(blk, payStack.amount, mergeObj({time: unitRc.craftTime, ct: unitRc.unitType}, data));
                        });
                    });
                },

            ],


            /**
             * Used to read a particular block class to get production list for recipe dictionary.
             * @type {Array}
             * @lovecRow `ContentTypeGn` - type
             * @lovecRow `RecipeDictionaryProduceReader` - reader
             */
            produce: [

                Drill, function(blk, data, dictProdItem, dictProdFld, dictProdBlk, dictProdUtp) {
                    if(tryJsProp(blk, "shouldDropPay", false)) return;
                    Vars.content.items().each(item => {
                        if(blk.blockedItems != null && blk.blockedItems.contains(item)) return;
                        let oblks = Vars.content.blocks().select(oblk => oblk.itemDrop === item && ((oblk instanceof Floor && !(oblk instanceof OverlayFloor)) || (oblk instanceof OverlayFloor && !oblk.wallOre)) && (blk.ex_canMine == null || blk.ex_canMine(oblk, item, !MDL_cond.isDepthOre(oblk) ? 1.0 : tryJsProp(blk, "canMineDepthOre", true) ? tryJsProp(blk, "depthTierMtp", 1.0) : 0.0))).toArray();
                        if(oblks.length > 0) {
                            dictProdItem[item.id].push(blk, Math.pow(blk.size, 2) * (blk instanceof BurstDrill ? 1.0 : blk.drillTime / blk.getDrillTime(item)) * tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), mergeObj({icon: "lovec-icon-mining", iconCts: oblks}, data));
                        };
                    });
                },

                BeamDrill, function(blk, data, dictProdItem, dictProdFld, dictProdBlk, dictProdUtp) {
                    if(tryJsProp(blk, "shouldDropPay", false)) return;
                    Vars.content.items().each(item => {
                        if(blk.blockedItems != null && blk.blockedItems.contains(item)) return;
                        let oblks = Vars.content.blocks().select(oblk => oblk.itemDrop === item && (DB_block.db["class"]["group"]["ore"]["wall"].hasIns(oblk) || (oblk instanceof OverlayFloor && oblk.wallOre)) && (blk.ex_canMine == null || blk.ex_canMine(oblk, item, 1.0))).toArray();
                        if(oblks.length > 0) {
                            dictProdItem[item.id].push(blk, blk.size * tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), mergeObj({icon: "lovec-icon-mining", iconCts: oblks}, data));
                        };
                    });
                },

                WallCrafter, function(blk, data, dictProdItem, dictProdFld, dictProdBlk, dictProdUtp) {
                    let oblks = Vars.content.blocks().select(oblk => oblk.solid && !(oblk instanceof Floor) && oblk.attributes.get(blk.attribute) > 0.0).toArray();
                    if(oblks.length > 0) {
                        dictProdItem[blk.output.id].push(blk, tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), mergeObj({icon: "lovec-icon-mining", iconCts: oblks}, data));
                    };
                },

                Pump, function(blk, data, dictProdItem, dictProdFld, dictProdBlk, dictProdUtp) {
                    Vars.content.liquids().each(liq => {
                        let oblks = Vars.content.blocks().select(oblk => oblk instanceof Floor && oblk.liquidDrop === liq).toArray();
                        if(oblks.length > 0) {
                            dictProdFld[liq.id].push(blk, blk.pumpAmount * Math.pow(blk.size, 2) * tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), mergeObj({icon: "lovec-icon-pumping", iconCts: oblks}, data));
                        };
                    });
                },

                SolidPump, function(blk, data, dictProdItem, dictProdFld, dictProdBlk, dictProdUtp) {
                    let oblks = Vars.content.blocks().select(oblk => oblk instanceof Floor && oblk.attributes.get(blk.attribute) > 0.0).toArray();
                    if(oblks.length > 0) {
                        dictProdFld[blk.result.id].push(blk, blk.pumpAmount * Math.pow(blk.size, 2) * tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), mergeObj({icon: "lovec-icon-pumping", iconCts: oblks}, data));
                    };
                },

                PowerGenerator, function(blk, data, dictProdItem, dictProdFld, dictProdBlk, dictProdUtp) {
                    if(blk.powerProduction < 0.0001) return;
                    MDL_recipeDict.addCustomProdTerm(blk, "power", blk.powerProduction * tryFun(blk.ex_getRcDictPowOutputScl, blk, 1.0), mergeObj(data));
                },

                ConsumeGenerator, function(blk, data, dictProdItem, dictProdFld, dictProdBlk, dictProdUtp) {
                    db["dict"]["reader"]["produce"].read(PowerGenerator).apply(this, arguments);
                    if(blk.outputLiquid != null) dictProdFld[blk.outputLiquid.liquid.id].push(blk, blk.outputLiquid.amount * tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), mergeObj(data));
                },

                ThermalGenerator, function(blk, data, dictProdItem, dictProdFld, dictProdBlk, dictProdUtp) {
                    if(blk.powerProduction > 0.0) {
                        MDL_recipeDict.addCustomProdTerm(blk, "power", blk.powerProduction / blk.displayEfficiencyScale * tryFun(blk.ex_getRcDictPowOutputScl, blk, 1.0), mergeObj(data));
                    };
                    if(blk.outputLiquid != null) dictProdFld[blk.outputLiquid.liquid.id].push(blk, blk.outputLiquid.amount * Math.pow(blk.size, 2) * tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), mergeObj(data));
                },

                GenericCrafter, function(blk, data, dictProdItem, dictProdFld, dictProdBlk, dictProdUtp) {
                    let amt;
                    if(blk.outputItems != null) blk.outputItems.forEachFast(itemStack => {
                        amt = itemStack.amount * tryFun(blk.ex_getRcDictOutputScl, blk, 1.0);
                        if(amt <= 0) return;
                        dictProdItem[itemStack.item.id].push(blk, amt, mergeObj(data));
                    }, true);
                    if(blk.outputLiquids != null) blk.outputLiquids.forEachFast(liqStack => {
                        amt = liqStack.amount * tryFun(blk.ex_getRcDictOutputScl, blk, 1.0);
                        if(amt < 0.0001) return;
                        dictProdFld[liqStack.liquid.id].push(blk, amt, mergeObj(data));
                    }, true);
                },

                HeatProducer, function(blk, data, dictProdItem, dictProdFld, dictProdBlk, dictProdUtp) {
                    db["dict"]["reader"]["produce"].read(GenericCrafter).apply(this, arguments);
                    if(blk.heatOutput > 0.0 && blk.heatOutput < 1000.0) {
                        MDL_recipeDict.addCustomProdTerm(blk, "heat", blk.heatOutput, mergeObj(data));
                    };
                },

                Constructor, function(blk, data, dictProdItem, dictProdFld, dictProdBlk, dictProdUtp) {
                    Vars.content.blocks().each(
                        oblk => oblk.synthetic() && !(oblk instanceof CoreBlock) && oblk.size >= blk.minBlockSize && oblk.size <= blk.maxBlockSize && !DB_block.db["class"]["group"]["visibility"]["hidden"].includes(oblk.buildVisibility) && (blk.filter.size === 0 || blk.filter.contains(oblk)),
                        oblk => dictProdBlk[oblk.id].push(blk, tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), mergeObj({time: oblk.buildTime / blk.buildSpeed}, data)),
                    );
                },

                UnitFactory, function(blk, data, dictProdItem, dictProdFld, dictProdBlk, dictProdUtp) {
                    blk.plans.each(uPlan => {
                        dictProdUtp[uPlan.unit.id].push(blk, tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), mergeObj({time: uPlan.time}, data));
                    });
                },

                UnitAssembler, function(blk, data, dictProdItem, dictProdFld, dictProdBlk, dictProdUtp) {
                    blk.plans.each(uPlan => {
                        dictProdUtp[uPlan.unit.id].push(blk, tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), mergeObj({time: uPlan.time}, data));
                    });
                },

                Reconstructor, function(blk, data, dictProdItem, dictProdFld, dictProdBlk, dictProdUtp) {
                    blk.upgrades.each(arr => {
                        dictProdUtp[arr[1].id].push(blk, tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), mergeObj({ct: arr[0]}, data));
                    });
                },

                /* <------------------------------ Carpe Diem ------------------------------ */

                fetchClass("carpediem.world.blocks.storage.LandingPod", true), function(blk, data, dictProdItem, dictProdFld, dictProdBlk, dictProdUtp) {
                    db["dict"]["reader"]["produce"].read(fetchClass("carpediem.world.blocks.crafting.RecipeCrafter"), Function.air).apply(this, arguments);
                },

                fetchClass("carpediem.world.blocks.crafting.PressureCrafter", true), function(blk, data, dictProdItem, dictProdFld, dictProdBlk, dictProdUtp) {
                    db["dict"]["reader"]["produce"].read(GenericCrafter).apply(this, arguments);
                    if(blk.pressureProduction) {
                        MDL_recipeDict.addCustomProdTerm(blk, "cd-pressure", blk.pressureProduction, mergeObj(data));
                    };
                },

                fetchClass("carpediem.world.blocks.crafting.RecipeCrafter", true), function(blk, data, dictProdItem, dictProdFld, dictProdBlk, dictProdUtp) {
                    blk.recipes.each(rc => {
                        rc.outputs.each(rcO => {
                            if(instanceOfAny(rcO, fetchClass("carpediem.world.outputs.OutputItems", true))) {
                                rcO.items.forEachFast(itemStack => {
                                    if(itemStack.amount <= 0) return;
                                    dictProdItem[itemStack.item.id].push(blk, itemStack.amount, mergeObj({time: rc.craftTime, ct: rc.primaryOutput}, data));
                                }, true);
                            } else if(instanceOfAny(rcO, fetchClass("carpediem.world.outputs.OutputItems", true))) {
                                rcO.liquids.forEachFast(liqStack => {
                                    if(liqStack.amount < 0.0001) return;
                                    dictProdFld[liqStack.liquid.id].push(blk, liqStack.amount, mergeObj({time: rc.craftTime, ct: rc.primaryOutput}, data));
                                }, true);
                            };
                        });
                    });
                },

                fetchClass("carpediem.world.blocks.payloads.FanBlock", true), function(blk, data, dictProdItem, dictProdFld, dictProdBlk, dictProdUtp) {
                    let ProcessableBlock = fetchClass("carpediem.world.blocks.payloads.ProcessableBlock");
                    Vars.content.blocks().each(
                        oblk => oblk instanceof ProcessableBlock,
                        oblk => blk.processingTypes.each(rc => dictProdBlk[oblk.resultBlock.id].push(blk, 1, mergeObj({time: rc.baseTime, ct: oblk}, data))),
                    );
                },

                /* <------------------------------ MultiCrafter ------------------------------ */

                fetchClass("dev.jojofr.multicrafter.MultiCrafterBlock", true), function(blk, data, dictProdItem, dictProdFld, dictProdBlk, dictProdUtp) {
                    let i = 0, ordText;
                    blk.recipes.each(rc => {
                        i++;
                        ordText = ("[" + i + "]").color(Pal.accent);
                        if(rc.output.items != null) {
                            rc.output.items.forEachFast(itemStack => {
                                if(itemStack.amount <= 0) return;
                                dictProdItem[itemStack.item.id].push(blk, itemStack.amount, mergeObj({time: rc.craftTime, iconText: ordText}, data));
                            }, true);
                        };
                        if(rc.output.liquids != null) {
                            rc.output.liquids.forEachFast(liqStack => {
                                if(liqStack.amount < 0.0001) return;
                                dictProdFld[liqStack.liquid.id].push(blk, liqStack.amount, mergeObj({time: rc.craftTime, iconText: ordText}, data));
                            }, true);
                        };
                        if(rc.output.payloads != null) {
                            rc.output.payloads.forEachFast(payStack => {
                                if(payStack.amount <= 0) return;
                                (payStack.item instanceof Block ? dictProdBlk : dictProdUtp)[payStack.item.id].push(blk, payStack.amount, mergeObj({time: rc.craftTime, iconText: ordText}, data));
                            }, true);
                        };
                        if(rc.output.power > 0.0) {
                            MDL_recipeDict.addCustomProdTerm(blk, "power", rc.output.power, mergeObj({time: rc.craftTime, iconText: ordText}, data))
                        };
                        if(rc.output.heat > 0.0) {
                            MDL_recipeDict.addCustomProdTerm(blk, "heat", rc.output.heat, mergeObj({time: rc.craftTime, iconText: ordText}, data))
                        };
                    });
                },

                /* <------------------------------ New Horizon ------------------------------ */

                fetchClass("newhorizon.expand.block.production.factory.MultiBlockCrafter", true), function(blk, data, dictProdItem, dictProdFld, dictProdBlk, dictProdUtp) {
                    db["dict"]["reader"]["produce"].read(GenericCrafter, Function.air)(blk, data, dictProdItem, dictProdFld, dictProdBlk, dictProdUtp);
                },

                fetchClass("newhorizon.expand.block.production.factory.RecipeGenericCrafter", true), function(blk, data, dictProdItem, dictProdFld, dictProdBlk, dictProdUtp) {
                    let i = 0, ordText;
                    blk.recipes.each(rc => {
                        i++;
                        ordText = ("[" + i + "]").color(Pal.accent);
                        rc.outputItem.each(itemStack => {
                            if(itemStack.amount <= 0) return;
                            dictProdItem[itemStack.item.id].push(blk, itemStack.amount, mergeObj({time: rc.craftTime, iconText: ordText}, data));
                        });
                        rc.outputLiquid.each(liqStack => {
                            if(liqStack.amount < 0.0001) return;
                            dictProdFld[liqStack.liquid.id].push(blk, liqStack.amount, mergeObj({time: rc.craftTime, iconText: ordText}, data));
                        });
                        rc.outputPayload.each(payStack => {
                            if(payStack.amount <= 0) return;
                            (payStack.item instanceof Block ? dictProdBlk : dictProdUtp)[payStack.item.id].push(blk, payStack.amount, mergeObj({time: rc.craftTime, iconText: ordText}, data));
                        });
                    });
                },

                fetchClass("newhorizon.expand.block.special.JumpGate", true), function(blk, data, dictProdItem, dictProdFld, dictProdBlk, dictProdUtp) {
                    let rc;
                    blk.recipeList.each(unitRc => {
                        rc = unitRc.recipe;
                        rc.outputItem.each(itemStack => {
                            if(itemStack.amount <= 0) return;
                            dictProdItem[itemStack.item.id].push(blk, itemStack.amount, mergeObj({time: unitRc.craftTime, ct: unitRc.unitType}, data));
                        });
                        rc.outputLiquid.each(liqStack => {
                            if(liqStack.amount < 0.0001) return;
                            dictProdFld[liqStack.liquid.id].push(blk, liqStack.amount, mergeObj({time: unitRc.craftTime, ct: unitRc.unitType}, data));
                        });
                        rc.outputPayload.each(payStack => {
                            if(payStack.amount <= 0) return;
                            (payStack.item instanceof Block ? dictProdBlk : dictProdUtp)[payStack.item.id].push(blk, payStack.amount, mergeObj({time: unitRc.craftTime, ct: unitRc.unitType}, data));
                        });
                        dictProdUtp[unitRc.unitType.id].push(blk, 1, mergeObj({time: unitRc.craftTime, ct: unitRc.unitType}, data));
                    });
                },

            ],


            /**
             * Used to add consumption terms for a particular block in recipe dictionary.
             * @type {Array}
             * @lovecRow `string` - nameBlk
             * @lovecRow `RecipeDictionaryConsumeReader` - reader
             */
            consumeSpec: [],


            /**
             * Used to add production terms for a particular block in recipe dictionary.
             * @type {Array}
             * @lovecRow `string` - nameBlk
             * @lovecRow `RecipeDictionaryProduceReader` - reader
             */
            produceSpec: [

                /* <------------------------------ New Horizon ------------------------------ */

                "new-horizon-photothermal-generator", function(blk, data, dictProdItem, dictProdFld, dictProdBlk, dictProdUtp) {
                    dictProdItem[Vars.content.item("new-horizon-hard-light").id].push(blk, 1, mergeObj({time: 120.0}, data));
                },

                "new-horizon-geological-photothermal-generator", function(blk, data, dictProdItem, dictProdFld, dictProdBlk, dictProdUtp) {
                    dictProdItem[Vars.content.item("new-horizon-hard-light").id].push(blk, 1, mergeObj({time: 120.0}, data));
                },

                "new-horizon-vector-condenser", function(blk, data, dictProdItem, dictProdFld, dictProdBlk, dictProdUtp) {
                    dictProdItem[Vars.content.item("new-horizon-hard-light").id].push(blk, 2, mergeObj({time: 120.0}, data));
                },

                "new-horizon-differential-reactor", function(blk, data, dictProdItem, dictProdFld, dictProdBlk, dictProdUtp) {
                    dictProdItem[Vars.content.item("new-horizon-hard-light").id].push(blk, 1, mergeObj({time: 120.0}, data));
                },

                "new-horizon-photon-panel", function(blk, data, dictProdItem, dictProdFld, dictProdBlk, dictProdUtp) {
                    dictProdItem[Vars.content.item("new-horizon-hard-light").id].push(blk, 1, mergeObj({time: 300.0}, data));
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
         * @type {Array}
         * @lovecRow `string` - nameRsTarget
         * @lovecRow `Array<string>` - nameRss
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
             * @type {Array}
             * @lovecRow `ContentTypeGn` - type
             * @lovecRow `OreDictionaryConsumeSetter` - setter
             */
            consume: [

                ConsumeItems, (blk, cons, oreDict) => {
                    cons.items.forEachFast(itemStack => {
                        itemStack.item = oreDict.get(itemStack.item, itemStack.item);
                    }, true);
                },

                ConsumeLiquid, (blk, cons, oreDict) => {
                    Reflect.set(ConsumeLiquid, cons, "liquid", oreDict.get(cons.liquid, cons.liquid));
                },

                ConsumeLiquids, (blk, cons, oreDict) => {
                    cons.liquids.forEachFast(liqStack => {
                        liqStack.liquid = oreDict.get(liqStack.liquid, liqStack.liquid);
                    }, true);
                },

            ],


            /**
             * Used to modify producers for ore dictionary.
             * @type {Array}
             * @lovecRow `ContentTypeGn` - type
             * @lovecRow `OreDictionaryProduceSetter` - setter
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
                    if(blk.outputItems != null) blk.outputItems.forEachFast(itemStack => itemStack.item = oreDict.get(itemStack.item, itemStack.item), true);
                    if(blk.outputLiquids != null) blk.outputLiquids.forEachFast(liqStack => liqStack.liquid = oreDict.get(liqStack.liquid, liqStack.liquid), true);
                },

            ],


        },


    },


    /* <------------------------------ CHUNK SPLITTER ------------------------------ */


    gen: {


        /**
         * Used to check if recipe should be created for some content.
         * @type {Array<F3Function<UnlockableContent, RecipeMetaObject, RecipeParamObject, boolean>>}
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
                return LCProp.getSize(ct) <= readParam(metaObj, "sizeCap", Infinity);
            },

        ],


        /**
         * Used to modify final recipe object.
         * @type {Array}
         * @lovecRow `F3Function<UnlockableContent, RecipeMetaObject, RecipeParamObject>` - boolF - Condition check.
         * @lovecRow `C3Function<Object, RecipeMetaObject, RecipeParamObject>` - scr - Used to modify recipe object.
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
                let hardness = Math.max.apply(null, bi.flatten().pullAll(-1.0).readCol(3, 0).inSituMap(nameRs => MDL_content.getCt(nameRs, "rs").hardness).compact().unshiftAll(0.0));
                obj.durabDecMtp = Mathf.lerp(1.0, 2.0 * readParam(metaObj, "abrasionFactor"), Mathf.maxZero(hardness - readParam(metaObj, "minHardness", 0)) / 10.0);
            },

        ],


        /**
         * "GROUP: xxx" in recipe I/O arrays.
         * @type {Array}
         * @lovecRow `string` - grpStr - Group name without "GROUP: ".
         * @lovecRow `[string, RecipeGroupData]` - [nameRs, data]
         */
        group: [],


    },


    /* <------------------------------ CHUNK SPLITTER ------------------------------ */


    /**
     * Collection of raw recipe data used in {@link TP_recipeGen}.
     * @type {Object<string, Array|Object<string, Array>>}
     * @lovecExtensible {@link LCModDBRegister.rcGenData}
     */
    genData: {


        /**
         * @type {Object<string, Array>}
         * @lovecExtensible {@link LCModDBRegister.rcGenAssemblyData}
         */
        assembly: {


          /** @type {RecipeRawData2Array} */
          ammunition: [],


          /** @type {RecipeRawData2Array} */
          electrode: [],


          /** @type {RecipeRawData2Array} */
          membrane: [],


          /** @type {RecipeRawData2Array} */
          brickBlock: [],


        },


        /** @type {RecipeRawData2Array} */
        alloying: [],


        /**
         * @type {RecipeRawData2Array}
         * @lovecAutoRecipe
         */
        brickBaking: [],


        /** @type {RecipeRawData2Array} */
        carbonization: [],


        /** @type {RecipeRawData2Array} */
        casting: [],


        /**
         * @type {RecipeRawData2Array}
         * @lovecAutoRecipe
         */
        condensation: [],


        /**
         * @type {RecipeRawData2Array}
         * @lovecAutoRecipe
         */
        dryingItem: [],


        /**
         * @type {RecipeRawData2Array}
         * @lovecAutoRecipe
         */
        dryingLiquid: [],


        /**
         * @type {RecipeRawData2Array}
         * @lovecAutoRecipe
         */
        dryingLiquidAcidic: [],


        /**
         * @type {RecipeRawData2Array}
         * @lovecAutoRecipe
         */
        dryingLiquidBasic: [],


        /**
         * @type {RecipeRawData2Array}
         * @lovecAutoRecipe
         */
        dryingGas: [],


        /**
         * @type {RecipeRawData2Array}
         * @lovecAutoRecipe
         */
        dryingGasAcidic: [],


        /**
         * @type {RecipeRawData2Array}
         * @lovecAutoRecipe
         */
        dryingGasBasic: [],


        /**
         * @type {RecipeRawData2Array}
         * @lovecAutoRecipe
         */
        dryingFreeze: [],


        /**
         * @type {RecipeRawData2Array}
         * @lovecAutoRecipe
         */
        filtration: [],


        /**
         * @type {RecipeRawData2Array}
         * @lovecAutoRecipe
         */
        filtrationLiquid: [],


        /** @type {RecipeRawData2Array} */
        forging: [],


        /**
         * @type {RecipeRawData2Array}
         * @lovecAutoRecipe
         */
        heatingExchange: [],


        /**
         * @type {RecipeRawData2Array}
         * @lovecAutoRecipe
         */
        heatingGas: [],


        /** @type {RecipeRawData2Array} */
        mixing: [],


        /** @type {RecipeRawData2Array} */
        ballMillMixing: [],


        /** @type {RecipeRawData2Array} */
        mixingLiquid: [],


        /**
         * @type {RecipeRawData2Array}
         * @lovecAutoRecipe
         */
        pulverization: [],


        /**
         * @type {RecipeRawData2Array}
         * @lovecAutoRecipe
         */
        purificationI: [],


        /**
         * @type {RecipeRawData2Array}
         * @lovecAutoRecipe
         */
        purificationII: [],


        /**
         * @type {RecipeRawData2Array}
         * @lovecAutoRecipe
         */
        purificationMagnetic: [],


        /** @type {RecipeRawData2Array} */
        purificationFloat: [],


        /** @type {RecipeRawData2Array} */
        reactionGas: [],


        /** @type {RecipeRawData2Array} */
        reactionLiquid: [],


        /** @type {RecipeRawData2Array} */
        reactionMelt: [],


        /** @type {RecipeRawData2Array} */
        reactionBurnGas: [],


        /** @type {RecipeRawData2Array} */
        reactionBurnLiquid: [],


        /** @type {RecipeRawData2Array} */
        reactionBurnSolid: [],


        /**
         * @type {RecipeRawData2Array}
         * @lovecAutoRecipe
         */
        roasting: [],


        /**
         * @type {RecipeRawData2Array}
         * @lovecAutoRecipe
         */
        rockCrushing: [],


        /**
         * @type {RecipeRawData2Array}
         * @lovecAutoRecipe
         */
        concentrateRoasting: [],


        /**
         * @type {RecipeRawData2Array}
         * @lovecAutoRecipe
         */
        smelting: [],


        /**
         * @type {RecipeRawData2Array}
         * @lovecAutoRecipe
         */
        concentrateSmelting: [],


    },


};


LCModDBRegister
.apply("rcGenData", db["genData"])
.apply("rcGenAssemblyData", db["genData"]["assembly"]);


mergeDB(db, "DB_recipe");


exports.db = db;
