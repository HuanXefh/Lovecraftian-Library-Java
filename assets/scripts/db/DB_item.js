/**
 * Database of item properties and recipe data.
 * @module lovec/db/DB_item
 */


const db = {


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  param: {


    fuel: {


      /**
       * Fuel parameters for an item.
       * <br> <ROW>: itm, [fuelPon, fuelLvl].
       */
      item: [

        "coal", [8.0, 8.0],
        "spore-pod", [4.0, 10.0],
        "pyratite", [8.0, 13.25],

      ],


      /**
       * Fuel parameters for a fluid.
       * <br> <ROW>: liq, [consRate, fuelLvl].
       */
      fluid: [],


    },


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  map: {


    /**
     * Maps an attribute to some resource, mostly for dynamic attribute output.
     * <br> <ROW-xxx>: attr, rs.
     */
    attr: {


      bush: [],


      dpliq: [],


      rock: [],


      tree: [],


      vent: [],


    },


    /**
     * Collection of recipe data used in {@link TP_recipeGen}.
     * Row format is determined by each generator.
     */
    recipe: {


      alloying: [],


      brickBaking: [],


      casting: [],


      forging: [],


      mixing: [],


      ballMillMixing: [],


      mixingLiquid: [],


      filtration: [],


      filtrationLiquid: [],


      pulverization: [],


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


    /**
     * Fuel groups used for blacklists/whitelists.
     * <br> <ROW-xxx>: rs.
     */
    fuel: {


      biotic: [

        "spore-pod",

      ],


    },


    /**
     * Items here are not mineable by regular drills by default, a sand miner is required.
     * <br> <ROW>: itm.
     */
    sand: [

      "sand",

    ],


    /**
     * Items here can be crushed for aggregate.
     * Used for recipe generation.
     * <br> <ROW>: itm, reqAmtMtp.
     */
    aggregate: [],


    /**
     * Items considered acidic.
     * <br> <ROW>: itm.
     */
    acidic: [],


    /**
     * Items considered basic.
     * <br> <ROW>: itm.
     */
    basic: [],


    /**
     * Items like sodium, which react with water and explode.
     * <br> <ROW>: itm.
     */
    sodium: [],


    /**
     * "GROUP: xxx" in recipe I/O arrays.
     * <br> <ROW>: grpStr, [nmRs, paramObj].
     */
    rcGroup: [],


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  intmd: {


    /**
     * Intermediate tags, which are written in `rs.tempTags`.
     * Items and fluids with these tags will be categorized in `VARGEN.intmds`.
     * If tag sprite ("rs0tag-<tag>") is found, it will be used for icon tag generation.
     * <br> <ROW>: tag.
     */
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


    /**
     * Some intermediate tags are added automatically if some conditions are met.
     * <br> <ROW>: tag, boolF.
     * <br> <ARGS>: rs.
     */
    tagCheck: [

      "rs-wet", function(rs) {
        let extraIntmdParents = rs.delegee.extraIntmdParents;
        return extraIntmdParents.length === 1 && extraIntmdParents[0].name === "loveclab-liq0ore-water";
      },

    ],


    /**
     * Maps intermediate tags to their localized names for name insertion.
     * Used for some tags that don't have separate content templates.
     * <br> <ROW>: tag, nm.
     */
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
