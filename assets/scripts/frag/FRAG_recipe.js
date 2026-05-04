/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods specifically used by {@link BLK_recipeFactory}.
   * @module lovec/frag/FRAG_recipe
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- condition ----------> */


  /**
   * Whether `rs_gn` is an input in the multi-crafter.
   * @param {ResourceGn} rs_gn
   * @param {Array} ci
   * @param {Array} bi
   * @param {Array} aux
   * @param {Array} opt
   * @return {boolean}
   */
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


  /**
   * Whether the multi-crafter has any payload input.
   * @param {Array} payi
   * @return {boolean}
   */
  const _hasInput_pay = function(payi) {
    return payi.length > 0;
  };
  exports._hasInput_pay = _hasInput_pay;


  /**
   * Whether `rs_gn` is an output in the multi-crafter.
   * @param {ResourceGn} rs_gn
   * @param {Array} co
   * @param {Array} bo
   * @param {Array} fo
   * @return {boolean}
   */
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


  /**
   * Whether the multi-crafter has any item output.
   * @param {Array} bo
   * @param {Array} fo
   * @return {boolean}
   */
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


  /**
   * Whether the multi-crafter has any fluid output.
   * @param {boolean} includeAux
   * @param {Array} co
   * @param {Array} bo
   * @return {boolean}
   */
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


  /**
   * Whether the multi-crafter has any payload output.
   * @param {Array} payo
   * @return {boolean}
   */
  const _hasOutput_pay = function(payo) {
    return payo.length > 0;
  };
  exports._hasOutput_pay = _hasOutput_pay;


  /**
   * Gets all liquids found in outputs.
   * @param {Array|unset} contArr
   * @param {Array} ci
   * @param {Array} bi
   * @param {Array} aux
   * @return {Array<Liquid>}
   */
  const _inputLiqs = function(contArr, ci, bi, aux) {
    const arr = contArr != null ? contArr.clear() : [];
    let i, iCap, j, jCap, tmp, tmp1;

    // CI
    i = 0;
    iCap = ci.iCap();
    while(i < iCap) {
      tmp = ci[i];
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
      tmp = bi[i];
      if(!(tmp instanceof Array)) {
        if(tmp instanceof Liquid) arr.pushUnique(tmp);
      } else {
        j = 0;
        jCap = tmp.iCap();
        while(j < jCap) {
          tmp1 = tmp[j];
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


  /**
   * Gets all liquids found in outputs.
   * @param {Array|unset} contArr
   * @param {Array} co
   * @param {Array} bo
   * @return {Array<Liquid>}
   */
  const _outputLiqs = function(contArr, co, bo) {
    const arr = contArr != null ? contArr.clear() : [];
    let i, iCap, tmp;

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
      tmp = bo[i];
      if(tmp instanceof Liquid) arr.pushUnique(tmp);
      i += 3;
    };

    return arr;
  };
  exports._outputLiqs = _outputLiqs;


  /**
   * Whether the multi-crafter can add resource anymore.
   * @param {Building} b
   * @return {boolean}
   */
  const _canAdd = function(b) {
    let i, iCap, tmp, amt, p;

    // CO
    if(b.liquids != null) {
      let allFull = true, isAux = false;
      i = 0;
      iCap = b.delegee.co.iCap();
      while(i < iCap) {
        tmp = b.delegee.co[i];
        amt = b.delegee.co[i + 1];
        if(b.liquids.get(tmp) < b.block.liquidCapacity - 0.001) {
          allFull = false;
        } else if(!b.block.ignoreLiquidFullness && !b.block.dumpExtraLiquid && !MDL_cond._isAuxiliaryFluid(tmp)) {
          return false;
        };
        i += 2;
      };
      if(allFull && _hasOutput_liq(true, b.delegee.co, b.delegee.bo) && !b.block.ignoreLiquidFullness) return false;
    };

    // BO
    i = 0;
    iCap = b.delegee.bo.iCap();
    while(i < iCap) {
      tmp = b.delegee.bo[i];
      amt = b.delegee.bo[i + 1];
      p = b.delegee.bo[i + 2];
      if(b.items != null && tmp instanceof Item) {
        if(!b.delegee.ignoreItemFullness && b.items.get(tmp) > b.getMaximumAccepted(tmp) - amt * p) return false;
      };
      if(b.liquids != null && tmp instanceof Liquid) {
        if(!b.block.ignoreLiquidFullness && b.liquids.get(tmp) / b.block.liquidCapacity > 0.98) return false;
      };
      i += 3;
    };

    // FO
    if(b.items != null) {
      i = 0;
      iCap = b.delegee.fo.iCap();
      while(i < iCap) {
        tmp = b.delegee.fo[i];
        amt = b.delegee.fo[i + 1];
        // No probability for failed output
        if(!b.delegee.ignoreItemFullness && b.items.get(tmp) > b.getMaximumAccepted(tmp) - amt) return false;
        i += 3;
      };
    };

    return true;
  };
  exports._canAdd = _canAdd;


  /* <---------- calculation ----------> */


  /**
   * Gets a 2-tuptle of items and fluids to dump.
   * `co` is not used here due to liquid output directions.
   * @param {Building} b
   * @param {Array|unset} contTup
   * @return {[Array<Item>, Array<Liquid>]}
   */
  const _dumpTup = function(b, contTup) {
    const tup = contTup != null ? contTup : [[], []];
    tup[0].clear();
    tup[1].clear();

    let i, iCap, tmp;

    // BO
    i = 0;
    iCap = b.delegee.bo.iCap();
    while(i < iCap) {
      tmp = b.delegee.bo[i];
      if(b.items != null && tmp instanceof Item) tup[0].pushUnique(tmp);
      if(b.liquids != null && tmp instanceof Liquid) tup[1].pushUnique(tmp);
      i += 3;
    };

    // FO
    if(b.items != null) {
      i = 0;
      iCap = b.delegee.fo.iCap();
      while(i < iCap) {
        tmp = b.delegee.fo[i];
        tup[0].pushUnique(tmp);
        i += 3;
      };
    };

    return tup;
  };
  exports._dumpTup = _dumpTup;


  /**
   * Gets a 4-tuple of preferred optional input.
   * Returns null if no optional input.
   * @param {Building} b
   * @return {[Item, number, number, number]|null} <TUP>: item, amt, p, mtp.
   */
  const _optTup = function(b) {
    if(b.items == null) return null;

    let tup = [];
    let tmpMtp = 0.0;
    let i, iCap, tmp, amt, p, mtp;

    i = 0;
    iCap = b.delegee.opt.iCap();
    while(i < iCap) {
      tmp = b.delegee.opt[i];
      amt = b.delegee.opt[i + 1];
      p = b.delegee.opt[i + 2];
      mtp = b.delegee.opt[i + 3];
      if(b.items.get(tmp) >= amt && mtp >= tmpMtp) {
        tmpMtp = mtp;
        tup.clear().push(tmp, amt, p, mtp);
      };
      i += 4;
    };

    return tup.length === 0 ? null : tup;
  };
  exports._optTup = _optTup;


  /**
   * Calculates current efficiency of the multi-crafter.
   * @param {Building} b
   * @return {number}
   */
  const _effc = function(b) {
    if(b.cheating()) return 1.0;

    let effc = 1.0, mtp = 1.0;
    if(b.power != null && !b.block.outputsPower) effc *= b.power.status;
    let i, iCap, j, jCap, tmp, tmp1, amt, allAbsent;

    // OPT
    if(effc > 0.0 && b.delegee.opt.length > 0) {
      let optTup = _optTup(b);
      if(b.delegee.reqOpt && optTup == null) {
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
      iCap = b.delegee.ci.iCap();
      while(i < iCap) {
        if(effc < 0.0001) return 0.0;
        tmp = b.delegee.ci[i];
        if(!(tmp instanceof Array)) {
          amt = b.delegee.ci[i + 1];
          mtp = b.efficiencyScale() < 0.0001 || b.delegee.lastOptEffc < 0.0001 ?
            0.0 :
            Math.min(b.liquids.get(tmp) / amt / b.delegee.lastOptEffc * b.delta() * b.efficiencyScale(), 1.0);
        } else {
          j = 0;
          jCap = tmp.iCap();
          allAbsent = true;
          while(j < jCap) {
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
      iCap = b.delegee.bi.iCap();
      while(i < iCap) {
        if(effc < 0.0001) return 0.0;
        tmp = b.delegee.bi[i];
        if(!(tmp instanceof Array)) {
          amt = b.delegee.bi[i + 1];
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
      iCap = b.delegee.aux.iCap();
      while(i < iCap) {
        if(effc < 0.0001) return 0.0;
        tmp = b.delegee.aux[i];
        amt = b.delegee.aux[i + 1];
        mtp = b.efficiencyScale() < 0.0001 ?
          0.0 :
          Math.min(b.liquids.get(tmp) / amt * b.delta() * b.efficiencyScale(), 1.0);
        effc *= mtp;
        i += 2;
      };
    };

    return Mathf.maxZero(effc);
  };
  exports._effc = _effc;


  /* <---------- application ----------> */


  /**
   * Lets a multi-crafter consume items.
   * @param {Building} b
   * @return {void}
   */
  const consume_itm = function(b) {
    if((b.items == null || !b.items.any()) && b.liquids == null) return;

    let i, iCap, j, jCap, tmp, tmp1, amt, p;

    // BI
    i = 0;
    iCap = b.delegee.bi.iCap();
    while(i < iCap) {
      tmp = b.delegee.bi[i];
      if(!(tmp instanceof Array)) {
        amt = b.delegee.bi[i + 1];
        p = b.delegee.bi[i + 2];
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
    let optTup = _optTup(b);
    if(optTup != null) {
      FRAG_item.consumeItem(b, optTup[0], optTup[1], optTup[2]);
      b.delegee.consTmpObj[optTup[0].name] = optTup[1] * optTup[2];
      optTup.clear();
    };
  };
  exports.consume_itm = consume_itm;


  /**
   * Lets a multi-crafter consume liquids.
   * @param {Building} b
   * @param {number} progIncLiq
   * @param {number} timeScl
   * @return {void}
   */
  const consume_liq = function(b, progIncLiq, timeScl) {
    if(b.liquids == null) return;

    let i, iCap, j, jCap, tmp, amt;

    // CI
    i = 0;
    iCap = b.delegee.ci.iCap();
    while(i < iCap) {
      tmp = b.delegee.ci[i];
      if(!(tmp instanceof Array)) {
        amt = b.delegee.ci[i + 1];
        b.liquids.remove(tmp, Math.min(amt * progIncLiq * timeScl, b.liquids.get(tmp)));
        b.delegee.consTmpObj[tmp.name] = amt;
      } else {
        j = 0;
        jCap = tmp.iCap();
        while(j < jCap) {
          if(b.liquids.get(tmp[j]) > 0.01) {
            amt = tmp[j + 1];
            b.liquids.remove(tmp[j], Math.min(amt * progIncLiq * timeScl, b.liquids.get(tmp[j])));
            b.delegee.consTmpObj[tmp[j].name] = amt;
            break;
          };
          j += 2;
        };
      };
      i += 2;
    };

    // AUX
    i = 0;
    iCap = b.delegee.aux.iCap();
    while(i < iCap) {
      tmp = b.delegee.aux[i];
      amt = b.delegee.aux[i + 1];
      b.liquids.remove(tmp, Math.min(amt * progIncLiq, timeScl, b.liquids.get(tmp)));
      b.delegee.consTmpObj[tmp.name] = amt;
      i += 2;
    };
  };
  exports.consume_liq = consume_liq;


  /**
   * Lets a multi-crafter produce items.
   * @param {Building} b
   * @param {number} failP
   * @return {void}
   */
  const produce_itm = function(b, failP) {
    let failed = Mathf.chance(failP);

    let i, iCap, tmp, amt, p;

    // BO
    if(!failed) {
      i = 0;
      iCap = b.delegee.bo.iCap();
      while(i < iCap) {
        tmp = b.delegee.bo[i];
        amt = b.delegee.bo[i + 1];
        p = b.delegee.bo[i + 2];
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
      i = 0;
      iCap = b.delegee.fo.iCap();
      b.ex_getFailEff().at(b);
      while(i < iCap) {
        tmp = b.delegee.fo[i];
        amt = b.delegee.fo[i + 1];
        p = b.delegee.fo[i + 2];
        if(b.items.get(tmp) < b.getMaximumAccepted(tmp)) {
          FRAG_item.produceItem(b, tmp, amt, p);
          b.delegee.prodTmpObj[tmp.name] = amt * p;
        };
        i += 3;
      };
      b.ex_onRcFail();
    };
  };
  exports.produce_itm = produce_itm;


  /**
   * Lets a multi-crafter produce liquids.
   * @param {Building} b
   * @param {number} progIncLiq
   * @param {number} timeScl
   * @return {void}
   */
  const produce_liq = function(b, progIncLiq, timeScl) {
    if(b.liquids == null) return;

    let i, iCap, tmp, amt;

    // CO
    i = 0;
    iCap = b.delegee.co.iCap();
    while(i < iCap) {
      tmp = b.delegee.co[i];
      amt = b.delegee.co[i + 1];
      b.handleLiquid(b, tmp, Math.min(amt * progIncLiq * timeScl, b.block.liquidCapacity - b.liquids.get(tmp)));
      b.delegee.prodTmpObj[tmp.name] = amt;
      i += 2;
    };
  };
  exports.produce_liq = produce_liq;


  /**
   * Lets a multi-crafter dump resource in it.
   * @param {Building} b
   * @param {[Array<Item>, Array<Liquid>]} dumpTup
   * @return {void}
   */
  const dump = function(b, dumpTup) {
    if(dumpTup == null) return;

    let i, iCap;

    if(b.liquids != null) {
      let tmp, dir;
      i = 0;
      iCap = b.delegee.co.iCap();
      while(i < iCap) {
        tmp = b.delegee.co[i];
        dir = (b.block.liquidOutputDirections.length > i / 2) ? b.block.liquidOutputDirections[i / 2] : -1;
        b.dumpLiquid(tmp, 2.0, dir);
        i += 2;
      };

      i = 0;
      iCap = dumpTup[1].iCap();
      while(i < iCap) {
        b.dumpLiquid(dumpTup[1][i], 2.0);
        i++;
      };
    };
    if(b.items != null && b.timer.get(b.block.timerDump, b.block.dumpTime / b.timeScale)) {
      i = 0;
      iCap = dumpTup[0].iCap();
      while(i < iCap) {
        b.dump(dumpTup[0][i]);
        i++;
      };
    };
  };
  exports.dump = dump;
