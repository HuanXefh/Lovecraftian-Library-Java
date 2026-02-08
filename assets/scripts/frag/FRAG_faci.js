/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Just random methods for random purpose.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const TRIGGER = require("lovec/glb/BOX_trigger");
  const PARAM = require("lovec/glb/GLB_param");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_color = require("lovec/mdl/MDL_color");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_event = require("lovec/mdl/MDL_event");


  const DB_block = require("lovec/db/DB_block");
  const DB_env = require("lovec/db/DB_env");
  const DB_unit = require("lovec/db/DB_unit");


  /* <---------- core energy ----------> */


  const cepCapMap = new ObjectMap();
  const cepUseMap = new ObjectMap();
  const cepFracMap = new ObjectMap();
  const cepEffcMap = new ObjectMap();


  /* ----------------------------------------
   * NOTE:
   *
   * Gets amount of CEPs provided by some block.
   * ---------------------------------------- */
  const _cepProv = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");
    return blk == null ?
      0.0 :
      DB_block.db["param"]["cep"]["prov"].read(blk.name, MDL_cond._isCoreBlock(blk) ? 5.0 : 0.0);
  }
  .setCache();
  exports._cepProv = _cepProv;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets amount of CEPs used by some block.
   * ---------------------------------------- */
  const _cepUse = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");
    return blk == null ?
      0.0 :
      DB_block.db["param"]["cep"]["use"].read(blk.name, 0.0);
  }
  .setCache();
  exports._cepUse = _cepUse;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets current amount of CEPs provided.
   * ---------------------------------------- */
  const _cepCapCur = function(team) {
    return cepCapMap.get(team, 0.0);
  };
  exports._cepCapCur = _cepCapCur;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets current amount of CEPs used.
   * ---------------------------------------- */
  const _cepUseCur = function(team) {
    return cepUseMap.get(team, 0.0);
  };
  exports._cepUseCur = _cepUseCur;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets current fraction of CEPs used.
   * ---------------------------------------- */
  const _cepFracCur = function(team) {
    return cepFracMap.get(team, 0.0);
  };
  exports._cepFracCur = _cepFracCur;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets current efficiency of core energy.
   * ---------------------------------------- */
  const _cepEffcCur = function(team) {
    return cepEffcMap.get(team, 1.0);
  };
  exports._cepEffcCur = _cepEffcCur;


  /* <---------- mining ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the drill speed for {blk}.
   * ---------------------------------------- */
  const _drillSpd = function(blk, boosted) {
    return readClassFunMap(DB_block.db["class"]["map"]["drillSpd"], blk, Function.airZero)(blk, tryVal(boosted, false)) / tryJsProp(blk, "drillAmtMtp", 1.0);
  };
  exports._drillSpd = _drillSpd;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets resource level of a tree (or mushroom).
   * See {DB_env.db["grpParam"]["tree"]}.
   * ---------------------------------------- */
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
