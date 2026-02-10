/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * The root of all man-made blocks.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/cls/util/CLS_contentTemplate");
  const INTF = require("lovec/temp/intf/INTF_BLK_coreEnergyConsumer");
  const INTF_A = require("lovec/temp/intf/INTF_BLK_multiBlockHandler");
  const TRIGGER = require("lovec/glb/BOX_trigger");


  const FRAG_faci = require("lovec/frag/FRAG_faci");


  const MDL_call = require("lovec/mdl/MDL_call");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_pollution = require("lovec/mdl/MDL_pollution");
  const MDL_table = require("lovec/mdl/MDL_table");


  const DB_block = require("lovec/db/DB_block");


  /* <---------- auxiliary ----------> */


  function buildIo(tb, rsStacks, craftTime) {
    rsStacks.forEachFast(rsStack => {
      tb.row();
      tb.add(
        rsStack instanceof ItemStack ?
          StatValues.displayItem(rsStack.item, rsStack.amount, craftTime, true) :
          StatValues.displayLiquid(rsStack.liquid, rsStack.amount * 60.0 / craftTime, true)
      ).left().marginLeft(24.0);
    });
  };


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.ex_isSingleSized() && blk.size > 1) ERROR_HANDLER.throw("notSingleSized", blk.name);

    blk.noLoot = blk.noLoot || DB_block.db["group"]["noLoot"].includes(blk.name);
    blk.noReac = blk.noReac || blk instanceof CoreBlock || DB_block.db["group"]["noReac"].includes(blk.name);
    blk.canShortCircuit = blk.canShortCircuit || DB_block.db["group"]["shortCircuit"].includes(blk.name);

    if(blk.useConfigStr) {
      blk.config(JAVA.string, (b, str) => {
        b.ex_handleConfigStr(str);
      });
    };
  };


  function comp_setStats(blk) {
    if(blk.canShortCircuit) blk.stats.add(fetchStat("lovec", "blk-shortcircuit"), true);

    if(DB_block.db["map"]["facFami"].colIncludes(blk.name, 2, 0)) {
      blk.stats.add(fetchStat("lovec", "spec-facfami"), newStatValue(tb => {
        tb.row();
        MDL_table.setDisplay_facFami(tb, blk);
      }));
    };

    MDL_pollution.comp_setStats_pol(blk);

    // Vanilla stat for I/O looks messy in Lovec, to be honest
    if(blk instanceof GenericCrafter) {
      let
        consItms = blk.consumers.find(blkCons => blkCons instanceof ConsumeItems),
        consLiq = blk.consumers.find(blkCons => blkCons instanceof ConsumeLiquid),
        consLiqs = blk.consumers.find(blkCons => blkCons instanceof ConsumeLiquids);
      if(consItms != null || consLiq != null || consLiqs != null) {
        blk.stats.remove(Stat.input);
        if(consItms != null) {
          blk.stats.add(Stat.input, newStatValue(tb => {
            buildIo(tb, consItms.items, blk.craftTime);
          }));
        };
        if(consLiq != null) {
          blk.stats.add(Stat.input, newStatValue(tb => {
            buildIo(tb, [new LiquidStack(consLiq.liquid, consLiq.amount)], 1.0);
          }));
        };
        if(consLiqs != null) {
          blk.stats.add(Stat.input, newStatValue(tb => {
            buildIo(tb, consLiqs.liquids, 1.0);
          }));
        };
      };
      if(blk.outputItems != null || blk.outputLiquids != null) {
        blk.stats.remove(Stat.output);
        if(blk.outputItems != null) {
          blk.stats.add(Stat.output, newStatValue(tb => {
            buildIo(tb, blk.outputItems, blk.craftTime);
          }));
        };
        if(blk.outputLiquids != null) {
          blk.stats.add(Stat.output, newStatValue(tb => {
            buildIo(tb, blk.outputLiquids, 1.0);
          }));
        };
      };
    };
  };


  function comp_icons(blk) {
    return Core.atlas.has(blk.name + "-full") ?
      [Core.atlas.find(blk.name + "-full")] :
      Core.atlas.has(blk.name + "-icon") ?
        [Core.atlas.find(blk.name + "-icon")] :
        blk.super$icons();
  };


  function comp_onDestroyed(b) {
    if(b.block.delegee.noLoot) return;

    if(b.items != null) {
      let amt;
      b.items.each(itm => {
        amt = !(b.block instanceof CoreBlock) ?
          b.items.get(itm) :
          (b.items.get(itm) / Math.max(b.team.cores().size, 1));
        if(amt >= 20) MDL_call.spawnLoot_server(b.x, b.y, itm, amt.randFreq(0.3), b.block.size * Vars.tilesize * 0.7);
      });
    };
  };


  function comp_onProximityUpdate(b) {
    if(b.block.delegee.isMultiBlockComponent) {
      TRIGGER.multiBlockUpdate.fire();
    };
  };


  function comp_sense(b, sensor) {
    let getter = b.block.delegee.logicSensorGetterMap.get(sensor);
    return getter != null ?
      getter(b) :
      b.super$sense(sensor);
  };


  function comp_senseObject(b, sensor) {
    let getter = b.block.delegee.logicSensorGetterMap.get(sensor);
    return getter != null ?
      getter(b) :
      b.super$senseObject(sensor);
  };


  function comp_control(b, sensor, param1, param2, param3, param4) {
    let scr = b.block.delegee.logicSensorControlMap.get(sensor);
    if(scr != null) {
      scr(b, param1, param2, param3, param4);
    };
    b.super$control(sensor, param1, param2, param3, param4);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT, "BLK_baseBlock").implement(INTF[0]).implement(INTF_A[0]).initClass()
    .setParent(null)
    .setTags()
    .setParam({
      // @PARAM: See {RS_baseResource}.
      overwriteVanillaStat: true,
      // @PARAM: See {RS_baseResource}.
      overwriteVanillaProp: true,
      // @PARAM: If {true}, {blk.drawer} will always be used even if the original class does not support drawer. Can lead to bugs.
      forceUseDrawer: false,
      // @PARAM: If {true}, outline parameters won't be overwritten by DB data.
      skipOutlineSetup: false,
      // @PARAM: Whether config object string is used, which is for multiple parallel configs.
      useConfigStr: false,
      // @PARAM: Whether to skip loot spawning when destroyed. Can be set in {DB_block.db["group"]["noLoot"]}.
      noLoot: false,
      // @PARAM: Whether to ignore reactions. Can be set in {DB_block.db["group"]["noReac"]}.
      noReac: false,
      // @PARAM: Whether this block will short-circuit when soaked in aqueous liquid. Can be set in {DB_block.db["group"]["shortCircuit"]}.
      canShortCircuit: false,

      drawer: prov(() => new DrawDefault()),
      configKeyCallerArr: prov(() => []),
      logicSensorGetterMap: prov(() => new ObjectMap()),
      logicSensorControlMap: prov(() => new ObjectMap()),
      isMultiBlockComponent: false,
    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      icons: function() {
        return comp_icons(this);
      }
      .setProp({
        noSuper: true,
      }),


      /* ----------------------------------------
       * NOTE:
       *
       * If {true}, the game will throw an error when the block size is larger than 1.
       * ---------------------------------------- */
      ex_isSingleSized: function() {
        return false;
      }
      .setProp({
        noSuper: true,
      }),


      /* ----------------------------------------
       * NOTE:
       *
       * Adds a caller function for some config object field.
       * To use this, set {blk.useConfigStr} to {true}.
       * ---------------------------------------- */
      ex_addConfigCaller: function(key, valCaller) {
        this.configKeyCallerArr.write(key, valCaller);
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


      /* ----------------------------------------
       * NOTE:
       *
       * Adds a getter function for some logic sensor.
       * ---------------------------------------- */
      ex_addLogicGetter: function(sensor, valGetter) {
        this.logicSensorGetterMap.put(sensor, valGetter);
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


      /* ----------------------------------------
       * NOTE:
       *
       * Adds a function to implement logic control by some sensor.
       * ---------------------------------------- */
      ex_addLogicControl: function(sensor, scr) {
        this.logicSensorControlMap.put(sensor, scr);
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


    // Building
    newClass().extendClass(PARENT, "BLK_baseBlock").implement(INTF[1]).implement(INTF_A[1]).initClass()
    .setParent(null)
    .setParam({})
    .setMethod({


      onDestroyed: function() {
        comp_onDestroyed(this);
      },


      onProximityUpdate: function() {
        comp_onProximityUpdate(this);
      },


      sense: function(sensor) {
        return comp_sense(this, sensor);
      }
      .setProp({
        noSuper: true,
        final: true,
      }),


      senseObject: function(sensor) {
        return comp_senseObject(this, sensor);
      }
      .setProp({
        noSuper: true,
        final: true,
      }),


      control: function(sensor, param1, param2, param3, param4) {
        comp_control(this, sensor, param1, param2, param3, param4);
      }
      .setProp({
        noSuper: true,
        final: true,
      }),


      /* ----------------------------------------
       * NOTE:
       *
       * A more generic way to handle multiple configs.
       * To use this, set {blk.useConfigStr} to {true}.
       * ---------------------------------------- */
      ex_handleConfigStr: function(str) {
        if(str.startsWith("CONFIG: ")) {
          processConfig(this, str, this.block.delegee.configKeyCallerArr);
        } else {
          this.ex_handleConfigStrDef(str);
        };
      }
      .setProp({
        noSuper: true,
      }),


      /* ----------------------------------------
       * NOTE:
       *
       * @LATER
       * Fallback when the config string is not a Json string for some object.
       * ---------------------------------------- */
      ex_handleConfigStrDef: function(str) {

      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];


  module.exports[0].initBlock = function(blk) {
    if(!tryJsProp(blk, "skipOutlineSetup", false)) FRAG_faci.setupOutline(blk);
  };


  module.exports[1].initBuild = function(b) {

  };
