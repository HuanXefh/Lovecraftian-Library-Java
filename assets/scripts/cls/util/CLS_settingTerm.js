/* ----------------------------------------
 * NOTE:
 *
 * Used to register settings less randomly. See {TP_setting}.
 * ---------------------------------------- */


/* <---------- import ----------> */


const PARAM = require("lovec/glb/GLB_param");


const MDL_bundle = require("lovec/mdl/MDL_bundle");
const MDL_event = require("lovec/mdl/MDL_event");


/* <---------- meta ----------> */


const CLS_settingTerm = newClass().initClass();


CLS_settingTerm.prototype.init = function(nm, valGetter) {
  this.name = registerUniqueName(nm, insNms, "setting term");
  this.valGetter = valGetter;
  this.dialSetter = null;

  global.lovecUtil.db.settingTerm.push(nm, valGetter);
};


const insNms = [];
const categSetterArr = [];
const categSetterDebugArr = [];


MDL_event._c_onLoad(() => {
  function buildCateg(nmMod, nmCateg, terms) {
    Vars.ui.settings.addCategory(MDL_bundle._term(nmMod, "settings-" + nmCateg), tb => {
      terms.forEachFast(term => {
        if(term.dialSetter == null) return;
        term.dialSetter(tb);
      });
    });
  };

  categSetterArr.forEachRow(3, (nmMod, nmCateg, terms) => buildCateg(nmMod, nmCateg, terms));
  if(PARAM.debug) {
    categSetterDebugArr.forEachRow(3, (nmMod, nmCateg, terms) => buildCateg(nmMod, nmCateg, terms));
  };
}, 19880207);


/* <---------- static method ----------> */


var cls = CLS_settingTerm;


/* ----------------------------------------
 * NOTE:
 *
 * Call this to add a new category.
 * ---------------------------------------- */
cls.registerCategory = function(nmMod, nmCateg, isDebugCateg) {
  (isDebugCateg ? categSetterDebugArr : categSetterArr).write([nmMod, nmCateg], []);
};


/* <---------- instance method ----------> */


var ptp = CLS_settingTerm.prototype;


/* ----------------------------------------
 * NOTE:
 *
 * Used to set the {Vars.ui.settings} dialog.
 * If the method is not called, the setting won't show up there.
 * ---------------------------------------- */
ptp.setDialSetter = function thisFun(nmMod, nmCateg, tableF) {
  thisFun.tmpTup.clear().push(nmMod, nmCateg);

  let terms = categSetterDebugArr.read(thisFun.tmpTup, categSetterArr.read(thisFun.tmpTup));
  if(terms == null) throw new Error("Cannot find setting category for [$1]-[$2]!".format(nmMod, nmCateg));

  this.dialSetter = tableF;
  terms.push(this);

  return this;
}
.setProp({
  tmpTup: [],
});


module.exports = CLS_settingTerm;
