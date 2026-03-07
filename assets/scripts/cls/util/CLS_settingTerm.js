/* <---------- import ----------> */


/* <---------- meta ----------> */


/**
 * Use to register settings, see {@link TP_setting}.
 * @class
 * @param {string} nm
 * @param {function(boolean): void} valGetter - <ARGS>: useScl.
 */
const CLS_settingTerm = newClass().initClass();


CLS_settingTerm.prototype.init = function(nm, valGetter) {
  this.name = registerUniqueName(nm, insNms, "setting term");
  this.valGetter = valGetter;
  this.dialSetter = null;

  global.lovecUtil.db.settingTerm.push(nm, this);
};


const insNms = [];
const categSetterArr = [];
const categSetterDebugArr = [];


MDL_event._c_onLoad(() => {
  function buildCateg(nmMod, nmCateg, terms) {
    Vars.ui.settings.addCategory(MDL_bundle._term(nmMod, "settings-" + nmCateg), tb => {
      terms.forEachCond(term => term.dialSetter != null, term => term.dialSetter(tb));
    });
  };

  categSetterArr.forEachRow(3, (nmMod, nmCateg, terms) => buildCateg(nmMod, nmCateg, terms));
  if(global.lovecUtil.prop.debug) {
    categSetterDebugArr.forEachRow(3, (nmMod, nmCateg, terms) => buildCateg(nmMod, nmCateg, terms));
  };
}, 19880207);


/* <---------- static method ----------> */


/**
 * Registers a new setting category, which will be displayed in setting dialog.
 * <br> <BUNDLE>: "term.<nmMod>-term-settings-<nmCateg>.name".
 * @param {string} nmMod
 * @param {string} nmCateg
 * @param {boolean|unset} [isDebugCateg] - If true, this category is shown only in debug mode.
 * @return {void}
 */
CLS_settingTerm.registerCategory = function(nmMod, nmCateg, isDebugCateg) {
  (isDebugCateg ? categSetterDebugArr : categSetterArr).write([nmMod, nmCateg], []);
};


/* <---------- instance method ----------> */


/**
 * Gets value of this setting.
 * @param {boolean|unset} [useScl] - Whether the result should be scaled.
 * @return {any}
 */
CLS_settingTerm.prototype.get = function(useScl) {
  return this.valGetter(useScl);
};


/**
 * Used to set setting dialog.
 * If this method is not called, this setting won't show up there.
 * @param {string} nmMod
 * @param {string} nmCateg
 * @param {function(Table): void} tableF
 * @return {this}
 */
CLS_settingTerm.prototype.setDialSetter = function thisFun(nmMod, nmCateg, tableF) {
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
