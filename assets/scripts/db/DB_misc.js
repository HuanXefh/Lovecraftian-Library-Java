/**
 * Database of miscellaneous uncategorized data.
 * @module lovec/db/DB_misc
 */


const db = {


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  block: {


    /**
     * Maps a block/unit name before change to the changed name.
     * Used when internal name of some block is changed.
     * <br> <ROW>: nmPrev, nmCur.
     */
    migration: [

      "lovec-unit0misc-loot", "loveclab-unit0misc-loot",

      "loveclab-env0tree0bush-rocky-furn", "loveclab-env0tree0bush-rocky-fern",

      "projreind-bliq0stor-pressure-router", "projreind-bliq0aux-pressure-router",

    ],


    /**
     * Extra text information shown when mouse hovered over a tile, see {@link MDL_draw.drawExtraInfo}.
     * Put functions that return string here to build final string. Yep, string only.
     * Tile won't be null here, and it's safe to return undefined or null, result will be skipped.
     * <br> <ROW>: strGetter.
     * <br> <ARGS>: t, b.
     */
    extraInfo: [

      // Ore item info
      (t, b) => {
        let itm = t.wallDrop() || t.drop();
        if(itm == null) return;
        let blk;
        if(t.overlay().itemDrop === itm && t.overlay().wallOre) {
          blk = t.overlay();
        } else if(t.block().itemDrop === itm) {
          blk = t.block();
        } else if(t.overlay().itemDrop === itm) {
          blk = t.overlay();
        } else {
          blk = t.floor();
        };

        return String.multiline(
          MDL_cond._isDepthOre(t.overlay()) ? null : (MDL_bundle._term("lovec", "ore") + MDL_text._colon() + itm.localizedName.plain()),
          MDL_bundle._term("lovec", "ore-hardness") + MDL_text._colon() + tryJsProp(blk, "dropHardness", itm.hardness),
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

      // Puddle info
      (t, b) => {
        let puddle = Puddles.get(t);
        if(puddle == null) return;

        return String.multiline(
          MDL_bundle._term("lovec", "puddle") + MDL_text._colon() + puddle.liquid.localizedName.plain(),
        );
      },

    ],


    graph: {


      /**
       * Maps graph type to its init method.
       * See {@Link INTF_BLK_graphBlock}.
       * <br> <ROW>: graphType, fun.
       */
      init: [

        "cable", graph => {
          graph.graphData.overloadFrac = 0.0;
          graph.graphData.overloadTimeCur = 0.0;
          graph.graphData.maxPowProdAllowed = graph.getData(0).ex_getMaxPowProdAllowed();
        },

      ],


      /**
       * Maps graph type to its update method.
       * See {@Link INTF_BLK_graphBlock}.
       * <br> <ROW>: graphType, fun.
       */
      update: [

        "test", graph => {
          if(TIMER.secTwo) print(graph);
        },

        "cable", graph => {
          if(PARAM.UPDATE_DEEP_SUPPRESSED || !isFinite(graph.graphData.maxPowProdAllowed) || graph.getSize() === 0) return;

          let powProd = graph.getData(0).power.graph.getLastPowerProduced() / Time.delta;
          if(TIMER.secHalf) {
            graph.graphData.overloadFrac = Mathf.approach(graph.graphData.overloadFrac, powProd > VAR.param.powSourceStdProd ? 0.0 : Mathf.clamp(powProd / graph.getData(0).ex_getMaxPowProdAllowed()), 0.2);
          };
          if(graph.graphData.overloadFrac < 1.0 || powProd > VAR.param.powSourceStdProd) {
            graph.graphData.overloadTimeCur = 0.0;
          } else {
            graph.graphData.overloadTimeCur += Time.delta;
          };
          if(graph.graphData.overloadTimeCur > VAR.time.powTransOverloadTime) {
            graph.each(
              (ob, vert) => ob.isAdded() && !ob.isPayload(),
              (ob, vert) => ob.damagePierce(ob.maxHealth * VAR.param.shortCircuitDmgFrac / 30.0 * ob.block.delegee.transmitterOverloadDmgScl),
            );
          };
        },

      ],


    },


    /**
     * Maps depth level to a term.
     * See {@link INTF_ENV_depthOverlay}.
     * <br> <ROW>: lvl, [nmMod, tag].
     * <br> <BUNDLE>: "term.<nmMod>-term-<tag>.name".
     */
    depthName: [

      0, ["lovec", "depth-0"],
      1, ["lovec", "depth-1"],
      2, ["lovec", "depth-2"],
      3, ["lovec", "depth-3"],
      4, ["lovec", "depth-4"],

    ],


    /**
     * Filters for {@link BLK_wireNode} that select valid links.
     * <br> <ROW>: mode, boolF.
     * <br> <ARGS>: b, b_t.
     */
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


    /**
     * List of names of Lovec-based mods.
     * {@link PARAM.MODDED} will be true if any of these exists, which enables extra mechanics.
     * You don't need to put your mod name here, just use write `dependencies` or `softDependencies` in your mod.json.
     * <br> <CONTENTGEN>
     * <br> <ROW>: nmMod.
     * ---------------------------------------- */
    lovecMod: [],


    /**
     * Overwrites the vanilla list of menu flyers.
     * <br> <ROW>: utp.
     */
    menuFlyer: [

      "crawler",
      "oct",
      "risso",

    ],


    /**
     * Sounds listed here will be loaded beforehand, or it takes time to be loaded in game.
     * <br> <ROW>: nmSe.
     */
    extraSound: [

      "se-meme-steel-pipe",

    ],


    /**
     * Used to set up draggable button group.
     * `this` in `updateScr` is the button.
     * <br> <ROW>: nm, {rowInd, icon, isToggle, clickScr, updateScr}.
     */
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
            PARAM.forceLoadParam();
          },
        },

        "lovec-setting-unit-range", {
          rowInd: 0,
          icon: "lovec-icon-range",
          clickScr: function() {
            Core.settings.put("lovec-unit0stat-range", !fetchSetting("unit0stat-range"));
            PARAM.forceLoadParam();
          },
        },

        "lovec-info-wave-enemies", {
          rowInd: 0,
          icon: "units",
          clickScr: function() {
            fetchDialog("waveInfo").ex_show(null);
          },
        },

        "lovec-info-info-list", {
          rowInd: 0,
          icon: "lovec-icon-info-panel",
          clickScr: function() {
            CLS_dragButtonInfoList.show();
          },
        },

        "lovec-player-dump-item-to-core", {
          rowInd: 1,
          icon: "lovec-icon-to-core",
          clickScr: function() {
            let unit = Vars.player.unit();
            if(unit == null) return;
            let b = unit.closestCore();
            if(b == null || !b.within(unit, unit.range())) return;
            FRAG_item.dropBuildItem(unit, b);
          },
        },

        "lovec-player-teleport", {
          rowInd: 1,
          icon: "lovec-icon-teleport",
          isToggle: true,
          updateScr: function() {
            if(!this.isChecked()) return;
            if(!global.lovecUtil.fun._isSandBox()) {
              this.setChecked(false);
              PARAM.IS_TELEPORTING = false;
              MDL_ui.show_fadeInfo("lovec", "sandbox-only");
              return;
            };

            PARAM.IS_TELEPORTING = true;
            if(Core.input.keyTap(KeyCode.mouseLeft)) {
              let unit = Vars.player.unit();
              let vec = Core.input.mouseWorld();
              if(unit != null && unit.canPass(vec.x.toIntCoord(), vec.y.toIntCoord())) {
                let vecPrev = new Vec2(unit.x, unit.y);
                unit.set(vec);
                MDL_effect._e_line(unit.x, unit.y, null, vecPrev, Pal.accent, 1.5);
              };
              this.setChecked(false);
              PARAM.IS_TELEPORTING = false;
            } else if(Core.input.keyTap(KeyCode.mouseRight)) {
              this.setChecked(false);
              PARAM.IS_TELEPORTING = false;
            };
          },
        },

      ],


      /**
       * Buttons defined here will only be added if `PARAM.MODDED`.
       * <br> <ROW>: nm, {rowInd, icon, isToggle, clickScr, updateScr}.
       */
      modded: [

        "lovec-player-take-loot", {
          rowInd: 1,
          icon: "lovec-icon-take-loot",
          clickScr: function() {
            let unit = Vars.player.unit();
            if(unit == null) return;
            let loot = Units.closest(null, unit.x, unit.y, VAR.range.lootPickRad, ounit => MDL_cond._isLoot(ounit));
            if(loot == null) return;
            if(FRAG_item.takeUnitLoot_global(unit, loot)) {
              MDL_effect._e_itemTransfer(loot.x, loot.y, unit, null, null, true);
            };
          },
        },

        "lovec-player-drop-loot", {
          rowInd: 1,
          icon: "lovec-icon-drop-loot",
          clickScr: function() {
            let unit = Vars.player.unit();
            if(unit == null) return;
            if(unit.stack.amount > 0) {
              Vars.net.client() ?
                MDL_call.spawnLoot_client(unit.x, unit.y, unit.item(), unit.stack.amount, 0.0) :
                MDL_call.spawnLoot_server(unit.x, unit.y, unit.item(), unit.stack.amount, 0.0);
              unit.clearItem();
            };
          },
        },

        "lovec-player-destroy-loot", {
          rowInd: 1,
          icon: "lovec-icon-destroy-loot",
          clickScr: function() {
            let unit = Vars.player.unit();
            if(unit == null) return;
            let loot = Units.closest(null, unit.x, unit.y, VAR.range.lootPickRad, ounit => MDL_cond._isLoot(ounit));
            if(loot == null) return;
            FRAG_item.destroyLoot_global(loot);
          },
        },

      ],


    },


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  search: {


    /**
     * Extra tags used for search.
     * <br> <ROW>: prefix, boolF.
     * <br> <ARGS>: ct, str.
     */
    tag: [

      "no:", (ct, str) => !ct.name.toLowerCase().includes(str) && !Strings.stripColors(ct.localizedName).toLowerCase().includes(str) && (Core.settings.getString("locale") !== "zh_CN" || !LIB_pinyin.fetchPinyin(Strings.stripColors(ct.localizedName)).toLowerCase().includes(str)),

      "mod:", (ct, str) => str.equalsAny("none", "vanilla", "mindustry") ? ct.minfo.mod == null : (ct.minfo.mod !== null && ct.minfo.mod.name === str),

      "type:", (ct, str) => ct.getContentType().toString() === str,

      "hardness:", (ct, str) => ct instanceof Item && ct.hardness == str,

      "group:", (ct, str) => db["search"]["group"].read(str, Function.airFalse)(ct),

    ],


    /**
     * Used for "group: xxx" tags.
     * <br> <CONTENTGEN>
     * <br> <ROW>: str, boolF.
     * <br> <ARGS>: ct.
     */
    group: [

      "flammable", ct => ct.flammability != null && ct.flammability > 0.0,
      "explosive", ct => ct.explosiveness != null && ct.explosiveness > 0.0,
      "charged", ct => ct.charge != null && ct.charge > 0.0,
      "radioactive", ct => ct.radioactivity != null && ct.radioactivity > 0.0,
      "viscous", ct => ct.viscosity != null && ct.viscosity > VAR.param.clogViscThr,
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


  lsav: {


    /**
     * Properties that are saved in a LSAV.
     * <br> <ROW>: header, def, arrMode.
     */
    header: [

      "useless-field", "ohno", null,
      "save-map", "!UNDEF", null,
      "save-revision", -1, null,

      "dynamic-pollution", 0.0, null,
      "lingering-pollution", 0.0, null,
      "bits", [], "string",
      "bit-hash", [], "string",
      "flags", [], "string",

    ],


    /**
     * Properties here are safe (or required) to be set by client sides.
     * <br> <ROW>: header.
     */
    safe: [

      "bits",
      "bit-hash",

    ],


    /**
     * Properties that are saved in a PLSAV.
     * <br> <ROW>: header, def, arrMode.
     */
    pHeader: [

      "save-map", "!UNDEF", null,

      "global-bits", [], "string",
      "global-bit-hash", [], "string",

    ],


    /**
     * Safe properties in PLSAV.
     * <br> <ROW>: header.
     */
    pSafe: [

      "global-bits",
      "global-bit-hash",

    ],


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  texture: {


    /**
     * Icons populated in {@link VARGEN.icons}.
     * <br> <ROW>: nm, regStr.
     */
    icon: [

      "ohno", "error",

      "boost", "lovec-icon-boost",
      "check", "lovec-icon-check",
      "cross", "lovec-icon-cross",
      "dot", "lovec-icon-dot",
      "harvest", "lovec-icon-harvest",
      "play", "lovec-icon-play",
      "questionMark", "lovec-icon-question-mark",
      "swap", "lovec-icon-swap",
      "window", "lovec-icon-window",

    ],


    /**
     * Noise textures polulated in {@link VARGEN.noiseTexs}.
     * <br> <ROW>: nm, path.
     */
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


      /**
       * The colors used for characters in dialog flow.
       * <br> <ROW>: nmMod, nmChara, color.
       */
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
