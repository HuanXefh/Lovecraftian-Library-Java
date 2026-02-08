/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Parent template of all turrets.
   *
   * Since "-full" sprite of turrets are used when parts exist, you should use "-icon" for full icon instead.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseBlock");


  const MDL_event = require("lovec/mdl/MDL_event");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.priority = TargetPriority.turret;

    if(!Vars.headless && !blk.skipOutlineSetup) {
      MDL_event._c_onLoad(() => {
        if(Core.atlas.has(blk.name + "-icon")) {
          blk.fullIcon = blk.uiIcon = Core.atlas.find(blk.name + "-icon");
        };
      });
    };
  };


  function comp_icons(blk) {
    return Core.atlas.has(blk.name + "-full") ?
      [blk.baseRegion, Core.atlas.find(blk.name + "-full")] :
      blk.super$icons();
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).initClass()
    .setParent(null)
    .setTags("blk-tur")
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


      icons: function() {
        return comp_icons(this);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1]).initClass()
    .setParent(null)
    .setParam({})
    .setMethod({}),


  ];
