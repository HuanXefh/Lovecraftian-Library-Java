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

    MDL_net.addPacketHandler(PacketModes.BOTH, "lovec-both-flammable-gas-emission", payload => {
      let args = unpackPayload(payload);
      let b = Vars.world.build(args[0]);
      if(b == null || b.ex_onFlamEmission == null) return;

      b.ex_onFlamEmission(args[1], args[2]);
    }, true);

    MDL_event.onLoadDelay(VAR.delay.load.loadExtraSound, () => {
      if(!Vars.headless && PARAM.SECRET_METAL_PIPE && String(blk.matGrp).equalsAny(
        "iron", "steel", "galvanized-steel", "stainless-steel",
      )) {
        blk.placeSound = fetchSound("se-meme-steel-pipe");
      };
    });
  };


  function comp_onProximityUpdate(b) {
    let ot = b.tile.nearby(b.rotation);
    b.isLeak = b.block.leaks && (ot == null || (ot.build == null && !ot.solid()));
  };


  function comp_pickedUp(b) {
    b.isLeak = false;
  };


  function comp_updateTile(b) {
    if(b.block.delegee.isShortCircuitPipe && LCRand.chance(UTIL_rand.get("block"), 0.008)) {
      b.block.consPower.trigger(b);
    };

    if(TIMER.sec && b.isLeak) {
      let amt = b.liquids.currentAmount();
      if(amt > 0.001) {
        let liq = b.liquids.current();
        MDL_pollution.addDynaPol(MDL_pollution.getRsPol(liq) / 60.0);
        if(!Vars.net.client() && liq.gas && liq.flammability > 0.0 && Mathf.chance(0.03 * liq.flammability)) {
          MDL_net.sendPacket(
            PacketModes.BOTH, "lovec-both-flammable-gas-emission",
            packPayload([
              b.pos(),
              liq.flammability * amt * 5.0,
              liq.explosiveness * amt * 5.0,
            ]),
            true,
          );
        };
      };
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


  function comp_onFlamEmission(b, flam, explo) {
    if(!b.isLeak || flam < 0.0001) return;

    fetchSound("se-shot-explosion").at(b);
    Damage.dynamicExplosion(b.x, b.y, flam, explo, 0.0, FRAG_attack.getPresExploRad(b.block.size) / Vars.tilesize, true);
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


      /**
       * @memberof B_fluidPipe
       * @instance
       * @param {number} flam
       * @param {number} explo
       * @return {void}
       */
      ex_onFlamEmission: function(flam, explo) {
        comp_onFlamEmission(this, flam, explo);
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


  ];
