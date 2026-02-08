/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * A nightmare of table, that's all it's for.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const TIMER = require("lovec/glb/GLB_timer");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_attr = require("lovec/mdl/MDL_attr");
  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_recipe = require("lovec/mdl/MDL_recipe");
  const MDL_text = require("lovec/mdl/MDL_text");
  const MDL_ui = require("lovec/mdl/MDL_ui");


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Sets margin for the cell quickly.
   * ---------------------------------------- */
  const __margin = function(tb, scl) {
    if(scl == null) scl = 1.0;

    return tb.marginLeft(12.0 * scl).marginRight(12.0 * scl).marginTop(15.0 * scl).marginBottom(15.0 * scl);
  };
  exports.__margin = __margin;


  /* ----------------------------------------
   * NOTE:
   *
   * Adds empty lines.
   * ---------------------------------------- */
  const __break = function(tb, repeat) {
    tryVal(repeat, 2)._it(1, i => {
      tb.add("").row();
    });
  };
  exports.__break = __break;


  /* ----------------------------------------
   * NOTE:
   *
   * A horizonal bar.
   * ---------------------------------------- */
  const __bar = function(tb, color, w, stroke) {
    if(color == null) color = Color.darkGray;
    if(stroke == null) stroke = 4.0;

    w == null ?
      tb.image().color(color).height(stroke).pad(0.0).growX().fillX().row() :
      tb.image().color(color).width(w).height(stroke).pad(0.0).fillX().row();
  };
  exports.__bar = __bar;


  /* ----------------------------------------
   * NOTE:
   *
   * A vertical bar.
   * ---------------------------------------- */
  const __barV = function(tb, color, h, stroke) {
    if(color == null) color = Color.darkGray;
    if(stroke == null) stroke = 4.0;

    return h == null ?
      tb.image().color(color).width(stroke).pad(0.0).growY().fillY() :
      tb.image().color(color).width(stroke).height(h).pad(0.0).fillY();
  };
  exports.__barV = __barV;


  /* ----------------------------------------
   * NOTE:
   *
   * A standard text line with length wrapped.
   * ---------------------------------------- */
  const __wrapLine = function(tb, str, align, ord, padLeft) {
    tb.add(str)
    .center()
    .labelAlign(tryVal(align, Align.left))
    .wrap()
    .width(MDL_ui._uiW(null, null, tryVal(ord, 0) * VAR.rad_ordRad))
    .padLeft(tryVal(padLeft, 0.0))
    .row();
  };
  exports.__wrapLine = __wrapLine;


  /* ----------------------------------------
   * NOTE:
   *
   * Used when a dialog has no contents.
   * ---------------------------------------- */
  const __textNothing = function(tb) {
    tb.add(MDL_bundle._info("lovec", "nothing")
    .color(Color.lightGray))
    .center()
    .row();
  };
  exports.__textNothing = __textNothing;


  /* ----------------------------------------
   * NOTE:
   *
   * The basic button template.
   * ---------------------------------------- */
  const __btn = function(tb, nm, scr, w, h) {
    return tb.button(nm, scr)
    .size(tryVal(w, 200.0), tryVal(h, 50.0))
    .center()
    .pad(12.0);
  };
  exports.__btn = __btn;


  /* ----------------------------------------
   * NOTE:
   *
   * Template for icon button.
   * ---------------------------------------- */
  const __btnSmall = function(tb, icon, scr) {
    return tb.button(icon, scr)
    .size(42.0)
    .center()
    .pad(12.0);
  };
  exports.__btnSmall = __btnSmall;


  /* ----------------------------------------
   * NOTE:
   *
   * A button to close the dialog.
   * ---------------------------------------- */
  const __btnClose = function(tb, dial, w, h) {
    dial.addCloseListener();
    return __btn(tb, "@close", () => dial.hide(), w, h);
  };
  exports.__btnClose = __btnClose;


  /* ----------------------------------------
   * NOTE:
   *
   * A button to visit some website.
   * ---------------------------------------- */
  const __btnLink = function(tb, nm, url, w, h) {
    return __btn(tb, nm, () => Core.app.openURI(url), w, h);
  };
  exports.__btnLink = __btnLink;


  /* ----------------------------------------
   * NOTE:
   *
   * Basic config button.
   * ---------------------------------------- */
  const __btnCfg = function(tb, b, scr, icon, w) {
    return tb.button(icon, tryVal(w, 24.0), () => scr(b)).center();
  };
  exports.__btnCfg = __btnCfg;


  /* ----------------------------------------
   * NOTE:
   *
   * A config button to switch {bool} property in a building.
   * ---------------------------------------- */
  const __btnCfgToggle = function(tb, b, iconTrue, iconFalse, bool, w) {
    return tb.button(bool ? iconTrue : iconFalse, tryVal(w, 24.0), () => {b.configure(!bool); b.deselect()}).center();
  };
  exports.__btnCfgToggle = __btnCfgToggle;


  /* ----------------------------------------
   * NOTE:
   *
   * Simply a slider.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * A slider bar used mostly for config.
   * ---------------------------------------- */
  const __sliderCfg = function(tb, b, strGetter, min, max, step, def, w) {
    return tb.table(Styles.none, tb1 => {
      tb1.left();
      tb1.add("").left().get().setText(prov(() => strGetter(b)));
      tb1.row();
      __slider(tb1, val => b.configure(val.toF()), min, max, step, def, w !== undefined ? w : 260.0);
    }).left().growX();
  };
  exports.__sliderCfg = __sliderCfg;


  /* ----------------------------------------
   * NOTE:
   *
   * Like what's done in {Stat.tiles}, but displays the attribute in tooltip.
   * ---------------------------------------- */
  const __blkEffc = function(tb, blk, mtp, nmAttr, w, dial) {
    if(blk == null) return;
    if(w == null) w = 64.0;
    let str = (Math.abs(mtp) < 0.0001) ? "" : ((mtp < 0.0 ? "-" : "") + Strings.autoFixed(mtp * 100.0, 2) + "%");

    return tb.table(Styles.none, tb1 => {
      tb.left();
      tb1.table(Styles.none, tb2 => {
        tb2.left();
        // @TABLE: block icon
        let btn = tb2.button(new TextureRegionDrawable(blk.uiIcon), w, () => {
          Vars.ui.content.show(blk);
          if(dial != null) dial.hide();
        })
        .tooltip(blk.localizedName + ((nmAttr == null) ? "" : ("\n\n[green]" + MDL_attr._attrB(nmAttr) + "[]")))
        .padRight(-18.0)
        .get();
        btn.margin(0.0);
        let btnStyle = btn.getStyle();
        btnStyle.up = Styles.none;
        btnStyle.down = Styles.none;
        btnStyle.over = Styles.flatOver;
        // @TABLE: efficiency label
        tb2.table(Styles.none, tb3 => {
          tb3.left();
          __break(tb3);
          tb3.add(str).fontScale(0.85).left().style(Styles.outlineLabel).color(mtp < 0.0 ? Pal.remove : Pal.accent);
        });
      }).padRight(4.0);
    }).left().padRight(8.0).padTop(4.0).padBottom(4.0);
  };
  exports.__blkEffc = __blkEffc;


  /* ----------------------------------------
   * NOTE:
   *
   * A content icon that can be clicked to show its stat page.
   * ---------------------------------------- */
  const __ct = function(tb, ct, w, pad, dial) {
    if(ct == null) return;
    if(w == null) w = 32.0;
    if(pad == null) pad = 4.0;

    let btnCell = tb.button(new TextureRegionDrawable(ct.uiIcon), w, () => {
      Vars.ui.content.show(ct);
      if(dial != null) dial.hide();
    })
    .pad(pad)
    .tooltip(ct.localizedName, true);
    let btn = btnCell.get();
    btn.margin(0.0);
    let btnStyle = btn.getStyle();
    btnStyle.up = Styles.none;
    btnStyle.down = Styles.none;
    btnStyle.over = Styles.flatOver;

    return btnCell;
  };
  exports.__ct = __ct;


  /* ----------------------------------------
   * NOTE:
   *
   * Used by recipe factories to replace consumer-based table.
   * ---------------------------------------- */
  const __reqCt = function(tb, ct, amt, amtGetter) {
    let reqImg = new ReqImage(
      StatValues.stack(ct, amt),
      () => amtGetter() >= amt,
    );

    return tb.add(reqImg).size(32.0);
  };
  exports.__reqCt = __reqCt;


  /* ----------------------------------------
   * NOTE:
   *
   * Used by recipe factories to replace consumer-based table.
   * ---------------------------------------- */
  const __reqRs = function(tb, b, rs, amt) {
    let reqImg = new ReqImage(
      rs instanceof Item ? StatValues.stack(rs, amt) : rs.uiIcon,
      rs instanceof Item ? () => b.items.get(rs) >= amt : () => b.liquids.get(rs) > 0.0,
    );

    return tb.add(reqImg).size(32.0);
  };
  exports.__reqRs = __reqRs;


  /* ----------------------------------------
   * NOTE:
   *
   * Used by recipe factories to replace consumer-based table.
   * ---------------------------------------- */
  const __reqMultiRs = function(tb, b, rss) {
    let multiReqImg = new MultiReqImage();
    rss.forEachFast(rs => {
      if(rs.unlockedNow()) multiReqImg.add(new ReqImage(
        rs.uiIcon,
        rs instanceof Item ? () => b.items.has(rs) : () => b.liquids.get(rs) > 0.0,
      ));
    });

    return tb.add(multiReqImg).size(32.0);
  };
  exports.__reqMultiRs = __reqMultiRs;


  /* ----------------------------------------
   * NOTE:
   *
   * A group of elements mainly used by recipe tables.
   * ---------------------------------------- */
  const __rcCt = function(tb, ct, amt, p, cancelLiq, w, dial) {
    if(ct == null) return;
    if(amt == null) amt = -1;
    if(p == null) p = 1.0;
    if(w == null) w = 32.0;
    let str = amt < 0 ?
      "" :
      ct instanceof Liquid && !cancelLiq ?
        (Strings.autoFixed(amt * 60.0, 2) + "/s") :
        Strings.autoFixed(amt, 0);

    return tb.table(Styles.none, tb1 => {
      tb1.left();
      tb1.table(Styles.none, tb2 => {
        tb2.left();
        // @TABLE: content icon
        let btn = tb2.button(new TextureRegionDrawable(ct.uiIcon), w, () => {
          if(dial != null) dial.hide();
          Vars.ui.content.show(ct);
        })
        .tooltip(ct.localizedName)
        .padRight(-4.0)
        .get();
        btn.margin(0.0);
        let btnStyle = btn.getStyle();
        btnStyle.up = Styles.none;
        btnStyle.down = Styles.none;
        btnStyle.over = Styles.flatOver;
        // @TABLE: content label
        tb2.table(Styles.none, tb3 => {
          tb3.left();
          // Probability (top right)
          tb3.add(
            Math.abs(p - 1.0) < 0.0001 ?
              "" :
              (Strings.autoFixed(p * 100.0, 2) + "%")
          ).left().fontScale(0.85).style(Styles.outlineLabel).color(Color.gray).row();
          // Amount (bottom right)
          tb3.add(str).left().fontScale(0.85).style(Styles.outlineLabel);
        });
      }).padRight(6.0);
    }).left().padRight(12.0).padTop(4.0).padBottom(4.0);
  };
  exports.__rcCt = __rcCt;


  /* <---------- text ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Sets a gray area holding text lines.
   * ---------------------------------------- */
  const setDisplay_note = function(tb, str, ord, padLeft) {
    const noteCell = tb.table(Tex.whiteui, tb1 => {
      tb1.center().setColor(Pal.darkestGray);
      __margin(tb1, 1.5);
      __wrapLine(tb1, str.color(Color.gray), Align.left, tryVal(ord, 1), padLeft);
    }).padTop(8.0).padBottom(8.0);
    noteCell.row();

    return noteCell;
  };
  exports.setDisplay_note = setDisplay_note;


  /* <---------- table ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Sets up an outlined table for data display.
   * ---------------------------------------- */
  const setTable_base = function(tb, matArr, colorLine, colorTitle, colorBase, stroke, imgW) {
    if(colorLine == null) colorLine = Color.darkGray;
    if(colorTitle == null) colorTitle = colorLine;
    if(colorBase == null) colorBase = Pal.darkestGray;
    if(stroke == null) stroke = 2.0;
    if(imgW == null) imgW = 32.0;

    let rowAmt = matArr.iCap();
    let colAmt = matArr[0].iCap();
    if(rowAmt === 0 || colAmt === 0) return;

    const contCell = tb.table(Styles.none, tb1 => {});
    const cont = contCell.get();

    for(let i = 0; i < colAmt; i++) {
      let tbCol = cont.table(Styles.none, tb1 => {}).grow().get();
      for(let j = 0; j < rowAmt; j++) {
        let tbRow = tbCol.table(Tex.whiteui, tb1 => {
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
            __ct(tbCell, tmp, imgW);
          } else if(typeof tmp === "function") {
            tmp(tbCell);
          } else if(typeof tmp === "string") {
            tbCell.add(tmp).padLeft(8.0).padRight(8.0);
          } else if(typeof tmp === "number") {
            tbCell.add(Strings.autoFixed(tmp, 2)).padLeft(8.0).padRight(8.0);
          } else {
            tbCell.add("!ERR");
          };
        }).growX().height(j === 0 ? 24.0 : (imgW + 8.0));
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
  exports.setTable_base = setTable_base;


  /* <---------- content ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Sets a list that shows contents in rows.
   * ---------------------------------------- */
  const setDisplay_ctRow = function thisFun(tb, cts_gn_p, showOrd) {
    let cts_gn = cts_gn_p instanceof Array ? cts_gn_p : [cts_gn_p];
    showOrd = showOrd && cts_gn.length > 0;

    let ordCur = 0;
    const contCell = tb.table(Styles.none, tb1 => {});
    const cont = contCell.get();
    contCell.row();

    __break(cont, 1);
    cts_gn.forEachFast(ct_gn => {
      let ct = MDL_content._ct(ct_gn, null, true);
      if(ct == null) return;

      cont.table(Tex.whiteui, tb1 => {
        tb1.left().setColor(Pal.darkestGray);
        __margin(tb1);

        thisFun.buildOrder(tb1, ct, showOrd, ordCur);
        thisFun.buildRowContent(tb1, ct);
      }).growX().row();

      __break(cont, 1);
      ordCur++;
    });

    return contCell;
  }
  .setProp({
    buildOrder: (tb, ct, showOrd, ordCur) => {
      if(!showOrd) return;

      tb.table(Styles.none, tb1 => {
        tb1.left();
        tb1.table(Styles.none, tb2 => {
          tb2.center();
          tb2.add("[" + Strings.fixed(ordCur + 1, 0) + "]").color(Pal.accent);
        }).width(48.0);
      }).marginRight(18.0).growY();
    },
    buildRowContent: (tb, ct) => {
      // @TABLE: content icon
      tb.table(Styles.none, tb1 => {
        tb1.left();
        tb1.image(ct.uiIcon).size(Vars.iconLarge).padRight(18.0);
        __barV(tb1).padRight(18.0);
        tb1.add(ct.localizedName);
      });
      // @TABLE: spacing
      tb.table(Styles.none, tb1 => {}).width(80.0).growX().growY();
      // @TABLE: "?" button
      tb.table(Styles.none, tb1 => {
        tb1.left();
        tb1.button("?", () => Vars.ui.content.show(ct)).size(VAR.rad_charBtnRad);
      });
    },
  });
  exports.setDisplay_ctRow = setDisplay_ctRow;


  /* ----------------------------------------
   * NOTE:
   *
   * Sets a list that shows content just like in the database.
   * ---------------------------------------- */
  const setDisplay_ctLi = function(tb, cts_gn_p, iconW, colAmt, dial) {
    if(iconW == null) iconW = 32.0;
    if(colAmt == null) colAmt = MDL_ui._colAmt(iconW, 0.0, 2);
    let cts_gn = cts_gn_p instanceof Array ? cts_gn_p : [cts_gn_p];

    const contCell = tb.table(Tex.whiteui, tb1 => {
      tb1.left().setColor(Pal.darkestGray);
      __margin(tb1, 0.5);

      let i = 0, iCap = cts_gn.iCap(), j = 0;
      while(i < iCap) {
        (function(i) {
          let ct = MDL_content._ct(cts_gn[i], null, true);
          if(ct != null) __ct(tb1, ct, iconW, null, dial);
        })(i);

        if(j % colAmt === colAmt - 1) tb1.row();
        j++;
        i++;
      };
    }).left();
    contCell.row();

    return contCell;
  };
  exports.setDisplay_ctLi = setDisplay_ctLi;


  /* ----------------------------------------
   * NOTE:
   *
   * Sets a selector for choosing a content.
   * Improved vanilla {ItemSelection} with better text search.
   * ---------------------------------------- */
  const setSelector_ct = function(tb, blk, cts, ctGetter, cfgCaller, closeSelect, rowAmt, colAmt) {
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

    const cont = new Table().top();
    cont.defaults().size(40.0);
    const rebuildCont = () => {
      btnGrp.clear();
      cont.clearChildren();

      searchText = search == null ? "" : search.getText().replace(/=/g, "");
      searchArr = cts.filter(ct => searchText === "" || MDL_text._searchValid(ct, searchText));
      countRow = 0;
      i = 0, iCap = searchArr.iCap(), j = 0;
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

    const root = new Table().background(Styles.black6);
    if(countRow > rowAmt * 1.5) {
      root.table(Styles.none, tb1 => {
        tb1.image(Icon.zoom).padLeft(4.0);
        search = tb1.field(null, text => {if(text.endsWith("=")) rebuildCont()}).padBottom(4.0).left().growX().get();
        search.setMessageText("@info.lovec-info-search.name");
      }).growX().row();
    };

    const pn = (function(pn) {
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
  exports.setSelector_ct = setSelector_ct;


  /* ----------------------------------------
   * NOTE:
   *
   * Sets a selector for choosing multiple contents.
   * ---------------------------------------- */
  const setSelector_ctMulti = function(tb, blk, cts, ctsGetter, cfgCaller, closeSelect, rowAmt, colAmt, max) {
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

    const cont = new Table().top();
    cont.defaults().size(40.0);
    const rebuildCont = () => {
      btnGrp.clear();
      cont.clearChildren();

      searchText = search == null ? "" : search.getText().replace(/=/g, "");
      searchArr = cts.filter(ct => searchText === "" || MDL_text._searchValid(ct, searchText));
      countRow = 0;
      i = 0, iCap = searchArr.iCap(), j = 0;
      while(i < iCap) {
        j += (function(i) {
          let ct = searchArr[i];
          if(!MDL_cond._isRsAvailable(ct)) return 0;

          let btn = cont.button(Tex.whiteui, Styles.clearNoneTogglei, Mathf.clamp(ct.selectionSize, 0.0, 40.0), () => {if(closeSelect) Vars.control.input.config.hideConfig()}).tooltip(ct.localizedName, true).group(btnGrp).get();
          btn.changed(() => cfgCaller((btn.isChecked() ? ["selector", ct, true] : ["selector", ct, false]).toJavaArr()));
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

    const root = new Table().background(Styles.black6);
    if(countRow > rowAmt * 1.5) {
      root.table(Styles.none, tb1 => {
        tb1.image(Icon.zoom).padLeft(4.0);
        search = tb1.field(null, text => {if(text.endsWith("=")) rebuildCont()}).padBottom(4.0).left().growX().get();
        search.setMessageText("@info.lovec-info-search.name");
      }).growX().row();
    };

    const pn = (function(pn) {
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
  exports.setSelector_ctMulti = setSelector_ctMulti;


  /* <---------- misc stat ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Sets attribute display that supports multiple attributes.
   * ---------------------------------------- */
  const setDisplay_attr = function(tb, attrs_gn_p, boolF, scl, iconW, colAmt, dial) {
    if(scl == null) scl = 1.0;
    if(iconW == null) iconW = 64.0;
    if(colAmt == null) colAmt = MDL_ui._colAmt(iconW, 0.0, 2);

    let map = MDL_attr._blkAttrMap(attrs_gn_p, boolF);
    let i = 0, iCap = map.iCap(), j = 0;
    tb.table(Styles.none, tb1 => {
      tb1.left();
      __margin(tb1, 0.5);

      while(i < iCap) {
        (function(i) {
          __blkEffc(tb1, map[i], map[i + 1] * scl, map[i + 2], iconW, dial);
        })(i);
        if(j % colAmt === colAmt - 1) {
          tb1.row();
          j = 0;
        };
        j++;
        i += 3;
      };
    }).left().row();
  };
  exports.setDisplay_attr = setDisplay_attr;


  /* ----------------------------------------
   * NOTE:
   *
   * Sets a gray area holding faction icon and name.
   * ---------------------------------------- */
  const setDisplay_faction = function(tb, ct) {
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
  exports.setDisplay_faction = setDisplay_faction;


  /* ----------------------------------------
   * NOTE:
   *
   * Sets factory family boxes.
   * ---------------------------------------- */
  const setDisplay_facFami = function(tb, blk) {
    const root = new Table();
    __break(tb, 1);
    tb.left().add(root).row();
    __break(tb, 1);

    MDL_content._facFamis(blk).forEachFast(fami => {
      let cont = new Table();
      root.left().add(cont).width(420.0).growX().row();
      // @TABLE: title
      cont.table(Tex.whiteui, tb1 =>{
        tb1.center().setColor(Color.darkGray);
        __margin(tb1, 0.5);
        tb1.add(MDL_content._facFamiB(fami)).pad(4.0);
      }).left().growX().row();
      // @TABLE: contents
      cont.table(Tex.whiteui, tb1 => {
        tb1.left().setColor(Pal.darkestGray);
        __margin(tb1, 0.5);
        setDisplay_ctLi(tb1, VARGEN.facFamis[fami], 48.0);
      }).left().growX().row();
    });
  };
  exports.setDisplay_facFami = setDisplay_facFami;


  /* <---------- recipe ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Sets recipe display for {BLK_recipeFactory}.
   * Table hell ahead!
   * ---------------------------------------- */
  const setDisplay_recipe = function(tb, rcMdl, blk, isCollapsed, noInnerPane) {
    if(MDL_recipe._rcSize(rcMdl) === 0) {
      __textNothing(tb);
      return;
    };

    const cont = new Table();
    const contPn = new ScrollPane(cont);
    contPn.setScrollingDisabled(false, false);
    contPn.setOverscroll(false, false);

    tb.left();
    __break(tb, 1);
    noInnerPane ?
      tb.add(cont).row() :
      tb.add(contPn).maxHeight(720.0).row();
    __break(tb, 1);

    /* START OF HELL */

    const buildCateg = (categ) => {
      let chunk = new Table();
      cont.left().add(chunk).growX().row();

      let rcRoot = new Table();
      let coll = new Collapser(rcRoot, false);
      coll.setDuration(0.3);
      Core.app.post(() => {
        coll.setCollapsed(tryVal(isCollapsed, false), false);
      });

      // @TABLE: category title
      chunk.table(Tex.whiteui, tb1 => {
        tb1.center().setColor(Color.darkGray);
        __margin(tb1, 0.5);
        tb1.table(Styles.none, tb2 => {
          tb2.add(MDL_recipe._categB(categ)).pad(4.0);
          tb2.button(isCollapsed ? Icon.downOpen : Icon.upOpen, Styles.emptyi, () => coll.toggle(true))
          .update(btn => btn.getStyle().imageUp = !coll.isCollapsed() ? Icon.upOpen : Icon.downOpen)
          .size(10.0)
          .padLeft(72.0)
          .expandX();
        });
        tb1.row();
        tb1.add(coll).growX();
      }).left().growX().row();
      __break(chunk, 1);

      categHeaderObj[categ].forEachFast(rcHeader => {
        let ci = MDL_recipe._ci(rcMdl, rcHeader);
        let bi = MDL_recipe._bi(rcMdl, rcHeader);
        let aux = MDL_recipe._aux(rcMdl, rcHeader);
        let opt = MDL_recipe._opt(rcMdl, rcHeader);
        let payi = MDL_recipe._payi(rcMdl, rcHeader);
        let co = MDL_recipe._co(rcMdl, rcHeader);
        let bo = MDL_recipe._bo(rcMdl, rcHeader);
        let fo = MDL_recipe._fo(rcMdl, rcHeader);
        let payo = MDL_recipe._payo(rcMdl, rcHeader);

        // @TABLE: recipe root
        rcRoot.table(Tex.whiteui, tb1 => {
          tb1.left().setColor(Pal.darkestGray);

          buildOrder(tb1, i);
          tb1.table(Styles.none, tb2 => {}).left().width(36.0).growY();
          buildInput(tb1, ci, bi, aux, opt, payi);
          tb1.table(Styles.none, tb2 => {}).left().width(48.0).growX().growY();
          buildOutput(tb1, co, bo, fo, payo);
          buildRcStats(tb1, rcMdl, rcHeader);
        }).left().growX().row();
        __bar(rcRoot, Color.valueOf("303030"), null, 1.0);

        i++;
      });
    };

    const buildOrder = (tb, i) => {
      tb.table(Styles.none, tb1 => {
        tb1.left();
        tb1.table(Styles.none, tb2 => {
          tb2.center();
          tb2.add("[" + Strings.fixed(i, 0) + "]").color(Pal.accent);
        }).width(72.0);
        __barV(tb1, Pal.accent);
      }).left().growY();
    };

    const buildInput = (tb, ci, bi, aux, opt, payi) => {
      tb.table(Styles.none, tb1 => {
        tb1.left();
        if(bi.length > 0) buildBi(tb1, bi);
        if(ci.length > 0) buildCi(tb1, ci);
        if(aux.length > 0) buildAux(tb1, aux);
        if(opt.length > 0) buildOpt(tb1, opt);
        if(payi.length > 0) buildPayi(tb1, payi);
        tb1.table(Styles.none, tb2 => {}).left().width(24.0).growX().growY();
      }).left().growY();
    };

    const buildOutput = (tb, co, bo, fo, payo) => {
      tb.table(Styles.none, tb1 => {
        tb1.left();
        if(bo.length > 0) buildBo(tb1, bo);
        if(co.length > 0) buildCo(tb1, co);
        if(fo.length > 0) buildFo(tb1, fo);
        if(payo.length > 0) buildPayo(tb1, payo);
      }).left().growY();
    };

    const buildBi = (tb, bi) => {
      tb.table(Styles.none, tb1 => {
        tb1.left();
        __margin(tb1);
        tb1.add("BI:").left().tooltip(MDL_bundle._term("lovec", "bi"), true).row();
        tb1.table(Styles.none, tb2 => {
          bi.forEachRow(3, (tmp, amt, p) => {
            if(!(tmp instanceof Array)) {
              __rcCt(tb2, tmp, amt, p, true);
            } else {
              tb2.table(Tex.whiteui, tb3 => {
                tb3.left().setColor(Pal.darkerGray);
                tb3.pane(pn => {
                  tmp.forEachRow(3, (tmp1, amt, p) => {
                    __rcCt(pn, tmp1, amt, p, true).row();
                  });
                });
              }).padRight(16.0).maxHeight(82.0);
            };
          });
        }).left().marginRight(24.0);
      });
    };

    const buildCi = (tb, ci) => {
      tb.table(Styles.none, tb1 => {
        tb1.left();
        __margin(tb1);
        tb1.add("CI:").left().tooltip(MDL_bundle._term("lovec", "ci"), true).row();
        tb1.table(Styles.none, tb2 => {
          ci.forEachRow(2, (tmp, amt) => {
            if(!(tmp instanceof Array)) {
              __rcCt(tb2, tmp, amt);
            } else {
              tb2.table(Tex.whiteui, tb3 => {
                tb3.left().setColor(Pal.darkerGray);
                tb3.pane(pn => {
                  tmp.forEachRow(2, (tmp1, amt) => {
                    __rcCt(pn, tmp1, amt).row();
                  });
                });
              }).padRight(16.0).maxHeight(82.0);
            };
          });
        });
      }).left().marginRight(24.0);
    };

    const buildAux = (tb, aux) => {
      tb.table(Styles.none, tb1 => {
        tb1.left();
        __margin(tb1);
        tb1.add("AUX:").left().tooltip(MDL_bundle._term("lovec", "aux"), true).row();
        tb1.table(Styles.none, tb2 => {
          aux.forEachRow(2, (tmp, amt) => {
            __rcCt(tb2, tmp, amt);
          });
        });
      }).left().marginRight(24.0);
    };

    const buildOpt = (tb, opt) => {
      tb.table(Styles.none, tb1 => {
        tb1.left();
        __margin(tb1);
        tb1.add("OPT:").left().tooltip(MDL_bundle._term("lovec", "opt"), true).row();
        tb1.button("?", () => fetchDialog("rcOpt").ex_show(MDL_bundle._term("lovec", "opt"), opt)).size(34.0).pad(3.0);
      }).left().marginRight(24.0);
    };

    const buildPayi = (tb, payi) => {
      tb.table(Styles.none, tb1 => {
        tb1.left();
        __margin(tb1);
        tb1.add("PAYI:").left().tooltip(MDL_bundle._term("lovec", "payi"), true).row();
        tb1.table(Styles.none, tb2 => {
          payi.forEachRow(2, (nm, amt) => {
            __rcCt(tb2, MDL_content._ct(nm, null, true), amt, 1.0, true);
          });
        });
      }).left().marginRight(24.0);
    };

    const buildBo = (tb, bo) => {
      tb.table(Styles.none, tb1 => {
        tb1.left();
        __margin(tb1);
        tb1.add("BO:").left().tooltip(MDL_bundle._term("lovec", "bo"), true).row();
        tb1.table(Styles.none, tb2 => {
          bo.forEachRow(3, (tmp, amt, p) => {
            __rcCt(tb2, tmp, amt, p, true);
          });
        });
      }).left().marginRight(24.0);
    };

    const buildCo = (tb, co) => {
      tb.table(Styles.none, tb1 => {
        tb1.left();
        __margin(tb1);
        tb1.add("CO:").left().tooltip(MDL_bundle._term("lovec", "co"), true).row();
        tb1.table(Styles.none, tb2 => {
          co.forEachRow(2, (tmp, amt) => {
            __rcCt(tb2, tmp, amt);
          });
        });
      }).left().marginRight(24.0);
    };

    const buildFo = (tb, fo) => {
      tb.table(Styles.none, tb1 => {
        tb1.left();
        __margin(tb1);
        tb1.add("FO:").left().tooltip(MDL_bundle._term("lovec", "fo"), true).row();
        tb1.table(Styles.none, tb2 => {
          bo.forEachRow(3, (tmp, amt, p) => {
            __rcCt(tb2, tmp, amt, p, true);
          });
        });
      }).left().marginRight(24.0);
    };

    const buildPayo = (tb, payo) => {
      tb.table(Styles.none, tb1 => {
        tb1.left();
        __margin(tb1);
        tb1.add("PAYO:").left().tooltip(MDL_bundle._term("lovec", "payo"), true).row();
        tb1.table(Styles.none, tb2 => {
          payo.forEachRow(2, (nm, amt) => {
            __rcCt(tb2, MDL_content._ct(nm, null, true), amt, 1.0, true);
          });
        });
      }).left().marginRight(24.0);
    };

    const buildRcStats = (tb, rcMdl, rcHeader) => {
      // Meta
      let timeScl = MDL_recipe._timeScl(rcMdl, rcHeader);
      let isGen = MDL_recipe._isGen(rcMdl, rcHeader);
      // General
      let pol = MDL_recipe._pol(rcMdl, rcHeader);
      let lockedByCts = MDL_recipe._lockedBy(rcMdl, rcHeader, true);
      let attr = MDL_recipe._attr(rcMdl, rcHeader);
      let attrBoostScl = MDL_recipe._attrBoostScl(rcMdl, rcHeader);
      // Specific
      let powProdMtp = MDL_recipe._powProdMtp(rcMdl, rcHeader);
      let tempReq = MDL_recipe._tempReq(rcMdl, rcHeader);
      let tempAllowed = MDL_recipe._tempAllowed(rcMdl, rcHeader);
      let durabDecMtp = MDL_recipe._durabDecMtp(rcMdl, rcHeader);
      // I/O
      let reqOpt = MDL_recipe._reqOpt(rcMdl, rcHeader);
      let failP = MDL_recipe._failP(rcMdl, rcHeader);

      tb.table(Styles.none, tb1 => {
        __barV(tb1, Pal.accent);
        tb1.table(Styles.none, tb2 => {}).width(24.0);
        tb1.table(Styles.none, tb2 => {
          tb2.pane(pn => {
            let addStat = newMultiFunction(
              function(cond, str) {
                if(cond) pn.add(str).left().row();
              },
              function(cond, titleStr, valStr) {
                if(cond) pn.add(MDL_text._statText(titleStr, valStr)).left().row();
              },
              function(cond, titleStr, valStr, unitStr) {
                if(cond) pn.add(MDL_text._statText(titleStr, valStr, unitStr)).left().row();
              },
            );

            pn.left();

            // Stats
            addStat(isGen, MDL_bundle._term("lovec", "generated-recipe").color(Pal.gray));
            addStat(!timeScl.fEqual(1.0), MDL_bundle._term("lovec", "time-required"), Strings.fixed(timeScl, 1) + "x (" + Strings.autoFixed(blk.craftTime * timeScl / 60.0, 2) + "s)");
            addStat(!pol.fEqual(0.0), fetchStat("lovec", "blk-pol").localized(), (pol > 0.0 ? "+" : "-") + Math.abs(pol), fetchStatUnit("lovec", "polunits").localized());
            addStat(reqOpt, MDL_bundle._term("lovec", "require-optional"), MDL_bundle._base("yes"));
            addStat(failP > 0.0, MDL_bundle._term("lovec", "chance-to-fail"), failP.perc(1));
            addStat(!powProdMtp.fEqual(1.0), fetchStat("lovec", "blk0pow-powmtp").localized(), powProdMtp.perc());
            addStat(tempReq > 0.0, fetchStat("lovec", "blk0heat-tempreq").localized(), Strings.fixed(tempReq, 2), fetchStatUnit("lovec", "heatunits").localized());
            addStat(tempAllowed < Infinity, MDL_bundle._term("lovec", "temperature-allowed"), Strings.fixed(tempAllowed, 2), fetchStatUnit("lovec", "heatunits").localized());
            addStat(!durabDecMtp.fEqual(1.0), MDL_bundle._term("lovec", "abrasion-multiplier"), durabDecMtp.perc());
            if(lockedByCts.length > 0) {
              pn.table(Styles.none, tb3 => {
                tb3.left();
                tb3.add(MDL_text._statText(MDL_bundle._term("lovec", "require-unlocking"), "")).left();
                lockedByCts.forEachFast(ct => __ct(tb3, ct, 28.0, 0.0));
              }).left().row();
            };
            if(attr != null) {
              pn.add(MDL_text._statText(fetchStat("lovec", "blk-attrreq").localized(), MDL_attr._attrB(attr))).left().tooltip(cons(tb => {
                tb.table(Styles.black6, tb1 => {
                  __margin(tb1);
                  setDisplay_attr(tb1, attr, null, attrBoostScl, 40.0, 5);
                });
              })).row();
            };
          }).height(120.0).growX();
        }).left().width(360.0).growX();
        tb1.table(Styles.none, tb2 => {}).width(20.0);
      }).growY();
    };

    /* END OF HELL */

    const categHeaderObj = MDL_recipe._categHeaderObj(rcMdl);
    let i = 1;
    for(let categ in categHeaderObj) {
      buildCateg(categ);
    };
  };
  exports.setDisplay_recipe = setDisplay_recipe;


  /* ----------------------------------------
   * NOTE:
   *
   * Sets recipe selector for {BLK_recipeFactory}.
   * ---------------------------------------- */
  const setSelector_recipe = function(tb, b, headerGetter, cfgCaller, extraBtnSetters, closeSelect, colAmt) {
    if(closeSelect == null) closeSelect = true;
    if(colAmt == null) colAmt = 4;

    let
      rcMdl = b.block.delegee.rcMdl,
      categHeaderObj = MDL_recipe._categHeaderObj(rcMdl),
      btnGrp = (function(btnGrp) {btnGrp.setMinCheckCount(0); btnGrp.setMaxCheckCount(1); return btnGrp})(new ButtonGroup());

    // Buttons
    if(extraBtnSetters == null) extraBtnSetters = [];
    extraBtnSetters.unshift(
      tb => tb.button("?", () => Vars.ui.content.show(b.block)).tooltip(fetchStat("lovec", "spec-info").localized(), true),
    );
    tb.table(Styles.none, tb1 => {
      tb.left();
      extraBtnSetters.forEachFast(setter => {
        setter(tb1).left().size(42.0);
      });
    }).left().row();

    const cont = new Table().background(Styles.black3).left();
    cont.margin(4.0);
    const contCell = tb.top().add(cont).left().growX();
    // Method and field sharing the same name, great
    Reflect.set(Cell, contCell, "minWidth", (200.0).toF());

    const rebuildCont = () => {
      btnGrp.clear();
      cont.clearChildren();

      for(let categ in categHeaderObj) {
        cont.add(MDL_recipe._categB(categ)).left().pad(4.0).row();

        let j = 0;
        let chunk = new Table();
        categHeaderObj[categ].forEachFast(rcHeader => {
          let ct = MDL_content._ct(MDL_recipe._iconNm(rcMdl, rcHeader), null, true);
          let icon = MDL_recipe._icon(rcMdl, rcHeader);
          let validGetter = MDL_recipe._finalValidGetter(rcMdl, rcHeader);
          let ttStr = MDL_recipe._ttStr(rcMdl, rcHeader, validGetter(b));

          let btn = chunk.button(Tex.whiteui, Styles.clearNoneTogglei, 40.0, () => {if(closeSelect) Vars.control.input.config.hideConfig()}).tooltip(ttStr, true).group(btnGrp).get();
          btn.changed(() => cfgCaller(rcHeader));
          btn.getStyle().imageUp = validGetter(b) ? icon : Icon.lock;
          btn.update(() => {
            btn.setChecked(headerGetter() == rcHeader);
            if(TIMER.secHalf) {
              btn.getStyle().imageUp = validGetter(b) ? icon : Icon.lock;
            };
          });

          j++;
          if((j - 1) % colAmt == colAmt - 1) {
            chunk.row();
            j = 0;
          };
        });

        cont.add(chunk).left().row();
      };
    };
    rebuildCont();
  };
  exports.setSelector_recipe = setSelector_recipe;
