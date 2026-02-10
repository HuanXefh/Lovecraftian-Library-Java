/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * A status effect with fading sprite.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/sta/STA_baseStatus");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_entity = require("lovec/mdl/MDL_entity");


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
      MDL_draw._reg_fade(unit.x, unit.y, sta.fadeReg, 0.0, MDL_entity._hitSize(unit) * 0.1, 0.5, sta.fadeColor, 0.5, Layer.effect + VAR.lay_offDrawOver);
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT, "STA_fadeStatus").initClass()
  .setParent(StatusEffect)
  .setTags("sta-fade")
  .setParam({
    // @PARAM: Color used for {sta.fadeReg}.
    fadeColor: Color.white,

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
