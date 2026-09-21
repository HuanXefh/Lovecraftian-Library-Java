/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * A nightmare of tables, that's all.
     * @module lovec/mdl/MDL_table
     */


/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ base ------------------------------ */


    /**
     * @param {Cell} cell
     * @param {TableParamObject|unset} [paramObj]
     * @return {Cell}
     */
    function handleParamObj(cell, paramObj) {
        if(paramObj == null) return cell;

        readParamAndCall(paramObj, "size", val => cell.size(val));
        if(paramObj.size == null && paramObj.sizeW != null && paramObj.sizeH != null) {
            cell.size(paramObj.sizeW, paramObj.sizeH);
        };
        readParamAndCall(paramObj, "w", val => cell.width(val));
        readParamAndCall(paramObj, "h", val => cell.height(val));
        readParamAndCall(paramObj, "minW", val => cell.minWidth(val));
        readParamAndCall(paramObj, "minH", val => cell.minHeight(val));
        readParamAndCall(paramObj, "maxW", val => cell.maxWidth(val));
        readParamAndCall(paramObj, "maxH", val => cell.maxHeight(val));
        readParamAndCall(paramObj, "color", val => cell.color(val));

        readParamAndCall(paramObj, "margin", val => cell.margin(val));
        readParamAndCall(paramObj, "marginLeft", val => cell.marginLeft(val));
        readParamAndCall(paramObj, "marginRight", val => cell.marginRight(val));
        readParamAndCall(paramObj, "marginTop", val => cell.marginTop(val));
        readParamAndCall(paramObj, "marginBottom", val => cell.marginBottom(val));
        readParamAndCall(paramObj, "pad", val => cell.pad(val));
        readParamAndCall(paramObj, "padLeft", val => cell.padLeft(val));
        readParamAndCall(paramObj, "padRight", val => cell.padRight(val));
        readParamAndCall(paramObj, "padTop", val => cell.padTop(val));
        readParamAndCall(paramObj, "padBottom", val => cell.padBottom(val));

        readParamAndCall(paramObj, "align", val => {
            switch(val) {
                case Align.center :
                    cell.center();
                    break;
                case Align.left :
                    cell.center().left();
                    break;
                case Align.right :
                    cell.center().right();
                    break;
                case Align.top :
                    cell.center().top();
                    break;
                case Align.bottom :
                    cell.center().bottom();
                    break;
                case Align.topLeft :
                    cell.top().left();
                    break;
                case Align.topRight :
                    cell.top().right();
                    break;
                case Align.bottomLeft :
                    cell.bottom().left();
                    break;
                case Align.bottomRight :
                    cell.bottom().right();
                    break;
            };
        });
        readParamAndCall(paramObj, "labelAlign", val => cell.labelAlign(val));
        if(paramObj.growX == null && paramObj.growY == null) {
            readParamAndCall(paramObj, "grow", val => {
                if(val) cell.grow();
            });
        };
        readParamAndCall(paramObj, "growX", val => {
            if(val) cell.growX();
        });
        readParamAndCall(paramObj, "growY", val => {
            if(val) cell.growY();
        });
        if(paramObj.fillX == null && paramObj.fillY == null) {
            readParamAndCall(paramObj, "fill", val => {
                if(val) cell.fill();
            });
        };
        readParamAndCall(paramObj, "fillX", val => {
            if(val) cell.fillX();
        });
        readParamAndCall(paramObj, "fillY", val => {
            if(val) cell.fillY();
        });
        if(paramObj.expandX == null && paramObj.expandY == null) {
            readParamAndCall(paramObj, "expand", val => {
                if(val) cell.expand();
            });
        };
        readParamAndCall(paramObj, "expandX", val => {
            if(val) cell.expandX();
        });
        readParamAndCall(paramObj, "expandY", val => {
            if(val) cell.expandY();
        });

        readParamAndCall(paramObj, "hasRow", val => {
            if(val) cell.row();
        });
        readParamAndCall(paramObj, "ttArg", val => {
            if(typeof val === "string") {
                cell.tooltip(val, true);
            } else if(typeof val === "function") {
                tooltip(cell, val);
            } else if(val instanceof Array) {
                tooltip(cell, val[1], val[0]);
            };
        });

        return cell;
    };


    /**
     * Sets margin for a table or cell.
     * @param {Table|Cell} tb0cell
     * @param {number|unset} [scl]
     * @return {Table|Cell}
     */
    const margin = function(tb0cell, scl) {
        if(scl == null) scl = 1.0;
        return tb0cell.marginLeft(12.0 * scl).marginRight(12.0 * scl).marginTop(15.0 * scl).marginBottom(15.0 * scl);
    };
    exports.margin = margin;


    /**
     * Adds empty lines for a table.
     * @param {Table} tb
     * @param {number|unset} [repeat]
     * @return {void}
     */
    const br = function(tb, repeat) {
        tryVal(repeat, 2).each(i => {
            tb.add("").row();
        });
    };
    exports.br = br;


    /**
     * Adds a horizonal bar for a table.
     * @param {Table} tb
     * @param {TableParamObject|unset} [paramObj]
     * @return {Cell}
     */
    const bar = function(tb, paramObj) {
        paramObj = processNullParam(
            paramObj,
            "color", Color.darkGray,
            "h", 4.0,
            "hasRow", true,
        );
        if(paramObj.stroke != null) {
            paramObj.h = paramObj.stroke;
        };

        let cell = tb.image().pad(0.0).fillX();
        if(readParam(paramObj, "w") == null) {
            cell.growX();
        };
        handleParamObj(cell, paramObj);

        return cell;
    };
    exports.bar = bar;


    /**
     * Adds a vertical bar for a table.
     * @param {Table} tb
     * @param {TableParamObject|unset} [paramObj]
     * @return {Cell}
     */
    const barV = function(tb, paramObj) {
        paramObj = processNullParam(
            paramObj,
            "color", Color.darkGray,
            "w", 4.0,
        );
        if(paramObj.stroke != null) {
            paramObj.w = paramObj.stroke;
        };

        let cell = tb.image().pad(0.0).fillY();
        if(readParam(paramObj, "h") == null) {
            cell.growY();
        };
        handleParamObj(cell, paramObj);

        return cell;
    };
    exports.barV = barV;


    /**
     * Adds a table with colored edge lines.
     * @param {Table} tb
     * @param {CFunction<Table>} tableM
     * @param {Color|unset} [color]
     * @param {number|unset} [stroke]
     * @return {Cell}
     */
    const edge = function(tb, tableM, color, stroke) {
        if(color == null) color = Color.white;
        if(stroke == null) stroke = 2.0;
        return tb.table(Styles.none, tb1 => {
            tb1.table(Tex.whiteui, tb2 => {tb2.setColor(color)}).width(stroke).height(stroke);
            tb1.table(Tex.whiteui, tb2 => {tb2.setColor(color)}).height(stroke).growX();
            tb1.table(Tex.whiteui, tb2 => {tb2.setColor(color)}).width(stroke).height(stroke);
            tb1.row();
            tb1.table(Tex.whiteui, tb2 => {tb2.setColor(color)}).width(stroke).growY();
            tableM(tb1);
            tb1.table(Tex.whiteui, tb2 => {tb2.setColor(color)}).width(stroke).growY();
            tb1.row();
            tb1.table(Tex.whiteui, tb2 => {tb2.setColor(color)}).width(stroke).height(stroke);
            tb1.table(Tex.whiteui, tb2 => {tb2.setColor(color)}).height(stroke).growX();
            tb1.table(Tex.whiteui, tb2 => {tb2.setColor(color)}).width(stroke).height(stroke);
        });
    };
    exports.edge = edge;


    /**
     * Adds a tooltip into a cell.
     * @param {Cell} cell
     * @param {CFunction<Table>} tableM
     * @param {string|unset} [pinName] - If true, this tooltip can be pinned as a new window.
     * @return {Cell}
     */
    const tooltip = function(cell, tableM, pinName) {
        let tooltip = pinName == null ?
            new Tooltip(cons(tableM)) :
            extend(Tooltip, cons(tableM), {
                exit(inputEv, x, y, pointer, toActor) {
                    if(Core.input.shift() && fetchSetting("misc-enable-window")) {
                        new CLS_window(pinName, tableM).add();
                    };
                    this.super$exit(inputEv, x, y, pointer, toActor);
                },
            });
        tooltip.allowMobile = true;
        Reflect.get(Cell, cell, "element").addListener(tooltip);
        return cell;
    };
    exports.tooltip = tooltip;


    /**
     * Adds a wrapped text line for a table.
     * @param {Table} tb
     * @param {string} str
     * @param {TableParamObject|unset} [paramObj]
     * @return {Cell}
     */
    const wrapLine = function(tb, str, paramObj) {
        paramObj = processNullParam(
            paramObj,
            "align", Align.center,
            "labelAlign", Align.left,
            "hasRow", true,
        );

        let cell = tb.add(str).wrap();
        if(readParam(paramObj, "w") == null) {
            cell.width(MDL_ui.getUiW(null, null, readParam(paramObj, "padOrd", 0) * VAR.length.ordW));
        };
        handleParamObj(cell, paramObj);

        return cell;
    };
    exports.wrapLine = wrapLine;


    /**
     * Used when a dialog has no contents.
     * @param {Table} tb
     * @param {TableParamObject|unset} [paramObj]
     * @return {Cell}
     */
    const textNothing = function(tb, paramObj) {
        paramObj = processNullParam(
            paramObj,
            "color", Color.lightGray,
            "align", Align.center,
            "hasRow", true,
        );

        let cell = tb.add(MDL_bundle.getInfo("lovec", "nothing"));
        handleParamObj(cell, paramObj);

        return cell;
    };
    exports.textNothing = textNothing;


    /**
     * Adds basic button for a table.
     * @param {Table} tb
     * @param {string} text
     * @param {C0Function} scr
     * @param {TableParamObject|unset} [paramObj]
     * @return {Cell}
     */
    const btn = function(tb, text, scr, paramObj) {
        paramObj = processNullParam(
            paramObj,
            "sizeW", 200.0,
            "sizeH", 50.0,
            "pad", 12.0,
            "align", Align.center,
        );

        let cell = tb.button(text, scr);
        handleParamObj(cell, paramObj);

        return cell;
    };
    exports.btn = btn;


    /**
     * Adds an icon button for a table.
     * @param {Table} tb
     * @param {string|TextureRegionDrawable} icon
     * @param {C0Function} scr
     * @param {TableParamObject|unset} [paramObj]
     * @return {Cell}
     */
    const btnSmall = function(tb, icon, scr, paramObj) {
        paramObj = processNullParam(
            paramObj,
            "sizeW", 42.0,
            "sizeH", 42.0,
            "pad", 12.0,
            "align", Align.center,
        );

        let cell = tb.button(icon, scr);
        handleParamObj(cell, paramObj);

        return cell;
    };
    exports.btnSmall = btnSmall;


    /**
     * Adds a close button for a table.
     * @param {Table} tb
     * @param {Dialog} dial - Dialog to close.
     * @param {TableParamObject|unset} [paramObj]
     * @return {Cell}
     */
    const btnClose = function(tb, dial, paramObj) {
        dial.addCloseListener();
        return btn(tb, "@close", () => dial.hide(), paramObj);
    };
    exports.btnClose = btnClose;


    /**
     * Variant of {@link btnClose} with a callback.
     * @param {Table} tb
     * @param {Dialog} dial - Dialog to close.
     * @param {C0Function} callback
     * @param {TableParamObject|unset} [paramObj]
     * @return {Cell}
     */
    const btnCloseCallback = function(tb, dial, callback, paramObj) {
        dial.closeOnBack(callback);
        return btn(tb, "@close", () => {dial.hide(); callback()}, paramObj);
    };
    exports.btnCloseCallback = btnCloseCallback;


    /**
     * Adds a link button for a table.
     * @param {Table} tb
     * @param {string} text
     * @param {string} url
     * @param {TableParamObject|unset} [paramObj]
     * @return {Cell}
     */
    const btnLink = function(tb, text, url, paramObj) {
        return btn(tb, text, () => Core.app.openURI(url), paramObj);
    };
    exports.btnLink = btnLink;


    /**
     * Adds a button that is only clickable when some condition is met.
     * @param {Table} tb
     * @param {string} text
     * @param {string} textInvalid
     * @param {F0Function<boolean>} boolF - If true, the button is clickable.
     * @param {C0Function} scr
     * @param {TableParamObject|unset} [paramObj]
     * @return {Cell}
     */
    const btnCond = function(tb, text, textInvalid, boolF, scr, paramObj) {
        let cond;
        return btn(tb, textInvalid, scr, paramObj).update(btn => {
            cond = boolF();
            btn.setText(cond ? text : textInvalid);
            btn.setDisabled(!cond);
        });
    };
    exports.btnCond = btnCond;


    /**
     * Adds a small config button for a table.
     * @param {Table} tb
     * @param {Building} b
     * @param {CFunction<Building>} scr
     * @param {string|TextureRegionDrawable} icon
     * @param {TableParamObject|unset} [paramObj]
     * @return {Cell}
     */
    const btnCfg = function(tb, b, scr, icon, paramObj) {
        paramObj = processNullParam(
            paramObj,
            "size", 24.0,
            "align", Align.center,
        );

        let cell = tb.button(icon, readParam(paramObj, "size", 24.0), () => scr(b));
        delete paramObj.size;
        handleParamObj(cell, paramObj);

        return cell;
    };
    exports.btnCfg = btnCfg;


    /**
     * Variant of {@link btnCfg} used to toggle a boolean config.
     * @param {Table} tb
     * @param {Building} b
     * @param {string|TextureRegionDrawable} iconTrue
     * @param {string|TextureRegionDrawable} iconFalse
     * @param {boolean} bool
     * @param {TableParamObject|unset} [paramObj]
     * @return {Cell}
     */
    const btnCfgToggle = function(tb, b, iconTrue, iconFalse, bool, paramObj) {
        paramObj = processNullParam(
            paramObj,
            "size", 24.0,
            "align", Align.center,
        );

        let cell = tb.button(bool ? iconTrue : iconFalse, readParam(paramObj, "size", 24.0), () => {
            b.configure(!bool);
            b.deselect();
        });
        delete paramObj.size;
        handleParamObj(cell, paramObj);

        return cell;
    };
    exports.btnCfgToggle = btnCfgToggle;


    /**
     * Variant of {@link btnCfgToggle} that uses color to indicate status.
     * @param {Table} tb
     * @param {Building} b
     * @param {string|TextureRegionDrawable} icon
     * @param {boolean} bool
     * @param {Color|unset} [colorTrue]
     * @param {Color|unset} [colorFalse]
     * @param {TableParamObject|unset} [paramObj]
     * @return {Cell}
     */
    const btnCfgToggleColor = function(tb, b, icon, bool, colorTrue, colorFalse, paramObj) {
        if(colorTrue == null) colorTrue = Pal.heal;
        if(colorFalse == null) colorFalse = Color.darkGray;
        paramObj = processNullParam(
            paramObj,
            "size", 24.0,
            "align", Align.center,
        );

        let cell = tb.button(icon.tint(bool ? colorTrue : colorFalse), readParam(paramObj, "size", 24.0), () => {
            b.configure(!bool);
            b.deselect();
        });
        delete paramObj.size;
        handleParamObj(cell, paramObj);

        return cell;
    };
    exports.btnCfgToggleColor = btnCfgToggleColor;


    /**
     * Adds a slider for a table.
     * @param {Table} tb
     * @param {CFunction<number>} valC
     * @param {number|unset} [min]
     * @param {number|unset} [max]
     * @param {number|unset} [step]
     * @param {number|unset} [def]
     * @param {TableParamObject|unset} [paramObj]
     * @return {Cell}
     */
    const slider = function(tb, valC, min, max, step, def, paramObj) {
        paramObj = processNullParam(
            paramObj,
            "align", Align.left,
            "hasRow", true,
        );

        let cell = tb.slider(
            tryVal(min, 0),
            tryVal(max, 2),
            tryVal(step, 1),
            tryVal(def, tryVal(min, 0)),
            valC,
        );
        handleParamObj(cell, paramObj);
        if(readParam(paramObj, "w") != null) {
            let w = readParam(paramObj, "w");
            cell.width(w);
            cell.get().width = w;
        };

        return cell;
    };
    exports.slider = slider;


    /**
     * Adds a config slider for a table.
     * @param {Table} tb
     * @param {Building} b
     * @param {FFunction<Building, string>} strF - Gets string to display for current value.
     * @param {number|unset} [min]
     * @param {number|unset} [max]
     * @param {number|unset} [step]
     * @param {number|unset} [def]
     * @param {TableParamObject|unset} [sliderParamObj]
     * @param {TableParamObject|unset} [boxParamObj]
     * @return {Cell}
     */
    const sliderCfg = function(tb, b, strF, min, max, step, def, sliderParamObj, boxParamObj) {
        sliderParamObj = processNullParam(
            sliderParamObj,
            "w", 260.0,
        );
        boxParamObj = processNullParam(
            boxParamObj,
            "align", Align.left,
            "growX", true,
        );

        let cell = tb.table(Styles.none, tb1 => {
            tb1.left();
            tb1.add("").left().get().setText(prov(() => strF()));
            tb1.row();
            slider(tb1, val => b.configure(val.toF()), min, max, step, def, sliderParamObj);
        });
        handleParamObj(cell, boxParamObj);

        return cell;
    };
    exports.sliderCfg = sliderCfg;


    /**
     * Adds a fixed scroll pane for a table.
     * @param {Table} tb
     * @param {CFunction<Table>} tableM
     * @param {TableParamObject|unset} [paramObj]
     * @return {Cell}
     */
    const pnFixed = function(tb, tableM, paramObj) {
        let cell = tb.pane(pnTb => {
            tableM(pnTb);
        });
        let pn = cell.get();
        pn.setScrollingDisabled(false, false);
        pn.setOverscroll(false, false);
        handleParamObj(cell, paramObj);

        return cell;
    };
    exports.pnFixed = pnFixed;


    /* <------------------------------ UI pieces ------------------------------ */


    /**
     * Adds block efficiency display for a table.
     * Like what's done in most `Stat.tiles`, however, involved attribute is displayed in the tooltip.
     * @param {Table} tb
     * @param {Block} blk
     * @param {number} mtp
     * @param {string} nameAttr
     * @param {TableParamObject|unset} [paramObj]
     * @return {Cell}
     */
    const blkEffc = function(tb, blk, mtp, nameAttr, paramObj) {
        paramObj = processNullParam(
            paramObj,
            "size", 64.0,
            "padRight", 8.0,
            "padTop", 4.0,
            "padBottom", 4.0,
            "align", Align.left,
        );
        let str = Math.abs(mtp) < 0.0001 ?
            "" :
            ((mtp < 0.0 ? "-" : "") + Strings.autoFixed(mtp * 100.0, 2) + "%");

        let cell = tb.table(Styles.none, tb1 => {
            tb.left();
            tb1.table(Styles.none, tb2 => {
                tb2.left();
                // `TABLE`: block icon
                let btn = tb2.button(new TextureRegionDrawable(blk.uiIcon), readParam(paramObj, "size", 64.0), () => {
                    readParam(paramObj, "ctDial", Vars.ui.content).show(blk);
                    let dialToHide = readParam(paramObj, "dialToHide");
                    if(dialToHide != null) {
                        dialToHide.hide();
                    };
                })
                .tooltip(blk.localizedName + ((nameAttr == null) ? "" : ("\n\n[green]" + MDL_attr.getAttrBundle(nameAttr) + "[]")))
                .padRight(-18.0)
                .get();
                btn.margin(0.0);
                let btnStyle = btn.getStyle();
                btnStyle.up = Styles.none;
                btnStyle.down = Styles.none;
                btnStyle.over = Styles.flatOver;
                // `TABLE`: efficiency label
                tb2.table(Styles.none, tb3 => {
                    tb3.left();
                    br(tb3);
                    tb3.add(str).fontScale(0.85).left().style(Styles.outlineLabel).color(mtp < 0.0 ? Pal.remove : Pal.accent);
                });
            }).padRight(4.0);
        });
        delete paramObj.size;
        handleParamObj(cell, paramObj);

        return cell;
    };
    exports.blkEffc = blkEffc;


    /**
     * Adds a clickable icon display for a table.
     * @param {Table} tb
     * @param {Drawable} icon
     * @param {C0Function} scr
     * @param {TableParamObject|unset} [paramObj]
     * @return {Cell}
     */
    const clickIcon = function(tb, icon, scr, paramObj) {
        paramObj = processNullParam(
            paramObj,
            "size", 32.0,
            "pad", 4.0,
        );

        let cell = tb.button(icon, readParam(paramObj, "size"), scr);
        let btn = cell.get();
        btn.margin(0.0);
        let btnStyle = btn.getStyle();
        btnStyle.up = Styles.none;
        btnStyle.down = Styles.none;
        btnStyle.over = Styles.flatOver;
        delete paramObj.size;
        handleParamObj(cell, paramObj);

        return cell;
    };
    exports.clickIcon = clickIcon;


    /**
     * Adds a content display for a table.
     * @param {Table} tb
     * @param {UnlockableContent} ct
     * @param {TableParamObject|unset} [paramObj]
     */
    const ctIcon = function(tb, ct, paramObj) {
        paramObj = processNullParam(
            paramObj,
            "ttArg", ct.localizedName,
        );

        return clickIcon(
            tb,
            new TextureRegionDrawable(ct.uiIcon),
            () => {
                readParam(paramObj, "ctDial", Vars.ui.content).show(ct);
                let dialToHide = readParam(paramObj, "dialToHide");
                if(dialToHide != null) {
                    dialToHide.hide();
                };
            },
            paramObj,
        );
    };
    exports.ctIcon = ctIcon;


    /**
     * Adds a generic content requirement display for a table.
     * @param {Table} tb
     * @param {UnlockableContent} ct
     * @param {number} amt
     * @param {FFunction<UnlockableContent, number>} amtF
     * @return {Cell}
     */
    const reqCt = function(tb, ct, amt, amtF) {
        let reqImg = new ReqImage(
            StatValues.stack(ct, amt),
            () => (amtF(ct) >= amt),
        );
        return tb.add(reqImg).size(32.0);
    };
    exports.reqCt = reqCt;


    /**
     * Adds a resource requirement display for a table.
     * @param {Table} tb
     * @param {Building} b
     * @param {Resource} rs
     * @param {number|unset} [amt]
     * @return {Cell}
     */
    const reqRs = function(tb, b, rs, amt) {
        let reqImg = new ReqImage(
            amt == null ? rs.uiIcon : StatValues.stack(rs, amt),
            amt == null ?
                (
                    rs instanceof Item ?
                        () => b.items != null && b.items.get(rs) > 0 :
                        () => b.liquids != null && b.liquids.get(rs) > 0.0
                ) :
                (
                    rs instanceof Item ?
                        () => b.items != null && b.items.get(rs) >= amt :
                        () => b.liquids != null && b.liquids.get(rs) >= amt
                ),
        );
        return tb.add(reqImg).size(32.0);
    };
    exports.reqRs = reqRs;


    /**
     * Adds a multiple content requirement display for a table.
     * @param {Table} tb
     * @param {Building} b
     * @param {Array<UnlockableContent>} cts
     * @param {Array<number>|unset} [amts]
     * @param {FFunction<UnlockableContent, number>|unset} [amtF]
     * @return {Cell}
     */
    const reqMultiCt = function(tb, b, cts, amts, amtF) {
        let multiReqImg = new MultiReqImage();
        let i = 0;
        if(amts != null) {
            // Copy this array to fix values
            amts = amts.cpy();
        };
        cts.forEachFast(ct => {
            if(!ct.unlockedNow()) return;
            multiReqImg.add(new ReqImage(
                amts == null || amts[i] == null ?
                    ct.uiIcon :
                    StatValues.stack(ct, amts[i]),
                (function(i) {
                    if(ct instanceof Item) {
                        return amts == null || amts[i] == null ?
                            () => b.items != null && b.items.has(ct) :
                            () => b.items != null && b.items.get(ct) >= amts[i];
                    } else if(ct instanceof Liquid) {
                        return amts == null || amts[i] == null ?
                            () => b.liquids != null && b.liquids.get(ct) > 0.0 :
                            () => b.liquids != null && b.liquids.get(ct) >= amts[i];
                    };
                    if(amtF == null) throw new Error("Hey WTF did you do to the recipe data?");
                    return amts == null || amts[i] == null ?
                        () => amtF(ct) > 0.0 :
                        () => amtF(ct) > amts[i];
                })(i),
            ));
            i++;
        });
        return tb.add(multiReqImg).size(32.0);
    };
    exports.reqMultiCt = reqMultiCt;


    /**
     * Adds a recipe content display for a table.
     * @param {Table} tb
     * @param {UnlockableContent} ct
     * @param {number|unset} [amt] - Leave empty to hide amount text.
     * @param {number|unset} [p]
     * @param {boolean|unset} [cancelLiq] - Set this to true for batch fluid I/O.
     * @param {TableParamObject|unset} [paramObj]
     * @return {Cell|null}
     */
    const rcCtIcon = function(tb, ct, amt, p, cancelLiq, paramObj) {
        if(ct == null) return null;
        if(amt == null) amt = -1;
        if(p == null) p = 1.0;
        paramObj = processNullParam(
            paramObj,
            "size", 32.0,
            "marginRight", 8.0,
            "padTop", 4.0,
            "padBottom", 4.0,
            "align", Align.left,
        );
        let str = amt < 0.0001 ?
            "" :
            ct.getContentType() === ContentType.liquid && !cancelLiq ?
                (Strings.autoFixed(amt * 60.0, 2) + "/s") :
                Strings.autoFixed(amt, 0) + "      ";

        let cell = tb.table(Styles.none, tb1 => {
            tb1.left();
            tb1.table(Styles.none, tb2 => {
                tb2.left();
                // `TABLE`: content icon
                let btn = tb2.button(new TextureRegionDrawable(ct.uiIcon), readParam(paramObj, "size"), () => {
                    readParam(paramObj, "ctDial", Vars.ui.content).show(ct);
                    let dialToHide = readParam(paramObj, "dialToHide");
                    if(dialToHide != null) {
                        dialToHide.hide();
                    };
                })
                .tooltip(ct.localizedName)
                .padRight(-4.0)
                .get();
                btn.margin(0.0);
                let btnStyle = btn.getStyle();
                btnStyle.up = Styles.none;
                btnStyle.down = Styles.none;
                btnStyle.over = Styles.flatOver;
                // `TABLE`: content label
                tb2.table(Styles.none, tb3 => {
                    tb3.left();
                    // Probability (top right)
                    tb3.add(
                        Math.abs(p - 1.0) < 0.0001 ?
                            "  " :
                            (Strings.autoFixed(p * 100.0, 2) + "%")
                    )
                    .left()
                    .fontScale(0.85)
                    .style(Styles.outlineLabel)
                    .color(Color.gray)
                    .row();
                    // Amount (bottom right)
                    tb3.add(str).left().fontScale(0.85).style(Styles.outlineLabel);
                });
            }).marginRight(4.0);
        });
        delete paramObj.size;
        handleParamObj(cell, paramObj);

        return cell;
    };
    exports.rcCtIcon = rcCtIcon;


    /* <------------------------------ text ------------------------------ */


    /**
     * Sets a gray area to hold wrapped text.
     * @param {Table} tb
     * @param {string} text
     * @param {TableParamObject|unset} [lineParamObj]
     * @param {TableParamObject|unset} [boxParamObj]
     * @return {Cell}
     */
    const setNote = function(tb, text, lineParamObj, boxParamObj) {
        lineParamObj = processNullParam(
            lineParamObj,
            "padOrd", 1,
        );
        boxParamObj = processNullParam(
            boxParamObj,
            "padTop", 8.0,
            "padBottom", 8.0,
            "hasRow", true,
        );

        let cell = tb.table(Tex.whiteui, tb1 => {
            tb1.center().setColor(Pal.darkestGray);
            margin(tb1, 1.5);
            wrapLine(tb1, text.color(Color.gray), lineParamObj);
        });
        handleParamObj(cell, boxParamObj);

        return cell;
    };
    exports.setNote = setNote;


    /* <------------------------------ list ------------------------------ */


    /**
     * Sets an outlined table.
     * @param {Table} tb
     * @param {Array<Array>} matArr
     * @param {TableParamObject|unset} [innerParamObj]
     * @param {TableParamObject|unset} [boxParamObj]
     * @return {Cell}
     */
    const setTable = function(tb, matArr, innerParamObj, boxParamObj) {
        innerParamObj = processNullParam(
            innerParamObj,
            "size", 32.0,
            "ctDial", VAR.dialog.ct1,
        );
        boxParamObj = processNullParam(
            boxParamObj,
            "colorLine", Color.darkGray,
            "colorTitle", Color.darkGray,
            "colorBase", Pal.darkestGray,
            "stroke", 2.0,
        );

        let rowAmt = matArr.iCap();
        let colAmt = matArr[0].iCap();

        let contCell = tb.table(Styles.none, tb1 => {});
        handleParamObj(contCell, boxParamObj);
        if(rowAmt === 0 || colAmt === 0) return contCell;
        let cont = contCell.get();

        let
            stroke = readParam(boxParamObj, "stroke"),
            tbCol,
            tbRow,
            inner,
            innerTmpParamObj = {};
        for(let i = 0; i < colAmt; i++) {
            tbCol = cont.table(Styles.none, tb1 => {}).grow().get();
            for(let j = 0; j < rowAmt; j++) {
                tbRow = tbCol.table(Tex.whiteui, tb1 => {
                    tb1.left().setColor(readParam(boxParamObj, "colorLine"));
                }).left().grow().get();
                tbCol.row();

                tbRow.table(Styles.none, tb => {}).width(stroke).height(stroke);
                tbRow.table(Styles.none, tb => {}).width(stroke).height(stroke);
                tbRow.table(Styles.none, tb => {}).width(stroke).height(stroke);
                tbRow.row();

                tbRow.table(Styles.none, tb => {}).width(stroke).height(stroke);
                tbRow.table(Tex.whiteui, tbInner => {
                    tbInner.left().setColor(j === 0 ? readParam(boxParamObj, "colorTitle") : readParam(boxParamObj, "colorBase"));
                    margin(tbInner, 0.25);
                    inner = matArr[j][i];
                    innerTmpParamObj.setProp(innerParamObj);
                    if(inner instanceof TextureRegion) {
                        tbInner.image(inner).width(readParam(innerParamObj, "size")).height(readParam(innerParamObj, "size"));
                    } else if(inner instanceof UnlockableContent) {
                        ctIcon(tbInner, inner, innerTmpParamObj);
                    } else if(typeof inner === "function") {
                        inner(tbInner);
                    } else if(typeof inner === "string") {
                        tbInner.add(inner).padLeft(8.0).padRight(8.0);
                    } else if(typeof inner === "number") {
                        tbInner.add(Strings.autoFixed(inner, 2)).padLeft(8.0).padRight(8.0);
                    } else {
                        tbInner.add(TmpStateTag.error.toString());
                    };
                })
                .growX()
                .height(j === 0 ? 24.0 : (readParam(innerParamObj, "size") + 8.0));
                tbRow.table(Styles.none, tb => {}).width(stroke).height(stroke);
                tbRow.row();

                tbRow.table(Styles.none, tb => {}).width(stroke).height(stroke);
                tbRow.table(Styles.none, tb => {}).width(stroke).height(stroke);
                tbRow.table(Styles.none, tb => {}).width(stroke).height(stroke);
                tbRow.row();
            };
        };

        return contCell;
    };
    exports.setTable = setTable;


    /**
     * Sets a list that shows icons in rows.
     * @param {Table} tb
     * @param {Plural<Drawable>} icons_p
     * @param {Plural<string>} names_p
     * @param {Plural<C0Function>} scrs_p
     * @param {boolean|unset} [showOrd]
     * @return {Cell}
     */
    const setIconRow = function thisFun(tb, icons_p, names_p, scrs_p, showOrd) {
        let icons = icons_p instanceof Array ? icons_p : [icons_p];
        let names = names_p instanceof Array ? names_p : [names_p];
        let scrs = scrs_p instanceof Array ? scrs_p : [scrs_p];
        showOrd = showOrd && icons.length > 0;

        let ordCur = 0;
        let contCell = tb.table(Styles.none, tb1 => {});
        let cont = contCell.get();
        contCell.row();

        br(cont, 1);
        icons.forEachFast(icon => {
            cont.table(Tex.whiteui, tb1 => {
                tb1.left().setColor(Pal.darkestGray);
                margin(tb1);
                thisFun.buildOrder(tb1, showOrd, ordCur);
                thisFun.buildRowContent(tb1, icon, names[ordCur], scrs[ordCur]);
            })
            .growX()
            .row();
            br(cont, 1);
            ordCur++;
        }, true);

        return contCell;
    }
    .setProp({
        /**
         * @memberof setIconRow
         * @param {Table} tb
         * @param {boolean} showOrd
         * @param {number} ordCur
         * @return {void}
         */
        buildOrder: function(tb, showOrd, ordCur) {
            if(!showOrd) return;
            tb.table(Styles.none, tb1 => {
                tb1.left();
                tb1.table(Styles.none, tb2 => {
                    tb2.center();
                    tb2.add("[" + Strings.fixed(ordCur + 1, 0) + "]").color(Pal.accent);
                }).width(48.0);
            }).marginRight(18.0).growY();
        },
        /**
         * @memberof setIconRow
         * @param {Table} tb
         * @param {Drawable} icon
         * @param {string} name
         * @param {C0Function} scr
         * @return {void}
         */
        buildRowContent: function(tb, icon, name, scr) {
            // `TABLE`: icon
            tb.table(Styles.none, tb1 => {
                tb1.left();
                tb1.image(icon).size(Vars.iconLarge).padRight(18.0);
                barV(tb1, {padRight: 18.0});
                if(name != null) {
                    tb1.add(name);
                };
            });
            // `TABLE`: spacing
            tb.table(Styles.none, tb1 => {}).width(80.0).growX().growY();
            // `TABLE`: "?" button
            if(scr != null) {
                tb.table(Styles.none, tb1 => {
                    tb1.left();
                    tb1.button("?", () => scr()).size(VAR.length.charBtnW);
                });
            };
        },
    });
    exports.setIconRow = setIconRow;


    /**
     * Variant of {@link setIconRow} that shows content icons.
     * @param {Table} tb
     * @param {Plural<ContentGn>} cts_gn_p
     * @param {boolean|unset} [showOrd]
     * @return {Cell}
     */
    const setCtRow = function thisFun(tb, cts_gn_p, showOrd) {
        let cts = (cts_gn_p instanceof Array ? cts_gn_p : [cts_gn_p])
        .map(ct_gn => MDL_content.getCt(ct_gn, null, true))
        .compact();

        return setIconRow(
            tb,
            cts.map(ct => new TextureRegionDrawable(ct.uiIcon)),
            cts.map(ct => ct.localizedName),
            cts.map(ct => () => Vars.ui.content.show(ct)),
            showOrd,
        );
    };
    exports.setCtRow = setCtRow;


    /**
     * Sets a list that shows clickable icons just like in the database.
     * @param {Table} tb
     * @param {Plural<Drawable>} icons_p
     * @param {Plural<TooltipArgument>} ttArgs_p
     * @param {Plural<C0Function>} scrs_p
     * @param {TableParamObject|unset} [iconParamObj]
     * @param {TableParamObject|unset} [boxParamObj]
     * @return {Cell}
     */
    const setIconLi = function(tb, icons_p, ttArgs_p, scrs_p, iconParamObj, boxParamObj) {
        iconParamObj = processNullParam(
            iconParamObj,
            "size", 32.0,
        );
        boxParamObj = processNullParam(
            boxParamObj,
            "hasRow", true,
            "colAmt", MDL_ui.getColAmt(readParam(iconParamObj, "size"), 0.0, 2),
            "breakBools", Array.air,
        );
        let icons = icons_p instanceof Array ? icons_p : [icons_p];
        let ttArgs = ttArgs_p instanceof Array ? ttArgs_p : [ttArgs_p];
        let scrs = scrs_p instanceof Array ? scrs_p : [scrs_p];

        let
            colAmt = readParam(boxParamObj, "colAmt"),
            breakBools = readParam(boxParamObj, "breakBools");

        let contCell = tb.table(Tex.whiteui, tb1 => {
            tb1.left().setColor(Pal.darkestGray);
            margin(tb1, 0.5);

            let
                i = 0,
                iCap = icons.iCap(),
                j = 0,
                iconTmpParamObj = {};

            while(i < iCap) {
                iconTmpParamObj.setProp(iconParamObj);
                iconTmpParamObj.ttArg = ttArgs[i];
                clickIcon(
                    tb1,
                    icons[i],
                    tryVal(scrs[i], Function.air),
                    iconTmpParamObj,
                );

                if(i > 0 && breakBools[i + 1]) {
                    tb1.row();
                    br(tb1, 1);
                    j = -1;
                } else if(j % colAmt === colAmt - 1) {
                    tb1.row();
                    j = -1;
                };
                j++;
                i++;
            };
        }).left();
        handleParamObj(contCell, boxParamObj);

        return contCell;
    };
    exports.setIconLi = setIconLi;


    /**
     * Sets a list that shows content just like in the database.
     * @param {Table} tb
     * @param {Plural<ContentGn>} cts_gn_p
     * @param {TableParamObject|unset} [iconParamObj]
     * @param {TableParamObject|unset} [boxParamObj]
     * @return {Cell}
     */
    const setCtLi = function(tb, cts_gn_p, iconParamObj, boxParamObj) {
        let cts = (cts_gn_p instanceof Array ? cts_gn_p : [cts_gn_p])
        .map(ct_gn => MDL_content.getCt(ct_gn, null, true))
        .compact();

        return setIconLi(
            tb,
            cts.map(ct => new TextureRegionDrawable(ct.uiIcon)),
            cts.map(ct => ct.localizedName),
            cts.map(ct => () => {
                readParam(iconParamObj, "ctDial", Vars.ui.content).show(ct);
                let dialToHide = readParam(boxParamObj, "dialToHide");
                if(dialToHide != null) {
                    dialToHide.hide();
                };
            }),
            iconParamObj,
            boxParamObj,
        );
    };
    exports.setCtLi = setCtLi;


    /* <------------------------------ selector ------------------------------ */


    /**
     * Sets a selector for single content selection.
     * @param {Table} tb
     * @param {Block} blk
     * @param {Array<UnlockableContent>} cts
     * @param {F0Function<UnlockableContent|null>} ctF
     * @param {CFunction<UnlockableContent|null>} cfgC
     * @param {TableParamObject|unset} [iconParamObj]
     * @param {TableParamObject|unset} [boxParamObj]
     * @return {Cell}
     */
    const setCtSelect = function(tb, blk, cts, ctF, cfgC, iconParamObj, boxParamObj) {
        boxParamObj = processNullParam(
            boxParamObj,
            "rowAmt", 4,
            "colAmt", 4,
            "closeSelect", false,
        );

        let
            search = null,
            searchText,
            searchArr,
            btnGrp = (function(btnGrp) {btnGrp.setMinCheckCount(0); btnGrp.setMaxCheckCount(1); return btnGrp})(new ButtonGroup()),
            countRow = 0,
            i,
            iCap,
            j,
            rowAmt = readParam(boxParamObj, "rowAmt"),
            colAmt = readParam(boxParamObj, "colAmt"),
            closeSelect = readParam(boxParamObj, "closeSelect"),
            iconTmpParamObj = {};

        let cont = new Table().top();
        cont.defaults().size(40.0);
        let rebuildCont = () => {
            btnGrp.clear();
            cont.clearChildren();

            searchText = search == null ? "" : search.getText().replace(/=/g, "");
            searchArr = LCNativeArray.filter(cts, ct => String.isEmpty(searchText) || MDL_text.checkSearchValid(ct, searchText));
            countRow = 0;
            i = 0;
            iCap = searchArr.iCap();
            j = 0;
            while(i < iCap) {
                j += (function(i) {
                    let ct = searchArr[i];
                    if(!MDL_cond.isRsAvailable(ct)) return 0;

                    let ctCur;
                    let btnCell = cont.button(Tex.whiteui, Styles.clearNoneTogglei, Mathf.clamp(ct.selectionSize, 0.0, 40.0), () => {if(closeSelect) Vars.control.input.config.hideConfig()}).tooltip(ct.localizedName, true).group(btnGrp);
                    let btn = btnCell.get();
                    btn.changed(() => cfgC(btn.isChecked() ? ct : null));
                    btn.getStyle().imageUp = new TextureRegionDrawable(ct.uiIcon);
                    btn.update(() => {
                        ctCur = ctF();
                        btn.setChecked(ctCur != null && ctCur.name == ct.name);
                    });
                    iconTmpParamObj.setProp(iconParamObj);
                    handleParamObj(btnCell, iconTmpParamObj);

                    return 1;
                })(i);
                if((j - 1) % colAmt === colAmt - 1) {
                    cont.row();
                    j = 0;
                    countRow++;
                };
                i++;
            };
        };
        rebuildCont();

        let root = new Table().background(Styles.black6);
        if(countRow > rowAmt * 1.5) {
            root.table(Styles.none, tb1 => {
                tb1.image(Icon.zoom).padLeft(4.0);
                search = tb1.field(null, text => {if(text.endsWith("=")) rebuildCont()}).padBottom(4.0).left().growX().get();
                search.setMessageText("@info.lovec-info-search.name");
            }).growX().row();
        };

        let pn = (function(pn) {
            pn.setScrollingDisabled(true, false);
            pn.exited(() => {if(pn.hasScroll()) Core.scene.setScrollFocus(null)});
            if(blk != null) {
                pn.setScrollYForce(blk.selectScroll);
                pn.update(() => blk.selectScroll = pn.getScrollY());
            };
            pn.setOverscroll(false, false);
            return pn;
        })(new ScrollPane(cont, Styles.smallPane));

        root.add(pn).maxHeight(rowAmt * 40.0).growX();
        let cell = tb.top().add(root).width(colAmt * 40.0 + 28.0);
        handleParamObj(cell, boxParamObj);

        return cell;
    };
    exports.setCtSelect = setCtSelect;


    /**
     * Sets a selector for multiple content selection.
     * @param {Table} tb
     * @param {Block} blk
     * @param {Array<UnlockableContent>} cts
     * @param {F0Function<Array<UnlockableContent>>} ctsF
     * @param {CFunction<Array>} cfgC
     * @param {TableParamObject|unset} [iconParamObj]
     * @param {TableParamObject|unset} [boxParamObj]
     * @return {Cell}
     */
    const setCtSelectMulti = function(tb, blk, cts, ctsF, cfgC, iconParamObj, boxParamObj) {
        boxParamObj = processNullParam(
            boxParamObj,
            "rowAmt", 4,
            "colAmt", 4,
            "closeSelect", false,
            "maxSelected", Number.intMax,
        );

        let
            search = null,
            searchText,
            searchArr,
            maxSelected = readParam(boxParamObj, "maxSelected"),
            btnGrp = (function(btnGrp) {btnGrp.setMinCheckCount(0); btnGrp.setMaxCheckCount(maxSelected); return btnGrp})(new ButtonGroup()),
            countRow = 0,
            i,
            iCap,
            j,
            rowAmt = readParam(boxParamObj, "rowAmt"),
            colAmt = readParam(boxParamObj, "colAmt"),
            closeSelect = readParam(boxParamObj, "closeSelect"),
            iconTmpParamObj = {};

        let cont = new Table().top();
        cont.defaults().size(40.0);
        let rebuildCont = () => {
            btnGrp.clear();
            cont.clearChildren();

            searchText = search == null ? "" : search.getText().replace(/=/g, "");
            searchArr = LCNativeArray.filter(cts, ct => String.isEmpty(searchText) || MDL_text.checkSearchValid(ct, searchText));
            countRow = 0;
            i = 0;
            iCap = searchArr.iCap();
            j = 0;
            while(i < iCap) {
                j += (function(i) {
                    let ct = searchArr[i];
                    if(!MDL_cond.isRsAvailable(ct)) return 0;

                    let btnCell = cont.button(Tex.whiteui, Styles.clearNoneTogglei, Mathf.clamp(ct.selectionSize, 0.0, 40.0), () => {if(closeSelect) Vars.control.input.config.hideConfig()}).tooltip(ct.localizedName, true).group(btnGrp);
                    let btn = btnCell.get();
                    btn.changed(() => cfgC((btn.isChecked() ? ["selector", ct, true] : ["selector", ct, false]).toJavaArr(JAVA.object)));
                    btn.getStyle().imageUp = new TextureRegionDrawable(ct.uiIcon);
                    btn.update(() => btn.setChecked(ctsF().includes(ct)));
                    iconTmpParamObj.setProp(iconParamObj);
                    handleParamObj(btnCell, iconTmpParamObj);

                    return 1;
                })(i);
                if((j - 1) % colAmt === colAmt - 1) {
                    cont.row();
                    j = 0;
                    countRow++;
                };
                i++;
            };
        };
        rebuildCont();

        let root = new Table().background(Styles.black6);
        if(countRow > rowAmt * 1.5) {
            root.table(Styles.none, tb1 => {
                tb1.image(Icon.zoom).padLeft(4.0);
                search = tb1.field(null, text => {if(text.endsWith("=")) rebuildCont()}).padBottom(4.0).left().growX().get();
                search.setMessageText("@info.lovec-info-search.name");
            }).growX().row();
        };

        let pn = (function(pn) {
            pn.setScrollingDisabled(true, false);
            pn.exited(() => {if(pn.hasScroll()) Core.scene.setScrollFocus(null)});
            if(blk != null) {
                pn.setScrollYForce(blk.selectScroll);
                pn.update(() => blk.selectScroll = pn.getScrollY());
            };
            pn.setOverscroll(false, false);
            return pn;
        })(new ScrollPane(cont, Styles.smallPane));

        root.add(pn).maxHeight(rowAmt * 40.0).growX();
        let cell = tb.top().add(root).width(colAmt * 40.0 + 28.0);
        handleParamObj(cell, boxParamObj);

        return cell;
    };
    exports.setCtSelectMulti = setCtSelectMulti;


    /**
     * Sets recipe selector for {@link BLK_recipeFactory}.
     * @param {Table} tb
     * @param {Building} b
     * @param {F0Function<string>} headerF
     * @param {CFunction<string>} cfgC
     * @param {Array<CFunction<Table>>|unset} [extraBtnMs]
     * @param {TableParamObject|unset} [iconParamObj]
     * @param {TableParamObject|unset} [boxParamObj]
     * @return {void}
     */
    const setRcSelect = function(tb, b, headerF, cfgC, extraBtnMs, iconParamObj, boxParamObj) {
        if(extraBtnMs == null) extraBtnMs = [];
        iconParamObj = processNullParam(
            iconParamObj,
            "margin", 3.0,
            "ttArg", (tb, rc) => rc.displayTooltip(tb, rc.validCheck(b)),
        );
        boxParamObj = processNullParam(
            boxParamObj,
            "align", Align.left,
            "growX", true,
            "colAmt", 4,
            "closeSelect", true,
            "useAutoSelection", false,
        );

        let
            categHeadersObj = CLS_recipe.getBlkCategHeadersObjMap().get(b.block),
            btnGrp = (function(btnGrp) {btnGrp.setMinCheckCount(0); btnGrp.setMaxCheckCount(1); return btnGrp})(new ButtonGroup()),
            colAmt = readParam(boxParamObj, "colAmt"),
            closeSelect = readParam(boxParamObj, "closeSelect"),
            useAutoSelection = readParam(boxParamObj, "useAutoSelection");

        // Buttons
        if(useAutoSelection) {
            extraBtnMs.unshift(
                tb => tb.button("A", () => {useAutoSelection = false}).tooltip(MDL_bundle.getInfo("lovec", "tt-disable-auto-selection"), true),
            );
        };
        extraBtnMs.unshift(
            tb => tb.button("?", () => Vars.ui.content.show(b.block)).tooltip(fetchStat("lovec", "spec-info").localized(), true),
        );
        tb.table(Styles.none, tb1 => {
            tb1.left().clicked(() => rebuildCont());
            extraBtnMs.forEachFast(btnM => {
                btnM(tb1).left().size(42.0);
            }, true);
        })
        .left()
        .row();

        let cont = new Table().background(Styles.black3).left();
        cont.margin(4.0);
        let contCell = tb.top().add(cont);
        handleParamObj(contCell, boxParamObj);
        // Method and field sharing the same name, great
        Reflect.set(Cell, contCell, "minWidth", (200.0).toF());

        let
            j,
            categAmt = 0,
            uncategorizedOnly = false,
            iconTmpParamObj = {};

        let rebuildCont = () => {
            btnGrp.clear();
            cont.clearChildren();

            if(useAutoSelection) {
                cont.table(Styles.none, tb1 => {
                    tb1.add(MDL_bundle.getInfo("lovec", "recipe-auto-selection")).color(Pal.remove).row();
                    tb1.add("").row();
                })
                .left()
                .row();
            };

            categAmt = 0;
            for(let categ in categHeadersObj) {
                categAmt++;
            };
            uncategorizedOnly = categAmt === 1 && categHeadersObj.uncategorized != null;

            for(let categ in categHeadersObj) {
                if(!uncategorizedOnly) {
                    cont.add(MDL_recipe.getCategBundle(categ)).left().pad(4.0).color(!useAutoSelection ? Color.white : Color.lightGray).row();
                };

                j = 0;
                let chunk = new Table();
                categHeadersObj[categ].forEachFast(rcHeader => {
                    rcHeader = String(rcHeader);
                    let rc = CLS_recipe.get(b.block, rcHeader);
                    let btnCell = chunk.button(Tex.whiteui, Styles.clearNoneTogglei, 36.0, () => {
                        if(closeSelect) Vars.control.input.config.hideConfig();
                    }).group(btnGrp);
                    let btn = btnCell.get();
                    btn.changed(() => cfgC(rcHeader));
                    btn.getStyle().imageUp = !rc.validCheck(b) ?
                        Icon.lock :
                        rc.unlockedCheck() ?
                            rc.icon :
                            rc.lockedIcon;
                    btn.getStyle().imageDisabledColor = Color.lightGray;
                    btn.update(() => {
                        btn.setDisabled(useAutoSelection);
                        // Double equality, string returned here is an object
                        btn.setChecked(headerF() == rcHeader);
                        if(TIMER.secHalf) {
                            btn.getStyle().imageUp = !rc.validCheck(b) ?
                                Icon.lock :
                                rc.unlockedCheck() ?
                                    rc.icon :
                                    rc.lockedIcon;
                        };
                    });
                    iconTmpParamObj.setProp(iconParamObj);
                    iconTmpParamObj.ttArg = tb => iconParamObj.ttArg(tb, rc);
                    handleParamObj(btnCell, iconTmpParamObj);

                    j++;
                    if((j - 1) % colAmt === colAmt - 1) {
                        chunk.row();
                        j = 0;
                    };
                }, true);

                cont.add(chunk).left().row();
            };
        };
        rebuildCont();
    };
    exports.setRcSelect = setRcSelect;


    /* <------------------------------ database stat ------------------------------ */


    /**
     * Sets an attribute display that supports multiple attributes.
     * @param {Table} tb
     * @param {Plural<AttrGn>} attrs_gn_p
     * @param {FFunction<Block, boolean>|unset} [boolF]
     * @param {number|unset} [scl]
     * @param {TableParamObject|unset} [iconParamObj]
     * @param {TableParamObject|unset} [boxParamObj]
     * @return {Cell}
     */
    const setAttr = function(tb, attrs_gn_p, boolF, scl, iconParamObj, boxParamObj) {
        if(scl == null) scl = 1.0;
        iconParamObj = processNullParam(
            iconParamObj,
            "size", 64.0,
            "ctDial", VAR.dialog.ct2,
        );
        boxParamObj = processNullParam(
            boxParamObj,
            "align", Align.left,
            "hasRow", true,
            "colAmt", MDL_ui.getColAmt(readParam(iconParamObj, "size"), 0.0, 2),
        );

        let
            arr = MDL_attr.getBlkAttrArr(attrs_gn_p, boolF),
            i = 0,
            iCap = arr.iCap(),
            j = 0,
            colAmt = readParam(boxParamObj, "colAmt");
        let cell = tb.table(Styles.none, tb1 => {
            tb1.left();
            margin(tb1, 0.5);
            while(i < iCap) {
                (function(i) {
                    blkEffc(tb1, arr[i], arr[i + 1] * scl, arr[i + 2], iconParamObj);
                })(i);
                if(j % colAmt === colAmt - 1) {
                    tb1.row();
                    j = 0;
                };
                j++;
                i += 3;
            };
        });
        handleParamObj(cell, boxParamObj);

        return cell;
    };
    exports.setAttr = setAttr;


    /**
     * Sets a gray area to hold faction icon and name.
     * @param {Table} tb
     * @param {UnlockableContent} ct
     * @param {TableParamObject|unset} [paramObj]
     * @return {Cell}
     */
    const setFaction = function(tb, ct, paramObj) {
        paramObj = processNullParam(
            paramObj,
            "padTop", 8.0,
            "padBottom", 8.0,
            "growX", true,
            "hasRow", true,
        );

        let
            faction = MDL_content.getFaction(ct),
            factionBundle = MDL_content.getFactionBundle(faction),
            factionColor = MDL_content.getFactionColor(null, faction);

        let cell = tb.table(Tex.whiteui, tb1 => {
            tb1.center().setColor(Pal.darkestGray);
            margin(tb1);

            let btn = tb1.button(
                new TextureRegionDrawable(Core.atlas.find(
                    faction === "none" ?
                        "lovec-faction-none" :
                        MDL_content.getMod(ct) + "-faction-" + faction,
                )),
                () => fetchDialog("cts").ex_show(
                    factionBundle.color(factionColor),
                    VARGEN.factionBlksMap.get(faction),
                    true,
                ),
            )
            .padLeft(-4.0)
            .padRight(24.0)
            .get();
            btn.margin(2.0);
            let btnStyle = btn.getStyle();
            btnStyle.up = Styles.none;
            btnStyle.down = Styles.none;
            btnStyle.over = Styles.flatOver;

            tb1.add(factionBundle).fontScale(1.1).color(factionColor);
        });
        handleParamObj(cell, paramObj);

        return cell;
    };
    exports.setFaction = setFaction;


    /**
     * Sets boxes to display factory family information.
     * @param {Table} tb
     * @param {Block} blk
     * @param {TableParamObject|unset} [iconParamObj]
     * @param {TableParamObject|unset} [boxParamObj]
     * @return {Cell}
     */
    const setFacFami = function(tb, blk, iconParamObj, boxParamObj) {
        iconParamObj = processNullParam(
            iconParamObj,
            "size", 48.0,
        );
        boxParamObj = processNullParam(
            boxParamObj,
            "hasRow", true,
        );

        let root = new Table();
        br(tb, 1);
        let cell = tb.left().add(root);
        handleParamObj(cell, boxParamObj);
        br(tb, 1);

        MDL_content.getFacFamis(blk).forEachFast(fami => {
            let cont = new Table();
            root.left().add(cont).width(420.0).growX().row();
            // `TABLE`: title
            cont.table(Tex.whiteui, tb1 =>{
                tb1.center().setColor(Color.darkGray);
                margin(tb1, 0.5);
                tb1.add(MDL_content.getFacFamiBundle(fami)).pad(4.0);
            })
            .left()
            .growX()
            .row();
            // `TABLE`: contents
            cont.table(Tex.whiteui, tb1 => {
                tb1.left().setColor(Pal.darkestGray);
                margin(tb1, 0.5);
                setCtLi(tb1, VARGEN.famiBlksMap.get(fami), iconParamObj);
            })
            .left()
            .growX()
            .row();
        }, true);

        return cell;
    };
    exports.setFacFami = setFacFami;


    /**
     * Sets recipe display for {@link BLK_recipeFactory}.
     * @param {Table} tb
     * @param {Block} blk
     * @param {boolean|unset} [isCollapsed]
     * @param {boolean|unset} [noInnerPane]
     * @return {void}
     */
    const setRc = function thisFun(tb, blk, isCollapsed, noInnerPane) {
        let rcs = CLS_recipe.getBlkRcsMap().get(blk, Array.air);
        if(rcs.length === 0) {
            textNothing(tb);
            return;
        };

        let
            baseCont = new Table(),
            cont = new Table(),
            contPn = new ScrollPane(cont);

        contPn.setScrollingDisabled(false, false);
        contPn.setOverscroll(false, false);

        tb.left();
        br(tb, 1);
        tb.add(baseCont).left().row();
        noInnerPane ?
            tb.add(cont).row() :
            tb.add(contPn).maxHeight(920.0).row();
        br(tb, 1);

        let buildCateg = categ => {
            let categTag = blk.name + " | " + categ;
            let shouldCollapse = tryVal(isCollapsed, tryVal(thisFun.collapserStateObj[categTag], false));

            let chunk = new Table();
            (categ !== "SPEC: base" ? cont : baseCont).left().add(chunk).growX().row();

            let rcRoot = new Table();
            let coll = new Collapser(rcRoot, false);
            coll.setDuration(0.3);
            if(!uncategorizedOnly && categ !== "SPEC: base") {
                Core.app.post(() => {
                    coll.setCollapsed(shouldCollapse, false);
                });
            };

            // `TABLE`: category title
            chunk.table(Tex.whiteui, tb1 => {
                tb1.center().setColor(categ !== "SPEC: base" ? Color.darkGray : Tmp.c1.set(Pal.accent).lerp(Color.black, 0.4));
                margin(tb1, 0.5);
                if(!uncategorizedOnly && categ !== "SPEC: base") {
                    tb1.table(Styles.none, tb2 => {
                        tb2.add(MDL_recipe.getCategBundle(categ)).pad(4.0);
                        tb2.button(coll.isCollapsed() ? Icon.downOpen : Icon.upOpen, Styles.emptyi, () => {
                            coll.toggle(true);
                            if(isCollapsed == null) {
                                thisFun.collapserStateObj[categTag] = coll.isCollapsed();
                                Core.settings.put("lovec-misc-rc-categ-collapser-state", toJsonSafe(thisFun.collapserStateObj));
                            };
                        })
                        .update(btn => btn.getStyle().imageUp = !coll.isCollapsed() ? Icon.upOpen : Icon.downOpen)
                        .size(10.0)
                        .padLeft(72.0)
                        .expandX();
                    });
                    tb1.row();
                };
                tb1.add(coll).growX();
            })
            .left()
            .growX()
            .row();
            br(chunk, 1);

            if(categ === "SPEC: base") {
                rcs[0].displayBase(rcRoot);
                return;
            };

            categHeadersObj[categ].forEachFast(rcHeader => {
                CLS_recipe.get(blk, rcHeader).display(rcRoot, i, false, true);
                bar(rcRoot, {color: Color.valueOf(Tmp.c1, "303030"), stroke: 1.0});
                i++;
            }, true);
        };

        // Used above!
        let
            i = 1,
            categHeadersObj = CLS_recipe.getBlkCategHeadersObjMap().get(blk),
            categAmt = 0,
            uncategorizedOnly = false;

        for(let categ in categHeadersObj) {
            categAmt++;
        };
        uncategorizedOnly = categAmt === 1 && categHeadersObj.uncategorized != null;
        if(rcs[0].hasBaseIo) {
            buildCateg("SPEC: base");
        };
        for(let categ in categHeadersObj) {
            buildCateg(categ);
        };
    }
    .setProp({
        /**
         * @memberof setRc
         * @type {Object<string, boolean>}
         */
        collapserStateObj: jsonToJsObj(Core.settings.getString("lovec-misc-rc-categ-collapser-state", "{}")),
    });
    exports.setRc = setRc;
