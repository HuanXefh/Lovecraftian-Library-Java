/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Anything I'm lazy to make a MDL file for.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_net = require("lovec/mdl/MDL_net");


  const DB_misc = require("lovec/db/DB_misc");


  /* <---------- input ----------> */


  let mouseMoveX = 0.0;
  let mouseMoveY = 0.0;
  let mouseMoveStartX = 0.0;
  let mouseMoveStartY = 0.0;


  /* ----------------------------------------
   * NOTE:
   *
   * Mouse movement velocity in pixels per second.
   * LMB must be pressed.
   * ---------------------------------------- */
  const _mouseVel = function() {
    return Math.sqrt(Math.pow(mouseMoveX, 2) + Math.pow(mouseMoveY, 2));
  };
  exports._mouseVel = _mouseVel;


  /* <---------- mod ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Localizes the mod stats.
   * Put {info.modname-info-mod} in your bundle.
   * ---------------------------------------- */
  const localizeModMeta = function(nmMod) {
    let mod = fetchMod(nmMod);
    if(mod == null) return;

    mod.meta.displayName = MDL_bundle._info(nmMod, "mod");
    mod.meta.description = MDL_bundle._info(nmMod, "mod", true);
  }
  .setAnno("non-headless");
  exports.localizeModMeta = localizeModMeta;


  /* ----------------------------------------
   * NOTE:
   *
   * Locks contents from some mod, for testing purpose.
   * If {cts} is given, this only locks mod contents in the array (NOT SEQ).
   * ---------------------------------------- */
  const lockModContents = function thisFun(nmMod, cts, isUnlocking) {
    if(cts != null) {
      cts.forEachFast(ct => {
        if(thisFun.checkTg(ct, nmMod)) isUnlocking ? ct.unlock() : ct.clearUnlock();
      });
      TechTree.all.each(node => cts.includes(node.content) && thisFun.checkTg(node.content, nmMod), node => node.reset());
    } else {
      thisFun.defSeqs.forEachFast(seq => seq.each(
        ct => thisFun.checkTg(ct, nmMod),
        ct => {isUnlocking ? ct.unlock() : ct.clearUnlock(); Log.info("[LOVEC] Cleared unlock state for " + ct.name.color(Pal.accent) + ".")},
      ));
      TechTree.all.each(node => thisFun.checkTg(node.content, nmMod), node => node.reset());
    };
  }
  .setProp({
    defSeqs: [
      Vars.content.items(),
      Vars.content.liquids(),
      Vars.content.blocks(),
      Vars.content.units(),
      Vars.content.statusEffects(),
      Vars.content.sectors(),
    ],
    checkTg: (ct, nmMod) => ct.minfo.mod != null && ct.minfo.mod.name === nmMod,
  })
  .setAnno("debug");
  exports.lockModContents = lockModContents;


/*
  ========================================
  Section: Application
  ========================================
*/


  MDL_event._c_onDrag((dx, dy, x_f, y_f) => {
    mouseMoveX = dx;
    mouseMoveY = dy;
    mouseMoveStartX = x_f;
    mouseMoveStartY = y_f;
  }, 42885962);
