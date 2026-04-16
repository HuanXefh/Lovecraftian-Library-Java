/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods related to attribute and dynamic attribute calculation.
   * @module lovec/mdl/MDL_attr
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- base ----------> */


  const AttrModes = new CLS_enum({
    ALL: 0xff,
    FLOOR: 1 << 0,
    BLOCK: 1 << 1,
    OVERLAY: 1 << 2,
  });
  exports.AttrModes = AttrModes;


  /**
   * Converts generalized attribute to string.
   * @param {AttrGn} attr_gn
   * @return {string|null}
   */
  const _attr = function(attr_gn) {
    let nmAttr = null;
    if(attr_gn instanceof Attribute) nmAttr = attr_gn.toString();
    if(typeof attr_gn === "string") nmAttr = attr_gn;

    return nmAttr;
  };
  exports._attr = _attr;


  /**
   * <BUNDLE>: "attr.<attr_gn>.name" or "attr.<attr_gn>.description".
   * @param {AttrGn} attr_gn
   * @param {boolean|unset} [isDes]
   * @return {string}
   */
  const _attrB = function(attr_gn, isDes) {
    return MDL_bundle._base("attr." + _attr(attr_gn) + (!isDes ? ".name" : ".description"));
  };
  exports._attrB = _attrB;


  /* <---------- map ----------> */


  /**
   * Gets a 3-array containing blocks that have some of the given attributes.
   * @param {AttrGn|Array<AttrGn>} attrs_gn_p
   * @param {(function(Block): boolean)|unset} [boolF] - Used to filter out valid blocks.
   * @return {Array} <ROW>: blk, attrVal, attr.
   */
  const _blkAttrArr = function(attrs_gn_p, boolF) {
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
  exports._blkAttrArr = _blkAttrArr;


  /**
   * Gets attributes that are present in an attribute-resource array.
   * @param {Array} attrRsArr - See {@link DB_item}. <br> <ROW>: attr, rs.
   * @return {Array<string>}
   */
  const _attrs_attrRsArr = function(attrRsArr) {
    return attrRsArr.readCol(2, 0);
  };
  exports._attrs_attrRsArr = _attrs_attrRsArr;


  /* <---------- sum ----------> */


  /**
   * Vanilla way to calculate attribute sum.
   * @param {Block} blk
   * @param {Tile} t
   * @param {AttrGn} attr_gn
   * @return {number}
   */
  const _sum = function(blk, t, attr_gn) {
    return blk.sumAttribute(Attribute.get(_attr(attr_gn)), t.x, t.y);
  };
  exports._sum = _sum;


  /**
   * Variant of {@link _sum} that uses a list of tiles.
   * @param {Array<Tile>} ts
   * @param {AttrGn} attr_gn
   * @param {number|unset} [mode] - Determines what blocks will be involved for attribute calculation. See {@link AttrModes}
   * @return {number}
   */
  const _sumTs = function thisFun(ts, attr_gn, mode) {
    let attrSum = 0.0;
    if(mode == null) mode = AttrModes.FLOOR;

    let nmAttr = _attr(attr_gn);
    ts.forEachFast(ot => {
      if((mode & AttrModes.FLOOR) !== 0) attrSum += ot.floor().attributes.get(Attribute.get(nmAttr));
      if((mode & AttrModes.BLOCK) !== 0) attrSum += ot.block().attributes.get(Attribute.get(nmAttr));
      if((mode & AttrModes.OVERLAY) !== 0) attrSum += ot.overlay().attributes.get(Attribute.get(nmAttr));
    });

    return attrSum;
  };
  exports._sumTs = _sumTs;


  /**
   * Variant of {@link _sumTs} that uses a rectangular range.
   * @param {Tile|null} t
   * @param {number|unset} r
   * @param {number|unset} size
   * @param {AttrGn} attr_gn
   * @param {number|unset} [mode] - See {@link AttrModes}.
   * @return {number}
   */
  const _sumRect = function thisFun(t, r, size, attr_gn, mode) {
    return _sumTs(MDL_pos._tsRect(t, r, size, thisFun.tmpTs), attr_gn, mode);
  }
  .setProp({
    tmpTs: [],
  });
  exports._sumRect = _sumRect;


  /**
   * Variant of {@link _sumTs} that uses a circular range.
   * @param {Tile|null} t
   * @param {number|unset} r
   * @param {number|unset} size
   * @param {AttrGn} attr_gn
   * @param {number|unset} [mode] - See {@link AttrModes}.
   * @return {number}
   */
  const _sumCircle = function thisFun(t, r, size, attr_gn, mode) {
    return _sumTs(MDL_pos._tsCircle(t, r, size, thisFun.tmpTs), attr_gn, mode);
  }
  .setProp({
    tmpTs: [],
  });
  exports._sumCircle = _sumCircle;


  /* <---------- limit ----------> */


  /**
   * Calculates required attribute value.
   * @param {number} size
   * @param {number|unset} [avLimit] - Attribute value required per tile.
   * @param {boolean|unset} [isWall] - For blocks like wall crafter.
   * @return {number}
   */
  const _limit = function(size, avLimit, isWall) {
    if(avLimit == null) avLimit = 1.0;

    return Math.pow(size, isWall ? 1 : 2) * avLimit;
  };
  exports._limit = _limit;


  /* <---------- dynamic ----------> */


  /**
   * Gets target resource of a block that contains dynamic attributes.
   * @param {Array} attrRsArr
   * @param {Block} blk
   * @return {Resource|null}
   */
  const _dynaAttrRs = function(attrRsArr, blk) {
    let tmpNmRs = null;
    let tmpVal = 0.0;

    let val = 0.0;
    attrRsArr.forEachRow(2, (nmAttr, nmRs) => {
      val = blk.attributes.get(Attribute.get(nmAttr));
      if(val > tmpVal) {
        tmpNmRs = nmRs;
        tmpVal = val;
      };
    });

    return MDL_content._ct(tmpNmRs, "rs");
  };
  exports._dynaAttrRs = _dynaAttrRs;


  /**
   * Gets currently preferred dynamic attribute and the target resource from a list of tiles.
   * See {@link _sumTs}.
   * @param {Array} attrRsArr
   * @param {Array<Tile>} ts
   * @param {number|unset} [mode] - See {@link AttrModes}.
   * @return {[string, number, Resource]} <TUP>: attr, attrSum, rs.
   */
  const _dynaAttrTup = function(attrRsArr, ts, mode) {
    let nmAttr = null;
    let attrSum = 0.0;
    let rs = null;

    let iCap = attrRsArr.iCap();
    let tmpNmAttr, tmpAttrSum;
    if(iCap > 0) {
      for(let i = 0; i < iCap; i += 2) {
        tmpNmAttr = attrRsArr[i];
        tmpAttrSum = _sumTs(ts, tmpNmAttr, mode);
        if(tmpAttrSum > attrSum) {
          nmAttr = tmpNmAttr;
          attrSum = tmpAttrSum;
          rs = MDL_content._ct(attrRsArr[i + 1], "rs");
        };
      };
    };

    return (rs == null) ? null : [nmAttr, attrSum, rs];
  };
  exports._dynaAttrTup = _dynaAttrTup;


  /* <---------- special ----------> */


  /* rain */


  /**
   * Gets current liquid of rain weather, null if not found.
   * @return {Liquid|null}
   */
  const _rainLiq = function() {
    if(!Vars.state.isGame()) return null;

    let weaState = Groups.weather.find(weaState1 => weaState1.weather instanceof RainWeather);
    if(weaState == null) return null;

    return weaState.weather.liquid;
  };
  exports._rainLiq = _rainLiq;


  /* wind */


  const windVec = new Vec2();


  /**
   * Gets current value of wind attribute at some tile.
   * Wind force is set in {@link DB_env}.
   * @param {Tile} t
   * @param {number|unset} [mtp] - Multiplier on final value.
   * @return {number}
   */
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


  /**
   * Gets currently used global wind vector (not the one used in {@link Weather}).
   * @return {Vec2}
   */
  const _windVec = function() {
    return windVec;
  };
  exports._windVec = _windVec;


  /**
   * Gets current angle of global wind vector.
   * @return {number}
   */
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
