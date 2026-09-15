/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * Registers unit damage types.
     * @module lovec/tp/TP_unitDamageType
     */


/*
  ========================================
  Section: Definition
  ========================================
*/


    /** Large and powerful units */
    exports.experimental = new CLS_unitDamageType("experimental", "dmg0type-exp");
    /** Non-robot units */
    exports.biotic = new CLS_unitDamageType("biotic", "dmg0type-bio");
    /** Small ground units */
    exports.infantry = new CLS_unitDamageType("infantry", "dmg0type-inf");
    /** Large mech units */
    exports.titan = new CLS_unitDamageType("titan", "dmg0type-titan");
    /** Large leg units */
    exports.behemoth = new CLS_unitDamageType("behemoth", "dmg0type-beh");
    /** Non-tank wheeled units */
    exports.vehicle = new CLS_unitDamageType("vehicle", "dmg0type-veh");
    /** Tank units */
    exports.tank = new CLS_unitDamageType("tank", "dmg0type-tank");
    /** Regular air units */
    exports.aircraft = new CLS_unitDamageType("aircraft", "dmg0type-air");
    /** Balloon air units */
    exports.airship = new CLS_unitDamageType("airship", "dmg0type-aship");
    /** Small air units */
    exports.drone = new CLS_unitDamageType("drone", "dmg0type-drone");
    /** Satellite units */
    exports.satellite = new CLS_unitDamageType("satellite", "dmg0type-sat");
    /** Space air units */
    exports.spacecraft = new CLS_unitDamageType("spacecraft", "dmg0type-spa");
    /** Small naval units */
    exports.boat = new CLS_unitDamageType("boat", "dmg0type-boat");
    /** Regular naval units */
    exports.ship = new CLS_unitDamageType("ship", "dmg0type-ship");
    /** Submarine units */
    exports.submarine = new CLS_unitDamageType("submarine", "dmg0type-sub");
