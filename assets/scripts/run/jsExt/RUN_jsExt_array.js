/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Extension for JavaScript array, with methods from various JS packages.
   */


/*
  ========================================
  Section: Definition (Array)
  ========================================
*/


  /* <------------------------------ property ------------------------------ */


  /**
   * Gets first element, null if not found.
   * @return {any}
   */
  Array.prototype.first = function() {
    return this[0] == null ? null : this[0];
  };


  /**
   * Gets last element, null if not found.
   * @return {any}
   */
  Array.prototype.last = function() {
    return this.length === 0 ? null : this[this.length - 1];
  };


  /**
   * Gets index of the last element, 0 if empty array.
   * @return {number}
   */
  Array.prototype.lastInd = function() {
    return this.length === 0 ? 0 : this.length - 1;
  };


  /**
   * Gets fraction of index of some element by array length.
   * @param {any} ele
   * @param {boolean|unset} [useInd] - If true, `ele` will be treated as index directly.
   * @param {boolean|unset} [returnNull] - If true, this method will return null instead of 0.0 if element not in the array.
   * @return {number|null}
   */
  Array.prototype.getIndFrac = function(ele, useInd, returnNull) {
    let ind = useInd ? ele : this.indexOf(ele);
    return ind < 0 ?
      (returnNull ? null : 0.0) :
      ((ind + 1) / this.length);
  };


  /* <------------------------------ condition ------------------------------ */


  /**
   * Whether `ele` is found in any of these arrays.
   * <br> <ARGS>: ele, arr1, arr2, arr3, ...
   * @return {boolean}
   */
  Array.someIncludes = function() {
    let i = 1, iCap = arguments.length;
    while(i < iCap) {
      if(arguments[i].includes(arguments[0])) return true;
      i++;
    };

    return false;
  };


  /**
   * Whether `ele` is found in all these arrays.
   * <br> <ARGS>: ele, arr1, arr2, arr3, ...
   * @return {boolean}
   */
  Array.everyIncludes = function() {
    let i = 2, iCap = arguments.length;
    while(i < iCap) {
      if(!arguments[i].includes(arguments[0])) return false;
      i++;
    };

    return true;
  };


  /**
   * Whether any of the given elements is found in this array.
   * <br> <ARGS>: ele1, ele2, ele3, ...
   * @return {boolean}
   */
  Array.prototype.includesAny = function() {
    let i = 0, iCap = arguments.length;
    while(i < iCap) {
      if(this.includes(arguments[i])) return true;
      i++;
    };

    return false;
  };


  /**
   * Whether all the given elements are found in this array.
   * <br> <ARGS>: ele1, ele2, ele3, ...
   * @return {boolean}
   */
  Array.prototype.includesAll = function() {
    let i = 0, iCap = arguments.length;
    while(i < iCap) {
      if(!this.includes(arguments[i])) return false;
      i++;
    };

    return true;
  };


  /**
   * Whether this array equals the given array.
   * @param {Array} arr
   * @param {(function(any): boolean)|unset} [mapF]
   * @return {boolean}
   */
  Array.prototype.equals = function(arr, mapF) {
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


  /**
   * Variant of {@link Array#equals} that ignores order of elements.
   * @param {Array} arr
   * @return {boolean}
   */
  Array.prototype.looseEquals = function(arr) {
    return Array.prototype.looseEquals.tmpArr1.cpy(this).mixSort().equals(Array.prototype.looseEquals.tmpArr2.cpy(arr).mixSort());
  };
  Array.prototype.looseEquals.tmpArr1 = [];
  Array.prototype.looseEquals.tmpArr2 = [];


  /**
   * Whether this array contains another array (loose equality).
   * Used for 2D-array.
   * @param {Array} arr
   * @return {boolean}
   */
  Array.prototype.looseIncludes = function(arr) {
    let i = 0, iCap = this.iCap();
    while(i < iCap) {
      if(!(this[i] instanceof Array)) ERROR_HANDLER.throw("not2dArray");
      if(this[i].looseEquals(arr)) return true;
      i++;
    };

    return false;
  };


  /**
   * Variant of {@link Array#includes} used for formatted arrays.
   * @param {any} ele
   * @param {number|unset} [ord]
   * @param {number|unset} [off]
   * @return {boolean}
   */
  Array.prototype.colIncludes = function(ele, ord, off) {
    if(ord == null) ord = 1;
    if(off == null) off = 0;

    let i = off, iCap = this.iCap();
    while(i < iCap) {
      if(this[i] === ele) return true;
      i += ord;
    };

    return false;
  };


  /**
   * Whether this array is a subset of another array.
   * @param {Array} arr
   * @return {boolean}
   */
  Array.prototype.subsetOf = function(arr) {
    const countArr = this.toCountArr();

    let i = 0, iCap = countArr.iCap();
    while(i < iCap) {
      if(arr.count(countArr[i]) < countArr[i + 1]) return false;
      i += 2;
    };
    countArr.clear();

    return true;
  };


  /* <------------------------------ modification ------------------------------ */


  /**
   * Variant of {@link Array#push} that only pushes the element when it's not in the array.
   * @param {any} ele
   * @return {this}
   */
  Array.prototype.pushUnique = function(ele) {
    let cond = true;
    if(this.includes(ele)) cond = false;
    if(ele instanceof Array && this.some(ele0 => ele0 instanceof Array && ele0.equals(ele))) cond = false;
    if(cond) this.push(ele);

    return this;
  };


  /**
   * Variant of {@link Array#push} that only pushes the element when it's not null (nor undefined).
   * @param {any} ele
   * @return {this}
   */
  Array.prototype.pushNonNull = function(ele) {
    if(ele == null) return this;

    this.push(ele);

    return this;
  };


  /**
   * Variant of {@link Array#push} that pushes all elements from given array into this array.
   * Use this method instead if in case of chaining.
   * @param {any} eles_p
   * @return {this}
   */
  Array.prototype.pushAll = function(eles_p) {
    !(eles_p instanceof Array) ?
      this.push(eles_p) :
      eles_p.forEachFast(ele => this.push(ele));

    return this;
  };


  /**
   * Inserts an element at given index.
   * @param {any} ele
   * @param {number} ind
   * @return {number} Array length.
   */
  Array.prototype.insert = function(ele, ind) {
    let i = this.iCap();
    while(i > ind) {
      this[i] = this[i - 1];
      i--;
    };
    this[ind] = ele;

    return this.length;
  };


  /**
   * Variant of {@link Array#insert} that inserts all elements from given array into this array.
   * Use this method instead if in case of chaining.
   * @param {any} eles_p
   * @param {number} ind
   * @return {this}
   */
  Array.prototype.insertAll = function(eles_p, ind) {
    let eles = eles_p instanceof Array ? eles_p : [eles_p];
    let i = this.iCap(), j = 0, jCap = eles.iCap();
    while(i > ind) {
      this[i + jCap - 1] = this[i - 1];
      i--;
    };
    while(j < jCap) {
      this[ind + j] = eles[j];
      j++;
    };

    return this;
  };


  /**
   * Removes the first matching element in the array.
   * This method does not remove all matching elements, see {@link Array#pull} instead.
   * @param {any} ele
   * @return {any} The element removed or null if not found.
   */
  Array.prototype.remove = function(ele) {
    let ind = this.indexOf(ele);
    if(ind > -1) {
      return this.splice(ind, 1)[0];
    };

    return null;
  };


  /**
   * Variant of {@link Array#remove} that removes multiple elements.
   * Use this method instead if in case of chaining.
   * @param {any} eles_p
   * @return {this}
   */
  Array.prototype.removeAll = function(eles_p) {
    !(eles_p instanceof Array) ?
      this.remove(eles_p) :
      eles_p.forEachFast(ele => this.remove(ele));

    return this;
  };


  /**
   * Removes some row in a formatted array.
   * `rowInd` for the first row is 0.
   * @param {number|unset} [ord]
   * @param {number|unset} [rowInd]
   * @return {this}
   */
  Array.prototype.removeRow = function(ord, rowInd) {
    if(ord == null) ord = 1;
    if(rowInd == null) rowInd = 0;
    // Don't remove anything if index is negative
    if(rowInd < 0) return;

    this.splice((rowInd + 1) * ord, ord);

    return this;
  };


  /**
   * Removes all matching elements in the array.
   * @param {any} ele
   * @return {number} Array length.
   */
  Array.prototype.pull = function(ele) {
    while(this.includes(ele)) {
      this.remove(ele);
    };

    return this.length;
  };


  /**
   * Variant of {@link Array#pull} that pulls multiple elements.
   * @param {any} eles_p
   * @return {this}
   */
  Array.prototype.pullAll = function(eles_p) {
    !(eles_p instanceof Array) ?
      this.pull(eles_p) :
      eles_p.forEachFast(ele => this.pull(ele));

    return this;
  };


  /**
   * Pulls out all `null` and `undefined` in this array.
   * @return {this}
   */
  Array.prototype.compact = function() {
    this.pull(null);
    this.pull(undefined);
    return this;
  };


  /**
   * Variant of {@link Array#shift} that removes multiple elements at one time.
   * @param {number|unset} [amt]
   * @param {boolean|unset} [forResult] - If true, returns removed elements instead of this array.
   * @return {Array}
   */
  Array.prototype.shiftAll = function(amt, forResult) {
    if(amt == null) amt = 1;

    let i = 0;
    if(!forResult) {
      while(i < amt) {
        this.shift();
        i++;
      };
      return this;
    };

    let arr = [];
    while(i < amt) {
      arr.push(this.shift());
      i++;
    };
    return arr;
  };


  /**
   * Variant of {@link Array#unshift} that adds multiple elements at one time.
   * @param {any} eles_p
   * @return {this}
   */
  Array.prototype.unshiftAll = function(eles_p) {
    !(eles_p instanceof Array) ?
      this.unshift(eles_p) :
      eles_p.reverse().forEachFast(ele => this.unshift(ele));

    return this;
  };


  /**
   * Swaps position of two elements.
   * @param {any} ele1
   * @param {any} ele2
   * @return {this}
   */
  Array.prototype.swap = function(ele1, ele2) {
    return this.swapByInd(
      this.indexOf(ele1),
      this.indexOf(ele2),
    );
  };


  /**
   * Variant of {@link Array#swap} using index.
   * @param {number} ind1
   * @param {number} ind2
   * @return {this}
   */
  Array.prototype.swapByInd = function(ind1, ind2) {
    if(ind1 < 0 || ind2 < 0) return this;

    let tmp = this[ind2];
    this[ind2] = this[ind1];
    this[ind1] = tmp;

    return this;
  };


  /**
   * Variant of {@link Array#map} that doesn't return a new array.
   * @param {function(any): any} mapF
   * @return {this}
   */
  Array.prototype.inSituMap = function(mapF) {
    let i = 0, iCap = this.iCap();
    while(i < iCap) {
      this[i] = mapF(this[i]);
      i++;
    };

    return this;
  };


  /**
   * Variant of {@link Array#filter} that doesn't return a new array.
   * @param {function(any): boolean} boolF
   * @return {this}
   */
  Array.prototype.inSituFilter = function(boolF) {
    let i = 0, iCap = this.iCap();
    while(i < iCap) {
      if(!boolF(this[i])) this[i] = "!PENDING";
      i++;
    };
    this.pull("!PENDING");

    return this;
  };



  /**
   * Variant of {@link Array#sort} for purely numeric array.
   * @param {boolean|unset} [rev] - If true, the order is reversed (larger to smaller).
   * @return {this}
   */
  Array.prototype.numSort = function(rev) {
    return this.sort((a, b) => rev ? (b - a) : (a - b));
  };


  /**
   * Variant of {@link Array#sort} for mixed-type array.
   * @return {this}
   */
  Array.prototype.mixSort = function thisFun() {
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


  /**
   * Randomizes order of elements in this array.
   * Can be used for a formatted array.
   * @param {number|unset} [ord]
   * @return {this}
   */
  Array.prototype.randomize = function(ord) {
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


  /**
   * Replaces matching elements in this array.
   * Modifies the original array.
   * Can be used for a formatted array.
   * @param {function(any): any} mapF
   * @param {number|unset} [ord]
   * @param {number|unset} [off]
   * @return {this}
   */
  Array.prototype.substitute = function(mapF, ord, off) {
    if(ord == null) ord = 1;
    if(off == null) off = 0;

    let i = 0, iCap = this.iCap();
    while(i < iCap) {
      this[i + off] = mapF(this[i + off]);
      i += ord;
    };

    return this;
  };


  /* <------------------------------ operation ------------------------------ */


  /**
   * Gets an index array.
   * If `isStatistical`, the array will start at 1 instead of 0.
   * @return {Array<number>}
   */
  Array.getIndArr = function(len, isStatistical) {
    const arr = [];

    let i = 0;
    while(i < len) {
      arr.push(isStatistical ? (i + 1) : i);
      i++;
    };

    return arr;
  };


  /**
   * Counts how many times an element occurs in this array.
   * Can be used for a formatted array.
   * @param {any} ele
   * @param {(function(any): any)|unset} [mapF]
   * @param {number|unset} [ord]
   * @param {number|unset} [off]
   * @return {number}
   */
  Array.prototype.count = function(ele, mapF, ord, off) {
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


  /**
   * Counts how many matching elements there are in this array.
   * Can be used for a formatted array.
   * @param {function(any): boolean} boolF
   * @param {number|unset} [ord]
   * @param {number|unset} [off]
   * @return {number}
   */
  Array.prototype.countBy = function(boolF, ord, off) {
    let count = 0;
    if(ord == null) ord = 1;
    if(off == null) off = 0;

    let i = 0, iCap = this.iCap();
    while(i < iCap) {
      if(boolF(this[i + off])) count++;
      i += ord;
    };

    return count;
  };


  /**
   * Removes duplicate elements.
   * Result is returned as a new array.
   * @param {(function(any): any)|unset} [mapF]
   * @return {Array}
   */
  Array.prototype.unique = function(mapF) {
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


  /**
   * Finds elements that are in both array.
   * Result is returned as a new array.
   * @param {any} eles_p
   * @param {(function(any): any)|unset} [mapF]
   * @return {Array}
   */
  Array.prototype.intersect = function(eles_p, mapF) {
    const arr = [];

    let i = 0, iCap = this.iCap();
    if(mapF == null) {
      while(i < iCap) {
        if(!(eles_p instanceof Array) ? this[i] === eles_p : eles_p.includes(this[i])) {
          arr.push(eles_p);
        };
        i++;
      };
    } else {
      let tmpArr = [], tmp;
      if(eles_p instanceof Array) eles_p.forEachFast(ele => tmpArr.push(mapF(ele)));
      while(i < iCap) {
        tmp = mapF(this[i]);
        if(!(eles_p instanceof Array) ? tmp === mapF(eles_p) : tmpArr.includes(tmp)) {
          arr.push(eles_p);
        };
        i++;
      };
      tmpArr.clear();
    };

    return arr;
  };


  /**
   * Finds elements in this array that are not in given array.
   * @param {any} eles_p
   * @param {(function(any): any)|unset} [mapF]
   * @return {Array}
   */
  Array.prototype.differ = function(eles_p, mapF) {
    const arr = [];

    let i = 0, iCap = this.iCap();
    if(mapF == null) {
      while(i < iCap) {
        if(!(eles_p instanceof Array) ? this[i] !== eles_p : !eles_p.includes(this[i])) {
          arr.push(eles_p);
        };
        i++;
      };
    } else {
      let tmpArr = [], tmp;
      if(eles_p instanceof Array) eles_p.forEachFast(ele => tmpArr.push(mapF(ele)));
      while(i < iCap) {
        tmp = mapF(this[i]);
        if(!(eles_p instanceof Array) ? tmp !== mapF(eles_p) : !tmpArr.includes(tmp)) {
          arr.push(eles_p);
        };
        i++;
      };
      tmpArr.clear();
    };

    return arr;
  };


  /**
   * Converts this formatted array into 2D-array.
   * @param {number|unset} [ord]
   * @param {number|unset} [def] - If set, incomplete rows will be filled with `def`.
   * @return {Array}
   */
  Array.prototype.chunk = function(ord, def) {
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


  /**
   * {@link Array#flat}, which doesn't exist in Rhino.
   * @return {Array}
   */
  Array.prototype.flatten = function() {
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


  /**
   * Variant of {@link Array#flatten} that ensures no array exists in the result.
   * Very costy.
   * Do not call this on arrays that have self-reference.
   * @param {number|unset} [maxTry]
   * @return {Array}
   */
  Array.prototype.flattenAll = function(maxTry) {
    let i = 0, iCap = tryVal(maxTry, 500), arr = this.flatten();
    while(i < iCap && arr.some(ele => ele instanceof Array)) {
      arr = arr.flatten();
      i++;
    };

    return arr;
  };


  /* <------------------------------ util ------------------------------ */


  /**
   * 1. Gets a copy of this array.
   * <br> 2. Copies elements from given array.
   * @param {Array|unset} [arr]
   * @return {this}
   */
  Array.prototype.cpy = newMultiFunction(
    [], function() {
      return this.slice();
    },
    [Array], function(arr) {
      return this.clear().pushAll(arr);
    },
  );


  /**
   * Picks random elements from this array, returns the result as a new array.
   * @param {number|unset} [amt]
   * @return {Array}
   */
  Array.prototype.sample = function(amt) {
    const arr = Array.prototype.sample.tmpArr.cpy(this).randomize();
    if(amt == null) amt = this.iCap();

    return amt >= arr.length ?
      arr.slice() :
      arr.slice(0, amt);
  };
  Array.prototype.sample.tmpArr = [];


  /**
   * Counts each element in this array, result is returned as a 2-array.
   * Can be used for a formatted array.
   * @param {number|unset} [ord]
   * @param {number|unset} [off]
   * @return {Array} <ROW>: ele, count.
   */
  Array.prototype.toCountArr = function(ord, off) {
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


  /**
   * Gets an object of categories and elements for this array.
   * @param {function(any): string|null} categGetter - Determines which category an element is in. If this returns null, the element will be skipped.
   * @return {Object}
   */
  Array.prototype.categorize = function(categGetter) {
    let key;
    return this.reduce((obj, ele) => {
      key = categGetter(ele);
      if(key == null) return obj;
      if(obj[key] === undefined) obj[key] = [];
      obj[key].push(ele);
      return obj;
    }, {});
  };


  /**
   * Gets row amount of this formatted array.
   * @param {number|unset} [ord]
   * @return {number}
   */
  Array.prototype.rowAmt = function(ord) {
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
    };

    let tmpArr = [];
    while(i < iCap) {
      tmpArr.push(arr[rowInd + i]);
      i++;
    };
    return nms.looseEquals(tmpArr);
  };


  /**
   * Reads data from a formatted array.
   * For arrays containing multiple matching results, see {@link Array#readList}.
   * @param {string|Array<string>} nms_p
   * @param {any} [def]
   * @param {boolean|unset} [isUnordered]
   * @return {any}
   * @example
   * [
   *   "a", "b", 0,
   *   "b", "c", 1,
   *   "a", "c", 2,
   * ].read(["b", "c"]);                // Returns 1
   */
  Array.prototype.read = function(nms_p, def, isUnordered) {
    let i = 0, iCap = this.iCap();
    let nms = nms_p instanceof Array ? nms_p : [nms_p];
    let jCap = nms.iCap();
    while(i < iCap) {
      if(checkArrayRow(nms, this, i, isUnordered)) return this[i + jCap];
      i += jCap + 1;
    };

    return def;
  };


  /**
   * Variant of {@link Array#read} that returns row index.
   * Will return -1 if not found.
   * @param {string|Array<string>} nms_p
   * @param {boolean|unset} [isUnordered]
   * @return {number}
   */
  Array.prototype.readRowInd = function(nms_p, isUnordered) {
    let i = 0, iCap = this.iCap();
    let nms = nms_p instanceof Array ? nms_p : [nms_p];
    let jCap = nms.iCap();
    while(i < iCap) {
      if(checkArrayRow(nms, this, i, isUnordered)) return Math.round(i / (jCap + 1));
      i += jCap + 1;
    };

    return -1;
  };


  /**
   * Gets elements in the same column in a formatted array.
   * @param {number|unset} [ord]
   * @param {number|unset} [off]
   * @return {Array}
   */
  Array.prototype.readCol = function(ord, off) {
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


  /**
   * Gets a random element in this array.
   * Can be used for a formatted array.
   * @param {number|unset} [ord]
   * @param {number|unset} [off]
   * @param {any} [def]
   * @return {any}
   */
  Array.prototype.readRand = function(ord, off, def) {
    if(this.length === 0) return null;

    if(ord == null) ord = 1;
    if(off == null) off = 0;

    let val = this[Math.round((this.rowAmt(ord) - 1).randInt() * ord + off)];

    return val == null ? def : val;
  };


  /**
   * Variant of {@link Array#read} that returns all found results as a new array.
   * @param {string|Array<string>} nms_p
   * @param {boolean|unset} [isUnordered]
   * @return {Array}
   */
  Array.prototype.readList = function(nms_p, isUnordered) {
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


  /**
   * The other side of {@link Array#read}.
   * @param {string|Array<string>} nms_p
   * @param {any} val
   * @param {boolean|unset} [isUnordered]
   * @return {this}
   */
  Array.prototype.write = function(nms_p, val, isUnordered) {
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


  /**
   * Removes first matching row in a formatted array.
   * @param {string|Array<string>} nms_p
   * @param {boolean|unset} [isUnordered]
   * @return {this}
   */
  Array.prototype.removeFormatRow = function(nms_p, isUnordered) {
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
