/**
 * Database of item properties.
 * @module lovec/db/DB_item
 */


const db = {


    /* <------------------------------ CHUNK SPLITTER ------------------------------ */


    param: {


        fuel: {


            /**
             * Fuel parameters for an item.
             * @type {Array}
             * @lovecRow `ItemGn` - item
             * @lovecRow `[number, number]` - [fuelPon, fuelLvl]
             */
            item: [

                "coal", [8.0, 8.0],
                "spore-pod", [4.0, 10.0],
                "pyratite", [8.0, 13.25],

            ],


            /**
             * Fuel parameters for a fluid.
             * @type {Array}
             * @lovecRow `LiquidGn` - liq
             * @lovecRow `[number, number]` - [consRate, fuelLvl]
             */
            fluid: [],


        },


    },


    /* <------------------------------ CHUNK SPLITTER ------------------------------ */


    map: {


        /**
         * Maps an attribute to some resource, mostly for dynamic attribute output.
         * @type {Object<string, Array>}
         * @lovecExtensible {@link LCModDBRegister.attrRsMap}
         */
        attr: {


            /**
             * @type {Array}
             * @lovecRow `AttrGn` - attr
             * @lovecRow `ResourceGn` - rs
             */
            bush: [],


            /**
             * @type {Array}
             * @lovecRow `AttrGn` - attr
             * @lovecRow `ResourceGn` - rs
             */
            dpliq: [],


            /**
             * @type {Array}
             * @lovecRow `AttrGn` - attr
             * @lovecRow `ResourceGn` - rs
             */
            rock: [],


            /**
             * @type {Array}
             * @lovecRow `AttrGn` - attr
             * @lovecRow `ResourceGn` - rs
             */
            tree: [],


            /**
             * @type {Array}
             * @lovecRow `AttrGn` - attr
             * @lovecRow `ResourceGn` - rs
             */
            vent: [],


        },


    },


    /* <------------------------------ CHUNK SPLITTER ------------------------------ */


    group: {


        /**
         * Fuel group presets used for blacklists/whitelists.
         * @type {Object<string, Array>}
         */
        fuel: {


            /** @type {Array<ResourceGn>} */
            biotic: [

                "spore-pod",

            ],


        },


        /**
         * Items here are not mineable by regular drills by default, a sand miner is required.
         * @type {Array<ItemGn>}
         */
        sand: [

            "sand",

        ],


        /**
         * Items here can be crushed for aggregate.
         * Used for recipe generation.
         * @type {Array}
         * @lovecRow `ItemGn` - item
         * @lovecRow `number` - reqAmtMtp
         */
        aggregate: [],


        /**
         * Items here can be crushed for biomass powder.
         * Used for recipe generation.
         * @type {Array}
         * @lovecRow `ItemGn` - item
         * @lovecRow `number` - reqAmtMtp
         */
        biomass: [],


        /**
         * Items considered acidic.
         * @type {Array<ItemGn>}
         */
        acidic: [],


        /**
         * Items considered basic.
         * @type {Array<ItemGn>}
         */
        basic: [],


        /**
         * Items like sodium, which react with water and explode.
         * @type {Array<ItemGn>}
         */
        sodium: [],


    },


    /* <------------------------------ CHUNK SPLITTER ------------------------------ */


    intmd: {


        /**
         * Intermediate tags, which are used in `rs.tempTags`.
         * Items and fluids with these tags will be categorized in `VARGEN.intmds`.
         * If tag sprite ("rs0tag-<tag>") is found, it will be used for icon tag generation.
         * @type {Array<string>}
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
            "rs-crdg",

            /* dynamic */

            "rs-clean",
            "rs-pure",
            "rs-high0pres",
            "rs-med0pres",
            "rs-low0pres",
            "rs-conc",
            "rs-dry",
            "rs-hot",
            "rs-cold",
            "rs-inact",

        ],


        /**
         * Some intermediate tags are added automatically if condition met.
         * @type {Array}
         * @lovecRow `string` - tag
         * @lovecRow `FFunction<Resource, boolean>` - boolF
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
         * @type {Array}
         * @lovecRow `string` - tag
         * @lovecRow `string` - name
         */
        insertName: [

            "rs-clean", MDL_bundle.getTerm("common", "intmd-clean"),
            "rs-pure", MDL_bundle.getTerm("common", "intmd-pure"),
            "rs-high0pres", MDL_bundle.getTerm("common", "intmd-high-pres"),
            "rs-med0pres", MDL_bundle.getTerm("common", "intmd-med-pres"),
            "rs-low0pres", MDL_bundle.getTerm("common", "intmd-low-pres"),
            "rs-conc", MDL_bundle.getTerm("common", "intmd-conc"),
            "rs-dry", MDL_bundle.getTerm("common", "intmd-dry"),
            "rs-wet", MDL_bundle.getTerm("common", "intmd-wet"),
            "rs-hot", MDL_bundle.getTerm("common", "intmd-hot"),
            "rs-cold", MDL_bundle.getTerm("common", "intmd-cold"),
            "rs-inact", MDL_bundle.getTerm("common", "intmd-inact"),

        ],


    },


    /* <------------------------------ CHUNK SPLITTER ------------------------------ */


};


LCModDBRegister
.apply("attrRsMap", db["map"]["attr"]);


mergeDB(db, "DB_item");


exports.db = db;
