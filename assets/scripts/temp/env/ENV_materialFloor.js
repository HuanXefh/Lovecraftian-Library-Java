/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Parent of all floors with a specific material.
   * Random overlay is supported.
   * Unlike {ENV_liquidMaterialFloor} there's no name generation, it's intended to avoid bugs.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/env/ENV_baseFloor");
  const VAR = require("lovec/glb/GLB_var");


  const MDL_draw = require("lovec/mdl/MDL_draw");


  const DB_env = require("lovec/db/DB_env");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.matGrp === "SPEC: use parent") {
      blk.matGrp = tryJsProp(blk.parent, "matGrp", "none");
    };

    if(blk.overwriteVanillaProp) {
      // TODO: Wait until Anuke decides to change this.
      if(!Vars.headless && blk.matGrp !== "none" && (blk.walkSound === Sounds.none || blk.walkSound === Sounds.unset)) {
        blk.walkSound = fetchSound("se-step-" + blk.matGrp);
        blk.walkSoundVolume = 0.2;
        blk.walkSoundPitchMin = 0.95;
        blk.walkSoundPitchMax = 1.05;
      };
      if(blk.status !== StatusEffects.none) {
        blk.statusDuration = VAR.time_flrStaDef;
      };

      if(blk.speedMultiplier.fEqual(1.0)) blk.speedMultiplier = DB_env.db["grpParam"]["floor"]["speed"].read(blk.matGrp, 1.0);
    };

    DB_env.db["grpParam"]["floor"]["extraSetter"].read(blk.matGrp, Function.air)(blk, blk.overwriteVanillaProp);

    let randRegs = [];
    blk.randRegs.forEachFast(tag => {
      randRegs.pushNonNull((
        Vars.headless ?
          Function.air :
          DB_env.db["map"]["randRegTag"].read(tag, Function.air)
      )());
    });
    blk.randRegs = randRegs.flatten();
  };


  function comp_drawBase(blk, t) {
    if(t.overlay() !== Blocks.air) return;

    MDL_draw._reg_randOv(t, blk.randRegs, blk.randRegDenom, blk.randRegOffs[0], blk.randRegOffs[1]);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT, "ENV_materialFloor").initClass()
  .setParent(Floor)
  .setTags("blk-env", "blk-mat0flr")
  .setParam({
    // @PARAM: Material of the floor.
    matGrp: "none",
    // @PARAM: A list of random overlay tags, see {DB_env.db["map"]["randRegTag"]}. Will be replaced with regions on INIT.
    randRegs: [],
    // @PARAM: Larger denominator leads to less overlay drawn.
    randRegDenom: 80,
    // @PARAM: A 2-tuple of offset parameters used for random overlay.
    randRegOffs: [0, 0],
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    drawBase: function(t) {
      comp_drawBase(this, t);
    },


  });
