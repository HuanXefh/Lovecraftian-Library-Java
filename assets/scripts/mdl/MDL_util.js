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


    /* <------------------------------ mod ------------------------------ */


    /**
     * Localizes mod stats.
     * Put `info.<nameMod>-info-mod` in your bundle for this method to work.
     * @param {string} nameMod
     * @return {void}
     */
    const localizeModMeta = function(nameMod) {
        let mod = fetchMod(nameMod);
        if(mod == null) return;
        mod.meta.displayName = MDL_bundle.getInfo(nameMod, "mod");
        mod.meta.description = MDL_bundle.getInfo(nameMod, "mod", true);
    }
    .setAnno("non-headless");
    exports.localizeModMeta = localizeModMeta;


    /**
     * Adds a button to database dialog.
     * @param {string} text
     * @param {C0Function} scr
     * @return {void}
     */
    const addDatabaseButton = function(text, scr) {
        let seq = Vars.ui.database.getChildren();
        seq.get(seq.size - 1).button(text, scr).size(210.0, 64.0);
    }
    .setAnno("non-headless");
    exports.addDatabaseButton = addDatabaseButton;


    /**
     * Locks all contents from some mod for testing purpose.
     * If `cts` is given, only these contents will be locked.
     * @param {string} nameMod
     * @param {Array<UnlockableContent>|unset} [cts]
     * @param {boolean|unset} [isUnlocking] - If true, this method will unlock contents instead.
     * @return {void}
     */
    const lockModContents = function thisFun(nameMod, cts, isUnlocking) {
        if(cts != null) {
            cts.forEachFast(ct => {
                if(thisFun.checkTarget(ct, nameMod)) isUnlocking ? ct.unlock() : ct.clearUnlock();
            }, true);
            TechTree.all.each(node => cts.includes(node.content) && thisFun.checkTarget(node.content, nameMod), node => node.reset());
        } else {
            thisFun.defSeqs.forEachFast(seq => seq.each(
                ct => thisFun.checkTarget(ct, nameMod),
                ct => {isUnlocking ? ct.unlock() : ct.clearUnlock(); console.log("[LOVEC] Changed unlock state for " + ct.name.color(Pal.accent) + ".")},
            ), true);
            TechTree.all.each(node => thisFun.checkTarget(node.content, nameMod), node => node.reset());
        };
    }
    .setProp({
        /**
         * @memberof lockModContents
         * @type {Array<Seq<UnlockableContent>>}
         */
        defSeqs: [
          Vars.content.items(),
          Vars.content.liquids(),
          Vars.content.blocks(),
          Vars.content.units(),
          Vars.content.statusEffects(),
          Vars.content.sectors(),
        ],
        /**
         * @memberof lockModContents
         * @param {UnlockableContent} ct
         * @param {string} nameMod
         * @return {boolean}
         */
        checkTarget: function(ct, nameMod) {
            return ct.minfo.mod != null && ct.minfo.mod.name === nameMod;
        },
    })
    .setAnno("debug");
    exports.lockModContents = lockModContents;
