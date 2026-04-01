/**
 * Database of block properties. Does not include environmental blocks.
 */


const db = {


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  param: {


    cep: {


      /**
       * Core energy points provided by a block.
       * Core block provides 5 points by default.
       * <br> <ROW>: blk, cepProv.
       * <br> <DYNAMIC>: b => cepProv.
       */
      prov: [],


      /**
       * Core energy points used by a block.
       * <br> <ROW>: blk, cepUse.
       * <br> <DYNAMIC>: b => cepUse.
       */
      use: [],


    },


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  map: {


    /**
     * The only faction a block belongs to.
     * <br> <ROW>: blk, faction.
     */
    faction: [],


    /**
     * Factory family map. Factories included in the same processes belong to the same family.
     * For instance, both jaw crusher and hammer crusher can be classified as rock crusher.
     * A factory can be included in multiple families.
     * <br> <ROW>: blk, fami.
     */
    facFami: [],


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  group: {


    noRcDict: {


      /**
       * Consumption of these blocks won't be parsed for recipe dictionary.
       * <br> <ROW>: blk.
       */
      cons: [],


      /**
       * Production of these blocks won't be parsed for recipe dictionary.
       * <br> <ROW>: blk.
       */
      prod: [],


    },


    /**
     * Material groups, used mainly for corrosion.
     * <br> <ROW-xxx>: blk.
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
     * <br> <ROW>: blk.
     */
    exposed: [],


    /**
     * These blocks will get damaged if containing viscous fluids.
     * <br> <ROW>: blk.
     */
    cloggable: [],


    /**
     * These blocks can short-circuit if soaked in water.
     * <br> <ROW>: blk.
     */
    shortCircuit: [],


    /**
     * These blocks won't get involved in reaction at all.
     * No need to put core blocks here.
     * <br> <ROW>: blk.
     */
    noReac: [],


    /**
     * These blocks won't drop loot when destroyed.
     * <br> <ROW>: blk.
     */
    noLoot: [],


    /**
     * These blocks won't create remains upon destruction.
     * No need for 1-block sized blocks and core blocks.
     * <br> <ROW>: blk.
     */
    noRemains: [

      "multi-block-lib-link-entity-1",
      "multi-block-lib-link-entity-2",
      "multi-block-lib-link-entity-3",
      "multi-block-lib-link-entity-4",
      "multi-block-lib-link-entity-liquid-1",
      "multi-block-lib-link-entity-liquid-2",
      "multi-block-lib-link-entity-liquid-3",
      "multi-block-lib-link-entity-liquid-4",
      "multi-block-lib-placeholder-entity-1",
      "multi-block-lib-placeholder-entity-2",
      "multi-block-lib-placeholder-entity-3",
      "multi-block-lib-placeholder-entity-4",

    ],


    /**
     * If a mod has customized building debris, don't create remains.
     * <br> <ROW>: nmMod.
     */
    noRemainsMod: [

      "aquarion",

    ],


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  grpParam: {


    /**
     * Color used for faction-related texts.
     * <br> <ROW>: faction, color.
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
     * <br> <ROW>: matGrp, presRes.
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
     * <br> <ROW>: matGrp, vacRes.
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
     * <br> <ROW>: matGrp, corRes.
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
     * <br> <ROW>: matGrp, heatRes.
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
     * <br> <ROW>: wireMat, regStr.
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
       * <br> <ROW>: javaCls, shieldGetter.
       * <br> <ARGS>: b, isSelfShield.
       */
      shield: [

        ShieldWall, (b, isSelfShield) => b.shield,
        ForceProjector, (b, isSelfShield) => isSelfShield ? 0.0 : (b.block.shieldHealth + b.block.phaseShieldBoost * b.phaseHeat - b.buildup),
        DirectionalForceProjector, (b, isSelfShield) => isSelfShield ? 0.0 : (b.block.shieldHealth - b.buildup),

      ],


      /**
       * Used to read drill speed for display.
       * <br> <ROW>: javaCls, drillSpdGetter.
       * <br> <ARGS>: blk, boosted.
       */
      drillSpd: [

        Drill, (blk, boosted) => Math.pow(blk.size, 2) / blk.drillTime * 60.0 * (boosted ? Math.pow(blk.liquidBoostIntensity, 2) : 1.0),
        BeamDrill, (blk, boosted) => blk.size / blk.drillTime * 60.0 * (boosted ? blk.optionalBoostIntensity : 1.0),

      ],


      /**
       * Used to read generalized craft time for blocks.
       * This affects calculation of consumption/production rates.
       * <br> <ROW>: javaCls, craftTimeGetter.
       * <br> <ARGS>: blk, isDrillTime, ct.
       */
      craftTime: [

        Drill, (blk, isDrillTime, ct) => isDrillTime ? blk.drillTime : tryJsProp(blk, "drillItmDur", blk.drillTime),
        BeamDrill, (blk, isDrillTime, ct) => isDrillTime ? blk.drillTime : tryJsProp(blk, "drillItmDur", blk.drillTime),
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

      ],


    },


    group: {


      reload: {


        /**
         * These blocks have reload in (0.0, 1.0).
         * <br> <ROW>: javaCls.
         */
        frac: [],


        /**
         * These blocks have reversed reload calculation (decreasing).
         * <br> <ROW>: javaCls.
         */
        rev: [

          LaserTurret,

        ],


        /**
         * Combination of `frac` and `rev`.
         * <br> <ROW>: javaCls.
         */
        revFrac: [

          MassDriver,

        ],


      },


      /**
       * Maps a class to its payload key name.
       * <br> <ROW>: javaCls, key.
       */
      payloadKey: [

        PayloadBlock, "payload",
        PayloadConveyor, "item",

      ],


      /**
       * These blocks will be treated as payload I/O sites.
       */
      payloadSite: {


        /**
         * Payload sites with fixed direction.
         * <br> <ROW>: javaCls.
         */
        fixed: [

          PayloadConveyor,

        ],


        /**
         * Payload sites with dynamic direction.
         * <br> <ROW>: javaCls.
         */
        dynamic: [

          PayloadRouter,

        ],


      },


    },


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


};


Object.mergeDB(db, "DB_block");


exports.db = db;
