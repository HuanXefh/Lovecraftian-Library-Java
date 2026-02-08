/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * Serpulo liquid bridge.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseFluidDistributor");
  const INTF = require("lovec/temp/intf/INTF_BLK_pressureBlock");
  const TIMER = require("lovec/glb/GLB_timer");


  const MDL_pos = require("lovec/mdl/MDL_pos");


  /* <---------- component ----------> */


  function comp_updateTile(b) {
    if(TIMER.secThree) b.onProximityUpdate();
  };


  function comp_ex_updatePresFetchTgs(b) {
    b.presFetchTgs.clear();

    let ot = Vars.world.tile(b.link);
    if(b.block.linkValid(b.tile, ot)) {
      // Find pressure sources only if bridge is connected
      let rot_f = ot.build.relativeTo(b);
      for(let i = 0; i < 4; i++) {
        if(i === 2) continue;                // Does not accept pressure from the facing side
        let ob = b.nearby((rot_f + i) % 4);
        if(
          ob != null
            && ob.team === b.team
            && ob.ex_getPres != null
            && (!ob.block.rotate ? true : (ob.relativeTo(b) === ob.rotation))
        ) {
          b.presFetchTgs.push(ob);
        };
      };
    };
    // Treat other bridges as pressure sources
    b.incoming.each(posInt => {
      let ob = Vars.world.build(posInt);
      if(
        ob != null
          && ob.team === b.team
          && ob.ex_getPres != null
      ) {
        b.presFetchTgs.push(ob);
      };
    });
  };


  function comp_ex_updatePresSupplyTgs(b) {
    if(b.block.linkValid(b.tile, Vars.world.tile(b.link))) {
      // Don't supply pressure if connected to another bridge
      b.presSupplyTgs.clear();
      return;
    };

    let ot, ob;
    b.incoming.each(posInt => {
      ot = Vars.world.tile(posInt);
      if(ot == null) return;
      ob = b.nearby(MDL_pos._rotTs(b.tile, ot));
      if(ob == null) return;
      b.presSupplyTgs.pull(ob);
    });
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).implement(INTF[0]).initClass()
    .setParent(LiquidBridge)
    .setTags("blk-liq", "blk-brd")
    .setParam({})
    .setMethod({


      ex_isSingleSized: function() {
        return true;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1]).implement(INTF[1]).initClass()
    .setParent(LiquidBridge.LiquidBridgeBuild)
    .setParam({})
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      },


      ex_updatePresFetchTgs: function() {
        comp_ex_updatePresFetchTgs(this);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      ex_updatePresSupplyTgs: function() {
        comp_ex_updatePresSupplyTgs(this);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
