/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods for mathematical calculation.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- object ----------> */


  var cls = Object;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the sum of all numbers in a mapper object.
   * ---------------------------------------- */
  cls.mapSum = function(obj, mapF) {
    let val = 0.0;
    Object._it(obj, (key, val1) => {
      if(typeof val1 === "number") {
        mapF == null ?
          (val += val1) :
          (val += mapF(key, val1));
      };
    });

    return val;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the maximum value in a mapper object.
   * ---------------------------------------- */
  cls.mapMax = function(obj, mapF) {
    let val = 0.0;
    Object._it(obj, (key, val1) => {
      if(
        mapF == null ?
          val1 > val :
          mapF(key, val1) > val
      ) {
        val = val1;
      };
    });

    return val;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the minimum value in a mapper object.
   * ---------------------------------------- */
  cls.mapMin = function(obj, mapF) {
    let val = Number.n8;
    Object._it(obj, (key, val1) => {
      if(
        mapF == null ?
          val1 < val :
          mapF(key, val1) < val
      ) {
        val = val1;
      };
    });

    return val;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Mapper object comparison.
   * ---------------------------------------- */
  cls.mapSomeLargerThan = newMultiFunction(
    ["object", "object", "boolean"], function(obj1, obj2, includeEqual) {
      for(let key in obj1) {
        if(includeEqual ? tryVal(obj1[key], 0.0) >= tryVal(obj2[key], 0.0) : tryVal(obj1[key], 0.0) > tryVal(obj2[key], 0.0)) return true;
      };

      return false;
    },
    ["object", "number", "boolean"], function(obj, num, includeEqual) {
      for(let key in obj) {
        if(includeEqual ? tryVal(obj[key], 0.0) >= num : tryVal(obj[key], 0.0) > num) return true;
      };

      return false;
    },
    ["object", Array, "boolean"], function(obj, arr, includeEqual) {
      for(let key in obj) {
        if(includeEqual ? tryVal(obj[key], 0.0) >= arr.read(key, 0.0) : tryVal(obj[key], 0.0) > arr.read(key, 0.0)) return true;
      };

      return false;
    },
    ["object", Function, "boolean"], function(obj, valGetter, includeEqual) {
      for(let key in obj) {
        if(includeEqual ? tryVal(obj[key], 0.0) >= valGetter(key, tryVal(obj[key], 0.0)) : tryVal(obj[key], 0.0) > valGetter(key, tryVal(obj[key], 0.0))) return true;
      };

      return false;
    },
  );


  /* ----------------------------------------
   * NOTE:
   *
   * Mapper object comparison.
   * ---------------------------------------- */
  cls.mapAllLargerThan = function(obj1, obj2, includeEqual) {
    return !Object.mapSomeSmallerThan(obj1, obj2, !includeEqual);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Mapper object comparison.
   * ---------------------------------------- */
  cls.mapSomeSmallerThan = newMultiFunction(
    ["object", "object", "boolean"], function(obj1, obj2, includeEqual) {
      let i = 0;
      for(let key in obj1) {
        if(includeEqual ? tryVal(obj1[key], 0.0) <= tryVal(obj2[key], 0.0) : tryVal(obj1[key], 0.0) < tryVal(obj2[key], 0.0)) return true;
        i++;
      };

      return i === 0;
    },
    ["object", "number", "boolean"], function(obj, num, includeEqual) {
      let i = 0;
      for(let key in obj) {
        if(includeEqual ? tryVal(obj[key], 0.0) <= num : tryVal(obj[key], 0.0) < num) return true;
        i++;
      };

      return i === 0;
    },
    ["object", Array, "boolean"], function(obj, arr, includeEqual) {
      let i = 0;
      for(let key in obj) {
        if(includeEqual ? tryVal(obj[key], 0.0) <= arr.read(key, 0.0) : tryVal(obj[key], 0.0) < arr.read(key, 0.0)) return true;
        i++;
      };

      return i === 0;
    },
    ["object", Function, "boolean"], function(obj, valGetter, includeEqual) {
      let i = 0;
      for(let key in obj) {
        if(includeEqual ? tryVal(obj[key], 0.0) <= valGetter(key, tryVal(obj[key], 0.0)) : tryVal(obj[key], 0.0) < valGetter(key, tryVal(obj[key], 0.0))) return true;
        i++;
      };

      return i === 0;
    },
  );


  /* ----------------------------------------
   * NOTE:
   *
   * Mapper object comparison.
   * ---------------------------------------- */
  cls.mapAllSmallerThan = function(obj1, obj2, includeEqual) {
    return !Object.mapSomeLargerThan(obj1, obj2, !includeEqual);
  };


  /* <---------- number ----------> */


  var cls = Number;


  cls.intMax = java.lang.Integer.MAX_VALUE;
  cls.intMin = java.lang.Integer.MIN_VALUE;
  cls.fMax = java.lang.Float.MAX_VALUE;
  cls.fMin = java.lang.Float.MIN_VALUE;
  cls.n4 = 9999.0;
  cls.n6 = 999999.0;
  cls.n8 = 99999999.0;
  cls.n12 = 999999999999.0;


  var ptp = Number.prototype;


  /* ----------------------------------------
   * NOTE:
   *
   * Float equality.
   * ---------------------------------------- */
  ptp.fEqual = function(num, tol) {
    return Math.abs(this - num) < tryVal(tol, 0.0001);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Returns factorial of this number (rounded).
   * ---------------------------------------- */
  ptp.fac = function() {
    let iCap = Math.round(this) + 1;
    // 0! is 1
    if(iCap === 1) return 1;
    // No negative value
    if(iCap < 1) return NaN;

    let val = 1.0;
    let i = 1;
    while(i < iCap) {
      val *= i;
      i++;
    };

    return val;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Rounds the number for some digits.
   * ---------------------------------------- */
  ptp.roundFixed = function(deciAmt) {
    let mtp = Math.pow(10.0, tryVal(deciAmt, 2));

    return Math.round(this * mtp) / mtp;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a random integer with the number (floored) as maximum.
   * ---------------------------------------- */
  ptp.randInt = function(base) {
    let cap = Math.floor(this);
    if(base == null) base = 0;

    return Math.floor(Math.random() * (cap + 1 - base) + base);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets how many times something occurs at {p} with the number (floored) as amount of attempts.
   * ---------------------------------------- */
  ptp.randFreq = function(p) {
    var freq = 0;

    let iCap = Math.floor(this);
    if(iCap > 0) {
      for(let i = 0; i < iCap; i++) {
        if(Mathf.chance(p)) freq++;
      };
    };

    return freq;
  };


  /* <---------- array ----------> */


  var ptp = Array.prototype;


  /* ----------------------------------------
   * NOTE:
   *
   * Sums up numbers in the array.
   * ---------------------------------------- */
  ptp.sum = function(mapF) {
    var val = 0.0;

    let i = 0, iCap = this.iCap();
    if(mapF == null) {
      while(i < iCap) {
        val += this[i];
        i++;
      };
    } else {
      while(i < iCap) {
        val += mapF(this[i]);
        i++;
      };
    };

    return val;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets product of numbers in the array.
   * ---------------------------------------- */
  ptp.prod = function(mapF) {
    var val = 0.0;

    let i = 0, iCap = this.iCap();
    if(mapF == null) {
      while(i < iCap) {
        val *= this[i];
        i++;
      };
    } else {
      while(i < iCap) {
        val *= mapF(this[i]);
        i++;
      };
    };

    return val;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the mean value of a numeric array.
   * ---------------------------------------- */
  ptp.mean = function(mapF) {
    return this.sum(mapF) / this.length;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the power mean of a numeric array.
   * ---------------------------------------- */
  ptp.meanPow = function(pow) {
    return Math.pow(this.mean(num => Math.pow(num, pow)), 1.0 / pow);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Performs operation on this array and {arr}.
   * This array will be modified in the process.
   * ---------------------------------------- */
  ptp.operWith = function(arr, scr) {
    let iCap = this.iCap();
    if(iCap !== arr.length) ERROR_HANDLER.throw("arrayLengthMismatch");

    let i = 0;
    while(i < iCap) {
      this[i] = scr(this[i], arr[i]);
      i++;
    };

    return this;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Some commonly used operations.
   * ---------------------------------------- */
  ptp.addWith = function(arr) {return this.operWith(arr, (num1, num2) => num1 + num2)};
  ptp.subWith = function(arr) {return this.operWith(arr, (num1, num2) => num1 - num2)};
  ptp.mulWith = function(arr) {return this.operWith(arr, (num1, num2) => num1 * num2)};
  ptp.divWith = function(arr) {return this.operWith(arr, (num1, num2) => num1 / num2)};
  ptp.modWith = function(arr) {return this.operWith(arr, (num1, num2) => num1 % num2)};
  ptp.powWith = function(arr) {return this.operWith(arr, (num1, num2) => Math.pow(num1, num2))};


  /* ----------------------------------------
   * NOTE:
   *
   * Performs cumulative operation on this array.
   * Returns a new array.
   * ---------------------------------------- */
  ptp.cumOper = function(scr) {
    const arr = [];

    let tmp = 0.0;
    let i = 0, iCap = this.iCap();
    while(i < iCap) {
      let val = scr(tmp, this[i]);
      arr.push(val);
      tmp = val;
      i++;
    };

    return arr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Some commonly used cumulative operations.
   * ---------------------------------------- */
  ptp.cumSum = function() {return this.cumOper((valLast, val) => valLast + val)};
  ptp.cumProd = function() {return this.cumOper((valLast, val) => valLast * val)};


  /* ----------------------------------------
   * NOTE:
   *
   * Returns difference array of the given array.
   *
   * Example:
   * [0, 5, 12, 18, 12].diff();    // Returns [5, 7, 6, -6]
   * [0, 5, 12, 16, 12].diff(2);    // Returns [2, -1, -12]
   * ---------------------------------------- */
  ptp.diff = function thisFun(repeat) {
    if(repeat == null) repeat = 1;

    let arr0 = this;
    let i = 0;
    while(i < repeat) {
      arr0 = thisFun.applyDiff(arr0);
      i++;
    };

    return arr0;
  }
  .setProp({
    applyDiff: arr => {
      const arr0 = [];

      let i = 0, iCap = arr.iCap() - 1;
      while(i < iCap) {
        arr0.push(arr[i + 1] - arr[i]);
        i++;
      };

      return arr0;
    },
  });


  /* <---------- math ----------> */


  var cls = Math;


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: num1, num2, num3, ...
   * Mean value.
   * ---------------------------------------- */
  cls.mean = function() {
    return Array.from(arguments).mean();
  };


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: pow, num1, num2, num3, ...
   * Power mean.
   * ---------------------------------------- */
  cls.meanPow = function(pow) {
    return Array.from(arguments).splice(1).meanPow(pow);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Returns P(cap, amt).
   * ---------------------------------------- */
  cls.permutation = function(cap, amt) {
    return cap.fac() / (cap - amt).fac();
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Returns C(cap, amt).
   * ---------------------------------------- */
  cls.combination = function(cap, amt) {
    return cap.fac() / ((cap - amt).fac() * amt.fac());
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Greatest common divisor.
   * ---------------------------------------- */
  cls.gcd = function(a, b) {
    return b === 0 ? a : Math.gcd(b, a % b);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Lowest common multiplier.
   * ---------------------------------------- */
  cls.lcm = function(a, b) {
    return a * b / Math.gcd(a, b);
  };
