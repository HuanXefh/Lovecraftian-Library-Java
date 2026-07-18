/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseFluidDistributor");
  const INTF = require("lovec/temp/intf/INTF_BLK_pressureBlock");
  const INTF_A = require("lovec/temp/intf/INTF_BLK_transportBlockSideDisplay");


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

    MDL_event._c_onLoadDelay(VAR.delay.load.loadExtraSound, () => {
      if(!Vars.headless && PARAM.SECRET_METAL_PIPE && String(blk.matGrp).equalsAny(
        "iron", "steel", "galvanized-steel", "stainless-steel",
      )) {
        blk.placeSound = fetchSound("se-meme-steel-pipe");
      };
    });
  };


  function comp_onProximityUpdate(b) {
    let ot = b.tile.nearby(b.rotation);
    b.isLeak = b.block.leaks && (ot == null ? true : !ot.solid());
  };


  function comp_pickedUp(b) {
    b.isLeak = false;
  };


  function comp_updateTile(b) {
    if(b.block.delegee.isShortCircuitPipe && LCRand.chance(UTIL_rand.get("block"), 0.008)) {
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


    /**
     * Equivalent of vanilla liquid conduit but with more mechanics.
     * @class BLK_fluidPipe
     * @extends BLK_baseFluidDistributor
     * @extends INTF_BLK_pressureBlock
     * @extends INTF_BLK_transportBlockSideDisplay
     */
    newClass().extendClass(PARENT[0], "BLK_fluidPipe").implement(INTF[0]).implement(INTF_A[0]).initClass()
    .setParent(Conduit)
    .setTags()
    .setParam({


      /**
       * `PARAM`: Whether this pipe short-circuits if powered and containing conductive fluid. Used mostly for metallic pipes.
       * @memberof BLK_fluidPipe
       * @instance
       */
      isShortCircuitPipe: false,


    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      blends: function thisFun() {
        return BLKFragFluidPipe.setThis(this).blends.apply(BLKFragFluidPipe, arguments);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @override
       * @memberof BLK_fluidPipe
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


      /**
       * @override
       * @memberof BLK_fluidPipe
       * @instance
       * @param {Building} ob
       * @return {boolean}
       */
      ex_shouldBlendBackSide: function(ob) {
        return ob.block.outputsLiquid;
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1,
      }),


      /**
       * @override
       * @memberof BLK_fluidPipe
       * @instance
       * @param {Building} ob
       * @return {boolean}
       */
      ex_shouldBlendFlankSide: function(ob) {
        return ob.block.outputsLiquid;
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1,
      }),


      /**
       * @override
       * @memberof BLK_fluidPipe
       * @instance
       * @param {Building} ob
       * @return {boolean}
       */
      ex_shouldBlendFrontSide: function(ob) {
        return ob.liquids != null;
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1,
      }),


    }),


    /**
     * @class B_fluidPipe
     * @extends B_baseFluidDistributor
     * @extends INTF_B_pressureBlock
     * @extends INTF_B_transportBlockSideDisplay
     */
    newClass().extendClass(PARENT[1], "B_fluidPipe").implement(INTF[1]).implement(INTF_A[1]).initClass()
    .setParent(Conduit.ConduitBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * `INTERNAL`
       * @memberof B_fluidPipe
       * @instance
       */
      isLeak: false,


    })
    .setMethod({


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
