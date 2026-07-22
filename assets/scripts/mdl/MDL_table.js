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
   * Sets margin for a table or cell.
   * @param {Table|Cell} tb
   * @param {number|unset} [scl]
   * @return {Table|Cell}
   */
  const __margin = function(tb, scl) {
    if(scl == null) scl = 1.0;

    return tb.marginLeft(12.0 * scl).marginRight(12.0 * scl).marginTop(15.0 * scl).marginBottom(15.0 * scl);
  };
  exports.__margin = __margin;


  /**
   * Adds empty lines for a table.
   * @param {Table} tb
   * @param {number|unset} [repeat]
   * @return {void}
   */
  const __break = function(tb, repeat) {
    tryVal(repeat, 2)._it(i => {
      tb.add("").row();
    });
  };
  exports.__break = __break;


  /**
   * Adds a horizonal bar for a table.
   * @param {Table} tb
   * @param {Color|unset} [color]
   * @param {number|unset} [w]
   * @param {number|unset} [stroke]
   * @return {void}
   */
  const __bar = function(tb, color, w, stroke) {
    if(color == null) color = Color.darkGray;
    if(stroke == null) stroke = 4.0;

    w == null ?
      tb.image().color(color).height(stroke).pad(0.0).growX().fillX().row() :
      tb.image().color(color).width(w).height(stroke).pad(0.0).fillX().row();
  };
  exports.__bar = __bar;


  /**
   * Adds a vertical bar for a table.
   * @param {Table} tb
   * @param {Color|unset} [color]
   * @param {number|unset} [h]
   * @param {number|unset} [stroke]
   * @return {Cell}
   */
  const __barV = function(tb, color, h, stroke) {
    if(color == null) color = Color.darkGray;
    if(stroke == null) stroke = 4.0;

    return h == null ?
      tb.image().color(color).width(stroke).pad(0.0).growY().fillY() :
      tb.image().color(color).width(stroke).height(h).pad(0.0).fillY();
  };
  exports.__barV = __barV;


  /**
   * Adds a table with colored edge lines.
   * @param {Table} tb
   * @param {function(Table): void} tableF
   * @param {Color|unset} [color]
   * @param {number|unset} [stroke]
   * @return {Cell}
   */
  const __edge = function(tb, tableF, color, stroke) {
    if(color == null) color = Color.white;
    if(stroke == null) stroke = 2.0;

    return tb.table(Styles.none, tb1 => {
      tb1.table(Tex.whiteui, tb2 => {tb2.setColor(color)}).width(stroke).height(stroke);
      tb1.table(Tex.whiteui, tb2 => {tb2.setColor(color)}).height(stroke).growX();
      tb1.table(Tex.whiteui, tb2 => {tb2.setColor(color)}).width(stroke).height(stroke);
      tb1.row();
      tb1.table(Tex.whiteui, tb2 => {tb2.setColor(color)}).width(stroke).growY();
      tableF(tb1);
      tb1.table(Tex.whiteui, tb2 => {tb2.setColor(color)}).width(stroke).growY();
      tb1.row();
      tb1.table(Tex.whiteui, tb2 => {tb2.setColor(color)}).width(stroke).height(stroke);
      tb1.table(Tex.whiteui, tb2 => {tb2.setColor(color)}).height(stroke).growX();
      tb1.table(Tex.whiteui, tb2 => {tb2.setColor(color)}).width(stroke).height(stroke);
    });
  };
  exports.__edge = __edge;


  /**
   * Adds a table into a cell.
   * @param {Cell} cell
   * @param {function(Table): void} tableF
   * @return {Cell}
   */
  const __tooltip = function(cell, tableF) {
    let tooltip = new Tooltip(cons(tableF));
    tooltip.allowMobile = true;
    Reflect.get(Cell, cell, "element").addListener(tooltip);
    return cell;
  };
  exports.__tooltip = __tooltip;


  /**
   * Adds a wrapped text line for a table.
   * @param {Table} tb
   * @param {string} str
   * @param {number|unset} [align]
   * @param {number|unset} [ord]
   * @param {number|unset} [padLeft]
   * @return {void}
   */
  const __wrapLine = function(tb, str, align, ord, padLeft) {
    tb.add(str)
    .center()
    .labelAlign(tryVal(align, Align.left))
    .wrap()
    .width(MDL_ui._uiW(null, null, tryVal(ord, 0) * VAR.length.ordW))
    .padLeft(tryVal(padLeft, 0.0))
    .row();
  };
  exports.__wrapLine = __wrapLine;


  /**
   * Used when a dialog has no contents.
   * @param {Table} tb
   * @return {void}
   */
  const __textNothing = function(tb) {
    tb.add(MDL_bundle._info("lovec", "nothing")
    .color(Color.lightGray))
    .center()
    .row();
  };
  exports.__textNothing = __textNothing;


  /**
   * Adds basic button for a table.
   * @param {Table} tb
   * @param {string} text
   * @param {function(): void} scr
   * @param {number|unset} [w]
   * @param {number|unset} [h]
   * @return {Cell}
   */
  const __btn = function(tb, text, scr, w, h) {
    return tb.button(text, scr)
    .size(tryVal(w, 200.0), tryVal(h, 50.0))
    .center()
    .pad(12.0);
  };
  exports.__btn = __btn;


  /**
   * Adds an icon button for a table.
   * @param {Table} tb
   * @param {string|TextureRegionDrawable} icon
   * @param {function(): void} scr
   * @return {Cell}
   */
  const __btnSmall = function(tb, icon, scr) {
    return tb.button(icon, scr)
    .size(42.0)
    .center()
    .pad(12.0);
  };
  exports.__btnSmall = __btnSmall;


  /**
   * Adds a close button for a table.
   * @param {Table} tb
   * @param {Dialog} dial - Dialog to close.
   * @param {number|unset} [w]
   * @param {number|unset} [h]
   * @return {Cell}
   */
  const __btnClose = function(tb, dial, w, h) {
    dial.addCloseListener();
    return __btn(tb, "@close", () => dial.hide(), w, h);
  };
  exports.__btnClose = __btnClose;


  /**
   * Adds a link button for a table.
   * @param {Table} tb
   * @param {string} text
   * @param {string} url
   * @param {number|unset} [w]
   * @param {number|unset} [h]
   * @return {Cell}
   */
  const __btnLink = function(tb, text, url, w, h) {
    return __btn(tb, text, () => Core.app.openURI(url), w, h);
  };
  exports.__btnLink = __btnLink;


  /**
   * Adds a button that is only clickable when some condition is met.
   * @param {Table} tb
   * @param {string} text
   * @param {string} textInvalid
   * @param {function(): boolean} boolF - If true, the button is clickable.
   * @param {function(): void} scr
   * @param {number|unset} [w]
   * @param {number|unset} [h]
   * @return {Cell}
   */
  const __btnCond = function(tb, text, textInvalid, boolF, scr, w, h) {
    let cond;
    return __btn(tb, textInvalid, scr, w, h).update(btn => {
      cond = boolF();
      btn.setText(cond ? text : textInvalid);
      btn.setDisabled(!cond);
    });
  };
  exports.__btnCond = __btnCond;


  /**
   * Adds a small config button for a table.
   * @param {Table} tb
   * @param {Building} b
   * @param {function(Building): void} scr
   * @param {string|TextureRegionDrawable} icon
   * @param {number|unset} [w]
   * @return {Cell}
   */
  const __btnCfg = function(tb, b, scr, icon, w) {
    return tb.button(icon, tryVal(w, 24.0), () => scr(b)).center();
  };
  exports.__btnCfg = __btnCfg;


  /**
   * Variant of {@link __btnCfg} used to toggle a boolean config.
   * @param {Table} tb
   * @param {Building} b
   * @param {string|TextureRegionDrawable} iconTrue
   * @param {string|TextureRegionDrawable} iconFalse
   * @param {boolean} bool - Value of target boolean.
   * @param {number|unset} [w]
   * @return {Cell}
   */
  const __btnCfgToggle = function(tb, b, iconTrue, iconFalse, bool, w) {
    return tb.button(bool ? iconTrue : iconFalse, tryVal(w, 24.0), () => {b.configure(!bool); b.deselect()}).center();
  };
  exports.__btnCfgToggle = __btnCfgToggle;


  /**
   * Adds a slider for a table.
   * @param {Table} tb
   * @param {function(number): void} valCaller
   * @param {number|unset} [min]
   * @param {number|unset} [max]
   * @param {number|unset} [step]
   * @param {number|unset} [def]
   * @param {number|unset} [w]
   * @return {Cell}
   */
  const __slider = function(tb, valCaller, min, max, step, def, w) {
    let sliderCell = tb.slider(
      tryVal(min, 0),
      tryVal(max, 2),
      tryVal(step, 1),
      tryVal(def, tryVal(min, 0)),
      tryVal(valCaller, Function.air),
    ).left();
    if(w != null) {
      sliderCell.width(w);
      sliderCell.get().width = w;
    };

    tb.row();

    return sliderCell;
  };
  exports.__slider = __slider;


  /**
   * Adds a config slider for a table.
   * @param {Table} tb
   * @param {Building} b
   * @param {function(Building): string} strGetter - Gets string to display for current value.
   * @param {number|unset} [min]
   * @param {number|unset} [max]
   * @param {number|unset} [step]
   * @param {number|unset} [def]
   * @param {number|unset} [w]
   * @return {Cell}
   */
  const __sliderCfg = function(tb, b, strGetter, min, max, step, def, w) {
    return tb.table(Styles.none, tb1 => {
      tb1.left();
      tb1.add("").left().get().setText(prov(() => strGetter(b)));
      tb1.row();
      __slider(tb1, val => b.configure(val.toF()), min, max, step, def, w !== undefined ? w : 260.0);
    }).left().growX();
  };
  exports.__sliderCfg = __sliderCfg;


  /**
   * Adds a fixed scroll pane for a table.
   * @param {Table} tb
   * @param {function(Table): void} tableF
   * @param {number|unset} [maxW]
   * @param {number|unset} [maxH]
   * @return {Cell}
   */
  const __pnFixed = function(tb, tableF, maxW, maxH) {
    let pnCell = tb.pane(pnTb => {
      tableF(pnTb);
    });
    if(maxW != null) pnCell.maxWidth(maxW);
    if(maxH != null) pnCell.maxHeight(maxH);
    let pn = pnCell.get();
    pn.setScrollingDisabled(false, false);
    pn.setOverscroll(false, false);

    return pnCell;
  };
  exports.__pnFixed = __pnFixed;


  /**
   * Adds block efficiency display for a table.
   * Like what's done in most `Stat.tiles`, however, involved attribute is displayed in the tooltip.
   * @param {Table} tb
   * @param {Block} blk
   * @param {number} mtp
   * @param {string} nameAttr
   * @param {number|unset} [w]
   * @param {Dialog|unset} [dialToHide]
   * @param {ContentInfoDialog|unset} [ctDial]
   * @return {Cell}
   */
  const __blkEffc = function(tb, blk, mtp, nameAttr, w, dialToHide, ctDial) {
    if(w == null) w = 64.0;
    let str = (Math.abs(mtp) < 0.0001) ? "" : ((mtp < 0.0 ? "-" : "") + Strings.autoFixed(mtp * 100.0, 2) + "%");

    return tb.table(Styles.none, tb1 => {
      tb.left();
      tb1.table(Styles.none, tb2 => {
        tb2.left();
        // `TABLE`: block icon
        let btn = tb2.button(new TextureRegionDrawable(blk.uiIcon), w, () => {
          tryVal(ctDial, Vars.ui.content).show(blk);
          if(dialToHide != null) dialToHide.hide();
        })
        .tooltip(blk.localizedName + ((nameAttr == null) ? "" : ("\n\n[green]" + MDL_attr._attrB(nameAttr) + "[]")))
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
          __break(tb3);
          tb3.add(str).fontScale(0.85).left().style(Styles.outlineLabel).color(mtp < 0.0 ? Pal.remove : Pal.accent);
        });
      }).padRight(4.0);
    })
    .left()
    .padRight(8.0).padTop(4.0).padBottom(4.0);
  };
  exports.__blkEffc = __blkEffc;


  /**
   * Adds a clickable icon display for a table.
   * @param {Table} tb
   * @param {BaseDrawable} icon
   * @param {TooltipArgument|unset} ttArg
   * @param {function(): void} scr
   * @param {number|unset} [w]
   * @param {number|unset} [pad]
   * @return {Cell}
   */
  const __clickIcon = function(tb, icon, ttArg, scr, w, pad) {
    if(w == null) w = 32.0;
    if(pad == null) pad = 4.0;

    let btnCell = tb.button(icon, w, scr).pad(pad);
    if(ttArg != null) {
      if(typeof ttArg === "string") {
        btnCell.tooltip(ttArg, true);
      } else if(typeof ttArg === "function") {
        __tooltip(btnCell, ttArg);
      };
    };
    let btn = btnCell.get();
    btn.margin(0.0);
    let btnStyle = btn.getStyle();
    btnStyle.up = Styles.none;
    btnStyle.down = Styles.none;
    btnStyle.over = Styles.flatOver;

    return btnCell;
  };
  exports.__clickIcon = __clickIcon;


  /**
   * Adds a content display for a table.
   * @param {Table} tb
   * @param {UnlockableContent} ct
   * @param {number|unset} [w]
   * @param {number|unset} [pad]
   * @param {Dialog|unset} [dialToHide]
   * @param {ContentInfoDialog|unset} [ctDial]
   */
  const __ct = function(tb, ct, w, pad, dialToHide, ctDial) {
    return __clickIcon(
      tb,
      new TextureRegionDrawable(ct.uiIcon),
      ct.localizedName,
      () => {
        tryVal(ctDial, Vars.ui.content).show(ct);
        if(dialToHide != null) {
          dialToHide.hide();
        };
      },
      w, pad,
    );
  };
  exports.__ct = __ct;


  /**
   * Adds a generic content requirement display for a table.
   * @param {Table} tb
   * @param {UnlockableContent} ct
   * @param {number} amt
   * @param {function(UnlockableContent): number} amtGetter
   * @return {Cell}
   */
  const __reqCt = function(tb, ct, amt, amtGetter) {
    let reqImg = new ReqImage(
      StatValues.stack(ct, amt),
      () => (amtGetter(ct) >= amt),
    );

    return tb.add(reqImg).size(32.0);
  };
  exports.__reqCt = __reqCt;


  /**
   * Adds a resource requirement display for a table.
   * @param {Table} tb
   * @param {Building} b
   * @param {Resource} rs
   * @param {number|unset} [amt]
   * @return {Cell}
   */
  const __reqRs = function(tb, b, rs, amt) {
    let reqImg = new ReqImage(
      amt == null ? rs.uiIcon : StatValues.stack(rs, amt),
      amt == null ?
        (
          rs instanceof Item ?
            () => b.items.get(rs) > 0 :
            () => b.liquids.get(rs) > 0.0
        ) :
        (
          rs instanceof Item ?
            () => b.items.get(rs) >= amt :
            () => b.liquids.get(rs) >= amt
        ),
    );

    return tb.add(reqImg).size(32.0);
  };
  exports.__reqRs = __reqRs;


  /**
   * Adds a multiple content requirement display for a table.
   * @param {Table} tb
   * @param {Building} b
   * @param {Array<UnlockableContent>} cts
   * @param {Array<number>|unset} [amts]
   * @param {(function(UnlockableContent): number)|unset} [amtGetter]
   * @return {Cell}
   */
  const __reqMultiCt = function(tb, b, cts, amts, amtGetter) {
    let multiReqImg = new MultiReqImage();
    let i = 0;
    if(amts != null) {
      // Copy this array to fix values
      amts = amts.cpy();
    };

    cts.forEachFast(ct => {
      if(ct.unlockedNow()) multiReqImg.add(new ReqImage(
        amts == null || amts[i] == null ? ct.uiIcon : StatValues.stack(ct, amts[i]),
        (function(i) {
          if(ct instanceof Item) {
            return amts == null || amts[i] == null ?
              () => b.items.has(ct) :
              () => b.items.get(ct) >= amts[i];
          } else if(ct instanceof Liquid) {
            return amts == null || amts[i] == null ?
              () => b.liquids.get(ct) > 0.0 :
              () => b.liquids.get(ct) >= amts[i];
          };

          if(amtGetter == null) throw new Error("Hey WTF did you do to the recipe data?");
          return amts == null || amts[i] == null ?
            () => amtGetter(ct) > 0.0 :
            () => amtGetter(ct) > amts[i];
        })(i),
      ));
      i++;
    });

    return tb.add(multiReqImg).size(32.0);
  };
  exports.__reqMultiCt = __reqMultiCt;


  /**
   * Adds a recipe content display for a table.
   * @param {Table} tb
   * @param {UnlockableContent} ct
   * @param {number|unset} [amt] - Leave empty to hide amount text.
   * @param {number|unset} [p]
   * @param {boolean|unset} [cancelLiq] - Set this to true for batch fluid I/O.
   * @param {number|unset} [w]
   * @param {Dialog|unset} [dialToHide]
   * @param {ContentInfoDialog|unset} [ctDial]
   */
  const __rcCt = function(tb, ct, amt, p, cancelLiq, w, dialToHide, ctDial) {
    if(ct == null) return;
    if(amt == null) amt = -1;
    if(p == null) p = 1.0;
    if(w == null) w = 32.0;
    let str = amt < 0.0001 ?
      "" :
      ct instanceof Liquid && !cancelLiq ?
        (Strings.autoFixed(amt * 60.0, 2) + "/s") :
        Strings.autoFixed(amt, 0) + "     ";

    return tb.table(Styles.none, tb1 => {
      tb1.left();
      tb1.table(Styles.none, tb2 => {
        tb2.left();
        // `TABLE`: content icon
        let btn = tb2.button(new TextureRegionDrawable(ct.uiIcon), w, () => {
          tryVal(ctDial, Vars.ui.content).show(ct);
          if(dialToHide != null) dialToHide.hide();
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
              "" :
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
    }).left().marginRight(8.0).padTop(4.0).padBottom(4.0);
  };
  exports.__rcCt = __rcCt;


  /* <------------------------------ text ------------------------------ */


  /**
   * Sets a gray area to hold wrapped text.
   * @param {Table} tb
   * @param {string} text
   * @param {number|unset} [ord]
   * @param {number|unset} [padLeft]
   * @return {Cell}
   */
  const _d_note = function(tb, text, ord, padLeft) {
    let noteCell = tb.table(Tex.whiteui, tb1 => {
      tb1.center().setColor(Pal.darkestGray);
      __margin(tb1, 1.5);
      __wrapLine(tb1, text.color(Color.gray), Align.left, tryVal(ord, 1), padLeft);
    })
    .padTop(8.0).padBottom(8.0);
    noteCell.row();

    return noteCell;
  };
  exports._d_note = _d_note;


  /* <------------------------------ list ------------------------------ */


  /**
   * Sets an outlined table.
   * @param {Table} tb
   * @param {Array<Array>} matArr
   * @param {Color|unset} [colorLine]
   * @param {Color|unset} [colorTitle]
   * @param {Color|unset} [colorBase]
   * @param {number|unset} [stroke]
   * @param {number|unset} [imgW]
   * @return {Cell}
   */
  const _l_table = function(tb, matArr, colorLine, colorTitle, colorBase, stroke, imgW) {
    if(colorLine == null) colorLine = Color.darkGray;
    if(colorTitle == null) colorTitle = colorLine;
    if(colorBase == null) colorBase = Pal.darkestGray;
    if(stroke == null) stroke = 2.0;
    if(imgW == null) imgW = 32.0;

    let rowAmt = matArr.iCap();
    let colAmt = matArr[0].iCap();

    let contCell = tb.table(Styles.none, tb1 => {});
    let cont = contCell.get();
    if(rowAmt === 0 || colAmt === 0) return contCell;

    let tbCol, tbRow;
    for(let i = 0; i < colAmt; i++) {
      tbCol = cont.table(Styles.none, tb1 => {}).grow().get();
      for(let j = 0; j < rowAmt; j++) {
        tbRow = tbCol.table(Tex.whiteui, tb1 => {
          tb1.left().setColor(colorLine);
        }).left().grow().get();
        tbCol.row();

        tbRow.table(Styles.none, tb => {}).width(stroke).height(stroke);
        tbRow.table(Styles.none, tb => {}).width(stroke).height(stroke);
        tbRow.table(Styles.none, tb => {}).width(stroke).height(stroke);
        tbRow.row();

        tbRow.table(Styles.none, tb => {}).width(stroke).height(stroke);
        tbRow.table(Tex.whiteui, tbCell => {
          tbCell.left().setColor(j === 0 ? colorTitle : colorBase);
          __margin(tbCell, 0.25);

          let tmp = matArr[j][i];
          if(tmp instanceof TextureRegion) {
            tbCell.image(tmp).width(imgW).height(imgW);
          } else if(tmp instanceof UnlockableContent) {
            __ct(tbCell, tmp, imgW, null, null, VAR.dialog.ct1);
          } else if(typeof tmp === "function") {
            tmp(tbCell);
          } else if(typeof tmp === "string") {
            tbCell.add(tmp).padLeft(8.0).padRight(8.0);
          } else if(typeof tmp === "number") {
            tbCell.add(Strings.autoFixed(tmp, 2)).padLeft(8.0).padRight(8.0);
          } else {
            tbCell.add("!ERR");
          };
        })
        .growX()
        .height(j === 0 ? 24.0 : (imgW + 8.0));
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
  exports._l_table = _l_table;


  /**
   * Sets a list that shows icons in rows.
   * @param {Table} tb
   * @param {Plural<BaseDrawable>} icons_p
   * @param {Plural<string>} names_p
   * @param {Plural<function(): void>} scrs_p
   * @param {boolean|unset} [showOrd]
   * @return {Cell}
   */
  const _l_iconRow = function thisFun(tb, icons_p, names_p, scrs_p, showOrd) {
    let icons = icons_p instanceof Array ? icons_p : [icons_p];
    let names = names_p instanceof Array ? names_p : [names_p];
    let scrs = scrs_p instanceof Array ? scrs_p : [scrs_p];
    showOrd = showOrd && icons.length > 0;

    let ordCur = 0;
    let contCell = tb.table(Styles.none, tb1 => {});
    let cont = contCell.get();
    contCell.row();

    __break(cont, 1);
    icons.forEachFast(icon => {
      cont.table(Tex.whiteui, tb1 => {
        tb1.left().setColor(Pal.darkestGray);
        __margin(tb1);

        thisFun.buildOrder(tb1, showOrd, ordCur);
        thisFun.buildRowContent(tb1, icon, names[ordCur], scrs[ordCur]);
      })
      .growX()
      .row();
      __break(cont, 1);
      ordCur++;
    });

    return contCell;
  }
  .setProp({
    buildOrder: (tb, showOrd, ordCur) => {
      if(!showOrd) return;

      tb.table(Styles.none, tb1 => {
        tb1.left();
        tb1.table(Styles.none, tb2 => {
          tb2.center();
          tb2.add("[" + Strings.fixed(ordCur + 1, 0) + "]").color(Pal.accent);
        }).width(48.0);
      }).marginRight(18.0).growY();
    },
    buildRowContent: (tb, icon, name, scr) => {
      // `TABLE`: Icon
      tb.table(Styles.none, tb1 => {
        tb1.left();
        tb1.image(icon).size(Vars.iconLarge).padRight(18.0);
        __barV(tb1).padRight(18.0);
        if(name != null) {
          tb1.add(name);
        };
      });
      // `TABLE`: Spacing
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
  exports._l_iconRow = _l_iconRow;


  /**
   * Variant of {@link _l_iconRow} that shows content icons.
   * @param {Table} tb
   * @param {Plural<ContentGn>} cts_gn_p
   * @param {boolean|unset} [showOrd]
   * @return {Cell}
   */
  const _l_ctRow = function thisFun(tb, cts_gn_p, showOrd) {
    let cts = (cts_gn_p instanceof Array ? cts_gn_p : [cts_gn_p])
    .map(ct_gn => MDL_content._ct(ct_gn, null, true))
    .compact();

    return _l_iconRow(
      tb,
      cts.map(ct => new TextureRegionDrawable(ct.uiIcon)),
      cts.map(ct => ct.localizedName),
      cts.map(ct => () => Vars.ui.content.show(ct)),
      showOrd,
    );
  };
  exports._l_ctRow = _l_ctRow;


  /**
   * Sets a list that shows clickable icons just like in the database.
   * @param {Table} tb
   * @param {Plural<BaseDrawable>} icons_p
   * @param {Plural<TooltipArgument>} ttArgs_p
   * @param {Plural<function(): void>} scrs_p
   * @param {number|unset} [iconW]
   * @param {number|unset} [colAmt]
   * @param {Array<boolean>|unset} [breakBools]
   * @return {Cell}
   */
  const _l_iconLi = function(tb, icons_p, ttArgs_p, scrs_p, iconW, colAmt, breakBools) {
    if(iconW == null) iconW = 32.0;
    if(colAmt == null) colAmt = MDL_ui._colAmt(iconW, 0.0, 2);
    if(breakBools == null) breakBools = Array.air;
    let icons = icons_p instanceof Array ? icons_p : [icons_p];
    let ttArgs = ttArgs_p instanceof Array ? ttArgs_p : [ttArgs_p];
    let scrs = scrs_p instanceof Array ? scrs_p : [scrs_p];

    let contCell = tb.table(Tex.whiteui, tb1 => {
      tb1.left().setColor(Pal.darkestGray);
      __margin(tb1, 0.5);

      let
        i = 0,
        iCap = icons.iCap(),
        j = 0;

      while(i < iCap) {
        __clickIcon(
          tb1,
          icons[i],
          ttArgs[i],
          tryVal(scrs[i], Function.air),
          iconW,
          null,
        );

        if(i > 0 && breakBools[i + 1]) {
          tb1.row();
          __break(tb1, 1);
          j = -1;
        } else if(j % colAmt === colAmt - 1) {
          tb1.row();
          j = -1;
        };
        j++;
        i++;
      };
    }).left();
    contCell.row();

    return contCell;
  };
  exports._l_iconLi = _l_iconLi;


  /**
   * Sets a list that shows content just like in the database.
   * @param {Table} tb
   * @param {Plural<ContentGn>} cts_gn_p
   * @param {number|unset} [iconW]
   * @param {number|unset} [colAmt]
   * @param {Dialog|unset} [dialToHide]
   * @param {ContentInfoDialog|unset} [ctDial]
   * @return {Cell}
   */
  const _l_ctLi = function(tb, cts_gn_p, iconW, colAmt, dialToHide, ctDial) {
    let cts = (cts_gn_p instanceof Array ? cts_gn_p : [cts_gn_p])
    .map(ct_gn => MDL_content._ct(ct_gn, null, true))
    .compact();

    return _l_iconLi(
      tb,
      cts.map(ct => new TextureRegionDrawable(ct.uiIcon)),
      cts.map(ct => ct.localizedName),
      cts.map(ct => () => {
        tryVal(ctDial, Vars.ui.content).show(ct);
        if(dialToHide != null) {
          dialToHide.hide();
        };
      }),
      iconW, colAmt,
    );
  };
  exports._l_ctLi = _l_ctLi;


  /* <------------------------------ selector ------------------------------ */


  /**
   * Sets a selector for single content selection.
   * @param {Table} tb
   * @param {Block} blk
   * @param {Array<UnlockableContent>} cts
   * @param {function(): UnlockableContent|null} ctGetter
   * @param {function(UnlockableContent|null): void} cfgCaller
   * @param {boolean|unset} [closeSelect]
   * @param {number|unset} [rowAmt]
   * @param {number|unset} [colAmt]
   * @return {void}
   */
  const _s_ct = function(tb, blk, cts, ctGetter, cfgCaller, closeSelect, rowAmt, colAmt) {
    if(closeSelect == null) closeSelect = false;
    if(rowAmt == null) rowAmt = 4;
    if(colAmt == null) colAmt = 4;

    let
      search = null,
      searchText,
      searchArr,
      btnGrp = (function(btnGrp) {btnGrp.setMinCheckCount(0); btnGrp.setMaxCheckCount(1); return btnGrp})(new ButtonGroup()),
      countRow = 0,
      i, iCap, j;

    let cont = new Table().top();
    cont.defaults().size(40.0);
    let rebuildCont = () => {
      btnGrp.clear();
      cont.clearChildren();

      searchText = search == null ? "" : search.getText().replace(/=/g, "");
      searchArr = cts.filter(ct => String.isEmpty(searchText) || MDL_text._searchValid(ct, searchText));
      countRow = 0;
      i = 0;
      iCap = searchArr.iCap();
      j = 0;
      while(i < iCap) {
        j += (function(i) {
          let ct = searchArr[i];
          if(!MDL_cond._isRsAvailable(ct)) return 0;

          let btn = cont.button(Tex.whiteui, Styles.clearNoneTogglei, Mathf.clamp(ct.selectionSize, 0.0, 40.0), () => {if(closeSelect) Vars.control.input.config.hideConfig()}).tooltip(ct.localizedName, true).group(btnGrp).get();
          btn.changed(() => cfgCaller(btn.isChecked() ? ct : null));
          btn.getStyle().imageUp = new TextureRegionDrawable(ct.uiIcon);
          btn.update(() => btn.setChecked(ctGetter() === ct));

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
    tb.top().add(root).width(colAmt * 40.0 + 28.0);
  };
  exports._s_ct = _s_ct;


  /**
   * Sets a selector for multiple content selection.
   * @param {Table} tb
   * @param {Block} blk
   * @param {Array<UnlockableContent>} cts
   * @param {function(): Array<UnlockableContent>} ctsGetter
   * @param {function(Array): void} cfgCaller
   * @param {boolean|unset} [closeSelect]
   * @param {number|unset} [rowAmt]
   * @param {number|unset} [colAmt]
   * @param {number|unset} [max]
   * @return {void}
   */
  const _s_ctMulti = function(tb, blk, cts, ctsGetter, cfgCaller, closeSelect, rowAmt, colAmt, max) {
    if(closeSelect == null) closeSelect = false;
    if(rowAmt == null) rowAmt = 4;
    if(colAmt == null) colAmt = 4;
    if(max == null) max = Number.intMax;

    let
      search = null,
      searchText,
      searchArr,
      btnGrp = (function(btnGrp) {btnGrp.setMinCheckCount(0); btnGrp.setMaxCheckCount(max); return btnGrp})(new ButtonGroup()),
      countRow = 0,
      i, iCap, j;

    let cont = new Table().top();
    cont.defaults().size(40.0);
    let rebuildCont = () => {
      btnGrp.clear();
      cont.clearChildren();

      searchText = search == null ? "" : search.getText().replace(/=/g, "");
      searchArr = cts.filter(ct => String.isEmpty(searchText) || MDL_text._searchValid(ct, searchText));
      countRow = 0;
      i = 0;
      iCap = searchArr.iCap();
      j = 0;
      while(i < iCap) {
        j += (function(i) {
          let ct = searchArr[i];
          if(!MDL_cond._isRsAvailable(ct)) return 0;

          let btn = cont.button(Tex.whiteui, Styles.clearNoneTogglei, Mathf.clamp(ct.selectionSize, 0.0, 40.0), () => {if(closeSelect) Vars.control.input.config.hideConfig()}).tooltip(ct.localizedName, true).group(btnGrp).get();
          btn.changed(() => cfgCaller((btn.isChecked() ? ["selector", ct, true] : ["selector", ct, false]).toJavaArr(JAVA.object)));
          btn.getStyle().imageUp = new TextureRegionDrawable(ct.uiIcon);
          btn.update(() => btn.setChecked(ctsGetter().includes(ct)));

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
    tb.top().add(root).width(colAmt * 40.0 + 28.0);
  };
  exports._s_ctMulti = _s_ctMulti;


  /**
   * Sets recipe selector for {@link BLK_recipeFactory}.
   * @param {Table} tb
   * @param {Building} b
   * @param {function(): string} headerGetter
   * @param {function(string): void} cfgCaller
   * @param {Array<function(Table): void>|unset} [extraBtnSetters]
   * @param {boolean|unset} [useAutoSelection]
   * @param {boolean|unset} [closeSelect]
   * @param {number|unset} [colAmt]
   * @return {void}
   */
  const _s_rc = function(tb, b, headerGetter, cfgCaller, extraBtnSetters, useAutoSelection, closeSelect, colAmt) {
    if(extraBtnSetters == null) extraBtnSetters = [];
    if(useAutoSelection == null) useAutoSelection = false;
    if(closeSelect == null) closeSelect = true;
    if(colAmt == null) colAmt = 4;

    let
      categHeaderObj = CLS_recipe.getBlkCategHeaderObjMap().get(b.block),
      btnGrp = (function(btnGrp) {btnGrp.setMinCheckCount(0); btnGrp.setMaxCheckCount(1); return btnGrp})(new ButtonGroup());

    // Buttons
    if(useAutoSelection) {
      extraBtnSetters.unshift(
        tb => tb.button("A", () => {useAutoSelection = false}).tooltip(MDL_bundle._info("lovec", "tt-disable-auto-selection"), true),
      );
    };
    extraBtnSetters.unshift(
      tb => tb.button("?", () => Vars.ui.content.show(b.block)).tooltip(fetchStat("lovec", "spec-info").localized(), true),
    );
    tb.table(Styles.none, tb1 => {
      tb1.left().clicked(() => rebuildCont());
      extraBtnSetters.forEachFast(setter => {
        setter(tb1).left().size(42.0);
      });
    })
    .left()
    .row();

    let cont = new Table().background(Styles.black3).left();
    cont.margin(4.0);
    let contCell = tb.top().add(cont).left().growX();
    // Method and field sharing the same name, great
    Reflect.set(Cell, contCell, "minWidth", (200.0).toF());

    let
      j,
      categAmt = 0,
      uncategorizedOnly = false;

    let rebuildCont = () => {
      btnGrp.clear();
      cont.clearChildren();

      if(useAutoSelection) {
        cont.table(Styles.none, tb1 => {
          tb1.add(MDL_bundle._info("lovec", "recipe-auto-selection")).color(Pal.remove).row();
          tb1.add("").row();
        })
        .left()
        .row();
      };

      categAmt = 0;
      for(let categ in categHeaderObj) {
        categAmt++;
      };
      uncategorizedOnly = categAmt === 1 && categHeaderObj.uncategorized != null;

      for(let categ in categHeaderObj) {
        if(!uncategorizedOnly) {
          cont.add(MDL_recipe._categB(categ)).left().pad(4.0).color(!useAutoSelection ? Color.white : Color.gray).row();
        };

        j = 0;
        let chunk = new Table();
        categHeaderObj[categ].forEachFast(rcHeader => {
          rcHeader = String(rcHeader);
          let rc = CLS_recipe.get(b.block, rcHeader);
          let btnCell = chunk.button(Tex.whiteui, Styles.clearNoneTogglei, 36.0, () => {
            if(closeSelect) Vars.control.input.config.hideConfig();
          })
          .margin(3.0)
          .group(btnGrp);
          __tooltip(btnCell, tb => rc.displayTooltip(tb, rc.validTup[0](b)));
          let btn = btnCell.get();
          // `String` is required for type conversion
          btn.changed(() => cfgCaller(rcHeader));
          btn.getStyle().imageUp = rc.validTup[0](b) ? rc.icon : Icon.lock;
          btn.getStyle().imageDisabledColor = Color.gray;
          btn.update(() => {
            btn.setDisabled(useAutoSelection);
            // Double equality, string returned here is an object
            btn.setChecked(headerGetter() == rcHeader);
            if(TIMER.secHalf) {
              btn.getStyle().imageUp = rc.validTup[0](b) ? rc.icon : Icon.lock;
            };
          });

          j++;
          if((j - 1) % colAmt === colAmt - 1) {
            chunk.row();
            j = 0;
          };
        });

        cont.add(chunk).left().row();
      };
    };
    rebuildCont();
  };
  exports._s_rc = _s_rc;


  /* <------------------------------ database stat ------------------------------ */


  /**
   * Sets an attribute display that supports multiple attributes.
   * @param {Table} tb
   * @param {Plural<AttrGn>} attrs_gn_p
   * @param {(function(Block): boolean)|unset} [boolF]
   * @param {number|unset} [scl]
   * @param {number|unset} [iconW]
   * @param {number|unset} [colAmt]
   * @param {Dialog|unset} [dialToHide]
   * @param {ContentInfoDialog|unset} [ctDial]
   * @return {void}
   */
  const _d_attr = function(tb, attrs_gn_p, boolF, scl, iconW, colAmt, dialToHide, ctDial) {
    if(scl == null) scl = 1.0;
    if(iconW == null) iconW = 64.0;
    if(colAmt == null) colAmt = MDL_ui._colAmt(iconW, 0.0, 2);

    let arr = MDL_attr._blkAttrArr(attrs_gn_p, boolF);
    let i = 0, iCap = arr.iCap(), j = 0;
    tb.table(Styles.none, tb1 => {
      tb1.left();
      __margin(tb1, 0.5);

      while(i < iCap) {
        (function(i) {
          __blkEffc(tb1, arr[i], arr[i + 1] * scl, arr[i + 2], iconW, dialToHide, tryVal(ctDial, VAR.dialog.ct2));
        })(i);
        if(j % colAmt === colAmt - 1) {
          tb1.row();
          j = 0;
        };
        j++;
        i += 3;
      };
    })
    .left()
    .row();
  };
  exports._d_attr = _d_attr;


  /**
   * Sets a gray area to hold faction icon and name.
   * @param {Table} tb
   * @param {UnlockableContent} ct
   * @return {void}
   */
  const _d_faction = function(tb, ct) {
    let
      faction = MDL_content._faction(ct),
      factionB = MDL_content._factionB(faction),
      factionColor = MDL_content._factionColor(faction);

    tb.table(Tex.whiteui, tb1 => {
      tb1.center().setColor(Pal.darkestGray);
      __margin(tb1);

      let btn = tb1.button(
        new TextureRegionDrawable(Core.atlas.find(
          faction === "none" ?
            "lovec-faction-none" :
            MDL_content._mod(ct) + "-faction-" + faction,
        )),
        () => fetchDialog("cts").ex_show(
          factionB.color(factionColor),
          VARGEN.factions[faction],
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

      tb1.add(factionB).fontScale(1.1).color(factionColor);
    })
    .padTop(8.0)
    .padBottom(8.0)
    .growX()
    .row();
  };
  exports._d_faction = _d_faction;


  /**
   * Sets boxes to display factory family information.
   * @param {Table} tb
   * @param {Block} blk
   * @return {void}
   */
  const _d_facFami = function(tb, blk) {
    let root = new Table();
    __break(tb, 1);
    tb.left().add(root).row();
    __break(tb, 1);

    MDL_content._facFamis(blk).forEachFast(fami => {
      let cont = new Table();
      root.left().add(cont).width(420.0).growX().row();
      // `TABLE`: title
      cont.table(Tex.whiteui, tb1 =>{
        tb1.center().setColor(Color.darkGray);
        __margin(tb1, 0.5);
        tb1.add(MDL_content._facFamiB(fami)).pad(4.0);
      })
      .left()
      .growX()
      .row();
      // `TABLE`: contents
      cont.table(Tex.whiteui, tb1 => {
        tb1.left().setColor(Pal.darkestGray);
        __margin(tb1, 0.5);
        _l_ctLi(tb1, VARGEN.facFamis[fami], 48.0);
      })
      .left()
      .growX()
      .row();
    });
  };
  exports._d_facFami = _d_facFami;


  /**
   * Sets recipe display for {@link BLK_recipeFactory}.
   * Table hell ahead!
   * @param {Table} tb
   * @param {Block} blk
   * @param {boolean|unset} [isCollapsed]
   * @param {boolean|unset} [noInnerPane]
   * @return {void}
   */
  const _d_rc = function(tb, blk, isCollapsed, noInnerPane) {
    let rcs = CLS_recipe.getBlkRcsMap().get(blk, Array.air);
    if(rcs.length === 0) {
      __textNothing(tb);
      return;
    };

    let
      baseCont = new Table(),
      cont = new Table(),
      contPn = new ScrollPane(cont);

    contPn.setScrollingDisabled(false, false);
    contPn.setOverscroll(false, false);

    tb.left();
    __break(tb, 1);
    tb.add(baseCont).left().row();
    noInnerPane ?
      tb.add(cont).row() :
      tb.add(contPn).maxHeight(640.0).row();
    __break(tb, 1);

    let buildCateg = categ => {
      let chunk = new Table();
      (categ !== "SPEC: base" ? cont : baseCont).left().add(chunk).growX().row();

      let rcRoot = new Table();
      let coll = new Collapser(rcRoot, false);
      coll.setDuration(0.3);
      if(!uncategorizedOnly && categ !== "SPEC: base") {
        Core.app.post(() => {
          coll.setCollapsed(tryVal(isCollapsed, false), false);
        });
      };

      // `TABLE`: category title
      chunk.table(Tex.whiteui, tb1 => {
        tb1.center().setColor(categ !== "SPEC: base" ? Color.darkGray : Tmp.c1.set(Pal.accent).lerp(Color.black, 0.4));
        __margin(tb1, 0.5);
        if(!uncategorizedOnly && categ !== "SPEC: base") {
          tb1.table(Styles.none, tb2 => {
            tb2.add(MDL_recipe._categB(categ)).pad(4.0);
            tb2.button(isCollapsed ? Icon.downOpen : Icon.upOpen, Styles.emptyi, () => coll.toggle(true))
            .update(btn => btn.getStyle().imageUp = !coll.isCollapsed() ? Icon.upOpen : Icon.downOpen)
            .size(10.0)
            .padLeft(72.0)
            .expandX();
          });
          tb1.row();
        };
        tb1.add(coll).growX();
      }).left().growX().row();
      __break(chunk, 1);

      if(categ === "SPEC: base") {
        rcs[0].displayBase(rcRoot);
        return;
      };

      categHeaderObj[categ].forEachFast(rcHeader => {
        CLS_recipe.get(blk, rcHeader).display(rcRoot, i, false, true);
        __bar(rcRoot, Color.valueOf(Tmp.c1, "303030"), null, 1.0);

        i++;
      });
    };

    // Used above!
    let
      i = 1,
      categHeaderObj = CLS_recipe.getBlkCategHeaderObjMap().get(blk),
      categAmt = 0,
      uncategorizedOnly = false;

    for(let categ in categHeaderObj) {
      categAmt++;
    };
    uncategorizedOnly = categAmt === 1 && categHeaderObj.uncategorized != null;
    if(rcs[0].hasBaseIo) {
      buildCateg("SPEC: base");
    };
    for(let categ in categHeaderObj) {
      buildCateg(categ);
    };
  };
  exports._d_rc = _d_rc;
