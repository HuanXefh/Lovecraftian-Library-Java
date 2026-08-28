/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods related to the Lovec pollution mechanics.
   * @module lovec/mdl/MDL_pollution
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  let
    basePol = 0.0,
    mapPol = 0.0,
    dynaPol = 0.0,
    lingerPol = 0.0,
    glbPolMeanArr = new MathMeanArray(8);


  /**
   * Gets pollution produced/reduced by some block.
   * <br> `DB`: blk-pol.
   * @param {BlockGn} blk_gn
   * @return {number}
   */
  const getBlkPol = function(blk_gn) {
    let blk = MDL_content.getCt(blk_gn, "blk");
    if(blk == null) return 0.0;

    return DB_HANDLER.read("blk-pol", blk, 0.0);
  }
  .setCache();
  exports.getBlkPol = getBlkPol;


  /**
   * Gets pollution of some resource.
   * <br> `DB`: rs-pol.
   * @param {ResourceGn} rs_gn
   * @return {number}
   */
  const getRsPol = function(rs_gn) {
    let rs = MDL_content.getCt(rs_gn, "rs");
    if(rs == null) return 0.0;

    return DB_HANDLER.read("rs-pol", rs, (function() {
      let parent = tryJsProp(rs, "intmdParent", null);
      return parent == null ?
        0.0 :
        parent.getContentType() !== rs.getContentType() ?
          0.0 :
          getRsPol(parent);
    })());
  }
  .setCache();
  exports.getRsPol = getRsPol;


  /**
   * Gets block pollution of current save.
   * @return {number}
   */
  const getBasePol = function() {
    return basePol;
  };
  exports.getBasePol = getBasePol;


  /**
   * Gets dynamic pollution of current save.
   * @return {number}
   */
  const getDynaPol = function() {
    return dynaPol;
  };
  exports.getDynaPol = getDynaPol;


  /**
   * Gets lingering pollution of current save.
   * @return {number}
   */
  const getLingerPol = function() {
    return lingerPol;
  };
  exports.getLingerPol = getLingerPol;


  /**
   * Gets total pollution of current save.
   * @return {number}
   */
  const getGlbPol = function() {
    return glbPolMeanArr.getMean();
  };
  exports.getGlbPol = getGlbPol;


  /**
   * Gets pollution tolerance of some block or unit type.
   * <br> `DB`: blk-pol-tol.
   * <br> `DB`: utp-pol-tol.
   * @param {string|Block|UnitType|null} ct_gn
   * @return {number}
   */
  const getPolTol = function(ct_gn) {
    let ct = MDL_content.getCt(ct_gn, null, true);
    if(ct == null) return 500.0;

    return DB_HANDLER.read(ct instanceof UnitType ? "utp-pol-tol" : "blk-pol-tol", ct, -1.0);
  }
  .setCache();
  exports.getPolTol = getPolTol;


  /**
   * Increases dynamic pollution.
   * @param {number} amt
   * @return {number}
   */
  const addDynaPol = function(amt) {
    dynaPol = Mathf.maxZero(dynaPol + amt);
    return dynaPol;
  };
  exports.addDynaPol = addDynaPol;


  /**
   * Increases lingering pollution.
   * @param {number} amt
   * @return {number}
   */
  const addLingerPol = function(amt) {
    lingerPol = Mathf.maxZero(lingerPol + amt);
    return lingerPol;
  };
  exports.addLingerPol = addLingerPol;


  /**
   * Sets pollution related stats.
   * @param {Block} blk
   * @return {void}
   */
  const comp_setStats_pol = function(blk) {
    let pol = getBlkPol(blk);
    if(!pol.fEqual(0.0)) blk.stats.add(pol > 0.0 ? fetchStat("lovec", "blk-pol") : fetchStat("lovec", "blk-polred"), (Math.abs(pol).numToStr(2) + " " + fetchStatUnit("lovec", "polunits").localized()).color(pol > 0.0 ? Pal.remove : Pal.heal));
  };
  exports.comp_setStats_pol = comp_setStats_pol;


/*
  ========================================
  Section: Application
  ========================================
*/




MDL_event.onLoad(() => {

  TRIGGER.majorIter.start.addGlobalListener(() => {
    basePol = 0.0;
  });
  TRIGGER.majorIter.building.addGlobalListener((b, isActive) => {
    if(isActive && syncChance("pollution", VAR.chance.polUpdateP)) {
      basePol += b.ex_getBlkPol != null ?
        b.ex_getBlkPol() :
        getBlkPol(b.block);
    };
  });
  TRIGGER.majorIter.end.addGlobalListener(() => {
    basePol /= VAR.chance.polUpdateP;
  });

});




MDL_event.onWorldLoad(() => {

  Time.run(VAR.delay.worldLoad.loadPol, () => {
    mapPol = DB_env.db["param"]["map"]["pol"].read(
      PARAM.MAP_CURRENT,
      DB_env.db["param"]["pla"]["pol"].read(PARAM.PLANET_CURRENT, 0.0),
    );
    dynaPol = SAVE.get("dynamic-pollution");
    lingerPol = SAVE.get("lingering-pollution");
  });

});




MDL_event.onUpdate(() => {

  if(PARAM.MODDED) {
    if(!Vars.state.isGame()) {
      dynaPol = 0.0;
      glbPol = 0.0;
    } else {
      if(TIMER.sec) {
        dynaPol *= 0.984;
        lingerPol = Mathf.maxZero(lingerPol - 0.05);
      };
      if(TIMER.paramLarge) {
        SAVE.set("dynamic-pollution", dynaPol);
        SAVE.set("lingering-pollution", lingerPol);
        glbPolMeanArr.push(basePol + mapPol + dynaPol * 0.25 + lingerPol);
      };
    };


  };

});
