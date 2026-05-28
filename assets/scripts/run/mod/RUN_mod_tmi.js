/*
  ========================================
  Section: Application
  ========================================
*/




  MDL_event._c_onPostRun(() => {


    // I don't know why but adding `excludes` here will cause crash now
    // It did not happen in older versions of TMI


    /**
     * Default parser for most Lovec drills.
     */
    const _p_defDrill = MOD_tmi.regisParser({


      parserBlacklist: [
        MOD_tmi.CLASSES.BeamDrillParser,
        MOD_tmi.CLASSES.DrillParser,
      ],
      tempBlacklist: [
        "BLK_rangeWallDrill",
      ],
      flrDropSet: new ObjectSet(),
      wallDropSet: new ObjectSet(),


      exclude(parser) {
        return this.parserBlacklist.hasIns(parser);
      },


      isTarget(blk) {
        return checkCreatedByTemp(blk) && blk.ex_isSubInsOf("BLK_baseDrill") && !this.tempBlacklist.includes(blk.ex_getTempNm());
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
                MOD_tmi._rawRc("collecting", blk, blk.drillTime / blk.size / blk.delegee.drillAmtMtp, true) :
                MOD_tmi._rawRc("collecting", blk, blk.drillTime * blkTg.requirements[0] / blk.size / blk.delegee.drillAmtMtp, true);
              MDL_event._c_onLoad(() => {
                MOD_tmi.baseParse(blk, rawRc, blk.optionalBoostIntensity);
              });
              MOD_tmi.addMineTile(rawRc, oreGrpMap.get(oblk.itemDrop), oblk, blk.drillTime / blk.getDrillTime(oblk.itemDrop), Math.pow(blk.size, 2));
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
                MOD_tmi._rawRc("collecting", blk, blk.drillTime / Math.pow(blk.size, 2) / blk.delegee.drillAmtMtp, true) :
                MOD_tmi._rawRc("collecting", blk, blk.drillTime * blkTg.requirements[0] / Math.pow(blk.size, 2) / blk.delegee.drillAmtMtp, true);
              MDL_event._c_onLoad(() => {
                MOD_tmi.baseParse(blk, rawRc, Math.pow(blk.liquidBoostIntensity, 2));
              });
              MOD_tmi.addMineTile(rawRc, oreGrpMap.get(oblk.itemDrop), oblk, blk.drillTime / blk.getDrillTime(oblk.itemDrop), blk.size);
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


    const _p_rangeHarvester = MOD_tmi.regisParser({


      exclude(parser) {
        return parser instanceof MOD_tmi.CLASSES.AttributeCrafterParser;
      },


      isTarget(blk) {
        return checkCreatedByTemp(blk) && blk.ex_isSubInsOf("INTF_BLK_rangeAttributeBlock");
      },


      parse(blk) {
        let rawRc = MOD_tmi._rawRc(
          tryVal(blk.ex_getRangeAttrProdTypeStr(), "collecting"),
          blk,
          MDL_content._craftTime(blk),
          true,
        );
        MDL_event._c_onLoad(() => {
          MOD_tmi.baseParse(blk, rawRc);
        });
        let rcGrp = new MOD_tmi.CLASSES.RecipeItemGroup();
        Vars.content.blocks().each(
          oblk => !oblk.attributes.get(blk.ex_getAttrTg()).fEqual(0.0),
          oblk => MOD_tmi.addAttr(rawRc, rcGrp, oblk, oblk.attributes.get(blk.ex_getAttrTg()), blk.size, true, AttrRcTypes.PROP),
        );

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
        return checkCreatedByTemp(blk) && blk.ex_isSubInsOf("BLK_liquidPump");
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
            MOD_tmi.addAttr(rawRc, rcGrp, oblk, oblk.liquidMultiplier, blk.size, true, AttrRcTypes.FLOOR);
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
        return checkCreatedByTemp(blk) && blk.ex_isSubInsOf("BLK_ventGenerator");
      },


      parse(blk) {
        let rawRc = MOD_tmi._rawRc("generator", blk, 0.0, true);
        let rcGrp = new MOD_tmi.CLASSES.RecipeItemGroup();

        MDL_event._c_onLoad(() => {
          MOD_tmi.baseParse(blk, rawRc);
        });
        MOD_tmi.addProdPow(rawRc, blk.powerProduction);
        MDL_attr._blkAttrArr(blk.attribute, oblk => MDL_cond._isVentBlock(oblk) && oblk.delegee.ventSize === blk.size).forEachRow(3, (oblk, attrVal, attr) => {
          MOD_tmi.addAttr(rawRc, rcGrp, oblk, attrVal, blk.size, true, AttrRcTypes.FLOOR);
        });

        rawRc.complete();
        return new Seq([rawRc]);
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
      parserConflicted: [
        _p_rangeHarvester,
      ],
      tempTypeMap: ObjectMap.of(
        "BLK_oreScanner", "factory",
      ),
      tempBlacklist: [
        "BLK_rainCollector",
      ],


      exclude(parser) {
        return this.parserBlacklist.hasIns(parser) || this.parserConflicted.includes(parser);
      },


      isTarget(blk) {
        return (
          MDL_cond._isFactory(blk)
            && !MDL_cond._isRecipeFactory(blk)
            && !(!checkCreatedByTemp(blk) || this.tempBlacklist.includes(blk.ex_getTempNm()))
        ) || (
          checkCreatedByTemp(blk) && this.tempTypeMap.containsKey(blk.ex_getTempNm())
        );
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
     * Used to remove invalid recipes for some templates.
     */
    const _p_skipParse = MOD_tmi.regisParser({


      parserBlacklist: [
        MOD_tmi.CLASSES.AttributeCrafterParser,
        MOD_tmi.CLASSES.BeamDrillParser,
        MOD_tmi.CLASSES.DrillParser,
        MOD_tmi.CLASSES.GenericCrafterParser,
        MOD_tmi.CLASSES.WallCrafterParser,
      ],
      tempWhitelist: [
        "BLK_depthPump",
        "BLK_dynamicWallHarvester",
        "BLK_fuelLight",
        "BLK_incinerator",
        "BLK_rainCollector",
        "BLK_rangeWallDrill",
      ],


      exclude(parser) {
        return this.parserBlacklist.hasIns(parser);
      },


      isTarget(blk) {
        return MDL_cond._isRecipeFactory(blk) || (checkCreatedByTemp(blk) && this.tempWhitelist.includes(blk.ex_getTempNm()));
      },


      parse(blk) {
        return new Seq();
      },


    });




    console.log("[LOVEC] Registered recipe parsers for TMI.")


  }, 16208888);
