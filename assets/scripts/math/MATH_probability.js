/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods used to calculate chance and probability distribution.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- random ----------> */


  const rand = new Rand();
  const randSeed = new Rand();


  /* ----------------------------------------
   * NOTE:
   *
   * Prints a distribution array to console.
   * ---------------------------------------- */
  const printDis = function thisFun(disArr, lineAmt, astAmt, deciAmt1, deciAmt2) {
    if(disArr == null || disArr.length === 0) return;

    if(lineAmt == null) lineAmt = 15;
    if(astAmt == null) astAmt = 50;
    if(deciAmt1 == null) deciAmt1 = 2;
    if(deciAmt2 == null) deciAmt2 = 2;

    let base = Math.min.apply(null, disArr).roundFixed(deciAmt1);
    let cap = Math.max.apply(null, disArr).roundFixed(deciAmt1);
    let intv = (cap - base) / lineAmt;
    if(intv < 0.000001) return;

    thisFun.tmpArr.clear();
    thisFun.tmpArr1.clear();
    var i = 0;
    while(i < lineAmt) {
      let numStart = (base + intv * i).roundFixed(deciAmt1);
      let numEnd = (base + intv * (i + 1)).roundFixed(deciAmt2);
      let p = disArr.countBy(val => val > numStart && val < numEnd) / disArr.length;
      thisFun.tmpArr1.push(p);
      i++;
    };
    let minP = Math.min.apply(null, thisFun.tmpArr1);
    let maxP = Math.max.apply(null, thisFun.tmpArr1);
    var i = 0;
    while(i < lineAmt) {
      let numStart = (base + intv * i).roundFixed(deciAmt1);
      let numEnd = (base + intv * (i + 1)).roundFixed(deciAmt2);
      let p = thisFun.tmpArr1[i];
      let str = "(" + Strings.fixed(numStart, deciAmt1) + ", " + Strings.fixed(numEnd, deciAmt2) + ")"
        + "\n                         |" + "*".repeat(Math.round(((maxP - minP < 0.0001) ? 1.0 : ((p - minP) / (maxP - minP))) * astAmt)) + " " + p.perc(deciAmt2);
      thisFun.tmpArr.push(str);
      i++;
    };

    var str_fi = "[Lovec] Data distribution:\n";
    thisFun.tmpArr.forEachFast(str => str_fi += "\n" + str);
    Log.info(str_fi);
  }
  .setProp({
    tmpArr: [],
    tmpArr1: [],
  });
  exports.printDis = printDis;


  /* ----------------------------------------
   * NOTE:
   *
   * Generates a list of points that follow random distribution.
   * ---------------------------------------- */
  const _dis_rand = function(size, base, cap, seed) {
    const arr = [];

    if(size == null) size = 1;
    if(base == null) base = 0.0;
    if(cap == null) cap = 1.0;

    let i = 0;
    if(seed == null) {
      while(i < size) {
        arr.push(base + rand.nextFloat() * (cap - base));
        i++;
      };
    } else {
      while(i < size) {
        randSeed.setSeed(seed);
        arr.push(base + randSeed.nextFloat() * (cap - base));
        i++;
      };
    };

    return arr;
  };
  exports._dis_rand = _dis_rand;


  /* ----------------------------------------
   * NOTE:
   *
   * Generates a list of points that follow normal distribution.
   * ----------------------------------------
   * REFERENCE:
   *
   * <Marsaglia polar method>
   * ---------------------------------------- */
  const _dis_norm = function thisFun(size, mu, sigma) {
    const arr = [];

    if(size == null) size = 1;
    if(mu == null) mu = 0.0;
    if(sigma == null) sigma = 1.0;

    let i = 0;
    let x, y, s, tmp;
    while(i < size) {
      if(thisFun.tmpVal != null) {
        arr.push(thisFun.tmpVal * sigma + mu);
        thisFun.tmpVal = null;
      } else {
        s = 0.0;
        while(s >= 1.0 || s === 0.0) {
          x = Math.random() * 2.0 - 1.0;
          y = Math.random() * 2.0 - 1.0;
          s = Math.pow(x, 2) + Math.pow(y, 2);
        };
        tmp = Math.sqrt(-2.0 * Math.log(s) / s);
        thisFun.tmpVal = y * tmp;
        arr.push(tmp * x * sigma + mu);
      };
      i++;
    };

    return arr;
  }
  .setProp({
    tmpVal: null,
  });
  exports._dis_norm = _dis_norm;
