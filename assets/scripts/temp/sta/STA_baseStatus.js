/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * The base of all status effects with no features.
   * ---------------------------------------- */


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


  module.exports = newClass().extendClass(PARENT, "STA_baseStatus").initClass()
  .setParent(StatusEffect)
  .setTags()
  .setParam({
    // @PARAM: See {RS_baseResource}.
    overwriteVanillaStat: true,
    // @PARAM: See {RS_baseResource}.
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
