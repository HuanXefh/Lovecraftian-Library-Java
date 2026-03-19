/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods for mathematical calculation.
   */


/*
  ========================================
  Section: Definition (Object)
  ========================================
*/


  /**
   * Sums all numbers in a mapper object.
   * @param {Object<string: number>} obj
   * @param {(function(string, number): void)|unset} [mapF] - <ARGS>: key, val.
   * @return {number}
   */
  Object.mapSum = function(obj, mapF) {
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


  /**
   * Finds largest value in a mapper object.
   * @param {Object<string: number>} obj
   * @param {(function(string, number): void)|unset} [mapF] - <ARGS>: key, val.
   * @return {number}
   */
  Object.mapMax = function(obj, mapF) {
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


  /**
   * Finds smallest value in a mapper object.
   * @param {Object<string: number>} obj
   * @param {(function(string, number): void)|unset} [mapF] - <ARGS>: key, val.
   * @return {number}
   */
  Object.mapMin = function(obj, mapF) {
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


  /**
   * Mapper object comparison.
   * <br> <ARGS>: obj1, obj2, includeEqual.
   * <br> <ARGS>: obj1, num, includeEqual.
   * <br> <ARGS>: obj1, arr, includeEqual.
   * <br> <ARGS>: obj1, valGetter, includeEqual.
   * @return {boolean}
   */
  Object.mapSomeLargerThan = newMultiFunction(
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


  /**
   * Mapper object comparison.
   * <br> <ARGS>: obj1, obj2, includeEqual.
   * <br> <ARGS>: obj1, num, includeEqual.
   * <br> <ARGS>: obj1, arr, includeEqual.
   * <br> <ARGS>: obj1, valGetter, includeEqual.
   * @return {boolean}
   */
  Object.mapAllLargerThan = function(obj, arg, includeEqual) {
    return !Object.mapSomeSmallerThan(obj, arg, !includeEqual);
  };


  /**
   * Mapper object comparison.
   * <br> <ARGS>: obj1, obj2, includeEqual.
   * <br> <ARGS>: obj1, num, includeEqual.
   * <br> <ARGS>: obj1, arr, includeEqual.
   * <br> <ARGS>: obj1, valGetter, includeEqual.
   * @return {boolean}
   */
  Object.mapSomeSmallerThan = newMultiFunction(
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


  /**
   * Mapper object comparison.
   * <br> <ARGS>: obj1, obj2, includeEqual.
   * <br> <ARGS>: obj1, num, includeEqual.
   * <br> <ARGS>: obj1, arr, includeEqual.
   * <br> <ARGS>: obj1, valGetter, includeEqual.
   * @return {boolean}
   */
  Object.mapAllSmallerThan = function(obj1, obj2, includeEqual) {
    return !Object.mapSomeLargerThan(obj1, obj2, !includeEqual);
  };


/*
  ========================================
  Section: Definition (Number)
  ========================================
*/


  Number.intMax = java.lang.Integer.MAX_VALUE;
  Number.intMin = java.lang.Integer.MIN_VALUE;
  Number.fMax = java.lang.Float.MAX_VALUE;
  Number.fMin = java.lang.Float.MIN_VALUE;
  Number.n4 = 9999.0;
  Number.n6 = 999999.0;
  Number.n8 = 99999999.0;
  Number.n12 = 999999999999.0;


  /**
   * Float equality.
   * @param {number} num
   * @param {number|unset} [tol]
   * @return {boolean}
   */
  Number.prototype.fEqual = function(num, tol) {
    return Math.abs(this - num) < tryVal(tol, 0.0001);
  };


  /**
   * Gets factorial of this number (rounded).
   * @return {number}
   */
  Number.prototype.fac = function() {
    let num = Math.round(this);
    // No negative value
    if(num < 0) return NaN;

    return LCMathFunc.factorial(num);
  };


  /**
   * Rounds this number for some digits.
   * @param {number|unset} [deciAmt]
   * @return {number}
   */
  Number.prototype.roundFixed = function(deciAmt) {
    let mtp = Math.pow(10.0, tryVal(deciAmt, 2));

    return Math.round(this * mtp) / mtp;
  };


  /**
   * Gets a random integer between `base` and this number (floored).
   * @param {number|unset} [base]
   * @return {number}
   */
  Number.prototype.randInt = function(base) {
    let cap = Math.floor(this);
    if(base == null) base = 0;

    return Math.floor(Math.random() * (cap + 1 - base) + base);
  };


  /**
   * Let `p` be the probability of occurrence, floored result of this number be the amount of attempts, this method returns how many times something occurs (random result).
   * @param {number} p
   * @return {number}
   */
  Number.prototype.randFreq = function(p) {
    let freq = 0;

    let iCap = Math.floor(this);
    if(iCap > 0) {
      for(let i = 0; i < iCap; i++) {
        if(Mathf.chance(p)) freq++;
      };
    };

    return freq;
  };


/*
  ========================================
  Section: Definition (Array)
  ========================================
*/


  /**
   * Gets sum of numbers in this array.
   * @param {(function(any): number)|unset} [mapF]
   * @return {number}
   */
  Array.prototype.sum = function(mapF) {
    let val = 0.0;

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


  /**
   * Gets product of numbers in this array.
   * @param {(function(any): number)|unset} [mapF]
   * @return {number}
   */
  Array.prototype.prod = function(mapF) {
    let val = 0.0;

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


  /**
   * Gets mean of numbers in this array.
   * @param {(function(any): number)|unset} [mapF]
   * @return {number}
   */
  Array.prototype.mean = function(mapF) {
    return this.sum(mapF) / this.length;
  };


  /**
   * Gets power mean of a numeric array.
   * @param {number} pow
   * @return {number}
   */
  Array.prototype.meanPow = function(pow) {
    return Math.pow(this.mean(num => Math.pow(num, pow)), 1.0 / pow);
  };


  /**
   * Performs some operation on this array and `arr`.
   * This array will be modified.
   * @param {Array} arr
   * @param {function(any, any): any} scr
   * @return {this}
   */
  Array.prototype.operWith = function(arr, scr) {
    let iCap = this.iCap();
    if(iCap !== arr.length) ERROR_HANDLER.throw("arrayLengthMismatch");

    let i = 0;
    while(i < iCap) {
      this[i] = scr(this[i], arr[i]);
      i++;
    };

    return this;
  };


  /**
   * Lets this array add another array.
   * @param {Array<number>} arr
   * @return {this}
   */
  Array.prototype.addWith = function(arr) {return this.operWith(arr, (num1, num2) => num1 + num2)};


  /**
   * Lets this array subtracts another array.
   * @param {Array<number>} arr
   * @return {this}
   */
  Array.prototype.subWith = function(arr) {return this.operWith(arr, (num1, num2) => num1 - num2)};


  /**
   * Lets this array multiplies another array.
   * @param {Array<number>} arr
   * @return {this}
   */
  Array.prototype.mulWith = function(arr) {return this.operWith(arr, (num1, num2) => num1 * num2)};


  /**
   * Lets this array divides another array.
   * @param {Array<number>} arr
   * @return {this}
   */
  Array.prototype.divWith = function(arr) {return this.operWith(arr, (num1, num2) => num1 / num2)};


  /**
   * Lets this array mods another array.
   * @param {Array<number>} arr
   * @return {this}
   */
  Array.prototype.modWith = function(arr) {return this.operWith(arr, (num1, num2) => num1 % num2)};


  /**
   * Applies power operation on this array (base) and another array (power).
   * @param {Array<number>} arr
   * @return {this}
   */
  Array.prototype.powWith = function(arr) {return this.operWith(arr, (num1, num2) => Math.pow(num1, num2))};


  /**
   * Performs cumulative operation on this array.
   * Result is returned as a new array.
   * @param {function(number, any): number} scr - <ARGS>: result, valCur.
   * @return {Array<number>}
   */
  Array.prototype.cumOper = function(scr) {
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


  /**
   * Performs cumulative sum on this array.
   * @return {Array<number>}
   */
  Array.prototype.cumSum = function() {return this.cumOper((valLast, val) => valLast + val)};


  /**
   * Performs cumulative multiplication on this array.
   * @return {Array<number>}
   */
  Array.prototype.cumProd = function() {return this.cumOper((valLast, val) => valLast * val)};


  /**
   * Gets difference array of this array.
   * @param {number|unset} [repeat]
   * @return {Array<number>}
   * @example
   * [0, 5, 12, 18, 12].diff();                // Returns [5, 7, 5, -6]
   * [0, 5, 12, 18, 12].diff(2);                // Returns [2, -2, 11]
   */
  Array.prototype.diff = function thisFun(repeat) {
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


/*
  ========================================
  Section: Definition (Math)
  ========================================
*/


  /**
   * Get mean of given numbers.
   * <br> <ARGS>: num1, num2, num3, ...
   * @return {number}
   */
  Math.mean = function() {
    return Array.from(arguments).mean();
  };


  /**
   * Get power mean of given numbers.
   * <br> <ARGS>: pow, num1, num2, num3, ...
   * @param {number} pow
   * @return {number}
   */
  Math.meanPow = function(pow) {
    return Array.from(arguments).splice(1).meanPow(pow);
  };


  /**
   * Gets `P(cap, amt)`.
   * @param {number} cap
   * @param {number} amt
   * @return {number}
   */
  Math.permutation = function(cap, amt) {
    return cap.fac() / (cap - amt).fac();
  };


  /**
   * Gets `C(cap, amt)`.
   * @param {number} cap
   * @param {number} amt
   * @return {number}
   */
  Math.combination = function(cap, amt) {
    return cap.fac() / ((cap - amt).fac() * amt.fac());
  };


  /**
   * Gets greatest common divisor.
   * @param {number} a
   * @param {number} b
   * @return {number}
   */
  Math.gcd = function(a, b) {
    return b === 0 ? a : Math.gcd(b, a % b);
  };


  /**
   * Gets lowest common multiplier.
   * @param {number} a
   * @param {number} b
   * @return {number}
   */
  Math.lcm = function(a, b) {
    return a * b / Math.gcd(a, b);
  };
