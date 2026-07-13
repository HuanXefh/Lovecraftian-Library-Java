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

    this.hasInit = false;
    this.initData();
    this.__isEmptyRc__ = false;
    this.inputRsBoolMap = new ObjectMap();
    this.outputRsBoolMap = new ObjectMap();

    if(this.rcHeader === "SPEC: empty") {
      this.__isEmptyRc__ = true;
      blkEmptyRcMap.put(this.owner, this);
    } else {
      if(nameRcMap.containsKey(this.name)) {
        console.warn("[LOVEC] Recipe name ${1} already used!".format(this.name.color(Pal.accent)));
      };
      nameRcMap.put(this.name, this);
      if(!blkRcsMap.containsKey(this.owner)) {
        blkRcsMap.put(this.owner, []);
      };
      blkRcsMap.get(this.owner).push(this);
    };

    if(!blkCategHeaderObjMap.containsKey(this.owner)) {
      blkCategHeaderObjMap.put(this.owner, MDL_recipe._categHeaderObj(this.rcMdl));
    };
  };


  const nameRcMap = new ObjectMap();
  const blkRcsMap = new ObjectMap();
  const blkEmptyRcMap = new ObjectMap();
  const blkCategHeaderObjMap = new ObjectMap();
  const incompleteRcs = [];
  const nodeLockedRcs = [];
  const nodeRcsMap = new ObjectMap();
  let rcCount = 0;
  let rcIncompleteCount = 0;


  MDL_event._c_onLoadDelayTask(VAR.delay.load.logRcRegis, () => {
    console.log("[LOVEC] Registered ${1} recipe(s) in total.".format(rcCount.color(Pal.accent)));
    if(rcIncompleteCount > 0) {
      console.log("[LOVEC] ${1} recipe(s) are incomplete!".format(rcIncompleteCount.color(Pal.accent)));
    };

    let str = new Date().toLocaleDateString();
    incompleteRcs.forEachFast(rc => {
      str += "\n\n\n";
      str += rc.name;
      str += "\n";
      rc.erroredNames.forEachFast(name => {
        str += "\n- " + name;
      });
    });
    MDL_file.commonCache.child("temp").child("incompleteRecipes.log").writeString(str);
  });


