/* ----------------------------------------
 * NOTE:
 *
 * Utility class for automatic recipe generation.
 * ---------------------------------------- */


/* <---------- import ----------> */


const MDL_content = require("lovec/mdl/MDL_content");
const MDL_event = require("lovec/mdl/MDL_event");
const MDL_recipe = require("lovec/mdl/MDL_recipe");


/* <---------- meta ----------> */


const CLS_recipeGenerator = newClass().initClass();


/* ----------------------------------------
 * NOTE:
 *
 * {setter} is used to write some recipe object.
 * {this} in the setter function refers to the recipe generator.
 * Format for {setter}: {(rcObj, paramObj) => {...}}.
 * ---------------------------------------- */
CLS_recipeGenerator.prototype.init = function(setter) {
  this.setter = tryVal(setter, Function.air);
};


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


var ptp = CLS_recipeGenerator.prototype;


/* ----------------------------------------
 * NOTE:
 *
 * Returns the standard generated header name for some recipe.
 * ---------------------------------------- */
ptp.getHeaderName = function(nmCt, categ, tag) {
  return tryVal(categ, "uncategorized").toUpperCase() + ": <[$1][$2]>".format(nmCt, tag == null ? "" : " ([$1])".format(tag));
};


/* ----------------------------------------
 * NOTE:
 *
 * Adds recipe to the recipe object.
 * Any recipe added by this method will be tagged as GENERATED.
 *
 * Use {CLS_recipeBuilder} to modify the I/O fields (obtain the builder object).
 * ---------------------------------------- */
ptp.addRc = function(rc, nmCt, categ, tag, objF, rcBuilderObj) {
  let rcObj = {
    icon: nmCt,
    category: categ,
    isGenerated: true,
  };
  if(rcBuilderObj != null) {
    Object.cloneProp(rcObj, rcBuilderObj);
  };
  if(objF != null) {
    objF(rcObj);
  };

  rc["recipe"].push(this.getHeaderName(nmCt, categ, tag), rcObj);
};


/* ----------------------------------------
 * NOTE:
 *
 * Used by some generators for better control.
 * ---------------------------------------- */
ptp.setBaseParam = function(rcObj, paramObj) {
  readParamAndCall(paramObj, "validGetter", val => rcObj.validGetter = val);
  readParamAndCall(paramObj, "lockedBy", val => rcObj.lockedBy = val);
  readParamAndCall(paramObj, "timeScl", val => rcObj.timeScl = val);
  readParamAndCall(paramObj, "pollution", val => rcObj.pollution = val);
  readParamAndCall(paramObj, "ignoreItemFullness", val => rcObj.ignoreItemFullness = val);
  readParamAndCall(paramObj, "attr", val => rcObj.attr = val);
  readParamAndCall(paramObj, "attrMin", val => rcObj.attrMin = val);
  readParamAndCall(paramObj, "attrMax", val => rcObj.attrMax = val);
  readParamAndCall(paramObj, "attrBoostScl", val => rcObj.attrBoostScl = val);
  readParamAndCall(paramObj, "attrBoostCap", val => rcObj.attrBoostCap = val);
  readParamAndCall(paramObj, "tooltip", val => rcObj.tooltip = val);
  readParamAndCall(paramObj, "tempReq", val => rcObj.tempReq = val);
  readParamAndCall(paramObj, "tempAllowed", val => rcObj.tempAllowed = val);
};


/* ----------------------------------------
 * NOTE:
 *
 * Used to set up CI.
 * ---------------------------------------- */
ptp.processCi = function(ct_gn, amtI, paramObj) {
  return [
    ct_gn instanceof UnlockableContent ? ct_gn.name : ct_gn,
    readParam(paramObj, "amtI", amtI * readParam(paramObj, "amtIScl", 1.0)),
  ];
};


/* ----------------------------------------
 * NOTE:
 *
 * Used to set up BI.
 * ---------------------------------------- */
ptp.processBi = function(ct_gn, amtI, pI, paramObj) {
  return [
    ct_gn instanceof UnlockableContent ? ct_gn.name : ct_gn,
    readParam(paramObj, "amtI", Math.round(amtI * readParam(paramObj, "amtIScl", 1.0))),
    pI,
  ];
};


/* ----------------------------------------
 * NOTE:
 *
 * Used to set up PAYI.
 * ---------------------------------------- */
