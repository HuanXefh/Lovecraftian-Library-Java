/* <---------- import ----------> */


/* <---------- meta ----------> */


/**
 * Lovec achievement.
 * Achievements should be created on CLIENT LOAD and not on headless end.
 * See {@link TP_achievement} in ProjReind for examples.
 * @class
 * @param {string} nmMod
 * @param {string} nm
 * @param {TextureRegionDrawable} icon
 * @param {CLS_eventTrigger} trigger - Trigger used to check state of the achievement.
 * @param {Function|unset} [listener] - Complete the achievement here. If not set, the achievement will be completed when trigger is fired.
 */
const CLS_achievement = newClass().initClass();


CLS_achievement.prototype.init = function(nmMod, nm, icon, trigger, listener) {
  const thisIns = this;

  if(fetchMod(nmMod, true) == null) ERROR_HANDLER.throw("noModFound", nmMod);
  this.name = nmMod + "-" + registerUniqueName(nm, insNms, "achievement");
  this.mod = nmMod;

  this.icon = tryVal(icon, VARGEN.icons.ohno);
  listener == null ?
    trigger.addGlobalListener(() => this.complete()) :
    trigger.addGlobalListener(function() {listener.apply(thisIns, arguments)});

  VARGEN.achievements.push(this);
};


const insNms = [];


/* <---------- static method ----------> */


var cls = CLS_achievement;


/**
 * Clears all completed achievements.
 * @return {void}
 */
cls.clear = function() {
  if(Vars.headless) return;

  VARGEN.achievements.forEachFast(achievement => {
    Core.settings.put(achievement.getHeader(), false);
  });
  Core.settings.put("lovec-misc-secret-code-crashed", false);
  Log.info("[LOVEC] Lovec achievement data has been [$1].".format("cleared".color(Pal.remove)));
}
.setAnno("debug");


/* <---------- instance method ----------> */


var ptp = CLS_achievement.prototype;


/**
 * Gets mod of this achievement.
 * @return {Mod}
 */
ptp.getMod = function() {
  return fetchMod(this.mod);
};


/**
 * Gets header of this achievement.
 * @return {string}
 */
ptp.getHeader = function() {
  return this.name;
};


/**
 * Gets icon used by this achievement.
 * @return {TextureRegionDrawable}
 */
ptp.getIcon = function() {
  return this.icon;
};


/**
 * Gets text description of this achievement.
 * <br> <BUNDLE>: "info.common-info-achieve-<nmMod>-<nm>".
 * @return {string}
 */
ptp.getText = function() {
  return MDL_bundle._info("common", "achieve-" + this.name);
};


/**
 * Whether this achievement has been completed.
 * @return {boolean}
 */
ptp.isCompleted = function() {
  return Vars.headless ?
    false :
    Core.settings.getBool(this.getHeader(), false);
};


/**
 * Completes this achievement.
 * @return {void}
 */
ptp.complete = function() {
  if(Vars.headless || this.isCompleted()) return;

  Core.settings.put(this.getHeader(), true);
  MDL_ui.show_toast("common", "achieve-" + this.name, this.icon, 80.0);
}
.setAnno("non-console");


module.exports = CLS_achievement;
