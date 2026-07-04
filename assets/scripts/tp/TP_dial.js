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


  /* <------------------------------ auxiliary ------------------------------ */


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


  /* <------------------------------ base ------------------------------ */


  /**
   * Fallback when a dialog name is not found.
   */
  newDialog(
    "def",
    () => extend(BaseDialog, "ohno", {


      ex_show() {
        resetDial(this);

        // <TABLE>: text
        this.cont.add("You're not supposed to see this.");
        this.cont.row();
        this.cont.add("If you do, something just went wrong :(");
        this.cont.row();

        // <TABLE>: buttons
        MDL_table.__break(this.cont);
        MDL_table.__btnClose(this.buttons, this);

        this.show();
      },


    }),
  );


  /* <------------------------------ info ------------------------------ */


  /**
   * A dialog for {@link DBCT_infoContent}.
   */
  newDialog(
    "infoContent",
    () => extend(BaseDialog, "", {


      ex_show(nameMod, nameInfo) {
        resetDial(this, MDL_bundle._info(nameMod, "content-" + nameInfo));

        // <TABLE>: text
        this.cont.pane(pnTb => {
          MDL_table.__margin(pnTb);
          MDL_table.__wrapLine(pnTb, MDL_bundle._info(nameMod, "content-" + nameInfo, true), Align.left, 1);
        })
        .width(MDL_ui._uiW())
        .row();

        // <TABLE>: buttons
        MDL_table.__break(this.cont);
        MDL_table.__btnClose(this.buttons, this);

        this.show();
      },


    }),
  );


  /**
   * A dialog to show viewed texts in a dialog flow.
   */
  newDialog(
    "dialFlowLog",
    () => extend(BaseDialog, MDL_bundle._info("lovec", "dial-dial-flow-log"), {


      ex_show() {
        if(VARGEN.dialFlowTextLog.length === 0) {
          console.warn("[LOVEC] Cannot show log when no dialog flow is being played!");
          return;
        };
        resetDial(this);

        // <TABLE>: text
        this.cont.pane(pnTb => {
          MDL_table.__margin(pnTb);
          VARGEN.dialFlowTextLog.forEachFast(obj => {
            // <TABLE>: text cell
            pnTb.table(Styles.none, tb => {
              if(obj.chara === "SPEC: selection") {
                tb.center();
                MDL_table.__wrapLine(tb, "<${1}>".format(obj.text), Align.center, 1);
              } else {
                tb.left();
                if(!String.isEmpty(obj.chara)) {
                  tb.add(obj.chara).left().row();
                };
                tb.add("").row();
                MDL_table.__wrapLine(tb, obj.text, Align.left, 1, 48.0);
              };
            }).growX().row();
            MDL_table.__break(pnTb, 3);
          });
        })
        .width(MDL_ui._uiW())
        .row();

        // <TABLE>: buttons
        MDL_table.__break(this.cont);
        MDL_table.__btnClose(this.buttons, this);

        this.show();
      },


    }),
  );


  /**
   * A dialog for wave enemy display.
   */
  newDialog(
    "waveInfo",
    () => extend(BaseDialog, "", {


      tmpCount: 0,


      ex_show(countWave) {
        if(countWave == null) countWave = Vars.state.wave;
        this.tmpCount = countWave;
        resetDial(this, MDL_bundle._info("lovec", "dial-wave-enemies") + " (" + countWave + ")");

        // <TABLE>: list
        this.cont.pane(pnTb => {
          MDL_table.__margin(pnTb);
          if(countWave < 1) {
            MDL_table.__textNothing(pnTb);
          } else {
            let matArr = [[
              "",
              MDL_bundle._term("lovec", "unit"),
              MDL_bundle._term("lovec", "amount"),
              MDL_bundle._term("lovec", "total-health"),
              MDL_bundle._term("lovec", "shield"),
              MDL_bundle._term("lovec", "status"),
            ]];
            let amt_fi;
            MDL_entity._waveArr(countWave).forEachRow(4, (utp, amt, shield, sta) => {
              amt_fi = Math.round(amt / Vars.state.rules.unitCost(Vars.state.rules.waveTeam));
              if(amt_fi < 1) return;
              matArr.push([
                utp,
                utp.localizedName,
                amt_fi,
                (utp.health * amt_fi * Vars.state.rules.unitHealth(Vars.state.rules.waveTeam)).ui(),
                (shield * Vars.state.rules.unitHealth(Vars.state.rules.waveTeam)).ui(),
                sta === StatusEffects.none ? "-" : sta,
              ]);
            });
            matArr.length === 1 ?
              MDL_table.__textNothing(pnTb) :
              MDL_table._l_table(pnTb, matArr);
          };
        })
        .width(MDL_ui._uiW())
        .row();

        // <TABLE>: buttons
        MDL_table.__break(this.cont);
        MDL_table.__btnClose(this.buttons, this);
        MDL_table.__btn(this.buttons, MDL_bundle._term("lovec", "last-wave"), () => this.ex_show(Math.max(this.tmpCount - 1, 1)));
        MDL_table.__btn(this.buttons, MDL_bundle._term("lovec", "next-wave"), () => this.ex_show(this.tmpCount + 1));

        this.show();
      },


    }),
  );


  /**
   * A dialog to show a list of information. See {@link CLS_dragButtonInfoList}.
   */
  newDialog(
    "infoListMain",
    () => extend(BaseDialog, MDL_bundle._term("lovec", "info-list"), {


      ex_show(infoListData, moddedNames) {
        resetDial(this);

        // <TABLE>: list
        MDL_table.__break(this.cont);
        this.cont.pane(pnTb => {
          MDL_table.__margin(pnTb);

          infoListData.each((categ, map) => {
            MDL_table.__btn(
              pnTb,
              CLS_dragButtonInfoList.getLocalizedCategName(categ === "uncategorized" ? "global" : categ),
              () => fetchDialog("infoListSub").ex_show(categ, map, moddedNames),
              500.0,
            ).row();
          });
        })
        .width(MDL_ui._uiW() * 1.25)
        .row();

        // <TABLE>: buttons
        MDL_table.__break(this.cont);
        MDL_table.__btnClose(this.buttons, this);

        this.show();
      },


    }),
  );


  /**
   * A dialog to show a list of information. See {@link CLS_dragButtonInfoList}.
   */
  newDialog(
    "infoListSub",
    () => extend(BaseDialog, "", {


      hasAnyName: false,
      lastInfoString: "",


      ex_show(categ, map, moddedNames) {
        resetDial(this, CLS_dragButtonInfoList.getLocalizedCategName(categ === "uncategorized" ? "global" : categ));

        // <TABLE>: list
        MDL_table.__break(this.cont);
        this.cont.pane(pnTb => {
          MDL_table.__margin(pnTb);

          map.each((subCateg, subMap) => {
            this.hasAnyName = false;
            subMap.each((name, scr) => {
              if(this.hasAnyName) return;
              this.lastInfoString = CLS_dragButtonInfoList.getInfoString(name, categ, subCateg);
              this.hasAnyName = PARAM.MODDED || !moddedNames.includes(this.lastInfoString);
            });

            if(this.hasAnyName) {
              if(subCateg !== "uncategorized") {
                MDL_table.__break(pnTb);
                pnTb.add(CLS_dragButtonInfoList.getLocalizedCategName(subCateg)).color(Color.lightGray).row();
              };

              subMap.each((name, scr) => {
                this.lastInfoString = CLS_dragButtonInfoList.getInfoString(name, categ, subCateg);
                if(!PARAM.MODDED && moddedNames.includes(this.lastInfoString)) return;
                MDL_table.__btn(
                  pnTb,
                  CLS_dragButtonInfoList.getLocalizedInfoName(name),
                  scr,
                  500.0,
                ).row();
              });
            };
          });
        })
        .width(MDL_ui._uiW() * 1.25)
        .row();

        // <TABLE>: buttons
        MDL_table.__break(this.cont);
        MDL_table.__btnClose(this.buttons, this);

        this.show();
      },


    }),
  );


  /**
   * A dialog for achievements, see {@link CLS_achievement}.
   */
  newDialog(
    "achievement",
    () => extend(BaseDialog, MDL_bundle._term("lovec", "achievement"), {


      ex_buildBox(tb, achievement) {
        tb.table(Styles.none, tb1 => {
          MDL_table.__margin(tb1, 0.5);
          tb1.table(Tex.whiteui, tb2 => {
            tb2.center().setColor(achievement.isCompleted() ? Color.darkGray : Pal.darkestGray);
            tb2.imageDraw(() => achievement.getIcon()).width(64.0).height(64.0).color(!achievement.isCompleted() ? Color.darkGray : Color.white).tooltip(!achievement.isCompleted() && !global.lovecUtil.prop.debug ? "???" : achievement.getText(), true);
          })
          .width(72.0)
          .height(72.0);
        });
      },


      ex_show() {
        resetDial(this);

        // <TABLE>: list
        MDL_table.__break(this.cont);
        this.cont.pane(pnTb => {
          MDL_table.__margin(pnTb);
          if(VARGEN.achievements.length === 0) {
            MDL_table.__textNothing(pnTb);
          } else {
            let tmpObj = {};
            let i, iCap, j, colAmt = 10, nameMod;
            VARGEN.achievements.forEachFast(achievement => {
              nameMod = achievement.getMod().name;
              if(tmpObj[nameMod] === undefined) tmpObj[nameMod] = [];
              tmpObj[nameMod].push(achievement);
            });
            Object._it(tmpObj, (nameMod, arr) => {
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
        .width(MDL_ui._uiW() * 1.25)
        .row();

        // <TABLE>: buttons
        MDL_table.__break(this.cont);
        MDL_table.__btnClose(this.buttons, this);

        this.show();
      },


    }),
  );


  /* <------------------------------ content ------------------------------ */


  /**
   * A dialog that shows a list of contents.
   */
  newDialog(
    "cts",
    () => extend(BaseDialog, "", {


      ex_show(title, cts_gn, isAfterCt) {
        resetDial(this, title);

        // <TABLE>: content
        MDL_table.__break(this.cont);
        this.cont.pane(pnTb => {
          MDL_table.__margin(pnTb);
          let iCap = cts_gn.iCap();
          if(iCap === 0) {
            MDL_table.__textNothing(pnTb);
          } else {
            let colAmt = MDL_ui._colAmt(32.0, 4.0, 2);
            for(let i = 0, j = 0; i < iCap; i++) {
              MDL_table.__ct(pnTb, MDL_content._ct(cts_gn[i], null, true), null, null, !isAfterCt ? null : this);
              if(j % colAmt === colAmt - 1) pnTb.row();
              j++;
            };
          };
        })
        .width(MDL_ui._uiW())
        .row();

        // <TABLE>: buttons
        MDL_table.__break(this.cont);
        MDL_table.__btnClose(this.buttons, this);

        this.show();
      },


    }),
  );


  /**
   * A dialog for content display in rows.
   */
  newDialog(
    "ctsRow",
    () => extend(BaseDialog, "", {


      ex_show(title, cts_gn) {
        resetDial(this, title);

        // <TABLE>: content
        MDL_table.__break(this.cont);
        this.cont.pane(pnTb => {
          MDL_table._l_ctRow(pnTb, cts_gn, true);
        })
        .width(MDL_ui._uiW())
        .row();

        // <TABLE>: buttons
        MDL_table.__break(this.cont);
        MDL_table.__btnClose(this.buttons, this);

        this.show();
      },


    }),
  );


  /* <------------------------------ recipe ------------------------------ */


  /**
   * A dialog used for optional input display of multi-crafters.
   */
  newDialog(
    "rcOpt",
    () => extend(BaseDialog, "", {


      ex_show(title, opt) {
        resetDial(this, title);

        // <TABLE>: info
        MDL_table.__break(this.cont);
        MDL_table._d_note(this.cont, MDL_bundle._info("lovec", "opt"));

        // <TABLE>: bar
        MDL_table.__break(this.cont);
        MDL_table.__bar(this.cont, null, MDL_ui._uiW());

        // <TABLE>: content
        MDL_table.__break(this.cont);
        this.cont.pane(pnTb => {
          MDL_table.__margin(pnTb);
          let iCap = opt.iCap();
          if(iCap === 0) {
            MDL_table.__textNothing(pnTb);
          } else {
            let tmp, amt, p, mtp;
            for(let i = 0; i < iCap; i += 4) {
              tmp = opt[i];
              amt = opt[i + 1];
              p = opt[i + 2];
              mtp = opt[i + 3];
              pnTb.add("[" + Strings.fixed(i / 4.0 + 1.0, 0) + "]").center().color(Pal.accent).padRight(36.0);
              MDL_table.__rcCt(pnTb, tmp, amt, p, null, null, this).padRight(72.0);
              pnTb.add(MDL_text._statText(
                MDL_bundle._term("lovec", "efficiency-multiplier"),
                mtp.perc(0),
              )).center().padRight(6.0);
              pnTb.row();
            };
          };
        })
        .width(MDL_ui._uiW())
        .row();

        // <TABLE>: buttons
        MDL_table.__break(this.cont);
        MDL_table.__btnClose(this.buttons, this);

        this.show();
      },


    }),
  );


  newDialog(
    "rcDictDatabase",
    () => extend(BaseDialog, MDL_bundle._info("lovec", "dial-rcdict-database"), {


      w: 32.0,
      pad: 4.0,


      ex_buildCtBtn(tb, ct, isCustomField) {
        let icon = isCustomField ?
          MDL_recipeDict.rcDict.customFieldMap.get(ct).icon :
          new TextureRegionDrawable(ct.uiIcon);
        let btn = tb.button(icon, this.w, () => {
          this.hide();
          fetchDialog("rcDict").ex_show(isCustomField ? MDL_recipeDict._customFieldB(ct) : ct.localizedName, ct);
        })
        .left()
        .pad(this.pad)
        .tooltip(isCustomField ? MDL_recipeDict._customFieldB(ct) : ct.localizedName)
        .get();
        btn.margin(0.0);
        let btnStyle = btn.getStyle();
        btnStyle.up = Styles.none;
        btnStyle.down = Styles.none;
        btnStyle.over = Styles.flatOver;
      },


      ex_show() {
        resetDial(this);

        // <TABLE>: list
        MDL_table.__break(this.cont);
        this.cont.pane(pnTb => {
          MDL_table.__margin(pnTb);

          let i = 0, j = 0, colAmt = MDL_ui._colAmt(this.w, 0.0, 2), lastCt = null;
          pnTb.table(Tex.whiteui, tb => {
            tb.left().setColor(Pal.darkestGray);
            MDL_table.__margin(tb, 0.5);

            MDL_recipeDict.rcDict.customFieldMap.each((name, obj) => {
              this.ex_buildCtBtn(tb, name, true);

              if(j % colAmt === colAmt - 1) tb.row();
              i++;
              j++;
            });
            j = -1;
            tb.row();
            MDL_table.__break(tb);

            VARGEN.rcDictCts.forEachFast(ct => {
              if(lastCt != null && ct.getContentType() !== lastCt.getContentType()) {
                j = -1;
                tb.row();
                MDL_table.__break(tb);
              } else if(j % colAmt === colAmt - 1) {
                j = -1;
                tb.row();
              };

              this.ex_buildCtBtn(tb, ct, false);

              i++;
              j++;
              lastCt = ct;
            });
          });
        })
        .width(MDL_ui._uiW())
        .row();

        // <TABLE>: buttons
        MDL_table.__break(this.cont);
        MDL_table.__btnClose(this.buttons, this);

        this.show();
      },


    }),
  );


  /**
   * A dialog used for recipe dictionary display.
   */
  newDialog(
    "rcDict",
    () => extend(BaseDialog, "", {


      ex_getRateStr(rate, deciAmt, isStatic) {
        return typeof rate !== "number" ?
          "-" :
          isStatic ?
            String(rate) :
            rate > 0.0167 ?
              (rate.roundFixed(deciAmt) + "/s") :
              rate * 60.0 > 0.0167 ?
                ((rate * 60.0).roundFixed(deciAmt) + "/min") :
                rate * 3600.0 > 0.0167 ?
                  ((rate * 3600.0).roundFixed(deciAmt) + "/h") :
                  "~0.0/s";
      },


      ex_buildList(tb, ct, rcDictArr, isCustomField) {
        let i = 0, iCap = rcDictArr.iCap(), j = 0;
        let rcCont;
        while(i < iCap) {
          rcCont = tb.table(Styles.none, tb1 => tb1.left()).left().width(240.0).height(60.0).get();
          // <TABLE>: small icon
          rcCont.table(Styles.none, tb1 => {
            MDL_table.__ct(tb1, rcDictArr[i], 48.0, 8.0, this);
          });
          // <TABLE>: recipe text
          let data, craftTime, craftRate, btn;
          let isContinuous = isCustomField ?
            MDL_recipeDict.rcDict.customFieldMap.get(ct).isContinuous :
            ct instanceof Liquid;
          // `Boolean(any)` is required here, otherwise undefined will be treated as true in `ex_getRateStr`, WTF???
          let isStatic = isCustomField ?
            Boolean(MDL_recipeDict.rcDict.customFieldMap.get(ct).isStatic) :
            false;
          rcCont.table(Styles.none, tb1 => {
            data = rcDictArr[i + 2];
            craftTime = data.time != null ?
              data.time :
              MDL_content._craftTime(rcDictArr[i], data.icon === "lovec-icon-mining", isCustomField ? null : ct);
            craftRate = !isFinite(craftTime) && !isContinuous && !isStatic ?
              null :
              isContinuous ?
                (rcDictArr[i + 1] * 60.0) :
                isStatic ?
                  rcDictArr[i + 1] :
                  (rcDictArr[i + 1] / craftTime * 60.0);
            // <TABLE>: rate text
            tb1.add(MDL_text._statText(
              MDL_bundle._term("lovec", isStatic ? "amount" : "rate"),
              this.ex_getRateStr(craftRate, 2, isStatic),
            ))
            .left()
            .tooltip(this.ex_getRateStr(craftRate, 7, isStatic), true)
            .row();
            // <TABLE>: extra icon
            tb1.table(Styles.none, tb2 => {
              tb2.left();
              // <TABLE>: content icon
              if(data.ct != null) {
                let oct, isOtherCustomField = false;
                if(MDL_recipeDict.rcDict.customFieldMap.containsKey(data.ct)) {
                  isOtherCustomField = true;
                  oct = data.ct;
                } else {
                  oct = MDL_content._ct(data.ct, null, true);
                };
                if(oct != null) {
                  btn = tb2.button(Tex.whiteui, Styles.clearNoneTogglei, 28.0, () => {
                    this.hide();
                    isOtherCustomField ?
                      this.ex_show(MDL_recipeDict._customFieldB(oct), oct) :
                      Vars.ui.content.show(oct);
                  })
                  .left()
                  .tooltip(tryVal(data.ctText, isOtherCustomField ? MDL_recipeDict._customFieldB(oct) : oct.localizedName), true)
                  .get();
                  btn.getStyle().imageUp = (isOtherCustomField ? MDL_recipeDict.rcDict.customFieldMap.get(oct).icon : new TextureRegionDrawable(oct.uiIcon)).tint(tryVal(data.ctTint, Color.white));
                };
              };
              // <TABLE>: tag icon
              if(data.icon != null) {
                let iconCell = tb2.image(Core.atlas.find(data.icon)).left().width(26.0).height(26.0);
                if(data.iconCts != null) {
                  iconCell.tooltip(cons(ttTb => {
                    MDL_table._l_ctLi(ttTb, data.iconCts, 40.0, 4);
                  }));
                };
              };
              // <TABLE>: text icon
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


      ex_show(title, ct_gn) {
        resetDial(this, title);

        if(ct_gn == null) return;
        let ct, isCustomField = false;
        if(MDL_recipeDict.rcDict.customFieldMap.containsKey(ct_gn)) {
          isCustomField = true;
          ct = ct_gn;
        } else {
          ct = MDL_content._ct(ct_gn, null, true);
        };
        if(ct == null) return;
        let ctIcon = isCustomField ?
          MDL_recipeDict.rcDict.customFieldMap.get(ct).icon :
          new TextureRegionDrawable(ct.uiIcon);

        // <TABLE>: content
        MDL_table.__break(this.cont);
        this.cont.pane(pnTb => {
          MDL_table.__margin(pnTb);
          let cont = new Table();

          // <TABLE>: icon
          cont.button(ctIcon, 48.0, () => {
            this.hide();
            isCustomField ?
              this.ex_show(MDL_recipeDict._customFieldB(ct), ct) :
              Vars.ui.content.show(ct);
          }).left().row();
          pnTb.add(cont).growX();

          // <TABLE>: producer
          let prodArr = MDL_recipeDict._producers(ct, true);
          if(prodArr.length > 0) {
            // <TABLE>: producer title
            cont.table(Tex.whiteui, tb => {
              tb.center().setColor(Color.darkGray);
              MDL_table.__margin(tb, 0.5);
              tb.add(MDL_bundle._term("lovec", "produced-in")).pad(4.0);
            }).left().growX().row();
            // <TABLE>: producer list
            cont.table(Tex.whiteui, tb => {
              tb.left().setColor(Pal.darkestGray);
              MDL_table.__margin(tb);
              this.ex_buildList(tb, ct, prodArr, isCustomField);
            }).left().growX().row();
          };

          // <TABLE>: consumer
          let consArr = MDL_recipeDict._consumers(ct, true);
          if(consArr.length > 0) {
            // <TABLE>: consumer title
            cont.table(Tex.whiteui, tb => {
              tb.center().setColor(Color.darkGray);
              MDL_table.__margin(tb, 0.5);
              tb.add(MDL_bundle._term("lovec", "used-in")).pad(4.0);
            }).left().growX().row();
            // <TABLE>: consumer list
            cont.table(Tex.whiteui, tb => {
              tb.left().setColor(Pal.darkestGray);
              MDL_table.__margin(tb);
              this.ex_buildList(tb, ct, consArr, isCustomField);
            }).left().growX().row();
          };

          // <TABLE>: building
          if(ct instanceof Item) {
            let reqBlks = MDL_content._reqBlks(ct);
            if(reqBlks.length > 0) {
              // <TABLE>: building title
              cont.table(Tex.whiteui, tb => {
                tb.center().setColor(Color.darkGray);
                MDL_table.__margin(tb, 0.5);
                tb.add(MDL_bundle._term("lovec", "building")).pad(4.0);
              })
              .left()
              .growX()
              .row();
              // <TABLE>: building list
              cont.table(Tex.whiteui, tb => {
                tb.center().setColor(Pal.darkestGray);
                MDL_table._l_ctLi(tb, reqBlks, 48.0, null, this);
              })
              .left()
              .growX()
              .row();
            };
          };
        }).row();

        // <TABLE>: buttons
        MDL_table.__break(this.cont);
        MDL_table.__btnClose(this.buttons, this);
        MDL_table.__btn(this.buttons, MDL_bundle._term("lovec", "new-window"), () => {
          this.hide();
          new CLS_window(isCustomField ? MDL_recipeDict._customFieldB(ct) : ct.localizedName, tb => {
            tb.center();
            let tmpCt = ct;
            let tmpIsCustomField = isCustomField;
            tb.button(ctIcon, 48.0, () => {
              rcDict.ex_show(tmpIsCustomField ? MDL_recipeDict._customFieldB(tmpCt) : tmpCt.localizedName, tmpCt);
            }).center();
          }).add();
        });
        MDL_table.__btn(this.buttons, MDL_bundle._info("lovec", "dial-rcdict-database"), () => {
          this.hide();
          fetchDialog("rcDictDatabase").ex_show();
        });

        this.show();
      },


    }),
  );
