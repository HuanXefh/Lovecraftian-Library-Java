/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Wall, BLK_constructionCore>} BLKConstructionCore
     */


    /**
     * @typedef {TemplateInstance<Wall.WallBuild, B_constructionCore>} BConstructionCore
     * @prop {BLKConstructionCore} block
     */


    const PARENT = require("lovec/temp/blk/BLK_materialBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKConstructionCore} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.update = true;
        blk.canOverdrive = true;
        blk.drawCached = false;
        blk.drawDynamic = true;
        blk.allowedInPayloads = false;

        blk.self.ex_parseConstructionData();
        if(blk.delegee.placeDataX == null) blk.delegee.placeDataX = blk.delegee.centerPon2.x;
        if(blk.delegee.placeDataY == null) blk.delegee.placeDataY = blk.delegee.centerPon2.y;

        // noinspection JSValidateTypes
        blk.delegee.placeBlk = MDL_content.getCt(blk.delegee.placeBlk, ContentGetModes.BLK);
        if(blk.delegee.placeBlk == null) throw new LCError.NullArgumentError(blk.name + ".placeBlk");
        blk.self.ex_calcBlksReq(blk.delegee.constructionBlksReq);
        blk.self.ex_calcItemsReq(blk.delegee.constructionItemsReq, blk.delegee.constructionBlksReq);
        if(!blk.delegee.skipTargetSetup) {
            Core.app.post(() => {
                batchCall(blk.delegee.placeBlk, function() {
                    this.buildVisibility = BuildVisibility.sandboxOnly;
                    blk.techNodes.each(node => {
                        node.children.add(TechTree.node(this, [], () => {}));
                    });
                    this.alwaysUnlocked = true;
                    this.envRequired = blk.envRequired;
                    this.envDisabled = blk.envDisabled;
                    let itemStacks = [];
                    Object.eachPair(blk.delegee.constructionItemsReq, (nameItem, amt) => {
                        itemStacks.push(new ItemStack(Vars.content.item(nameItem), amt));
                    });
                    this.requirements = itemStacks;
                    MDL_event.onLoad(() => {
                        this.buildTime = blk.delegee.constructionTimeReq * 0.5;
                    });
                    if(this.delegee != null) {
                        this.delegee.hiddenNonPlaceable = true;
                    };
                });
            });
        };

        blk.configurable = true;
        blk.group = BlockGroup.none;

        blk.config(JAVA.boolean, (b, bool) => {
            b.delegee.shouldDrawConstructionPlan = bool;
        });
        blk.config(JAVA.string, (b, str) => {
            switch(str) {
                case "SPEC: click" :
                    b.delegee.underConstruction ?
                        b.configure("SPEC: stop") :
                        b.configure("SPEC: start");
                    break;
                case "SPEC: start" :
                    b.delegee.underConstruction = true;
                    break;
                case "SPEC: stop" :
                    b.self.ex_stopConstruction();
                    break;
                case "SPEC: complete" :
                    if(!b.block.self.ex_checkPlanComplete(b.team, b.delegee.constructionPlan)) {
                        b.self.ex_stopConstruction();
                    } else {
                        MDL_event.onDelayRun(0.0, () => {
                            blk.self.ex_placePlanTarget(b.team, b.tileX(), b.tileY(), b.rotation);
                        });
                        let ot = blk.self.ex_getPlanT(b.tileX(), b.tileY(), b.rotation, blk.delegee.centerPon2.x, blk.delegee.centerPon2.y);
                        MDL_effect.showAt(ot.worldx() + (blk.delegee.planSize % 2 === 0 ? 4.0 : 0.0), ot.worldy() + (blk.delegee.planSize % 2 === 0 ? 4.0 : 0.0), GLB_eff.fadePlacePack[blk.delegee.planSize], 0.0);
                        MDL_sound.playAt(ot.worldx(), ot.worldy(), blk.delegee.placeBlk.placeSound);
                        blk.self.ex_removePlanBlks(b.delegee.constructionPlan);
                    };
                    break;
            };
        });

        MDL_content.rename(
            blk,
            blk.delegee.placeBlk.localizedName + MDL_text.getSpace() + "(" + MDL_bundle.getTerm("lovec", "construction-core") + ")",
        );

        MOD_tmi.regisRc_constructionCore(blk);
    };


    /**
     * @private
     * @param {BLKConstructionCore} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.add(fetchStat("lovec", "blk0misc-blktarget"), newStatValue(tb => {
            tb.row();
            tb.table(Styles.none, tb1 => {
                MDL_table.br(tb1, 1);
                tb1.table(Tex.whiteui, tb2 => {
                    tb2.left().setColor(Pal.darkestGray);
                    MDL_table.margin(tb2);
                    MDL_table.ctIcon(tb2, blk.delegee.placeBlk, {size: 48.0});
                    tb2.table(Styles.none, tb3 => {}).width(12.0);
                    MDL_table.barV(tb2, {color: Color.darkGray});
                    tb2.table(Styles.none, tb3 => {}).width(12.0);
                    tb2.table(Styles.none, tb3 => {
                        tb3.add(MDL_text.getStat(MDL_bundle.getTerm("lovec", "construction-time"), blk.delegee.constructionTimeReq.time(2))).left().row();
                    }).growX();
                }).growX().row();
                MDL_table.br(tb1, 1);
            }).growX();
        }));
        stats.add(fetchStat("lovec", "blk0misc-struct"), newStatValue(tb => {
            tb.row();
            blk.self.ex_buildConstructionPlan(tb);
        }));
    };


    /**
     * @private
     * @param {BLKConstructionCore} blk
     * @return {void}
     */
    function comp_setBars(blk) {
        blk.addBar("lovec-prog", b => new Bar(
            prov(() => Core.bundle.format("bar.lovec-bar-prog-amt", b.self.ex_getConstructionFrac().perc(0))),
            prov(() => Pal.ammo),
            () => b.self.ex_getConstructionFrac(),
        ));
    };


    /**
     * @private
     * @param {BLKConstructionCore} blk
     * @param {number} tx
     * @param {number} ty
     * @param {number} rot
     * @param {boolean} valid
     * @return {void}
     */
    const comp_drawPlace = function thisFun(blk, tx, ty, rot, valid) {
        if(LCNativeArray.checkTupChange(thisFun.tmpTup, blk, tx, ty, rot)) {
            blk.self.ex_findPlan(blk.delegee.constructionTmpPlan, tx, ty, rot);
        };
        blk.self.ex_drawPlan(Vars.player.team(), blk.delegee.constructionTmpPlan);
    }
    .setProp({
        /**
         * @memberof comp_drawPlace
         * @type {Tup4<Block, number, number, number>}
         */
        tmpTup: [],
    });


    /**
     * @private
     * @param {BLKConstructionCore} blk
     * @return {void}
     */
    function comp_ex_parseConstructionData(blk) {
        let
            i,
            iCap = blk.delegee.constructionData[0].iCap(),
            j = 0,
            jCap = blk.delegee.constructionData.iCap(),
            tup,
            blkTarget;
        while(j < jCap) {
            blk.delegee.constructionParsedData[j] = [];
            i = 0;
            while(i < iCap) {
                tup = blk.delegee.constructionData[j][i] instanceof Array ?
                    blk.delegee.constructionData[j][i] :
                    [blk.delegee.constructionData[j][i], -1];
                blkTarget = tup[0] === "SPEC: this" ?
                    blk :
                    tryVal(MDL_content.getCt(tup[0], ContentGetModes.BLK), Blocks.air);
                blk.delegee.constructionParsedData[j].push({
                    blk: blkTarget,
                    rot: blkTarget instanceof RotBlock ? -1 : tryVal(tup[1], -1),
                });
                if(blkTarget === blk) {
                    blk.delegee.corePon2.set(i, j);
                };
                i++;
            };
            j++;
        };

        blk.delegee.centerPon2.set(
            iCap % 2 === 0 ? (iCap / 2 - 1) : ((iCap - 1) / 2),
            jCap % 2 === 0 ? (jCap / 2) : ((jCap - 1) / 2),
        );
        blk.delegee.planSize = Math.max(iCap, jCap);
    };


    /**
     * @private
     * @param {BLKConstructionCore} blk
     * @param {Team} team
     * @param {number} tx
     * @param {number} ty
     * @param {number} rot
     * @return {void}
     */
    function comp_ex_placePlanTarget(blk, team, tx, ty, rot) {
        let ot = blk.self.ex_getPlanT(tx, ty, rot, blk.delegee.placeDataX, blk.delegee.placeDataY);
        if(ot != null) {
            ot.setBlock(blk.delegee.placeBlk, team, Mathf.mod(rot + blk.delegee.placeOffRot, 4));
            MDL_effect.fadeText(ot.worldx() + blk.delegee.placeBlk.offset, ot.worldy() + blk.delegee.placeBlk.offset, MDL_bundle.getInfo("lovec", "construction-complete"), Pal.accent, blk.delegee.placeBlk.size * 0.5);
            MDL_event.onDelayRun(0.0, () => {
                if(ot.build != null && ot.build.block === blk.delegee.placeBlk) {
                    BOX_trigger.constructionComplete.fire(ot.build);
                };
            });
        };
    };


    /**
     * @private
     * @param {BLKConstructionCore} blk
     * @param {ConstructionPlan} plan
     * @return {void}
     */
    function comp_ex_removePlanBlks(blk, plan) {
        let
            i = 0,
              iCap = plan.iCap();
        while(i < iCap) {
            plan[i + 1].setBlock(Blocks.air);
            i += 3;
        };
    };


    /**
     * @private
     * @param {BLKConstructionCore} blk
     * @param {ConstructionPlan|unset} contPlan
     * @param {number} tx
     * @param {number} ty
     * @param {number} rot
     * @return {ConstructionPlan}
     */
    function comp_ex_findPlan(blk, contPlan, tx, ty, rot) {
        let arr = contPlan != null ? contPlan.clear() : [];

        let
            i,
            iCap = blk.delegee.constructionParsedData[0].iCap(),
            j = 0,
            jCap = blk.delegee.constructionParsedData.iCap(),
            ot;
        while(j < jCap) {
            i = 0;
            while(i < iCap) {
                ot = blk.self.ex_getPlanT(tx, ty, rot, i, j);
                if(ot == null) {
                    // Near map boundary? Just throw an empty array back
                    arr.clear();
                    return arr;
                } else if(blk.delegee.constructionParsedData[j][i].blk !== Blocks.air) {
                    // Air is filtered out for faster calculation
                    arr.push(blk.delegee.constructionParsedData[j][i].blk, ot, blk.self.ex_getPlanRot(rot, i, j));
                };
                i++;
            };
            j++;
        };

        return arr;
    };


    /**
     * @private
     * @param {BLKConstructionCore} blk
     * @param {F2Array<Block, number>|unset} contArr
     * @return {F2Array<Block, number>}
     */
    const comp_ex_calcBlksReq = function thisFun(blk, contArr) {
        let arr = contArr != null ? contArr.clear() : [];

        thisFun.tmpArr.clear();
        let
            i,
            iCap = blk.delegee.constructionParsedData[0].iCap(),
            j = 0,
            jCap = blk.delegee.constructionParsedData.iCap();
        while(j < jCap) {
            i = 0;
            while(i < iCap) {
                thisFun.tmpArr.pushUnique(blk.delegee.constructionParsedData[j][i].blk);
                i++;
            };
            j++;
        };
        let count;
        thisFun.tmpArr.inSituFilter(oblk => oblk !== Blocks.air).forEachFast(oblk => {
            count = 0;
            j = 0;
            while(j < jCap) {
                i = 0;
                while(i < iCap) {
                    if(blk.delegee.constructionParsedData[j][i].blk === oblk) {
                        count++;
                    };
                    i++;
                };
                j++;
            };
            arr.push(oblk, count);
        }, true);

        return arr;
    }
    .setProp({
        /**
         * @memberof comp_ex_calcBlksReq
         * @type {Array<Block>}
         */
        tmpArr: [],
    });


    /**
     * @private
     * @param {BLKConstructionCore} blk
     * @param {Object<string, number>|unset} contObj
     * @param {F2Array<Block, number>|unset} blksReq
     * @return {Object<string, number>}
     */
    function comp_ex_calcItemsReq(blk, contObj, blksReq) {
        // I'm using an object cauz adding numbers is torturous when using a formatted array
        let obj = contObj != null ? Object.clear(contObj) : {};

        blksReq = tryVal(blksReq, blk.self.ex_calcBlksReq(null));
        blksReq.forEachRow(2, (oblk, count) => {
            oblk.requirements.forEachFast(itemStack => {
                if(obj[itemStack.item.name] === undefined) {
                    obj[itemStack.item.name] = 0;
                };
                obj[itemStack.item.name] += itemStack.amount * count;
            }, true);
        }, true);

        return obj;
    };


    /**
     * @private
     * @param {BLKConstructionCore} blk
     * @param {number} tx
     * @param {number} ty
     * @param {number} rot
     * @param {number} dataX
     * @param {number} dataY
     * @return {Tile|null}
     */
    function comp_ex_getPlanT(blk, tx, ty, rot, dataX, dataY) {
        return LCPos.getTileRectRotCenter(
            GLB_var.world.tile(tx - blk.delegee.corePon2.x + dataX, ty + blk.delegee.corePon2.y - dataY),
            GLB_var.world.tile(tx, ty),
            rot,
            blk.delegee.constructionParsedData[dataY][dataX].blk.size,
            blk.size,
        );
    };


    /**
     * @private
     * @param {BLKConstructionCore} blk
     * @param {number} rot
     * @param {number} dataX
     * @param {number} dataY
     * @return {number}
     */
    function comp_ex_getPlanRot(blk, rot, dataX, dataY) {
        let orot = blk.delegee.constructionParsedData[dataY][dataX].rot;
        return orot < 0 ?
            orot :
            Mathf.mod(orot + rot, 4);
    };


    /**
     * @private
     * @param {BLKConstructionCore} blk
     * @param {Team} team
     * @param {ConstructionPlan} plan
     * @return {boolean}
     */
    function comp_ex_checkPlanComplete(blk, team, plan) {
        let iCap = plan.iCap();
        if(iCap === 0) return false;
        let i = 0;
        while(i < iCap) {
            if(!blk.self.ex_checkPlanTileComplete(plan[i + 1], plan[i], plan[i + 2], team, false)) return false;
            i += 3;
        };
        return true;
    };


    /**
     * @private
     * @param {BLKConstructionCore} blk
     * @param {Tile} t
     * @param {Block} oblk
     * @param {number} rot
     * @param {Team} team
     * @param {boolean} includeConstruct
     * @return {boolean}
     */
    function comp_ex_checkPlanTileComplete(blk, t, oblk, rot, team, includeConstruct) {
        if(t.build == null || t.build.team !== team) return false;

        return (
            t.build.block instanceof ConstructBlock && includeConstruct ?
                t.build.current === oblk :
                t.build.block === oblk
        ) && (rot < 0 || t.build.rotation === rot);
    };


    /**
     * @private
     * @param {BLKConstructionCore} blk
     * @param {Table} tb
     * @return {void}
     */
    function comp_ex_buildConstructionPlan(blk, tb) {
        let
            i,
            iCap = blk.delegee.constructionParsedData[0].iCap(),
            j = 0,
            jCap = blk.delegee.constructionParsedData.iCap(),
            k,
            kCap,
            l,
            blkCur,
            matArr = [].setValue(prov(() => []), jCap);
        while(j < jCap) {
            i = 0;
            // What's going on here...
            while(i < iCap) {
                blkCur = blk.delegee.constructionParsedData[j][i].blk;
                if(matArr[j][i] != null) {
                    i++;
                    continue;
                };
                if(blkCur !== Blocks.air && blkCur.size === 1) {
                    matArr[j][i] = (function(blkCur) {
                        return tb1 => tb1.button(new TextureRegionDrawable(MDL_texture.getRegBlk(blkCur)), Styles.clearNonei, 32.0, () => GLB_var.dialog.ct3.show(blkCur)).tooltip(blkCur.localizedName, true);
                    })(blkCur);
                } else if(blkCur === Blocks.air) {
                    k = j;
                    while(k < jCap) {
                        blkCur = blk.delegee.constructionParsedData[k][i].blk;
                        if(blkCur !== Blocks.air && blkCur.size !== 1 && blkCur.size === k - j + 1) {
                            kCap = k - j;
                            k = kCap;
                            while(k >= 0) {
                                l = kCap;
                                while(l >= 0) {
                                    matArr[j + k][i + l] = (function(blkCur, k, l) {
                                        return tb1 => tb1.button(new TextureRegionDrawable(MDL_texture.getRegBlkTileCut(blkCur, l, k)), Styles.clearNonei, 32.0, () => GLB_var.dialog.ct3.show(blkCur)).tooltip(blkCur.localizedName, true);
                                    })(blkCur, k, l);
                                    l--;
                                };
                                k--;
                            };
                            break;
                        };
                        k++;
                    };
                };
                i++;
            };
            j++;
        };

        tb.table(Styles.none, tb1 => {
            MDL_table.br(tb1, 1);
            j = 0;
            while(j < jCap) {
                i = 0;
                while(i < iCap) {
                    if(matArr[j][i] != null) {
                        matArr[j][i](tb1);
                    } else {
                        tb1.button(GLB_varGen.icons.dot, Styles.clearNonei, 32.0, () => {});
                    };
                    i++;
                };
                tb1.row();
                j++;
            };
            MDL_table.br(tb1, 1);
        })
        .left()
        .padLeft(28.0);
    };


    /**
     * @private
     * @param {BLKConstructionCore} blk
     * @param {Team} team
     * @param {ConstructionPlan} plan
     * @return {void}
     */
    function comp_ex_drawPlan(blk, team, plan) {
        let
            i = 0,
            iCap = plan.iCap();
        while(i < iCap) {
            if(plan[i] !== blk && !blk.self.ex_checkPlanTileComplete(plan[i + 1], plan[i], plan[i + 2], team, true)) {
                LCDrawf.planPlace(
                    plan[i], plan[i + 1],
                    plan[i + 2] < 0 ? 0.0 : (plan[i + 2] * 90.0),
                );
            };
            i += 3;
        };
    };


    /**
     * @private
     * @param {BConstructionCore} b
     * @return {void}
     */
    function comp_onProximityUpdate(b) {
        if(b.delegee.lastRot !== b.rotation) {
            b.delegee.lastRot = b.rotation;
            b.block.self.ex_findPlan(b.delegee.constructionPlan, b.tileX(), b.tileY(), b.rotation);
            let ot = b.block.self.ex_getPlanT(b.tileX(), b.tileY(), b.rotation, b.block.delegee.placeDataX, b.block.delegee.placeDataY);
            if(ot != null) {
                b.delegee.constructionPlanCx = ot.worldx() + b.block.delegee.placeBlk.offset;
                b.delegee.constructionPlanCy = ot.worldy() + b.block.delegee.placeBlk.offset;
            };
        };
    };


    /**
     * @private
     * @param {BConstructionCore} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(!GLB_param.UPDATE_SUPPRESSED && b.delegee.underConstruction) {
            if(!Vars.net.client() && b.delegee.constructionTimeCur >= b.block.delegee.constructionTimeReq) {
                b.configure("SPEC: complete");
            };
            b.delegee.constructionTimeCur += !global.lovecUtil.fun.checkSandbox() ? Time.delta : b.block.delegee.constructionTimeReq / 60.0;
            if(!Vars.headless) {
                Vars.control.sound.loop(fetchSound("SOUNDS: loopBuild"), b, 1.3);
            };

            if(!Vars.net.client() && GLB_timer.secFive) {
                // Deconstruction during construction?
                if(!b.block.self.ex_checkPlanComplete(b.team, b.delegee.constructionPlan)) {
                    b.configure("SPEC: stop");
                };
            };
        };
    };


    /**
     * @private
     * @param {BConstructionCore} b
     * @return {void}
     */
    function comp_draw(b) {
        Draw.rect(b.block.region, b.x, b.y);
        if(b.delegee.underConstruction) {
            LCDrawf.construct(b.delegee.constructionPlanCx, b.delegee.constructionPlanCy, MDL_texture.getRegBlk(b.block.delegee.placeBlk), b.self.ex_getConstructionFrac(), b.drawrot());
        } else {
            if(b.delegee.shouldDrawConstructionPlan && Vars.player.team() === b.team) {
                b.block.self.ex_drawPlan(b.team, b.delegee.constructionPlan);
            };
        };
    };


    /**
     * @private
     * @param {BConstructionCore} b
     * @param {Table} tb
     * @return {void}
     */
    function comp_buildConfiguration(b, tb) {
        tb.row();
        MDL_table.btnCfgToggle(tb, b, Icon.eyeOffSmall, Icon.eyeSmall, b.delegee.shouldDrawConstructionPlan).tooltip(MDL_bundle.getTerm("lovec", "toggle-display"), true);
        b.delegee.underConstruction ?
            MDL_table.btnCfg(tb, b, () => {
                b.configure("SPEC: stop");
                b.deselect();
            }, GLB_varGen.icons.cross).tooltip(MDL_bundle.getTerm("lovec", "construction-stop"), true) :
            MDL_table.btnCfg(tb, b, () => {
                if(!b.block.self.ex_checkPlanComplete(b.team, b.delegee.constructionPlan)) {
                    MDL_ui.showFadeInfo("lovec", "structure-incomplete");
                    return;
                };
                b.configure("SPEC: start");
                b.deselect();
            }, GLB_varGen.icons.check).tooltip(MDL_bundle.getTerm("lovec", "construction-start"), true);
    };


    /**
     * @private
     * @param {BConstructionCore} b
     * @return {void}
     */
    function comp_ex_stopConstruction(b) {
        b.delegee.underConstruction = false;
        b.delegee.constructionTimeCur = 0.0;
        GLB_eff.fadeRemovePack[b.block.size].at(b);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Used to construct a larger building from existing buildings.
         * {@link BLK_constructionCore#constructionData} is where the plan is defined.
         * Supports rotation.
         * <br> `NAMEGEN`
         * @class BLK_constructionCore
         * @extends BLK_materialBlock
         * @example
         * // Blocks larger than 1 block unit are treated as 1-sized blocks, with tiles except the center taken by air blocks
         * // You can replace "air" with null
         * // "SPEC: this" represents the core
         * // -1 for rotation means arbitrary rotation
         * let exampleData = [
         *     [["router", -1], ["router", -1], ["router", -1], ["router", -1]],
         *     [["router", -1], ["air", -1], ["air", -1], ["router", -1]],
         *     [["router", -1], ["distributor", -1], ["air", -1], ["router", -1]],
         *     [["SPEC: this", -1], ["router", -1], ["router", -1], ["router", -1]],
         * ];
         *
         * // You can replace the tuples with block names if rotation is not used
         * let exampleDataNoRot = [
         *     ["router", "router", "router", "router"],
         *     ["router", null, null, "router"],
         *     ["router", "distributor", null, "router"],
         *     ["SPEC: this", "router", "router", "router"],
         * ];
         */
        newClass()
        .extendClass(PARENT[0], "BLK_constructionCore")
        .initTemplate()
        .setParent(Wall)
        .setTags()
        .setParam({


            /**
             * `PARAM`: Definition of structure.
             * @memberof BLK_constructionCore
             * @instance
             * @type {TDynamic<ConstructionRawData>}
             */
            constructionData: tprov(() => [[]]),
            /**
             * `PARAM`: Target block that is built upon structure completion.
             * @memberof BLK_constructionCore
             * @instance
             * @type {Block}
             */
            placeBlk: null,
            /**
             * `PARAM`: X offset of the target block placement position. Set automatically if null.
             * @memberof BLK_constructionCore
             * @instance
             * @type {Number|null}
             */
            placeDataX: null,
            /**
             * `PARAM`: Y offset of the target block placement position. Set automatically if null.
             * @memberof BLK_constructionCore
             * @instance
             * @type {Number|null}
             */
            placeDataY: null,
            /**
             * `PARAM`: Rotation offset of the target block placement position.
             * @memberof BLK_constructionCore
             * @instance
             * @type {number}
             */
            placeOffRot: 0,
            /**
             * `PARAM`: Timer required to complete the construction.
             * @memberof BLK_constructionCore
             * @instance
             * @type {number}
             */
            constructionTimeReq: 3600.0,
            /**
             * `PARAM`: If true, this block won't modify properties of target block on INIT.
             * @memberof BLK_constructionCore
             * @instance
             * @type {boolean}
             */
            skipTargetSetup: false,


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_constructionCore
             * @instance
             * @type {TDynamic<ConstructionParsedData>}
             */
            constructionParsedData: tprov(() => []),
            /**
             * `INTERNAL`
             * @memberof BLK_constructionCore
             * @instance
             * @type {TDynamic<Point2>}
             */
            centerPon2: tprov(() => new Point2()),
            /**
             * `INTERNAL`
             * @memberof BLK_constructionCore
             * @instance
             * @type {TDynamic<Point2>}
             */
            corePon2: tprov(() => new Point2()),
            /**
             * `INTERNAL`: Size of the construction plan square.
             * @memberof BLK_constructionCore
             * @instance
             * @type {number}
             */
            planSize: 1,
            /**
             * `INTERNAL`
             * @memberof BLK_constructionCore
             * @instance
             * @type {TDynamic<ConstructionPlan>}
             */
            constructionTmpPlan: tprov(() => []),
            /**
             * `INTERNAL`
             * @memberof BLK_constructionCore
             * @instance
             * @type {TDynamic<F2Array<Block, number>>}
             */
            constructionBlksReq: tprov(() => []),
            /**
             * `INTERNAL`
             * @memberof BLK_constructionCore
             * @instance
             * @type {TDynamic<Object<string, number>>}
             */
            constructionItemsReq: tprov(() => ({})),


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            setBars: function() {
                comp_setBars(this);
            },


            drawPlace: function(tx, ty, rot, valid) {
                comp_drawPlace(this, tx, ty, rot, valid);
            },


            /**
             * Processes raw construction data on INIT.
             * @memberof BLK_constructionCore
             * @instance
             * @func
             * @return {void}
             */
            ex_parseConstructionData: function() {
                comp_ex_parseConstructionData(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Places target block at (tx, ty) with given rotation.
             * @memberof BLK_constructionCore
             * @instance
             * @func
             * @param {Team} team
             * @param {number} tx
             * @param {number} ty
             * @param {number} rot
             * @return {void}
             */
            ex_placePlanTarget: function(team, tx, ty, rot) {
                comp_ex_placePlanTarget(this, team, tx, ty, rot);
            }
            .setProp({
                noSuper: true,
                argLen: 4,
            }),


            /**
             * Removes all existing buildings for the plan.
             * @memberof BLK_constructionCore
             * @instance
             * @func
             * @param {ConstructionPlan} plan
             * @return {void}
             */
            ex_removePlanBlks: function(plan) {
                comp_ex_removePlanBlks(this, plan);
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * Gets transformed plan at (tx, ty) with given rotation.
             * @memberof BLK_constructionCore
             * @instance
             * @func
             * @param {ConstructionPlan|unset} contPlan
             * @param {number} tx
             * @param {number} ty
             * @param {number} rot
             * @return {ConstructionPlan}
             */
            ex_findPlan: function(contPlan, tx, ty, rot) {
                return comp_ex_findPlan(this, contPlan, tx, ty, rot);
            }
            .setProp({
                noSuper: true,
                argLen: 4,
            }),


            /**
             * Calculates amounts of blocks to be consumed.
             * @memberof BLK_constructionCore
             * @instance
             * @func
             * @param {F2Array<Block, number>|unset} contArr
             * @return {F2Array<Block, number>}
             */
            ex_calcBlksReq: function(contArr) {
                return comp_ex_calcBlksReq(this, contArr);
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * Calculates amounts of items required.
             * @memberof BLK_constructionCore
             * @instance
             * @func
             * @param {Object<string, number>|unset} contObj
             * @param {F2Array<Block, number>|unset} blksReq
             * @return {Object<string, number>}
             */
            ex_calcItemsReq: function(contObj, blksReq) {
                return comp_ex_calcItemsReq(this, contObj, blksReq);
            }
            .setProp({
                noSuper: true,
                argLen: 2,
            }),


            /**
             * Gets transformed tile target.
             * @memberof BLK_constructionCore
             * @instance
             * @func
             * @param {number} tx
             * @param {number} ty
             * @param {number} rot
             * @param {number} dataX
             * @param {number} dataY
             * @return {Tile|null}
             */
            ex_getPlanT: function(tx, ty, rot, dataX, dataY) {
                return comp_ex_getPlanT(this, tx, ty, rot, dataX, dataY);
            }
            .setProp({
                noSuper: true,
                argLen: 5,
            }),


            /**
             * Gets transformed building rotation.
             * @memberof BLK_constructionCore
             * @instance
             * @func
             * @param {number} rot
             * @param {number} dataX
             * @param {number} dataY
             * @return {number}
             */
            ex_getPlanRot: function(rot, dataX, dataY) {
                return comp_ex_getPlanRot(this, rot, dataX, dataY);
            }
            .setProp({
                noSuper: true,
                argLen: 3,
            }),


            /**
             * Whether a construction plane is completed.
             * @memberof BLK_constructionCore
             * @instance
             * @func
             * @param {Team} team
             * @param {ConstructionPlan} plan
             * @return {boolean}
             */
            ex_checkPlanComplete: function(team, plan) {
                return comp_ex_checkPlanComplete(this, team, plan);
            }
            .setProp({
                noSuper: true,
                argLen: 2,
            }),


            /**
             * Whether construction plan is partially complete at a tile.
             * @memberof BLK_constructionCore
             * @instance
             * @func
             * @param {Tile} t
             * @param {Block} oblk
             * @param {number} rot
             * @param {Team} team
             * @param {boolean} includeConstruct - If true, {@link ConstructBlock} will be seen as its target block.
             * @return {boolean}
             */
            ex_checkPlanTileComplete: function(t, oblk, rot, team, includeConstruct) {
                return comp_ex_checkPlanTileComplete(this, t, oblk, rot, team, includeConstruct);
            }
            .setProp({
                noSuper: true,
                argLen: 5,
            }),


            /**
             * @memberof BLK_constructionCore
             * @instance
             * @func
             * @param {Table} tb
             * @return {void}
             */
            ex_buildConstructionPlan: function(tb) {
                comp_ex_buildConstructionPlan(this, tb);
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * @memberof BLK_constructionCore
             * @instance
             * @func
             * @param {Team} team
             * @param {ConstructionPlan} plan
             * @return {void}
             */
            ex_drawPlan: function(team, plan) {
                comp_ex_drawPlan(this, team, plan);
            }
            .setProp({
                noSuper: true,
                argLen: 2,
            }),


        }),


        /**
         * @class B_constructionCore
         * @extends B_materialBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_constructionCore")
        .initTemplate()
        .setParent(Wall.WallBuild)
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_constructionCore
             * @instance
             * @type {number}
             */
            lastRot: -1,
            /**
             * `INTERNAL`
             * @memberof B_constructionCore
             * @instance
             * @type {TDynamic<ConstructionPlan>}
             */
            constructionPlan: tprov(() => []),
            /**
             * `INTERNAL`
             * @memberof B_constructionCore
             * @instance
             * @type {number}
             */
            constructionPlanCx: 0.0,
            /**
             * `INTERNAL`
             * @memberof B_constructionCore
             * @instance
             * @type {number}
             */
            constructionPlanCy: 0.0,
            /**
             * `INTERNAL`: If true, a preview is drawn.
             * @memberof B_constructionCore
             * @instance
             * @type {boolean}
             */
            shouldDrawConstructionPlan: false,
            /**
             * `INTERNAL`
             * @memberof B_constructionCore
             * @instance
             * @type {boolean}
             */
            underConstruction: false,
            /**
             * `INTERNAL`
             * @memberof B_constructionCore
             * @instance
             * @type {number}
             */
            constructionTimeCur: 0.0,


        })
        .setMethod({


            onProximityUpdate: function() {
                comp_onProximityUpdate(this);
            },


            updateTile: function() {
                comp_updateTile(this);
            },


            status: function() {
                return !this.enabled ?
                    BlockStatus.logicDisable :
                    this.underConstruction ?
                        BlockStatus.active :
                        BlockStatus.noInput;
            }
            .setProp({
                noSuper: true,
            }),


            buildConfiguration: function(tb) {
                comp_buildConfiguration(this, tb);
            }
            .setProp({
                noSuper: true,
            }),


            draw: function() {
                comp_draw(this);
            }
            .setProp({
                noSuper: true,
            }),


            write: function(wr) {
                wr.bool(this.delegee.underConstruction);
                wr.f(this.delegee.constructionTimeCur);
            },


            read: function(rd, revi) {
                this.delegee.underConstruction = rd.bool();
                this.delegee.constructionTimeCur = rd.f();
            },


            /**
             * @memberof B_constructionCore
             * @instance
             * @func
             * @return {void}
             */
            ex_stopConstruction: function() {
                comp_ex_stopConstruction(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof B_constructionCore
             * @instance
             * @func
             * @return {number}
             */
            ex_getConstructionFrac: function() {
                return Mathf.clamp(this.delegee.constructionTimeCur / this.block.delegee.constructionTimeReq);
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
