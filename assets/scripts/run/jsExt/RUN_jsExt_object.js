/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Extension for JavaScript object.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /**
   * Creates a global reference to some object.
   * @template T
   * @param {T} obj
   * @param {string} name
   * @return {T}
   */
  Object.globalize = function(obj, name) {
    if(typeof name !== "string") throw new Error("You must provide a name for global reference! Exception:\n" + name);
    registerUniqueName(name, Object.globalize.names, "globalize");
    globalEval(
      'let cond = false; try {cond = ' + name + ' !== undefined} catch(err) {cond = false}; if(cond) throw new Error("Cannot globalize an object due to reference conflict! Exception: ' + name + '")',
      "globalizeCheck_" + Object.globalize.ind,
    );
    Object.globalize.tmp = obj;
    globalEval(
      name + " = Object.globalize.tmp",
      "globalize_" + Object.globalize.ind,
    );
    Object.globalize.ind++;

    return obj;
  };
  Object.globalize.ind = 0;
  Object.globalize.tmp = null;
  Object.globalize.names = [];


  /**
   * Variant of {@link Object.globalize} for instance.
   * @func Object#globalize
   * @param {string} name
   * @return {this}
   */
  setHiddenProp(Object.prototype, "globalize", function(name) {
    return Object.globalize(this, name);
  });
