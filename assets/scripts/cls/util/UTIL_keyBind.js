/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- meta ----------> */


  /**
   * Utility class for handling key bindings.
   * @class
   */
  const UTIL_keyBind = newClass().initClass();


  const nameBindingMap = new ObjectMap();


/*
  ========================================
  Section: Definition (Static)
  ========================================
*/


  /**
   * Gets a key binding by name.
   * @param {string} name
   * @return {KeyBind|null}
   */
  UTIL_keyBind.get = function(name) {
    return nameBindingMap.get(name);
  };


  /**
   * Adds a new key binding.
   * @param {string} name
   * @param {KeyCode|unset} keyCodeDef
   * @param {string} categ
   * @return {boolean} Whether the key binding has been added.
   */
  UTIL_keyBind.add = function(name, keyCodeDef, categ) {
    if(nameBindingMap.containsKey(name)) {
      console.warn("[LOVEC] Key binding ${1} has already been registered!".format(name.color(Pal.accent)));
      return false;
    };
    nameBindingMap.put(name, KeyBind.add(name, tryVal(keyCodeDef, KeyCode.unset), categ));

    return true;
  };


/*
  ========================================
  Section: Definition (Instance)
  ========================================
*/




module.exports = UTIL_keyBind;
