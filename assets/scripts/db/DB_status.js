/**
 * Database of status effect properties.
 */


const db = {


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  map: {


    /**
     * Used to set up status affinities.
     * <br> <CONTENTGEN>
     * <br> <ROW>: sta, arr.
     * <br> <ROW-arr>: osta, scr.
     */
    affinity: [],


    /**
     * Used to set up status opposites.
     * Acidic and basic status effects are by default opposite to each other.
     * <br> <CONTENTGEN>
     * <br> <ROW>: sta, ostas.
     * <br> <DYNAMIC>: () => ostas.
     */
    opposite: [

      "loveclab-sta0bur-overheated", () => db["group"]["wet"],

    ],


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  group: {


    /**
     * These status effects will react with (opposite to) basic status effects.
     * <br> <ROW>: sta.
     */
    acidic: [

      "loveclab-sta0liq-acidic-i",
      "loveclab-sta0liq-acidic-ii",
      "loveclab-sta0liq-acidic-iii",
      "loveclab-sta0liq-acidic-iv",

    ],


    /**
     * These status effects will react with (opposite to) acidic status effects.
     * <br> <ROW>: sta.
     */
    basic: [

      "loveclab-sta0liq-basic-i",
      "loveclab-sta0liq-basic-ii",
      "loveclab-sta0liq-basic-iii",
      "loveclab-sta0liq-basic-iv",

    ],


    /**
     * These status effects can't be applied on biotic units.
     * <br> <ROW>: sta.
     */
    robotOnly: [

      "loveclab-sta-haste",

      "loveclab-sta0liq-sea-water-corrosion",
      "loveclab-sta0liq-brine-corrosion",
      "loveclab-sta0liq-waste-corrosion",

      "loveclab-sta0death-explosion-mark",

    ],


    /**
     * These status effects are related to sea, naval units will gain immunity to these.
     * <br> <ROW>: sta.
     */
    oceanic: [

      "wet",

      "loveclab-sta0liq-sea-water-corrosion",
      "loveclab-sta0liq-waste-corrosion",

    ],


    /**
     * Missile units will be immune to these.
     * By default, missiles are always immune to death status effects.
     * <br> <ROW>: sta.
     */
    missileImmune: [

      "loveclab-sta-haste",

    ],


    /**
     * Loot unit should be immune to these status effects.
     * By default, loot units are always immune to robot-only and death status effects.
     * <br> <CONTENTGEN>
     * <br> <ROW>: sta.
     */
    lootImmune: [

      "loveclab-sta-hidden-well",
      "loveclab-sta0liq-acidic-i",
      "loveclab-sta0liq-acidic-ii",
      "loveclab-sta0liq-acidic-iii",
      "loveclab-sta0liq-acidic-iv",
      "loveclab-sta0liq-basic-i",
      "loveclab-sta0liq-basic-ii",
      "loveclab-sta0liq-basic-iii",
      "loveclab-sta0liq-basic-iv",

    ],


    /**
     * These status effects are related to high temperature.
     * <br> <ROW>: sta.
     */
    hot: [

      "burning",
      "melting",

      "loveclab-sta0bur-overheated",

    ],


    /**
     * These status effects are related to being soaked in aqueous liquids.
     * <br> <ROW>: sta.
     */
    wet: [

      "wet",

      "loveclab-sta0liq-sea-water-corrosion",
      "loveclab-sta0liq-brine-corrosion",
      "loveclab-sta0liq-waste-corrosion",

    ],


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


};


Object.mergeDB(db, "DB_status");


db["map"]["affinity"].pushAll((function() {
  const arr = [];
  db["group"]["acidic"].forEachFast(nmSta => {
    arr.push(nmSta, ["melting", function(unit, staEn, time) {staEn.set(this, time + 240.0)}]);
  });
  db["group"]["basic"].forEachFast(nmSta => {
    arr.push(nmSta, ["melting", function(unit, staEn, time) {staEn.set(this, time + 240.0)}]);
  });
  return arr;
})());
db["map"]["opposite"].pushAll((function() {
  const arr = [];
  db["group"]["acidic"].forEachFast(nmSta => {
    arr.push(nmSta, () => db["group"]["basic"]);
  });
  db["group"]["basic"].forEachFast(nmSta => {
    arr.push(nmSta, () => db["group"]["acidic"]);
  });
  return arr;
})());
db["group"]["lootImmune"].pushAll(db["group"]["robotOnly"]);


exports.db = db;
