/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods related to objective flags and LSAV flags.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const SAVE = require("lovec/glb/GLB_save");


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Whether a world processor flag is set.
   * ---------------------------------------- */
  const _hasFlag = function(flag) {
    return Vars.state.rules.objectiveFlags.contains(flag);
  };
  exports._hasFlag = _hasFlag;


  /* ----------------------------------------
   * NOTE:
   *
   * Adds a world processor flag.
   * ---------------------------------------- */
  const addFlag = function(flag) {
    if(_hasFlag(flag)) return false;

    Vars.state.rules.objectiveFlags.add(flag);

    return true;
  };
  exports.addFlag = addFlag;


  /* ----------------------------------------
   * NOTE:
   *
   * Removes a world processor flag.
   * ---------------------------------------- */
  const removeFlag = function(flag) {
    if(_hasFlag(flag)) return false;

    Vars.state.rules.objectiveFlags.remove(flag);

    return true;
  };
  exports.removeFlag = removeFlag;


  /* <---------- LSAV ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Whether a LSAV flag is set.
   * ---------------------------------------- */
  const _hasLsavFlag = function(flag) {
    return SAVE.get("flags").includes(flag);
  };
  exports._hasLsavFlag = _hasLsavFlag;


  /* ----------------------------------------
   * NOTE:
   *
   * Adds a flag to LSAV.
   * ---------------------------------------- */
  const addLsavFlag = function(flag) {
    if(_hasLsavFlag(flag)) return false;

    SAVE.set("flags", SAVE.get("flags").pushAll(flag));

    return true;
  };
  exports.addLsavFlag = addLsavFlag;


  /* ----------------------------------------
   * NOTE:
   *
   * Removes a flag from LSAV.
   * ---------------------------------------- */
  const removeLsavFlag = function(flag) {
    if(!_hasLsavFlag(flag)) return false;

    SAVE.set("flags", SAVE.get("flags").removeAll(flag));

    return true;
  };
  exports.removeLsavFlag = removeLsavFlag;
