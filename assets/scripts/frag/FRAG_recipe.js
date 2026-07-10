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


  /* <------------------------------ auxiliary ------------------------------ */


  let
    i,
    iCap,
    j,
    jCap,
    tmp,
    tmp1,
    p,
    mtp,
    effc,
    dir,
    allAbsent,
    failed,
    optTup,
    dumpTup;


  /* <------------------------------ condition ------------------------------ */


  /**
   * Whether `rs_gn` is an input in the multi-crafter.
   * @param {ResourceGn} rs_gn
   * @param {CLS_recipe} rc
   * @return {boolean}
   */
  const _hasInput = function(rs_gn, rc) {
    let rs = MDL_content._ct(rs_gn, "rs");
    if(rs == null) return false;

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
  exports._hasInput = _hasInput;


  /**
   * Whether the multi-crafter has any payload input.
   * @param {CLS_recipe} rc
   * @return {boolean}
   */
  const _hasInput_pay = function(rc) {
    return rc.payi.length > 0;
  };
  exports._hasInput_pay = _hasInput_pay;


  /**
   * Whether `rs_gn` is an output in the multi-crafter.
   * @param {ResourceGn} rs_gn
   * @param {CLS_recipe} rc
   * @return {boolean}
   */
  const _hasOutput = function(rs_gn, rc) {
    let rs = MDL_content._ct(rs_gn, "rs");
    if(rs == null) return false;

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
  exports._hasOutput = _hasOutput;


  /**
   * Whether the multi-crafter has any item output.
   * @param {CLS_recipe} rc
   * @return {boolean}
   */
  const _hasOutput_itm = function(rc) {
    // FO
    // At the top for less calculation
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
  exports._hasOutput_itm = _hasOutput_itm;


  /**
   * Whether the multi-crafter has any fluid output.
   * @param {boolean} includeAux
   * @param {CLS_recipe} rc
   * @return {boolean}
   */
  const _hasOutput_liq = function(includeAux, rc) {
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
  exports._hasOutput_liq = _hasOutput_liq;


  /**
   * Whether the multi-crafter has any payload output.
   * @param {CLS_recipe} rc
   * @return {boolean}
   */
  const _hasOutput_pay = function(rc) {
    return rc.payo.length > 0;
  };
  exports._hasOutput_pay = _hasOutput_pay;


  /**
   * Gets all liquids found in outputs.
   * @param {Array|unset} contArr
   * @param {CLS_recipe} rc
   * @return {Array<Liquid>}
   */
  const _inputLiqs = function(contArr, rc) {
    let arr = contArr != null ? contArr.clear() : [];

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
  exports._inputLiqs = _inputLiqs;


  /**
   * Gets all liquids found in outputs.
   * @param {Array|unset} contArr
   * @param {CLS_recipe} rc
   * @return {Array<Liquid>}
   */
  const _outputLiqs = function(contArr, rc) {
    let arr = contArr != null ? contArr.clear() : [];

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
  exports._outputLiqs = _outputLiqs;


  /**
   * Whether the multi-crafter can add resource anymore.
   * @param {Building} b
   * @param {CLS_recipe} rc
   * @return {boolean}
   */
  const _canAdd = function(b, rc) {
    // CO
    if(b.liquids != null) {
      let allFull = true;
      i = 0;
      iCap = rc.co.iCap();
      while(i < iCap) {
        tmp = rc.co[i];
        amt = rc.co[i + 1];
        if(b.liquids.get(tmp) < b.block.liquidCapacity - 0.001) {
          allFull = false;
        } else if(!b.block.ignoreLiquidFullness && !b.block.dumpExtraLiquid && amt > 0.0 && !MDL_cond._isAuxiliaryFluid(tmp)) {
          return false;
        };
        i += 2;
      };
      if(allFull && _hasOutput_liq(true, rc) && !b.block.ignoreLiquidFullness) return false;
    };

    // BO
    i = 0;
    iCap = rc.bo.iCap();
    while(i < iCap) {
      tmp = rc.bo[i];
      amt = rc.bo[i + 1];
      p = rc.bo[i + 2];
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
      iCap = rc.fo.iCap();
      while(i < iCap) {
        tmp = rc.fo[i];
        amt = rc.fo[i + 1];
        // No probability for failed output
        if(amt > 0 && !b.delegee.ignoreItemFullness && b.items.get(tmp) > b.getMaximumAccepted(tmp) - amt) return false;
        i += 3;
      };
    };

    return true;
  };
  exports._canAdd = _canAdd;


  /* <------------------------------ calculation ------------------------------ */


  /**
   * Gets a 4-tuple of preferred optional input.
   * Returns null if no optional input.
   * @param {Building} b
   * @param {CLS_recipe} rc
   * @return {[Item, number, number, number]|null} <TUP>: item, amt, p, mtp.
   */
  const _optTup = function(b, rc) {
    if(b.items == null) return null;

    let tup = [];
    let tmpMtp = 0.0;

    i = 0;
    iCap = rc.opt.iCap();
    while(i < iCap) {
      tmp = rc.opt[i];
      amt = rc.opt[i + 1];
      p = rc.opt[i + 2];
      mtp = rc.opt[i + 3];
      if(b.items.get(tmp) >= amt && mtp >= tmpMtp) {
        tmpMtp = mtp;
        tup.with(tmp, amt, p, mtp);
      };
      i += 4;
    };

    return tup.length === 0 ? null : tup;
  };
  exports._optTup = _optTup;


  /**
   * Calculates current efficiency of the multi-crafter.
   * @param {Building} b
   * @param {CLS_recipe} rc
   * @return {number}
   */
  const _effc = function(b, rc) {
    if(b.cheating() || DEBUG.skipRcEffcCalc) return 1.0;

    effc = 1.0;
    mtp = 1.0;
    if(b.power != null && !b.block.outputsPower) effc *= b.power.status;

    // OPT
    if(effc > 0.0 && rc.opt.length > 0) {
      optTup = _optTup(b, rc);
      if(rc.reqOpt && optTup == null) {
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
      iCap = rc.ci.iCap();
      while(i < iCap) {
        if(effc < 0.0001) return 0.0;
        tmp = rc.ci[i];
        if(!(tmp instanceof Array)) {
          amt = rc.ci[i + 1];
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
      iCap = rc.bi.iCap();
      while(i < iCap) {
        if(effc < 0.0001) return 0.0;
        tmp = rc.bi[i];
        if(!(tmp instanceof Array)) {
          amt = rc.bi[i + 1];
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
      iCap = rc.aux.iCap();
      while(i < iCap) {
        if(effc < 0.0001) return 0.0;
        tmp = rc.aux[i];
        amt = rc.aux[i + 1];
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
  exports._effc = _effc;


  /* <------------------------------ application ------------------------------ */


  /**
   * Lets a multi-crafter consume items.
   * @param {Building} b
   * @param {CLS_recipe} rc
   * @return {void}
   */
  const consume_itm = function(b, rc) {
    if((b.items == null || !b.items.any()) && b.liquids == null) return;

    // BI
    i = 0;
    iCap = rc.bi.iCap();
    while(i < iCap) {
      tmp = rc.bi[i];
      if(!(tmp instanceof Array)) {
        amt = rc.bi[i + 1];
        p = rc.bi[i + 2];
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
    optTup = _optTup(b, rc);
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
   * @param {CLS_recipe} rc
   * @param {number} progIncLiq
   * @return {void}
   */
  const consume_liq = function(b, rc, progIncLiq) {
    if(b.liquids == null || DEBUG.skipRcLiqCons) return;

    // CI
    i = 0;
    iCap = rc.ci.iCap();
    while(i < iCap) {
      tmp = rc.ci[i];
      if(!(tmp instanceof Array)) {
        amt = rc.ci[i + 1];
        b.liquids.remove(tmp, Math.min(amt * progIncLiq * rc.rcTimeScl, b.liquids.get(tmp)));
        b.delegee.consTmpObj[tmp.name] = amt;
      } else {
        j = 0;
        jCap = tmp.iCap();
        while(j < jCap) {
          if(b.liquids.get(tmp[j]) > 0.01) {
            amt = tmp[j + 1];
            b.liquids.remove(tmp[j], Math.min(amt * progIncLiq * rc.rcTimeScl, b.liquids.get(tmp[j])));
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
    iCap = rc.aux.iCap();
    while(i < iCap) {
      tmp = rc.aux[i];
      amt = rc.aux[i + 1];
      b.liquids.remove(tmp, Math.min(amt * progIncLiq, rc.rcTimeScl, b.liquids.get(tmp)));
      b.delegee.consTmpObj[tmp.name] = amt;
      i += 2;
    };
  };
  exports.consume_liq = consume_liq;


  /**
   * Lets a multi-crafter produce items.
   * @param {Building} b
   * @param {CLS_recipe} rc
   * @param {number} failP
   * @return {void}
   */
  const produce_itm = function(b, rc, failP) {
    failed = LCRand.chance(UTIL_rand.get("crafter"), failP);

    // BO
    if(!failed) {
      i = 0;
      iCap = rc.bo.iCap();
      while(i < iCap) {
        tmp = rc.bo[i];
        amt = rc.bo[i + 1];
        p = rc.bo[i + 2];
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
      iCap = rc.fo.iCap();
      b.ex_getFailEff().at(b);
      while(i < iCap) {
        tmp = rc.fo[i];
        amt = rc.fo[i + 1];
        p = rc.fo[i + 2];
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
   * @param {CLS_recipe} rc
   * @param {number} progIncLiq
   * @return {void}
   */
  const produce_liq = function(b, rc, progIncLiq) {
    if(b.liquids == null || DEBUG.skipRcLiqProd) return;

    // CO
    i = 0;
    iCap = rc.co.iCap();
    while(i < iCap) {
      tmp = rc.co[i];
      amt = rc.co[i + 1];
      if(TIMER.secTwo && amt > 0.0) {
        TRIGGER.fluidProduce.fire(b, tmp);
      };
      b.handleLiquid(b, tmp, Math.min(amt * progIncLiq * rc.rcTimeScl, b.block.liquidCapacity - b.liquids.get(tmp)));
      b.delegee.prodTmpObj[tmp.name] = amt;
      i += 2;
    };
  };
  exports.produce_liq = produce_liq;


  /**
   * Lets a multi-crafter dump resource in it.
   * @param {Building} b
   * @param {CLS_recipe} rc
   * @return {void}
   */
  const dump = function(b, rc) {
    dumpTup = rc.dumpTup;
    if(dumpTup == null || DEBUG.skipRcDump) return;

    if(b.liquids != null) {
      i = 0;
      iCap = rc.co.iCap();
      while(i < iCap) {
        tmp = rc.co[i];
        dir = (b.block.liquidOutputDirections.length > i / 2) ? b.block.liquidOutputDirections[i / 2] : -1;
        b.dumpLiquid(tmp, 2.0, dir);
        i += 2;
      };

      i = 0;
      iCap = dumpTup[1].iCap();
      while(i < iCap) {
        if(dumpTup[1][i] != null) {
          b.dumpLiquid(dumpTup[1][i], 2.0);
        };
        i++;
      };
    };
    if(b.items != null && b.timer.get(b.block.timerDump, b.block.dumpTime / b.timeScale)) {
      i = 0;
      iCap = dumpTup[0].iCap();
      while(i < iCap) {
        if(dumpTup[0][i] != null) {
          b.dump(dumpTup[0][i]);
        };
        i++;
      };
    };
  };
  exports.dump = dump;
