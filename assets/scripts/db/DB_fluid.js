/* ----------------------------------------
 * NOTE:
 *
 * Database of fluid properties.
 * ---------------------------------------- */


const db = {


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  map: {


    recipe: {


    },


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  group: {


    /* ----------------------------------------
     * NOTE:
     *
     * The most basic fluid groups. Fluids in the same groups will share some parameters.
     * ---------------------------------------- */
    elementary: {


      brine: [],


      acidAq: [],


      baseAq: [],


      acidGas: [],


      baseGas: [],


      acidSub: [],


      baseSub: [],


      alc: [],


      acidAlc: [],


      baseAlc: [],


      oil: [],


      acidOil: [],


      baseOil: [],


      slurry: [],


      acidSlurry: [],


      baseSlurry: [],


      melt: [],


      sMelt: [],


    },


    /* ----------------------------------------
     * NOTE:
     *
     * Fluid tag groups, used for corrosion affinities.
     * ---------------------------------------- */
    fTag: {


      chloric: [],


      fluoric: [],


      oxidative: [],


      reductive: [],


      dehydrative: [],


      unstable: [],


    },


    /* ----------------------------------------
     * NOTE:
     *
     * @CONTENTGEN
     * These fluids contains water.
     * ---------------------------------------- */
    aqueous: [],


    /* ----------------------------------------
     * NOTE:
     *
     * @CONTENTGEN
     * These fluids are acidic.
     * ---------------------------------------- */
    acidic: [],


    /* ----------------------------------------
     * NOTE:
     *
     * @CONTENTGEN
     * These fluids are basic.
     * ---------------------------------------- */
    basic: [],


    /* ----------------------------------------
     * NOTE:
     *
     * @CONTENTGEN
     * These fluids are conductive, and cause short circuit for some blocks.
     * Automatically merges with {"aqueous"} group.
     * ---------------------------------------- */
    conductive: [],


    /* ----------------------------------------
     * NOTE:
     *
     * These fluids will fume.
     * I mean extra visual effects for the puddle, don't put gas here.
     * ---------------------------------------- */
    fuming: [],


    /* ----------------------------------------
     * NOTE:
     *
     * Fluids like regular air.
     * ---------------------------------------- */
    air: [],


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  grpParam: {


    dens: [

      "acidGas", 0.00121,
      "baseGas", 0.00121,
      "acidSub", 1.2,
      "baseSub", 1.2,
      "alc", 0.95,
      "acidAlc", 0.95,
      "baseAlc", 0.95,
      "oil", 0.7,
      "acidOil", 0.7,
      "baseOil", 0.7,
      "melt", 4.0,
      "sMelt", 4.0,
      "slurry", 1.5,
      "acidSlurry", 1.5,
      "baseSlurry", 1.5,

    ],


    viscWrap: [

      "alc", 0.5286,
      "acidAlc", 0.5286,
      "baseAlc", 0.5286,
      "oil", 0.4856,
      "acidOil", 0.4856,
      "baseOil", 0.4856,
      "slurry", 0.7710,
      "acidSlurry", 0.7710,
      "baseSlurry", 0.7710,
      "melt", 0.6421,
      "sMelt", 0.8814,

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * Default boiling point for elementary fluid groups.
     * ---------------------------------------- */
    boil: [

      "brine", 100.0,
      "acidAq", 100.0,
      "baseAq", 100.0,
      "acidGas", -60.0,
      "baseGas", -60.0,
      "acidSub", 300.0,
      "baseSub", 300.0,
      "alc", 70.0,
      "acidAlc", 70.0,
      "baseAlc", 70.0,
      "oil", 200.0,
      "acidOil", 200.0,
      "baseOil", 200.0,
      "melt", 1500.0,
      "sMelt", 1500.0,
      "slurry", 100.0,
      "acidSlurry", 100.0,
      "baseSlurry", 100.0,

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * Default boiling point for sovents.
     * ---------------------------------------- */
    solventBoil: [

      "ethanol", 78.0,
      "water", 100.0,

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * Default corrosion power for elementary fluid groups.
     * ---------------------------------------- */
    corrosion: [

      "brine", 1.0,
      "acidAq", 1.3,
      "baseAq", 1.3,
      "acidGas", 1.6,
      "baseGas", 1.6,
      "acidSub", 1.2,
      "baseSub", 1.2,
      "alc", 0.0,
      "acidAlc", 1.2,
      "baseAlc", 1.2,
      "oil", 0.0,
      "acidOil", 0.6,
      "baseOil", 0.6,
      "melt", 0.0,
      "sMelt", 0.0,
      "slurry", 0.1,
      "acidSlurry", 1.3,
      "baseSlurry", 1.3,

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * Corrosion multiplier for a pair of material and fluid.
     * ---------------------------------------- */
    matEleScl: {


      wood: [

        "acidAq", 5.0,
        "baseAq", 5.0,
        "acidGas", 4.0,
        "baseGas", 4.0,
        "acidSub", 5.0,
        "baseSub", 5.0,
        "acidAlc", 10.0,
        "baseAlc", 10.0,
        "acidOil", 8.0,
        "baseOil", 8.0,
        "acidSlurry", 5.0,
        "baseSlurry", 5.0,

      ],


      iron: [

        "brine", 7.0,
        "acidAq", 5.5,
        "baseAq", 4.0,
        "acidGas", 7.0,
        "baseGas", 4.0,
        "acidSub", 5.5,
        "baseSub", 4.0,
        "acidSlurry", 5.5,
        "baseSlurry", 4.0,

      ],


      steel: [

        "brine", 4.5,
        "acidAq", 2.0,
        "acidGas", 2.5,
        "acidSub", 2.0,
        "acidSlurry", 2.0,

      ],


      galvanized: [

        "acidAq", 1.5,
        "acidGas", 2.0,
        "acidSub", 1.5,
        "acidSlurry", 1.5,

      ],


      stainless: [

        "brine", 4.5,

      ],


      cement: [

        "brine", 5.0,
        "acidAq", 2.5,
        "acidGas", 3.5,
        "acidSub", 2.5,
        "acidAlc", 3.0,
        "acidOil", 3.0,
        "acidSlurry", 2.5,

      ],


      rubber: [

        "acidGas", 2.0,
        "baseGas", 2.0,
        "acidSub", 1.5,
        "baseSub", 1.5,
        "oil", 5.0,
        "acidOil", 7.5,
        "baseOil", 7.5,

      ],


    },


    /* ----------------------------------------
     * NOTE:
     *
     * Extra corrosion multiplier for a pair of material and fluid tag.
     * ---------------------------------------- */
    matFTagScl: {


      wood: [

        "oxidative", 5.0,
        "reductive", 5.0,
        "dehydrative", 5.0,

      ],


      copper: [

        "ammoniacal", 8.0,
        "chloric", 6.0,

      ],


      lead: [

        "oxidative", 4.5,

      ],


      glass: [

        "fluoric", 12.5,

      ],


      rubber: [

        "fluoric", 7.5,
        "oxidative", 4.5,

      ],


    },


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


};


Object.mergeDB(db, "DB_fluid");


db["group"]["aqueous"]
.pushAll(db["group"]["elementary"]["brine"])
.pushAll(db["group"]["elementary"]["acidAq"])
.pushAll(db["group"]["elementary"]["baseAq"])
.pushAll(db["group"]["elementary"]["slurry"])
.pushAll(db["group"]["elementary"]["acidSlurry"])
.pushAll(db["group"]["elementary"]["baseSlurry"]);


db["group"]["acidic"]
.pushAll(db["group"]["elementary"]["acidAq"])
.pushAll(db["group"]["elementary"]["acidGas"])
.pushAll(db["group"]["elementary"]["acidSub"])
.pushAll(db["group"]["elementary"]["acidAlc"])
.pushAll(db["group"]["elementary"]["acidOil"])
.pushAll(db["group"]["elementary"]["acidSlurry"]);


db["group"]["basic"]
.pushAll(db["group"]["elementary"]["baseAq"])
.pushAll(db["group"]["elementary"]["baseGas"])
.pushAll(db["group"]["elementary"]["baseSub"])
.pushAll(db["group"]["elementary"]["baseAlc"])
.pushAll(db["group"]["elementary"]["baseOil"])
.pushAll(db["group"]["elementary"]["baseSlurry"]);


db["group"]["conductive"]
.pushAll(db["group"]["aqueous"])
.pushAll(db["group"]["elementary"]["melt"])
.pushAll(db["group"]["elementary"]["sMelt"]);


exports.db = db;
