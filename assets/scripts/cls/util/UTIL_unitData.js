/*
  ========================================
  Section: Definition
  ========================================
*/


  /**
   * Utility class for handling extra data for Lovec units.
   * @class
   */
  const UTIL_unitData = newClass().initClass();


  const expiredUnits = [];
  const unitDataMap = new ObjectMap();


  MDL_event._c_onLoad(() => {
    TRIGGER.majorIter.start.addGlobalListener(() => {
      expiredUnits.clear();
      unitDataMap.each((unit, dataObj) => {
        if(!unit.isAdded()) expiredUnits.push(unit);
      });
      expiredUnits.forEachFast(unit => {
        unitDataMap.remove(unit);
      });
    });
  });


/*
  ========================================
  Section: Definition (Static)
  ========================================
*/


  /**
   * Gets a data from the unit data map.
   * @param {Unit} unit
   * @param {any} def
   * @return {any}
   */
  UTIL_unitData.get = function(unit, def) {
    return def == null ?
      unitDataMap.get(unit) :
      unitDataMap.get(unit, def);
  };


  /**
   * Gets the unit data map.
   * @return {ObjectMap}
   */
  UTIL_unitData.getUnitDataMap = function() {
    return unitDataMap;
  };


  /**
   * Whether a unit exists in the unit data map.
   * @param {Unit} unit
   * @return {boolean}
   */
  UTIL_unitData.includes = function(unit) {
    return unitDataMap.containsKey(unit);
  };


  /**
   * Adds a unit data pair into the unit data map.
   * @param {Unit} unit
   * @param {Object} dataObj
   * @return {void}
   */
  UTIL_unitData.add = function(unit, dataObj) {
    unitDataMap.put(unit, dataObj);
  };


  /**
   * Removes a unit from the unit data map.
   * @return {void}
   */
  UTIL_unitData.remove = function(unit) {
    unitDataMap.remove(unit);
  };


/*
  ========================================
  Section: Definition (Instance)
  ========================================
*/




module.exports = UTIL_unitData;
