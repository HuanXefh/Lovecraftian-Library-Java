/* ----------------------------------------
 * NOTE:
 *
 * Utility class to generate raw data (as array) for {newDialogFlow} method. See {TP_dialFlow}.
 * ---------------------------------------- */


/* <---------- import ----------> */


const MDL_bundle = require("lovec/mdl/MDL_bundle");
const MDL_color = require("lovec/mdl/MDL_color");
const MDL_ui = require("lovec/mdl/MDL_ui");


/* <---------- meta ----------> */


const CLS_dialogFlowBuilder = newClass().initClass();


CLS_dialogFlowBuilder.prototype.init = function() {
  this.dialFlowArr = [];
  this.offInd = 0;
  this.hasBackground = false;
  this.hasMusic = false;
  this.isBuilt = false;
};


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


var ptp = CLS_dialogFlowBuilder.prototype;


/* ----------------------------------------
 * NOTE:
 *
 * Completes a row.
 * ---------------------------------------- */
ptp.fixArrFormat = function() {
  let remainder = this.dialFlowArr.length % 4;
  if(remainder === 0) return this;
  if(remainder <= 3) {
    this.dialFlowArr.push(null);
  };
  if(remainder <= 2) {
    this.dialFlowArr.push(null);
  };
  if(remainder <= 1) {
    this.dialFlowArr.push(null);
  };
  this.offInd = 0;

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Call this to ensure {paramObj} in a row is not {null}.
 * ---------------------------------------- */
ptp.fixParamObj = function() {
  let paramObj = this.dialFlowArr[this.dialFlowArr.length - 2];
  if(paramObj == null) {
    this.dialFlowArr[this.dialFlowArr.length - 2] = {};
    paramObj = this.dialFlowArr[this.dialFlowArr.length - 2];
  };

  return paramObj;
};


/* ----------------------------------------
 * NOTE:
 *
 * Pushes a color transition row, by default black fade.
 * ---------------------------------------- */
ptp.setColorTransition = function(color_gn, inTimeS, outTimeS, susTimeS) {
  if(inTimeS == null) inTimeS = 1.0;
  if(outTimeS == null) outTimeS = inTimeS;
  if(susTimeS == null) susTimeS = 0.5;
  let color = MDL_color._color(tryVal(color_gn, Color.black));

  this.fixArrFormat();

  this.dialFlowArr.push(
    null, null,
    {
      haltTimeS: inTimeS + outTimeS + susTimeS,
      scr: () => global.lovec.mdl_ui._d_fade(0.0, color, inTimeS, outTimeS, susTimeS),
    },
  );
  this.offInd = 3;

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Pushes a background change row.
 * ---------------------------------------- */
ptp.setBackgroundStart = function(nmBg) {
  this.fixArrFormat();

  this.dialFlowArr.push(
    null, null,
    {
      haltTimeS: 0.0,
      scr: () => {
        TRIGGER_BACKGROUND = true;
        global.lovec.mdl_ui._d_bg(0.0, nmBg, () => !TRIGGER_BACKGROUND);
      },
    },
  );
  this.offInd = 3;
  this.hasBackground = true;

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Pushes a background end row.
 * This is required if background has been changed.
 * ---------------------------------------- */
ptp.setBackgroundEnd = function() {
  this.fixArrFormat();

  this.dialFlowArr.push(
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


/* ----------------------------------------
 * NOTE:
 *
 * Pushes a BGM change row.
 * ---------------------------------------- */
ptp.setBgmStart = function(mus) {
  this.fixArrFormat();

  this.dialFlowArr.push(
    null, null,
    {
      haltTimeS: 0.0,
      scr: () => {
        TRIGGER_MUSIC = true;
        global.lovec.mdl_ui._d_bgm(0.0, mus, () => !TRIGGER_MUSIC);
      },
    },
  );
  this.offInd = 3;
  this.hasMusic = true;

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Pushes a BGM end row.
 * This is required if BGM has been changed.
 * ---------------------------------------- */
ptp.setBgmEnd = function() {
  this.fixArrFormat();

  this.dialFlowArr.push(
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


/* ----------------------------------------
 * NOTE:
 *
 * Pushes dialog text data.
 * ---------------------------------------- */
ptp.setText = function(nmMod, nmDial, ind) {
  this.fixArrFormat();

  this.dialFlowArr.push([nmMod, nmDial, ind]);
  this.offInd = 1;

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Pushes dialog speaker data.
 * Just after {setText}.
 * ---------------------------------------- */
ptp.setSpeaker = function(nmMod, nmChara) {
  if(this.offInd !== 1) ERROR_HANDLER.throw("dialogFlowGenerateFail");

  this.dialFlowArr.push([nmMod, nmChara]);
  this.offInd = 2;

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Pushes parameter object data.
 * Should be called before pushing characters.
 * ---------------------------------------- */
ptp.setParamObj = function(obj) {
  if(this.offInd === 0) {
    this.dialFlowArr.push(null, null);
  } else if(this.offInd === 1) {
    this.dialFlowArr.push(null);
  } else if(this.offInd !== 2) {
    ERROR_HANDLER.throw("dialogFlowGenerateFail");
  };

  this.dialFlowArr.push(obj);
  this.offInd = 3;

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Pushes character data.
 * This always ends the row.
 * ---------------------------------------- */
ptp.setChara = function(charaObjs_p) {
  const arr = [];

  if(this.offInd === 0) {
    this.dialFlowArr.push(null, null, null);
  } else if(this.offInd === 1) {
    this.dialFlowArr.push(null, null);
  } else if(this.offInd === 2) {
    this.dialFlowArr.push(null);
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

  this.dialFlowArr.push(arr);
  this.offInd = 0;

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Pushes selections that don't affect how things go, usually used to display words spoken by the main character.
 * This always ends the row.
 *
 * Format for {selTextParamArr}: {nmMod, nmDial, selInd}.
 * ---------------------------------------- */
ptp.setUselessSelections = function(selTextParamArr, w, h, waitTimeS) {
  if(waitTimeS == null) waitTimeS = 1.25;

  const texts = [];
  selTextParamArr.forEachRow(3, (nmMod, nmDial, selInd) => texts.push(MDL_bundle._dialSelText(nmMod, nmDial, selInd)));

  this.fixArrFormat();
  let paramObj = this.fixParamObj();
  let callFlow = () => MDL_ui._d_flow.callNext(this.dialFlowArr);
  let textScrArr = [];
  (texts.length)._it(1, i => {
    textScrArr.push(texts[i], callFlow);
  });

  paramObj.selectionScr = () => MDL_ui._d_selection(waitTimeS, textScrArr, w, h);

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Completes and returns the dialog flow data array.
 * ---------------------------------------- */
ptp.build = function() {
  if(this.isBuilt) ERROR_HANDLER.throw("dialogFlowDoubleBuild");
  if(this.hasBackground) ERROR_HANDLER.throw("dialogFlowMissingBackgroundEnd");
  if(this.hasMusic) ERROR_HANDLER.throw("dialogFlowMissingMusicEnd");
  this.isBuilt = true;

  // Set up the final row
  this.dialFlowArr[this.dialFlowArr.length - 2] = tryVal(this.dialFlowArr[this.dialFlowArr.length - 2], {});
  this.dialFlowArr[this.dialFlowArr.length - 2].isTail = true;

  return this.dialFlowArr;
};


module.exports = CLS_dialogFlowBuilder;
