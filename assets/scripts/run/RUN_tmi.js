/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_event = require("lovec/mdl/MDL_event");


  const MOD_tmi = require("lovec/mod/MOD_tmi");


/*
  ========================================
  Section: Application
  ========================================
*/




  MDL_event._c_onPostRun(() => {


    if(!MOD_tmi.ENABLED) return;




    /* ----------------------------------------
     * NOTE:
     *
     * Fixes unparsed deposit mining.
     * ---------------------------------------- */
    MOD_tmi.regisParser({


      excludes: new Seq(),
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




    /* ----------------------------------------
     * NOTE:
     *
     * Removes empty recipes.
     * ---------------------------------------- */
    MOD_tmi.regisParser({


      excludes: Seq.with(
        MOD_tmi.AttributeCrafterParser,
        MOD_tmi.GenericCrafterParser,
        MOD_tmi.WallCrafterParser,
      ),
      temps: [
        "BLK_depthPump",
        "BLK_dynamicWallHarvester",
        "BLK_fuelLight",
        "BLK_incinerator",
        "BLK_rainCollector",
      ],


      isTarget(blk) {
        return MDL_cond._isRecipeFactory(blk) || (blk.ex_getTempNm != null && this.temps.includes(blk.ex_getTempNm()));
      },


      parse(blk) {
        return new Seq();
      },


    });




    Log.info("[LOVEC] Registered recipe parsers to TMI.")


  }, 16208888);
