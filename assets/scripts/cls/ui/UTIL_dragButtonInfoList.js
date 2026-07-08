/*
  ========================================
  Section: Definition
  ========================================
*/


  /**
   * Stores a list of info dialogs, which can be shown through a button in {@link CLS_dragButton}.
   * @class
   */
  const UTIL_dragButtonInfoList = newClass().initClass();


  const infoListData = ObjectMap.of(
    "uncategorized", ObjectMap.of("uncategorized", new ObjectMap()),
  );
  const moddedNames = [];


/*
  ========================================
  Section: Definition (Static)
  ========================================
*/


  /* <------------------------------ modification ------------------------------ */


  /**
   * Adds a new info dialog.
   * @param {string} name
   * @param {function(): void} scr
   * @param {string|unset} [categ]
   * @param {string|unset} [subCateg]
   * @return {this}
   */
  UTIL_dragButtonInfoList.add = function(name, scr, categ, subCateg) {
    UTIL_dragButtonInfoList.findMap(categ, subCateg).put(name, scr);

    return UTIL_dragButtonInfoList;
  };


  /**
   * Marks an info name as for modded situation only.
   * @param {string|unset} [name]
   * @param {string|unset} [categ]
   * @param {string|unset} [subCateg]
   * @return {this}
   */
  UTIL_dragButtonInfoList.markModded = function(name, categ, subCateg) {
    moddedNames.pushUnique(UTIL_dragButtonInfoList.getInfoString(name, categ, subCateg));

    return UTIL_dragButtonInfoList;
  };


  /* <------------------------------ util ------------------------------ */


  /**
   * Gets unique string for a info name.
   * @param {string|unset} [name]
   * @param {string|unset} [categ]
   * @param {string|unset} [subCateg]
   * @return {string}
   */
  UTIL_dragButtonInfoList.getInfoString = function(name, categ, subCateg) {
    return tryVal(categ, "uncategorized") + "/" + tryVal(subCateg, "uncategorized") + "/" + tryVal(name, "unknown");
  };


  /**
   * Gets the object map under given category and sub-category.
   * @param {string|unset} [categ]
   * @param {string|unset} [subCateg]
   * @param {boolean|unset} [noRegister] - If true, an error is thrown if map not found.
   */
  UTIL_dragButtonInfoList.findMap = function(categ, subCateg, noRegister) {
    if(noRegister) {
      let map = infoListData.get(categ, ARC_AIR.objMap).get(subCateg, ARC_AIR.objMap);
      if(map === ARC_AIR.objMap) throw new Error("Cannot find info list under ${1}/${2}!".format(categ, subCateg));
      return map;
    };

    if(categ == null) categ = "uncategorized";
    if(!infoListData.containsKey(categ)) {
      infoListData.add(categ, new ObjectMap());
    };
    if(subCateg == null) subCateg = "uncategorized";
    let map = infoListData.get(categ);
    if(!map.containsKey(subCateg)) {
      map.add(subCateg, new ObjectMap());
    };

    return map.get(subCateg);
  };


  /**
   * Gets text for an info dialog.
   * @param {string|unset} [name]
   * @return {string}
   */
  UTIL_dragButtonInfoList.getLocalizedInfoName = function(name) {
    return MDL_bundle._term("common", "infolist-info-" + tryVal(name, "unknown"));
  };


  /**
   * Gets text for a category or sub-category.
   * @param {string|unset} [categ]
   * @return {string}
   */
  UTIL_dragButtonInfoList.getLocalizedCategName = function(categ) {
    return MDL_bundle._term("common", "infolist-categ-" + tryVal(categ, "uncategorized"));
  };


  /**
   * Call this method to show the info list dialog.
   * @return {void}
   */
  UTIL_dragButtonInfoList.show = function() {
    fetchDialog("infoListMain").ex_show(infoListData, moddedNames);
  },


/*
  ========================================
  Section: Definition (Instance)
  ========================================
*/




module.exports = UTIL_dragButtonInfoList;
