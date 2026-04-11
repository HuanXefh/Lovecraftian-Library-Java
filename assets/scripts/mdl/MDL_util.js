/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Anything that I'm too lazy to make a MDL file for.
   * @module lovec/mdl/MDL_util
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- input ----------> */


  let mouseMoveX = 0.0;
  let mouseMoveY = 0.0;
  let mouseMoveStartX = 0.0;
  let mouseMoveStartY = 0.0;


  /**
   * Mouse movement velocity in pixels per second.
   * LMB must be pressed.
   * @return {number}
   */
  const _mouseVel = function() {
    return Math.sqrt(Math.pow(mouseMoveX, 2) + Math.pow(mouseMoveY, 2));
  };
  exports._mouseVel = _mouseVel;


  /* <---------- mod ----------> */


  /**
   * Localizes mod stats.
   * Put "info.<nmMod>-info-mod" in your bundle.
   * @param {string} nmMod
   * @return {void}
   */
  const localizeModMeta = function(nmMod) {
    let mod = fetchMod(nmMod);
    if(mod == null) return;

    mod.meta.displayName = MDL_bundle._info(nmMod, "mod");
    mod.meta.description = MDL_bundle._info(nmMod, "mod", true);
  }
  .setAnno("non-headless");
  exports.localizeModMeta = localizeModMeta;


  /**
   * Locks all contents from some mod for testing purpose.
   * If `cts` is given, only these contents will be locked.
   * @param {string} nmMod
   * @param {Array<UnlockableContent>|unset} [cts]
   * @param {boolean|unset} [isUnlocking] - If true, this method will unlock contents instead.
   * @return {void}
   */
  const lockModContents = function thisFun(nmMod, cts, isUnlocking) {
    if(cts != null) {
      cts.forEachFast(ct => {
        if(thisFun.checkTg(ct, nmMod)) isUnlocking ? ct.unlock() : ct.clearUnlock();
      });
      TechTree.all.each(node => cts.includes(node.content) && thisFun.checkTg(node.content, nmMod), node => node.reset());
    } else {
      thisFun.defSeqs.forEachFast(seq => seq.each(
        ct => thisFun.checkTg(ct, nmMod),
        ct => {isUnlocking ? ct.unlock() : ct.clearUnlock(); Log.info("[LOVEC] Changed unlock state for " + ct.name.color(Pal.accent) + ".")},
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
