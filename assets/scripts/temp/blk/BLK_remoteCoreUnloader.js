/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * A special directional unloader that always unloads items from the nearest core.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_directionalUnloader");
  const TRIGGER = require("lovec/glb/BOX_trigger");


  /* <---------- component ----------> */


  function comp_onProximityUpdate(b) {
    let ob = b.nearby(Mathf.mod(b.rotation + 2, 4));
    if(ob != null && ob.team === b.team && ob.block instanceof CoreBlock) {
      TRIGGER.remoteCoreUnloaderNearCore.fire();
    };
  };



/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).initClass()
    .setParent(DirectionalUnloader)
    .setTags("blk-dis", "blk-gate")
    .setParam({})
    .setMethod({}),


    // Building
    newClass().extendClass(PARENT[1]).initClass()
    .setParent(DirectionalUnloader.DirectionalUnloaderBuild)
    .setParam({})
    .setMethod({


      onProximityUpdate: function() {
        comp_onProximityUpdate(this);
      },


      back: function() {
        return this.closestCore();
      }
      .setProp({
        noSuper: true,
      }),


      shouldConsume: function() {
        return this.enabled && this.unloadItem != null;
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
