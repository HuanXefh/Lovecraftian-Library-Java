/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- meta ----------> */


  /**
   * Parsed recipe data.
   * @class
   * @param {Block} blk
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {boolean|unset} [useAutoSelection]
   */
  const CLS_recipe = newClass().initClass();


  CLS_recipe.prototype.init = function(blk, rcMdl, rcHeader, useAutoSelection) {
    this.owner = blk;
    this.rcMdl = rcMdl;
    this.rcHeader = rcHeader;
    this.name = CLS_recipe.getName(this.owner, this.rcHeader);
    this.useAutoSelection = Boolean(useAutoSelection);

    this.initData();

    nameRcMap.put(this.name, this);
    if(!blkRcsMap.containsKey(this.owner)) {
      blkRcsMap.put(this.owner, []);
    };
    blkRcsMap.get(this.owner).push(this);
    if(!blkCategHeaderObjMap.containsKey(this.owner)) {
      blkCategHeaderObjMap.put(this.owner, MDL_recipe._categHeaderObj(this.rcMdl));
    };
  };


  const nameRcMap = new ObjectMap();
  const blkRcsMap = new ObjectMap();
  const blkCategHeaderObjMap = new ObjectMap();
  let rcCount = 0;


  MDL_event._c_onLoadDelay(VAR.delay.load.logRcRegis, () => {
    console.log("[LOVEC] Registered ${1} recipe(s) in total.".format(rcCount.color(Pal.accent)));
  });


/*
  ========================================
  Section: Definition (Static)
  ========================================
*/


  /**
   * Gets recipe by name.
   * @param {string} name
   * @return {CLS_recipe|null}
   */
  CLS_recipe.get = function(name) {
    return nameRcMap.get(name);
  };


  /**
   * Gets recipe by recipe header.
   * @param {Block} blk
   * @param {string} rcHeader
   * @return {CLS_recipe|null}
   */
  CLS_recipe.getByHeader = function(blk, rcHeader) {
    return CLS_recipe.get(CLS_recipe.getName(blk, rcHeader));
  };


  /**
   * Gets name for a recipe.
   * @param {Block} blk
   * @param {string} rcHeader
   * @return {string}
   */
  CLS_recipe.getName = function(blk, rcHeader) {
    return blk.name + " | " + rcHeader;
  };


  /**
   * Gets the name-recipe map.
   * @return {ObjectMap}
   */
  CLS_recipe.getNameRcMap = function() {
    return nameRcMap;
  };


  /**
   * Gets the block-names map.
   * @return {ObjectMap}
   */
  CLS_recipe.getBlkRcsMap = function() {
    return blkRcsMap;
  };


  /**
   * Gets the block-category-header-object map.
   * @return {ObjectMap}
   */
  CLS_recipe.getBlkCategHeaderObjMap = function() {
    return blkCategHeaderObjMap;
  };


  /**
   * Registers recipes in a multi-crafter block.
   * @param {Block} blk
   * @param {RecipeModule} rcMdl
   * @return {void}
   */
  CLS_recipe.register = function(blk, rcMdl) {
    let rc;
    MDL_event._c_onLoadPost(() => {
      MDL_recipe.initRc(blk.rcMdl, blk);
      MDL_recipe._rcHeaders(rcMdl).forEachFast(rcHeader => {
        rc = new CLS_recipe(blk, rcMdl, rcHeader, blk.delegee.useAutoSelection);
        rcCount++;
      });
    });
  };


