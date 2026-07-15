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
    glbPolMeanArr = new CLS_meanArray(8);


  /**
   * Gets pollution produced/reduced by some block.
   * <br> `DB`: blk-pol.
   * @param {BlockGn} blk_gn
   * @return {number}
   */
  const _blkPol = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return 0.0;

    return DB_HANDLER.read("blk-pol", blk, 0.0);
  }
  .setCache();
  exports._blkPol = _blkPol;


  /**
   * Gets pollution of some resource.
   * <br> `DB`: rs-pol.
   * @param {ResourceGn} rs_gn
   * @return {number}
   */
  const _rsPol = function(rs_gn) {
    let rs = MDL_content._ct(rs_gn, "rs");
    if(rs == null) return 0.0;

    return DB_HANDLER.read("rs-pol", rs, (function() {
      let parent = tryJsProp(rs, "intmdParent", null);
      return parent == null ?
        0.0 :
        parent.getContentType() !== rs.getContentType() ?
          0.0 :
          _rsPol(parent);
    })());
  }
  .setCache();
  exports._rsPol = _rsPol;


  /**
   * Gets block pollution of current save.
   * @return {number}
   */
  const _basePol = function() {
    return basePol;
  };
  exports._basePol = _basePol;


  /**
   * Gets dynamic pollution of current save.
   * @return {number}
   */
  const _dynaPol = function() {
    return dynaPol;
  };
  exports._dynaPol = _dynaPol;


  /**
   * Gets lingering pollution of current save.
   * @return {number}
   */
  const _lingerPol = function() {
    return lingerPol;
  };
  exports._lingerPol = _lingerPol;


  /**
   * Gets total pollution of current save.
   * @return {number}
   */
  const _glbPol = function() {
    return glbPolMeanArr.getMean();
  };
  exports._glbPol = _glbPol;


  /**
   * Gets pollution tolerance of some block or unit type.
   * <br> `DB`: blk-pol-tol.
   * <br> `DB`: utp-pol-tol.
   * @param {string|Block|UnitType|null} ct_gn
   * @return {number}
   */
  const _polTol = function(ct_gn) {
    let ct = MDL_content._ct(ct_gn, null, true);
    if(ct == null) return 500.0;

    return DB_HANDLER.read(ct instanceof UnitType ? "utp-pol-tol" : "blk-pol-tol", ct, -1.0);
  }
  .setCache();
  exports._polTol = _polTol;


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
    let pol = _blkPol(blk);
    if(!pol.fEqual(0.0)) blk.stats.add(pol > 0.0 ? fetchStat("lovec", "blk-pol") : fetchStat("lovec", "blk-polred"), (Math.abs(pol).roundFixed(2) + " " + fetchStatUnit("lovec", "polunits").localized()).color(pol > 0.0 ? Pal.remove : Pal.heal));
  };
  exports.comp_setStats_pol = comp_setStats_pol;


/*
  ========================================
  Section: Application
  ========================================
*/




MDL_event._c_onLoad(() => {

  TRIGGER.majorIter.start.addGlobalListener(() => {
    basePol = 0.0;
  });
  TRIGGER.majorIter.building.addGlobalListener((b, isActive) => {
    if(isActive && LCRand.chance(UTIL_rand.get("pollution"), VAR.chance.polUpdateP)) {
      basePol += b.ex_getBlkPol != null ?
        b.ex_getBlkPol() :
        _blkPol(b.block);
    };
  });
  TRIGGER.majorIter.end.addGlobalListener(() => {
    basePol /= VAR.chance.polUpdateP;
  });

});




MDL_event._c_onWorldLoad(() => {

  Time.run(VAR.delay.worldLoad.loadPol, () => {
    mapPol = DB_env.db["param"]["map"]["pol"].read(
      PARAM.MAP_CURRENT,
      DB_env.db["param"]["pla"]["pol"].read(PARAM.PLANET_CURRENT, 0.0),
    );
    dynaPol = SAVE.get("dynamic-pollution");
    lingerPol = SAVE.get("lingering-pollution");
  });

});




MDL_event._c_onUpdate(() => {

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
