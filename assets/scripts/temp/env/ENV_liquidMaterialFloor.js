/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/env/ENV_baseFloor");


  /* <---------- component ----------> */


  function comp_init(blk) {
    let liq = blk.liquidDrop;

    if(blk.overwriteVanillaProp) {
      if(!Vars.headless && (blk.walkSound === Sounds.none || blk.walkSound === Sounds.unset)) {
        blk.walkSound = DB_env.db["grpParam"]["floor"]["splashMaterial"].includes(blk.delegee.matGrp) ?
          Sounds.stepWater :
          fetchSound("se-step-" + blk.matGrp);
        blk.walkSoundVolume = 0.2;
        blk.walkSoundPitchMin = 0.95;
        blk.walkSoundPitchMax = 1.05;
      };

      blk.isLiquid = true;
      if(blk.speedMultiplier.fEqual(1.0)) {
        blk.speedMultiplier = blk.shallow ? 0.85 : 0.5;
        if(liq != null) blk.speedMultiplier *= MATH_interp.applyInterp(
          1.0, 0.2, liq.viscosity,
          Interp.linear, 0.5, 1.0,
        );
      };
      if(blk.drownTime.fEqual(0.0)) blk.drownTime = blk.shallow ? 0.0 : VAR.time.drownDef;
      if(blk.status !== StatusEffects.none) blk.statusDuration = VAR.time.liqStaDef * (blk.shallow ? 1.0 : 2.0);
      blk.supportsOverlay = true;

      if(blk.cacheLayer === CacheLayer.normal) {
        blk.cacheLayer = DB_env.db["grpParam"]["floor"]["cacheLayer"].read(blk.delegee.matGrp, CacheLayer.water);
      };
      if(blk.albedo.fEqual(0.0)) blk.albedo = 0.9;
      if(blk.walkEffect === Fx.none) blk.walkEffect = Fx.ripple;

      if(liq != null && blk.liquidMultiplier.fEqual(1.0)) blk.liquidMultiplier = blk.shallow ? 1.0 : 1.5;
    };

    DB_env.db["grpParam"]["floor"]["extraSetter"].read(blk.delegee.matGrp, Function.air)(blk, blk.overwriteVanillaProp);

    if(liq != null) MDL_content.rename(
      blk,
      liq.localizedName + (!blk.shallow ? "" : (MDL_text._space() + "(" + MDL_bundle._term("lovec", "shallow") + ")")),
    );
  };


  function comp_updateRender(blk, t) {
    return blk.updateEff !== Fx.none && Mathf.randomSeed(t.pos(), 0.0, 1.0) > blk.updateEffThr;
  };


  function comp_renderUpdate(blk, renderState) {
    if(Mathf.chance(blk.updateEffP)) blk.updateEff.at(
      renderState.tile.worldx() + Mathf.range(3.0),
      renderState.tile.worldy() + Mathf.range(3.0),
    );
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Similar to {@link ENV_materialFloor} but for liquid floors.
   * `blk.shallow` is used.
   * Name will be generated from `blk.liquidDrop` if not set in bundle.
   * <br> <NAMEGEN>
   * @class ENV_liquidMaterialFloor
   * @extends ENV_baseFloor
   */
  module.exports = newClass().extendClass(PARENT, "ENV_liquidMaterialFloor").initClass()
  .setParent(Floor)
  .setTags("blk-env", "blk-mat0flr")
  .setParam({


    /**
     * <PARAM>: See {@link ENV_materialFloor}.
     * @memberof ENV_liquidMaterialFloor
     * @instance
     */
    matGrp: "none",
    /**
     * <PARAM>: Effect shown when updating the floor.
     * @memberof ENV_liquidMaterialFloor
     * @instance
     */
    updateEff: Fx.none,
    /**
     * <PARAM>: Chance for update effect.
     * @memberof ENV_liquidMaterialFloor
     * @instance
     */
    updateEffP: 0.02,
    /**
     * <PARAM>: Affects intensity of update effect, larger value leads to fewer tiles being able to create the effect.
     * @memberof ENV_liquidMaterialFloor
     * @instance
     */
    updateEffThr: 0.4,


    /* <------------------------------ vanilla ------------------------------ */


    shallow: false,


  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    updateRender: function(t) {
      return comp_updateRender(this, t);
    }
    .setProp({
      noSuper: true,
    }),


    renderUpdate: function(renderState) {
      comp_renderUpdate(this, renderState);
    }
    .setProp({
      noSuper: true,
    }),


  });
