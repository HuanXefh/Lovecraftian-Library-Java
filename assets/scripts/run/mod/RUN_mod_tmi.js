/*
  ========================================
  Section: Application
  ========================================
*/




    /**
     * @global
     * @internal
     * @name __lovecTmiParsers__
     * @type {Object<string, tmi.recipe.RecipeParser>}
     */
    globalize({}, "__lovecTmiParsers__");




    MDL_event.onPostRun(() => {




        /**
         * @param {tmi.recipe.RecipeParser} parserCur
         * @param {tmi.recipe.RecipeParser} parserOther
         * @return {boolean}
         */
        function checkParser(parserCur, parserOther) {
            return (parserCur.parserBlacklist == null || !parserCur.parserBlacklist.hasIns(parserOther))
                && (parserCur.parserWhitelist == null || parserCur.parserWhitelist.hasIns(parserOther))
                && (parserCur.parserConflicted == null || !parserCur.parserConflicted.includes(parserOther));
        };


        /**
         * @param {tmi.recipe.RecipeParser} parser
         * @param {Block} blk
         * @return {boolean}
         */
        function checkTarget(parser, blk) {
            return (parser.tempBlacklist == null || !checkCreatedByTemp(blk) || !parser.tempBlacklist.includes(blk.ex_getTempName()))
                && (parser.tempWhitelist == null || !checkCreatedByTemp(blk) || parser.tempWhitelist.includes(blk.ex_getTempName()));
        };




        // I don't know why but adding `excludes` here will cause crash now
        // It did not happen in older versions of TMI




        /**
         * Default parser for most Lovec drills.
         */
        __lovecTmiParsers__.defDrillParser = MOD_tmi.regisParser({


            /** @type {Array<Class>} */
            parserBlacklist: [
                MOD_tmi.classes.BeamDrillParser,
                MOD_tmi.classes.DrillParser,
            ],
            /** @type {Array<string>} */
            tempBlacklist: [
                "BLK_rangeWallDrill",
            ],
            /** @type {ObjectSet<Block>} */
            flrDropSet: new ObjectSet(),
            /** @type {ObjectSet<Block>} */
            wallDropSet: new ObjectSet(),


            /**
             * @param {tmi.recipe.RecipeParser} parser
             * @return {boolean}
             */
            exclude(parser) {
                return !checkParser(this, parser);
            },


            /**
             * @param {Block} blk
             * @return {boolean}
             */
            isTarget(blk) {
                return checkSubInsOfTemp(blk, "BLK_baseDrill") && checkTarget(this, blk);
            },


            /**
             * @return {void}
             */
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


            /**
             * @param {Block} blk
             * @return {Seq<tmi.recipe.Recipe>}
             */
            parse(blk) {
                let seq = new Seq();
                let oreGrpMap = new ObjectMap();
                if(blk instanceof BeamDrill) {
                    this.wallDropSet.each(
                        oblk => {
                            if(!blk.ex_canMine(oblk, oblk.itemDrop, 1.0)) return;

                            let blkTarget;
                            if(blk.delegee.shouldDropPay) {
                                blkTarget = MDL_content.getCt(LCDBFileHandler.read("item-payload-block", oblk.itemDrop.name, null), ContentGetModes.BLK);
                                if(blkTarget == null) return;
                            };
                            let rcGrp = oreGrpMap.get(oblk.itemDrop);
                            if(rcGrp == null) {
                                rcGrp = new MOD_tmi.classes.RecipeItemGroup();
                                oreGrpMap.put(oblk.itemDrop, rcGrp);
                            };
                            let rawRc = !blk.delegee.shouldDropPay ?
                                MOD_tmi.makeRawRc("collecting", blk, blk.drillTime / blk.size / blk.delegee.drillAmtMtp, true) :
                                MOD_tmi.makeRawRc("collecting", blk, blk.drillTime * blkTarget.requirements[0] / blk.size / blk.delegee.drillAmtMtp, true);

                            MDL_event.onLoad(() => {
                                MOD_tmi.baseParse(blk, rawRc, blk.optionalBoostIntensity);
                            });
                            MOD_tmi.addMineTile(rawRc, rcGrp, oblk, blk.drillTime / blk.getDrillTime(oblk.itemDrop), Math.pow(blk.size, 2));
                            !blk.delegee.shouldDropPay ?
                                MOD_tmi.addProd(rawRc, oblk.itemDrop, 1) :
                                MOD_tmi.addProd(rawRc, blkTarget, 1);

                            rawRc.complete();
                            seq.add(rawRc);
                        },
                    );
                } else {
                    this.flrDropSet.each(
                        oblk => {
                            if(!blk.ex_canMine(
                                oblk, oblk.itemDrop,
                                !MDL_cond.isDepthOre(oblk) ?
                                    1.0 :
                                    tryJsProp(blk, "canMineDepthOre", false) ?
                                        tryJsProp(blk, "depthTierMtp", 1.0) :
                                        -1.0
                            )) return;

                            let blkTarget;
                            if(blk.delegee.shouldDropPay) {
                                blkTarget = MDL_content.getCt(LCDBFileHandler.read("item-payload-block", oblk.itemDrop.name, null), ContentGetModes.BLK);
                                if(blkTarget == null) return;
                            };
                            let rcGrp = oreGrpMap.get(oblk.itemDrop);
                            if(rcGrp == null) {
                                rcGrp = new MOD_tmi.classes.RecipeItemGroup();
                                oreGrpMap.put(oblk.itemDrop, rcGrp);
                            };
                            let rawRc = !blk.delegee.shouldDropPay ?
                                MOD_tmi.makeRawRc("collecting", blk, blk.drillTime / Math.pow(blk.size, 2) / blk.delegee.drillAmtMtp, true) :
                                MOD_tmi.makeRawRc("collecting", blk, blk.drillTime * blkTarget.requirements[0] / Math.pow(blk.size, 2) / blk.delegee.drillAmtMtp, true);

                            MDL_event.onLoad(() => {
                                MOD_tmi.baseParse(blk, rawRc, Math.pow(blk.liquidBoostIntensity, 2));
                            });
                            MOD_tmi.addMineTile(rawRc, rcGrp, oblk, blk.drillTime / blk.getDrillTime(oblk.itemDrop), blk.size);
                            !blk.delegee.shouldDropPay ?
                                MOD_tmi.addProd(rawRc, oblk.itemDrop, 1) :
                                MOD_tmi.addProd(rawRc, blkTarget, 1);

                            rawRc.complete();
                            seq.add(rawRc);
                        },
                    );
                };
                return seq;
            },


        });




        /**
         * Parses recipes for {@link BLK_fluidPackager}.
         */
        __lovecTmiParsers__.fluidPackagerParser = MOD_tmi.regisParser({


            /** @type {Array<Class>} */
            parserBlacklist: [
                MOD_tmi.classes.GenericCrafterParser,
            ],


            /**
             * @param {tmi.recipe.RecipeParser} parser
             * @return {boolean}
             */
            exclude(parser) {
                return !checkParser(this, parser);
            },


            /**
             * @param {Block} blk
             * @return {boolean}
             */
            isTarget(blk) {
                return checkSubInsOfTemp(blk, "BLK_fluidPackager");
            },


            /**
             * @param {Block} blk
             * @return {Seq<tmi.recipe.Recipe>}
             */
            parse(blk) {
                let seq = new Seq();
                global.fcell.fluidItemMap.each((liq, item) => {
                    let rawRc = MOD_tmi.makeRawRc(
                        "factory",
                        blk,
                        MDL_content.getCraftTime(blk),
                    );

                    MDL_event.onLoad(() => {
                        MOD_tmi.baseParse(blk, rawRc);
                    });
                    if(!blk.delegee.isUnpacker) {
                        MOD_tmi.addCons(rawRc, liq, blk.delegee.packageAmt * blk.delegee.liqPerCellItem);
                        MOD_tmi.addProd(rawRc, item, blk.delegee.packageAmt);
                    } else {
                        MOD_tmi.addCons(rawRc, item, blk.delegee.packageAmt);
                        MOD_tmi.addProd(rawRc, liq, blk.delegee.packageAmt * blk.delegee.liqPerCellItem);
                    };

                    rawRc.complete();
                    seq.add(rawRc);
                });
                return seq;
            },


        });




        /**
         * Parses recipes for {@link INTF_BLK_rangeAttributeBlock}.
         */
        __lovecTmiParsers__.rangeHarvesterParser = MOD_tmi.regisParser({


            /** @type {Array<Class>} */
            parserBlacklist: [
                MOD_tmi.classes.AttributeCrafterParser,
            ],


            /**
             * @param {tmi.recipe.RecipeParser} parser
             * @return {boolean}
             */
            exclude(parser) {
                return !checkParser(this, parser);
            },


            /**
             * @param {Block} blk
             * @return {boolean}
             */
            isTarget(blk) {
                return checkSubInsOfTemp(blk, "INTF_BLK_rangeAttributeBlock");
            },


            /**
             * @param {Block} blk
             * @return {Seq<tmi.recipe.Recipe>}
             */
            parse(blk) {
                let rawRc = MOD_tmi.makeRawRc(
                    tryVal(blk.ex_getRangeAttrProdTypeStr(), "collecting"),
                    blk,
                    MDL_content.getCraftTime(blk),
                    true,
                );

                MDL_event.onLoad(() => {
                    MOD_tmi.baseParse(blk, rawRc);
                });
                let rcGrp = new MOD_tmi.classes.RecipeItemGroup();
                Vars.content.blocks().each(
                    oblk => !oblk.attributes.get(blk.ex_getAttrTarget()).fEqual(0.0),
                    oblk => MOD_tmi.addAttr(rawRc, rcGrp, oblk, oblk.attributes.get(blk.ex_getAttrTarget()), blk.size, true, AttrRecipeTypes.PROP),
                );

                rawRc.complete();
                return new Seq([rawRc]);
            },


        });




        /**
         * Fixes parser for {@link BLK_liquidPump}.
         */
        __lovecTmiParsers__.pumpParser = MOD_tmi.regisParser({


            /** @type {Array<Class>} */
            parserBlacklist: [
                MOD_tmi.classes.PumpParser,
            ],
            /** @type {ObjectMap<Liquid, Array<Block>>} */
            liqBlksMap: new ObjectMap(),


            /**
             * @param {tmi.recipe.RecipeParser} parser
             * @return {boolean}
             */
            exclude(parser) {
                return !checkParser(this, parser);
            },


            /**
             * @param {Block} blk
             * @return {boolean}
             */
            isTarget(blk) {
                return checkSubInsOfTemp(blk, "BLK_liquidPump");
            },


            /**
             * @return {void}
             */
            init() {
                Vars.content.blocks().each(oblk => {
                    if(oblk instanceof Floor && oblk.liquidDrop != null) {
                        if(!this.liqBlksMap.containsKey(oblk.liquidDrop)) this.liqBlksMap.put(oblk.liquidDrop, []);
                        this.liqBlksMap.get(oblk.liquidDrop).push(oblk);
                    };
                });
            },


            /**
             * @param {Block} blk
             * @return {Seq<tmi.recipe.Recipe>}
             */
            parse(blk) {
                let seq = new Seq();
                // Depth pumps don't use this parser
                if(blk.ex_isSubInsOf("BLK_depthPump")) return seq;
                this.liqBlksMap.each((liq, blks) => {
                    let rawRc = MOD_tmi.makeRawRc("collecting", blk, blk.consumeTime, true);
                    let rcGrp = new MOD_tmi.classes.RecipeItemGroup();

                    MDL_event.onLoad(() => {
                        MOD_tmi.baseParse(blk, rawRc);
                    });
                    blks.forEachFast(oblk => {
                        MOD_tmi.addAttr(rawRc, rcGrp, oblk, oblk.liquidMultiplier, blk.size, true, AttrRecipeTypes.FLOOR);
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
        __lovecTmiParsers__.ventGeneratorParser = MOD_tmi.regisParser({


            /** @type {Array<Class>} */
            parserBlacklist: [
                MOD_tmi.classes.ThermalGeneratorParser,
            ],


            /**
             * @param {tmi.recipe.RecipeParser} parser
             * @return {boolean}
             */
            exclude(parser) {
                return !checkParser(this, parser);
            },


            /**
             * @param {Block} blk
             * @return {boolean}
             */
            isTarget(blk) {
                return checkSubInsOfTemp(blk, "BLK_ventGenerator");
            },


            /**
             * @param {Block} blk
             * @return {Seq<tmi.recipe.Recipe>}
             */
            parse(blk) {
                let rawRc = MOD_tmi.makeRawRc("generator", blk, 0.0, true);
                let rcGrp = new MOD_tmi.classes.RecipeItemGroup();

                MDL_event.onLoad(() => {
                    MOD_tmi.baseParse(blk, rawRc);
                });
                MOD_tmi.addProdPow(rawRc, blk.powerProduction);
                MDL_attr.getBlkAttrArr(
                    blk.attribute,
                    oblk => checkSubInsOfTemp(oblk, "INTF_ENV_dynamicSizeVent") && oblk.delegee.ventSize === blk.size,
                ).forEachRow(3, (oblk, attrVal, attr) => {
                    MOD_tmi.addAttr(rawRc, rcGrp, oblk, attrVal, blk.size, true, AttrRecipeTypes.FLOOR);
                });

                rawRc.complete();
                return new Seq([rawRc]);
            },


        });




        /**
         * Default parser for most Lovec producers.
         */
        __lovecTmiParsers__.defProdParser = MOD_tmi.regisParser({


            /** @type {Array<Class>} */
            parserBlacklist: [
                MOD_tmi.classes.AttributeCrafterParser,
                MOD_tmi.classes.GenericCrafterParser,
            ],
            /** @type {Array<tmi.recipe.RecipeParser>} */
            parserConflicted: [
                __lovecTmiParsers__.rangeHarvesterParser,
            ],
            /** @type {ObjectMap<string, string>} */
            tempTypeMap: ObjectMap.of(
                "BLK_oreScanner", "factory",
            ),
            /** @type {Array<string>} */
            tempBlacklist: [
                "BLK_rainCollector",
            ],


            /**
             * @param {tmi.recipe.RecipeParser} parser
             * @return {boolean}
             */
            exclude(parser) {
                return !checkParser(this, parser);
            },


            /**
             * @param {Block} blk
             * @return {boolean}
             */
            isTarget(blk) {
                return checkCreatedByTemp(blk) && (
                    (blk.ex_isSubInsOf("BLK_baseFactory") && !blk.ex_isSubInsOf("BLK_recipeFactory") && checkTarget(this, blk))
                        || this.tempTypeMap.containsKey(blk.ex_getTempName())
                );
            },


            /**
             * @param {Block} blk
             * @return {Seq<tmi.recipe.Recipe>}
             */
            parse(blk) {
                let rawRc = MOD_tmi.makeRawRc(
                    this.tempTypeMap.get(blk.ex_getTempName(), "factory"),
                    blk,
                    MDL_content.getCraftTime(blk),
                );

                MDL_event.onLoad(() => {
                    MOD_tmi.baseParse(blk, rawRc);
                });

                rawRc.complete();
                return new Seq([rawRc]);
            },


        });




        /**
         * Used to remove invalid recipes for some templates.
         */
        __lovecTmiParsers__.skipParser = MOD_tmi.regisParser({


            /** @type {Array<Class>} */
            parserBlacklist: [
                MOD_tmi.classes.AttributeCrafterParser,
                MOD_tmi.classes.BeamDrillParser,
                MOD_tmi.classes.DrillParser,
                MOD_tmi.classes.GenericCrafterParser,
                MOD_tmi.classes.WallCrafterParser,
            ],
            /** @type {Array<string>} */
            tempWhitelist: [
                "BLK_depthPump",
                "BLK_dynamicWallHarvester",
                "BLK_fuelLight",
                "BLK_incinerator",
                "BLK_rainCollector",
                "BLK_rangeWallDrill",
            ],


            /**
             * @param {tmi.recipe.RecipeParser} parser
             * @return {boolean}
             */
            exclude(parser) {
                return !checkParser(this, parser);
            },


            /**
             * @param {Block} blk
             * @return {boolean}
             */
            isTarget(blk) {
                return checkSubInsOfTemp(blk, "BLK_recipeFactory") || checkTarget(this, blk);
            },


            /**
             * @param {Block} blk
             * @return {Seq<tmi.recipe.Recipe>}
             */
            parse(blk) {
                return new Seq();
            },


        });




        console.log("[LOVEC] Registered recipe parsers for TMI.")


    });
