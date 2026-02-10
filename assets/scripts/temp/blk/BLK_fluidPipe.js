/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * Equivalent of vanilla liquid conduit, or not.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseFluidDistributor");
  const INTF = require("lovec/temp/intf/INTF_BLK_pressureBlock");
  const PARAM = require("lovec/glb/GLB_param");
  const TIMER = require("lovec/glb/GLB_timer");


  const FRAG_fluid = require("lovec/frag/FRAG_fluid");


  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_pollution = require("lovec/mdl/MDL_pollution");
  const MDL_reaction = require("lovec/mdl/MDL_reaction");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.isShortCircuitPipe) {
      blk.conductivePower = false;
      blk.connectedPower = false;
      blk.enableDrawStatus = false;

      setConsumer(blk, conss => [
        conss,
        fetchConsumer("ConsumePowerShortCircuitPipe", {
          amt: 0.5,
        }),
      ]);
    };
  };


  function comp_onDestroyed(b) {
    if(PARAM.secret_steelPipe && String(b.block.delegee.matGrp).equalsAny([
      "iron", "steel", "galvanized-steel", "stainless-steel",
    ])) {
      MDL_effect.playAt(b.x, b.y, "se-meme-steel-pipe");
    };
  };


  function comp_onProximityUpdate(b) {
    let ot = b.tile.nearby(b.rotation);
    b.isLeak = b.block.leaks && (ot == null ? true : !ot.solid());
  };


  function comp_pickedUp(b) {
    b.isLeak = false;
  };


  function comp_updateTile(b) {
    if(b.block.delegee.isShortCircuitPipe && Mathf.chance(0.008)) {
      b.block.consPower.trigger(b);
    };

    if(TIMER.sec && b.isLeak && b.liquids.currentAmount() > 0.001) {
      MDL_pollution.addDynaPol(MDL_pollution._rsPol(b.liquids.current()) / 60.0);
    };
  };


  function comp_moveLiquid(b, b_t, liq) {
    let amtTrans = 0.0;
    if(b_t == null) return amtTrans;
    b_t = b_t.getLiquidDestination(b, liq);
    if(b_t == null || b_t.liquids == null) return amtTrans;

    amtTrans = FRAG_fluid.transLiquid(
      b, b_t, liq,
      b.block.liquidCapacity * Math.max(b.liquids.get(liq) / b.block.liquidCapacity - b_t.liquids.get(liq) / b_t.block.liquidCapacity, 0.0),
    );

    let oliq = b_t.liquids.current();
    if(
      !Vars.net.client()
        && oliq !== liq
        && Mathf.chanceDelta(0.1)
        && !b_t.block.consumesLiquid(liq)
        && b.liquids.get(liq) / b.block.liquidCapacity > 0.1
        && b_t.liquids.get(oliq) / b_t.block.liquidCapacity > 0.1
    ) {
      MDL_reaction.handleReaction(liq, oliq, 10.0, b_t);
    };

    return amtTrans;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_fluidPipe").implement(INTF[0]).initClass()
    .setParent(Conduit)
    .setTags("blk-liq", "blk-fcond")
    .setParam({
      // @PARAM: Whether this pipe short-circuits if powered and containing conduitive fluid. {true} for most metallic pipes.
      isShortCircuitPipe: false,
    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      ex_isSingleSized: function() {
        return true;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1], "BLK_fluidPipe").implement(INTF[1]).initClass()
    .setParent(Conduit.ConduitBuild)
    .setParam({
      isLeak: false,
    })
    .setMethod({


      onDestroyed: function() {
        comp_onDestroyed(this);
      },


      onProximityUpdate: function() {
        comp_onProximityUpdate(this);
      },


      pickedUp: function() {
        comp_pickedUp(this);
      },


      updateTile: function() {
        comp_updateTile(this);
      },


      moveLiquid: function(b_t, liq) {
        comp_moveLiquid(this, b_t, liq);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
