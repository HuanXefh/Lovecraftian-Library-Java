/* <---------- import ----------> */


/* <---------- meta ----------> */


/**
 * Utility class to generate raw data (as array) for {@link newDialogFlow}.
 */
const CLS_dialogFlowBuilder = newClass().initClass();


CLS_dialogFlowBuilder.prototype.init = function() {
  this.dialFlowData = [];
  this.offInd = 0;
  this.hasBackground = false;
  this.hasMusic = false;
  this.isBuilt = false;
};


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


/**
 * Completes a row.
 * @return {this}
 */
CLS_dialogFlowBuilder.prototype.completeRow = function() {
  let remainder = this.dialFlowData.length % 4;
  if(remainder === 0) return this;
  if(remainder <= 3) {
    this.dialFlowData.push(null);
  };
  if(remainder <= 2) {
    this.dialFlowData.push(null);
  };
  if(remainder <= 1) {
    this.dialFlowData.push(null);
  };
  this.offInd = 0;

  return this;
};


/**
 * Ensures `paramObj` in current row is not null.
 * Returns `paramObj`.
 * @return {Object}
 */
CLS_dialogFlowBuilder.prototype.fixParamObj = function() {
  let paramObj = this.dialFlowData[this.dialFlowData.length - 2];
  if(paramObj == null) {
    this.dialFlowData[this.dialFlowData.length - 2] = {};
    paramObj = this.dialFlowData[this.dialFlowData.length - 2];
  };

  return paramObj;
};


/**
 * Adds a row for color transition, by default black fade.
 * @param {Color|unset} [color]
 * @param {number|unset} [inTimeS]
 * @param {number|unset} [outTimeS]
 * @param {number|unset} [susTimeS]
 * @return {this}
 */
CLS_dialogFlowBuilder.prototype.setColorTransition = function(color, inTimeS, outTimeS, susTimeS) {
  if(color == null) color = Color.black;
  if(inTimeS == null) inTimeS = 1.0;
  if(outTimeS == null) outTimeS = inTimeS;
  if(susTimeS == null) susTimeS = 0.5;

  this.completeRow();

  this.dialFlowData.push(
    null, null,
    {
      haltTimeS: inTimeS + outTimeS + susTimeS,
      scr: () => MDL_ui._d_fade(0.0, color, inTimeS, outTimeS, susTimeS),
    },
  );
  this.offInd = 3;

  return this;
};


/**
 * Adds a row for background start.
 * @param {string} nmBg
 * @return {this}
 */
CLS_dialogFlowBuilder.prototype.setBackgroundStart = function(nmBg) {
  this.completeRow();

  this.dialFlowData.push(
    null, null,
    {
      haltTimeS: 0.0,
      scr: () => {
        TRIGGER_BACKGROUND = true;
        MDL_ui._d_bg(0.0, nmBg, () => !TRIGGER_BACKGROUND);
      },
    },
  );
  this.offInd = 3;
  this.hasBackground = true;

  return this;
};


/**
 * Adds a row for background end.
 * @return {this}
 */
CLS_dialogFlowBuilder.prototype.setBackgroundEnd = function() {
  this.completeRow();

  this.dialFlowData.push(
    null, null,
    {
      haltTimeS: 0.0,
      scr: () => TRIGGER_BACKGROUND = false,
    },
  );
  this.offInd = 3;
  this.hasBackground = false;

  return this;
};


/**
 * Adds a row for BGM start.
 * @param {MusicGn} mus_gn
 * @return {this}
 */
CLS_dialogFlowBuilder.prototype.setBgmStart = function(mus_gn) {
  this.completeRow();

  this.dialFlowData.push(
    null, null,
    {
      haltTimeS: 0.0,
      scr: () => {
        TRIGGER_MUSIC = true;
        MDL_ui._d_bgm(0.0, mus_gn, () => !TRIGGER_MUSIC);
      },
    },
  );
  this.offInd = 3;
  this.hasMusic = true;

  return this;
};


/**
 * Adds a row for BGM end.
 * @return {this}
 */
CLS_dialogFlowBuilder.prototype.setBgmEnd = function() {
  this.completeRow();

  this.dialFlowData.push(
    null, null,
    {
      haltTimeS: 0.0,
      scr: () => TRIGGER_MUSIC = false,
    },
  );
  this.offInd = 3;
  this.hasMusic = false;

  return this;
};


/**
 * Adds dialog text to current row.
 * @param {string} nmMod
 * @param {string} nmDial
 * @param {number|string} ind
 * @return {this}
 */
