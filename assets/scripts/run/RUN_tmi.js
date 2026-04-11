/*
  ========================================
  Section: Application
  ========================================
*/




  MDL_event._c_onPostRun(() => {


    if(!MOD_tmi.ENABLED) return;


    // I don't know how but adding `excludes` here will cause crash now


    /**
     * Default parser for most Lovec drills.
     */
    const _p_defDrill = MOD_tmi.regisParser({


      parserBlacklist: [
        MOD_tmi.CLASSES.BeamDrillParser,
        MOD_tmi.CLASSES.DrillParser,
      ],
      flrDropSet: new ObjectSet(),
      wallDropSet: new ObjectSet(),


      exclude(parser) {
        return this.parserBlacklist.hasIns(parser);
      },


      isTarget(blk) {
        return blk.ex_isSubInsOf != null && blk.ex_isSubInsOf("BLK_baseDrill");
      },


      init() {
        let set;
        Vars.content.blocks().each(blk => {
          if(blk.itemDrop == null) return;
          if(blk instanceof OverlayFloor) {
            set = blk.wallOre ? this.wallDropSet : this.flrDropSet;
          } else if(blk instanceof Floor) {
            set = this.flrDropSet;
          } else {
            set = this.wallDropSet;
          };
          set.add(blk);
        });
      },


      parse(blk) {
        const seq = new Seq();

        let oreGrpMap = new ObjectMap();
        if(blk instanceof BeamDrill) {
          this.wallDropSet.each(
            oblk => {
              if(!blk.ex_canMine(oblk, oblk.itemDrop, 1.0)) return;

              let blkTg;
              if(blk.delegee.shouldDropPay) {
                blkTg = MDL_content._ct(DB_HANDLER.read("itm-pay-blk", oblk.itemDrop.name, null), "blk");
                if(blkTg == null) return;
              };
              if(!oreGrpMap.containsKey(oblk.itemDrop)) oreGrpMap.put(oblk.itemDrop, new MOD_tmi.CLASSES.RecipeItemGroup());

              let rawRc = !blk.delegee.shouldDropPay ?
                MOD_tmi._rawRc("collecting", blk, blk.drillTime / blk.size, true) :
                MOD_tmi._rawRc("collecting", blk, blk.drillTime * blkTg.requirements[0] / blk.size, true);
              MDL_event._c_onLoad(() => {
                MOD_tmi.baseParse(blk, rawRc, blk.optionalBoostIntensity);
              });
              MOD_tmi.addMineTile(rawRc, oreGrpMap.get(oblk.itemDrop), oblk, blk.drillTime / blk.getDrillTime(oblk.itemDrop), blk.size, true);
              !blk.delegee.shouldDropPay ?
                MOD_tmi.addProd(rawRc, oblk.itemDrop, 1) :
                MOD_tmi.addProd(rawRc, blkTg, 1);

              rawRc.complete();
              seq.add(rawRc);
            },
          );
        } else {
          this.flrDropSet.each(
            oblk => {
              if(!blk.ex_canMine(
                oblk, oblk.itemDrop,
                !MDL_cond._isDepthOre(oblk) ?
                  1.0 :
                  tryJsProp(blk, "canMineDepthOre", false) ?
                    tryJsProp(blk, "depthTierMtp", 1.0) :
                    -1.0
              )) return;

              let blkTg;
              if(blk.delegee.shouldDropPay) {
                blkTg = MDL_content._ct(DB_HANDLER.read("itm-pay-blk", oblk.itemDrop.name, null), "blk");
                if(blkTg == null) return;
              };
              if(!oreGrpMap.containsKey(oblk.itemDrop)) oreGrpMap.put(oblk.itemDrop, new MOD_tmi.CLASSES.RecipeItemGroup());

              let rawRc = !blk.delegee.shouldDropPay ?
                MOD_tmi._rawRc("collecting", blk, blk.drillTime / Math.pow(blk.size, 2), true) :
                MOD_tmi._rawRc("collecting", blk, blk.drillTime * blkTg.requirements[0] / Math.pow(blk.size, 2), true);
              MDL_event._c_onLoad(() => {
                MOD_tmi.baseParse(blk, rawRc, Math.pow(blk.liquidBoostIntensity, 2));
              });
              MOD_tmi.addMineTile(rawRc, oreGrpMap.get(oblk.itemDrop), oblk, blk.drillTime / blk.getDrillTime(oblk.itemDrop), blk.size, false);
              !blk.delegee.shouldDropPay ?
                MOD_tmi.addProd(rawRc, oblk.itemDrop, 1) :
                MOD_tmi.addProd(rawRc, blkTg, 1);

              rawRc.complete();
              seq.add(rawRc);
            },
          );
        };

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
      tempTypeMap: ObjectMap.of(
        "BLK_oreScanner", "factory",
      ),
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
        MDL_event._c_onLoad(() => {
          MOD_tmi.baseParse(blk, rawRc);
        });

        rawRc.complete();
        return new Seq([rawRc]);
      },


    });




    /**
     * Fixes parser for {@link BLK_liquidPump}.
     */
    const _p_pump = MOD_tmi.regisParser({


      liqBlksMap: new ObjectMap(),


      exclude(parser) {
        return parser instanceof MOD_tmi.CLASSES.PumpParser;
      },


      isTarget(blk) {
        return blk.ex_isSubInsOf != null && blk.ex_isSubInsOf("BLK_liquidPump");
      },


      init() {
        Vars.content.blocks().each(oblk => {
          if(oblk instanceof Floor && oblk.liquidDrop != null) {
            if(!this.liqBlksMap.containsKey(oblk.liquidDrop)) this.liqBlksMap.put(oblk.liquidDrop, []);
            this.liqBlksMap.get(oblk.liquidDrop).push(oblk);
          };
        });
      },


      parse(blk) {
        const seq = new Seq();
        if(blk.ex_isSubInsOf("BLK_depthPump")) return seq;

        this.liqBlksMap.each((liq, blks) => {
          let rawRc = MOD_tmi._rawRc("collecting", blk, blk.consumeTime, true);
          let rcGrp = new MOD_tmi.CLASSES.RecipeItemGroup();

          MDL_event._c_onLoad(() => {
            MOD_tmi.baseParse(blk, rawRc);
          });
          blks.forEachFast(oblk => {
            MOD_tmi.addAttr(rawRc, rcGrp, oblk, oblk.liquidMultiplier, 1, true);
          });
          MOD_tmi.addProd(rawRc, liq, blk.pumpAmount * Math.pow(blk.size, 2), true);

          rawRc.complete();
          seq.add(rawRc);
        });

        return seq;
      },


    });




    /**
     * Fixes parser for {@link BLK_ventGenerator}.
     */
    const _p_ventGenerator = MOD_tmi.regisParser({


      exclude(parser) {
        return parser instanceof MOD_tmi.CLASSES.ThermalGeneratorParser;
      },


      isTarget(blk) {
        return blk.ex_isSubInsOf != null && blk.ex_isSubInsOf("BLK_ventGenerator");
      },


      parse(blk) {
        let rawRc = MOD_tmi._rawRc("generator", blk, 0.0, true);
        let rcGrp = new MOD_tmi.CLASSES.RecipeItemGroup();

        MDL_event._c_onLoad(() => {
          MOD_tmi.baseParse(blk, rawRc);
        });
        MOD_tmi.addProdPow(rawRc, blk.powerProduction);
        MDL_attr._blkAttrArr(blk.attribute, oblk => MDL_cond._isVentBlock(oblk) && oblk.delegee.ventSize === blk.size).forEachRow(3, (oblk, attrVal, attr) => {
          MOD_tmi.addAttr(rawRc, rcGrp, oblk, attrVal, 1, true);
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
