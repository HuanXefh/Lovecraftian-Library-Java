/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Air units that flies only when moving.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/unit/entity/ENTITY_baseAirUnit");


  /* <---------- component ----------> */


  function comp_updateUnit(unit) {
    unit.updateBoosting(true);
  };


  function comp_updateBoosting(unit, shouldBoost) {
    if(!unit.type.canBoost || unit.dead) return;

    unit.elevation = Mathf.approachDelta(
      unit.elevation,
      Math.max(
        Mathf.num(unit.onSolid() || (unit.isFlying() && !unit.canLand())),
        unit.speed() / unit.type.speed,
        unit.type.riseSpeed,
      ),
    );
  };


  function comp_canShoot(unit) {
    // Jet units can attack only when moving
    return !unit.disarmed && unit.type.canBoost && unit.isFlying();
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(UnitEntity)
  .setParam({})
  .setMethod({


    updateUnit: function() {
      comp_updateUnit(this);
    },


    updateBoosting: function(shouldBoost) {
      comp_updateBoosting(this, shouldBoost);
    }
    .setProp({
      noSuper: true,
    }),


    canShoot: function() {
      return comp_canShoot(this);
    }
    .setProp({
      noSuper: true,
    }),


  });
