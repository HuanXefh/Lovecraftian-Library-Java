/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseBlock");
  const INTF = require("lovec/temp/intf/INTF_BLK_facilityBlock");


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


    /**
     * Parent for all factories.
     * This template also serves as the Lovec version of {@link GenericCrafter}.
     * @class BLK_baseFactory
     * @extends BLK_baseBlock
     * @extends INTF_BLK_facilityBlock
     */
    newClass().extendClass(PARENT[0], "BLK_baseFactory").implement(INTF[0]).initClass()
    .setParent(GenericCrafter)
    .setTags("blk-fac")
    .setParam({


      /**
       * <PARAM>: Sound played when this building crafts.
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
     */
    newClass().extendClass(PARENT[1], "B_baseFactory").implement(INTF[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({})
    .setMethod({


      craft: function() {
        comp_craft(this);
      },


    }),


  ];
