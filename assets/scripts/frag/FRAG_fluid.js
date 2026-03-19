/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods for liquid module.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- liquid module ----------> */


  /**
   * Adds liquid to some building.
   * @param {Building} b
   * @param {Building|null} b_f
   * @param {Liquid} liq
   * @param {number} rate - Can be negative for consumption.
   * @param {boolean|unset} [forced] - If true, liquid will be added regardless of `acceptLiquid`.
   * @param {boolean|unset} [returnFrac] - If true, an efficiency fraction is returned instead of amount transferred.
   * @param {boolean|unset} [noDelta] - If true, delta is not included in amount transferred.
   * @return {number}
   */
  const addLiquid = function(b, b_f, liq, rate, forced, returnFrac, noDelta) {
    let amtTrans = 0.0;
    if(b.liquids == null || (!forced && rate > 0.0 && !b.acceptLiquid(tryVal(b_f, b), liq))) return amtTrans;
    if(Math.abs(rate) < 0.0001) return amtTrans;

    let delta = noDelta ?
      (
        b_f == null ?
        1.0 :
        b_f.efficiency * b.timeScale
      ) :
      (
        b_f == null ?
          Time.delta :
          b_f.edelta()
      );
    amtTrans = rate > 0.0 ?
      Math.min(rate * delta, b.block.liquidCapacity - b.liquids.get(liq)) :
      -Math.min(-rate * delta, b.liquids.get(liq));
    b.handleLiquid(tryVal(b_f, b), liq, amtTrans);

    return returnFrac ? Math.abs(amtTrans / rate) : Math.abs(amtTrans);
  };
  exports.addLiquid = addLiquid;


  /**
   * Variant of {@link addLiquid} when a large amount of liquid is produced at once.
   * @param {Building} b
   * @param {Building|null} b_f
   * @param {Liquid} liq
   * @param {number} amt
   * @param {boolean|unset} [forced]
   * @return {number}
   */
  const addLiquidBatch = function(b, b_f, liq, amt, forced) {
    let amtTrans = 0.0;
    if(b.liquids == null || (!forced && amt > 0.0 && !b.acceptLiquid(tryVal(b_f, b), liq))) return amtTrans;
    if(Math.abs(amt) < 0.0001) return amtTrans;

    amtTrans = amt > 0.0 ?
      Math.min(amt, b.block.liquidCapacity - b.liquids.get(liq)) :
      -Math.min(-amt, b.liquids.get(liq));
    b.handleLiquid(tryVal(b_f, b), liq, amtTrans);

    return Math.abs(amtTrans);
  };
  exports.addLiquidBatch = addLiquidBatch;


  /**
   * Transfers liquid from `b` to `b_t`.
   * @param {Building} b
   * @param {Building|null} b_t
   * @param {Liquid} liq
   * @param {number} rate
   * @param {boolean|unset} [isActiveTrans] - If true, edelta of `b_t` will be used instead of `b`.
   * @return {number}
   */
  const transLiquid = function(b, b_t, liq, rate, isActiveTrans) {
    let amtTrans = 0.0;
    if(b_t == null) return amtTrans;
    if(b.liquids == null || b_t.liquids == null || !b_t.acceptLiquid(b, liq)) return amtTrans;
    if(Math.abs(rate) < 0.0001) return amtTrans;

    let amtCur = b.liquids.get(liq);
    if(amtCur < 0.0001) return amtTrans;
    let amtCur_t = b_t.liquids.get(liq);
    let cap_t = b_t.block.liquidCapacity;
    amtTrans = Math.min(Mathf.clamp((isActiveTrans ? b_t.edelta() : b.edelta()) * rate, 0.0, cap_t - amtCur_t), amtCur);

    b_t.handleLiquid(b, liq, amtTrans);
    b.liquids.remove(liq, amtTrans);

    return amtTrans;
  };
  exports.transLiquid = transLiquid;
