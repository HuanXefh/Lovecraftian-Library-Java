/**
 * Database of environmental blocks, planets and maps, basically everything related to a map.
 * @module lovec/db/DB_env
 */


const db = {


  param: {


    pla: {


      /**
       * Wind attribute multiplier for a planet.
       * <br> <ROW>: pla, mtp.
       */
      wind: [],


      /**
       * Global heat for a planet.
       * 1.0 here equals 100.0 HU.
       * <br> <ROW>: pla, heat.
       */
      heat: [],


      /**
       * Base pollution for a planet.
       * <br> <ROW>: pla, pol.
       */
      pol: [],


    },


    map: {


      /**
       * Noise layer drawn for each map.
       * <br> <ROW>: nmMap, args.
       * <br> <ROW-args>: nmTex, color, noiseScl, opac, spd, intens, windX, windY, off.
       */
      noise: [],


      /**
       * Weather entries for a map (always permanent), used for campaign maps but works for any map.
       * No need to set weathers for those maps in editor.
       * <br> <ROW>: nmMap, weas.
       */
      weaEn: [],


      /**
       * Wind attribute multiplier for a map.
       * <br> <ROW>: nmMap, mtp.
       */
      wind: [],


      /**
       * Global heat for a map.
       * <br> <ROW>: nmMap, heat.
       */
      heat: [],


      /**
       * Base pollution for a map.
       * <br> <ROW>: nmMap, pol.
       */
      pol: [],


    },


  },


  map: {


    rule: {


      /**
       * Default values for campaign rules of some planet.
       * <br> <ROW>: nmPla, ruleSetter.
       * <br> <ARGS>: rule.
       */
      campaignRule: [],


      /**
       * Maps a planet to a rule setter function, that sets planet rules.
       * Fog should be set in campaign rules, you should ask Anuke why.
       * <br> <ROW>: nmPla, ruleSetter.
       * <br> <ARGS>: rule.
       */
      planetRule: [],


    },


    /**
     * Maps a random overlay region tag to a region array getter function.
     * <br> <ROW>: tag, regsGetter.
     */
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


      /**
       * These maps are considered as cave, where flying units cannot go over walls.
       * <br> <ROW>: nmMap.
       */
      cave: [],


    },


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  grpParam: {


    floor: {


      /**
       * Used to set speed multiplier of floor blocks in the same material group.
       * See {@link ENV_materialFloor}.
       * <br> <ROW>: matGrp, spdMtp.
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
       * <br> <ROW>: matGrp, cacheLay.
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
       * <br> <ROW>: matGrp, propSetter.
       * <br> <ARGS>: flr, overwriteVanillaProp.
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
       * <br> <ROW>: matGrp.
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
     * <br> <ROW>: treeGrp, {scl, mag, wob, attrsGetter}.
     */
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


  /**
   * Maps name of some root node to localized name of some content.
   * <br> <ROW>: nmRoot, ct.
   */
  nodeRootNameMap: [],


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  /**
   * Extra teams to be added into {@link VARGEN.mainTeams}.
   * This affects team-based mechanics like CEP.
   */
  extraMainTeam: [],


};


Object.mergeDB(db, "DB_env");


exports.db = db;
