/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_basePowerTransmitter");
  const INTF = require("lovec/temp/intf/INTF_BLK_graphBlock");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.conductivePower = true;
    blk.connectedPower = false;
    blk.pushUnits = false;
  };


  function comp_setStats(blk) {
    blk.stats.remove(Stat.itemsMoved);
  };


  function comp_setBars(blk) {
    blk.addBar("power", PowerNode.makePowerBalance());
    blk.addBar("batteries", PowerNode.makeBatteryBalance());
  };


  const comp_blends = newMultiFunction(
    function(blk, t, rot, dir) {
      let ob = t.nearbyBuild(Mathf.mod(rot - dir, 4));
      return ob != null && ob.team === t.team() && blk.blends(t, rot, ob.tileX(), ob.tileY(), ob.rotation, ob.block);
    },
    function(blk, t, rot, bPlan, dir, shouldCheckWorld) {
      if(bPlan != null) {
        let bPlanReq = bPlan[Mathf.mod(rot - dir, 4)];
        if(bPlanReq != null && blk.blends(t, rot, bPlanReq.x, bPlanReq.y, bPlanReq.rotation, bPlanReq.block)) return true;
      };
      return shouldCheckWorld && blk.blends(t, rot, dir);
    },
    function(blk, t, rot, otx, oty, orot, oblk) {
      return ((oblk.consPower != null || oblk.outputsPower) && !MDL_cond._isFluidConduit(oblk) && !MDL_cond._isArmoredCable(oblk))
        || (blk.lookingAt(t, rot, otx, oty, oblk) && oblk.hasPower && !MDL_cond._isFluidConduit(oblk));
    },
  );


  function comp_updateTile(b) {
    b.ex_updateGraph();
  };


  function comp_unitOn(b, unit) {
    if(b.power == null || b.power.status < 0.1 || !b.block.delegee.canShortCircuit || !LCRand.chanceDelta(UTIL_rand.get("block"), 0.03) || !MDL_cond._isWet(unit)) return;

    FRAG_attack._a_lightning(b.x, b.y, null, null, null, 6, 4, null, "ground");
    TRIGGER.wetStepOnCable.fire();
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * A block that conducts power.
     * Cables with equivalent safe power levels will be grouped in the same graph, thus updating only once per frame.
     * <br> <SINGLESIZE>
     * <br> <DEDICATION>: Inspired by Asthosus.
     * @class BLK_cable
     * @extends BLK_basePowerTransmitter
     * @extends INTF_BLK_graphBlock
     */
    newClass().extendClass(PARENT[0], "BLK_cable").implement(INTF[0]).initClass()
    .setParent(ArmoredConveyor)
    .setTags()
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @override
       * @memberof BLK_cable
       * @instance
       */
      graphType: "cable",
      /**
       * <INTERNAL>
       * @override
       * @memberof BLK_cable
       * @instance
       */
      isNoRotGraph: true,


      /* <------------------------------ vanilla ------------------------------ */


      enableDrawStatus: false,
      junctionReplacement: null,
      bridgeReplacement: null,


    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      setBars: function() {
        comp_setBars(this);
      },


      outputsItems: function() {
        return true;
      }
      .setProp({
        noSuper: true,
      }),


      blends: function() {
        return comp_blends.apply(null, Array.from(arguments).unshiftAll(this));
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @override
       * @memberof BLK_cable
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
     * @class B_cable
     * @extends B_basePowerTransmitter
     * @extends INTF_B_graphBlock
     */
    newClass().extendClass(PARENT[1], "B_cable").implement(INTF[1]).initClass()
    .setParent(ArmoredConveyor.ArmoredConveyorBuild)
    .setParam({})
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      }
      .setProp({
        noSuper: true,
        override: true,
        final: true,
      }),


      unitOn: function(unit) {
        comp_unitOn(this, unit);
      },


      acceptItem: function(b_f, itm) {
        return false;
      }
      .setProp({
        noSuper: true,
        override: true,
        final: true,
      }),


      acceptStack: function(itm, amt, e_f) {
        return 0;
      }
      .setProp({
        noSuper: true,
        override: true,
        final: true,
      }),


      /**
       * @override
       * @memberof B_cable
       * @instance
       * @return {number}
       */
      ex_getTransmitterOverloadFrac: function() {
        return Vars.state.isEditor() || this.graphCur.graphData == null ? 0.0 : this.graphCur.graphData.overloadFrac;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * @memberof B_cable
       * @instance
       * @param {Building} ob
       * @return {boolean}
       */
      ex_isSameGraphType: function(ob) {
        return ob.ex_getMaxPowProdAllowed != null && this.ex_getMaxPowProdAllowed().fEqual(ob.ex_getMaxPowProdAllowed());
      }
      .setProp({
        noSuper: true,
        boolMode: "and",
        argLen: 1,
      }),


      /**
       * @memberof B_cable
       * @instance
       * @return {boolean}
       */
      ex_isExpiredVert: function() {
        return this.graphCur.graphData != null && !this.ex_getMaxPowProdAllowed().fEqual(this.graphCur.graphData.maxPowProdAllowed);
      }
      .setProp({
        noSuper: true,
        boolMode: "and",
      }),


    }),


  ];
