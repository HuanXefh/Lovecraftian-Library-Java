/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods related to objective flags and LSAV flags.
   * @module lovec/mdl/MDL_flag
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ base ------------------------------ */


  /**
   * Whether a world processor flag is set.
   * @param {string} flag
   * @return {boolean}
   */
  const checkFlag = function(flag) {
    return Vars.state.rules.objectiveFlags.contains(flag);
  };
  exports.checkFlag = checkFlag;


  /**
   * Adds a world processor flag.
   * @param {string} flag
   * @return {boolean}
   */
  const addFlag = function(flag) {
    if(checkFlag(flag)) return false;

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
    if(checkFlag(flag)) return false;

    Vars.state.rules.objectiveFlags.remove(flag);

    return true;
  };
  exports.removeFlag = removeFlag;


  /* <------------------------------ LSAV ------------------------------ */


  /**
   * Whether a LSAV flag is set.
   * @param {string} flag
   * @return {boolean}
   */
  const checkLsavFlag = function(flag) {
    return SAVE.get("flags").includes(flag);
  };
  exports.checkLsavFlag = checkLsavFlag;


  /**
   * Adds a flag to LSAV.
   * @param {string} flag
   * @return {boolean}
   */
  const addLsavFlag = function thisFun(flag) {
    if(checkLsavFlag(flag)) return false;

    SAVE.set("flags", thisFun.tmpArr.cpy(SAVE.get("flags")).pushAll(flag));

    return true;
  }
  .setProp({
    tmpArr: [],
  });
  exports.addLsavFlag = addLsavFlag;


  /**
   * Removes a flag from LSAV.
   * @param {string} flag
   * @return {boolean}
   */
  const removeLsavFlag = function thisFun(flag) {
    if(!checkLsavFlag(flag)) return false;

    SAVE.set("flags", thisFun.tmpArr.cpy(SAVE.get("flags")).removeAll(flag));

    return true;
  }
  .setProp({
    tmpArr: [],
  });
  exports.removeLsavFlag = removeLsavFlag;
