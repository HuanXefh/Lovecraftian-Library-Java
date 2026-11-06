/*
  ================================================================================
  Section: Introduction
  ================================================================================
*/


    /**
     * Registers new weapon templates.
     * @module lovec/tp/TP_weapon
     */


/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    newWeaponTemplate("BaseWeapon", () => require("lovec/temp/weap/WEAP_baseWeapon"));
    newWeaponTemplate("RepairBeam", () => require("lovec/temp/weap/WEAP_repairBeam"));
