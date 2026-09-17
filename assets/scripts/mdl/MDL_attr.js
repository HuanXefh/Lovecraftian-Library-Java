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


    /* <------------------------------ base ------------------------------ */


    /** @global */
    const AttrModes = newEnum({
        /** @type {ENumber} */
        ALL: 0xff,
        /** @type {ENumber} */
        FLOOR: 1 << 0,
        /** @type {ENumber} */
        BLOCK: 1 << 1,
        /** @type {ENumber} */
        OVERLAY: 1 << 2,
    }, "AttrModes");


    /** @global */
    const AttrRecipeTypes = newEnum({
        /** @type {ENumber} */
        FLOOR: 0,
        /** @type {ENumber} */
        WALL: 1,
        /** @type {ENumber} */
        PROP: 2,
    }, "AttrRecipeTypes");


    /**
     * Converts generalized attribute to string.
     * @param {AttrGn} attr_gn
     * @param {boolean|unset} [toAttr] - If true, the result will be an attribute instead of string.
     * @return {string|Attribute}
     */
    const getAttr = function(attr_gn, toAttr) {
        return toAttr ?
          (
              attr_gn instanceof Attribute ?
                  attr_gn :
                  typeof attr_gn === "string" && Attribute.exists(attr_gn) ?
                      Attribute.get(attr_gn) :
                      TP_attr.attr_placeholder
          ) :
          (
              attr_gn instanceof Attribute ?
                  attr_gn.toString() :
                  typeof attr_gn === "string" && Attribute.exists(attr_gn) ?
                      attr_gn :
                      "lovec-attr-placeholder"
          );
    };
    exports.getAttr = getAttr;


    /**
     * `BUNDLE`: `attr.<attr_gn>.name` or `attr.<attr_gn>.description`.
     * @param {AttrGn} attr_gn
     * @param {boolean|unset} [isDes]
     * @return {string}
     */
    const getAttrBundle = function(attr_gn, isDes) {
        return MDL_bundle.getBase("attr." + getAttr(attr_gn) + (!isDes ? ".name" : ".description"));
    };
    exports.getAttrBundle = getAttrBundle;


    /**
     * Calculates attribute efficiency.
     * @param {number} sum
     * @param {number|unset} [min] - Sum for 0% without scaling.
     * @param {number|unset} [max] - Sum for 100% without scaling.
     * @param {number|unset} [boostScl]
     * @param {number|unset} [boostCap]
     */
    const calcAttrEffc = function(sum, min, max, boostScl, boostCap) {
        return Mathf.clamp(
            LCLerp.lerp(0.0, 1.0, sum, tryVal(min, 0.0), tryVal(max, 1.0)) * tryVal(boostScl, 1.0),
            0.0,
            tryVal(boostCap, 1.0),
        );
    };
    exports.calcAttrEffc = calcAttrEffc;


    /* <------------------------------ list ------------------------------ */


    /**
     * Gets a 3-array containing blocks that have some of the given attributes.
     * @param {Plural<AttrGn>} attrs_gn_p
     * @param {FFunction<Block, boolean>|unset} [boolF] - Used to filter out valid blocks.
     * @return {F3Array<Block, number, string>} `ROW`: blk, attrVal, nameAttr.
     */
    const getBlkAttrArr = function(attrs_gn_p, boolF) {
        if(boolF == null) boolF = Function.airTrue;
        let attrs_gn = (attrs_gn_p instanceof Array) ? attrs_gn_p : [attrs_gn_p];
        let arr = [];

        let nameAttr, attrVal;
        attrs_gn.forEachFast(attr_gn => {
            nameAttr = getAttr(attr_gn);
            Vars.content.blocks().each(
                blk => boolF(blk),
                blk => {
                    attrVal = blk.attributes.get(Attribute.get(nameAttr));
                    if(Math.abs(attrVal) > 0.0) {
                        arr.push(blk, attrVal, nameAttr);
                    };
                },
            );
        });

        return arr;
    };
    exports.getBlkAttrArr = getBlkAttrArr;


    /**
     * Gets attributes that are present in an attribute-resource array.
     * @param {F2Array<string, ResourceGn>} attrRsArr
     * @return {Array<string>}
     */
    const getAttrsInAttrRsArr = function(attrRsArr) {
        return attrRsArr.readCol(2, 0);
    };
    exports.getAttrsInAttrRsArr = getAttrsInAttrRsArr;


    /* <------------------------------ sum ------------------------------ */


    /**
     * Vanilla way to calculate attribute sum.
     * @param {Block} blk
     * @param {Tile} t
     * @param {AttrGn} attr_gn
     * @return {number}
     */
    const calcSum = function(blk, t, attr_gn) {
        return blk.sumAttribute(getAttr(attr_gn, true), t.x, t.y);
    };
    exports.calcSum = calcSum;


    /**
     * Variant of {@link calcSum} that uses a list of tiles.
     * @param {Array<Tile>} ts
     * @param {AttrGn} attr_gn
     * @param {ENumber|unset} [mode] - See {@link AttrModes}.
     * @return {number}
     */
    const calcSumByTs = function thisFun(ts, attr_gn, mode) {
        let attrSum = 0.0;
        if(mode == null) mode = AttrModes.FLOOR;

        let attr = getAttr(attr_gn, true);
        ts.forEachFast(ot => {
            if((mode & AttrModes.FLOOR) !== 0) attrSum += ot.floor().attributes.get(attr);
            if((mode & AttrModes.BLOCK) !== 0) attrSum += ot.block().attributes.get(attr);
            if((mode & AttrModes.OVERLAY) !== 0) attrSum += ot.overlay().attributes.get(attr);
        }, true);

        return attrSum;
    };
    exports.calcSumByTs = calcSumByTs;


    /**
     * Variant of {@link calcSumByTs} that uses a rectangular range.
     * @param {Tile|null} t
     * @param {number|unset} r
     * @param {number|unset} size
     * @param {AttrGn} attr_gn
     * @param {ENumber|unset} [mode] - See {@link AttrModes}.
     * @return {number}
     */
    const calcSumRect = function thisFun(t, r, size, attr_gn, mode) {
        return calcSumByTs(LCPos.getTilesRect(thisFun.tmpTs, t, r, size), attr_gn, mode);
    }
    .setProp({
        /**
         * @memberof calcSumRect
         * @type {Array<Tile>}
         */
        tmpTs: [],
    });
    exports.calcSumRect = calcSumRect;


    /**
     * Variant of {@link calcSumByTs} that uses a circular range.
     * @param {Tile|null} t
     * @param {number|unset} r
     * @param {number|unset} size
     * @param {AttrGn} attr_gn
     * @param {ENumber|unset} [mode] - See {@link AttrModes}.
     * @return {number}
     */
    const calcSumCircle = function thisFun(t, r, size, attr_gn, mode) {
        return calcSumByTs(LCPos.getTilesCircle(thisFun.tmpTs, t, r, size), attr_gn, mode);
    }
    .setProp({
        /**
         * @memberof calcSumCircle
         * @type {Array<Tile>}
         */
        tmpTs: [],
    });
    exports.calcSumCircle = calcSumCircle;


    /* <------------------------------ limit ------------------------------ */


    /**
     * Calculates required attribute value.
     * @param {number} size
     * @param {number|unset} [avAttrReq] - Attribute value required per tile.
     * @param {boolean|unset} [isWall] - For blocks like wall crafter.
     * @return {number}
     */
    const getAttrReq = function(size, avAttrReq, isWall) {
        return Math.pow(size, isWall ? 1 : 2) * tryVal(avAttrReq, 1.0);
    };
    exports.getAttrReq = getAttrReq;


    /* <------------------------------ dynamic attribute ------------------------------ */


    /**
     * Gets target resource of a block that contains dynamic attributes.
     * @param {F2Array<string, ResourceGn>} attrRsArr
     * @param {Block} blk
     * @return {Resource|null}
     */
    const getDynaAttrRs = function(attrRsArr, blk) {
        let
            tmpNameRs = null,
            tmpVal = 0.0,
            val = 0.0;
        attrRsArr.forEachRow(2, (nameAttr, nameRs) => {
            val = blk.attributes.get(Attribute.get(nameAttr));
            if(val > tmpVal) {
                tmpNameRs = nameRs;
                tmpVal = val;
            };
        }, true);
        return MDL_content.getCt(tmpNameRs, ContentGetModes.RS);
    };
    exports.getDynaAttrRs = getDynaAttrRs;


    /**
     * Gets currently preferred dynamic attribute and the target resource from a list of tiles.
     * See {@link calcSumByTs}.
     * @param {Array|unset} contTup
     * @param {F2Array<string, ResourceGn>} attrRsArr
     * @param {Array<Tile>} ts
     * @param {ENumber|unset} [mode] - See {@link AttrModes}.
     * @return {[Attribute, number, Resource]} `TUPLE`: attr, attrSum, rs.
     */
    const getDynaAttrTup = function(contTup, attrRsArr, ts, mode) {
        let tup = contTup != null ? contTup.clear() : [];

        let
            i = 0,
            iCap = attrRsArr.iCap(),
            attr = null,
            attrSum = 0.0,
            rs = null,
            tmpAttr,
            tmpAttrSum;
        while(i < iCap) {
            tmpAttr = getAttr(attrRsArr[i], true);
            tmpAttrSum = calcSumByTs(ts, tmpAttr, mode) + tmpAttr.env();
            if(tmpAttrSum > attrSum) {
                attr = tmpAttr;
                attrSum = tmpAttrSum;
                rs = attrRsArr[i + 1];
            };
            i += 2;
        };

        rs = MDL_content.getCt(rs, ContentGetModes.RS);
        return rs == null ?
            tup.with(TP_attr.attr_placeholder, 0.0, null) :
            tup.with(attr, attrSum, rs);
    };
    exports.getDynaAttrTup = getDynaAttrTup;


    /* <------------------------------ special ------------------------------ */


    /* rain */


    /**
     * Gets current liquid of rain weather, null if not found.
     * @return {Liquid|null}
     */
    const getRainLiq = function() {
        if(!Vars.state.isGame()) return null;
        let weaState = Groups.weather.find(weaState1 => weaState1.weather instanceof RainWeather);
        if(weaState == null) return null;
        return weaState.weather.liquid;
    };
    exports.getRainLiq = getRainLiq;


    /* wind */


    /**
     * Gets current value of wind attribute at some tile.
     * Wind force is set in {@link DB_env}.
     * @param {Tile} t
     * @param {number|unset} [scl] - Scaling on oscillation.
     * @param {number|unset} [maxRed] - Max reduction as fraction.
     * @param {number|unset} [posVari] - Magnitude related to position.
     * @return {number}
     */
    const calcSumWind = function thisFun(t, scl, maxRed, posVari) {
        if(scl == null) scl = 1.0;
        if(maxRed == null) maxRed = 0.7;
        if(posVari == null) posVari = 0.0;

        let attrSum = (1.0 - Math.pow(Math.sin(Time.time / 6400.0 / scl), 2) * maxRed);
        if(thisFun.sumScl == null) {
            thisFun.sumScl = DB_env.db["param"]["map"]["wind"].read(PARAM.MAP_CURRENT, DB_env.db["param"]["pla"]["wind"].read(PARAM.PLANET_CURRENT, 1.0));
        };
        attrSum *= thisFun.sumScl * DEBUG.windMtp;
        if(t != null && attrSum > 0.0 && posVari > 0.0) {
            attrSum += Mathf.randomSeed(t.pos(), -posVari, posVari);
        };
        if(attrSum < 0.0) {
            attrSum = 0.0;
        };

        return attrSum;
    }
    .setProp({
        /**
         * @memberof calcSumWind
         * @type {number|null}
         */
        sumScl: null,
    })
    .setAnno("init", function() {
        TRIGGER.mapChange.addGlobalListener(() => {
            this.sumScl = null;
        });
    });
    exports.calcSumWind = calcSumWind;
