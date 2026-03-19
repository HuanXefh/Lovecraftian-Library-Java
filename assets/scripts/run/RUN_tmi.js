/*
  ========================================
  Section: Application
  ========================================
*/




  MDL_event._c_onPostRun(() => {


    if(!MOD_tmi.ENABLED) return;


    // I don't know how but adding `excludes` here will cause crash now


    /**
     * Fixes unparsed deposit mining recipes.
     */
    const _p_depositMining = MOD_tmi.regisParser({


      oreGrpMap: new ObjectMap(),


      isTarget(blk) {
        return blk instanceof BeamDrill;
      },


      parse(blk) {
        const seq = new Seq();

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




    /**
     * Default parser for most Lovec producers.
     */
    const _p_defProd = MOD_tmi.regisParser({


      parserBlacklist: [
        MOD_tmi.CLASSES.AttributeCrafterParser,
        MOD_tmi.CLASSES.GenericCrafterParser,
      ],
      tempTypeMap: ObjectMap.of(),
      tempBlacklist: [
        "BLK_rainCollector",
      ],


      exclude(parser) {
        return this.parserBlacklist.hasIns(parser);
      },


      isTarget(blk) {
        return (MDL_cond._isFactory(blk) && !MDL_cond._isRecipeFactory(blk) && (blk.ex_getTempNm == null ? true : !this.tempBlacklist.includes(blk.ex_getTempNm()))) || (blk.ex_getTempNm != null && this.tempTypeMap.containsKey(blk.ex_getTempNm()));
      },


      parse(blk) {
        let rawRc = MOD_tmi._rawRc(
          this.tempTypeMap.get(blk.ex_getTempNm(), "factory"),
          blk,
          MDL_content._craftTime(blk),
        );
        // Delayed, since consumers added by `setConsumer` are not actually added yet
        MDL_event._c_onLoad(() => {
          MOD_tmi.baseParse(blk, rawRc);
        });

        rawRc.complete();
        return new Seq([rawRc]);
      },


    });




    /**
     * Used to remove empty recipes for some templates.
     */
    const _p_emptyRcFix = MOD_tmi.regisParser({


      parserBlacklist: [
        MOD_tmi.CLASSES.AttributeCrafterParser,
        MOD_tmi.CLASSES.GenericCrafterParser,
        MOD_tmi.CLASSES.WallCrafterParser,
      ],
      tempWhitelist: [
        "BLK_depthPump",
        "BLK_dynamicWallHarvester",
        "BLK_fuelLight",
        "BLK_incinerator",
        "BLK_rainCollector",
      ],


      exclude(parser) {
        return this.parserBlacklist.hasIns(parser);
      },


      isTarget(blk) {
        return MDL_cond._isRecipeFactory(blk) || (blk.ex_getTempNm != null && this.tempWhitelist.includes(blk.ex_getTempNm()));
      },


      parse(blk) {
        return new Seq();
      },


    });




    Log.info("[LOVEC] Registered recipe parsers for TMI.")


  }, 16208888);
