/*
  ========================================
  Section: Definition
  ========================================
*/


  /**
   * Use to register settings, see {@link TP_setting}.
   * @class
   * @param {string} name
   * @param {function(boolean): void} valF - `ARGS`: useScl.
   */
  const CLS_settingTerm = newClass().initClass();


  CLS_settingTerm.prototype.init = function(name, valF) {
    this.name = registerUniqueName(name, insNames, "setting term");
    this.valF = valF;
    this.dialM = null;

    global.lovecUtil.db.settingTerm.push(name, this);
  };


  const insNames = [];
  const categMArr = [];
  const categMDebugArr = [];


  MDL_event.onLoad(() => {
    function buildCateg(nameMod, nameCateg, terms) {
      Vars.ui.settings.addCategory(MDL_bundle.getTerm(nameMod, "settings-" + nameCateg), tb => {
        terms.forEachCond(term => term.dialM != null, term => term.dialM(tb), true);
      });
    };

    categMArr.forEachRow(3, (nameMod, nameCateg, terms) => buildCateg(nameMod, nameCateg, terms), true);
    if(global.lovecUtil.prop.debug) {
      categMDebugArr.forEachRow(3, (nameMod, nameCateg, terms) => buildCateg(nameMod, nameCateg, terms), true);
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
   * <br> `BUNDLE`: "term.<nameMod>-term-settings-<nameCateg>.name".
   * @param {string} nameMod
   * @param {string} nameCateg
   * @param {boolean|unset} [isDebugCateg] - If true, this category is shown only in debug mode.
   * @return {void}
   */
  CLS_settingTerm.registerCategory = function(nameMod, nameCateg, isDebugCateg) {
    (isDebugCateg ? categMDebugArr : categMArr).write([nameMod, nameCateg], []);
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
    return this.valF(useScl);
  };


  /**
   * Used to set setting dialog.
   * If this method is not called, this setting won't show up there.
   * @param {string} nameMod
   * @param {string} nameCateg
   * @param {function(Table): void} tableM
   * @return {this}
   */
  CLS_settingTerm.prototype.setDialM = function thisFun(nameMod, nameCateg, tableM) {
    thisFun.tmpTup.with(nameMod, nameCateg);

    let terms = categMDebugArr.read(thisFun.tmpTup, categMArr.read(thisFun.tmpTup));
    if(terms == null) throw new Error("Cannot find setting category for ${1}-${2}!".format(nameMod, nameCateg));

    this.dialM = tableM;
    terms.push(this);

    return this;
  }
  .setProp({
    tmpTup: [],
  });




module.exports = CLS_settingTerm;
