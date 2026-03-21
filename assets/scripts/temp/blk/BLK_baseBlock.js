/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = CLS_contentTemplate;
  const INTF = require("lovec/temp/intf/INTF_BLK_coreEnergyConsumer");
  const INTF_A = require("lovec/temp/intf/INTF_BLK_multiBlockHandler");


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
        MDL_table._d_facFami(tb, blk);
      }));
    };

    MDL_pollution.comp_setStats_pol(blk);

    // Vanilla stat for I/O looks ass in Lovec, to be honest
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


    /**
     * The root of all man-made blocks.
     * @class BLK_baseBlock
     * @extends CLS_contentTemplate
     * @extends INTF_BLK_coreEnergyConsumer
     * @extends INTF_BLK_multiBlockHandler
     */
    newClass().extendClass(PARENT, "BLK_baseBlock").implement(INTF[0]).implement(INTF_A[0]).initClass()
    .setParent(null)
    .setTags()
    .setParam({


      /**
       * <PARAM>: See {@link RS_baseResource}.
       * @memberof BLK_baseBlock
       * @instance
       */
      overwriteVanillaStat: true,
      /**
       * <PARAM>: See {@link RS_baseResource}.
       * @memberof BLK_baseBlock
       * @instance
       */
      overwriteVanillaProp: true,
      /**
       * <PARAM>: If true, `blk.drawer` will always be used even if the Java class does not support drawer. Can lead to bugs.
       * @memberof BLK_baseBlock
       * @instance
       */
      forceUseDrawer: false,
      /**
       * <PARAM>: If true, outline parameters won't be overwritten by DB data. See {@link DB_unit}.
       * @memberof BLK_baseBlock
       * @instance
       */
      skipOutlineSetup: false,
      /**
       * <PARAM>: Whether config object string is used for this block. Config object string is a JSON string for dealing with multiple parallel configs.
       * @memberof BLK_baseBlock
       * @instance
       */
      useConfigStr: false,
      /**
       * <PARAM>: Whether to skip loot spawning when building of this block is destroyed. Recommended to be set in {@link DB_block}.
       * @memberof BLK_baseBlock
       * @instance
       */
      noLoot: false,
      /**
       * <PARAM>: Whether reactions are ignored in this block. Recommended to be set in {@link DB_block}.
       * @memberof BLK_baseBlock
       * @instance
       */
      noReac: false,
      /**
       * <PARAM>: Whether this block will short-circuit when soaked in puddles of aqueous liquid. Recommended to be set in {@link DB_block}.
       * @memberof BLK_baseBlock
       * @instance
       */
      canShortCircuit: false,


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof BLK_baseBlock
       * @instance
       */
      drawer: prov(() => new DrawDefault()),
      /**
       * <INTERNAL>
       * @memberof BLK_baseBlock
       * @instance
       */
      configKeyCallerArr: prov(() => []),
      /**
       * <INTERNAL>
       * @memberof BLK_baseBlock
       * @instance
       */
      logicSensorGetterMap: prov(() => new ObjectMap()),
      /**
       * <INTERNAL>
       * @memberof BLK_baseBlock
       * @instance
       */
      logicSensorControlMap: prov(() => new ObjectMap()),
      /**
       * <INTERNAL>: If true, this block triggers multi-block update.
       * @memberof BLK_baseBlock
       * @instance
       */
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


      /**
       * If true, the game will throw an error when block size is larger than 1 on INIT.
       * @memberof BLK_baseBlock
       * @instance
       * @return {boolean}
       */
      ex_isSingleSized: function() {
        return false;
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * Adds a caller function for some config object key.
       * Requires {@link BLK_baseBlock#useConfigStr} to be true.
       * @memberof BLK_baseBlock
       * @instance
       * @param {string} key
       * @param {function(Building, any): void} valCaller - <ARGS>: b, val.
       * @return {void}
       */
      ex_addConfigCaller: function(key, valCaller) {
        this.configKeyCallerArr.write(key, valCaller);
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


      /**
       * Adds a getter function for some logic sensor.
       * @memberof BLK_baseBlock
       * @instance
       * @param {LAccess} sensor
       * @param {function(Building): any} valGetter - <ARGS>: b.
       * @return {void}
       */
      ex_addLogicGetter: function(sensor, valGetter) {
        this.logicSensorGetterMap.put(sensor, valGetter);
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


      /**
       * Adds a function to implement logic control by some sensor.
       * @memberof BLK_baseBlock
       * @instance
       * @param {LAccess} sensor
       * @param {function(Building): void} scr - <ARGS>: b.
       * @return {void}
       */
      ex_addLogicControl: function(sensor, scr) {
        this.logicSensorControlMap.put(sensor, scr);
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


    /**
     * @class B_baseBlock
     * @extends CLS_contentTemplate
     * @extends INTF_B_coreEnergyConsumer
     * @extends INTF_B_multiBlockHandler
     */
    newClass().extendClass(PARENT, "B_baseBlock").implement(INTF[1]).implement(INTF_A[1]).initClass()
    .setParent(null)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof B_baseBlock
       * @instance
       */
      LCRevi: 5,
      /**
       * <INTERNAL>
       * @memberof B_baseBlock
       * @instance
       */
      LCReviSub: 0,


    })
    .setMethod({


      onDestroyed: function() {
        comp_onDestroyed(this);
      },


      onProximityUpdate: function() {
        comp_onProximityUpdate(this);
      },


      version: function() {
        return this.super$version() + VAR.lovecReviOff + LOVEC_REVISION;
      },


      writeAll: function(wr) {
        this.writeBase(wr);
        wr.s(this.ex_subRevi());
        this.write(wr);
      }
      .setProp({
        noSuper: true,
      }),


      readAll: function(rd, revi) {
        this.readBase(rd);
        this.LCRevi = revi < VAR.lovecReviOff ? 5 : (revi - VAR.lovecReviOff - this.super$version());
        if(this.LCRevi >= 6) {
          this.LCReviSub = rd.s();
        };
        this.read(rd, this.super$version());
      }
      .setProp({
        noSuper: true,
      }),


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


      /**
       * A more generic way to handle multiple configs using config object string.
       * Requires {@link BLK_baseBlock#useConfigStr} to be true.
       * @memberof B_baseBlock
       * @instance
       * @param {string} str
       * @return {void}
       */
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


      /**
       * Fallback when the given string is not a config object string in {@link B_baseBlock#ex_handleConfigStr}.
       * <br> <LATER>
       * @memberof B_baseBlock
       * @instance
       * @return {void}
       */
      ex_handleConfigStrDef: function(str) {

      }
      .setProp({
        noSuper: true,
      }),


      /**
       * Revision used for this content template.
       * <br> <LATER>
       * @memberof B_baseBlock
       * @instance
       * @return {number}
       */
      ex_subRevi: function() {
        return 0;
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];


  /**
   * @memberof BLK_baseBlock
   * @param {Block} blk
   * @return {void}
   */
  module.exports[0].initBlock = function(blk) {
    if(!tryJsProp(blk, "skipOutlineSetup", false)) FRAG_faci.setupOutline(blk);
  };


  /**
   * @memberof B_baseBlock
   * @param {Building} b
   * @return {void}
   */
  module.exports[1].initBuild = function(b) {

  };
