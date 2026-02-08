/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Parent for all factories.
   * This template also serves as the Lovec version of generic crafter.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseBlock");
  const INTF = require("lovec/temp/intf/INTF_BLK_facilityBlock");
  const VAR = require("lovec/glb/GLB_var");


  const MDL_effect = require("lovec/mdl/MDL_effect");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.priority = VAR.prio_fac;
    if(blk.overwriteVanillaProp) {
      if(blk.liquidOutputDirections != null) {
        blk.drawArrow = blk.liquidOutputDirections.length === 1 && blk.liquidOutputDirections[0] === -1;
      };
    };
  };


  function comp_load(blk) {
    blk.craftSe = fetchSound(blk.craftSe);
  };


  function comp_craft(b) {
    MDL_effect.playAt(b.x, b.y, b.craftSe, Math.min(b.block.ambientSoundVolume * 2.0, 1.0), 1.0, 0.1);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).implement(INTF[0]).initClass()
    .setParent(GenericCrafter)
    .setTags("blk-fac")
    .setParam({
      // @PARAM: Sound played when this building crafts.
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


    // Building
    newClass().extendClass(PARENT[1]).implement(INTF[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({})
    .setMethod({


      craft: function() {
        comp_craft(this);
      },


    }),


  ];
