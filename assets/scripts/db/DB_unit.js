/* ----------------------------------------
 * NOTE:
 *
 * Database of unit properties.
 * Entity id mapping is done here.
 * ---------------------------------------- */


const db = {


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  map: {


    entity: {


      /* ----------------------------------------
       * NOTE:
       *
       * Maps type to a unit class and extra id if possible.
       * Make sure the id here is not used by vanilla game!
       * ---------------------------------------- */
      type: [

        "base", UnitEntity,
        "flying", UnitEntity,
        "mech", MechUnit,
        "legs", LegsUnit,
        "naval", UnitWaterMove,
        "payload", PayloadUnit,
        "missile", TimedKillUnit,
        "tank", TankUnit,
        "hover", ElevationMoveUnit,
        "tether", BuildingTetherPayloadUnit,
        "crawl", CrawlUnit,

        "lovec-air", 80,
        "lovec-mech", 81,
        "lovec-tether-air", 82,
        "lovec-jet", 83,

      ],


      /* ----------------------------------------
       * NOTE:
       *
       * Used to define new entity types.
       * Format: {id, templateGetter}.
       * ---------------------------------------- */
      entityDef: [

        // lovec-air
        80, () => require("lovec/temp/unit/entity/ENTITY_baseAirUnit"),

        // lovec-mech
        81, () => require("lovec/temp/unit/entity/ENTITY_mech"),

        // lovec-tether-air
        82, () => require("lovec/temp/unit/entity/ENTITY_tetheredAirUnit"),

        // lovec-jet
        83, () => require("lovec/temp/unit/entity/ENTITY_jet"),

      ],


    },


    /* ----------------------------------------
     * NOTE:
     *
     * Faction for unit type. See {DB_block.db["map"]["faction"]}.
     * ---------------------------------------- */
    faction: [],


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  group: {


    /* ----------------------------------------
     * NOTE:
     *
     * These units are related to core in some way.
     * ---------------------------------------- */
    coreUnit: [],


    /* ----------------------------------------
     * NOTE:
     *
     * These units are not robots, and they don't create remains upon death.
     * ---------------------------------------- */
    nonRobot: [

      "renale", "latum",

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * These units are rare exceptions that don't create remains.
     * No need to add biotic units here.
     * ---------------------------------------- */
    noRemains: [

      "new-horizon-nucleoid",
      "new-horizon-guardian",

      "sfire-mod-knocker",

      "sapphirium-shielder",
      "sapphirium-jerk",
      "sapphirium-glaive",
      "sapphirium-absorption",
      "sapphirium-abyss-spawn",
      "sapphirium-diamond-drone",
      "sapphirium-ice-bomb",
      "sapphirium-fight",
      "sapphirium-second-chance",
      "sapphirium-curbing-phase1",
      "sapphirium-curbing-phase2",
      "sapphirium-obedience-phase1",
      "sapphirium-obedience-phase2",
      "sapphirium-subordination-phase1",
      "sapphirium-subordination-phase2",

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * If a mod has customized unit debris, don't create extra remains.
     * ---------------------------------------- */
    noRemainsMod: [

      "aquarion",

    ],


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  grpParam: {


    /* ----------------------------------------
     * NOTE:
     *
     * Outline parameters used for units & turrets.
     * Format: {nmMod, [stroke, color]}.
     * ---------------------------------------- */
    outline: [

      "loveclab", [2, "373a4d"],
      "projreind", [2, "373a4d"],

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * Maps a type to some template tag.
     * The type used here can affect damage dealt by Lovec bullets.
     * ---------------------------------------- */
    typeTagMap: [

      // Highest priority
      "experimental", "utp-exp",

      "biotic", "utp-bio",
      "infantry", "utp-inf",
      "titan", "utp-titan",
      "behemoth", "utp-beh",
      "vehicle", "utp-veh",
      "heavy-vehicle", "utp-hev0veh",
      "aircraft", "utp-air",
      "airship", "utp-aship",
      "drone", "utp-drone",
      "spacecraft", "utp-spa",
      "boat", "utp-boat",
      "ship", "utp-ship",
      "heavy-ship", "utp-hev0ship",
      "submarine", "utp-sub",

    ],


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  class: {


    btp: {


      /* ----------------------------------------
       * NOTE:
       *
       * These bullets can deal damage remotely.
       * ---------------------------------------- */
      remote: [

        ContinuousBulletType,
        LaserBulletType, ShrapnelBulletType,
        PointBulletType, RailBulletType, PointLaserBulletType, SapBulletType,
        InterceptorBulletType,

      ],


    },


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


};


Object.mergeDB(db, "DB_unit");


exports.db = db;
