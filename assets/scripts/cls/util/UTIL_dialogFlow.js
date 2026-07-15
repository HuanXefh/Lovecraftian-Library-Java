/*
  ========================================
  Section: Definition
  ========================================
*/


  /**
   * Utility class for handling dialog flows.
   * @class
   */
  const UTIL_dialogFlow = newClass().initClass();


  const nameCtMap = new ObjectMap();
  let textCur = null;
  const lastTextLogs = [];
  const pool = {
    bg: [],
    img: [],
    chara: [],
    selection: [],
  };


/*
  ========================================
  Section: Definition (Static)
  ========================================
*/


  /**
   * Gets the name-content map.
   * @return {ObjectMap}
   */
  UTIL_dialogFlow.getNameCtMap = function() {
    return nameCtMap;
  };


  /**
   * Sets current text.
   * @param {Table} textTb
   * @return {void}
   */
  UTIL_dialogFlow.setTextCur = function(textTb) {
    textCur = textTb;
  };


  /**
   * Removes current text.
   * @return {void}
   */
  UTIL_dialogFlow.removeTextCur = function() {
    if(textCur != null) {
      MDL_ui.removeActor(textCur);
      textCur = null;
    };
  };


  /**
   * Gets the pool array by name.
   * @param {string} name
   * @return {Array`TABLE`}
   */
  UTIL_dialogFlow.getPool = function(name) {
    let arr = pool[name];
    if(arr == null) throw new Error("Pool ${1} is not registered!".format(name));
    return arr;
  };


  /**
   * Clears data in pool array.
   * @param {string|unset} [name] - Leave empty to clear all pool arrays.
   * @return {void}
   */
  UTIL_dialogFlow.clearPool = function(name) {
    if(name != null) {
      let arr = UTIL_dialogFlow.getPool(name);
      arr.forEachFast(tb => MDL_ui.removeActor(tb));
      arr.clear();
    } else {
      for(let name in pool) {
        UTIL_dialogFlow.clearPool(name);
      };
    };
  };


  /**
   * Gets stored log data.
   * @return {Array<DialogLogObject>}
   */
  UTIL_dialogFlow.getLog = function() {
    return lastTextLogs;
  };


  /**
   * Adds a log data.
   * @param {DialogLogObject} logObj
   * @return {void}
   */
  UTIL_dialogFlow.addLog = function(logObj) {
    lastTextLogs.push(logObj);
  };


  /**
   * Clears stored log data.
   * @return {void}
   */
  UTIL_dialogFlow.clearLog = function() {
    lastTextLogs.clear();
  };


/*
  ========================================
  Section: Definition (Instance)
  ========================================
*/




module.exports = UTIL_dialogFlow;
