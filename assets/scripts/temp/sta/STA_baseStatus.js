/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = CLS_contentTemplate;


  /* <---------- component ----------> */


  function comp_init(sta) {
    DB_status.db["map"]["affinity"].read(sta.name, Array.air).forEachRow(2, (nmSta, scr) => {
      let osta = MDL_content._ct(nmSta, "sta");
      if(osta != null) sta.affinity(osta, scr);
    });

    let oppoTmp = DB_status.db["map"]["opposite"].read(sta.name, Array.air);
    let oppoArr = typeof oppoTmp === "function" ? oppoTmp() : oppoTmp;
    oppoArr.forEachFast(sta_gn => {
      let osta = MDL_content._ct(sta_gn, "sta");
      if(osta != null) sta.opposite(osta);
    });
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Most basic status effects with no features.
   * Affinities and opposites are defined in {@link DB_status}, do not call `sta.init` anymore!
   * @class STA_baseStatus
   * @extends CLS_contentTemplate
   */
  module.exports = newClass().extendClass(PARENT, "STA_baseStatus").initClass()
  .setParent(StatusEffect)
  .setTags()
  .setParam({


    /**
     * <PARAM>: See {@link RS_baseResource}.
     * @memberof STA_baseStatus
     * @instance
     */
    overwriteVanillaStat: true,
    /**
     * <PARAM>: See {@link RS_baseResource}.
     * @memberof STA_baseStatus
     * @instance
     */
    overwriteVanillaProp: true,

    
  })
  .setParamAlias([
    "eff", "effect", Fx.none,
    "effP", "effectChance", 0.02,
  ])
  .setMethod({


    init: function() {
      comp_init(this);
    },


  });