CLS_dialogFlowBuilder.prototype.setText = function(nmMod, nmDial, ind) {
  this.completeRow();

  this.dialFlowData.push([nmMod, nmDial, ind]);
  this.offInd = 1;

  return this;
};


/**
 * Adds speaker text to current row.
 * Should be called after {@link CLS_dialogFlowBuilder#setText}.
 * @param {string} nmMod
 * @param {string} nmChara
 * @return {this}
 */
CLS_dialogFlowBuilder.prototype.setSpeaker = function(nmMod, nmChara) {
  if(this.offInd !== 1) ERROR_HANDLER.throw("dialogFlowGenerateFail");

  this.dialFlowData.push([nmMod, nmChara]);
  this.offInd = 2;

  return this;
};


/**
 * Adds `paramObj` to current row.
 * Should be called before {@link CLS_dialogFlowBuilder#setChara}.
 * @param {Object} obj
 * @return {this}
 */
CLS_dialogFlowBuilder.prototype.setParamObj = function(obj) {
  if(this.offInd === 0) {
    this.dialFlowData.push(null, null);
  } else if(this.offInd === 1) {
    this.dialFlowData.push(null);
  } else if(this.offInd !== 2) {
    ERROR_HANDLER.throw("dialogFlowGenerateFail");
  };

  this.dialFlowData.push(obj);
  this.offInd = 3;

  return this;
};


/**
 * Adds character arts to current row.
 * This method always completes the row.
 * @param {Object|Array<Object>} charaObjs_p
 * @return {this}
 */
CLS_dialogFlowBuilder.prototype.setChara = function(charaObjs_p) {
  const arr = [];

  if(this.offInd === 0) {
    this.dialFlowData.push(null, null, null);
  } else if(this.offInd === 1) {
    this.dialFlowData.push(null, null);
  } else if(this.offInd === 2) {
    this.dialFlowData.push(null);
  };

  let charaObjs = charaObjs_p instanceof Array ? charaObjs_p : [charaObjs_p];
  charaObjs.forEachFast(charaObj => {
    arr.push([
      0.0,
      readParam(charaObj, "nmMod"),
      readParam(charaObj, "nmChara"),
      readParam(charaObj, "fracX"),
      readParam(charaObj, "isDark", readParam(charaObj, "color")),
      readParam(charaObj, "anim"),
      readParam(charaObj, "animParam"),
      readParam(charaObj, "customActs"),
    ]);
  });

  this.dialFlowData.push(arr);
  this.offInd = 0;

  return this;
};


/**
 * Adds useless selections to current row.
 * This method always completes the row.
 * @param {Array} selTextParamArr - <ROW>: nmMod, nmDial, selInd.
 * @param {number|unset} [w]
 * @param {number|unset} [h]
 * @param {number|unset} [waitTimeS]
 * @return {this}
 */
CLS_dialogFlowBuilder.prototype.setUselessSelections = function(selTextParamArr, w, h, waitTimeS) {
  if(waitTimeS == null) waitTimeS = 1.0;

  const texts = [];
  selTextParamArr.forEachRow(3, (nmMod, nmDial, selInd) => texts.push(MDL_bundle._dialSelText(nmMod, nmDial, selInd)));

  this.completeRow();
  let paramObj = this.fixParamObj();
  let callFlow = () => MDL_ui._d_flow.callNext(this.dialFlowData);
  let textScrArr = [];
  (texts.length)._it(i => {
    textScrArr.push(texts[i], callFlow);
  });

  paramObj.selectionScr = () => MDL_ui._d_selection(waitTimeS, textScrArr, w, h);

  return this;
};


/**
 * Completes the builder and returns the dialog flow data.
 * @return {DialogFlowData}
 */
CLS_dialogFlowBuilder.prototype.build = function() {
  if(this.isBuilt) ERROR_HANDLER.throw("dialogFlowDoubleBuild");
  if(this.hasBackground) ERROR_HANDLER.throw("dialogFlowMissingBackgroundEnd");
  if(this.hasMusic) ERROR_HANDLER.throw("dialogFlowMissingMusicEnd");
  this.isBuilt = true;

  // Set up the final row
  this.dialFlowData[this.dialFlowData.length - 2] = tryVal(this.dialFlowData[this.dialFlowData.length - 2], {});
  this.dialFlowData[this.dialFlowData.length - 2].isTail = true;

  return this.dialFlowData;
};


module.exports = CLS_dialogFlowBuilder;
