/* ----------------------------------------
 * NOTE:
 *
 * Database of miscellaneous uncategorized data.
 * ---------------------------------------- */


// Be careful with any module here to avoid looped reference!
// Better use {global.lovec} if possible
const LIB_pinyin = require("lovec/lib/LIB_pinyin");
const MDL_bundle = require("lovec/mdl/MDL_bundle");
const MDL_cond = require("lovec/mdl/MDL_cond");
const MDL_text = require("lovec/mdl/MDL_text");
const DB_item = require("lovec/db/DB_item");
const DB_fluid = require("lovec/db/DB_fluid");


const db = {


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  block: {


    /* ----------------------------------------
     * NOTE:
     *
     * Maps a block name before change to the changed name.
     * Used when internal name of some block is changed.
     * ---------------------------------------- */
    migration: [

      "lovec-unit0misc-loot", "loveclab-unit0misc-loot",

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * Extra text information shown when mouse hovered over a tile.
     * Put functions that return string here to build final string. Yep, string only.
     * Tile won't be {null} here. It's safe to return {undefined} or {null}.
     * Format: {(t, b) => str}.
     * ---------------------------------------- */
    extraInfo: [

      // Ore item info
      (t, b) => {
        let itm = t.wallDrop() || t.drop();
        if(itm == null) return;

        return String.multiline(
          MDL_cond._isDepthOre(t.overlay()) ? null : (MDL_bundle._term("lovec", "ore") + MDL_text._colon() + itm.localizedName.plain()),
          MDL_bundle._term("lovec", "ore-hardness") + MDL_text._colon() + itm.hardness,
        );
      },

      // Ore liquid info
      (t, b) => {
        let liq = t.floor().liquidDrop;
        if(liq == null) return;

        return String.multiline(
          MDL_bundle._term("lovec", "liquid") + MDL_text._colon() + liq.localizedName.plain(),
          MDL_bundle._term("lovec", "liquid-multiplier") + MDL_text._colon() + t.floor().liquidMultiplier.perc(),
        );
      },

      // Conveyor info
      (t, b) => {
        if(b == null || b.items == null || (!(b.block instanceof Conveyor) && !(b.block instanceof Duct) && !(b.block instanceof StackConveyor))) return;
        let itm = b.items.first();
        if(itm == null) return;

        return String.multiline(
          MDL_bundle._term("lovec", "item") + MDL_text._colon() + itm.localizedName.plain(),
        );
      },

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * Maps depth level to a term.
     * See {INTF_ENV_depthOverlay}.
     * ---------------------------------------- */
    depthName: [

      0, ["lovec", "depth-0"],
      1, ["lovec", "depth-1"],
      2, ["lovec", "depth-2"],
      3, ["lovec", "depth-3"],
      4, ["lovec", "depth-4"],

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * Filters for {BLK_wireNode}.
     * ---------------------------------------- */
    nodeLinkFilter: [

      "any", (b, b_t) => true,

      "cons", (b, b_t) => MDL_cond._isPowerTransmitter(b.block) && !MDL_cond._isPowerTransmitter(b_t.block),

      "trans", (b, b_t) => MDL_cond._isPowerTransmitter(b.block) && MDL_cond._isPowerTransmitter(b_t.block),

      "self", (b, b_t) => b.block === b_t.block,

      "node", (b, b_t) => MDL_cond._isPowerNode(b.block) && MDL_cond._isPowerNode(b_t.block),

      "relay", (b, b_t) => MDL_cond._isPowerRelay(b_t.block),

      "remote-node", (b, b_t) => MDL_cond._isPowerRelay(b_t.block) || b.block === b_t.block,

    ],


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  mod: {


    /* ----------------------------------------
     * NOTE:
     *
     * @CONTENTGEN
     * List of names of Lovec-based mods.
     * {PARAM.modded} will be {true} if any of these exists, which enables extra mechanics.
     * You don't need put your mod name here, just use write {dependencies} or {softDependencies} in your mod.json.
     * ---------------------------------------- */
    lovecMod: [],


    /* ----------------------------------------
     * NOTE:
     *
     * Overwrites the vanilla list of menu flyers.
     * ---------------------------------------- */
    menuFlyer: [

      "crawler",
      "oct",
      "risso",

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * Sounds listed here will be loaded beforehand, or it takes time to be loaded in game.
     * ---------------------------------------- */
    extraSound: [

      "se-meme-steel-pipe",

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * Used to set up draggable button group.
     * Format: {nm, [rowInd, iconStr, isToggle, scr, updateScr]}.
     *
     * {this} in {updateScr} is the button.
     * ---------------------------------------- */
    dragButton: {


      base: [

        "lovec-player-detach-camera", {
          rowInd: 0,
          icon: "lovec-icon-detach-camera",
          isToggle: true,
          updateScr: function() {
            Core.settings.put("detach-camera", this.isChecked());
            if(this.isChecked() && Vars.player.unit() != null) Vars.player.unit().apply(StatusEffects.unmoving, 5.0);
          },
        },

        "lovec-setting-unit-health", {
          rowInd: 0,
          icon: "lovec-icon-health",
          clickScr: function() {
            Core.settings.put("lovec-unit0stat-show", !fetchSetting("unit0stat-show"));
            global.lovec.param.forceLoadParam();
          },
        },

        "lovec-setting-unit-range", {
          rowInd: 0,
          icon: "lovec-icon-range",
          clickScr: function() {
            Core.settings.put("lovec-unit0stat-range", !fetchSetting("unit0stat-range"));
            global.lovec.param.forceLoadParam();
          },
        },

        "lovec-info-wave-enemies", {
          rowInd: 0,
          icon: "units",
          clickScr: function() {
            fetchDialog("waveInfo").ex_show(null);
          },
        },

        "lovec-info-achievement", {
          rowInd: 0,
          icon: "lovec-icon-trophy",
          clickScr: function() {
            fetchDialog("achievement").ex_show();
          },
        },

      ],


      /* ----------------------------------------
       * NOTE:
       *
       * Buttons defined here will only be added if {PARAM.modded}.
       * ---------------------------------------- */
      modded: [

        "lovec-player-take-loot", {
          rowInd: 0,
          icon: "lovec-icon-take-loot",
          clickScr: function() {
            let unit = Vars.player.unit();
            if(unit == null) return;
            let loot = Units.closest(null, unit.x, unit.y, global.lovec.var.rad_lootPickRad, ounit => global.lovec.mdl_cond._isLoot(ounit));
            if(loot == null) return;
            if(global.lovec.frag_item.takeUnitLoot_global(unit, loot)) {
              global.lovec.mdl_effect.showBetween_itemTransfer(loot.x, loot.y, unit, null, null, true);
            };
          },
        },

        "lovec-player-drop-loot", {
          rowInd: 0,
          icon: "lovec-icon-drop-loot",
          clickScr: function() {
            let unit = Vars.player.unit();
            if(unit == null) return;
            if(unit.stack.amount > 0) {
              Vars.net.client() ?
                global.lovec.mdl_call.spawnLoot_client(unit.x, unit.y, unit.item(), unit.stack.amount, 0.0) :
                global.lovec.mdl_call.spawnLoot_server(unit.x, unit.y, unit.item(), unit.stack.amount, 0.0);
              unit.clearItem();
            };
          },
        },

        "lovec-player-destroy-loot", {
          rowInd: 0,
          icon: "lovec-icon-destroy-loot",
          clickScr: function() {
            let unit = Vars.player.unit();
            if(unit == null) return;
            let loot = Units.closest(null, unit.x, unit.y, global.lovec.var.rad_lootPickRad, ounit => global.lovec.mdl_cond._isLoot(ounit));
            if(loot == null) return;
            global.lovec.frag_item.destroyLoot_global(loot);
          },
        },

      ],


    },


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  search: {


    /* ----------------------------------------
     * NOTE:
     *
     * Extra tags used for search.
     * ---------------------------------------- */
    tag: [

      "no:", (ct, str) => !ct.name.toLowerCase().includes(str) && !Strings.stripColors(ct.localizedName).toLowerCase().includes(str) && (!Core.settings.getString("locale") === "zh_CN" || !LIB_pinyin.fetchPinyin(Strings.stripColors(ct.localizedName)).toLowerCase().includes(str)),

      "mod:", (ct, str) => ct.minfo.mod !== null && ct.minfo.mod.name === str,

      "hardness:", (ct, str) => ct instanceof Item && ct.hardness == str,

      "group:", (ct, str) => db["search"]["group"].read(str, Function.airFalse)(ct),

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * @CONTENTGEN
     * {"group:xxx"}.
     * ---------------------------------------- */
    group: [

      "flammable", ct => ct.flammability != null && ct.flammability > 0.0,
      "explosive", ct => ct.explosiveness != null && ct.explosiveness > 0.0,
      "charged", ct => ct.charge != null && ct.charge > 0.0,
      "radioactive", ct => ct.radioactivity != null && ct.radioactivity > 0.0,
      "viscous", ct => ct.viscosity != null && ct.viscosity > 0.5,
      "coolant", ct => ct.coolanet != null && ct.coolant && ct.temperature != null && ct.temperature <= 0.5 && ct.flammability != null && ct.flammability < 0.1,

      "intermediate", ct => MDL_cond._isIntermediate(ct),
      "waste", ct => MDL_cond._isWaste(ct),

      "sand", ct => DB_item.db["group"]["sand"].includes(ct.name),
      "aggregate", ct => DB_item.db["group"]["aggregate"].includes(ct.name),

      "aqueous", ct => DB_fluid.db["group"]["aqueous"].includes(ct.name),
      "conductive", ct => DB_fluid.db["group"]["conductive"].includes(ct.name),
      "aux", ct => MDL_cond._isAuxiliaryFluid(ct),

    ],


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  recipe: {


    /* ----------------------------------------
     * NOTE:
     *
     * Used to read a particular consumer.
     * Format: {cls, (blk, cons, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {...}}.
     * ---------------------------------------- */
    consumeReader: [

      /* <---------- item ----------> */

      ConsumeItemFilter, (blk, cons, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
        Vars.content.items().each(itm => {
          if(blk.itemFilter[itm.id]) dictConsItm[itm.id].push(blk, 1, {});
        });
      },

      ConsumeItems, (blk, cons, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
        cons.items.forEachFast(itmStack => dictConsItm[itmStack.item.id].push(blk, itmStack.amount, {icon: cons.optional ? "lovec-icon-optional" : null}));
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
          dictConsFld[cons.liquid.id].push(blk, cons.amount, {icon: cons.optional ? "lovec-icon-optional" : null});
        };
      },

      ConsumeLiquids, (blk, cons, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) => {
        cons.liquids.forEachFast(liqStack => dictConsFld[liqStack.liquid.id].push(blk, liqStack.amount, {icon: cons.optional ? "lovec-icon-optional" : null}));
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


    /* ----------------------------------------
     * NOTE:
     *
     * Used to read a particular class of blocks to get production list.
     * Format: {cls, (blk, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {...}}.
     * ---------------------------------------- */
    produceReader: [

      Drill, (blk, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
        Vars.content.items().each(itm => itm.hardness <= blk.tier && !((blk.blockedItems != null && blk.blockedItems.contains(itm)) || ((blk.blockedItems == null || blk.blockedItems.size === 0) && tryJsProp(blk, "itmWhiteList") != null && !tryJsProp(blk, "itmWhiteList").includes(itm))) && Vars.content.blocks().toArray().some(oblk => ((oblk instanceof Floor && !(oblk instanceof OverlayFloor)) || (oblk instanceof OverlayFloor && !oblk.wallOre)) && oblk.itemDrop === itm), itm => dictProdItm[itm.id].push(blk, Math.pow(blk.size, 2) * (blk instanceof BurstDrill ? 1.0 : blk.drillTime / blk.getDrillTime(itm)) * tryFun(blk.ex_getRcDictOutputScl, blk, 1.0), {icon: "lovec-icon-mining"}));
      },

      BeamDrill, (blk, dictProdItm, dictProdFld, dictProdBlk, dictProdUtp) => {
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
          oblk => !(oblk instanceof CoreBlock) && oblk.size >= blk.minBlockSize && oblk.size <= blk.maxBlockSize && (blk.filter.size === 0 || blk.filter.contains(oblk)),
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


    /* ----------------------------------------
     * NOTE:
     *
     * Used to generate default files for ore dictionary.
     * DO NOT MODIFY THIS!
     * For other mods, simply put .csv files in "./saves/mods/data/sharedData/ore-dict".
     * ---------------------------------------- */
    oreDictDef: [

      "beryllium", [],
      "blast-compound", [],
      "carbide", [],
      "coal", ["loveclab-item0chem-coal"],
      "copper", ["loveclab-item0chem-copper"],
      "graphite", ["loveclab-item0chem-graphite"],
      "lead", ["loveclab-item0chem-lead"],
      "metaglass", [],
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

      "cryofluid", [],
      "oil", ["loveclab-liq0ore-crude-oil"],
      "slag", [],
      "water", ["loveclab-liq0ore-water"],

    ],


    oreDictConsSetter: [

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


    oreDictProdSetter: [

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


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  lsav: {


    /* ----------------------------------------
     * NOTE:
     *
     * Properties that is saved in a .lsav file.
     * Format: {header, def, arrMode}.
     * ---------------------------------------- */
    header: [

      "useless-field", "ohno", null,
      "save-map", "!UNDEF", null,

      "dynamic-pollution", 0.0, null,
      "bits", [], "string",
      "bit-hash", [], "string",
      "flags", [], "string",

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * Properties here are safe (or required) to be set by client sides.
     * ---------------------------------------- */
    safe: [

      "bits",
      "bit-hash",

    ],


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  texture: {


    /* ----------------------------------------
     * NOTE:
     *
     * Icons polulated in {VARGEN.icons}.
     * Format: {nm, nmReg}.
     * ---------------------------------------- */
    icon: [

      "ohno", "error",

      "check", "lovec-icon-check",
      "cross", "lovec-icon-cross",
      "harvest", "lovec-icon-harvest",
      "play", "lovec-icon-play",
      "questionMark", "lovec-icon-question-mark",
      "swap", "lovec-icon-swap",

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * Noise textures polulated in {VARGEN.noiseTexs}.
     * Format: {nm, path}.
     * ---------------------------------------- */
    noise: [

      "caustics", "sprites/caustics.png",
      "clouds", "sprites/clouds.png",
      "distortAlpha", "sprites/distortAlpha.png",
      "fog", "sprites/fog.png",
      "noise", "sprites/noise.png",
      "noiseAlpha", "sprites/noiseAlpha.png",

    ],


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  drama: {


    chara: {


      /* ----------------------------------------
       * NOTE:
       *
       * The colors used for characters in dialog flow.
       * Format: {nmMod, nmChara, color_gn}.
       * ---------------------------------------- */
      color: [

        "lovec", "earlan", "d4c0d8",

        "projreind", "shirone", "e2cad1",
        "projreind", "expe", "d6eaff",

      ],


    },


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


};


Object.mergeDB(db, "DB_misc");


Vars.mods.eachEnabled(mod => {
  if(mod.meta.dependencies.contains("lovec") || mod.meta.softDependencies.contains("lovec")) db["mod"]["lovecMod"].push(mod.name);
});


Object._it(DB_fluid.db["group"]["elementary"], (eleGrp, arr) => {
  db["search"]["group"].push(eleGrp, ct => arr.includes(ct.name));
});


exports.db = db;
