/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods related to the Lovec pollution mechanics.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- base ----------> */


  let basePol = 0.0;
  let mapPol = 0.0;
  let dynaPol = 0.0;


  /**
   * Gets pollution produced/reduced by some block.
   * <br> <DB>: blk-pol.
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
   * <br> <DB>: rs-pol.
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
   * Gets total pollution of current save.
   * @return {number}
   */
  const _glbPol = function() {
    return basePol + mapPol + dynaPol * 0.25;
  };
  exports._glbPol = _glbPol;


  /**
   * Gets pollution tolerance of some block or unit type.
   * <br> <DB>: blk-pol-tol.
   * <br> <DB>: utp-pol-tol.
   * @param {string|Block|UnitType|null} ct_gn
   * @return {number}
   */
  const _polTol = function(ct_gn) {
    let ct = MDL_content._ct(ct_gn, null, true);
    if(ct == null) return 500.0;

    return DB_HANDLER.read(ct instanceof UnitType ? "utp-pol-tol" : "blk-pol-tol", ct, 500.0);
  }
  .setCache();
  exports._polTol = _polTol;


  /**
   * Increases dynamic pollution.
   * @param {number} amt
   * @return {number}
   */
  const addDynaPol = function(amt) {
    return dynaPol += amt;
  };
  exports.addDynaPol = addDynaPol;


  /**
   * Sets pollution related stats.
   * @param {Block} blk
   * @return {void}
   */
  const comp_setStats_pol = function(blk) {
    let pol = _blkPol(blk);
    if(!pol.fEqual(0.0)) blk.stats.add(pol > 0.0 ? fetchStat("lovec", "blk-pol") : fetchStat("lovec", "blk-polred"), Math.abs(pol), fetchStatUnit("lovec", "polunits"));
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
    if(isActive && Mathf.chance(VAR.p_polUpdateP)) {
      basePol += b.ex_getBlkPol != null ?
        b.ex_getBlkPol() :
        _blkPol(b.block);
    };
  });
  TRIGGER.majorIter.end.addGlobalListener(() => {
    basePol /= VAR.p_polUpdateP;
  });

}, 42067771);




MDL_event._c_onWorldLoad(() => {

  Time.run(25.0, () => {
    mapPol = DB_env.db["param"]["map"]["pol"].read(
      PARAM.mapCur,
      DB_env.db["param"]["pla"]["pol"].read(PARAM.plaCur, 0.0),
    );
    dynaPol = SAVE.get("dynamic-pollution");
  });

}, 45200137);




MDL_event._c_onUpdate(() => {

  if(PARAM.modded) {
    if(!Vars.state.isGame()) {
      dynaPol = 0.0;
    } else {
      if(TIMER.sec) dynaPol *= 0.984;
      if(TIMER.paramLarge) SAVE.set("dynamic-pollution", dynaPol);
    };
  };

}, 28199720);
