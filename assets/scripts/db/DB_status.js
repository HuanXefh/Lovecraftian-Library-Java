/* ----------------------------------------
 * NOTE:
 *
 * Database of status effect properties.
 *
 * Don't define affinities and opposites by {sta.init}, it's broken by Lovec templates.
 * It's just possible and easier to organize by using this DB file.
 * ---------------------------------------- */


const db = {


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  map: {


    /* ----------------------------------------
     * NOTE:
     *
     * @CONTENTGEN
     * Used to set up status affinities.
     * ---------------------------------------- */
    affinity: [],


    /* ----------------------------------------
     * NOTE:
     *
     * @DYNAMIC: () => stas_gn
     * @CONTENTGEN
     * Used to set up status opposites.
     * Acidic and basic status effects are by default opposite to each other.
     * ---------------------------------------- */
    opposite: [

      "loveclab-sta0bur-overheated", () => db["group"]["wet"],

    ],


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  group: {


    /* ----------------------------------------
     * NOTE:
     *
     * These status effects will react with (opposite to) basic status effects.
     * ---------------------------------------- */
    acidic: [

      "loveclab-sta0liq-acidic-i",
      "loveclab-sta0liq-acidic-ii",
      "loveclab-sta0liq-acidic-iii",
      "loveclab-sta0liq-acidic-iv",

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * These status effects will react with (opposite to) acidic status effects.
     * ---------------------------------------- */
    basic: [

      "loveclab-sta0liq-basic-i",
      "loveclab-sta0liq-basic-ii",
      "loveclab-sta0liq-basic-iii",
      "loveclab-sta0liq-basic-iv",

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * These status effects can't be applied on biotic units.
     * ---------------------------------------- */
    robotOnly: [

      "loveclab-sta-haste",

      "loveclab-sta0liq-sea-water-corrosion",
      "loveclab-sta0liq-brine-corrosion",
      "loveclab-sta0liq-waste-corrosion",

      "loveclab-sta0death-explosion-mark",

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * These status effects are related to sea, naval units will gain immunity to these.
     * ---------------------------------------- */
    oceanic: [

      "wet",

      "loveclab-sta0liq-sea-water-corrosion",
      "loveclab-sta0liq-waste-corrosion",

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * Missile units will be immune to these.
     * By default missiles are always immune to death status effects.
     * ---------------------------------------- */
    missileImmune: [

      "loveclab-sta-haste",

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * @CONTENTGEN
     * Loot unit should be immune to these status effects.
     * A loot is a collectable stack of items on the ground.
     * By default, loot units are always immune to robot-only and death status effects.
     * ---------------------------------------- */
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


    /* ----------------------------------------
     * NOTE:
     *
     * These status effects are related to high temperature.
     * ---------------------------------------- */
    hot: [

      "burning",
      "melting",

      "loveclab-sta0bur-overheated",

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * These status effects are related to being soaked in aqueous liquids.
     * ---------------------------------------- */
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
