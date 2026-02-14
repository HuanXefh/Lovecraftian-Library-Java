/* ----------------------------------------
 * NOTE:
 *
 * The Lovec version of {Achievement}.
 * Achievements should be created on CLIENT LOAD, and not on headless end.
 * See {TP_achievement} in ProjReind.
 * ---------------------------------------- */


/* <---------- import ----------> */


const VARGEN = require("lovec/glb/GLB_varGen");


const MDL_bundle = require("lovec/mdl/MDL_bundle");
const MDL_ui = require("lovec/mdl/MDL_ui");


/* <---------- meta ----------> */


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


/* ----------------------------------------
 * NOTE:
 *
 * Clears all completed achievements.
 * ---------------------------------------- */
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


/* ----------------------------------------
 * NOTE:
 *
 * Returns mod of this achievement.
 * ---------------------------------------- */
ptp.getMod = function() {
  return fetchMod(this.mod);
};


/* ----------------------------------------
 * NOTE:
 *
 * Variant of {getHeader} called by instances.
 * ---------------------------------------- */
ptp.getHeader = function() {
  return this.name;
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns icon used by this achievement (as drawable texture region).
 * ---------------------------------------- */
ptp.getIcon = function() {
  return this.icon;
},


/* ----------------------------------------
 * NOTE:
 *
 * Returns text description of this achievement.
 * ---------------------------------------- */
ptp.getText = function() {
  return MDL_bundle._info("common", "achieve-" + this.name);
},


/* ----------------------------------------
 * NOTE:
 *
 * Whether this achievement has been completed.
 * ---------------------------------------- */
ptp.isCompleted = function() {
  return Vars.headless ?
    false :
    Core.settings.getBool(this.getHeader(), false);
};


/* ----------------------------------------
 * NOTE:
 *
 * Completes this achievement.
 * ---------------------------------------- */
ptp.complete = function() {
  if(Vars.headless || this.isCompleted()) return;

  Core.settings.put(this.getHeader(), true);
  MDL_ui.show_toast("common", "achieve-" + this.name, this.icon, 80.0);
}
.setAnno("non-console");


module.exports = CLS_achievement;
