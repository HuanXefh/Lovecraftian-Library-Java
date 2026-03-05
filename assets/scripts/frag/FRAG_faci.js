/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Just random methods for random purpose.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- core energy ----------> */


  const cepCapMap = new ObjectMap();
  const cepUseMap = new ObjectMap();
  const cepFracMap = new ObjectMap();
  const cepEffcMap = new ObjectMap();


  /**
   * Gets amount of CEPs provided by some block.
   * @param {BlockGn} blk_gn
   * @return {number}
   */
  const _cepProv = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");
    return blk == null ?
      0.0 :
      DB_block.db["param"]["cep"]["prov"].read(blk.name, MDL_cond._isCoreBlock(blk) ? 5.0 : 0.0);
  }
  .setCache();
  exports._cepProv = _cepProv;


  /**
   * Gets amount of CEPs used by some block.
   * @param {BlockGn} blk_gn
   * @return {number}
   */
  const _cepUse = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");
    return blk == null ?
      0.0 :
      DB_block.db["param"]["cep"]["use"].read(blk.name, 0.0);
  }
  .setCache();
  exports._cepUse = _cepUse;


  /**
   * Gets current amount of CEPs provided for some team.
   * @param {Team} team
   * @return {number}
   */
  const _cepCapCur = function(team) {
    return cepCapMap.get(team, 0.0);
  };
  exports._cepCapCur = _cepCapCur;


  /**
   * Gets current amount of CEPs used for some team.
   * @param {Team} team
   * @return {number}
   */
  const _cepUseCur = function(team) {
    return cepUseMap.get(team, 0.0);
  };
  exports._cepUseCur = _cepUseCur;


  /**
   * Gets current fraction of CEPs used for some team.
   * @param {Team} team
   * @return {number}
   */
  const _cepFracCur = function(team) {
    return cepFracMap.get(team, 0.0);
  };
  exports._cepFracCur = _cepFracCur;


  /**
   * Gets current efficiency of core energy for some team.
   * @param {Team} team
   * @return {number}
   */
  const _cepEffcCur = function(team) {
    return cepEffcMap.get(team, 1.0);
  };
  exports._cepEffcCur = _cepEffcCur;


  /* <---------- mining ----------> */


  /**
   * Gets the drill speed for some block.
   * @param {Block} blk
   * @param {boolean|unset} [boosted]
   * @return {number}
   */
  const _drillSpd = function(blk, boosted) {
    return readClassFunMap(DB_block.db["class"]["map"]["drillSpd"], blk, Function.airZero)(blk, tryVal(boosted, false)) / tryJsProp(blk, "drillAmtMtp", 1.0);
  };
  exports._drillSpd = _drillSpd;


  /**
   * Gets resource level of a tree.
   * @param {Block} blk
   * @return {number}
   */
  const _treeRsLvl = function(blk) {
    if(!MDL_cond._isTreeBlock(blk)) return 0.0;

    let
      treeGrp = tryJsProp(blk, "treeGrp", "none"),
      rsLvl = 0.0,
      attrs = readParam(DB_env.db["grpParam"]["tree"].read(treeGrp), "attrsGetter", Function.airArr)();

    if(attrs.length !== 0) {
      rsLvl = Math.max.apply(null, attrs.map(nmAttr => blk.attributes.get(Attribute.get(nmAttr))));
    };

    return rsLvl;
  };
  exports._treeRsLvl = _treeRsLvl;


  /* <---------- turret ----------> */


  /**
   * Sets up outline parameters for a content.
   * @param {UnlockableContent} ct
   * @return {void}
   */
  const setupOutline = function(ct) {
    let tup = DB_unit.db["grpParam"]["outline"].read(MDL_content._mod(ct));
    if(tup == null) return;

    if(tup[0] < 1) {
      if(ct.outlines != null) ct.outlines = false;
    } else {
      ct.outlineRadius = tup[0];
      ct.outlineColor = MDL_color._color(tup[1], "new");
    };
  };
  exports.setupOutline = setupOutline;


/*
  ========================================
  Section: Application
  ========================================
*/




  MDL_event._c_onLoad(() => {

    let cepCapObj = {}, cepUseObj = {};
    TRIGGER.majorIter.start.addGlobalListener(() => {
      VARGEN.mainTeams.forEachFast(team => {
        cepCapObj[team] = 0.0;
        cepUseObj[team] = 0.0;
      });
    });
    TRIGGER.majorIter.building.addGlobalListener((b, isActive) => {
      if(!isActive) return;
      cepCapObj[b.team] += _cepProv(b.block);
      cepUseObj[b.team] += _cepUse(b.block);
    });
    TRIGGER.majorIter.end.addGlobalListener(() => {
      VARGEN.mainTeams.forEachFast(team => {
        cepCapMap.put(team, cepCapObj[team]);
        cepUseMap.put(team, cepUseObj[team]);
        cepFracMap.put(team, cepCapObj[team] < 0.0001 ? 1.0 : cepUseObj[team] / cepCapObj[team]);
        cepEffcMap.put(team, cepFracMap.get(team) < 1.0001 ? 1.0 : Mathf.maxZero((2.0 * cepCapObj[team] - cepUseObj[team]) / cepCapObj[team]));
      });
    });

  }, 38429987);