ptp.processPayi = function(ct_gn, payAmtI, paramObj) {
  return [
    ct_gn instanceof UnlockableContent ? ct_gn.name : ct_gn,
    readParam(paramObj, "payAmtI", Math.round(payAmtI * readParam(paramObj, "amtIScl", 1.0))),
  ];
};


/* ----------------------------------------
 * NOTE:
 *
 * Used to set up CO.
 * ---------------------------------------- */
ptp.processCo = function(ct_gn, amtO, paramObj) {
  return [
    ct_gn instanceof UnlockableContent ? ct_gn.name : ct_gn,
    readParam(paramObj, "amtO", amtO * readParam(paramObj, "amtOScl", 1.0)),
  ];
};


/* ----------------------------------------
 * NOTE:
 *
 * Used to set up BO.
 * ---------------------------------------- */
ptp.processBo = function(ct_gn, amtO, pO, paramObj) {
  return [
    ct_gn instanceof UnlockableContent ? ct_gn.name : ct_gn,
    readParam(paramObj, "amtO", Math.round(amtO * readParam(paramObj, "amtOScl", 1.0))),
    pO,
  ];
};


/* ----------------------------------------
 * NOTE:
 *
 * Used to set up PAYO.
 * ---------------------------------------- */
ptp.processPayo = function(ct_gn, payAmtO, paramObj) {
  return [
    ct_gn instanceof UnlockableContent ? ct_gn.name : ct_gn,
    readParam(paramObj, "payAmtO", Math.round(payAmtO * readParam(paramObj, "amtOScl", 1.0))),
  ];
};


/* ----------------------------------------
 * NOTE:
 *
 * Parses a raw I/O array.
 * ---------------------------------------- */
ptp.parseRawIo = function thisFun(raw, baseAmt, isContinuous) {
  const arr = [];

  let tmpArr = raw.cpy();
  thisFun.convertFrac.apply(this, [tmpArr, baseAmt, isContinuous]);
  tmpArr.forEachRow(isContinuous ? 2 : 3, (tg, amt, p) => {
    MDL_recipe.parseRcIoRow(arr, tg, amt, isContinuous ? null : p, null);
  });
  arr.forEachAll((ele, ind, arr1) => {
    if(ele instanceof UnlockableContent) arr1[ind] = ele.name;
  });

  return arr;
}
.setProp({
  convertFrac: function(arr, baseAmt, isContinuous) {
    let i = 0, iCap = arr.iCap();
    while(i < iCap) {
      if(arr[i] instanceof Array) {
        this.parseRawIo.convertFrac(arr[i], baseAmt, isContinuous);
      } else {
        arr[i + 1] = isContinuous ?
          (baseAmt * arr[i + 1]) :
          Math.round(baseAmt * arr[i + 1] * (1.0 / arr[i + 2]));
      };
      i += isContinuous ? 2 : 3;
    };
  },
});


/* ----------------------------------------
 * NOTE:
 *
 * Parses raw CI data, returns the array used in recipe object.
 * ---------------------------------------- */
ptp.parseRawCi = function(rawCi, amtO) {
  return this.parseRawIo(rawCi, amtO, true);
};


/* ----------------------------------------
 * NOTE:
 *
 * Parses raw BI data, returns the array used in recipe object.
 * ---------------------------------------- */
ptp.parseRawBi = function(rawBi, amtO, pO) {
  return this.parseRawIo(rawBi, amtO * pO, false);
};


/* ----------------------------------------
 * NOTE:
 *
 * Parses raw PAYI data, returns the array used in recipe object.
 * ---------------------------------------- */
ptp.parseRawPayi = function(rawPayi, payAmtO) {
  return this.parseRawIo(rawPayi, payAmtO, true);
};


/* ----------------------------------------
 * NOTE:
 *
 * Parses raw CO data, returns the array used in recipe object.
 * ---------------------------------------- */
ptp.parseRawCo = function(rawCo, amtI) {
  return this.parseRawIo(rawCo, amtI, true);
};


/* ----------------------------------------
 * NOTE:
 *
 * Parses raw BO data, returns the array used in recipe object.
 * ---------------------------------------- */
ptp.parseRawBo = function(rawBo, amtI, pI) {
  return this.parseRawIo(rawBo, amtI * pI, false);
};


/* ----------------------------------------
 * NOTE:
 *
 * Modifies {rc} on CLIENT LOAD.
 * ---------------------------------------- */
ptp.run = function(rc, paramObj) {
  MDL_event._c_onLoad(() => {
    this.setter(rc, paramObj);
  });
};



module.exports = CLS_recipeGenerator;