/*
  ========================================
  Section: Definition (Instance)
  ========================================
*/


  /* <------------------------------ modification ------------------------------ */


  /**
   * Initialize recipe data.
   * @param {Block} blk
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {this}
   */
  CLS_recipe.prototype.initData = function() {
    this.isGen = MDL_recipe._isGen(this.rcMdl, this.rcHeader);

    this.rcIconName = MDL_recipe._iconName(this.rcMdl, this.rcHeader);
    this.categ = MDL_recipe._categ(this.rcMdl, this.rcHeader);
    this.lockedByCts = MDL_recipe._lockedBy(this.rcMdl, this.rcHeader, true);
    this.rcTimeScl = MDL_recipe._timeScl(this.rcMdl, this.rcHeader);
    this.pol = MDL_recipe._pol(this.rcMdl, this.rcHeader);
    this.ignoreItemFullness = MDL_recipe._ignoreItemFullness(this.rcMdl, this.rcHeader);
    this.erekirHeatReq = MDL_recipe._erekirHeatReq(this.rcMdl, this.rcHeader);
    this.erekirHeatProd = MDL_recipe._erekirHeatProd(this.rcMdl, this.rcHeader);

    let nameAttr = MDL_recipe._attr(this.rcMdl, this.rcHeader);
    this.attr = nameAttr == null ?
      null :
      Attribute.getOrNull(nameAttr);
    this.attrMin = MDL_recipe._attrMin(this.rcMdl, this.rcHeader) * Math.pow(this.owner.size, 2);
    this.attrMax = MDL_recipe._attrMax(this.rcMdl, this.rcHeader) * Math.pow(this.owner.size, 2);
    this.attrBoostScl = MDL_recipe._attrBoostScl(this.rcMdl, this.rcHeader);
    this.attrBoostCap = MDL_recipe._attrBoostCap(this.rcMdl, this.rcHeader);

    this.ci = MDL_recipe._ci(null, this.rcMdl, this.rcHeader);
    this.baseCi = MDL_recipe._ci(null, this.rcMdl, "");
    this.ciNoBase = MDL_recipe._ci(null, this.rcMdl, this.rcHeader, true);
    this.bi = MDL_recipe._bi(null, this.rcMdl, this.rcHeader);
    this.baseBi = MDL_recipe._bi(null, this.rcMdl, "");
    this.biNoBase = MDL_recipe._bi(null, this.rcMdl, this.rcHeader, true);
    this.aux = MDL_recipe._aux(null, this.rcMdl, this.rcHeader);
    this.baseAux = MDL_recipe._aux(null, this.rcMdl, "");
    this.auxNoBase = MDL_recipe._aux(null, this.rcMdl, this.rcHeader, true);
    this.reqOpt = MDL_recipe._reqOpt(this.rcMdl, this.rcHeader);
    this.opt = MDL_recipe._opt(null, this.rcMdl, this.rcHeader);
    this.baseOpt = MDL_recipe._opt(null, this.rcMdl, "");
    this.optNoBase = MDL_recipe._opt(null, this.rcMdl, this.rcHeader, true);
    this.payi = MDL_recipe._payi(null, this.rcMdl, this.rcHeader);
    this.basePayi = MDL_recipe._payi(null, this.rcMdl, "");
    this.payiNoBase = MDL_recipe._payi(null, this.rcMdl, this.rcHeader, true);
    this.co = MDL_recipe._co(null, this.rcMdl, this.rcHeader);
    this.baseCo = MDL_recipe._co(null, this.rcMdl, "");
    this.coNoBase = MDL_recipe._co(null, this.rcMdl, this.rcHeader, true);
    this.bo = MDL_recipe._bo(null, this.rcMdl, this.rcHeader);
    this.baseBo = MDL_recipe._bo(null, this.rcMdl, "");
    this.boNoBase = MDL_recipe._bo(null, this.rcMdl, this.rcHeader, true);
    this.failP = MDL_recipe._failP(this.rcMdl, this.rcHeader);
    this.fo = MDL_recipe._fo(null, this.rcMdl, this.rcHeader);
    this.baseFo = MDL_recipe._fo(null, this.rcMdl, "");
    this.foNoBase = MDL_recipe._fo(null, this.rcMdl, this.rcHeader, true);
    this.payo = MDL_recipe._payo(null, this.rcMdl, this.rcHeader);
    this.basePayo = MDL_recipe._payo(null, this.rcMdl, "");
    this.payoNoBase = MDL_recipe._payo(null, this.rcMdl, this.rcHeader, true);

    this.validTup = MDL_recipe._validTup(null, this.rcMdl, this.rcHeader);
    this.scrTup = MDL_recipe._scrTup(null, this.rcMdl, this.rcHeader);
    this.dumpTup = MDL_recipe._dumpTup(null, this.owner, this.rcMdl, this.rcHeader);
    this.failEff = MDL_recipe._failEff(this.rcMdl, this.rcHeader);
    this.rcDrawer = MDL_recipe._drawer(this.rcMdl, this.rcHeader);

    this.tempReq = MDL_recipe._tempReq(this.rcMdl, this.rcHeader);
    this.tempAllowed = MDL_recipe._tempAllowed(this.rcMdl, this.rcHeader);
    this.durabDecMtp = MDL_recipe._durabDecMtp(this.rcMdl, this.rcHeader);
    this.powProdMtp = MDL_recipe._powProdMtp(this.rcMdl, this.rcHeader);

    if(this.useAutoSelection) {
      this.keyItmHeaderMap = MDL_recipe._keyCtHeaderMap(null, this.rcMdl, RecipeKeyResourceModes.ITEM);
      this.keyFldHeaderMap = MDL_recipe._keyCtHeaderMap(null, this.rcMdl, RecipeKeyResourceModes.FLUID);
      this.keyPayHeaderMap = MDL_recipe._keyCtHeaderMap(null, this.rcMdl, RecipeKeyResourceModes.PAYLOAD);
    };

    this.hasBaseIo = false;
    MDL_recipe.IO_ORDER_MAP.each((name, ord) => {
      if(this.hasBaseIo) return;
      if(this["base" + name.firstUpperCase()].length > 0) this.hasBaseIo = true;
    });

    return this;
  };


  /* <------------------------------ display ------------------------------ */


  CLS_recipe.prototype.displayBase = function(tb, padLeft) {
    return tb.table(Tex.whiteui, tb1 => {
      tb1.left().setColor(Tmp.c1.set(Pal.accent).lerp(Color.black, 0.8));
      this.displayInput(tb1, true);
      tb1.table(Styles.none, tb2 => {}).left().width(48.0).growX().growY();
      this.displayOutput(tb1, true);
      tb1.table(Styles.none, tb2 => {}).left().width(48.0).growX().growY();
    })
    .left()
    .padLeft(tryVal(padLeft, 0.0))
    .growX()
    .row();
  };


  CLS_recipe.prototype.display = function(tb, order, showWinBtn) {
    return tb.table(Tex.whiteui, tb1 => {
      tb1.left().setColor(Pal.darkestGray);
      if(order >= 0) {
        this.displayOrder(tb1, order, showWinBtn);
      };
      tb1.table(Styles.none, tb2 => {}).left().width(36.0).growY();
      this.displayInput(tb1);
      tb1.table(Styles.none, tb2 => {}).left().width(48.0).growX().growY();
      this.displayOutput(tb1);
      this.displayStats(tb1);
    })
    .left()
    .growX()
    .row();
  };


  /**
   * Builds the container table for an I/O fragment.
   * @param {Table} tb
   * @param {string} name
   * @param {function(Table): void} tableF
   * @return {Cell}
   */
  CLS_recipe.prototype.displayIoFrag = function(tb, name, tableF) {
    return tb.table(Styles.none, tb1 => {
      tb1.left();
      MDL_table.__margin(tb1);
      // <TABLE>: Title
      tb1.add("${1}:".format(name.toUpperCase())).left().tooltip(MDL_bundle._term("lovec", name), true).row();
      // <TABLE>: I/O contents
      tb1.table(Styles.none, tableF);
    })
    .left()
    .marginRight(24.0);
  };


  /**
   * Builds the pane for alternative I/O fragment.
   * @param {Table} tb
   * @param {function(Table): void} tableF
   * @return {Cell}
   */
  CLS_recipe.prototype.displayAltIoFrag = function(tb, tableF) {
    return tb.table(Styles.none, tb1 => {
      tb1.left();
      let pn = tb1.pane(pnTb => {
        pnTb.setBackground(Tex.whiteui);
        pnTb.setColor(Pal.darkerGray);
        pnTb.left();
        tableF(pnTb);
      })
      .growX()
      .get();
      pn.setOverscroll(false, false);
      pn.setScrollBarPositions(true, false);
    })
    .marginRight(16.0)
    .maxHeight(82.0);
  };


  /**
   * Builds the recipe order fragment.
   * @param {Table} tb
   * @param {number} ord
   * @param {boolean|unset} [showWinBtn]
   * @return {Cell}
   */
  CLS_recipe.prototype.displayOrder = function(tb, ord, showWinBtn) {
    return tb.table(Styles.none, tb1 => {
      tb1.left();
      tb1.table(Styles.none, tb2 => {
        tb2.center();
        tb2.add("[" + Strings.fixed(ord, 0) + "]").color(Pal.accent).tooltip(this.rcHeader, true).row();
        if(showWinBtn) {
          MDL_table.__break(tb2, 1);
          tb2.button(VARGEN.icons.window, Styles.clearNonei, 28.0, () => {
            new CLS_window(
              "${1} (${2})".format(MDL_bundle._term("lovec", "recipe"), this.owner.localizedName + " [${1}]".format(ord)),
              tb3 => {
                if(this.hasBaseIo) {
                  this.displayBase(tb3, 28.0);
                  MDL_table.__break(tb3, 1);
                };
                this.display(tb3, -1, false);
              },
            ).add();
          })
          .tooltip(MDL_bundle._term("lovec", "new-window"), true);
        };
      }).width(72.0);
      MDL_table.__barV(tb1, Pal.accent);
    })
    .left()
    .growY();
  };


  /**
   * Builds the entire input fragment.
   * @param {Table} tb
   * @param {boolean|unset} [isBase]
   * @return {Cell}
   */
  CLS_recipe.prototype.displayInput = function(tb, isBase) {
    return tb.table(Styles.none, tb1 => {
      tb1.left();
      if((isBase ? this.baseBi : this.biNoBase).length > 0) this.displayBi(tb1, isBase);
      if((isBase ? this.baseCi : this.ciNoBase).length > 0) this.displayCi(tb1, isBase);
      if((isBase ? this.baseAux : this.auxNoBase).length > 0) this.displayAux(tb1, isBase);
      if((isBase ? this.baseOpt : this.optNoBase).length > 0) this.displayOpt(tb1, isBase);
      if((isBase ? this.basePayi : this.payiNoBase).length > 0) this.displayPayi(tb1, isBase);
      tb1.table(Styles.none, tb2 => {}).left().width(18.0).growX().growY();
    })
    .left()
    .growY();
  };


  /**
   * Builds the entire output fragment.
   * @param {Table} tb
   * @param {boolean|unset} [isBase]
   * @return {Cell}
   */
  CLS_recipe.prototype.displayOutput = function(tb, isBase) {
    return tb.table(Styles.none, tb1 => {
      tb1.left();
      if((isBase ? this.baseBo : this.boNoBase).length > 0) this.displayBo(tb1, isBase);
      if((isBase ? this.baseCo : this.coNoBase).length > 0) this.displayCo(tb1, isBase);
      if((isBase ? this.baseFo : this.foNoBase).length > 0) this.displayFo(tb1, isBase);
      if((isBase ? this.basePayo : this.payoNoBase).length > 0) this.displayPayo(tb1, isBase);
    })
    .left()
    .growY();
  };


  CLS_recipe.prototype.displayStats = function thisFun(tb) {
    return tb.table(Styles.none, tb1 => {
      MDL_table.__barV(tb1, Pal.accent);
      tb1.table(Styles.none, tb2 => {}).width(24.0);
      tb1.table(Styles.none, tb2 => {
        tb2.pane(pnTb => {
          pnTb.left();

          // <TABLE>: Stats
          thisFun.addStat(
            pnTb, this.isGen,
            MDL_bundle._term("lovec", "generated-recipe").color(Pal.gray),
          );
          thisFun.addStat(
            pnTb, !this.rcTimeScl.fEqual(1.0),
            MDL_bundle._term("lovec", "time-required"),
            Strings.fixed(this.rcTimeScl, 1) + "x (" + Strings.autoFixed(this.owner.craftTime * this.rcTimeScl / 60.0, 2) + "s)",
          );
          thisFun.addStat(
            pnTb, !this.pol.fEqual(0.0),
            fetchStat("lovec", "blk-pol").localized(),
            (this.pol > 0.0 ? "+" : "-") + Math.abs(this.pol),
            fetchStatUnit("lovec", "polunits").localized(),
          );
          thisFun.addStat(
            pnTb, this.erekirHeatReq > 0.0,
            fetchStat("lovec", "blk-erekirheatreq").localized(),
            this.erekirHeatReq,
            StatUnit.heatUnits.localized(),
          );
          thisFun.addStat(
            pnTb, this.erekirHeatProd > 0.0,
            fetchStat("lovec", "blk-erekirheatprod").localized(),
            this.erekirHeatProd,
            StatUnit.heatUnits.localized(),
          );
          thisFun.addStat(
            pnTb, this.reqOpt,
            MDL_bundle._term("lovec", "require-optional"),
            MDL_bundle._base("yes"),
          );
          thisFun.addStat(
            pnTb, this.failP > 0.0,
            MDL_bundle._term("lovec", "chance-to-fail"),
            this.failP.perc(1).color(this.failP > 0.25 ? Pal.remove : Pal.accent),
          );
          thisFun.addStat(
            pnTb, !this.powProdMtp.fEqual(1.0),
            fetchStat("lovec", "blk0pow-powmtp").localized(),
            this.powProdMtp.perc().color(this.powProdMtp < 1.0 ? Pal.remove : Pal.heal),
          );
          thisFun.addStat(
            pnTb, this.tempReq > 0.0,
            fetchStat("lovec", "blk0heat-tempreq").localized(),
            Strings.fixed(this.tempReq, 2),
            fetchStatUnit("lovec", "heatunits").localized(),
          );
          thisFun.addStat(
            pnTb, isFinite(this.tempAllowed),
            MDL_bundle._term("lovec", "temperature-allowed"),
            Strings.fixed(this.tempAllowed, 2),
            fetchStatUnit("lovec", "heatunits").localized(),
          );
          thisFun.addStat(
            pnTb, !this.durabDecMtp.fEqual(1.0),
            MDL_bundle._term("lovec", "abrasion-multiplier"),
            this.durabDecMtp.perc(),
          );
          if(this.lockedByCts.length > 0) {
            pnTb.table(Styles.none, tb3 => {
              tb3.left();
              tb3.add(MDL_text._statText(MDL_bundle._term("lovec", "require-unlocking"), "")).left();
              this.lockedByCts.forEachFast(ct => MDL_table.__ct(tb3, ct, 28.0, 0.0, null, VAR.dialog.ct2));
            })
            .left()
            .row();
          };
          if(this.attr != null) {
            pnTb.add(MDL_text._statText(fetchStat("lovec", "blk-attrreq").localized(), MDL_attr._attrB(attr))).left().tooltip(cons(tb => {
              tb.table(Styles.black6, tb1 => {
                MDL_table.__margin(tb1);
                MDL_table._d_attr(tb1, this.attr, null, this.attrBoostScl, 40.0, 5);
              });
            })).row();
          };
        })
        .height(100.0)
        .padTop(20.0).padBottom(20.0)
        .growX();
      })
      .left()
      .width(360.0)
      .growX();
      tb1.table(Styles.none, tb2 => {}).width(20.0);
    }).growY();
  }
  .setProp({
    addStat: newMultiFunction(
      function(tb, cond, str) {
        if(cond) tb.add(str).left().row();
      },
      function(tb, cond, titleStr, valStr) {
        if(cond) tb.add(MDL_text._statText(titleStr, valStr)).left().row();
      },
      function(tb, cond, titleStr, valStr, unitStr) {
        if(cond) tb.add(MDL_text._statText(titleStr, valStr, unitStr)).left().row();
      },
    ),
  });


  /**
   * Builds BI fragment.
   * @param {Table} tb
   * @param {boolean|unset} [isBase]
   * @return {Cell}
   */
  CLS_recipe.prototype.displayBi = function(tb, isBase) {
    return this.displayIoFrag(tb, "bi", tb1 => {
      (isBase ? this.baseBi : this.biNoBase).forEachRow(3, (tmp, amt, p) => {
        if(!(tmp instanceof Array)) {
          MDL_table.__rcCt(tb1, tmp, amt, p, true, null, VAR.dialog.ct1);
        } else {
          this.displayAltIoFrag(tb1, tb2 => {
            tmp.forEachRow(3, (tmp1, amt, p) => {
              MDL_table.__rcCt(tb2, tmp1, amt, p, true, null, VAR.dialog.ct1).row();
            });
          });
        };
      });
    });
  };


  /**
   * Builds CI fragment.
   * @param {Table} tb
   * @param {boolean|unset} [isBase]
   * @return {Cell}
   */
  CLS_recipe.prototype.displayCi = function(tb, isBase) {
    return this.displayIoFrag(tb, "ci", tb1 => {
      (isBase ? this.baseCi : this.ciNoBase).forEachRow(2, (tmp, amt) => {
        if(!(tmp instanceof Array)) {
          MDL_table.__rcCt(tb1, tmp, amt, null, false, null, VAR.dialog.ct1);
        } else {
          this.displayAltIoFrag(tb1, tb2 => {
            tmp.forEachRow(2, (tmp1, amt) => {
              MDL_table.__rcCt(tb2, tmp1, amt, null, false, null, VAR.dialog.ct1).row();
            });
          });
        };
      });
    });
  };


  /**
   * Builds AUX fragment.
   * @param {Table} tb
   * @param {boolean|unset} [isBase]
   * @return {Cell}
   */
  CLS_recipe.prototype.displayAux = function(tb, isBase) {
    return this.displayIoFrag(tb, "aux", tb1 => {
      (isBase ? this.baseAux : this.auxNoBase).forEachRow(2, (tmp, amt) => {
        MDL_table.__rcCt(tb1, tmp, amt, null, false, null, VAR.dialog.ct1);
      });
    });
  };


  /**
   * Builds OPT fragment.
   * @param {Table} tb
   * @param {boolean|unset} [isBase]
   * @return {Cell}
   */
  CLS_recipe.prototype.displayOpt = function(tb, isBase) {
    return this.displayIoFrag(tb, "opt", tb1 => {
      tb1.button("?", () => fetchDialog("rcObj").ex_show(MDL_bundle._term("lovec", "opt"), (isBase ? this.baseOpt : this.optNoBase))).size(34.0).pad(3.0);
    });
  };


  /**
   * Builds PAYI fragment.
   * @param {Table} tb
   * @param {boolean|unset} [isBase]
   * @return {Cell}
   */
  CLS_recipe.prototype.displayPayi = function(tb, isBase) {
    return this.displayIoFrag(tb, "payi", tb1 => {
      (isBase ? this.basePayi : this.payiNoBase).forEachRow(2, (name, amt) => {
        MDL_table.__rcCt(tb1, MDL_content._ct(name, null, true), amt, 1.0, true, null, VAR.dialog.ct1);
      });
    });
  };


  /**
   * Builds BO fragment.
   * @param {Table} tb
   * @param {boolean|unset} [isBase]
   * @return {Cell}
   */
  CLS_recipe.prototype.displayBo = function(tb, isBase) {
    return this.displayIoFrag(tb, "bo", tb1 => {
      (isBase ? this.baseBo : this.boNoBase).forEachRow(3, (tmp, amt, p) => {
        MDL_table.__rcCt(tb1, tmp, amt, p, true, null, VAR.dialog.ct1);
      });
    });
  };


  /**
   * Builds CO fragment.
   * @param {Table} tb
   * @param {boolean|unset} [isBase]
   * @return {Cell}
   */
  CLS_recipe.prototype.displayCo = function(tb, isBase) {
    return this.displayIoFrag(tb, "co", tb1 => {
      (isBase ? this.baseCo : this.coNoBase).forEachRow(2, (tmp, amt) => {
        MDL_table.__rcCt(tb1, tmp, amt, null, false, null, VAR.dialog.ct1);
      });
    });
  };


  /**
   * Builds FO fragment.
   * @param {Table} tb
   * @param {boolean|unset} [isBase]
   * @return {Cell}
   */
  CLS_recipe.prototype.displayFo = function(tb, isBase) {
    return this.displayIoFrag(tb, "fo", tb1 => {
      (isBase ? this.baseFo : this.foNoBase).forEachRow(3, (tmp, amt, p) => {
        MDL_table.__rcCt(tb1, tmp, amt, p, true, null, VAR.dialog.ct1);
      });
    });
  };


  /**
   * Builds PAYO fragment.
   * @param {Table} tb
   * @param {boolean|unset} [isBase]
   * @return {Cell}
   */
  CLS_recipe.prototype.displayPayo = function(tb, isBase) {
    return this.displayIoFrag(tb, "payo", tb1 => {
      (isBase ? this.basePayo : this.payoNoBase).forEachRow(2, (name, amt) => {
        MDL_table.__rcCt(tb1, MDL_content._ct(name, null, true), amt, 1.0, true, null, VAR.dialog.ct1);
      });
    });
  };


  /* <------------------------------ application ------------------------------ */


  /**
   * Changes recipe of a multi-crafter if its key content has changed.
   * @param {Building} b
   * @return {void}
   */
  CLS_recipe.prototype.updateAutoSelection = function thisFun(b) {
    if(!this.useAutoSelection || b.delegee.keyCt == null || b.delegee.lastKeyCt === b.delegee.keyCt) return;

    b.delegee.lastKeyCt = b.delegee.keyCt;
    thisFun.lastHeader = (
      b.delegee.keyCt instanceof Item ?
        this.keyItmHeaderMap :
        b.delegee.keyCt instanceof Liquid ?
          this.keyFldHeaderMap :
          this.keyPayHeaderMap
    ).get(b.delegee.keyCt);

    if(thisFun.lastHeader != null) {
      b.configure(thisFun.lastHeader);
    };
  }
  .setProp({
    lastHeader: "",
  });


  /**
   * Updates state of Erekir heat in a multi-crafter.
   * @param {Building} b
   * @return {void}
   */
  CLS_recipe.prototype.updateErekirHeat = function(b) {
    if(this.erekirHeatReq > 0.0) {
      b.delegee.erekirHeatI = b.calculateHeat(b.delegee.erekirSideHeats);
      b.delegee.erekirHeatEffc = Mathf.clamp(b.delegee.erekirHeatI / this.erekirHeatReq);
    };
    if(this.erekirHeatProd > 0.0) {
      b.delegee.erekirHeatO = Mathf.approachDelta(b.delegee.erekirHeatO, this.erekirHeatProd * b.efficiency, b.block.delegee.erekirHeatWarmupRate * b.delta());
    };
  };


  /**
   * Consumes and produces payload in a multi-crafter.
   * @param {Building} b
   * @return {void}
   */
  CLS_recipe.prototype.craftPay = function(b) {
    let i, iCap;
    if(b.delegee.hasPayInput) {
      i = 0;
      iCap = this.payi.iCap();
      while(i < iCap) {
        Object.mapIncre(b.delegee.payReqObj, this.payi[i], -this.payi[i + 1]);
        i += 2;
      };
    };
    if(b.delegee.hasPayOutput) {
      i = 0;
      iCap = this.payo.iCap();
      while(i < iCap) {
        Object.mapIncre(b.delegee.payStockObj, this.payo[i], this.payo[i + 1]);
        i += 2;
      };
    };
  };


  /**
   * Calculates attribute efficiency at given sum.
   * @param {number} attrSum
   * @return {number}
   */
  CLS_recipe.prototype.calcAttrEffc = function(attrSum) {
    return this.attr == null ?
      1.0 :
      Mathf.clamp(
        MATH_interp.lerp(
          0.0,
          1.0,
          attrSum + this.attr.env(),
          this.attrMin,
          this.attrMax,
        ) * this.attrBoostScl,
        0.0,
        this.attrBoostCap,
      );
  };




module.exports = CLS_recipe;
