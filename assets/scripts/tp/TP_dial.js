/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Registers new dialogs.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const VARGEN = require("lovec/glb/GLB_varGen");


  const CLS_window = require("lovec/cls/ui/CLS_window");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_entity = require("lovec/mdl/MDL_entity");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_recipeDict = require("lovec/mdl/MDL_recipeDict");
  const MDL_table = require("lovec/mdl/MDL_table");
  const MDL_text = require("lovec/mdl/MDL_text");
  const MDL_ui = require("lovec/mdl/MDL_ui");


  /* <---------- auxiliary ----------> */


  const resetDial = function(dial, title) {
    dial.cont.clear();
    dial.buttons.clear();
    if(title != null) {
      dial.title.setText(title.color(Pal.accent));
      dial.title.getStyle().fontColor = Color.white;
    };
  };
  exports.resetDial = resetDial;


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Fallback when a dialog name is not found.
   * ---------------------------------------- */
  newDialog(
    "def",
    () => extend(BaseDialog, "ohno", {


      ex_show() {
        resetDial(this);

        // @TABLE: text
        this.cont.add("You're not supposed to see this.");
        this.cont.row();
        this.cont.add("If you do, something just went wrong :(");
        this.cont.row();

        // @TABLE: buttons
        MDL_table.__break(this.cont);
        MDL_table.__btnClose(this.buttons, this);

        this.show();
      },


    }),
  );


  /* <---------- info ----------> */


  newDialog(
    "infoContent",
    () => extend(BaseDialog, "", {


      ex_show(nmMod, nmInfo) {
        resetDial(this, MDL_bundle._info(nmMod, "content-" + nmInfo));

        // @TABLE: text
        this.cont.pane(pn => {
          MDL_table.__margin(pn);
          MDL_table.__wrapLine(pn, MDL_bundle._info(nmMod, "content-" + nmInfo, true), Align.left, 1);
        }).width(MDL_ui._uiW()).row();

        // @TABLE: buttons
        MDL_table.__break(this.cont);
        MDL_table.__btnClose(this.buttons, this);

        this.show();
      },


    }),
  );


  /* ----------------------------------------
   * NOTE:
   *
   * A dialog for wave enemy display.
   * ---------------------------------------- */
  newDialog(
    "waveInfo",
    () => extend(BaseDialog, "", {


      tmpCount: 0,


      ex_show(countWave) {
        resetDial(this);

        if(countWave == null) countWave = Vars.state.wave;

        // @TABLE: title
        this.title.setText((MDL_bundle._info("lovec", "dial-wave-enemies") + " (" + countWave + ")").color(Pal.accent));
        this.title.getStyle().fontColor = Color.white;
        this.tmpCount = countWave;

        // @TABLE: list
        this.cont.pane(pn => {
          MDL_table.__margin(pn);
          if(countWave < 1) {
            MDL_table.__textNothing(pn);
          } else {
            let matArr = [[
              "",
              MDL_bundle._term("lovec", "unit"),
              MDL_bundle._term("lovec", "amount"),
              MDL_bundle._term("lovec", "total-health"),
              MDL_bundle._term("lovec", "shield"),
              MDL_bundle._term("lovec", "status"),
            ]];
            MDL_entity._waveArr(countWave).forEachRow(4, (utp, amt, shield, sta) => {
              let amt_fi = Math.round(amt / Vars.state.rules.unitCost(Vars.state.rules.waveTeam));
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
              MDL_table.__textNothing(pn) :
              MDL_table.setTable_base(pn, matArr);
          };
        }).width(MDL_ui._uiW()).row();

        // @TABLE: buttons
        MDL_table.__break(this.cont);
        MDL_table.__btnClose(this.buttons, this);
        MDL_table.__btn(this.buttons, MDL_bundle._term("lovec", "last-wave"), () => this.ex_show(Math.max(this.tmpCount - 1, 1)));
        MDL_table.__btn(this.buttons, MDL_bundle._term("lovec", "next-wave"), () => this.ex_show(this.tmpCount + 1));

        this.show();
      },


    }),
  );


  /* ----------------------------------------
   * NOTE:
   *
   * A dialog for achievements, see {CLS_achievement}.
   * ---------------------------------------- */
  newDialog(
    "achievement",
    () => extend(BaseDialog, MDL_bundle._term("lovec", "achievement"), {


      ex_buildBox(tb, achievement) {
        tb.table(Styles.none, tb1 => {
          MDL_table.__margin(tb1, 0.5);
          tb1.table(Tex.whiteui, tb2 => {
            tb2.center().setColor(achievement.isCompleted() ? Color.darkGray : Pal.darkestGray);
            tb2.imageDraw(() => achievement.getIcon()).width(64.0).height(64.0).color(!achievement.isCompleted() ? Color.darkGray : Color.white).tooltip(!achievement.isCompleted() ? "???" : achievement.getText(), true);
          }).width(72.0).height(72.0);
        });
      },


      ex_show() {
        resetDial(this);
        const thisDial = this;

        // @TABLE: list
        this.cont.pane(pn => {
          MDL_table.__margin(pn);
          if(VARGEN.achievements.length === 0) {
            MDL_table.__textNothing(pn);
          } else {
            let tmpObj = {};
            let i, iCap, j, colAmt = 10;
            VARGEN.achievements.forEachFast(achievement => {
              let nmMod = achievement.getMod().name;
              if(tmpObj[nmMod] === undefined) tmpObj[nmMod] = [];
              tmpObj[nmMod].push(achievement);
            });
            Object._it(tmpObj, (nmMod, arr) => {
              pn.add(fetchMod(nmMod, true).meta.displayName).left().fontScale(1.1).color(Pal.accent).row();
              pn.table(Styles.none, tb => {
                i = 0, iCap = arr.iCap(), j = 0;
                while(i < iCap) {
                  (function(i) {
                    thisDial.ex_buildBox(tb, arr[i]);
                  })(i);
                  if(j % colAmt === colAmt - 1) tb.row();
                  j++;
                  i++;
                };
              }).left().row();
            });
          };
        }).width(MDL_ui._uiW() * 1.25).row();

        // @TABLE: buttons
        MDL_table.__break(this.cont);
        MDL_table.__btnClose(this.buttons, this);

        this.show();
      },


    }),
  );


  /* <---------- content ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * A dialog that shows a list of contents.
   * If the dialog is shown after content database dialog, better set {isAfterCt} to {true}.
   * ---------------------------------------- */
  newDialog(
    "cts",
    () => extend(BaseDialog, "", {


      ex_show(title, cts_gn, isAfterCt) {
        resetDial(this, title);
        const thisDial = this;

        // @TABLE: content
        MDL_table.__break(this.cont);
        this.cont.pane(pn => {
          MDL_table.__margin(pn);
          let iCap = cts_gn.iCap();
          if(iCap === 0) {
            MDL_table.__textNothing(pn);
          } else {
            let colAmt = MDL_ui._colAmt(32.0, 4.0, 2);
            for(let i = 0, j = 0; i < iCap; i++) {
              (function(i) {
                MDL_table.__ct(pn, MDL_content._ct(cts_gn[i], null, true), null, null, !isAfterCt ? null : thisDial);
              })(i);
              if(j % colAmt === colAmt - 1) pn.row();
              j++;
            };
          };
        }).width(MDL_ui._uiW()).row();

        // @TABLE: buttons
        MDL_table.__break(this.cont);
        MDL_table.__btnClose(this.buttons, this);

        this.show();
      },


    }),
  );


  /* ----------------------------------------
   * NOTE:
   *
   * A dialog for content display in rows.
   * ---------------------------------------- */
  newDialog(
    "ctsRow",
    () => extend(BaseDialog, "", {


      ex_show(title, cts_gn) {
        resetDial(this, title);

        // @TABLE: content
        MDL_table.__break(this.cont);
        this.cont.pane(pn => {
          MDL_table.setDisplay_ctRow(pn, cts_gn, true);
        }).width(MDL_ui._uiW()).row();

        // @TABLE: buttons
        MDL_table.__break(this.cont);
        MDL_table.__btnClose(this.buttons, this);

        this.show();
      },


    }),
  );


  /* <---------- recipe ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Dialog used for optional input display of multi-crafters.
   * ---------------------------------------- */
  newDialog(
    "rcOpt",
    () => extend(BaseDialog, "", {


      ex_show(title, opt) {
        resetDial(this, title);

        // @TABLE: info
        MDL_table.__break(this.cont);
        MDL_table.setDisplay_note(this.cont, MDL_bundle._info("lovec", "opt"));

        // @TABLE: bar
        MDL_table.__break(this.cont);
        MDL_table.__bar(this.cont, null, MDL_ui._uiW());

        // @TABLE: content
        MDL_table.__break(this.cont);
        this.cont.pane(pn => {
          MDL_table.__margin(pn);
          let iCap = opt.iCap();
          if(iCap === 0) {
            MDL_table.__textNothing(pn);
          } else {
            for(let i = 0; i < iCap; i += 4) {
              let tmp = opt[i];
              let amt = opt[i + 1];
              let p = opt[i + 2];
              let mtp = opt[i + 3];
              pn.add("[" + Strings.fixed(i / 4.0 + 1.0, 0) + "]").center().color(Pal.accent).padRight(36.0);
              MDL_table.__rcCt(pn, tmp, amt, p, null, null, this).padRight(72.0);
              pn.add(MDL_text._statText(
                MDL_bundle._term("lovec", "efficiency-multiplier"),
                mtp.perc(0),
              )).center().padRight(6.0);
              pn.row();
            };
          };
        }).width(MDL_ui._uiW()).row();

        // @TABLE: buttons
        MDL_table.__break(this.cont);
        MDL_table.__btnClose(this.buttons, this);

        this.show();
      },


    }),
  );


  /* ----------------------------------------
   * NOTE:
   *
   * Dialog used for recipe dictionary display.
   * ---------------------------------------- */
  newDialog(
    "rcDict",
    () => extend(BaseDialog, "", {


      ex_buildList(tb, ct, rcDictArr) {
        let i = 0, iCap = rcDictArr.iCap(), j = 0;
        while(i < iCap) {
          let rcCont = tb.table(Styles.none, tb1 => tb1.left()).left().width(240.0).height(60.0).get();
          // @TABLE: small icon
          rcCont.table(Styles.none, tb1 => {
            MDL_table.__ct(tb1, rcDictArr[i], 48.0, 8.0, this);
          });
          // @TABLE: recipe text
          rcCont.table(Styles.none, tb1 => {
            let data = rcDictArr[i + 2];
            let craftTime = data.time != null ? data.time : MDL_content._craftTime(rcDictArr[i], data.icon === "lovec-icon-mining", ct);
            let craftRate = (!isFinite(craftTime) && !(ct instanceof Liquid)) ? null : (!(ct instanceof Liquid) ? (rcDictArr[i + 1] / craftTime * 60.0) : (rcDictArr[i + 1] * 60.0));
            // @TABLE: rate text
            tb1.add(MDL_text._statText(
              MDL_bundle._term("lovec", "rate"),
              craftRate == null ? "-" : ((craftRate < 0.01 ? "<0.01" : craftRate.roundFixed(2)) + "/s"),
            ))
            .left()
            .tooltip(typeof craftRate !== "number" ? "-" : (craftRate.roundFixed(7) + "/s"), true)
            .row();
            // @TABLE: extra icon
            tb1.table(Styles.none, tb2 => {
              tb2.left();
              // @TABLE: content icon
              let oct = MDL_content._ct(data.ct, null, true);
              if(oct != null) {
                let btn = tb2.button(Tex.whiteui, Styles.clearNoneTogglei, 28.0, () => {
                  this.hide();
                  Vars.ui.content.show(oct);
                }).left().get();
                btn.getStyle().imageUp = new TextureRegionDrawable(oct.uiIcon);
              };
              // @TABLE: tag icon
              if(data.icon != null) {
                tb2.image(Core.atlas.find(data.icon)).left().width(26.0).height(26.0);
              };
            }).left().height(30.0).row();
          });
          i += 3;
          if(j % 3 === 2) tb.row();
          j++;
        };
      },


      ex_show(title, ct_gn) {
        resetDial(this, title);
        let ct = MDL_content._ct(ct_gn, null, true);
        if(ct == null) return;

        // @TABLE: content
        MDL_table.__break(this.cont);
        this.cont.pane(pn => {
          MDL_table.__margin(pn);
          let cont = new Table();

          // @TABLE: icon
          cont.button(new TextureRegionDrawable(ct.uiIcon), 48.0, () => {
            this.hide();
            Vars.ui.content.show(ct);
          }).left().row();
          pn.add(cont).growX();

          // @TABLE: producer
          let prodArr = MDL_recipeDict._producers(ct, true);
          if(prodArr.length > 0) {
            // @TABLE: consumer title
            cont.table(Tex.whiteui, tb => {
              tb.center().setColor(Color.darkGray);
              MDL_table.__margin(tb, 0.5);
              tb.add(MDL_bundle._term("lovec", "produced-in")).pad(4.0);
            }).left().growX().row();
            // @TABLE: consumer list
            cont.table(Tex.whiteui, tb => {
              tb.left().setColor(Pal.darkestGray);
              MDL_table.__margin(tb);
              this.ex_buildList(tb, ct, prodArr);
            }).left().growX().row();
          };

          // @TABLE: consumer
          let consArr = MDL_recipeDict._consumers(ct, true);
          if(consArr.length > 0) {
            // @TABLE: consumer title
            cont.table(Tex.whiteui, tb => {
              tb.center().setColor(Color.darkGray);
              MDL_table.__margin(tb, 0.5);
              tb.add(MDL_bundle._term("lovec", "used-in")).pad(4.0);
            }).left().growX().row();
            // @TABLE: consumer list
            cont.table(Tex.whiteui, tb => {
              tb.left().setColor(Pal.darkestGray);
              MDL_table.__margin(tb);
              this.ex_buildList(tb, ct, consArr);
            }).left().growX().row();
          };

          // @TABLE: building
          if(ct instanceof Item) {
            let reqBlks = MDL_content._reqBlks(ct);
            if(reqBlks.length > 0) {
              // @TABLE: building title
              cont.table(Tex.whiteui, tb => {
                tb.center().setColor(Color.darkGray);
                MDL_table.__margin(tb, 0.5);
                tb.add(MDL_bundle._term("lovec", "building")).pad(4.0);
              }).left().growX().row();
              // @TABLE: building list
              cont.table(Tex.whiteui, tb => {
                tb.center().setColor(Pal.darkestGray);
                MDL_table.setDisplay_ctLi(tb, reqBlks, 48.0, null, this);
              }).left().growX().row();
            };
          };
        }).row();

        // @TABLE: buttons
        MDL_table.__break(this.cont);
        MDL_table.__btnClose(this.buttons, this);
        MDL_table.__btn(this.buttons, MDL_bundle._term("lovec", "new-window"), () => {
          this.hide();
          new CLS_window(ct.localizedName, tb => {
            tb.center();
            let tmpCt = ct;
            tb.button(new TextureRegionDrawable(tmpCt.uiIcon), 48.0, () => {
              rcDict.ex_show(tmpCt.localizedName, tmpCt);
            }).center();
          }).add();
        });

        this.show();
      },


    }),
  );