/*
  ========================================
  Section: Definition (Static)
  ========================================
*/


  /* <------------------------------ property ------------------------------ */

  /**
   * Gets recipe by recipe header.
   * @param {Block} blk
   * @param {string} rcHeader
   * @return {CLS_recipe}
   */
  CLS_recipe.get = function(blk, rcHeader) {
    if(rcHeader === "SPEC: empty" || !MDL_recipe._hasHeader(blk.delegee.rcMdl, rcHeader)) {
      return CLS_recipe.getEmptyRc(blk);
    };
    let rc = nameRcMap.get(CLS_recipe.getName(blk, rcHeader));
    if(rc == null) throw new Error("Cannot find recipe with header ${1} in ${2}!".format(rcHeader, blk.name));
    return rc;
  };


  /**
   * Gets empty recipe for some block.
   * @param {Block} blk
   * @return {CLS_recipe}
   */
  CLS_recipe.getEmptyRc = function(blk) {
    let rc = blkEmptyRcMap.get(blk);
    if(rc == null) throw new Error("No empty recipe found for ${1}, it may be unregistered!".format(blk.name));
    return rc;
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
   * Gets all incomplete recipes.
   * @return {Array<CLS_recipe>}
   */
  CLS_recipe.getIncompleteRcs = function() {
    return incompleteRcs;
  };


  /**
   * Gets all recipes locked by tech nodes. See {@link DBCT_techNodeContent}.
   * @return {Array<CLS_recipe>}
   */
  CLS_recipe.getNodeLockedRcs = function() {
    return nodeLockedRcs;
  };


  /**
   * Gets the tech node-recipes map.
   * @return {ObjectMap}
   */
  CLS_recipe.getNodeRcsMap = function() {
    return nodeRcsMap;
  };


  /* <------------------------------ condition ------------------------------ */


  /**
   * Whether some resource is an input material in given recipe.
   * @param {CLS_recipe} rc
   * @param {ResourceGn} rs_gn
   * @return {boolean}
   */
  CLS_recipe.checkInput = function(rc, rs_gn) {
    let rs = MDL_content._ct(rs_gn, "rs");
    if(rs == null) return false;

    let
      i,
      iCap,
      j,
      jCap,
      tmp,
      tmp1;

    // CI
    i = 0;
    iCap = rc.ci.iCap();
    while(i < iCap) {
      tmp = rc.ci[i];
      if(tmp === rs) {
        return true;
      } else if(tmp instanceof Array) {
        j = 0;
        jCap = tmp.iCap();
        while(j < jCap) {
          tmp1 = tmp[j];
          if(tmp1 === rs) return true;
          j += 2;
        };
      };
      i += 2;
    };

    // BI
    i = 0;
    iCap = rc.bi.iCap();
    while(i < iCap) {
      tmp = rc.bi[i];
      if(tmp === rs) {
        return true;
      } else if(tmp instanceof Array) {
        j = 0;
        jCap = tmp.iCap();
        while(j < jCap) {
          tmp1 = tmp[j];
          if(tmp1 === rs) return true;
          j += 3;
        };
      };
      i += 3;
    };

    // AUX
    i = 0;
    iCap = rc.aux.iCap();
    while(i < iCap) {
      tmp = rc.aux[i];
      if(tmp === rs) return true;
      i += 2;
    };

    // OPT
    i = 0;
    iCap = rc.opt.iCap();
    while(i < iCap) {
      tmp = rc.opt[i];
      if(tmp === rs) return true;
      i += 4;
    };

    return false;
  };


  /**
   * Whether some resource is an output material in given recipe.
   * @param {CLS_recipe} rc
   * @param {ResourceGn} rs_gn
   * @return {boolean}
   */
  CLS_recipe.checkOutput = function(rc, rs_gn) {
    let rs = MDL_content._ct(rs_gn, "rs");
    if(rs == null) return false;

    let
      i,
      iCap,
      tmp;

    // CO
    i = 0;
    iCap = rc.co.iCap();
    while(i < iCap) {
      tmp = rc.co[i];
      if(tmp === rs) return true;
      i += 2;
    };

    // BO
    i = 0;
    iCap = rc.bo.iCap();
    while(i < iCap) {
      tmp = rc.bo[i];
      if(tmp === rs) return true;
      i += 3;
    };

    // FO
    i = 0;
    iCap = rc.fo.iCap();
    while(i < iCap) {
      tmp = rc.fo[i];
      if(tmp === rs) return true;
      i += 3;
    };

    return false;
  };


  /**
   * Whether given recipe has any payload input.
   * @param {CLS_recipe} rc
   * @return {boolean}
   */
  CLS_recipe.checkAnyPayInput = function(rc) {
    return rc.payi.length > 0;
  };


  /**
   * Whether given recipe has any item output.
   * @param {CLS_recipe} rc
   * @return {boolean}
   */
  CLS_recipe.checkAnyItmOutput = function(rc) {
    let
      i,
      iCap;

    // FO
    if(rc.fo.length > 0) return true;

    // BO
    i = 0;
    iCap = rc.bo.iCap();
    while(i < iCap) {
      if(rc.bo[i] instanceof Item && rc.bo[i + 1] > 0) return true;
      i += 3;
    };

    return false;
  };


  /**
   * Whether given recipe has any liquid output.
   * @param {CLS_recipe} rc
   * @param {boolean|unset} [includeAux]
   * @return {boolean}
   */
  CLS_recipe.checkAnyFldOutput = function(rc, includeAux) {
    let
      i,
      iCap,
      tmp;

    // CO
    i = 0;
    iCap = rc.co.iCap();
    while(i < iCap) {
      tmp = rc.co[i];
      if(!MDL_cond._isAuxiliaryFluid(tmp)) {
        if(rc.co[i + 1] > 0.0) return true;
      } else {
        if(includeAux && rc.co[i + 1] > 0.0) return true;
      };
      i += 2;
    };

    // BO
    i = 0;
    iCap = rc.bo.iCap();
    while(i < iCap) {
      tmp = rc.bo[i];
      if(tmp instanceof Liquid) {
        if(!MDL_cond._isAuxiliaryFluid(tmp)) {
          if(rc.bo[i + 1] > 0.0) return true;
        } else {
          if(includeAux && rc.bo[i + 1] > 0.0) return true;
        };
      };
      i += 3;
    };

    return false;
  };



  /**
   * Whether given recipe has any payload output.
   * @param {CLS_recipe} rc
   * @return {boolean}
   */
  CLS_recipe.checkAnyPayOutput = function(rc) {
    return rc.payo.length > 0;
  };


  /* <------------------------------ util ------------------------------ */


  /**
   * Gets all fluids found in inputs.
   * @param {Array|unset} contArr
   * @param {CLS_recipe} rc
   * @return {Array<Liquid>}
   */
  CLS_recipe.getInputFlds = function(contArr, rc) {
    let arr = contArr != null ? contArr.clear() : [];
    let
      i,
      iCap,
      j,
      jCap,
      tmp,
      tmp1;

    // CI
    i = 0;
    iCap = rc.ci.iCap();
    while(i < iCap) {
      tmp = rc.ci[i];
      if(!(tmp instanceof Array)) {
        if(rc.ci[i + 1] > 0.0) arr.pushUnique(tmp);
      } else {
        j = 0;
        jCap = tmp.iCap();
        while(j < jCap) {
          if(tmp[j + 1] > 0.0) arr.pushUnique(tmp[j]);
          j += 2;
        };
      };
      i += 2;
    };

    // BI
    i = 0;
    iCap = rc.bi.iCap();
    while(i < iCap) {
      tmp = rc.bi[i];
      if(!(tmp instanceof Array)) {
        if(tmp instanceof Liquid && rc.bi[i + 1] > 0.0) arr.pushUnique(tmp);
      } else {
        j = 0;
        jCap = tmp.iCap();
        while(j < jCap) {
          tmp1 = tmp[j];
          if(tmp1 instanceof Liquid && tmp[j + 1] > 0.0) arr.pushUnique(tmp1);
          j += 3;
        };
      };
      i += 3;
    };

    // AUX
    i = 0;
    iCap = rc.aux.iCap();
    while(i < iCap) {
      if(rc.aux[i + 1] > 0.0) arr.pushUnique(rc.aux[i]);
      i += 2;
    };

    return arr;
  };


  /**
   * Gets all fluids found in outputs.
   * @param {Array|unset} contArr
   * @param {CLS_recipe} rc
   * @return {Array<Liquid>}
   */
  CLS_recipe.getOutputFlds = function(contArr, rc) {
    let arr = contArr != null ? contArr.clear() : [];
    let
      i,
      iCap,
      tmp;

    // CO
    i = 0;
    iCap = rc.co.iCap();
    while(i < iCap) {
      if(rc.co[i + 1] > 0.0) arr.pushUnique(rc.co[i]);
      i += 2;
    };

    // BO
    i = 0;
    iCap = rc.bo.iCap();
    while(i < iCap) {
      tmp = rc.bo[i];
      if(tmp instanceof Liquid && rc.bo[i + 1] > 0.0) arr.pushUnique(tmp);
      i += 3;
    };

    return arr;
  };


  /**
   * Gets a 2-tuple of items and fluids to dump.
   * CO not included due to `liquidOutputDirections`.
   * @param {Array|unset} contTup
   * @param {CLS_recipe} rc
   * @return {[Array<Item>, Array<Liquid>]}
   */
  CLS_recipe.getDumpTup = function(contTup, rc) {
    let tup = contTup != null ? contTup : [[], []];
    tup[0].clear();
    tup[1].clear();

    let
      i,
      iCap,
      tmp;

    // BO
    i = 0;
    iCap = rc.bo.iCap();
    while(i < iCap) {
      tmp = rc.bo[i];
      if(rc.owner.hasItems && tmp instanceof Item) tup[0].pushUnique(tmp);
      if(rc.owner.hasLiquids && tmp instanceof Liquid) tup[1].pushUnique(tmp);
      i += 3;
    };

    // FO
    if(rc.owner.hasItems) {
      i = 0;
      iCap = rc.fo.iCap();
      while(i < iCap) {
        tup[0].pushUnique(rc.fo[i]);
        i += 3;
      };
    };

    return tup;
  };


  /**
   * Registers recipes in a multi-crafter block.
   * @param {Block} blk
   * @param {RecipeModule} rcMdl
   * @return {void}
   */
  CLS_recipe.register = function(blk, rcMdl) {
    MDL_event._c_onLoadPost(() => {
      MDL_recipe.initRc(blk.rcMdl, blk);
      new CLS_recipe(blk, rcMdl, "SPEC: empty");
      MDL_recipe._rcHeaders(rcMdl).forEachFast(rcHeader => {
        new CLS_recipe(blk, rcMdl, rcHeader, blk.delegee.useAutoSelection);
        rcCount++;
      });
    });
  };


/*
  ========================================
  Section: Definition (Instance)
  ========================================
*/


  /* <------------------------------ condition ------------------------------ */


  /**
   * Variant of {@link CLS_recipe.checkInput} for instances, faster.
   */
  CLS_recipe.prototype.checkInput = function(rs_gn) {
    let bool = this.inputRsBoolMap.get(rs_gn);
    if(bool != null) return bool;

    bool = CLS_recipe.checkInput(this, rs_gn);
    this.inputRsBoolMap.put(rs_gn, bool);

    return bool;
  };


  /**
   * Variant of {@link CLS_recipe.checkOutput} for instances, faster.
   */
  CLS_recipe.prototype.checkOutput = function(rs_gn) {
    let bool = this.outputRsBoolMap.get(rs_gn);
    if(bool != null) return bool;

    bool = CLS_recipe.checkOutput(this, rs_gn);
    this.outputRsBoolMap.put(rs_gn, bool);

    return bool;
  };


  /* <------------------------------ modification ------------------------------ */


  /**
   * Initialize recipe data.
   * @return {this}
   */
  CLS_recipe.prototype.initData = function() {
    if(this.hasInit) throw new Error("Double initialization!");
    this.hasInit = true;

    this.isGen = MDL_recipe._isGen(this.rcMdl, this.rcHeader);
    this.isIncomplete = MDL_recipe._isIncomplete(this.rcMdl, this.rcHeader);
    this.erroredNames = MDL_recipe._rcVal(this.rcMdl, this.rcHeader, "erroredNames", Array.air);
    this.tt = MDL_recipe._tt(this.rcMdl, this.rcHeader);

    this.icon = null;
    this.altIcon = null;
    if(!Vars.headless) {
      // This have to be delayed, WTF
      Time.runTask(70.0, () => {
        this.icon = MDL_recipe._icon(this.rcMdl, this.rcHeader);
        this.altIcon = new StackDrawable(
          [new TextureRegionDrawable(this.owner.uiIcon), MDL_recipe._icon(this.rcMdl, this.rcHeader)].toSeq(),
          [new Vec2(0.0, 0.0), new Vec2(12.0, 12.0)].toSeq(),
          [0.8, 0.5],
        );
      });
    };

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

    this.inputFlds = CLS_recipe.getInputFlds(null, this);
    this.outputFlds = CLS_recipe.getOutputFlds(null, this);
    this.hasAnyItmOutput = CLS_recipe.checkAnyItmOutput(this);
    this.hasAnyFldOutput = CLS_recipe.checkAnyFldOutput(this, false);
    this.hasAnyFldOutputIncludeAux = CLS_recipe.checkAnyFldOutput(this, true);
    this.hasPayInput = CLS_recipe.checkAnyPayInput(this);
    this.hasPayOutput = CLS_recipe.checkAnyPayOutput(this);
    this.dumpTup = CLS_recipe.getDumpTup(null, this);

    this.hasBaseIo = false;
    MDL_recipe.IO_ORDER_MAP.each((name, ord) => {
      if(this.hasBaseIo) return;
      if(this["base" + name.firstUpperCase()].length > 0) this.hasBaseIo = true;
    });

    if(this.isIncomplete) {
      incompleteRcs.push(this);
      rcIncompleteCount++;
    };

    this.techNodes = [];
    this.lockedByCts.forEachFast(ct => {
      if(checkCreatedByTemp(ct) && ct.ex_isSubInsOf("DBCT_techNodeContent")) {
        this.techNodes.pushUnique(ct);
      };
    });
    if(this.techNodes.length > 0) {
      nodeLockedRcs.push(this);
      this.techNodes.forEachFast(node => {
        if(!nodeRcsMap.containsKey(node)) nodeRcsMap.put(node, []);
        nodeRcsMap.get(node).push(this);
      });
    };

    return this;
  };


  /* <------------------------------ display ------------------------------ */


  /**
   * Builds recipe I/O table for this recipe.
   * @param {Table} tb
   * @param {number} ord - Order of the recipe, use -1 to hide order box.
   * @param {boolean|unset} [noPane] - If true, no {@link ScrollPane} is used.
   * @param {boolean|unset} [showWinBtn] - If true, a button to create new window is added to order box.
   * @return {Cell}
   */
  CLS_recipe.prototype.display = function(tb, ord, noPane, showWinBtn) {
    return tb.table(Tex.whiteui, tb1 => {
      tb1.left().setColor(Pal.darkestGray);
      if(ord >= 0) {
        this.displayOrder(tb1, ord, showWinBtn);
      };
      tb1.table(Styles.none, tb2 => {}).left().width(36.0).growY();
      this.displayInput(tb1, false, noPane);
      tb1.table(Styles.none, tb2 => {}).left().width(48.0).growX().growY();
      this.displayOutput(tb1, false);
      this.displayStats(tb1, noPane);
    })
    .left()
    .growX()
    .row();
  };


  /**
  * Builds recipe base I/O table for this recipe.
  * @param {Table} tb
  * @param {boolean|unset} [noPane]
  * @param {number|unset} [pad]
  * @return {Cell}
  */
  CLS_recipe.prototype.displayBase = function(tb, noPane, pad) {
    return tb.table(Tex.whiteui, tb1 => {
      tb1.left().setColor(Tmp.c1.set(Pal.accent).lerp(Color.black, 0.8));
      this.displayInput(tb1, true, noPane);
      tb1.table(Styles.none, tb2 => {}).left().width(48.0).growX().growY();
      this.displayOutput(tb1, true);
      tb1.table(Styles.none, tb2 => {}).left().width(48.0).growX().growY();
    })
    .left()
    .padLeft(tryVal(pad, 0.0))
    .padRight(tryVal(pad, 0.0))
    .growX()
    .row();
  };


  /**
   * Builds tooltip table for this recipe.
   * @param {Table} tb
   * @param {boolean|unset} [valid]
   * @param {string|unset} [title]
   * @return {Cell}
   */
  CLS_recipe.prototype.displayTooltip = function(tb, valid, title) {
    if(valid == null) valid = true;

    return MDL_table.__edge(tb, tb1 => {
      tb1.table(Tex.whiteui, tb2 => {
        tb2.left().setColor(Pal.darkestGray);
        MDL_table.__margin(tb2);

        if(title != null) {
          tb2.add(title.plain().color(Pal.accent)).left().padLeft(12.0).fontScale(1.1).row();
          MDL_table.__bar(tb2, Pal.accent, null, 2.0);
          MDL_table.__break(tb2, 2);
        };
        if(!valid) {
          tb2.add(MDL_bundle._info("lovec", "recipe-unavailable")).color(Pal.remove).row();
          MDL_table.__break(tb2, 1);
        };
        if(this.tt != null) {
          tb2.add(this.tt.color(Color.darkGray)).center().labelAlign(Align.left).wrap().padLeft(28.0).padRight(28.0).row();
          MDL_table.__break(tb2, 1);
        };
        if(this.hasBaseIo) {
          this.displayBase(tb2, true, 28.0);
          MDL_table.__break(tb2, 1);
          MDL_table.__bar(tb2, Color.valueOf(Tmp.c1, "303030"), null, 3.0);
        };
        this.display(tb2, -1, true);
      });
    });
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
   * @param {boolean|unset} [noPane]
   * @return {Cell}
   */
  CLS_recipe.prototype.displayAltIoFrag = function(tb, tableF, noPane) {
    return tb.table(Styles.none, tb1 => {
      tb1.left();

      if(noPane) {
        tb1.table(Tex.whiteui, tb2 => {
          tb2.left().setColor(Pal.darkerGray);
          tableF(tb2);
        })
        .growX();
        return;
      };

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
        MDL_table.__break(tb2, 1);
        tb2.table(Styles.none, tb3 => {
          tb3.button(this.icon, Styles.clearNonei, 28.0, () => {});
          if(showWinBtn) {
            tb3.button(VARGEN.icons.window, Styles.clearNonei, 28.0, () => {
              new CLS_window(
                "${1} (${2})".format(MDL_bundle._term("lovec", "recipe"), this.owner.localizedName + " [${1}]".format(ord)),
                tb4 => {
                  if(this.hasBaseIo) {
                    this.displayBase(tb4, false, 28.0);
                    MDL_table.__break(tb4, 1);
                    MDL_table.__bar(tb4, Color.valueOf(Tmp.c1, "303030"), null, 3.0);
                  };
                  this.display(tb4, -1, false, false);
                },
              ).add();
            })
            .tooltip(MDL_bundle._term("lovec", "new-window"), true);
          };
        });
      }).width(84.0);
      MDL_table.__barV(tb1, Pal.accent);
    })
    .left()
    .growY();
  };


  /**
   * Builds the entire input fragment.
   * @param {Table} tb
   * @param {boolean|unset} [isBase]
   * @param {boolean|unset} [noPane]
   * @return {Cell}
   */
  CLS_recipe.prototype.displayInput = function(tb, isBase, noPane) {
    return tb.table(Styles.none, tb1 => {
      tb1.left();
      if((isBase ? this.baseBi : this.biNoBase).length > 0) this.displayBi(tb1, isBase, noPane);
      if((isBase ? this.baseCi : this.ciNoBase).length > 0) this.displayCi(tb1, isBase, noPane);
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


  /**
   * Builds the recipe stats fragment.
   * @param {Table} tb
   * @param {boolean|unset} [noPane]
   * @return {Cell}
   */
  CLS_recipe.prototype.displayStats = function thisFun(tb, noPane) {
    return tb.table(Styles.none, tb1 => {
      MDL_table.__barV(tb1, Pal.accent);
      tb1.table(Styles.none, tb2 => {}).width(24.0);
      tb1.table(Styles.none, tb2 => {
        let build = tb3 => {
          // <TABLE>: Stats
          thisFun.addStat(
            tb3, this.isGen,
            MDL_bundle._term("lovec", "generated-recipe").color(Pal.gray),
          );
          if(this.isIncomplete) {
            let str = MDL_bundle._info("lovec", "tt-recipe-errored-names") + "\n";
            this.erroredNames.forEachFast(name => {
              str += ("\n- " + name).color(Pal.accent);
            });
            tb3.add(MDL_bundle._term("lovec", "incomplete-recipe").color(Pal.remove)).left().tooltip(str, true).row();
          };
          thisFun.addStat(
            tb3, true,
            MDL_bundle._term("lovec", "time-required"),
            Strings.fixed(this.rcTimeScl, 1) + "x (" + Strings.autoFixed(this.owner.craftTime * this.rcTimeScl / 60.0, 2) + "s)",
          );
          thisFun.addStat(
            tb3, !this.pol.fEqual(0.0),
            fetchStat("lovec", "blk-pol").localized(),
            (this.pol > 0.0 ? "+" : "-") + Math.abs(this.pol),
            fetchStatUnit("lovec", "polunits").localized(),
          );
          thisFun.addStat(
            tb3, this.erekirHeatReq > 0.0,
            fetchStat("lovec", "blk-erekirheatreq").localized(),
            this.erekirHeatReq,
            StatUnit.heatUnits.localized(),
          );
          thisFun.addStat(
            tb3, this.erekirHeatProd > 0.0,
            fetchStat("lovec", "blk-erekirheatprod").localized(),
            this.erekirHeatProd,
            StatUnit.heatUnits.localized(),
          );
          thisFun.addStat(
            tb3, this.reqOpt,
            MDL_bundle._term("lovec", "require-optional"),
            MDL_bundle._base("yes"),
          );
          thisFun.addStat(
            tb3, this.failP > 0.0,
            MDL_bundle._term("lovec", "chance-to-fail"),
            this.failP.perc(1).color(this.failP > 0.25 ? Pal.remove : Pal.accent),
          );
          thisFun.addStat(
            tb3, !this.powProdMtp.fEqual(1.0),
            fetchStat("lovec", "blk0pow-powmtp").localized(),
            this.powProdMtp.perc().color(this.powProdMtp < 1.0 ? Pal.remove : Pal.heal),
          );
          thisFun.addStat(
            tb3, this.tempReq > 0.0,
            fetchStat("lovec", "blk0heat-tempreq").localized(),
            Strings.fixed(this.tempReq, 2),
            fetchStatUnit("lovec", "heatunits").localized(),
          );
          thisFun.addStat(
            tb3, isFinite(this.tempAllowed),
            MDL_bundle._term("lovec", "temperature-allowed"),
            Strings.fixed(this.tempAllowed, 2),
            fetchStatUnit("lovec", "heatunits").localized(),
          );
          thisFun.addStat(
            tb3, !this.durabDecMtp.fEqual(1.0),
            MDL_bundle._term("lovec", "abrasion-multiplier"),
            this.durabDecMtp.perc(),
          );
          if(this.lockedByCts.length > 0) {
            tb3.table(Styles.none, tb4 => {
              tb4.left();
              tb4.add(MDL_text._statText(MDL_bundle._term("lovec", "require-unlocking"), "")).left();
              this.lockedByCts.forEachFast(ct => MDL_table.__ct(tb4, ct, 28.0, 0.0, null, VAR.dialog.ct2));
            })
            .left()
            .row();
          };
          if(this.attr != null) {
            let attrCell = tb3.add(MDL_text._statText(fetchStat("lovec", "blk-attrreq").localized(), MDL_attr._attrB(attr))).left();
            MDL_table.__tooltip(attrCell, tb => {
              tb.table(Styles.black6, tb1 => {
                MDL_table.__margin(tb1);
                MDL_table._d_attr(tb1, this.attr, null, this.attrBoostScl, 40.0, 5);
              });
            }).row();
          };

        };

        if(noPane) {
          tb2.table(Styles.none, tb3 => {
            tb3.left();
            build(tb3);
          })
          .padTop(20.0).padBottom(20.0)
          .growX();
        } else {
          tb2.pane(pnTb => {
            pnTb.left();
            build(pnTb);
          })
          .height(90.0)
          .padTop(20.0).padBottom(20.0)
          .growX();
        };
      })
      .left()
      .width(320.0)
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
   * @param {boolean|unset} [noPane]
   * @return {Cell}
   */
  CLS_recipe.prototype.displayBi = function(tb, isBase, noPane) {
    return this.displayIoFrag(tb, "bi", tb1 => {
      (isBase ? this.baseBi : this.biNoBase).forEachRow(3, (tmp, amt, p) => {
        if(!(tmp instanceof Array)) {
          MDL_table.__rcCt(tb1, tmp, amt, p, true, null, VAR.dialog.ct1);
        } else {
          this.displayAltIoFrag(tb1, tb2 => {
            tmp.forEachRow(3, (tmp1, amt, p) => {
              MDL_table.__rcCt(tb2, tmp1, amt, p, true, null, VAR.dialog.ct1).row();
            });
          }, noPane);
        };
      });
    });
  };


  /**
   * Builds CI fragment.
   * @param {Table} tb
   * @param {boolean|unset} [isBase]
   * @param {boolean|unset} [noPane]
   * @return {Cell}
   */
  CLS_recipe.prototype.displayCi = function(tb, isBase, noPane) {
    return this.displayIoFrag(tb, "ci", tb1 => {
      (isBase ? this.baseCi : this.ciNoBase).forEachRow(2, (tmp, amt) => {
        if(!(tmp instanceof Array)) {
          MDL_table.__rcCt(tb1, tmp, amt, null, false, null, VAR.dialog.ct1);
        } else {
          this.displayAltIoFrag(tb1, tb2 => {
            tmp.forEachRow(2, (tmp1, amt) => {
              MDL_table.__rcCt(tb2, tmp1, amt, null, false, null, VAR.dialog.ct1).row();
            });
          }, noPane);
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
   * Whether a multi-crafter can add resource anymore.
   * @param {Building} b
   * @return {boolean}
   */
  CLS_recipe.prototype.checkCanAdd = function(b) {
    let
      i,
      iCap,
      tmp,
      amt,
      p;

    // CO
    if(b.liquids != null) {
      let allFull = true;
      i = 0;
      iCap = this.co.iCap();
      while(i < iCap) {
        tmp = this.co[i];
        amt = this.co[i + 1];
        if(b.liquids.get(tmp) < b.block.liquidCapacity - 0.001) {
          allFull = false;
        } else if(!b.block.ignoreLiquidFullness && !b.block.dumpExtraLiquid && amt > 0.0 && !MDL_cond._isAuxiliaryFluid(tmp)) {
          return false;
        };
        i += 2;
      };
      if(allFull && this.hasAnyFldOutputIncludeAux && !b.block.ignoreLiquidFullness) return false;
    };

    // BO
    i = 0;
    iCap = this.bo.iCap();
    while(i < iCap) {
      tmp = this.bo[i];
      amt = this.bo[i + 1];
      p = this.bo[i + 2];
      if(b.items != null && tmp instanceof Item) {
        if(amt > 0 && !b.delegee.ignoreItemFullness && b.items.get(tmp) > b.getMaximumAccepted(tmp) - amt * p) return false;
      };
      if(b.liquids != null && tmp instanceof Liquid) {
        if(amt > 0.0 && !b.block.ignoreLiquidFullness && b.liquids.get(tmp) / b.block.liquidCapacity > 0.98) return false;
      };
      i += 3;
    };

    // FO
    if(b.items != null) {
      i = 0;
      iCap = this.fo.iCap();
      while(i < iCap) {
        tmp = this.fo[i];
        amt = this.fo[i + 1];
        // No probability for failed output
        if(amt > 0 && !b.delegee.ignoreItemFullness && b.items.get(tmp) > b.getMaximumAccepted(tmp) - amt) return false;
        i += 3;
      };
    };

    return true;
  };


  /**
   * Gets a 4-tuple of preferred optional input.
   * Returns null if no optional input.
   * @param {Building} b
   * @return {[Item, number, number, number]|null} <TUP>: item, amt, p, mtp.
   */
  CLS_recipe.prototype.getOptTup = function(b) {
    if(b.items == null) return null;

    let
      tup = [],
      i = 0,
      iCap = this.opt.iCap(),
      tmp,
      amt,
      p,
      mtp,
      tmpMtp = 0.0;

    while(i < iCap) {
      tmp = this.opt[i];
      amt = this.opt[i + 1];
      p = this.opt[i + 2];
      mtp = this.opt[i + 3];
      if(b.items.get(tmp) >= amt && mtp >= tmpMtp) {
        tmpMtp = mtp;
        tup.with(tmp, amt, p, mtp);
      };
      i += 4;
    };

    return tup.length === 0 ? null : tup;
  };


  /**
   * Calculates current efficiency of a multi-crafter.
   * @param {Building} b
   * @return {number}
   */
  CLS_recipe.prototype.calcEffc = function(b) {
    if(b.cheating() || DEBUG.skipRcEffcCalc) return 1.0;

    let
      i,
      iCap,
      j,
      jCap,
      tmp,
      tmp1,
      amt,
      p,
      allAbsent,
      effc = 1.0,
      mtp = 1.0;

    if(b.power != null && !b.block.outputsPower) effc *= b.power.status;

    // OPT
    if(effc > 0.0 && this.opt.length > 0) {
      let optTup = this.getOptTup(b);
      if(this.reqOpt && optTup == null) {
        b.delegee.lastOptEffc = 0.0;
        return 0.0;
      };
      if(optTup != null) {
        effc *= optTup[3];
        b.delegee.lastOptEffc = optTup[3];
        optTup.clear();
      };
    };

    // CI
    if(b.liquids != null) {
      i = 0;
      iCap = this.ci.iCap();
      while(i < iCap) {
        if(effc < 0.0001) return 0.0;
        tmp = this.ci[i];
        if(!(tmp instanceof Array)) {
          amt = this.ci[i + 1];
          mtp = b.efficiencyScale() < 0.0001 || b.delegee.lastOptEffc < 0.0001 ?
            0.0 :
            amt < 0.0001 ?
              1.0 :
              Math.min(b.liquids.get(tmp) / amt / b.delegee.lastOptEffc * b.delta() * b.efficiencyScale(), 1.0);
        } else {
          j = 0;
          jCap = tmp.iCap();
          allAbsent = true;
          while(j < jCap) {
            // No zero amount check here, why put that in an alternative input list?
            if(b.liquids.get(tmp[j]) > 0.01) {
              amt = tmp[j + 1];
              mtp = b.efficiencyScale() < 0.0001 || b.delegee.lastOptEffc < 0.0001 ?
                0.0 :
                Math.min(b.liquids.get(tmp[j]) / amt / b.delegee.lastOptEffc * b.delta() * b.efficiencyScale(), 1.0);
              allAbsent = false;
              break;
            };
            j += 2;
          };
          if(allAbsent) mtp = 0.0;
        };
        effc *= mtp;
        i += 2;
      };
    };

    // BI
    if(b.items != null || b.liquids != null) {
      i = 0;
      iCap = this.bi.iCap();
      while(i < iCap) {
        if(effc < 0.0001) return 0.0;
        tmp = this.bi[i];
        if(!(tmp instanceof Array)) {
          amt = this.bi[i + 1];
          if(b.items != null && tmp instanceof Item) {
            if(b.items.get(tmp) < amt) return 0.0;
          };
          if(b.liquids != null && tmp instanceof Liquid) {
            if(b.liquids.get(tmp) < amt) return 0.0;
          };
        } else {
          allAbsent = true;
          j = 0;
          jCap = tmp.iCap();
          while(j < jCap) {
            tmp1 = tmp[j];
            amt = tmp[j + 1];
            if(b.items != null && tmp1 instanceof Item) {
              if(b.items.get(tmp1) >= amt) allAbsent = false;
            };
            if(b.liquids != null && tmp1 instanceof Liquid) {
              if(b.liquids.get(tmp1) > amt - 0.0001) allAbsent = false;
            };
            j += 3;
          };
          if(allAbsent) return 0.0;
        };
        i += 3;
      };
    };

    // AUX
    if(b.liquids != null) {
      i = 0;
      iCap = this.aux.iCap();
      while(i < iCap) {
        if(effc < 0.0001) return 0.0;
        tmp = this.aux[i];
        amt = this.aux[i + 1];
        mtp = b.efficiencyScale() < 0.0001 ?
          0.0 :
          amt < 0.0001 ?
            1.0 :
            Math.min(b.liquids.get(tmp) / amt * b.delta() * b.efficiencyScale(), 1.0);
        effc *= mtp;
        i += 2;
      };
    };

    return Mathf.maxZero(effc);
  };


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
    lastHeader: null,
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
   * Lets a multi-crafter consume items.
   * @param {Building} b
   * @return {void}
   */
  CLS_recipe.prototype.consumeBatch = function(b) {
    if((b.items == null || !b.items.any()) && b.liquids == null) return;

    let
      i,
      iCap,
      j,
      jCap,
      tmp,
      tmp1,
      amt,
      p;

    // BI
    i = 0;
    iCap = this.bi.iCap();
    while(i < iCap) {
      tmp = this.bi[i];
      if(!(tmp instanceof Array)) {
        amt = this.bi[i + 1];
        p = this.bi[i + 2];
        if(b.items != null && tmp instanceof Item) {
          FRAG_item.consumeItem(b, tmp, amt, p);
          b.delegee.consTmpObj[tmp.name] = amt * p;
        };
        if(b.liquids != null && tmp instanceof Liquid) {
          FRAG_fluid.addLiquidBatch(b, b, tmp, -amt);
          b.delegee.consTmpObj[tmp.name] = amt;
        };
      } else {
        j = 0;
        jCap = tmp.iCap();
        while(j < jCap) {
          tmp1 = tmp[j];
          amt = tmp[j + 1];
          p = tmp[j + 2];
          if(b.items != null && tmp1 instanceof Item && FRAG_item.consumeItem(b, tmp1, amt, p)) {
            b.delegee.consTmpObj[tmp1.name] = amt * p;
            break;
          };
          if(b.liquids != null && tmp1 instanceof Liquid && FRAG_fluid.addLiquidBatch(b, b, tmp1, -amt) > 0.0) {
            b.delegee.consTmpObj[tmp1.name] = amt;
            break;
          };
          j += 3;
        };
      };
      i += 3;
    };

    // OPT
    if(this.opt.length > 0) {
      let optTup = this.getOptTup(b);
      if(optTup != null) {
        FRAG_item.consumeItem(b, optTup[0], optTup[1], optTup[2]);
        b.delegee.consTmpObj[optTup[0].name] = optTup[1] * optTup[2];
        optTup.clear();
      };
    };
  };


  /**
   * Lets a multi-crafter consume liquids.
   * @param {Building} b
   * @param {number} progIncLiq
   * @return {void}
   */
  CLS_recipe.prototype.consumeContinuous = function(b, progIncLiq) {
    if(b.liquids == null || DEBUG.skipRcLiqCons) return;

    let
     i,
     iCap,
     j,
     jCap,
     tmp,
     tmp1,
     amt;

    // CI
    i = 0;
    iCap = this.ci.iCap();
    while(i < iCap) {
      tmp = this.ci[i];
      if(!(tmp instanceof Array)) {
        amt = this.ci[i + 1];
        b.liquids.remove(tmp, Math.min(amt * progIncLiq * this.rcTimeScl, b.liquids.get(tmp)));
        b.delegee.consTmpObj[tmp.name] = amt;
      } else {
        j = 0;
        jCap = tmp.iCap();
        while(j < jCap) {
          tmp1 = tmp[j];
          if(b.liquids.get(tmp1) > 0.01) {
            amt = tmp[j + 1];
            b.liquids.remove(tmp1, Math.min(amt * progIncLiq * this.rcTimeScl, b.liquids.get(tmp1)));
            b.delegee.consTmpObj[tmp1.name] = amt;
            break;
          };
          j += 2;
        };
      };
      i += 2;
    };

    // AUX
    i = 0;
    iCap = this.aux.iCap();
    while(i < iCap) {
      tmp = this.aux[i];
      amt = this.aux[i + 1];
      b.liquids.remove(tmp, Math.min(amt * progIncLiq, this.rcTimeScl, b.liquids.get(tmp)));
      b.delegee.consTmpObj[tmp.name] = amt;
      i += 2;
    };
  };



  /**
   * Lets a multi-crafter produce items.
   * @param {Building} b
   * @param {number} failP
   * @return {void}
   */
  CLS_recipe.prototype.craftBatch = function(b, failP) {
    let
      i,
      iCap,
      tmp,
      amt,
      p,
      failed = LCRand.chance(UTIL_rand.get("crafter"), failP);

    // BO
    if(!failed) {
      MDL_effect.showAt(b.x, b.y, b.block.craftEffect, 0.0);
      i = 0;
      iCap = this.bo.iCap();
      while(i < iCap) {
        tmp = this.bo[i];
        amt = this.bo[i + 1];
        p = this.bo[i + 2];
        if(b.items != null && tmp instanceof Item && b.items.get(tmp) < b.getMaximumAccepted(tmp)) {
          FRAG_item.produceItem(b, tmp, amt, p);
          b.delegee.prodTmpObj[tmp.name] = amt * p;
        };
        if(b.liquids != null && tmp instanceof Liquid) {
          FRAG_fluid.addLiquidBatch(b, b, tmp, amt, true);
          b.delegee.prodTmpObj[tmp.name] = amt;
        };
        i += 3;
      };
    };

    // FO
    if(b.items != null && failed) {
      MDL_effect.showAt(b.x, b.y, b.ex_getFailEff(), 0.0);
      i = 0;
      iCap = this.fo.iCap();
      while(i < iCap) {
        tmp = this.fo[i];
        amt = this.fo[i + 1];
        p = this.fo[i + 2];
        if(b.items.get(tmp) < b.getMaximumAccepted(tmp)) {
          FRAG_item.produceItem(b, tmp, amt, p);
          b.delegee.prodTmpObj[tmp.name] = amt * p;
        };
        i += 3;
      };
      b.ex_onRcFail();
    };
  };


  /**
   * Lets a multi-crafter produce liquids.
   * @param {Building} b
   * @param {number} progIncLiq
   * @return {void}
   */
  CLS_recipe.prototype.craftContinuous = function(b, progIncLiq) {
    if(b.liquids == null || DEBUG.skipRcLiqProd) return;

    let
      i,
      iCap,
      tmp,
      amt;

    // CO
    i = 0;
    iCap = this.co.iCap();
    while(i < iCap) {
      tmp = this.co[i];
      amt = this.co[i + 1];
      if(TIMER.secTwo && amt > 0.0) {
        TRIGGER.fluidProduce.fire(b, tmp);
      };
      b.handleLiquid(b, tmp, Math.min(amt * progIncLiq * this.rcTimeScl, b.block.liquidCapacity - b.liquids.get(tmp)));
      b.delegee.prodTmpObj[tmp.name] = amt;
      i += 2;
    };
  };


  /**
   * Consumes and produces payload in a multi-crafter.
   * @param {Building} b
   * @return {void}
   */
  CLS_recipe.prototype.craftPay = function(b) {
    let
      i,
      iCap;

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
   * Lets a multi-crafter dump resource in it.
   * @param {Building} b
   * @return {void}
   */
  CLS_recipe.prototype.dump = function(b) {
    if(DEBUG.skipRcDump) return;

    if(b.liquids != null) {
      i = 0;
      iCap = this.co.iCap();
      while(i < iCap) {
        tmp = this.co[i];
        dir = (b.block.liquidOutputDirections.length > i / 2) ? b.block.liquidOutputDirections[i / 2] : -1;
        b.dumpLiquid(tmp, 2.0, dir);
        i += 2;
      };

      i = 0;
      iCap = this.dumpTup[1].iCap();
      while(i < iCap) {
        if(this.dumpTup[1][i] != null) {
          b.dumpLiquid(this.dumpTup[1][i], 2.0);
        };
        i++;
      };
    };
    if(b.items != null && b.timer.get(b.block.timerDump, b.block.dumpTime / b.timeScale)) {
      i = 0;
      iCap = this.dumpTup[0].iCap();
      while(i < iCap) {
        if(this.dumpTup[0][i] != null) {
          b.dump(this.dumpTup[0][i]);
        };
        i++;
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
