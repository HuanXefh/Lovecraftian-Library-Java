/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * Cable but no side conductivity.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_cable");


  const MDL_cond = require("lovec/mdl/MDL_cond");


  /* <---------- component ----------> */


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
      return ((oblk.consPower != null || oblk.outputsPower) && blk.blendsArmored(t, rot, otx, oty, orot, oblk))
        || (blk.lookingAt(t, rot, otx, oty, oblk) && oblk.hasPower);
    },
  );


  function comp_blendsArmored(blk, t, rot, otx, oty, orot, oblk) {
    // WTF is going on here
    return Point2.equals(t.x + Geometry.d4[rot].x, t.y + Geometry.d4[rot].y, otx, oty) || ((!oblk.rotatedOutput(otx, oty, t) && Edges.getFacingEdge(oblk, otx, oty, t) != null && Edges.getFacingEdge(oblk, otx, oty, t).relativeTo(t) === rot) || (MDL_cond._isCable(oblk) && oblk.rotatedOutput(otx, oty, t) && Point2.equals(otx + Geometry.d4[orot].x, oty + Geometry.d4[orot].y, t.x, t.y)));
  };


  function comp_conductsTo(b, ob) {
    return !MDL_cond._isArmoredCable(ob.block) ?
      (b.front() === ob || b.back() === ob) :
      (b.front() === ob || ob.front() === b);
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
    .setTags("blk-pow", "blk-pow0trans", "blk-cable", "blk-arm0cable")
    .setParam({})
    .setMethod({


      blends: function() {
        return comp_blends.apply(null, Array.from(arguments).unshiftAll(this));
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      blendsArmored: function(t, rot, otx, oty, orot, oblk) {
        return comp_blendsArmored(this, t, rot, otx, oty, orot, oblk);
      }
      .setProp({
        noSuper: true,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1]).initClass()
    .setParent(ArmoredConveyor.ArmoredConveyorBuild)
    .setParam({})
    .setMethod({


      conductsTo: function(ob) {
        return comp_conductsTo(this, ob);
      }
      .setProp({
        boolMode: "and",
      }),


    }),


  ];
