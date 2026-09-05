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
             * Maps type to a unit class or entity template.
             * @type {Array}
             * @lovecRow `string` - type
             * @lovecRow `Class|Prov<ContentTemplate>` - parent
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

                "lovec-mech", prov(() => require("lovec/temp/unit/entity/ENTITY_mech")),
                "lovec-air", prov(() => require("lovec/temp/unit/entity/ENTITY_airUnit")),
                "lovec-jet", prov(() => require("lovec/temp/unit/entity/ENTITY_jet")),

            ],


        },


        /**
         * Faction for unit type.
         * @type {Array}
         * @lovecRow `UnitTypeGn` - utp
         * @lovecRow `string` - faction
         */
        faction: [],


    },


    /* <------------------------------ CHUNK SPLITTER ------------------------------ */


    group: {


        /**
         * These units are not robots, and they don't create remains upon death.
         * @type {Array<UnitTypeGn>}
         */
        nonRobot: [

            "renale",
            "latum",

        ],


        /**
         * These units are rare (?) exceptions that don't create remains.
         * No need to add biotic units here.
         * @type {Array<UnitTypeGn>}
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
         * @type {Array<string>}
         */
        noRemainsMod: [

            "aquarion",

        ],


    },


    /* <------------------------------ CHUNK SPLITTER ------------------------------ */


    grpParam: {


        /**
         * Outline parameters used for units & turrets in some mods.
         * Note that only contents created with content template will be affected.
         * @type {Array}
         * @lovecRow `string` - nameMod
         * @lovecRow `[number, ColorGn]` - [stroke, color]
         */
        outline: [

            "loveclab", [2, "373a4d"],
            "projreind", [2, "373a4d"],

        ],


    },


    /* <------------------------------ CHUNK SPLITTER ------------------------------ */


    class: {


        bullet: {


            /**
             * These bullets can deal damage remotely.
             * @type {Array<ContentTypeGn>}
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


mergeDB(db, "DB_unit");


exports.db = db;
