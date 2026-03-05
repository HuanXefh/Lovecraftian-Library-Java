/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/




  MDL_event._c_onPostRun(() => {


    if(!MOD_tmi.ENABLED) return;


    // I don't know how but adding `excludes` here will cause crash now


    // Fix unparsed deposit mining
    MOD_tmi.regisParser({


      oreGrpMap: new ObjectMap(),


      isTarget(blk) {
        return blk instanceof BeamDrill;
      },


      parse(blk) {
        let seq = new Seq();

        Vars.content.blocks().each(
          oblk => MDL_cond._isOreDepo(oblk) && oblk.itemDrop != null,
          oblk => {
            if(!this.oreGrpMap.containsKey(oblk.itemDrop)) this.oreGrpMap.put(oblk.itemDrop, new RecipeItemGroup());

            let rawRc = MOD_tmi._rawRc("collecting", blk, blk.drillTime, true);

            MOD_tmi.baseParse(blk, rawRc, blk.optionalBoostIntensity);
            MOD_tmi.addMineTile(rawRc, this.oreGrpMap.get(oblk.itemDrop), oblk, blk.drillTime / blk.getDrillTime(oblk.itemDrop), blk.size, true);
            MOD_tmi.addProd(rawRc, oblk.itemDrop, blk.size, false);

            rawRc.complete();
            seq.add(rawRc);
          },
        );

        return seq;
      },


    });




    // Removes empty recipe
    MOD_tmi.regisParser({


      temps: [
        "BLK_depthPump",
        "BLK_dynamicWallHarvester",
        "BLK_fuelLight",
        "BLK_incinerator",
        "BLK_rainCollector",
      ],


      exclude(parser) {
        return parser instanceof MOD_tmi.CLASSES.AttributeCrafterParser
          || parser instanceof MOD_tmi.CLASSES.GenericCrafterParser
          || parser instanceof MOD_tmi.CLASSES.WallCrafterParser;
      },


      isTarget(blk) {
        return MDL_cond._isRecipeFactory(blk) || (blk.ex_getTempNm != null && this.temps.includes(blk.ex_getTempNm()));
      },


      parse(blk) {
        return new Seq();
      },


    });




    Log.info("[LOVEC] Registered recipe parsers for TMI.")


  }, 16208888);
