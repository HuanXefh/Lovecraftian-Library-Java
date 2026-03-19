/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/env/ENV_baseProp");


  /* <---------- auxiliary ----------> */


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
    LCDraw.tree(blk.region, blk.shadow, t, blk.radTree, blk.shadowOffset, blk.drawTup[1], blk.drawTup[2], blk.drawTup[3], PARAM.treeAlpha, blk.drawTup[0], PARAM.drawWobble, PARAM.checkTreeDst);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Base template for most vegetation.
   * No variants!
   * @class ENV_baseTree
   * @extends ENV_baseProp
   */
  module.exports = newClass().extendClass(PARENT, "ENV_baseTree").initClass()
  .setParent(null)
  .setTags("blk-env", "blk-tree")
  .setParam({


    /**
     * <PARAM>: Z-value of the tree.
     * @memberof ENV_baseTree
     * @instance
     */
    layTree: 76.0,
    /**
     * <PARAM>: Radius for transparentization and more.
     * @memberof ENV_baseTree
     * @instance
     */
    radTree: 0.0,
    /**
     * <PARAM>: Whether this tree can hide units.
     * @memberof ENV_baseTree
     * @instance
     */
    hidable: false,


    /* <------------------------------ internal ------------------------------ */


    /**
     * <INTERNAL>
     * @memberof ENV_baseTree
     * @instance
     */
    treeGrp: "none",
    /**
     * <INTERNAL>
     * @memberof ENV_baseTree
     * @instance
     */
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
