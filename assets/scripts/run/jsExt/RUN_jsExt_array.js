/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Extension for JavaScript array, with methods from various JS packages.
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


  /* <---------- array ----------> */


  var cls = Array;


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: ele, arr1, arr2, arr3, ...
   * Whether {ele} is found in any of those arrays.
   * ---------------------------------------- */
  cls.someIncludes = function() {
    let i = 1, iCap = arguments.length;
    while(i < iCap) {
      if(arguments[i].includes(arguments[0])) return true;
      i++;
    };

    return false;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: ele, arr1, arr2, arr3, ...
   * Whether {ele} is found in all those arrays.
   * ---------------------------------------- */
  cls.everyIncludes = function() {
    let i = 2, iCap = arguments.length;
    while(i < iCap) {
      if(!arguments[i].includes(arguments[0])) return false;
      i++;
    };

    return true;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: arr, shouldUpdateArr, ele1, ele2, ele3, ...
   * Whether given elements don't match the ones found in this array.
   * IF {shouldUpdateArr}, elements of this array will be replaced by the given arguments.
   * ---------------------------------------- */
  cls.someMismatch = function() {
    let arr = arguments[0];
    if(arr.length === 0) return true;

    let i = 2, j, iCap = arguments.length, jCap;
    while(i < iCap) {
      if(arguments[i] !== arr[i - 2]) {
        if(arguments[1]) {
          j = 2, jCap = iCap;
          while(j < jCap) {
            arr[j - 2] = arguments[j];
            j++;
          };
        };
        return true;
      };
      i++;
    };

    return false;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Returns an index array.
   * If {isStatistical}, this will starts at 1 instead of 0.
   * ---------------------------------------- */
  cls.getIndArr = function(len, isStatistical) {
    const arr = [];

    let i = 0;
    while(i < len) {
      arr.push(isStatistical ? (i + 1) : i);
      i++;
    };

    return arr;
  };


  var ptp = Array.prototype;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the first element, {null} if not found.
   * ---------------------------------------- */
  ptp.first = function() {
    return this[0] == null ? null : this[0];
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the last element, {null} if not found.
   * ---------------------------------------- */
  ptp.last = function() {
    return this.length === 0 ? null : this[this.length - 1];
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Returns index of the last element, 0 if empty array.
   * ---------------------------------------- */
  ptp.lastInd = function() {
    return this.length === 0 ? 0 : this.length - 1;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * 1. Returns a copy of this array.
   * 2. Copies elements from another array (overwrites this array).
   * ---------------------------------------- */
  ptp.cpy = newMultiFunction(
    [], function() {
      return this.slice();
    },
    [Array], function(arr) {
      return this.clear().pushAll(arr);
    },
  );


  /* ----------------------------------------
   * NOTE:
   *
   * Returns fraction of index (of given element) by array length.
   * ---------------------------------------- */
  ptp.getIndFrac = function(ele0ind, useInd, returnNull) {
    let ind = useInd ? ele0ind : this.indexOf(ele0ind);
    return ind < 0 ?
      (returnNull ? null : 0.0) :
      ((ind + 1) / this.length);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Pushes the element only when it is not in the array.
   * ---------------------------------------- */
  ptp.pushUnique = function(ele) {
    var cond = true;
    if(this.includes(ele)) cond = false;
    if(ele instanceof Array && this.some(ele0 => ele0 instanceof Array && ele0.equals(ele))) cond = false;
    if(cond) this.push(ele);

    return this;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Pushes the element only when it's not {null}.
   * Double equality so {undefined} won't be pushed.
   * ---------------------------------------- */
  ptp.pushNonNull = function(ele) {
    if(ele == null) return this;

    this.push(ele);

    return this;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Pushes every element from {arr_p} to the array.
   * In case of chaining, use this instead of {push}!
   * ---------------------------------------- */
  ptp.pushAll = function(eles_p) {
    !(eles_p instanceof Array) ?
      this.push(eles_p) :
      eles_p.forEachFast(ele => this.push(ele));

    return this;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Inserts an element at some index, modifying the original array.
   * ---------------------------------------- */
  ptp.insert = function(ele, ind) {
    let i = this.iCap(), iBase = ind;
    while(i > iBase) {
      this[i] = this[i - 1];
      i--;
    };
    this[ind] = ele;

    return this.length;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Batch variant of {insert}.
   * ---------------------------------------- */
  ptp.insertAll = function(eles_p, ind) {
    let eles = eles_p instanceof Array ? eles_p : [eles_p];
    let i = this.iCap(), iBase = ind, j = 0, jCap = eles.iCap();
    while(i > iBase) {
      this[i + jCap - 1] = this[i - 1];
      i--;
    };
    while(j < jCap) {
      this[ind + j] = eles[j];
      j++;
    };

    return this;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Removes the first matching element in the array.
   * ---------------------------------------- */
  ptp.remove = function(ele) {
    let ind = this.indexOf(ele);
    if(ind > -1) {
      return this.splice(ind, 1)[0];
    };

    return null;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Batch variant of {remove}.
   * ---------------------------------------- */
  ptp.removeAll = function(eles_p) {
    !(eles_p instanceof Array) ?
      this.remove(eles_p) :
      eles_p.forEachFast(ele => this.remove(ele));

    return this;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Remove some row in a formatted array.
   * Note that {rowInd} for the 1st row is {0}.
   * No negative index for reversed order.
   * ---------------------------------------- */
  ptp.removeRow = function(ord, rowInd) {
    if(ord == null) ord = 1;
    if(rowInd == null) rowInd = 0;
    // Don't remove anything if index is negative
    if(rowInd < 0) return;

    this.splice((rowInd + 1) * ord, ord);

    return this;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Removes all matching element in the array.
   * This does not return the array, in consistence with {push}.
   * Don't use this in chaining!
   * ---------------------------------------- */
  ptp.pull = function(ele) {
    while(this.includes(ele)) {
      this.remove(ele);
    };

    return this.length;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Batch variant of {pull}.
   * ---------------------------------------- */
  ptp.pullAll = function(eles_p) {
    !(eles_p instanceof Array) ?
      this.pull(eles_p) :
      eles_p.forEachFast(ele => this.pull(ele));

    return this;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Pulls out elements at the start of an array.
   * If {forResult}, this returns removed elements instead of the array.
   * ---------------------------------------- */
  ptp.shiftAll = function(amt, forResult) {
    if(amt == null) amt = 1;

    let i = 0;
    if(!forResult) {
      while(i < amt) {
        this.shift();
        i++;
      };
      return this;
    } else {
      let arr = [];
      while(i < amt) {
        arr.push(this.shift());
        i++;
      };
      return arr;
    };
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Puts elements at the start of an array.
   * Yep batch variant of {unshift}.
   * ---------------------------------------- */
  ptp.unshiftAll = function(eles_p) {
    !(eles_p instanceof Array) ?
      this.unshift(eles_p) :
      eles_p.reverse().forEachFast(ele => this.unshift(ele));

    return this;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Swaps position of two elements.
   * ---------------------------------------- */
  ptp.swap = function(ele1, ele2) {
    return this.swap(
      this.indexOf(ele1),
      this.indexOf(ele2),
    );
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Variant of {swap} using index.
   * ---------------------------------------- */
  ptp.swapByInd = function(ind1, ind2) {
    if(ind1 < 0 || ind2 < 0) return this;

    let tmp = this[ind2];
    this[ind2] = this[ind1];
    this[ind1] = tmp;

    return this;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Variant of {map} that don't return a new array.
   * ---------------------------------------- */
  ptp.inSituMap = function(mapF) {
    let i = 0, iCap = this.iCap();
    while(i < iCap) {
      this[i] = mapF(this[i]);
      i++;
    };

    return this;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Variant of {filter} that don't return a new array.
   * ---------------------------------------- */
  ptp.inSituFilter = function(boolF) {
    let i = 0, iCap = this.iCap();
    while(i < iCap) {
      if(!boolF(this[i])) this[i] = "!PENDING";
      i++;
    };
    this.pull("!PENDING");

    return this;
  };



  /* ----------------------------------------
   * NOTE:
   *
   * {sort} for purely numeric array, since native {sort} always treats elements as strings.
   * ---------------------------------------- */
  ptp.numSort = function(rev) {
    return this.sort((a, b) => rev ? (b - a) : (a - b));
  };


  /* ----------------------------------------
   * NOTE:
   *
   * {sort} for mixed-type array.
   * ---------------------------------------- */
  ptp.mixSort = function thisFun() {
    return this.sort((a, b) => {
      // Sort different types
      if(typeof a !== typeof b) return thisFun.ordList.indexOf(typeof a) - thisFun.ordList.indexOf(typeof b);
      // No need to sort objects
      if(typeof a === "object") return 0.0;

      return a === b ? 0.0 : ((a > b) ? 1.0 : - 1.0);
    });
  }
  .setProp({
    ordList: ["string", "number", "boolean", "undefined", "object"],
  });


  /* ----------------------------------------
   * NOTE:
   *
   * Randomizes the orders of elements in the array.
   * Can be used for a formatted array.
   * ---------------------------------------- */
  ptp.randomize = function(ord) {
    if(ord == null) ord = 1;

    let iCap = this.iCap();
    if(iCap === 0) return this;
    for(let i = iCap - ord, j; i > -1; i -= ord) {
      j = Math.round(Mathf.random(i / ord)) * ord;
      for(let k = 0; k < ord; k++) {
        let tmp = this[i + k];
        this[i + k] = this[j + k];
        this[j + k] = tmp;
      };
    };

    return this;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Replaces elements in the array.
   * Will modify this array.
   * Can be used for a formatted array.
   *
   * I won't call this REPLACE cauz it returns a new object for string.
   * ---------------------------------------- */
  ptp.substitute = function(mapF, ord, off) {
    if(ord == null) ord = 1;
    if(off == null) off = 0;

    let i = 0, iCap = this.iCap();
    while(i < iCap) {
      this[i + off] = mapF(this[i + off]);
      i += ord;
    };

    return this;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: ele1, ele2, ele3, ...
   * Whether any of the elements given is found in the array.
   * ---------------------------------------- */
  ptp.includesAny = function() {
    let i = 0, iCap = arguments.length;
    while(i < iCap) {
      if(this.includes(arguments[i])) return true;
      i++;
    };

    return false;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: ele1, ele2, ele3, ...
   * Whether all of the elements given are found in the array.
   * ---------------------------------------- */
  ptp.includesAll = function() {
    let i = 0, iCap = arguments.length;
    while(i < iCap) {
      if(!this.includes(arguments[i])) return false;
      i++;
    };

    return true;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the two arrays are equal with each other.
   * WTF why is this not defined?!
   * ---------------------------------------- */
  ptp.equals = function(arr, mapF) {
    let i = 0, iCap = this.iCap();
    if(iCap !== arr.length) return false;

    if(mapF == null) {
      while(i < iCap) {
        if(this[i] !== arr[i]) return false;
        i++;
      };
    } else {
      while(i < iCap) {
        if(mapF(this[i]) !== mapF(arr[i])) return false;
        i++;
      };
    };


    return true;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the two arrays equal each other regardless of order.
   * ---------------------------------------- */
  ptp.looseEquals = function(arr) {
    return this.cpy().mixSort().equals(arr.cpy().mixSort());
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this array contains another array (loose equality).
   * ---------------------------------------- */
  ptp.looseIncludes = function(arr) {
    let i = 0, iCap = this.iCap();
    while(i < iCap) {
      if(!(this[i] instanceof Array)) ERROR_HANDLER.throw("not3dArray");
      if(this[i].looseEquals(arr)) return true;
      i++;
    };

    return false;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {includes} used for formatted arrays.
   * ---------------------------------------- */
  ptp.colIncludes = function(ele, ord, off) {
    if(ord == null) ord = 1;
    if(off == null) off = 0;

    let i = off, iCap = this.iCap();
    while(i < iCap) {
      if(this[i] === ele) return true;
      i += ord;
    };

    return false;
  };



  /* ----------------------------------------
   * NOTE:
   *
   * Whether this array is a subset of another array.
   * ---------------------------------------- */
  ptp.subsetOf = function(arr) {
    const countArr = this.toCountArr();

    let i = 0, iCap = countArr.iCap();
    while(i < iCap) {
      if(arr.count(countArr[i]) < countArr[i + 1]) return false;
      i += 2;
    };
    countArr.clear();

    return true;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Counts how many times an element occurs in the array.
   * Can be used for a formatted array.
   * ---------------------------------------- */
  ptp.count = function(ele, mapF, ord, off) {
    let count = 0;
    if(ord == null) ord = 1;
    if(off == null) off = 0;

    let i = 0, iCap = this.iCap();
    if(mapF == null) {
      while(i < iCap) {
        if(this[i + off] === ele) count++;
        i += ord;
      };
    } else {
      while(i < iCap) {
        if(mapF(this[i + off]) === ele) count++;
        i += ord;
      };
    };

    return count;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Example:
   * [0, 1, 2, 1, 2, 3, 0, 4, 5].unique();    // Returns [0, 1, 2, 3, 4, 5]
   * ---------------------------------------- */
  ptp.unique = function(mapF) {
    const arr = [];

    let i = 0, iCap = this.iCap();
    if(mapF == null) {
      while(i < iCap) {
        if(!arr.includes(this[i])) arr.push(this[i]);
        i++;
      };
    } else {
      let tmpArr = [];
      while(i < iCap) {
        let tmp = mapF(this[i]);
        if(!tmpArr.includes(tmp)) {
          arr.push(this[i]);
          tmpArr.push(tmp);
        };
        i++;
      };
      tmpArr.clear();
    };

    return arr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Returns an array of random elements in the array.
   * ---------------------------------------- */
  ptp.sample = function(amt) {
    const arr = this.cpy().randomize();

    if(amt == null) amt = this.iCap();

    return amt >= arr.length ?
      arr :
      arr.slice(0, amt);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Example:
   * [0, 1, 2, 3, 4].intersect([2, 3, 4, 5, 6]);    // Returns [2, 3, 4]
   * ---------------------------------------- */
  ptp.intersect = function(eles_p, mapF) {
    const arr = [];

    let i = 0, iCap = this.iCap();
    if(mapF == null) {
      while(i < iCap) {
        if(!(eles_p instanceof Array) ? this[i] === eles_p : eles_p.includes(this[i])) {
          arr.push(ele);
        };
        i++;
      };
    } else {
      let tmpArr = [], tmp;
      if(eles_p instanceof Array) eles_p.forEachFast(ele => tmpArr.push(mapF(ele)));
      while(i < iCap) {
        tmp = mapF(this[i]);
        if(!(eles_p instanceof Array) ? tmp === mapF(eles_p) : tmpArr.includes(tmp)) {
          arr.push(ele);
        };
        i++;
      };
      tmpArr.clear();
    };

    return arr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Example:
   * [0, 1, 2, 3, 4].differ([2, 3, 4, 5, 6]);    // Returns [0, 1]
   * ---------------------------------------- */
  ptp.differ = function(eles_p, mapF) {
    const arr = [];

    let i = 0, iCap = this.iCap();
    if(mapF == null) {
      while(i < iCap) {
        if(!(eles_p instanceof Array) ? this[i] !== eles_p : !eles_p.includes(this[i])) {
          arr.push(ele);
        };
        i++;
      };
    } else {
      let tmpArr = [], tmp;
      if(eles_p instanceof Array) eles_p.forEachFast(ele => tmpArr.push(mapF(ele)));
      while(i < iCap) {
        tmp = mapF(this[i]);
        if(!(eles_p instanceof Array) ? tmp !== mapF(eles_p) : !tmpArr.includes(tmp)) {
          arr.push(ele);
        };
        i++;
      };
      tmpArr.clear();
    };

    return arr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Example:
   * [0, 1, 2, 3, 4, 5, 6].chunk(3);    // Returns [[0, 1, 2], [3, 4, 5], [6]]
   * [0, 1, 2, 3, 4, 5, 6].chunk(3, 0);    // Returns [[0, 1, 2], [3, 4, 5], [6, 0, 0]]
   * ---------------------------------------- */
  ptp.chunk = function(ord, def) {
    const arr = [];
    if(ord == null) ord = 1;

    let i = 0, j, iCap = Math.ceil(this.length / ord);
    while(i < iCap) {
      let tmpArr = [];
      j = 0;
      while(j < ord) {
        let tmp = this[i + j];
        if(tmp !== undefined) {
          tmpArr.push(tmp);
        } else if(def !== undefined) {
          tmpArr.push(def);
        };
        j++;
      };
      arr.push(tmpArr);
      i++;
    };

    return arr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Why is {Array.prototype.flat} absent?!
   *
   * Example:
   * [0, 1, [2, 3], [4, 5, 6]].flatten();    // Returns [0, 1, 2, 3, 4, 5, 6]
   * ---------------------------------------- */
  ptp.flatten = function() {
    const arr = [];

    let i = 0, iCap = this.iCap();
    while(i < iCap) {
      !(this[i] instanceof Array) ?
        arr.push(this[i]) :
        this[i].forEachFast(ele => arr.push(ele));
      i++;
    };

    return arr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Variant of {flatten} that ensures no array exists in the result (on most occassions excluding self-reference).
   * Very costy however.
   * ---------------------------------------- */
  ptp.flattenAll = function(maxTry) {
    let i = 0, iCap = tryVal(maxTry, 500), arr = this.flatten();
    while(i < iCap && arr.some(ele => ele instanceof Array)) {
      arr = arr.flatten();
      i++;
    };

    return arr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Returns a 2-array of elements and their frequencies.
   * Can be used for a formatted array.
   *
   * Example:
   * [0, 0, 1, 2, 3, 3, 3, 4].toCountArr()    // Returns [0, 2, 1, 1, 2, 1, 3, 3, 4, 1]
   * ---------------------------------------- */
  ptp.toCountArr = function(ord, off) {
    const arr = [];
    if(ord == null) ord = 1;
    if(off == null) off = 0;

    let i = 0, iCap = this.iCap();
    while(i < iCap) {
      let tmp = this[i + off];
      if(arr.read(tmp, 0) === 0) {
        arr.push(tmp, this.count(tmp));
      };
      i += ord;
    };

    return arr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Returns an object of categories and lists of elements, whose category is determined in {categGetter}.
   * If the category returned in {categGetter} is {null} for some element, it will be skipped.
   * ---------------------------------------- */
  ptp.categorize = function(categGetter) {
    let key;
    return this.reduce((obj, ele) => {
      key = categGetter(ele);
      if(key == null) return obj;
      if(obj[key] === undefined) obj[key] = [];
      obj[key].push(ele);
      return obj;
    }, {});
  };


  /* ----------------------------------------
   * NOTE:
   *
   * How many rows (or lines) this formatted array has.
   *
   * Example:
   * [0, 1, 2, 0, 2, 3, 0, 3, 4, 0].rowAmt(3);    // Returns 4
   * ---------------------------------------- */
  ptp.rowAmt = function(ord) {
    if(this.length === 0) return 0;
    if(ord == null) ord = 1;

    return (this.length - this.length % ord) / ord + Number(this.length % ord !== 0);
  };


  // Condition checking for read & write methods
  function checkArrayRow(nms, arr, rowInd, isUnordered) {
    let i = 0, iCap = nms.iCap();
    if(!isUnordered) {
      while(i < iCap) {
        if(arr[rowInd + i] !== nms[i]) return false;
        i++;
      };
      return true;
    } else {
      let tmpArr = [];
      while(i < iCap) {
        tmpArr.push(arr[rowInd + i]);
        i++;
      };
      return nms.looseEquals(tmpArr);
    };
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Reads data from a formatted array.
   * Use {def} for default value.
   * Use {isUnordered} to ignore order of the elements.
   * If there are multiple matching results, this only returns the first one.
   *
   * Given a target row of {0, 1, 2, 3}, then {nms_p} should be {[0, 1, 2]}.
   * ---------------------------------------- */
  ptp.read = function(nms_p, def, isUnordered) {
    let i = 0, iCap = this.iCap();
    let nms = nms_p instanceof Array ? nms_p : [nms_p];
    let jCap = nms.iCap();
    while(i < iCap) {
      if(checkArrayRow(nms, this, i, isUnordered)) return this[i + jCap];
      i += jCap + 1;
    };

    return def;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Like {read} but returns the row index.
   * Will return {-1} if not found.
   * ---------------------------------------- */
  ptp.readRowInd = function(nms_p, isUnordered) {
    let i = 0, iCap = this.iCap();
    let nms = nms_p instanceof Array ? nms_p : [nms_p];
    let jCap = nms.iCap();
    while(i < iCap) {
      if(checkArrayRow(nms, this, i, isUnordered)) return Math.round(i / (jCap + 1));
      i += jCap + 1;
    };

    return -1;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Returns an array of elements with the same offset (in the same column) in a formatted array.
   * ---------------------------------------- */
  ptp.readCol = function(ord, off) {
    const arr = [];
    if(ord == null) ord = 1;
    if(off == null) off = 0;

    let i = 0, iCap = this.iCap();
    while(i < iCap) {
      arr.push(this[i + off]);
      i += ord;
    };

    return arr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Returns a random element.
   * Supports formatted array.
   * ---------------------------------------- */
  ptp.readRand = function(ord, off, def) {
    if(this.length === 0) return null;

    if(ord == null) ord = 1;
    if(off == null) off = 0;

    let val = this[Math.round((this.rowAmt(ord) - 1).randInt() * ord + off)];

    return val == null ? def : val;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Returns a random element that is not found in {refArr}.
   * Supports formatted array.
   * ---------------------------------------- */
  ptp.readRandUnique = function(refArr, mapF, ord, off, def, maxTry) {
    if(this.length === 0) return null;

    if(mapF == null) mapF = Function.airSelf;
    if(ord == null) ord = 1;
    if(off == null) off = 0;
    if(maxTry == null) maxTry = 50;

    let tmp = "!PENDING";
    let i = 0;
    while(tmp === "!PENDING" && i < maxTry) {
      tmp = this[Math.round((this.rowAmt(ord) - 1).randInt() * ord + off)];
      if(refArr.includes(mapF(tmp))) {
        tmp = "!PENDING";
      } else break;
      i++;
    };

    return tmp === "!PENDING" ? null : tmp;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Reads data from a formatted array, and returns the results as an array.
   * Mostly useful when there are multiple matching results.
   * ---------------------------------------- */
  ptp.readList = function(nms_p, isUnordered) {
    const arr = [];

    let i = 0, iCap = this.iCap();
    let nms = nms_p instanceof Array ? nms_p : [nms_p];
    let jCap = nms.iCap();
    while(i < iCap) {
      if(checkArrayRow(nms, this, i, isUnordered)) arr.push(this[i + jCap]);
      i += jCap + 1;
    };

    return arr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * The other side of {read}, pretty much obvious.
   * ---------------------------------------- */
  ptp.write = function(nms_p, val, isUnordered) {
    let i = 0, iCap = this.iCap();
    let nms = nms_p instanceof Array ? nms_p : [nms_p];
    let jCap = nms.iCap();
    while(i < iCap) {
      if(checkArrayRow(nms, this, i, isUnordered)) {
        this[i + jCap] = val;
        return this;
      };
      i += jCap + 1;
    };

    this.pushAll(nms);
    this.push(val);

    return this;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Removes the first matching row in a formatted array.
   * ---------------------------------------- */
  ptp.removeFormatRow = function(nms_p, isUnordered) {
    let i = 0, iCap = this.iCap();
    let nms = nms_p instanceof Array ? nms_p : [nms_p];
    let jCap = nms.iCap();
    let ind = null;
    while(i < iCap) {
      if(checkArrayRow(nms, this, i, isUnordered)) ind = i;
      i += jCap + 1;
    };

    if(ind != null) {
      this.splice(ind, jCap + 1);
    };

    return this;
  };
