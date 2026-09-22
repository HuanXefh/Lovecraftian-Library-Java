/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * Registers new dialogs.
     * @module lovec/tp/TP_dial
     */


/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ auxiliary ------------------------------> */


    /**
     * Clears content of a dialog.
     * @param {Dialog} dial
     * @param {string|unset} [title]
     * @return {void}
     */
    const resetDial = function(dial, title) {
        dial.cont.clear();
        dial.buttons.clear();
        if(title != null) {
            dial.title.setText(title.color(Pal.accent));
            dial.title.getStyle().fontColor = Color.white;
        };
    };
    exports.resetDial = resetDial;


    /* <------------------------------ base ------------------------------> */


    /**
     * Fallback when a dialog name is not found.
     * @type {F0Function<BaseDialog>}
     */
    const def = () => extend(BaseDialog, "ohno", {


        /**
         * @return {void}
         */
        ex_show() {
            resetDial(this);

            // `TABLE`: text
            this.cont.add("You're not supposed to see this.");
            this.cont.row();
            this.cont.add("If you do, something just went wrong :(");
            this.cont.row();

            // `TABLE`: buttons
            MDL_table.br(this.cont);
            MDL_table.btnClose(this.buttons, this);

            this.show();
        },


    });
    newDialog("def", def);
    exports.def = def;


    /* <------------------------------ info ------------------------------> */


    /**
     * A dialog for {@link DBCT_infoContent}.
     * @type {F0Function<BaseDialog>}
     */
    const infoContent = () => extend(BaseDialog, "", {


        /**
         * @param {string} nameMod
         * @param {string} nameInfo
         * @return {void}
         */
        ex_show(nameMod, nameInfo) {
            resetDial(this, MDL_bundle.getInfo(nameMod, "content-" + nameInfo));

            // `TABLE`: text
            this.cont.pane(pnTb => {
                MDL_table.margin(pnTb);
                MDL_table.wrapLine(pnTb, MDL_bundle.getInfo(nameMod, "content-" + nameInfo, true), {padOrd: 1});
            })
            .width(MDL_ui.getUiW())
            .row();

            // `TABLE`: buttons
            MDL_table.br(this.cont);
            MDL_table.btnClose(this.buttons, this);

            this.show();
        },


    });
    newDialog("infoContent", infoContent);
    exports.infoContent = infoContent;


    /**
     * A dialog to show viewed texts in a dialog flow.
     * @type {F0Function<BaseDialog>}
     */
    const dialFlowLog = () => extend(BaseDialog, MDL_bundle.getInfo("lovec", "dial-dial-flow-log"), {


        /**
         * @return {void}
         */
        ex_show() {
            if(UTIL_dialogFlow.getLog().length === 0) {
                console.warn("[LOVEC] Cannot show log when no dialog flow is being played!");
                return;
            };
            resetDial(this);

            // `TABLE`: text
            this.cont.pane(pnTb => {
                MDL_table.margin(pnTb);
                UTIL_dialogFlow.getLog().forEachFast(obj => {
                    // `TABLE`: text cell
                    pnTb.table(Styles.none, tb => {
                        if(obj.chara === "SPEC: selection") {
                            tb.center();
                            MDL_table.wrapLine(tb, "<${1}>".format(obj.text), {labelAlign: Align.center, padOrd: 1});
                        } else {
                            tb.left();
                            if(!String.isEmpty(obj.chara)) {
                                tb.add(obj.chara).left().row();
                            };
                            tb.add("").row();
                            MDL_table.wrapLine(tb, obj.text, {padOrd: 1, padLeft: 48.0});
                        };
                    }).growX().row();
                    MDL_table.br(pnTb, 3);
                }, true);
            })
            .width(MDL_ui.getUiW())
            .row();

            // `TABLE`: buttons
            MDL_table.br(this.cont);
            MDL_table.btnClose(this.buttons, this);

            this.show();
        },


    });
    newDialog("dialFlowLog", dialFlowLog);
    exports.dialFlowLog = dialFlowLog;


    /**
     * A dialog for wave enemy display.
     * @type {F0Function<BaseDialog>}
     */
    const waveInfo = () => extend(BaseDialog, "", {


        /** @type {number} */
        tmpCount: 0,


        /**
         * @param {number} countWave
         * @return {void}
         */
        ex_show(countWave) {
            if(countWave == null) countWave = Vars.state.wave;
            this.tmpCount = countWave;
            resetDial(this, MDL_bundle.getInfo("lovec", "dial-wave-enemies") + " (" + countWave + ")");

            // `TABLE`: list
            this.cont.pane(pnTb => {
                MDL_table.margin(pnTb);
                if(countWave < 1) {
                    MDL_table.textNothing(pnTb);
                } else {
                    let matArr = [[
                        "",
                        MDL_bundle.getTerm("lovec", "unit"),
                        MDL_bundle.getTerm("lovec", "amount"),
                        MDL_bundle.getTerm("lovec", "total-health"),
                        MDL_bundle.getTerm("lovec", "shield"),
                        MDL_bundle.getTerm("lovec", "status"),
                    ]];
                    let amt_fi;
                    MDL_prop.getWaveArr(countWave).forEachRow(4, (utp, amt, shield, sta) => {
                        amt_fi = Math.round(amt / Vars.state.rules.unitCost(Vars.state.rules.waveTeam));
                        if(amt_fi < 1) return;
                        matArr.push([
                            utp,
                            utp.localizedName,
                            amt_fi,
                            (utp.health * amt_fi * Vars.state.rules.unitHealth(Vars.state.rules.waveTeam)).amount(),
                            (shield * Vars.state.rules.unitHealth(Vars.state.rules.waveTeam)).amount(),
                            sta === StatusEffects.none ? "-" : sta,
                        ]);
                    });
                    if(matArr.length === 1) {
                        MDL_table.textNothing(pnTb);
                    } else {
                        if(PARAM.SECRET_APRIL) {
                            matArr.push([
                                UnitTypes.alpha,
                                UnitTypes.alpha.localizedName,
                                9999,
                                (UnitTypes.alpha.health * 9999 * Vars.state.rules.unitHealth(Vars.state.rules.waveTeam)).amount(),
                                0.0,
                                StatusEffects.boss,
                            ]);
                        };
                        MDL_table.setTable(pnTb, matArr);
                    };
                };
            })
            .width(MDL_ui.getUiW())
            .row();

            // `TABLE`: buttons
            MDL_table.br(this.cont);
            MDL_table.btnClose(this.buttons, this);
            MDL_table.btn(this.buttons, MDL_bundle.getTerm("lovec", "previous-wave"), () => this.ex_show(Math.max(this.tmpCount - 1, 1)));
            MDL_table.btn(this.buttons, MDL_bundle.getTerm("lovec", "next-wave"), () => this.ex_show(this.tmpCount + 1));

            this.show();
        },


    });
    newDialog("waveInfo", waveInfo);
    exports.waveInfo = waveInfo;


    /**
     * A dialog to show a list of information. See {@link UTIL_dragButtonInfoList}.
     * @type {F0Function<BaseDialog>}
     */
    const infoListMain = () => extend(BaseDialog, MDL_bundle.getTerm("lovec", "info-list"), {


        /**
         * @param {ObjectMap<string, ObjectMap<string, ObjectMap<string, C0Function>>>} infoListData
         * @param {Array<string>} moddedNames
         * @return {void}
         */
        ex_show(infoListData, moddedNames) {
            resetDial(this);

            // `TABLE`: list
            MDL_table.br(this.cont);
            this.cont.pane(pnTb => {
                MDL_table.margin(pnTb);
                infoListData.each((categ, map) => {
                    MDL_table.btn(
                        pnTb,
                        UTIL_dragButtonInfoList.getLocalizedCategName(categ === "uncategorized" ? "global" : categ),
                        () => fetchDialog("infoListSub").ex_show(categ, map, moddedNames),
                        {w: 500.0},
                    ).row();
                });
            })
            .width(MDL_ui.getUiW() * 1.25)
            .row();

            // `TABLE`: buttons
            MDL_table.br(this.cont);
            MDL_table.btnClose(this.buttons, this);

            this.show();
        },


    });
    newDialog("infoListMain", infoListMain);
    exports.infoListMain = infoListMain;


    /**
     * A dialog to show a list of information. See {@link UTIL_dragButtonInfoList}.
     * @type {F0Function<BaseDialog>}
     */
    const infoListSub = () => extend(BaseDialog, "", {


        /** @type {boolean} */
        hasAnyName: false,
        /** @type {string} */
        lastInfoString: "",


        /**
         * @param {string} categ
         * @param {ObjectMap<string, ObjectMap<string, C0Function>>} map
         * @param {Array<string>} moddedNames
         * @return {void}
         */
        ex_show(categ, map, moddedNames) {
            resetDial(this, UTIL_dragButtonInfoList.getLocalizedCategName(categ === "uncategorized" ? "global" : categ));

            // `TABLE`: list
            MDL_table.br(this.cont);
            this.cont.pane(pnTb => {
                MDL_table.margin(pnTb);
                map.each((subCateg, subMap) => {
                    this.hasAnyName = false;
                    subMap.each((name, scr) => {
                        if(this.hasAnyName) return;
                        this.lastInfoString = UTIL_dragButtonInfoList.getInfoString(name, categ, subCateg);
                        this.hasAnyName = PARAM.MODDED || !moddedNames.includes(this.lastInfoString);
                    });
                    if(this.hasAnyName) {
                        if(subCateg !== "uncategorized") {
                            MDL_table.br(pnTb);
                            pnTb.add(UTIL_dragButtonInfoList.getLocalizedCategName(subCateg)).color(Color.lightGray).row();
                        };
                        subMap.each((name, scr) => {
                            this.lastInfoString = UTIL_dragButtonInfoList.getInfoString(name, categ, subCateg);
                            if(!PARAM.MODDED && moddedNames.includes(this.lastInfoString)) return;
                            MDL_table.btn(
                                pnTb,
                                UTIL_dragButtonInfoList.getLocalizedInfoName(name),
                                scr,
                                {w: 500.0},
                            ).row();
                        });
                    };
                });
            })
            .width(MDL_ui.getUiW() * 1.25)
            .row();

            // `TABLE`: buttons
            MDL_table.br(this.cont);
            MDL_table.btnClose(this.buttons, this);

            this.show();
        },


    });
    newDialog("infoListSub", infoListSub);
    exports.infoListSub = infoListSub;


    /**
     * A dialog for achievements, see {@link CLS_achievement}.
     * @type {F0Function<BaseDialog>}
     */
    const achievement = () => extend(BaseDialog, MDL_bundle.getTerm("lovec", "achievement"), {


        /**
         * @param {Table} tb
         * @param {CLS_achievement} achievement
         * @return {void}
         */
        ex_buildBox(tb, achievement) {
            tb.table(Styles.none, tb1 => {
                MDL_table.margin(tb1, 0.5);
                tb1.table(Tex.whiteui, tb2 => {
                    tb2.center().setColor(achievement.isCompleted() ? Color.darkGray : Pal.darkestGray);
                    tb2.imageDraw(() => achievement.getIcon()).width(64.0).height(64.0).color(!achievement.isCompleted() ? Color.darkGray : Color.white).tooltip(!achievement.isCompleted() && !global.lovecUtil.prop.debug ? "???" : achievement.getText(), true);
                })
                .width(72.0)
                .height(72.0);
            });
        },


        /**
         * @return {void}
         */
        ex_show() {
            resetDial(this);

            // `TABLE`: list
            MDL_table.br(this.cont);
            this.cont.pane(pnTb => {
                MDL_table.margin(pnTb);
                if(CLS_achievement.getAll().length === 0) {
                    MDL_table.textNothing(pnTb);
                } else {
                    let tmpObj = {};
                    let
                        i,
                        iCap,
                        j,
                        colAmt = 10,
                        nameMod;

                    CLS_achievement.getAll().forEachFast(achievement => {
                        nameMod = achievement.getMod().name;
                        if(tmpObj[nameMod] === undefined) tmpObj[nameMod] = [];
                        tmpObj[nameMod].push(achievement);
                    }, true);
                    Object.eachPair(tmpObj, (nameMod, arr) => {
                        pnTb.add(fetchMod(nameMod, true).meta.displayName).left().fontScale(1.1).color(Pal.accent).row();
                        pnTb.table(Styles.none, tb => {
                            i = 0;
                            iCap = arr.iCap();
                            j = 0;
                            while(i < iCap) {
                                this.ex_buildBox(tb, arr[i]);
                                if(j % colAmt === colAmt - 1) tb.row();
                                j++;
                                i++;
                            };
                        }).left().row();
                    });
                };
            })
            .width(MDL_ui.getUiW() * 1.25)
            .row();

            // `TABLE`: buttons
            MDL_table.br(this.cont);
            MDL_table.btnClose(this.buttons, this);

            this.show();
        },


    });
    newDialog("achievement", achievement);
    exports.achievement = achievement;


    /* <------------------------------ content ------------------------------> */


    /**
     * A dialog that shows a list of contents.
     * @type {F0Function<BaseDialog>}
     */
    const cts = () => extend(BaseDialog, "", {


        /**
         * @param {string} title
         * @param {Array<ContentGn>} cts_gn
         * @param {boolean} isAfterCt
         * @return {void}
         */
        ex_show(title, cts_gn, isAfterCt) {
            resetDial(this, title);

            // `TABLE`: content
            MDL_table.br(this.cont);
            this.cont.pane(pnTb => {
                MDL_table.margin(pnTb);
                let iCap = cts_gn.iCap();
                if(iCap === 0) {
                    MDL_table.textNothing(pnTb);
                } else {
                    let colAmt = MDL_ui.getColAmt(32.0, 4.0, 2);
                    for(let i = 0, j = 0; i < iCap; i++) {
                        MDL_table.ctIcon(pnTb, MDL_content.getCt(cts_gn[i], null, true), {dialToHide: !isAfterCt ? null : this});
                        if(j % colAmt === colAmt - 1) pnTb.row();
                        j++;
                    };
                };
            })
            .width(MDL_ui.getUiW())
            .row();

            // `TABLE`: buttons
            MDL_table.br(this.cont);
            MDL_table.btnClose(this.buttons, this);

            this.show();
        },


    });
    newDialog("cts", cts);
    exports.cts = cts;


    /**
     * A dialog for content display in rows.
     * @type {F0Function<BaseDialog>}
     */
    const ctsRow = () => extend(BaseDialog, "", {


        /**
         * @param {string} title
         * @param {Array<ContentGn>} cts_gn
         * @return {void}
         */
        ex_show(title, cts_gn) {
            resetDial(this, title);

            // `TABLE`: content
            MDL_table.br(this.cont);
            this.cont.pane(pnTb => {
                MDL_table.setCtRow(pnTb, cts_gn, true);
            })
            .width(MDL_ui.getUiW())
            .row();

            // `TABLE`: buttons
            MDL_table.br(this.cont);
            MDL_table.btnClose(this.buttons, this);

            this.show();
        },


    });
    newDialog("ctsRow", ctsRow);
    exports.ctsRow = ctsRow;


    /* <------------------------------ recipe ------------------------------> */


    /**
     * A dialog used for optional input display of multi-crafters.
     * @type {F0Function<BaseDialog>}
     */
    const rcOpt = () => extend(BaseDialog, "", {


        /**
         * @param {string} title
         * @param {RecipeIo4Array} opt
         * @return {void}
         */
        ex_show(title, opt) {
            resetDial(this, title);

            // `TABLE`: info
            MDL_table.br(this.cont);
            MDL_table.setNote(this.cont, MDL_bundle.getInfo("lovec", "opt"));

            // `TABLE`: bar
            MDL_table.br(this.cont);
            MDL_table.bar(this.cont, {w: MDL_ui.getUiW()});

            // `TABLE`: content
            MDL_table.br(this.cont);
            this.cont.pane(pnTb => {
                MDL_table.margin(pnTb);
                let iCap = opt.iCap();
                if(iCap === 0) {
                    MDL_table.textNothing(pnTb);
                } else {
                    let tmp, amt, p, mtp;
                    for(let i = 0; i < iCap; i += 4) {
                        tmp = opt[i];
                        amt = opt[i + 1];
                        p = opt[i + 2];
                        mtp = opt[i + 3];
                        pnTb.add("[" + Strings.fixed(i / 4.0 + 1.0, 0) + "]").center().color(Pal.accent).padRight(36.0);
                        MDL_table.rcCtIcon(pnTb, tmp, amt, p, false, {padRight: 72.0, dialToHide: this});
                        pnTb.add(MDL_text.getStat(
                            MDL_bundle.getTerm("lovec", "efficiency-multiplier"),
                            mtp.perc(0),
                        )).center().padRight(6.0);
                        pnTb.row();
                    };
                };
            })
            .width(MDL_ui.getUiW())
            .row();

            // `TABLE`: buttons
            MDL_table.br(this.cont);
            MDL_table.btnClose(this.buttons, this);

            this.show();
        },


    });
    newDialog("rcOpt", rcOpt);
    exports.rcOpt = rcOpt;


    /**
     * A dialog showing all recipes used in multi-crafters.
     * @type {F0Function<BaseDialog>}
     */
    const rcDatabase = () => extend(BaseDialog, MDL_bundle.getInfo("lovec", "dial-rc-database"), {


        /** @type {boolean} */
        hasBuilt: false,
        /** @type {ObjectMap<Block, Array<CLS_recipe>>} */
        map: CLS_recipe.getBlkRcsMap(),
        /** @type {ObjectMap<Mods.LoadedMod, Object>} */
        modDataMap: new ObjectMap(),


        /**
         * @return {void}
         */
        ex_show() {
            if(this.hasBuilt) {
                this.show();
                return;
            };
            resetDial(this);

            if(this.map.size > 0) {
                let lastRc = null, data;
                this.map.each((blk, rcs) => {
                    if(!this.modDataMap.containsKey(blk.minfo.mod)) {
                        this.modDataMap.put(blk.minfo.mod, {
                            rcs: [],
                            icons: [],
                            ttArgs: [],
                            scrs: [],
                            breakBools: [],
                        });
                    };
                    data = this.modDataMap.get(blk.minfo.mod);
                    rcs.forEachFast(rc => {
                        data.rcs.push(rc);
                        data.icons.push(rc.altIcon);
                        data.ttArgs.push([MDL_bundle.getTerm("lovec", "recipe-display"), tb => rc.displayTooltip(tb, true, rc.owner.localizedName)]);
                        data.scrs.push(() => Vars.ui.content.show(rc.owner));
                        data.breakBools.push(lastRc != null && lastRc.owner !== rc.owner);
                        lastRc = rc;
                    }, true);
                });
            };

            // `TABLE`: content
            MDL_table.br(this.cont);
            let pnCell = this.cont.pane(pnTb => {
                MDL_table.margin(pnTb, 0.5);
                this.modDataMap.each((mod, data) => {
                    pnTb.table(Styles.none, modCont => {
                        let listTb = new Table();
                        let coll = new Collapser(listTb, true);
                        coll.setDuration(0.3);

                        modCont.table(Styles.none, tb => {
                            tb.left();
                            tb.add(mod.meta.displayName).color(Pal.accent).left();
                            tb.button(Icon.downOpen, Styles.emptyi, () => coll.toggle(true))
                            .left()
                            .update(btn => btn.getStyle().imageUp = !coll.isCollapsed() ? Icon.upOpen : Icon.downOpen)
                            .size(10.0)
                            .padLeft(16.0)
                            .expandX()
                            .row();
                            MDL_table.bar(tb, {color: Pal.accent, stroke: 2.0});
                            MDL_table.br(tb, 1);
                        })
                        .left()
                        .growX()
                        .row();

                        MDL_table.setIconLi(
                            listTb, data.icons, data.ttArgs, data.scrs,
                            {size: 40.0},
                            {colAmt: MDL_ui.getColAmt(40.0, 4.0), breakBools: data.breakBools},
                        );
                        modCont.add(coll);
                    })
                    .growX()
                    .row();
                    MDL_table.br(pnTb, 1);
                });
            });
            pnCell
            .width(MDL_ui.getUiW(0.0))
            .row();

            // `TABLE`: buttons
            MDL_table.br(this.cont);
            MDL_table.btnClose(this.buttons, this);

            this.hasBuilt = true;
            this.show();
        },


    });
    newDialog("rcDatabase", rcDatabase);
    exports.rcDatabase = rcDatabase;


    /**
     * A dialog showing all contents registered in recipe dictionary.
     * @type {F0Function<BaseDialog>}
     */
    const rcDictDatabase = () => extend(BaseDialog, MDL_bundle.getInfo("lovec", "dial-rcdict-database"), {


        /** @type {number} */
        w: 36.0,
        /** @type {number} */
        pad: 4.0,
        /** @type {ScrollPane} */
        lastPn: null,
        /** @type {number} */
        lastScrollY: 0.0,
        /** @type {UnlockableContent|null} */
        lastChecked: null,


        /**
         * @param {Table} tb
         * @param {string|UnlockableContent} ct
         * @param {boolean} isCustomField
         * @return {void}
         */
        ex_buildCtBtn(tb, ct, isCustomField) {
            let icon = isCustomField ?
                MDL_recipeDict.rcDict.customFieldMap.get(ct).icon :
                new TextureRegionDrawable(ct.uiIcon);
            let btn = tb.button(icon, this.w, () => {
                this.lastScrollY = this.lastPn.getScrollY();
                this.lastChecked = ct;
                this.hide();
                fetchDialog("rcDict").ex_show(isCustomField ? MDL_recipeDict.getCustomFieldBundle(ct) : ct.localizedName, ct, true);
            })
            .left()
            .pad(this.pad)
            .tooltip(isCustomField ? MDL_recipeDict.getCustomFieldBundle(ct) : ct.localizedName)
            .get();
            btn.margin(3.0);
            btn.setChecked(ct === this.lastChecked);
            let btnStyle = btn.getStyle();
            btnStyle.up = Styles.none;
            btnStyle.down = Styles.none;
            btnStyle.over = Styles.flatOver;
            btnStyle.checked = Styles.flatDown;
        },


        /**
         * @param {UnlockableContent} ct
         * @param {UnlockableContent} lastCt
         * @return {boolean}
         */
        ex_shouldBreak(ct, lastCt) {
            return ct.getContentType() !== lastCt.getContentType()
                || (ct.ex_getFluid != null && lastCt.ex_getFluid == null)
                || (MDL_cond.isAuxiliaryFluid(ct) && !MDL_cond.isAuxiliaryFluid(lastCt));
        },


        /**
         * @return {void}
         */
        ex_show() {
            resetDial(this);

            // `TABLE`: list
            MDL_table.br(this.cont);
            let pnCell = this.cont.pane(pnTb => {
                MDL_table.margin(pnTb);
                let
                    i = 0,
                    j = 0,
                    colAmt = MDL_ui.getColAmt(this.w, 0.0, 2),
                    lastCt = null;
                pnTb.table(Tex.whiteui, tb => {
                    tb.left().setColor(Pal.darkestGray);
                    MDL_table.margin(tb, 0.5);
                    MDL_recipeDict.rcDict.customFieldMap.each((name, obj) => {
                        this.ex_buildCtBtn(tb, name, true);
                        if(j % colAmt === colAmt - 1) tb.row();
                        i++;
                        j++;
                    });
                    j = -1;
                    tb.row();
                    MDL_table.br(tb);
                    VARGEN.rcDictCts.forEachFast(ct => {
                        if(lastCt != null && this.ex_shouldBreak(ct, lastCt)) {
                            j = -1;
                            tb.row();
                            MDL_table.br(tb);
                        } else if(j % colAmt === colAmt - 1) {
                            j = -1;
                            tb.row();
                        };
                        this.ex_buildCtBtn(tb, ct, false);
                        i++;
                        j++;
                        lastCt = ct;
                    }, true);
                });
            });
            pnCell
            .width(MDL_ui.getUiW())
            .row();
            this.lastPn = pnCell.get();
            Core.app.post(() => {
                this.lastPn.setScrollY(this.lastScrollY);
            });

            // `TABLE`: buttons
            MDL_table.br(this.cont);
            MDL_table.btnClose(this.buttons, this);

            this.show();
        },


    });
    newDialog("rcDictDatabase", rcDictDatabase);
    exports.rcDictDatabase = rcDictDatabase;


    /**
     * A dialog used for recipe dictionary display.
     * @type {F0Function<BaseDialog>}
     */
    const rcDict = () => extend(BaseDialog, "", {


        /**
         * @param {Object} rate
         * @param {number} deciAmt
         * @param {boolean} isStatic
         * @return {string}
         */
        ex_getRateStr(rate, deciAmt, isStatic) {
            return typeof rate !== "number" ?
                "-" :
                isStatic ?
                    rate.numToStr(deciAmt) :
                    rate > 0.0167 ?
                        (rate.numToStr(deciAmt) + "/s") :
                        rate * 60.0 > 0.0167 ?
                            ((rate * 60.0).numToStr(deciAmt) + "/min") :
                            rate * 3600.0 > 0.0167 ?
                                ((rate * 3600.0).numToStr(deciAmt) + "/h") :
                                "~0.0/s";
        },


        /**
         * @param {Table} tb
         * @param {string|UnlockableContent} ct
         * @param {RecipeDictionaryIoArray} rcDictArr
         * @param {boolean} isCustomField
         */
        ex_buildList(tb, ct, rcDictArr, isCustomField) {
            let
                i = 0,
                iCap = rcDictArr.iCap(),
                j = 0;

            let rcCont;
            while(i < iCap) {
                rcCont = tb.table(Styles.none, tb1 => tb1.left()).left().width(240.0).height(60.0).get();
                // `TABLE`: small icon
                rcCont.table(Styles.none, tb1 => {
                    MDL_table.ctIcon(tb1, rcDictArr[i], {size: 48.0, pad: 8.0, dialToHide: this});
                });
                // `TABLE`: recipe text
                let data = rcDictArr[i + 2];
                if(data.hidden) {
                    i += 3;
                    continue;
                };
                let craftTime, craftRate, btn, btnCell;
                let isContinuous = isCustomField ?
                    MDL_recipeDict.rcDict.customFieldMap.get(ct).isContinuous :
                    ct instanceof Liquid;
                // `Boolean(any)` is required here, otherwise undefined will be treated as true in `ex_getRateStr`, WTF???
                let isStatic = isCustomField ?
                    Boolean(MDL_recipeDict.rcDict.customFieldMap.get(ct).isStatic) :
                    false;
                rcCont.table(Styles.none, tb1 => {
                    craftTime = data.time != null ?
                        data.time :
                        MDL_content.getCraftTime(rcDictArr[i], data.icon === "lovec-icon-mining", isCustomField ? null : ct);
                    craftRate = !isFinite(craftTime) && !isContinuous && !isStatic ?
                        null :
                        isContinuous ?
                            (rcDictArr[i + 1] * 60.0) :
                            isStatic ?
                                rcDictArr[i + 1] :
                                (rcDictArr[i + 1] / craftTime * 60.0);
                    // `TABLE`: rate text
                    tb1.add(MDL_text.getStat(
                        MDL_bundle.getTerm("lovec", isStatic ? "amount" : "rate"),
                        this.ex_getRateStr(craftRate, 3, isStatic),
                    ))
                    .left()
                    .tooltip(this.ex_getRateStr(craftRate, 7, isStatic), true)
                    .row();
                    // `TABLE`: extra icon
                    tb1.table(Styles.none, tb2 => {
                        tb2.left();
                        // `TABLE`: content icon
                        if(data.ct != null) {
                            let oct, isOtherCustomField = false;
                            if(MDL_recipeDict.rcDict.customFieldMap.containsKey(data.ct)) {
                                isOtherCustomField = true;
                                oct = data.ct;
                            } else {
                                oct = MDL_content.getCt(data.ct, null, true);
                            };
                            if(oct != null) {
                                btnCell = tb2.button(Tex.whiteui, Styles.clearNoneTogglei, 28.0, () => {
                                    this.hide();
                                    isOtherCustomField ?
                                        this.ex_show(MDL_recipeDict.getCustomFieldBundle(oct), oct) :
                                        Vars.ui.content.show(oct);
                                }).left();
                                if(data.ctTableF != null) {
                                    let blk = rcDictArr[i];
                                    MDL_table.tooltip(btnCell, tb => data.ctTableF(tb, blk, ct), MDL_bundle.getTerm("lovec", "recipe-display"));
                                } else if(data.ctText) {
                                    btnCell.tooltip(data.ctText, true);
                                } else if(isOtherCustomField) {
                                    btnCell.tooltip(MDL_recipeDict.getCustomFieldBundle(oct), true);
                                } else {
                                    btnCell.tooltip(oct.localizedName, true);
                                };
                                btn = btnCell.get();
                                btn.getStyle().imageUp = (isOtherCustomField ? MDL_recipeDict.rcDict.customFieldMap.get(oct).icon : new TextureRegionDrawable(oct.uiIcon)).tint(tryVal(data.ctTint, Color.white));
                            };
                        };
                        // `TABLE`: tag icon
                        if(data.icon != null) {
                            let iconCell = tb2.image(Core.atlas.find(data.icon)).left().width(26.0).height(26.0);
                            if(data.iconCts != null) {
                                MDL_table.tooltip(iconCell, ttTb => MDL_table.setCtLi(ttTb, data.iconCts, {size: 40.0}, {colAmt: 4}));
                            };
                        };
                        // `TABLE`: text icon
                        if(data.iconText != null) {
                            tb2.add(data.iconText).left().fontScale(0.75).padLeft(2.0).padRight(2.0);
                        };
                    })
                    .left()
                    .height(30.0)
                    .row();
                });
                i += 3;
                if(j % 3 === 2) tb.row();
                j++;
            };
        },


        /**
         * @param {string} title
         * @param {ContentGn} ct_gn
         * @param {boolean} fromDatabase
         * @return {void}
         */
        ex_show(title, ct_gn, fromDatabase) {
            resetDial(this, title);

            if(ct_gn == null) return;
            let ct, isCustomField = false;
            if(MDL_recipeDict.rcDict.customFieldMap.containsKey(ct_gn)) {
                isCustomField = true;
                ct = ct_gn;
            } else {
                ct = MDL_content.getCt(ct_gn, null, true);
            };
            if(ct == null) return;
            let ctIcon = isCustomField ?
                MDL_recipeDict.rcDict.customFieldMap.get(ct).icon :
                new TextureRegionDrawable(ct.uiIcon);

            // `TABLE`: content
            MDL_table.br(this.cont);
            this.cont.pane(pnTb => {
                MDL_table.margin(pnTb);
                let cont = new Table();

                // `TABLE`: icon
                cont.button(ctIcon, 48.0, () => {
                    this.hide();
                    isCustomField ?
                        this.ex_show(MDL_recipeDict.getCustomFieldBundle(ct), ct) :
                        Vars.ui.content.show(ct);
                })
                .left()
                .row();
                pnTb.add(cont).growX();

                // `TABLE`: producer
                let prodArr = MDL_recipeDict.getProducers(ct, true, true);
                if(prodArr.length > 0) {
                    // `TABLE`: producer title
                    cont.table(Tex.whiteui, tb => {
                        tb.center().setColor(Color.darkGray);
                        MDL_table.margin(tb, 0.5);
                        tb.add(MDL_bundle.getTerm("lovec", "produced-in")).pad(4.0);
                    })
                    .left()
                    .growX()
                    .row();
                    // `TABLE`: producer list
                    cont.table(Tex.whiteui, tb => {
                        tb.left().setColor(Pal.darkestGray);
                        MDL_table.margin(tb);
                        this.ex_buildList(tb, ct, prodArr, isCustomField);
                    })
                    .left()
                    .growX()
                    .row();
                };

                // `TABLE`: consumer
                let consArr = MDL_recipeDict.getConsumers(ct, true, true);
                if(consArr.length > 0) {
                    // `TABLE`: consumer title
                    cont.table(Tex.whiteui, tb => {
                        tb.center().setColor(Color.darkGray);
                        MDL_table.margin(tb, 0.5);
                        tb.add(MDL_bundle.getTerm("lovec", "used-in")).pad(4.0);
                    })
                    .left()
                    .growX()
                    .row();
                    // `TABLE`: consumer list
                    cont.table(Tex.whiteui, tb => {
                        tb.left().setColor(Pal.darkestGray);
                        MDL_table.margin(tb);
                        this.ex_buildList(tb, ct, consArr, isCustomField);
                    })
                    .left()
                    .growX()
                    .row();
                };

                // `TABLE`: building
                if(ct instanceof Item) {
                    let reqBlks = MDL_content.getReqBlks(ct);
                    if(reqBlks.length > 0) {
                        // `TABLE`: building title
                        cont.table(Tex.whiteui, tb => {
                            tb.center().setColor(Color.darkGray);
                            MDL_table.margin(tb, 0.5);
                            tb.add(MDL_bundle.getTerm("lovec", "building")).pad(4.0);
                        })
                        .left()
                        .growX()
                        .row();
                        // `TABLE`: building list
                        cont.table(Tex.whiteui, tb => {
                            tb.center().setColor(Pal.darkestGray);
                            MDL_table.setCtLi(tb, reqBlks, {size: 48.0, dialToHide: this});
                        })
                        .left()
                        .growX()
                        .row();
                    };
                };
            }).row();

            // `TABLE`: buttons
            MDL_table.br(this.cont);
            MDL_table.btnCloseCallback(this.buttons, this, () => {
                if(fromDatabase) {
                    fetchDialog("rcDictDatabase").ex_show();
                };
            });
            MDL_table.btn(this.buttons, MDL_bundle.getTerm("lovec", "new-window"), () => {
                this.hide();
                new CLS_window(isCustomField ? MDL_recipeDict.getCustomFieldBundle(ct) : ct.localizedName, tb => {
                    tb.center();
                    let tmpCt = ct;
                    let tmpIsCustomField = isCustomField;
                    tb.button(ctIcon, 48.0, () => {
                        fetchDialog("rcDict").ex_show(tmpIsCustomField ? MDL_recipeDict.getCustomFieldBundle(tmpCt) : tmpCt.localizedName, tmpCt, false);
                    }).center();
                }).add();
            });
            MDL_table.btn(this.buttons, MDL_bundle.getInfo("lovec", "dial-rcdict-database"), () => {
                this.hide();
                fetchDialog("rcDictDatabase").ex_show();
            });

            this.show();
        },


    });
    newDialog("rcDict", rcDict);
    exports.rcDict = rcDict;
