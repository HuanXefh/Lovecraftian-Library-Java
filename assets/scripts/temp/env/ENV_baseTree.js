/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Base template for most vegetation.
   * No variants!
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/env/ENV_baseProp");
  const PARAM = require("lovec/glb/GLB_param");
  const VAR = require("lovec/glb/GLB_var");


  const MATH_geometry = require("lovec/math/MATH_geometry");


  const FRAG_faci = require("lovec/frag/FRAG_faci");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  const DB_env = require("lovec/db/DB_env");


  /* <---------- auxiliay ----------> */


  const treeParams = DB_env.db["grpParam"]["tree"];


  /* <---------- component ----------> */


  function comp_init(blk) {
    let treeGrp = blk.treeGrp;
    blk.drawTup = [
      Mathf.clamp(blk.layTree, 76.0, 80.0),
      readParam(treeParams.read(treeGrp), "scl", 1.0),
      readParam(treeParams.read(treeGrp), "mag", 1.0),
      readParam(treeParams.read(treeGrp), "wob", 1.0),
    ];

    MDL_event._c_onLoad(() => {
      if(!Vars.headless && !blk.shadow.found()) LOG_HANDLER.log("noCustomShadowRegionFound", blk.name);
    });
  };


  function comp_setStats(blk) {
    let treeGrp = blk.treeGrp;
    if(treeGrp !== "none") blk.stats.add(fetchStat("lovec", "blk0env-treetype"), MDL_bundle._term("lovec", treeGrp));

    let rsLvl = FRAG_faci._treeRsLvl(blk);
    if(rsLvl > 0.0) blk.stats.add(fetchStat("lovec", "blk0env-rslvl"), rsLvl.perc());
  };


  function comp_drawBase(blk, t) {
    LCDraw.tree(blk.region, blk.shadow, t, blk.shadowOffset, blk.drawTup[1], blk.drawTup[2], blk.drawTup[3], PARAM.treeAlpha, blk.drawTup[0], PARAM.drawWobble, PARAM.checkTreeDst);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT, "ENV_baseTree").initClass()
  .setParent(null)
  .setTags("blk-env")
  .setParam({
    // @PARAM: Z-value of the tree.
    layTree: 76.0,
    // @PARAM: Whether this tree can hide units.
    hidable: false,

    treeGrp: "none",
    drawTup: null,
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    setStats: function() {
      comp_setStats(this);
    },


    drawBase: function(t) {
      comp_drawBase(this, t);
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
