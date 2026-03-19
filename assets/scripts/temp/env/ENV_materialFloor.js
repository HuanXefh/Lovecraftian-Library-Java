/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/env/ENV_baseFloor");


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


  /**
   * Parent of all floors with a specific material.
   * Random overlay is supported.
   * Unlike {@link ENV_liquidMaterialFloor} there's no name generation, it's intended to avoid bugs.
   * @class ENV_materialFloor
   * @extends ENV_baseFloor
   */
  module.exports = newClass().extendClass(PARENT, "ENV_materialFloor").initClass()
  .setParent(Floor)
  .setTags("blk-env", "blk-mat0flr")
  .setParam({


    /**
     * <PARAM>: Material of the floor.
     * @memberof ENV_materialFloor
     * @instance
     */
    matGrp: "none",
    /**
     * <PARAM>: A list of random overlay tags, will be replaced with texture regions on INIT. See {@link DB_env}.
     * @memberof ENV_materialFloor
     * @instance
     */
    randRegs: [],
    /**
     * <PARAM>: Larger value leads to fewer overlays drawn.
     * @memberof ENV_materialFloor
     * @instance
     */
    randRegDenom: 80,
    /**
     * <PARAM>: Random overlay offsets as a 2-tuple.
     * @memberof ENV_materialFloor
     * @instance
     */
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
