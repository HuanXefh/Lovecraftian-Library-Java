/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseFluidDistributor");
  const INTF = require("lovec/temp/intf/INTF_BLK_pressureBlock");


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
        // Do not accept pressure from the facing side
        if(i === 2) continue;
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


    /**
     * Serpulo liquid bridge.
     * <br> <SINGLESIZE>
     * @class BLK_fluidPipeBridge
     * @extends BLK_baseFluidDistributor
     * @extends INTF_BLK_pressureBlock
     */
    newClass().extendClass(PARENT[0], "BLK_fluidPipeBridge").implement(INTF[0]).initClass()
    .setParent(LiquidBridge)
    .setTags("blk-liq", "blk-brd")
    .setParam({})
    .setMethod({


      /**
       * @override
       * @memberof BLK_fluidPipeBridge
       * @instance
       * @return {boolean}
       */
      ex_isSingleSized: function() {
        return true;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    /**
     * @class B_fluidPipeBridge
     * @extends B_baseFluidDistributor
     * @extends INTF_B_pressureBlock
     */
    newClass().extendClass(PARENT[1], "B_fluidPipeBridge").implement(INTF[1]).initClass()
    .setParent(LiquidBridge.LiquidBridgeBuild)
    .setParam({})
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      },


      /**
       * @override
       * @memberof B_fluidPipeBridge
       * @instance
       * @return {void}
       */
      ex_updatePresFetchTgs: function() {
        comp_ex_updatePresFetchTgs(this);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * @memberof B_fluidPipeBridge
       * @instance
       * @return {void}
       */
      ex_updatePresSupplyTgs: function() {
        comp_ex_updatePresSupplyTgs(this);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
