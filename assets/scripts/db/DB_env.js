/**
 * Database of environmental blocks, planets and maps, basically everything related to a map.
 * @module lovec/db/DB_env
 */


const db = {


    param: {


        pla: {


            /**
             * Wind attribute multiplier for a planet.
             * @type {Array}
             * @lovecRow `PlanetGn` - pla
             * @lovecRow `number` - mtp
             */
            wind: [],


            /**
             * Global heat for a planet.
             * 1.0 here equals 100.0 HU.
             * @type {Array}
             * @lovecRow `PlanetGn` - pla
             * @lovecRow `number` - heat
             */
            heat: [],


            /**
             * Base pollution for a planet.
             * @type {Array}
             * @lovecRow `PlanetGn` - pla
             * @lovecRow `number` - pol
             */
            pol: [],


        },


        map: {


            /**
             * Noise layer drawn for a map.
             * @type {Array}
             * @lovecRow `string` - nameMap
             * @lovecRow `NoiseLayerArgumentArray` - noiseArgArr
             */
            noise: [],


            /**
             * Weather entries for a map (always permanent), used for campaign maps but works for any map.
             * No need to set weathers for those maps in editor, it doesn't work in campaign anyway.
             * @type {Array}
             * @lovecRow `string` - nameMap
             * @lovecRow `Array<string>` - nameWeas
             */
            weaEn: [],


            /**
             * Wind attribute multiplier for a map.
             * @type {Array}
             * @lovecRow `string` - nameMap
             * @lovecRow `number` - mtp
             */
            wind: [],


            /**
             * Global heat for a map.
             * @type {Array}
             * @lovecRow `string` - nameMap
             * @lovecRow `number` - heat
             */
            heat: [],


            /**
             * Base pollution for a map.
             * @type {Array}
             * @lovecRow `string` - nameMap
             * @lovecRow `number` - pol
             */
            pol: [],


        },


    },


    map: {


        rule: {


            /**
             * Default values for campaign rules of some planet.
             * @type {Array}
             * @lovecRow `string` - namePla
             * @lovecRow `CFunction<CampaignRules>` - ruleM
             */
            campaign: [],


            /**
             * Maps a planet to a rule setter function, that sets planet rules.
             * Fog should be set in campaign rules, you should ask Anuke why.
             * @type {Array}
             * @lovecRow `string` - namePla
             * @lovecRow `CFunction<Rules>` - ruleM
             */
            planet: [],


        },


        /**
         * Maps a random overlay tag to a region array getter function.
         * @type {Array}
         * @lovecRow `string` - tag
         * @lovecRow `F0Function<Array<TextureRegion>>` - regsF
         */
        randRegTag: [],


    },


    /* <------------------------------ CHUNK SPLITTER ------------------------------ */


    group: {


        map: {


            /**
             * These maps are considered as cave, where flying units cannot go over walls.
             * @type {Array<string>}
             */
            cave: [],


            /**
             * Impossible to build anything when playing these maps.
             * @type {Array<string>}
             */
            noBuild: [],


        },


    },


    /* <------------------------------ CHUNK SPLITTER ------------------------------ */


    grpParam: {


        floor: {


            /**
             * Used to set speed multiplier of floor blocks in the same material group.
             * See {@link ENV_materialFloor}.
             * @type {Array}
             * @lovecRow `string` - matGrp
             * @lovecRow `number` - spdMtp
             */
            speed: [

                "none", 1.0,
                "dirt", 0.9,
                "grass", 0.85,
                "gravel", 0.65,
                "ice", 0.9,
                "rock", 1.0,
                "salt", 0.8,
                "sand", 0.75,
                "snow", 0.8,

            ],


            /**
             * Maps a liquid floor material to some cache layer.
             * @type {Array}
             * @lovecRow `string` - matGrp
             * @lovecRow `CacheLayer` - cacheLay
             */
            cacheLayer: [

                "none", CacheLayer.water,
                "lava", fetchCacheLayer("lovec-lava"),
                "puddle", fetchCacheLayer("lovec-puddle"),
                "river", fetchCacheLayer("lovec-river"),
                "sea", fetchCacheLayer("lovec-sea"),

            ],


            /**
             * Used to more deeply set properties of some floor material.
             * @type {Array}
             * @lovecRow `string` - matGrp
             * @lovecRow `C2Function<Floor, boolean>` - propM - `ARGS`: flr, overwriteVanillaProp.
             */
            extraSetter: [

                "ice", (flr, overwriteVanillaProp) => {
                    if(overwriteVanillaProp) {
                      flr.dragMultiplier = 0.35;
                      flr.albedo = 0.6;
                    };
                },

                "lava", (flr, overwriteVanillaProp) => {
                    if(overwriteVanillaProp) {
                        flr.speedMultiplier = 0.05;
                        flr.albedo = 0.2;
                        flr.emitLight = true;
                        flr.lightRadius = 40.0;
                        if(flr.lightColor.equals(Color.white)) {
                            flr.lightColor = Color.valueOf("faae7560");
                        };
                    };
                },

            ],


            /**
             * These liquid floor materials have default `walkSound` (same as vanilla water).
             * Used when you don't feel like making a sound for the material.
             * @type {Array<string>}
             */
            splashMaterial: [

                "none",
                "lava",
                "puddle",
                "river",

            ],


        },


        /**
         * Tree parameters used for tree types.
         * See {@link ENV_baseTree}.
         * @type {Array}
         * @lovecRow `string` - treeGrp
         * @lovecRow `{scl: number, mag: number, wob: number, attrsF: F0Function<Array<AttrGn>>}`
         */
        tree: [

            "tree", {
                scl: 1.0,
                mag: 1.0,
                wob: 1.0,
                attrsF: () => [
                    "lovec-attr0blk-tree",
                    "lovec-attr0blk-hard-tree",
                ],
            },

            "bush", {
                scl: 0.5,
                mag: 1.5,
                wob: 0.7,
                attrsF: () => DB_item.db["map"]["attr"]["bush"].readCol(2, 0),
            },

            "fungi", {
                scl: 3.0,
                mag: 0.4,
                wob: 0.3,
                attrsF: () => [
                    "lovec-attr0blk-fungi",
                    "lovec-attr0blk-hard-fungi",
                ],
            },

        ],


    },


    /* <------------------------------ CHUNK SPLITTER ------------------------------ */


    /**
     * Maps name of some root node to localized name of some content.
     * @type {Array}
     * @lovecRow `string` - nameRoot
     * @lovecRow `ContentGn` - ct
     */
    nodeRootNameMap: [],


    /* <------------------------------ CHUNK SPLITTER ------------------------------ */


    /**
     * Extra teams to be added into {@link VARGEN.mainTeams}.
     * This affects team-based mechanics like CEP.
     * @type {Array<Team>}
     */
    extraMainTeam: [],


};


mergeDB(db, "DB_env");


exports.db = db;
