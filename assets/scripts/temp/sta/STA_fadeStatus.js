/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/sta/STA_baseStatus");


  /* <---------- component ----------> */


  function comp_load(sta) {
    sta.fadeReg = fetchRegionOrNull(sta, "-fade");
  };


  function comp_draw(sta, unit) {
    let isAfter = false;
    if(!VARGEN.fadeStas.some(osta => {
      if(osta === sta) isAfter = true;
      return !isAfter && sta.fadeReg != null && unit.hasEffect(osta) && osta !== sta;
    })) {
      MDL_draw._reg_fade(unit.x, unit.y, sta.fadeReg, 0.0, MDL_entity._hitSize(unit) * 0.1, 0.5, sta.fadeColor, 0.5, Layer.effect + VAR.layer.offDrawOver);
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * A status effect with fading sprite.
   * @class STA_fadeStatus
   * @extends STA_baseStatus
   */
  module.exports = newClass().extendClass(PARENT, "STA_fadeStatus").initClass()
  .setParent(StatusEffect)
  .setTags("sta-fade")
  .setParam({


    /**
     * <PARAM>: Color used for the fading region.
     * @memberof STA_fadeStatus
     * @instance
     */
    fadeColor: Color.white,


    /* <------------------------------ internal ------------------------------ */


    /**
     * <INTERNAL>
     * @memberof STA_fadeStatus
     * @instance
     */
    fadeReg: null,


  })
  .setMethod({


    load: function() {
      comp_load(this);
    },


    draw: function(unit) {
      comp_draw(this, unit);
    },


  });
