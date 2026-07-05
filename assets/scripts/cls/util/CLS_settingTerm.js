/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- meta ----------> */


  /**
   * Use to register settings, see {@link TP_setting}.
   * @class
   * @param {string} name
   * @param {function(boolean): void} valGetter - <ARGS>: useScl.
   */
  const CLS_settingTerm = newClass().initClass();


  CLS_settingTerm.prototype.init = function(name, valGetter) {
    this.name = registerUniqueName(name, insNames, "setting term");
    this.valGetter = valGetter;
    this.dialSetter = null;

    global.lovecUtil.db.settingTerm.push(name, this);
  };


  const insNames = [];
  const categSetterArr = [];
  const categSetterDebugArr = [];


  MDL_event._c_onLoad(() => {
    function buildCateg(nameMod, nameCateg, terms) {
      Vars.ui.settings.addCategory(MDL_bundle._term(nameMod, "settings-" + nameCateg), tb => {
        terms.forEachCond(term => term.dialSetter != null, term => term.dialSetter(tb));
      });
    };

    categSetterArr.forEachRow(3, (nameMod, nameCateg, terms) => buildCateg(nameMod, nameCateg, terms));
    if(global.lovecUtil.prop.debug) {
      categSetterDebugArr.forEachRow(3, (nameMod, nameCateg, terms) => buildCateg(nameMod, nameCateg, terms));
    };
  });


/*
  ========================================
  Section: Definition (Static)
  ========================================
*/


  /* <------------------------------ util ------------------------------ */


  /**
   * Registers a new setting category, which will be displayed in setting dialog.
   * <br> <BUNDLE>: "term.<nameMod>-term-settings-<nameCateg>.name".
   * @param {string} nameMod
   * @param {string} nameCateg
   * @param {boolean|unset} [isDebugCateg] - If true, this category is shown only in debug mode.
   * @return {void}
   */
  CLS_settingTerm.registerCategory = function(nameMod, nameCateg, isDebugCateg) {
    (isDebugCateg ? categSetterDebugArr : categSetterArr).write([nameMod, nameCateg], []);
  };


/*
  ========================================
  Section: Definition (Instance)
  ========================================
*/


  /* <------------------------------ util ------------------------------ */


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
   * @param {string} nameMod
   * @param {string} nameCateg
   * @param {function(Table): void} tableF
   * @return {this}
   */
  CLS_settingTerm.prototype.setDialSetter = function thisFun(nameMod, nameCateg, tableF) {
    thisFun.tmpTup.with(nameMod, nameCateg);

    let terms = categSetterDebugArr.read(thisFun.tmpTup, categSetterArr.read(thisFun.tmpTup));
    if(terms == null) throw new Error("Cannot find setting category for ${1}-${2}!".format(nameMod, nameCateg));

    this.dialSetter = tableF;
    terms.push(this);

    return this;
  }
  .setProp({
    tmpTup: [],
  });




module.exports = CLS_settingTerm;
