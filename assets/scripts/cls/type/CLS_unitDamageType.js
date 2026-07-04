/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- meta ----------> */


  /**
   * Affects damage dealt by Lovec bullets.
   * @class
   * @param {string} name
   * @param {string} tag - Content template tag assigned to this type.
   */
  const CLS_unitDamageType = newClass().initClass();


  CLS_unitDamageType.prototype.init = function(name, tag) {
    this.name = registerUniqueName(name, insNames, "unit damage type");
    if(typeof tag !== "string") ERROR_HANDLER.throw("typeMismatch", tag, "string");
    this.tag = tag;

    nameTypeMap.put(this.name, this);
  };


  const insNames = [];
  const nameTypeMap = new ObjectMap();


/*
  ========================================
  Section: Definition (Static)
  ========================================
*/


  /**
   * Gets a unit damage type by name.
   * @param {string} name
   * @return {CLS_unitDamageType}
   */
  CLS_unitDamageType.getType = function(name) {
    let type = nameTypeMap.get(name);
    if(type == null) throw new Error("Unregistered unit damage type: " + name);
    return type;
  };


  /**
   * Gets unit damage type of some unit type.
   * If none found, {@link CLS_unitDamageType.NONE} will be returned.
   * @param {UnitTypeGn} utp_gn
   * @return {CLS_unitDamageType}
   */
  CLS_unitDamageType.getTypeByUtp = function(utp_gn) {
    let utp = MDL_content._ct(utp_gn, "utp");
    if(utp == null) return CLS_unitDamageType.NONE;

    let type_fi = CLS_unitDamageType.NONE;
    nameTypeMap.each((name, type) => {
      if(type_fi != CLS_unitDamageType.NONE) return;
      if(checkTempTag(utp, type.getTag())) {
        type_fi = type;
      };
    });

    return type_fi;
  }
  .setCache();


  /**
   * Gets content template tag of a unit damage type by name.
   * @param {string} name
   * @return {string}
   */
  CLS_unitDamageType.getTag = function(name) {
    return CLS_unitDamageType.getType(name).getTag();
  };


/*
  ========================================
  Section: Definition (Instance)
  ========================================
*/


  /**
   * Gets name of this unit damage type.
   * @return {string}
   */
  CLS_unitDamageType.prototype.getName = function() {
    return this.name;
  };


  /**
   * Gets content template tag of this unit damage type.
   * @return {string}
   */
  CLS_unitDamageType.prototype.getTag = function() {
    return this.tag;
  };


  /**
   * Gets localized name of this unit damage type.
   * @return {string}
   */
  CLS_unitDamageType.prototype.localized = function() {
    return MDL_bundle._base("database-tag.common-dmg0type-" + this.getName());
  };




CLS_unitDamageType.NONE = new CLS_unitDamageType("none", "!ERR");


module.exports = CLS_unitDamageType;
