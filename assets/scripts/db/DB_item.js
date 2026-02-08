/* ----------------------------------------
 * NOTE:
 *
 * Database of item properties.
 * ---------------------------------------- */


const MDL_bundle = require("lovec/mdl/MDL_bundle");
const MDL_event = require("lovec/mdl/MDL_event");


const db = {


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  param: {


    /* ----------------------------------------
     * NOTE:
     *
     * Fuel parameters for a fuel.
     * Format (item): {nm, [fuelPon, fuelLvl]}.
     * Format (fluid): {nm, [consRate, fuelLvl]}.
     * ---------------------------------------- */
    fuel: {


      item: [

        "coal", [8.0, 8.0],

      ],


      fluid: [],


    },


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  map: {


    attr: {


      /* ----------------------------------------
       * NOTE:
       *
       * Maps an attribute to some resource obtained by a bush harvester.
       * ---------------------------------------- */
      bush: [],


      /* ----------------------------------------
       * NOTE:
       *
       * Maps an attribute to some resource obtained by a depth liquid pump.
       * ---------------------------------------- */
      dpliq: [],


      /* ----------------------------------------
       * NOTE:
       *
       * Maps an attribute to some resource obtained by a quarry.
       * ---------------------------------------- */
      rock: [],


      /* ----------------------------------------
       * NOTE:
       *
       * Maps an attribute to some resource obtained by a tree tap.
       * ---------------------------------------- */
      tree: [],


      /* ----------------------------------------
       * NOTE:
       *
       * Maps an attribute to some resource obtained by a vent collector.
       * ---------------------------------------- */
      vent: [],


    },


    recipe: {


      alloying: [],


      brickBaking: [],


      casting: [],


      forging: [],


      mixing: [],


      mixingLiquid: [],


      filtration: [],


      filtrationLiquid: [],


      ballMillMixing: [],


      purificationI: [],


      purificationII: [],


      purificationMagnetic: [],


      purificationFloat: [],


      roasting: [],


      concentrateRoasting: [],


      smelting: [],


      concentrateSmelting: [],


    },


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  group: {


    fuel: {


      /* ----------------------------------------
       * NOTE:
       *
       * Biotic fuels like timber.
       * ---------------------------------------- */
      biotic: [],


    },


    /* ----------------------------------------
     * NOTE:
     *
     * Items here are not mineable by regular drills by default, a sand miner is required.
     * ---------------------------------------- */
    sand: [],


    /* ----------------------------------------
     * NOTE:
     *
     * Items here can be crushed for aggregate.
     * Used for recipe generation.
     * Format: {nmItm, reqAmtMtp}.
     * ---------------------------------------- */
    aggregate: [],


    /* ----------------------------------------
     * NOTE:
     *
     * Items considered acidic.
     * ---------------------------------------- */
    acidic: [],


    /* ----------------------------------------
     * NOTE:
     *
     * Items considered basic.
     * ---------------------------------------- */
    basic: [],


    /* ----------------------------------------
     * NOTE:
     *
     * Items like sodium, which react with water and explode.
     * ---------------------------------------- */
    sodium: [],


    /* ----------------------------------------
     * NOTE:
     *
     * "GROUP: xxx" in recipe I/O arrays.
     * Format: {grp, [nmRs, paramObj]}.
     * ---------------------------------------- */
    rcGroup: [],


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  intmd: {


    /* ----------------------------------------
     * NOTE:
     *
     * Intermediate tags, which are written in {rs.tempTags}.
     * Items and fluids with these tags will be categorized in {VARGEN.intmds}.
     * If tag sprite is found, it will be used for icon tag generation.
     * ---------------------------------------- */
    tag: [

      /* coupled */

      "rs-p1",
      "rs-p2",

      /* static (item) */

      "rs-chunks",
      "rs-dust",
      "rs-blend",
      "rs-clinker",
      "rs-ore0conc",
      "rs-crd",

      /* static (fluid) */

      "rs-sol",
      "rs-susp",
      "rs-morbid",
      "rs-slur",
      "rs-slur0dil",
      "rs-hot0liq",

      /* dynamic */

      "rs-clean",
      "rs-high0pres",
      "rs-med0pres",
      "rs-low0pres",
      "rs-conc",
      "rs-dry",
      "rs-hot",
      "rs-cold",

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * Some intermediate tags are added automatically if some conditions are met.
     * ---------------------------------------- */
    tagCheck: [

      "rs-wet", function(rs) {
        let extraIntmdParents = rs.delegee.extraIntmdParents;
        return extraIntmdParents.length === 1 && extraIntmdParents[0].name === "loveclab-liq0ore-water";
      },

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * Maps intermediate tags to their localized names for name insertion.
     * Used for some tags that don't have separate templates.
     * ---------------------------------------- */
    insertName: [

      "rs-clean", MDL_bundle._term("common", "intmd-clean"),
      "rs-high0pres", MDL_bundle._term("common", "intmd-high-pres"),
      "rs-med0pres", MDL_bundle._term("common", "intmd-med-pres"),
      "rs-low0pres", MDL_bundle._term("common", "intmd-low-pres"),
      "rs-conc", MDL_bundle._term("common", "intmd-conc"),
      "rs-dry", MDL_bundle._term("common", "intmd-dry"),
      "rs-wet", MDL_bundle._term("common", "intmd-wet"),
      "rs-hot", MDL_bundle._term("common", "intmd-hot"),
      "rs-cold", MDL_bundle._term("common", "intmd-cold"),

    ],


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


};


Object.mergeDB(db, "DB_item");


exports.db = db;
