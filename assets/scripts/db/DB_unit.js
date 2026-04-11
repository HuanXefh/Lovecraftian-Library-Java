/**
 * Database of unit properties (sometimes for bullets).
 * Entity id mapping is done here.
 * @module lovec/db/DB_unit
 */


const db = {


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  map: {


    entity: {


      /**
       * Maps type to a unit class and extra id if possible.
       * Make sure the id here is not used by vanilla game!
       * <br> <ROW>: type, javaCls0id.
       */
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


      /**
       * Used to define new entity types.
       * <br> <ROW>: id, tempGetter.
       */
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


    /**
     * Faction for unit type.
     * <br> <ROW>: utp, faction.
     */
    faction: [],


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  group: {


    /**
     * These units are related to core in some way (not only spawned by core).
     * <br> <ROW>: utp.
     */
    coreUnit: [],


    /**
     * These units are not robots, and they don't create remains upon death.
     * <br> <ROW>: utp.
     */
    nonRobot: [

      "renale",
      "latum",

    ],


    /**
     * These units are rare (?) exceptions that don't create remains.
     * No need to add biotic units here.
     * <br> <ROW>: utp.
     */
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


    /**
     * If a mod has customized unit debris, don't create extra remains.
     * <br> <ROW>: nmMod.
     */
    noRemainsMod: [

      "aquarion",

    ],


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  grpParam: {


    /**
     * Outline parameters used for units & turrets in some mod.
     * Note that only contents created with content template will be affected.
     * <br> <ROW>: nmMod, [stroke, color].
     */
    outline: [

      "loveclab", [2, "373a4d"],
      "projreind", [2, "373a4d"],

    ],


    /**
     * Maps a type to some template tag.
     * The type used here can affect damage dealt by Lovec bullets.
     * <br> <ROW>: type, tempTag.
     */
    typeTagMap: [

      // Large and powerful units
      "experimental", "utp-exp",
      // Non-robot units
      "biotic", "utp-bio",
      // Small ground units
      "infantry", "utp-inf",
      // Large mech units
      "titan", "utp-titan",
      // Large leg units
      "behemoth", "utp-beh",
      // Wheeled units
      "vehicle", "utp-veh",
      // Regular air units
      "aircraft", "utp-air",
      // Balloon air units
      "airship", "utp-aship",
      // Small rotor air units
      "drone", "utp-drone",
      // Satellite units
      "satellite", "utp-sat",
      // Large space air units
      "spacecraft", "utp-spa",
      // Small naval units
      "boat", "utp-boat",
      // Regular naval units
      "ship", "utp-ship",
      // Submarine units
      "submarine", "utp-sub",

    ],


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  class: {


    btp: {


      /**
       * These bullets can deal damage remotely.
       * <br> <ROW>: javaCls.
       */
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
