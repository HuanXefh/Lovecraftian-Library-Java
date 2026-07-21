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
   * Increases some number in a number mapper object.
   * @param {Object<string, number>} obj
   * @param {string} key
   * @param {number|unset} [num]
   * @return {number}
   */
  Object.mapIncre = function(obj, key, num) {
    if(typeof obj[key] !== "number") obj[key] = 0.0;
    obj[key] += tryVal(num, 1.0);
    return obj[key];
  };


  /**
   * Sums all numbers in a number mapper object.
   * @param {Object<string: number>} obj
   * @param {(function(string, number): void)|unset} [mapF] - `ARGS`: key, val.
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
   * Finds largest value in a number mapper object.
   * @param {Object<string: number>} obj
   * @param {(function(string, number): void)|unset} [mapF] - `ARGS`: key, val.
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
   * Finds smallest value in a number mapper object.
   * @param {Object<string: number>} obj
   * @param {(function(string, number): void)|unset} [mapF] - `ARGS`: key, val.
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
   * Number mapper object comparison.
   * <br> `ARGS`: obj1, obj2, includeEqual.
   * <br> `ARGS`: obj1, num, includeEqual.
   * <br> `ARGS`: obj1, arr, includeEqual.
   * <br> `ARGS`: obj1, valGetter, includeEqual.
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
   * Number mapper object comparison.
   * <br> `ARGS`: obj1, obj2, includeEqual.
   * <br> `ARGS`: obj1, num, includeEqual.
   * <br> `ARGS`: obj1, arr, includeEqual.
   * <br> `ARGS`: obj1, valGetter, includeEqual.
   * @return {boolean}
   */
  Object.mapAllLargerThan = function(obj, arg, includeEqual) {
    return !Object.mapSomeSmallerThan(obj, arg, !includeEqual);
  };


  /**
   * Number mapper object comparison.
   * <br> `ARGS`: obj1, obj2, includeEqual.
   * <br> `ARGS`: obj1, num, includeEqual.
   * <br> `ARGS`: obj1, arr, includeEqual.
   * <br> `ARGS`: obj1, valGetter, includeEqual.
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
   * Number mapper object comparison.
   * <br> `ARGS`: obj1, obj2, includeEqual.
   * <br> `ARGS`: obj1, num, includeEqual.
   * <br> `ARGS`: obj1, arr, includeEqual.
   * <br> `ARGS`: obj1, valGetter, includeEqual.
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
    return deciAmt == null ?
      LCNumber.roundFixed(this) :
      LCNumber.roundFixed(this, deciAmt);
  };


  /**
   * Gets a random integer between `base` and this number (floored).
   * @param {number|unset} [base]
   * @return {number}
   */
  Number.prototype.randInt = function(base) {
    return base == null ?
      LCNumber.randInt(this) :
      LCNumber.randInt(base, this);
  };


  /**
   * Let `p` be the probability of occurrence, floored result of this number be the amount of attempts, this method returns how many times something occurs (random result).
   * @param {number} p
   * @return {number}
   */
  Number.prototype.randFreq = function(p) {
    return LCNumber.randFreq(this, p);
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
    return mapF == null ?
      LCNativeArray.sum(this) :
      LCNativeArray.sum(this, mapF);
  };


  /**
   * Gets product of numbers in this array.
   * @param {(function(any): number)|unset} [mapF]
   * @return {number}
   */
  Array.prototype.prod = function(mapF) {
    return mapF == null ?
      LCNativeArray.prod(this) :
      LCNativeArray.prod(this, mapF);
  };


  /**
   * Gets mean of numbers in this array.
   * @param {(function(any): number)|unset} [mapF]
   * @return {number}
   */
  Array.prototype.mean = function(mapF) {
    return mapF == null ?
      LCNativeArray.mean(this) :
      LCNativeArray.mean(this, mapF);
  };


  /**
   * Gets power mean of a numeric array.
   * @param {number} pow
   * @return {number}
   */
  Array.prototype.meanPow = function(pow) {
    return LCNativeArray.meanPow(this, pow);
  };


  /**
   * Performs some operation on this array and `arr`.
   * This array will be modified.
   * @param {Array} arr
   * @param {function(any, any): any} fun
   * @return {this}
   */
  Array.prototype.operWith = function(arr, fun) {
    return LCNativeArray.operWith(this, arr, fun);
  };


  /**
   * Lets this array add another array.
   * @param {Array<number>} arr
   * @return {this}
   */
  Array.prototype.addWith = function(arr) {
    return LCNativeArray.addWith(this, arr);
  };


  /**
   * Lets this array subtracts another array.
   * @param {Array<number>} arr
   * @return {this}
   */
  Array.prototype.subWith = function(arr) {
    return LCNativeArray.subWith(this, arr);
  };


  /**
   * Lets this array multiplies another array.
   * @param {Array<number>} arr
   * @return {this}
   */
  Array.prototype.mulWith = function(arr) {
    return LCNativeArray.mulWith(this, arr);
  };


  /**
   * Lets this array divides another array.
   * @param {Array<number>} arr
   * @return {this}
   */
  Array.prototype.divWith = function(arr) {
    return LCNativeArray.divWith(this, arr);
  };


  /**
   * Lets this array mods another array.
   * @param {Array<number>} arr
   * @return {this}
   */
  Array.prototype.modWith = function(arr) {
    return LCNativeArray.modWith(this, arr);
  };


  /**
   * Applies power operation on this array (base) and another array (power).
   * @param {Array<number>} arr
   * @return {this}
   */
  Array.prototype.powWith = function(arr) {
    return LCNativeArray.powWith(this, arr);
  };


  /**
   * Performs cumulative operation on this array.
   * Result is returned as a new array.
   * @param {function(number, any): number} fun - `ARGS`: result, valCur.
   * @return {Array<number>}
   */
  Array.prototype.cumOper = function(fun) {
    return LCNativeArray.cumOper(this, fun);
  };


  /**
   * Performs cumulative sum on this array.
   * @return {Array<number>}
   */
  Array.prototype.cumSum = function() {
    return LCNativeArray.cumSum(this);
  };


  /**
   * Performs cumulative multiplication on this array.
   * @return {Array<number>}
   */
  Array.prototype.cumProd = function() {
    return LCNativeArray.cumProd(this);
  };


  /**
   * Gets difference array of this array.
   * @param {number|unset} [repeat]
   * @return {Array<number>}
   * @example
   * [0, 5, 12, 18, 12].diff();                // Returns [5, 7, 6, -6]
   * [0, 5, 12, 18, 12].diff(2);                // Returns [2, -1, -12]
   */
  Array.prototype.diff = function(repeat) {
    return repeat == null ?
      LCNativeArray.diff(this) :
      LCNativeArray.diff(this, repeat);
  };


