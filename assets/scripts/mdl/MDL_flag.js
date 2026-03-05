/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods related to objective flags and LSAV flags.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- base ----------> */


  /**
   * Whether a world processor flag is set.
   * @param {string} flag
   * @return {boolean}
   */
  const _hasFlag = function(flag) {
    return Vars.state.rules.objectiveFlags.contains(flag);
  };
  exports._hasFlag = _hasFlag;


  /**
   * Adds a world processor flag.
   * @param {string} flag
   * @return {boolean}
   */
  const addFlag = function(flag) {
    if(_hasFlag(flag)) return false;

    Vars.state.rules.objectiveFlags.add(flag);

    return true;
  };
  exports.addFlag = addFlag;


  /**
   * Removes a world processor flag.
   * @param {string} flag
   * @return {boolean}
   */
  const removeFlag = function(flag) {
    if(_hasFlag(flag)) return false;

    Vars.state.rules.objectiveFlags.remove(flag);

    return true;
  };
  exports.removeFlag = removeFlag;


  /* <---------- LSAV ----------> */


  /**
   * Whether a LSAV flag is set.
   * @param {string} flag
   * @return {boolean}
   */
  const _hasLsavFlag = function(flag) {
    return SAVE.get("flags").includes(flag);
  };
  exports._hasLsavFlag = _hasLsavFlag;


  /**
   * Adds a flag to LSAV.
   * @param {string} flag
   * @return {boolean}
   */
  const addLsavFlag = function(flag) {
    if(_hasLsavFlag(flag)) return false;

    SAVE.set("flags", SAVE.get("flags").pushAll(flag));

    return true;
  };
  exports.addLsavFlag = addLsavFlag;


  /**
   * Removes a flag from LSAV.
   * @param {string} flag
   * @return {boolean}
   */
  const removeLsavFlag = function(flag) {
    if(!_hasLsavFlag(flag)) return false;

    SAVE.set("flags", SAVE.get("flags").removeAll(flag));

    return true;
  };
  exports.removeLsavFlag = removeLsavFlag;
