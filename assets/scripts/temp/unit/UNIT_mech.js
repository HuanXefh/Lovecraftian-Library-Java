/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/unit/UNIT_baseGroundUnit");


  /* <---------- component ----------> */


  function comp_update(utp, unit) {
    if(!PARAM.IS_SPACE_MAP && TIMER.jetTrail && utp.jetTrailVelThr > 0.0 && unit.elevation > 0.73 && unit.vel.len() > utp.jetTrailVelThr) {
      MDL_effect._e_jetTrail(unit.x, unit.y, unit);
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Mech unit.
   * @class UNIT_mech
   * @extends UNIT_baseGroundUnit
   */
  module.exports = newClass().extendClass(PARENT, "UNIT_mech").initClass()
  .setParent(UnitType)
  .setTags("dmg0type-inf")
  .setParam({


    /**
     * <PARAM>: Velocity threshold for jet trail.
     * @memberof UNIT_mech
     * @instance
     */
    jetTrailVelThr: 0.0,


    /* <------------------------------ internal ------------------------------ */


    /**
     * <INTERNAL>
     * @override
     * @memberof UNIT_mech
     * @instance
     */
    entityName: "lovec-mech",


  })
  .setMethod({


    update: function(unit) {
      comp_update(this, unit);
    },


  });