/*
  ========================================
  Section: Definition (Math)
  ========================================
*/


  /**
   * Get mean of given numbers.
   * <br> `ARGS`: num1, num2, num3, ...
   * @return {number}
   */
  Math.mean = function() {
    return Array.from(arguments).mean();
  };


  /**
   * Get power mean of given numbers.
   * <br> `ARGS`: pow, num1, num2, num3, ...
   * @param {number} pow
   * @return {number}
   */
  Math.meanPow = function(pow) {
    return Array.from(arguments).splice(1).meanPow(pow);
  };


  /**
   * Gets P(n, x).
   * @param {number} n
   * @param {number} x
   * @return {number}
   */
  Math.permutation = function(n, x) {
    return LCMathFunc.permutation(n, x);
  };


  /**
   * Gets C(n, x).
   * @param {number} n
   * @param {number} x
   * @return {number}
   */
  Math.combination = function(n, x) {
    return LCMathFunc.combination(n, x);
  };


  /**
   * Gets greatest common divisor.
   * @param {number} a
   * @param {number} b
   * @return {number}
   */
  Math.gcd = function(a, b) {
    return LCMathFunc.gcd(a, b);
  };


  /**
   * Gets lowest common multiplier.
   * @param {number} a
   * @param {number} b
   * @return {number}
   */
  Math.lcm = function(a, b) {
    return LCMathFunc.lcm(a, b);
  };
