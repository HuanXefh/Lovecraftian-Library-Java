/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/env/ENV_liquidMaterialFloor");


  /* <---------- auxiliary ----------> */


  const LAYER_PARTICLE = VAR.layer.effSmog - 0.5;


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.parent = MDL_content._ct(blk.parent, "blk");
    if(blk.parent == null) ERROR_HANDLER.throw("nullArgument", "parent");
    if(!(blk.parent instanceof Floor)) throw new Error("${1} is not a floor!".format(blk.name));

    blk.blendGroup = blk.parent;
    MDL_event._c_onLoad(() => {
      let color_f = blk.parent.mapColor.cpy().mul(1.5);
      let color_t = blk.parent.mapColor.cpy().mul(2.2);
      color_t.a = 0.0;
      blk.updateEff = new MultiEffect(
        extend(ParticleEffect, {
          lifetime: 150.0,
          startDelay: 16.0,
          layer: LAYER_PARTICLE + 0.0001,
          particles: 10,
          useRotation: false,
          colorFrom: color_f,
          colorTo: color_t,
          lightOpacity: 0.0,
          baseRotation: 90.0,
          cone: 26.0,
          length: 40.0,
          baseLength: 9.0,
          sizeInterp: Interp.pow3In,
          sizeFrom: 1.8,
          sizeTo: 0.2,
        }),
        extend(ParticleEffect, {
          lifetime: 150.0,
          startDelay: 14.0,
          layer: LAYER_PARTICLE + 0.0002,
          particles: 10,
          useRotation: false,
          colorFrom: color_f,
          colorTo: color_t,
          lightOpacity: 0.0,
          baseRotation: 90.0,
          cone: 25.0,
          length: 36.0,
          baseLength: 8.0,
          sizeInterp: Interp.pow3In,
          sizeFrom: 1.8,
          sizeTo: 0.2,
        }),
        extend(ParticleEffect, {
          lifetime: 150.0,
          startDelay: 12.0,
          layer: LAYER_PARTICLE + 0.0003,
          particles: 9,
          useRotation: false,
          colorFrom: color_f,
          colorTo: color_t,
          lightOpacity: 0.0,
          baseRotation: 90.0,
          cone: 24.0,
          length: 32.0,
          baseLength: 7.0,
          sizeInterp: Interp.pow3In,
          sizeFrom: 1.8,
          sizeTo: 0.2,
        }),
        extend(ParticleEffect, {
          lifetime: 150.0,
          startDelay: 10.0,
          layer: LAYER_PARTICLE + 0.0004,
          particles: 8,
          useRotation: false,
          colorFrom: color_f.cpy().mul(1.1),
          colorTo: color_t.cpy().mul(1.1),
          lightOpacity: 0.0,
          baseRotation: 90.0,
          cone: 23.0,
          length: 26.0,
          baseLength: 6.0,
          sizeInterp: Interp.pow3In,
          sizeFrom: 1.8,
          sizeTo: 0.2,
        }),
        extend(ParticleEffect, {
          lifetime: 150.0,
          startDelay: 8.0,
          layer: LAYER_PARTICLE + 0.0005,
          particles: 8,
          useRotation: false,
          colorFrom: color_f.cpy().mul(1.2),
          colorTo: color_t.cpy().mul(1.2),
          lightOpacity: 0.0,
          baseRotation: 90.0,
          cone: 22.0,
          length: 22.0,
          baseLength: 5.0,
          sizeInterp: Interp.pow3In,
          sizeFrom: 1.8,
          sizeTo: 0.2,
        }),
        extend(ParticleEffect, {
          lifetime: 150.0,
          startDelay: 6.0,
          layer: LAYER_PARTICLE + 0.0006,
          particles: 7,
          useRotation: false,
          colorFrom: color_f.cpy().mul(1.3),
          colorTo: color_t.cpy().mul(1.3),
          lightOpacity: 0.0,
          baseRotation: 90.0,
          cone: 21.0,
          length: 18.0,
          baseLength: 4.0,
          sizeInterp: Interp.pow3In,
          sizeFrom: 1.8,
          sizeTo: 0.2,
        }),
        extend(ParticleEffect, {
          lifetime: 150.0,
          startDelay: 0.0,
          layer: LAYER_PARTICLE + 0.0007,
          particles: 6,
          useRotation: false,
          colorFrom: color_f.cpy().mul(1.4),
          colorTo: color_t.cpy().mul(1.4),
          lightOpacity: 0.0,
          baseRotation: 90.0,
          cone: 20.0,
          length: 14.0,
          baseLength: 3.0,
          sizeInterp: Interp.pow3In,
          sizeFrom: 1.8,
          sizeTo: 0.2,
        }),
      );
    });

    MDL_content.rename(
      blk,
      () => MDL_bundle._term("lovec", "geyser") + MDL_text._space() + "(" + blk.parent.localizedName + ")",
    );
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Geyser as a special liquid floor.
   * <br> <NAMEGEN>
   * <br> <DEDICATION>: Inspired by Asthosus.
   * @class ENV_geyser
   * @extends ENV_liquidMaterialFloor
   */
  module.exports = newClass().extendClass(PARENT, "ENV_geyser").initClass()
  .setParent(Floor)
  .setTags("blk-env", "blk-mat0flr")
  .setParam({


    /**
     * <PARAM>: Parent floor block.
     * @memberof ENV_geyser
     * @instance
     */
    parent: null,


    /* <------------------------------ internal ------------------------------ */


    /**
     * <INTERNAL>: Will be set later, do not use this.
     * @memberof ENV_geyser
     * @instance
     */
    updateEff: Fx.none,
    /**
     * <INTERNAL>
     * @memberof ENV_geyser
     * @instance
     */
    updateEffP: 0.0035,
    /**
     * <INTERNAL>
     * @memberof ENV_geyser
     * @instance
     */
    updateEffSpread: 0.0,
    /**
     * <INTERNAL>
     * @memberof ENV_geyser
     * @instance
     */
    updateEffThr: 0.0,


  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


  });
