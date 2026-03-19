/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = CLS_contentTemplate;


  /* <---------- component ----------> */


  function comp_init(blk) {
    Core.app.post(() => {
      if(blk.itemDrop != null) {
        if(blk.dropHardness < 0.0) blk.dropHardness = blk.itemDrop.hardness;
      } else {
        blk.dropHardness = Number.n4;
      };
    });
  };


  function comp_setStats(blk) {
    if(blk.itemDrop != null) blk.stats.add(fetchStat("lovec", "rs-hardness"), blk.dropHardness);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Root for all environmental blocks.
   * @class ENV_baseEnvBlock
   * @extends CLS_contentTemplate
   */
  module.exports = newClass().extendClass(PARENT, "ENV_baseEnvBlock").initClass()
  .setParent(null)
  .setTags("blk-env")
  .setParam({


    /**
     * <PARAM>: See {@link RS_baseResource}.
     * @memberof ENV_baseEnvBlock
     * @instance
     */
    overwriteVanillaStat: true,
    /**
     * <PARAM>: See {@link RS_baseResource}.
     * @memberof ENV_baseEnvBlock
     * @instance
     */
    overwriteVanillaProp: true,
    /**
     * <PARAM>: If not negative, this will be used as hardness of the item drop. Only affects placement, does not affect real drill time!
     * @memberof ENV_baseEnvBlock
     * @instance
     */
    dropHardness: -1.0,


  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    setStats: function() {
      comp_setStats(this);
    },


  });
