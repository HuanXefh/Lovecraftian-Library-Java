/* ----------------------------------------
 * NOTE:
 *
 * Database of environmental blocks, planets and maps, basically everything related to a map.
 * ---------------------------------------- */


const MDL_texture = require("lovec/mdl/MDL_texture");


const db = {


  param: {


    pla: {


      /* ----------------------------------------
       * NOTE:
       *
       * Wind attribute multiplier for a planet.
       * ---------------------------------------- */
      wind: [],


      /* ----------------------------------------
       * NOTE:
       *
       * Global heat for a planet.
       * 1.0 here equals 100.0 HU.
       * ---------------------------------------- */
      heat: [],


      /* ----------------------------------------
       * NOTE:
       *
       * Base pollution for a planet.
       * ---------------------------------------- */
      pol: [],


    },


    map: {


      /* ----------------------------------------
       * NOTE:
       *
       * Noise layer drawn for each map.
       * Format: {nmMap, args}.
       * Format for {args}: {nmTex, color, noiseScl, opac, spd, intens, windX, windY, off}.
       * ---------------------------------------- */
      noise: [],


      /* ----------------------------------------
       * NOTE:
       *
       * Weather entries for a map (always permanent), used for campaign maps but works for any map.
       * No need to set weathers for those maps in editor.
       * ---------------------------------------- */
      weaEn: [],


      /* ----------------------------------------
       * NOTE:
       *
       * Wind attribute multiplier for a map.
       * ---------------------------------------- */
      wind: [],


      /* ----------------------------------------
       * NOTE:
       *
       * Global heat for a map.
       * ---------------------------------------- */
      heat: [],


      /* ----------------------------------------
       * NOTE:
       *
       * Base pollution for a map.
       * ---------------------------------------- */
      pol: [],


    },


  },


  map: {


    rule: {


      /* ----------------------------------------
       * NOTE:
       *
       * Default values for campaign rules assigned to some planet.
       * Check {CampaignRules} class.
       * Format: {nmPla, ruleSetter}.
       * ---------------------------------------- */
      campaignRule: [],


      /* ----------------------------------------
       * NOTE:
       *
       * Maps a planet to a rule setter function.
       * Fog should be set in campaign rules, you should ask Anuke why.
       * Format: {nmPla, ruleSetter}.
       * ---------------------------------------- */
      planetRule: [],


    },


    /* ----------------------------------------
     * NOTE:
     *
     * Maps a random overlay region tag to a region array getter function.
     * Format: {tag, regsGetter}.
     * ---------------------------------------- */
    randRegTag: [

      "rock", MDL_texture._randRegsGetter("lovec-ov0rand-rock"),
      "rock-sand", MDL_texture._randRegsGetter("lovec-ov0rand-rock-sand"),
      "rock-sand-dark", MDL_texture._randRegsGetter("lovec-ov0rand-rock-sand-dark"),
      "rock-sand-red", MDL_texture._randRegsGetter("lovec-ov0rand-rock-sand-red"),

    ],


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  group: {


    map: {


      /* ----------------------------------------
       * NOTE:
       *
       * These maps are considered as cave, where flying units cannot go over walls.
       * ---------------------------------------- */
      cave: [],


    },


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  grpParam: {


    floor: {


      /* ----------------------------------------
       * NOTE:
       *
       * Used to set speed multiplier of floor blocks in the same material group.
       * See {ENV_materialFloor}.
       * Format: {matGrp, spdMtp}.
       * ---------------------------------------- */
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


      /* ----------------------------------------
       * NOTE:
       *
       * Maps a liquid floor material to some cache layer.
       * ---------------------------------------- */
      cacheLayer: [

        "none", CacheLayer.water,
        "lava", fetchCacheLayer("lovec-lava"),
        "puddle", fetchCacheLayer("lovec-puddle"),
        "river", fetchCacheLayer("lovec-river"),
        "sea", fetchCacheLayer("lovec-sea"),

      ],


      /* ----------------------------------------
       * NOTE:
       *
       * Used to more deeply set properties of the floor.
       * ---------------------------------------- */
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


      /* ----------------------------------------
       * NOTE:
       *
       * These liquid floor materials have {Sounds.splash} as the {walkSound}.
       * Used when you don't feel like making a sound for the material.
       * ---------------------------------------- */
      splashMaterial: [

        "none",
        "lava",
        "puddle",
        "river",

      ],


    },


    /* ----------------------------------------
     * NOTE:
     *
     * Tree parameters used for tree types.
     * See {ENV_baseTree}.
     * ---------------------------------------- */
    tree: [

      "tree", {
        scl: 1.0,
        mag: 1.0,
        wob: 1.0,
        attrsGetter: () => [
          "lovec-attr0blk-tree",
          "lovec-attr0blk-hard-tree",
        ],
      },

      "bush", {
        scl: 0.5,
        mag: 1.5,
        wob: 0.7,
        attrsGetter: () => [
          // TODO: Add bush dynamic attributes.
        ],
      },

      "fungi", {
        scl: 3.0,
        mag: 0.4,
        wob: 0.3,
        attrsGetter: () => [
          "lovec-attr0blk-fungi",
          "lovec-attr0blk-hard-fungi",
        ],
      },

    ],


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  /* ----------------------------------------
   * NOTE:
   *
   * Maps name of a node root to the localized name of a content.
   *
   * Example:
   * "core-shard", "serpulo",    // Sets the name of root with {Blocks.coreShard} to localized name of {Planets.serpulo}
   * ---------------------------------------- */
  nodeRootNameMap: [],


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  /* ----------------------------------------
   * NOTE:
   *
   * Extra teams to be added into {VARGEN.mainTeams}.
   * This affects team-based mechanics like CEP.
   * ---------------------------------------- */
  extraMainTeam: [],


};


Object.mergeDB(db, "DB_env");


exports.db = db;
