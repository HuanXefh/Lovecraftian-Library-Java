/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseBlock");
  const INTF = require("lovec/temp/intf/INTF_BLK_facilityBlock");
  const INTF_A = require("lovec/temp/intf/INTF_BLK_terrainHandler");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.priority = VAR.priority.fac;
    if(blk.overwriteVanillaProp) {
      if(blk.liquidOutputDirections != null) {
        blk.drawArrow = blk.liquidOutputDirections.length === 1 && blk.liquidOutputDirections[0] === -1;
      };
    };
  };


  function comp_load(blk) {
    blk.craftSe = fetchSound(blk.craftSe);
  };


  function comp_created(b) {
    Time.run(0.0, () => {
      if(isNaN(b.warmup)) b.warmup = 0.0;
      if(isNaN(b.progress)) b.progress = 0.0;
    });
  };


  function comp_craft(b) {
    MDL_effect.playAt(b.x, b.y, b.craftSe, Math.min(b.block.ambientSoundVolume * 2.0, 1.0), 1.0, 0.1);
  };


  function comp_acceptItem(b, b_f, itm) {
    if(!b.block.rotate || b.block.delegee.inputDirs.length === 0) return true;

    return b.block.delegee.inputDirs.some(offRot => b.relativeTo(b_f) === Mathf.mod(b.rotation + offRot, 4));
  };


  function comp_acceptLiquid(b, b_f, liq) {
    if(!b.block.rotate || b.block.delegee.fldInputDirs.length === 0 || MDL_cond._isAuxiliaryFluid(liq)) return true;

    return b.block.delegee.fldInputDirs.some(offRot => b.relativeTo(b_f) === Mathf.mod(b.rotation + offRot, 4));
  };


  function comp_canDump(b, b_t, itm) {
    if(!b.block.rotate || b.block.delegee.outputDirs.length === 0) return true;

    return b.block.delegee.outputDirs.some(offRot => b.relativeTo(b_t) === Mathf.mod(b.rotation + offRot, 4));
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Parent for all factories.
     * This template also serves as the Lovec version of {@link GenericCrafter}.
     * @class BLK_baseFactory
     * @extends BLK_baseBlock
     * @extends INTF_BLK_facilityBlock
     * @extends INTF_BLK_terrainHandler
     */
    newClass().extendClass(PARENT[0], "BLK_baseFactory").implement(INTF[0]).implement(INTF_A[0]).initClass()
    .setParent(GenericCrafter)
    .setTags()
    .setParam({


      /**
       * `PARAM`: Relative directions of item input sides.
       * @memberof BLK_baseFactory
       * @instance
       */
      inputDirs: prov(() => []),
      /**
       * `PARAM`: Relative directions of fluid input sides (not abstract fluid).
       * @memberof BLK_baseFactory
       * @instance
       */
      fldInputDirs: prov(() => []),
      /**
       * `PARAM`: Relative directions of item output sides.
       * @memberof BLK_baseFactory
       * @instance
       */
      outputDirs: prov(() => []),
      /**
       * `PARAM`: Sound played when this building crafts.
       * @memberof BLK_baseFactory
       * @instance
       */
      craftSe: Sounds.unset,


    })
    .setParamAlias([
      "craftEff", "craftEffect", Fx.none,
      "updateEff", "updateEffect", Fx.none,
      "updateEffP", "updateEffectChance", 0.02,
    ])
    .setMethod({


      init: function() {
        comp_init(this);
      },


      load: function() {
        comp_load(this);
      },


    }),


    /**
     * @class B_baseFactory
     * @extends B_baseBlock
     * @extends INTF_B_facilityBlock
     * @extends INTF_B_terrainHandler
     */
    newClass().extendClass(PARENT[1], "B_baseFactory").implement(INTF[1]).implement(INTF_A[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({})
    .setMethod({


      created: function() {
        comp_created(this);
      },


      craft: function() {
        comp_craft(this);
      },


      acceptItem: function(b_f, itm) {
        return comp_acceptItem(this, b_f, itm);
      }
      .setProp({
        boolMode: "and",
      }),


      acceptLiquid: function(b_f, liq) {
        return comp_acceptLiquid(this, b_f, liq);
      }
      .setProp({
        boolMode: "and",
      }),


      canDump: function(b_t, itm) {
        return comp_canDump(this, b_t, itm);
      }
      .setProp({
        boolMode: "and",
      }),


    }),


  ];
