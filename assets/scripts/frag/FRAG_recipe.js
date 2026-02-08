/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods specifically used by {BLK_recipeFactory}.
   * If you're trying to figure out how multi-crafter in Lovec works, also see {MDL_recipe}, {INTF_BLK_recipeSelector}, {INTF_BLK_recipeHandler} and {BLK_recipeFactory}.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const EFF = require("lovec/glb/GLB_eff");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const FRAG_fluid = require("lovec/frag/FRAG_fluid");
  const FRAG_item = require("lovec/frag/FRAG_item");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");


  /* <---------- condition ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Whether {rs_gn} is an input in the multi-crafter.
   * ---------------------------------------- */
  const _hasInput = function(rs_gn, ci, bi, aux, opt) {
    let rs = MDL_content._ct(rs_gn, "rs");
    if(rs == null) return false;
    let i, iCap, j, jCap, tmp, tmp1;

    // CI
    i = 0;
    iCap = ci.iCap();
    while(i < iCap) {
      tmp = ci[i];
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
    iCap = bi.iCap();
    while(i < iCap) {
      tmp = bi[i];
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
    iCap = aux.iCap();
    while(i < iCap) {
      tmp = aux[i];
      if(tmp === rs) return true;
      i += 2;
    };

    // OPT
    i = 0;
    iCap = opt.iCap();
    while(i < iCap) {
      tmp = opt[i];
      if(tmp === rs) return true;
      i += 4;
    };

    return false;
  };
  exports._hasInput = _hasInput;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the multi-crafter has any payload input.
   * ---------------------------------------- */
  const _hasInput_pay = function(payi) {
    return payi.length > 0;
  };
  exports._hasInput_pay = _hasInput_pay;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether {rs_gn} is an output in the multi-crafter.
   * ---------------------------------------- */
  const _hasOutput = function(rs_gn, co, bo, fo) {
    let rs = MDL_content._ct(rs_gn, "rs");
    if(rs == null) return false;
    let i, iCap, tmp;

    // CO
    i = 0;
    iCap = co.iCap();
    while(i < iCap) {
      tmp = co[i];
      if(tmp === rs) return true;
      i += 2;
    };

    // BO
    i = 0;
    iCap = bo.iCap();
    while(i < iCap) {
      tmp = bo[i];
      if(tmp === rs) return true;
      i += 3;
    };

    // FO
    i = 0;
    iCap = fo.iCap();
    while(i < iCap) {
      tmp = fo[i];
      if(tmp === rs) return true;
      i += 3;
    };

    return false;
  };
  exports._hasOutput = _hasOutput;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the multi-crafter has any item output.
   * ---------------------------------------- */
  const _hasOutput_itm = function(bo, fo) {
    let i, iCap;

    // FO
    // At the top for less calculation
    if(fo.length > 0) return true;

    // BO
    i = 0;
    iCap = bo.iCap();
    while(i < iCap) {
      if(bo[i] instanceof Item) return true;
      i += 3;
    };

    return false;
  };
  exports._hasOutput_itm = _hasOutput_itm;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the multi-crafter has any fluid output.
   * ---------------------------------------- */
  const _hasOutput_liq = function(includeAux, co, bo) {
    let i, iCap, tmp;

    // CO
    i = 0;
    iCap = co.iCap();
    while(i < iCap) {
      tmp = co[i];
      if(!MDL_cond._isAuxiliaryFluid(tmp)) {
        return true;
      } else {
        if(includeAux) return true;
      };
      i += 2;
    };

    // BO
    i = 0;
    iCap = bo.iCap();
    while(i < iCap) {
      tmp = bo[i];
      if(tmp instanceof Liquid) {
        if(!MDL_cond._isAuxiliaryFluid(tmp)) {
          return true;
        } else {
          if(includeAux) return true;
        };
      };
      i += 3;
    };

    return false;
  };
  exports._hasOutput_liq = _hasOutput_liq;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the multi-crafter has any payload output.
   * ---------------------------------------- */
  const _hasOutput_pay = function(payo) {
    return payo.length > 0;
  };
  exports._hasOutput_pay = _hasOutput_pay;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns an array of all liquids found in inputs.
   * ---------------------------------------- */
  const _inputLiqs = function(contArr, ci, bi, aux) {
    const arr = contArr != null ? contArr.clear() : [];
    let i, iCap, j, jCap;

    // CI
    i = 0;
    iCap = ci.iCap();
    while(i < iCap) {
      let tmp = ci[i];
      if(!(tmp instanceof Array)) {
        arr.pushUnique(tmp);
      } else {
        j = 0;
        jCap = tmp.iCap();
        while(j < jCap) {
          arr.pushUnique(tmp[j]);
          j += 2;
        };
      };
      i += 2;
    };

    // BI
    i = 0;
    iCap = bi.iCap();
    while(i < iCap) {
      let tmp = bi[i];
      if(!(tmp instanceof Array)) {
        if(tmp instanceof Liquid) arr.pushUnique(tmp);
      } else {
        j = 0;
        jCap = tmp.iCap();
        while(j < jCap) {
          let tmp1 = tmp[j];
          if(tmp1 instanceof Liquid) arr.pushUnique(tmp1);
          j += 3;
        };
      };
      i += 3;
    };

    // AUX
    i = 0;
    iCap = aux.iCap();
    while(i < iCap) {
      arr.pushUnique(aux[i]);
      i += 2;
    };

    return arr;
  };
  exports._inputLiqs = _inputLiqs;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns an array of all liquids found in outputs.
   * ---------------------------------------- */
  const _outputLiqs = function(contArr, co, bo) {
    const arr = contArr != null ? contArr.clear() : [];
    let i, iCap;

    // CO
    i = 0;
    iCap = co.iCap();
    while(i < iCap) {
      arr.pushUnique(co[i]);
      i += 2;
    };

    // BO
    i = 0;
    iCap = bo.iCap();
    while(i < iCap) {
      let tmp = bo[i];
      if(tmp instanceof Liquid) arr.pushUnique(tmp);
      i += 3;
    };

    return arr;
  };
  exports._outputLiqs = _outputLiqs;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the multi-crafter can add resource any more.
   * ---------------------------------------- */
  const _canAdd = function(b, ignoreItemFullness, co, bo, fo) {
    let i, iCap, tmp, amt, p;

    // CO
    if(b.liquids != null) {
      let allFull = true;
      i = 0;
      iCap = co.iCap();
      while(i < iCap) {
        tmp = co[i];
        amt = co[i + 1];
        if(b.liquids.get(tmp) < b.block.liquidCapacity) {
          allFull = false;
        } else if(!b.block.ignoreLiquidFullness && !b.block.dumpExtraLiquid) {
          return false;
        };
        i += 2;
      };
      if(allFull && _hasOutput_liq(true, co, bo) && !b.block.ignoreLiquidFullness) return false;
    };

    // BO
    i = 0;
    iCap = bo.iCap();
    while(i < iCap) {
      tmp = bo[i];
      amt = bo[i + 1];
      p = bo[i + 2];
      if(b.items != null && tmp instanceof Item) {
        if(!ignoreItemFullness && b.items.get(tmp) > b.getMaximumAccepted(tmp) - amt * p) return false;
      };
      if(b.liquids != null && tmp instanceof Liquid) {
        if(!b.block.ignoreLiquidFullness && b.liquids.get(tmp) / b.block.liquidCapacity > 0.98) return false;
      };
      i += 3;
    };

    // FO
    if(b.items != null) {
      i = 0;
      iCap = fo.iCap();
      while(i < iCap) {
        tmp = fo[i];
        amt = fo[i + 1];
        // No probability for failed output
        if(!ignoreItemFullness && b.items.get(tmp) > b.getMaximumAccepted(tmp) - amt) return false;
        i += 3;
      };
    };

    return true;
  };
  exports._canAdd = _canAdd;


  /* <---------- calculation ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Returns a 2-tuple of items and fluids to dump.
   * {co} is called in dump method for output direction.
   * ---------------------------------------- */
  const _dumpTup = function(b, contTup, bo, fo) {
    const tup = contTup != null ? contTup : [[], []];

    let i, iCap;

    // BO
    i = 0;
    iCap = bo.iCap();
    while(i < iCap) {
      let tmp = bo[i];
      if(b.items != null && tmp instanceof Item) tup[0].pushUnique(tmp);
      if(b.liquids != null && tmp instanceof Liquid) tup[1].pushUnique(tmp);
      i += 3;
    };

    // FO
    if(b.items != null) {
      i = 0;
      iCap = fo.iCap();
      while(i < iCap) {
        let tmp = fo[i];
        tup[0].pushUnique(tmp);
        i += 3;
      };
    };

    return tup;
  };
  exports._dumpTup = _dumpTup;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns a 4-tuple for currently used optional input.
   * Returns {null} if no optional input.
   * ---------------------------------------- */
  const _optTup = function(b, opt) {
    if(b.items == null) return null;

    let tup = [];
    let tmpMtp = 0.0;
    let i, iCap;

    i = 0;
    iCap = opt.iCap();
    while(i < iCap) {
      let tmp = opt[i];
      let amt = opt[i + 1];
      let p = opt[i + 2];
      let mtp = opt[i + 3];
      if(b.items.get(tmp) >= amt && mtp >= tmpMtp) {
        tmpMtp = mtp;
        tup.clear().push(tmp, amt, p, mtp);
      };
      i += 4;
    };

    return tup.length === 0 ? null : tup;
  };
  exports._optTup = _optTup;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns current efficiency of the multi-crafter.
   * ---------------------------------------- */
  const _effc = function(b, ci, bi, aux, reqOpt, opt) {
    if(b.cheating()) return 1.0;

    let effc = 1.0, mtp = 1.0;
    if(b.power != null && !b.block.outputsPower) effc *= b.power.status;
    let i, iCap, j, jCap, tmp, tmp1, amt, allAbsent;

    // CI
    if(b.liquids != null) {
      i = 0;
      iCap = ci.iCap();
      while(i < iCap) {
        if(effc < 0.0001) return 0.0;
        tmp = ci[i];
        if(!(tmp instanceof Array)) {
          amt = ci[i + 1];
          mtp = b.efficiencyScale() < 0.0001 ?
            0.0 :
            Math.min(b.liquids.get(tmp) / amt * b.delta() * b.efficiencyScale(), 1.0);
        } else {
          j = 0, jCap = tmp.iCap(), allAbsent = true;
          while(j < jCap) {
            if(b.liquids.get(tmp[j]) > 0.01) {
              amt = tmp[j + 1];
              mtp = b.efficiencyScale() < 0.0001 ?
                0.0 :
                Math.min(b.liquids.get(tmp[j]) / amt * b.delta() * b.efficiencyScale(), 1.0);
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
      iCap = bi.iCap();
      while(i < iCap) {
        if(effc < 0.0001) return 0.0;
        tmp = bi[i];
        if(!(tmp instanceof Array)) {
          amt = bi[i + 1];
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
      iCap = aux.iCap();
      while(i < iCap) {
        if(effc < 0.0001) return 0.0;
        tmp = aux[i];
        amt = aux[i + 1];
        mtp = b.efficiencyScale() < 0.0001 ?
          0.0 :
          Math.min(b.liquids.get(tmp) / amt * b.delta() * b.efficiencyScale(), 1.0);
        effc *= mtp;
        i += 2;
      };
    };

    // OPT
    if(effc > 0.0) {
      let optTup = _optTup(b, opt);
      if(reqOpt && optTup == null) return 0.0;
      if(optTup != null) {
        effc *= optTup[3];
        optTup.clear();
      };
    };

    return Mathf.maxZero(effc);
  };
  exports._effc = _effc;


  /* <---------- application ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a multi-crafter consume items.
   * ---------------------------------------- */
  const consume_itm = function(b, bi, opt) {
    if((b.items == null || !b.items.any()) && b.liquids == null) return;

    let i, iCap, j, jCap, tmp, tmp1, amt, p;

    // BI
    i = 0;
    iCap = bi.iCap();
    while(i < iCap) {
      tmp = bi[i];
      if(!(tmp instanceof Array)) {
        amt = bi[i + 1];
        p = bi[i + 2];
        if(b.items != null && tmp instanceof Item) {
          FRAG_item.consumeItem(b, tmp, amt, p);
        };
        if(b.liquids != null && tmp instanceof Liquid) {
          FRAG_fluid.addLiquidBatch(b, b, tmp, -amt);
        };
      } else {
        j = 0;
        jCap = tmp.iCap();
        while(j < jCap) {
          tmp1 = tmp[j];
          amt = tmp[j + 1];
          p = tmp[j + 2];
          if(b.items != null && tmp1 instanceof Item && FRAG_item.consumeItem(b, tmp1, amt, p)) {
            break;
          };
          if(b.liquids != null && tmp1 instanceof Liquid && FRAG_fluid.addLiquidBatch(b, b, tmp1, -amt) > 0.0) {
            break;
          };
          j += 3;
        };
      };
      i += 3;
    };

    // OPT
    let optTup = _optTup(b, opt);
    if(optTup != null) {
      FRAG_item.consumeItem(b, optTup[0], optTup[1], optTup[2]);
      optTup.clear();
    };
  };
  exports.consume_itm = consume_itm;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a multi-crafter consume liquids.
   * ---------------------------------------- */
  const consume_liq = function(b, progIncLiq, timeScl, ci, aux) {
    if(b.liquids == null) return;

    let i, iCap, j, jCap, tmp, amt;

    // CI
    i = 0;
    iCap = ci.iCap();
    while(i < iCap) {
      tmp = ci[i];
      if(!(tmp instanceof Array)) {
        amt = ci[i + 1];
        b.liquids.remove(tmp, Math.min(amt * progIncLiq, timeScl, b.liquids.get(tmp)));
      } else {
        j = 0, jCap = tmp.iCap();
        while(j < jCap) {
          if(b.liquids.get(tmp[j]) > 0.01) {
            amt = tmp[j + 1];
            b.liquids.remove(tmp[j], Math.min(amt * progIncLiq, timeScl, b.liquids.get(tmp[j])));
            break;
          };
          j += 2;
        };
      };
      i += 2;
    };

    // AUX
    i = 0;
    iCap = aux.iCap();
    while(i < iCap) {
      tmp = aux[i];
      amt = aux[i + 1];
      b.liquids.remove(tmp, Math.min(amt * progIncLiq, timeScl, b.liquids.get(tmp)));
      i += 2;
    };
  };
  exports.consume_liq = consume_liq;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a multi-crafter produce items.
   * ---------------------------------------- */
  const produce_itm = function(b, bo, failP, fo) {
    let failed = Mathf.chance(failP);

    let i, iCap, tmp, amt, p;

    // BO
    if(!failed) {
      i = 0;
      iCap = bo.iCap();
      while(i < iCap) {
        tmp = bo[i];
        amt = bo[i + 1];
        p = bo[i + 2];
        if(b.items != null && tmp instanceof Item && b.items.get(tmp) < b.getMaximumAccepted(tmp)) {
          FRAG_item.produceItem(b, tmp, amt, p);
        };
        if(b.liquids != null && tmp instanceof Liquid) {
          FRAG_fluid.addLiquidBatch(b, b, tmp, amt, true);
        };
        i += 3;
      };
    };

    // FO
    if(b.items != null && failed) {
      i = 0;
      iCap = fo.iCap();
      for(let j = 0; j < 3; j++) {EFF.blackSmog.at(b)};
      while(i < iCap) {
        tmp = fo[i];
        amt = fo[i + 1];
        p = fo[i + 2];
        if(b.items.get(tmp) < b.getMaximumAccepted(tmp)) {
          FRAG_item.produceItem(b, tmp, amt, p);
        };
        i += 3;
      };
    };
  };
  exports.produce_itm = produce_itm;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a multi-crafter produce liquids.
   * ---------------------------------------- */
  const produce_liq = function(b, progIncLiq, timeScl, co) {
    if(b.liquids == null) return;

    let i, iCap, tmp, amt;

    // CO
    i = 0;
    iCap = co.iCap();
    while(i < iCap) {
      tmp = co[i];
      amt = co[i + 1];
      b.handleLiquid(b, tmp, Math.min(amt * progIncLiq * timeScl, b.block.liquidCapacity - b.liquids.get(tmp)));
      i += 2;
    };
  };
  exports.produce_liq = produce_liq;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a multi-crafter dump some resource in it.
   * ---------------------------------------- */
  const dump = function(b, co, dumpTup) {
    if(dumpTup == null) return;

    if(b.liquids != null) {
      let i = 0, iCap = co.iCap(), tmp, dir;
      while(i < iCap) {
        tmp = co[i];
        dir = (b.block.liquidOutputDirections.length > i / 2) ? b.block.liquidOutputDirections[i / 2] : -1;
        b.dumpLiquid(tmp, 2.0, dir);
        i += 2;
      };

      dumpTup[1].forEachFast(liq => b.dumpLiquid(liq, 2.0));
    };
    if(b.items != null && b.items.any()) {
      dumpTup[0].forEachFast(itm => b.dump(itm));
    };
  };
  exports.dump = dump;
