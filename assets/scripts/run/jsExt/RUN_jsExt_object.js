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
   * Variant of {@link globalize} for instance.
   * @func Object#globalize
   * @param {string} name
   * @return {this}
   */
  setHiddenProp(Object.prototype, "globalize", function(name) {
    return globalize(this, name);
  });
