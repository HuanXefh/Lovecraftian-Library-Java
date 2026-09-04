/**
 * Database of block properties. Does not include environmental blocks.
 * @module lovec/db/DB_block
 */


const db = {


    /* <------------------------------ CHUNK SPLITTER ------------------------------ */


    param: {


        cep: {


            /**
             * Core energy points provided by a block.
             * Core block provides 5 points by default.
             * @type {Array}
             * @lovecRow `BlockGn` - blk
             * @lovecRow `number|FFunction<Building>` - cepProv
             */
            prov: [],


            /**
             * Core energy points used by a block.
             * @type {Array}
             * @lovecRow `BlockGn` - blk
             * @lovecRow `number|FFunction<Building>` - cepUse
             */
            use: [],


        },


    },


    /* <------------------------------ CHUNK SPLITTER ------------------------------ */


    map: {


        /**
         * The only faction a block belongs to.
         * @type {Array}
         * @lovecRow {BlockGn} blk
         * @lovecRow {string} faction
         */
        faction: [],


        /**
         * Factory family map. Factories included in the same processes belong to the same family.
         * For instance, both jaw crusher and hammer crusher can be classified as rock crusher.
         * A factory can be included in multiple families.
         * @type {Array}
         * @lovecRow {BlockGn} blk
         * @lovecRow {string} fami
         */
        facFami: [],


    },


    /* <------------------------------ CHUNK SPLITTER ------------------------------ */


    group: {


        noRcDict: {


            /**
             * Consumption of these blocks won't be parsed for recipe dictionary.
             * @type {Array<BlockGn>}
             */
            cons: [],


            /**
             * Production of these blocks won't be parsed for recipe dictionary.
             * @type {Array<BlockGn>}
             */
            prod: [],


        },


        /**
         * Material groups, used mainly for corrosion.
         * @type {Object<string, Array<BlockGn>>}
         * @lovecExtensible {@link LCModDBRegister.blkMat}
         */
        material: {


            wood: [],


            copper: [],


            lead: [],


            iron: [],


            steel: [],


            galvanized: [],


            stainless: [],


            glass: [],


            cement: [],


            rubber: [],


        },


        /**
         * These blocks will trigger item reaction.
         * Only works for item blocks.
         * @type {Array<BlockGn>}
         */
        exposed: [],


        /**
         * These blocks will get damaged if containing viscous fluids.
         * @type {Array<BlockGn>}
         */
        cloggable: [],


        /**
         * These blocks can short-circuit if soaked in water.
         * @type {Array<BlockGn>}
         */
        shortCircuit: [],


        /**
         * These blocks won't get involved in reaction at all.
         * No need to put core blocks here.
         * @type {Array<BlockGn>}
         */
        noReac: [],


        /**
         * These blocks won't drop loot when destroyed.
         * @type {Array<BlockGn>}
         */
        noLoot: [],


        /**
         * These blocks won't create remains upon destruction.
         * No need for core blocks.
         * @type {Array<BlockGn>}
         */
        noRemains: [],


        /**
         * If a mod has customized building debris, don't create remains.
         * @type {Array<string>}
         */
        noRemainsMod: [

            "aquarion",

        ],


    },


    /* <------------------------------ CHUNK SPLITTER ------------------------------ */


    grpParam: {


        /**
         * Color used for faction-related texts.
         * @type {Array}
         * @lovecRow `string` - faction
         * @lovecRow `string` - colorStr
         */
        factionColor: [

            "none", "999999",

            "carbonic", "67798e",
            "emerald-tide", "748e6b",
            "enclosure", "d4c0d8",
            "hexagram-steel", "bfbfbf",
            "other-world", "d1cb9e",
            "outpost-military", "8ca9e8",
            "rim-builder", "acacd8",
            "zeta-chemistry", "806c94",

        ],


        /**
         * Base pressure resistance for each material group.
         * @type {Array}
         * @lovecRow `string` - matGrp
         * @lovecRow `number` - presRes
         */
        presRes: [

            "wood", 1.0,
            "copper", 7.0,
            "lead", 7.0,
            "iron", 5.0,
            "steel", 12.0,
            "galvanized", 12.0,
            "stainless", 12.0,
            "glass", 10.0,
            "cement", 5.0,
            "rubber", 3.0,

        ],


        /**
         * Base vacuum resistance for each material group.
         * @type {Array}
         * @lovecRow `string` - matGrp
         * @lovecRow `number` - vacRes
         */
        vacRes: [

            "wood", 0.0,
            "copper", -3.0,
            "lead", -3.0,
            "iron", -3.0,
            "steel", -7.0,
            "galvanized", -7.0,
            "stainless", -7.0,
            "glass", -10.0,
            "cement", -3.0,
            "rubber", -7.0,

        ],


        /**
         * Base corrosion resistance for each material group.
         * @type {Array}
         * @lovecRow `string` - matGrp
         * @lovecRow `number` - corRes
         */
        corRes: [

            "wood", 1.0,
            "copper", 1.5,
            "lead", 1.5,
            "iron", 1.5,
            "steel", 2.0,
            "galvanized", 4.0,
            "stainless", 6.5,
            "glass", 12.5,
            "cement", 3.0,
            "rubber", 8.5,

        ],


        /**
         * Base heat resistance for each material group.
         * @type {Array}
         * @lovecRow `string` - matGrp
         * @lovecRow `number` - heatRes
         */
        heatRes: [

            "wood", 60.0,
            "copper", 800.0,
            "lead", 300.0,
            "iron", 1400.0,
            "steel", 1000.0,
            "galvanized", 1000.0,
            "stainless", 1000.0,
            "glass", 250.0,
            "cement", 300.0,
            "rubber", 120.0,

        ],


        /**
         * Maps a wire material to texture region name.
         * @type {Array}
         * @lovecRow `string` - wireMat
         * @lovecRow `string` - regStr
         */
        wireMatReg: [

            "copper", "lovec-ast-wire-copper",

        ],


    },


    /* <------------------------------ CHUNK SPLITTER ------------------------------ */


    class: {


        map: {


            /**
             * Used to read shield amount.
             * @type {Array}
             * @lovecRow `ContentTypeGn` - type
             * @lovecRow `F2Function<Building, boolean, number>` - shieldF - `ARGS`: b, isSelfShield.
             */
            shield: [

                ShieldWall, (b, isSelfShield) => b.shield,
                ForceProjector, (b, isSelfShield) => isSelfShield ? 0.0 : (b.block.shieldHealth + b.block.phaseShieldBoost * b.phaseHeat - b.buildup),

            ],


            /**
             * Used to read drill speed for display.
             * @type {Array}
             * @lovecRow `ContentTypeGn` - type
             * @lovecRow `F2Function<Block, boolean, number>` - drillSpdF - `ARGS`: blk, boosted.
             */
            drillSpd: [

                Drill, (blk, boosted) => Math.pow(blk.size, 2) / blk.drillTime * 60.0 * (boosted ? Math.pow(blk.liquidBoostIntensity, 2) : 1.0),
                BurstDrill, (blk, boosted) => Math.pow(blk.size, 2) / blk.drillTime * 60.0 * (boosted ? blk.liquidBoostIntensity : 1.0),
                BeamDrill, (blk, boosted) => blk.size / blk.drillTime * 60.0 * (boosted ? blk.optionalBoostIntensity : 1.0),

                "BLK_rangeWallDrill", (blk, boosted) => Math.pow(blk.range, 2) / blk.drillTime * 60.0 * (boosted ? blk.optionalBoostIntensity : 1.0),

            ],


            /**
             * Used to read generalized craft time for blocks.
             * This affects calculation of consumption/production rates.
             * @type {Array}
             * @lovecRow `ContentTypeGn` - type
             * @lovecRow `F3Function<Block, boolean, UnlockableContent|null, number>` - craftTimeF - `ARGS`: blk, isDrillTime, ctUsed.
             */
            craftTime: [

                Drill, (blk, isDrillTime, ct) => isDrillTime ? blk.drillTime : tryJsProp(blk, "drillItemDur", blk.drillTime),
                BeamDrill, (blk, isDrillTime, ct) => isDrillTime ? blk.drillTime : tryJsProp(blk, "drillItemDur", blk.drillTime),
                WallCrafter, (blk, isDrillTime, ct) => isDrillTime ? blk.drillTime : blk.boostItemUseTime,

                Pump, (blk, isDrillTime, ct) => blk.consumeTime,
                Fracker, (blk, isDrillTime, ct) => blk.itemUseTime,

                ConsumeGenerator, (blk, isDrillTime, ct) => blk.itemDuration * blk.itemDurationMultipliers.get(ct, 1.0),
                NuclearReactor, (blk, isDrillTime, ct) => blk.itemDuration,
                ImpactReactor, (blk, isDrillTime, ct) => blk.itemDuration,

                GenericCrafter, (blk, isDrillTime, ct) => blk.craftTime,

                Reconstructor, (blk, isDrillTime, ct) => blk.constructTime,

                MendProjector, (blk, isDrillTime, ct) => blk.useTime,
                RegenProjector, (blk, isDrillTime, ct) => blk.optionalUseTime,
                OverdriveProjector, (blk, isDrillTime, ct) => blk.useTime,
                ForceProjector, (blk, isDrillTime, ct) => blk.phaseUseTime,

                LandingPad, (blk, isDrillTime, ct) => blk.cooldownTime,

                /* <---------- Carpe Diem ----------> */

                fetchClass("carpediem.world.blocks.power.ThermalConsumeGenerator", true), (blk, isDrillTime, ct) => blk.itemDuration,

                fetchClass("carpediem.world.blocks.payloads.PayloadBurner", true), (blk, isDrillTime, ct) => blk.burnDuration,

                /* <---------- New Horizon ----------> */

                fetchClass("newhorizon.expand.block.special.HyperReactor", true), (blk, isDrillTime, ct) => blk.itemDuration,
                fetchClass("newhorizon.expand.block.power.MultiBlockConsumeGenerator", true), (blk, isDrillTime, ct) => blk.itemDuration * blk.itemDurationMultipliers.get(ct, 1.0),

                fetchClass("newhorizon.expand.block.production.factory.MultiBlockCrafter", true), (blk, isDrillTime, ct) => blk.craftTime,

            ],


        },


        group: {


            visibility: {


                /**
                 * These visibilities will be treated as shown.
                 * @type {Array<BuildVisibility>}
                 */
                shown: [

                    BuildVisibility.shown,
                    BuildVisibility.coreZoneOnly,
                    BuildVisibility.campaignOnly,
                    BuildVisibility.lightingOnly,
                    BuildVisibility.fogOnly,

                ],


                /**
                 * These visibilities will be treated as hidden.
                 * @type {Array<BuildVisibility>}
                 */
                hidden: [

                    BuildVisibility.hidden,
                    BuildVisibility.debugOnly,
                    BuildVisibility.editorOnly,
                    BuildVisibility.worldProcessorOnly,
                    BuildVisibility.sandboxOnly,

                ],


            },


            reload: {


                /**
                 * Reload bar will be shown for blocks of these classes.
                 * @type {Array<ContentTypeGn>}
                 */
                class: [

                    MassDriver,

                ],


                /**
                 * Blocks of these classes have reload in (0.0, 1.0).
                 * @type {Array<ContentTypeGn>}
                 */
                frac: [],


                /**
                 * Blocks of these classes have reversed reload calculation (decreasing).
                 * @type {Array<ContentTypeGn>}
                 */
                rev: [

                    LaserTurret,

                ],


                /**
                 * Combination of `frac` and `rev`.
                 * @type {Array<ContentTypeGn>}
                 */
                revFrac: [

                    MassDriver,

                ],


            },


            ore: {


                /**
                 * Block classes listed here can be a wall ore on its own.
                 * @type {Array<ContentTypeGn>}
                 */
                wall: [

                    StaticWall,
                    TallBlock,
                    TreeBlock,

                ],


            },


            payload: {


                /**
                 * Maps a class to its payload key name.
                 * @type {Array}
                 * @lovecRow `ContentTypeGn` - type
                 * @lovecRow `string` - key
                 */
                key: [

                    PayloadBlock, "payload",
                    PayloadConveyor, "item",

                ],


                /**
                 * These blocks will be treated as payload I/O sites.
                 */
                site: {


                    /**
                     * Payload sites with fixed direction.
                     * @type {Array<ContentTypeGn>}
                     */
                    fixed: [

                        PayloadConveyor,

                    ],


                    /**
                     * Payload sites with dynamic direction.
                     * @type {Array<ContentTypeGn>}
                     */
                    dynamic: [

                        PayloadRouter,

                    ],


                },


            },


            /**
             * Used for {@link MDL_cond}.
             * @type {Object<string, Array>}
             */
            condition: {


                /** @type {Array<ContentTypeGn>} */
                drill: [

                    Drill,
                    BeamDrill,

                    "BLK_baseDrill",

                ],


                /** @type {Array<ContentTypeGn>} */
                harvester: [

                    "BLK_baseHarvester",

                ],


                /** @type {Array<[ContentTypeGn, FFunction<Block, boolean>]>} */
                noSide: [

                    [ArmoredConveyor, blk => true],
                    [ArmoredConduit, blk => true],
                    [Duct, blk => blk.armored],

                ],


                /** @type {Array<ContentTypeGn>} */
                conveyor: [

                    Conveyor,

                ],


                /** @type {Array<ContentTypeGn>} */
                stackConveyor: [

                    StackConveyor,

                ],


                /** @type {Array<ContentTypeGn>} */
                duct: [

                    Duct,

                ],


                /** @type {Array<ContentTypeGn>} */
                bridge: [

                    ItemBridge,
                    DirectionBridge,

                ],


                /** @type {Array<ContentTypeGn>} */
                gate: [

                    Junction,
                    DuctJunction,
                    Router,
                    DuctRouter,
                    Sorter,
                    OverflowGate,
                    OverflowDuct,
                    Unloader,
                    DirectionalUnloader,

                    "BLK_baseFluidDistributor",

                ],


                /** @type {Array<ContentTypeGn>} */
                router: [

                    Router,

                ],


                /** @type {Array<ContentTypeGn>} */
                massDriver: [

                    MassDriver,

                ],


                /** @type {Array<ContentTypeGn>} */
                container: [

                    StorageBlock,

                ],


                /** @type {Array<ContentTypeGn>} */
                core: [

                    CoreBlock,

                ],


                /** @type {Array<ContentTypeGn>} */
                pump: [

                    Pump,

                ],


                /** @type {Array<ContentTypeGn>} */
                pressurePump: [

                    "BLK_pressurePump",

                ],


                /** @type {Array<ContentTypeGn>} */
                conduit: [

                    Conduit,

                ],


                /** @type {Array<ContentTypeGn>} */
                fluidContainer: [

                    LiquidRouter,

                ],


                /** @type {Array<ContentTypeGn>} */
                fluidRouter: [

                    "BLK_directionalFluidRouter",
                    "BLK_fluidOverflowGate",

                ],


                /** @type {Array<ContentTypeGn>} */
                generator: [

                    PowerGenerator,

                    "BLK_generatorRecipeFactory",

                ],


                /** @type {Array<[ContentTypeGn, FFunction<Block, boolean>]>} */
                powerReactor: [

                    [ConsumeGenerator, blk => blk.explodeOnFull && blk.outputLiquid != null],
                    [NuclearReactor, blk => true],
                    [ImpactReactor, blk => true],
                    [VariableReactor, blk => true],

                ],


                /** @type {Array<ContentTypeGn>} */
                transmitter: [

                    PowerNode,
                    BeamNode,

                ],


                /** @type {Array<ContentTypeGn>} */
                cable: [

                    "BLK_cable",

                ],


                /** @type {Array<ContentTypeGn>} */
                armoredCable: [

                    "BLK_armoredCable",

                ],


                /** @type {Array<ContentTypeGn>} */
                factory: [

                    GenericCrafter,
                    Separator,

                ],


                /** @type {Array<ContentTypeGn>} */
                multiCrafter: [

                    "BLK_recipeFactory",

                    /* <---------- Carpe Diem ----------> */

                    fetchClass("carpediem.world.blocks.crafting.RecipeCrafter", true),

                    /* <---------- MultiCrafter ----------> */

                    fetchClass("dev.jojofr.multicrafter.MultiCrafterBlock", true),

                ],


                /** @type {Array<ContentTypeGn>} */
                light: [

                    LightBlock,

                    "BLK_light",

                ],


                /** @type {Array<ContentTypeGn>} */
                projector: [

                    OverdriveProjector,

                    "BLK_statusProjector",

                ],


                /** @type {Array<ContentTypeGn>} */
                repairer: [

                    MendProjector,
                    RegenProjector,
                    RepairTurret,
                    RepairTower,

                ],


                /** @type {Array<ContentTypeGn>} */
                shield: [

                    ForceProjector,

                ],


                /** @type {Array<ContentTypeGn>} */
                wall: [

                    Wall,

                ],


                /** @type {Array<ContentTypeGn>} */
                turret: [

                    BaseTurret,

                    /* <---------- New Horizon ----------> */

                    fetchClass("newhorizon.expand.block.defence.FireExtinguisher", true),
                    fetchClass("newhorizon.expand.block.defence.ShockwaveGenerator", true),
                    fetchClass("newhorizon.expand.block.commandable.CommandableAttackerBlock", true),

                ],


            },


        },


    },


    /* <------------------------------ CHUNK SPLITTER ------------------------------ */


};


LCModDBRegister
.apply("blkMat", db["group"]["material"]);


mergeDB(db, "DB_block");


exports.db = db;
