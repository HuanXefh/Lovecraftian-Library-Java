/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods related to attribute and dynamic attribute calculation.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const TRIGGER = require("lovec/glb/BOX_trigger");
  const PARAM = require("lovec/glb/GLB_param");


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Attributes are used mostly as names.
   * ---------------------------------------- */
  const _attr = function(attr_gn) {
    let nmAttr = null;

    if(attr_gn instanceof Attribute) nmAttr = attr_gn.toString();
    if(typeof attr_gn === "string") nmAttr = attr_gn;

    return nmAttr;
  };
  exports._attr = _attr;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the name of an attribute from the bundle.
   * Format: {attr.*attribute name*.name}.
   * You should put mod name in attribute name like {lovec-attr0env-heat}, since it's not automatically added.
   * See {TP_attr} for examples.
   * ---------------------------------------- */
  const _attrB = function(attr_gn, isDes) {
    return Vars.headless ? "" : Core.bundle.get("attr." + _attr(attr_gn) + (isDes ? ".description" : ".name"));
  };
  exports._attrB = _attrB;


  /* <---------- map ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a 3-array containing blocks that are related to the inputted attributes.
   * Blocks with negative efficiency are also included.
   * Optionally uses {boolF} to filter out valid blocks.
   * Format: {blk, attrVal, attr}.
   * ---------------------------------------- */
  const _blkAttrMap = function(attrs_gn_p, boolF) {
    if(boolF == null) boolF = Function.airTrue;

    let attrs_gn = (attrs_gn_p instanceof Array) ? attrs_gn_p : [attrs_gn_p];
    let map = [];

    attrs_gn.forEachFast(attr_gn => {
      let nmAttr = _attr(attr_gn);
      Vars.content.blocks().each(blk => boolF(blk), blk => {
        let attrVal = blk.attributes.get(Attribute.get(nmAttr));
        if(Math.abs(attrVal) > 0.0) {
          map.push(blk, attrVal, nmAttr);
        };
      });
    });

    return map;
  };
  exports._blkAttrMap = _blkAttrMap;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a list of attributes that is present in an attribute-resource map.
   * {attrRsMap} is usually defined in DB files, which is used for dynamic attribute crafters.
   * ---------------------------------------- */
  const _attrs_attrRsMap = function(attrRsMap) {
    return attrRsMap.readCol(2, 0);
  };
  exports._attrs_attrRsMap = _attrs_attrRsMap;


  /* <---------- sum ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * The vanilla way to calculate {attrSum}.
   * ---------------------------------------- */
  const _sum = function(blk, t, attr_gn) {
    return blk.sumAttribute(Attribute.get(_attr(attr_gn)), t.x, t.y);
  };
  exports._sum = _sum;


  /* ----------------------------------------
   * NOTE:
   *
   * Calculate {attrSum} from a list of tiles.
   * If mode is {"block"} attributes from buildings will get involved... if you want for some reason.
   * ---------------------------------------- */
  const _sum_ts = function thisFun(ts, attr_gn, mode) {
    let attrSum = 0.0;

    if(mode == null) mode = "floor";
    if(!mode.equalsAny(thisFun.modes)) return attrSum;

    let nmAttr = _attr(attr_gn);
    switch(mode) {
      case "floor" :
        ts.forEachFast(ot => attrSum += ot.floor().attributes.get(Attribute.get(nmAttr)));
        break;
      case "block" :
        ts.forEachFast(ot => attrSum += ot.block().attributes.get(Attribute.get(nmAttr)));
        break;
      case "overlay" :
        ts.forEachFast(ot => attrSum += ot.overlay().attributes.get(Attribute.get(nmAttr)));
        break;
      case "all" :
        ts.forEachFast(ot => {
          attrSum += ot.floor().attributes.get(Attribute.get(nmAttr));
          attrSum += ot.block().attributes.get(Attribute.get(nmAttr));
          attrSum += ot.overlay().attributes.get(Attribute.get(nmAttr));
        });
        break;
    };

    return attrSum;
  }
  .setProp({
    modes: ["floor", "block", "overlay", "all"],
  });
  exports._sum_ts = _sum_ts;


  const _sum_rect = function thisFun(t, r, size, attr_gn, mode) {
    return _sum_ts(MDL_pos._tsRect(t, r, size, thisFun.tmpTs), attr_gn, mode);
  }
  .setProp({
    tmpTs: [],
  });
  exports._sum_rect = _sum_rect;


  const _sum_circle = function thisFun(t, r, size, attr_gn, mode) {
    return _sum_ts(MDL_pos._tsCircle(t, r, size, thisFun.tmpTs), attr_gn, mode);
  }
  .setProp({
    tmpTs: [],
  });
  exports._sum_circle = _sum_circle;


  /* <---------- limit ----------> */


  const _limit = function(size, avLimit) {
    if(avLimit == null) avLimit = 1.0;

    return Math.pow(size, 2) * avLimit;
  };
  exports._limit = _limit;


  /* <---------- dynamic ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the target resource of a block that contains dynamic attributes.
   * ---------------------------------------- */
  const _dynaAttrRs = function(attrRsMap, blk) {
    let tmpNmRs = null;
    let tmpVal = 0.0;

    let val = 0.0;
    attrRsMap.forEachRow(2, (nmAttr, nmRs) => {
      val = blk.attributes.get(Attribute.get(nmAttr));
      if(val > tmpVal) {
        tmpNmRs = nmRs;
        tmpVal = val;
      };
    });

    return MDL_content._ct(tmpNmRs, "rs");
  };
  exports._dynaAttrRs = _dynaAttrRs;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the currently highest attribute value and returns a 3-tuple, from a list of tiles.
   * Format: {attr, attrSum, rs}.
   * ---------------------------------------- */
  const _dynaAttrTup = function(attrRsMap, ts, mode) {
    let nmAttr = null;
    let attrSum = 0.0;
    let rs = null;

    let iCap = attrRsMap.iCap();
    let tmpNmAttr, tmpAttrSum;
    if(iCap > 0) {
      for(let i = 0; i < iCap; i += 2) {
        tmpNmAttr = attrRsMap[i];
        tmpAttrSum = _sum_ts(ts, tmpNmAttr, mode);
        if(tmpAttrSum > attrSum) {
          nmAttr = tmpNmAttr;
          attrSum = tmpAttrSum;
          rs = MDL_content._ct(attrRsMap[i + 1], "rs");
        };
      };
    };

    return (rs == null) ? null : [nmAttr, attrSum, rs];
  };
  exports._dynaAttrTup = _dynaAttrTup;


  /* <---------- special ----------> */


  /* rain */


  /* ----------------------------------------
   * NOTE:
   *
   * Returns current liquid of rain weather, can be null if not found.
   * ---------------------------------------- */
  const _rainLiq = function() {
    if(!Vars.state.isGame()) return null;

    let weaState = Groups.weather.find(weaState1 => weaState1.weather instanceof RainWeather);
    if(weaState == null) return null;

    return weaState.weather.liquid;
  };
  exports._rainLiq = _rainLiq;


  /* wind */


  const windVec = new Vec2();


  /* ----------------------------------------
   * NOTE:
   *
   * Calculate current value of wind attribute.
   *
   * To set wind force for your planet, see {DB_env.db["param"]["pla"]["wind"]}.
   * For a specific map, see {DB_env.db["param"]["map"]["wind"]}, which has higher priority than planet.
   * ---------------------------------------- */
  const _sumWind = function thisFun(t, mtp) {
    if(mtp == null) mtp = 1.0;

    let attrSum = (1.0 - Math.pow(Math.sin(Time.time / 6400.0 / mtp), 2) * 0.7);
    if(thisFun.sumScl == null) {
      thisFun.sumScl = DB_env.db["param"]["map"]["wind"].read(PARAM.mapCur, DB_env.db["param"]["pla"]["wind"].read(PARAM.plaCur, 1.0));
    };
    attrSum *= thisFun.sumScl;
    if(t != null && attrSum > 0.0) attrSum += Mathf.randomSeed(t.pos(), -2, 2) * 0.1;
    if(attrSum < 0.0) attrSum = 0.0;

    return attrSum;
  }
  .setProp({
    sumScl: null,
  })
  .setAnno("init", function() {
    const thisFun = this;

    TRIGGER.mapChange.addGlobalListener(() => {
      thisFun.sumScl = null;
    });
  });
  exports._sumWind = _sumWind;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets currently used global wind vector.
   * ---------------------------------------- */
  const _windVec = function() {
    return windVec;
  };
  exports._windVec = _windVec;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets angle of the global wind vector.
   * ---------------------------------------- */
  const _windAng = function() {
    return Math.atan(windVec.y / windVec.x) * Mathf.radDeg;
  };
  exports._windAng = _windAng;


/*
  ========================================
  Section: Application
  ========================================
*/


  MDL_event._c_onWorldLoad(() => {


    windVec.setToRandomDirection();


  }, 16225779);
