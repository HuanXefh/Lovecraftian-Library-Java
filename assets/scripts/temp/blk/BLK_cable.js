/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * A block that conducts power.
   * ----------------------------------------
   * DEDICATION:
   *
   * Inspried by Asthosus.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_basePowerTransmitter");
  const TRIGGER = require("lovec/glb/BOX_trigger");


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  const MDL_cond = require("lovec/mdl/MDL_cond");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      blk.conductivePower = true;
      blk.connectedPower = false;
      blk.enableDrawStatus = false;
      blk.pushUnits = false;
      blk.junctionReplacement = null;
      blk.bridgeReplacement = null;
    };
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
      return ob != null && ob.team == t.team() && blk.blends(t, rot, ob.tileX(), ob.tileY(), ob.rotation, ob.block);
    },
    function(blk, t, rot, bPlan, dir, shouldCheckWorld) {
      if(bPlan != null) {
        let bPlanReq = bPlan[Mathf.mod(rot - dir, 4)];
        if(bPlanReq != null && blk.blends(t, rot, bPlanReq.x, bPlanReq.y, bPlanReq.rotation, bPlanReq.block)) return true;
      };
      return shouldCheckWorld && blk.blends(t, rot, dir);
    },
    function(blk, t, rot, otx, oty, orot, oblk) {
      return ((oblk.consPower != null || oblk.outputsPower) && !MDL_cond._isArmoredCable(oblk))
        || (blk.lookingAt(t, rot, otx, oty, oblk) && oblk.hasPower);
    },
  );


  function comp_unitOn(b, unit) {
    if(b.power == null || b.power.status < 0.1 || !Mathf.chance(0.03) || !b.block.delegee.canShortCircuit || !MDL_cond._isWet(unit)) return;

    FRAG_attack._a_lightning(b.x, b.y, null, null, null, 6, 4, null, "ground");
    TRIGGER.wetStepOnCable.fire();
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).initClass()
    .setParent(ArmoredConveyor)
    .setTags("blk-pow", "blk-pow0trans", "blk-cable")
    .setParam({})
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


      ex_isSingleSized: function() {
        return true;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1]).initClass()
    .setParent(ArmoredConveyor.ArmoredConveyorBuild)
    .setParam({})
    .setMethod({


      unitOn: function(unit) {
        comp_unitOn(this, unit);
      },


      acceptItem: function(b_f, itm) {
        return false;
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
