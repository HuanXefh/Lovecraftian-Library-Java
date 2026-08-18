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
  Section: Definition
  ========================================
*/


  /* <------------------------------ property ------------------------------ */


  /**
   * Gets first element, null if not found.
   * @return {any}
   */
  Array.prototype.first = function() {
    return LCNativeArray.first(this);
  };


  /**
   * Gets last element, null if not found.
   * @return {any}
   */
  Array.prototype.last = function() {
    return LCNativeArray.last(this);
  };


  /**
   * Gets index of the last element, 0 if empty array.
   * @return {number}
   */
  Array.prototype.lastIndex = function() {
    return LCNativeArray.lastIndex(this);
  };


  /**
   * Gets fraction of index of some element by array length.
   * Returns -1 if not found.
   * @param {any} ele
   * @param {boolean|unset} [useInd] - If true, `ele` will be treated as index directly.
   * @param {boolean|unset} [returnNull] - If true, this method will return null instead of 0.0 if element not in the array.
   * @return {number|null}
   */
  Array.prototype.calcIndexFrac = function(ele, useInd) {
    return useInd == null ?
      LCNativeArray.calcIndexFrac(this, ele) :
      LCNativeArray.calcIndexFrac(this, ele, useInd);
  };


  /* <------------------------------ condition ------------------------------ */


  /**
   * Whether some element exists in any of given arrays.
   * <br> `ARGS`: ele, arr1, arr2, arr3, ...
   * @return {boolean}
   */
  Array.someIncludes = function() {
    return LCNativeArray.someIncludes.apply(null, arguments);
  };


  /**
   * Whether some element exists in all given arrays.
   * <br> `ARGS`: ele, arr1, arr2, arr3, ...
   * @return {boolean}
   */
  Array.everyIncludes = function() {
    return LCNativeArray.everyIncludes.apply(null, arguments);
  };


  /**
   * Whether an element exists in an array.
   * This method has to been overrided to avoid type-related crash.
   * @param {any} ele
   * @return {boolean}
   */
  Array.prototype.includes = function(ele) {
    return LCNativeArray.includes(this, ele);
  };


  /**
   * Whether any of the given elements is found in this array.
   * <br> `ARGS`: ele1, ele2, ele3, ...
   * @return {boolean}
   */
  Array.prototype.includesAny = function() {
    return LCNativeArray.includesAnyArguments(this, arguments);
  };


  /**
   * Whether all the given elements are found in this array.
   * <br> `ARGS`: ele1, ele2, ele3, ...
   * @return {boolean}
   */
  Array.prototype.includesAll = function() {
    return LCNativeArray.includesAllArguments(this, arguments);
  };


  /**
   * Whether this array equals the given array.
   * @param {Array} arr
   * @param {(function(any): boolean)|unset} [mapF]
   * @return {boolean}
   */
  Array.prototype.arrayEquals = function(arr, mapF) {
    let i = 0, iCap = this.iCap();
    if(iCap !== arr.length) return false;

    let val1, val2;
    if(mapF == null) {
      while(i < iCap) {
        val1 = this[i];
        val2 = arr[i];
        if(val1 !== val2) return false;
        i++;
      };
    } else {
      while(i < iCap) {
        val1 = mapF(this[i]);
        val2 = mapF(arr[i]);
        if(val1 !== val2) return false;
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
    return Array.prototype.looseEquals.tmpArr1.cpy(this).mixSort().arrayEquals(Array.prototype.looseEquals.tmpArr2.cpy(arr).mixSort());
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
   * Variant of {@link Array#includes} for formatted array.
   * @param {any} ele
   * @param {number} ord
   * @param {number|unset} [off]
   * @return {boolean}
   */
  Array.prototype.colIncludes = function(ele, ord, off) {
    return off == null ?
      LCNativeArray.colIncludes(this, ele, ord) :
      LCNativeArray.colIncludes(this, ele, ord, off);
  };


  /**
   * Whether this array is a subset of another array.
   * @param {Array} arr
   * @return {boolean}
   */
  Array.prototype.subsetOf = function(arr) {
    return LCNativeArray.subsetOf(this, arr);
  };


  /* <------------------------------ modification ------------------------------ */


  /**
   * Variant of {@link Array#push} that only pushes unique element.
   * @param {any} ele
   * @return {this}
   */
  Array.prototype.pushUnique = function(ele) {
    return LCNativeArray.pushUnique(this, ele);
  };


  /**
   * Variant of {@link Array#push} that only pushes non-null element.
   * @param {any} ele
   * @return {this}
   */
  Array.prototype.pushNonNull = function(ele) {
    return LCNativeArray.pushNonNull(this, ele);
  };


  /**
   * Variant of {@link Array#push} that pushes all elements from another array.
   * @param {any} eles_p
   * @return {this}
   */
  Array.prototype.pushAll = function(eles_p) {
    return LCNativeArray.pushAll(this, eles_p);
  };


  /**
   * Inserts an element at given index.
   * @param {number} ind
   * @param {any} ele
   * @return {number} Array length.
   */
  Array.prototype.insert = function(ind, ele) {
    return LCNativeArray.insert(this, ind, ele);
  };


  /**
   * Variant of {@link Array#insert} for batch insertion.
   * @param {number} ind
   * @param {any} eles_p
   * @return {this}
   */
  Array.prototype.insertAll = function(ind, eles_p) {
    return LCNativeArray.insertAll(this, ind, eles_p);
  };


  /**
   * Clears this array and fill it with given elements.
   * <br> `ARGS`: ele1, ele2, ele3, ...
   * @return {this}
   */
  Array.prototype.with = function() {
    return LCNativeArray.withArguments(this, arguments);
  };


  /**
   * Variant of {@link Array#with} for array.
   * @param {Arguments} eles
   * @return {this}
   */
  Array.prototype.withAll = function(eles) {
    return LCNativeArray.withAll(this, eles);
  };


  /**
   * Removes the first matching element in the array.
   * @param {any} ele
   * @param {(function(any): any)|unset} [mapF]
   * @return {any} Removed element.
   */
  Array.prototype.remove = function(ele, mapF) {
    return mapF == null ?
      LCNativeArray.remove(this, ele) :
      LCNativeArray.remove(this, ele, mapF);
  };


  /**
   * Variant of {@link Array#remove} for batch remove.
   * @param {any} eles_p
   * @return {this}
   */
  Array.prototype.removeAll = function(eles_p) {
    return LCNativeArray.removeAll(this, eles_p);
  };


  /**
   * Removes element at given index in an array.
   * @param {number} ind
   * @return {any} Removed element.
   */
  Array.prototype.removeAt = function(ind) {
    return LCNativeArray.removeAt(this, ind);
  };


  /**
   * Removes all matching elements in the array.
   * @param {any} ele
   * @return {number} Array length.
   */
  Array.prototype.pull = function(ele) {
    return LCNativeArray.pull(this, ele);
  };


  /**
   * Variant of {@link Array#pull} for batch pull.
   * @param {any} eles_p
   * @return {this}
   */
  Array.prototype.pullAll = function(eles_p) {
    return LCNativeArray.pullAll(this, eles_p);
  };


  /**
   * Pulls out null values.
   * @return {this}
   */
  Array.prototype.compact = function() {
    return LCNativeArray.compact(this);
  };


  /**
   * Variant of {@link Array#shift} for batch remove.
   * @param {number} amt
   * @param {Array|unset} [resultOut] - If set, removed elements will be stored here.
   * @return {Array}
   */
  Array.prototype.shiftAll = function(amt, resultOut) {
    return resultOut == null ?
      LCNativeArray.shiftAll(this, amt) :
      LCNativeArray.shiftAll(this, amt, resultOut);
  };


  /**
   * Variant of {@link Array#unshift} that adds multiple elements at one time.
   * @param {any} eles_p
   * @return {this}
   */
  Array.prototype.unshiftAll = function(eles_p) {
    !(eles_p instanceof Array) ?
      this.unshift(eles_p) :
      eles_p.reverse().forEachFast(ele => this.unshift(ele), true);

    return this;
  };


  /**
   * Swaps position of two elements.
   * @param {any} ele1
   * @param {any} ele2
   * @return {this}
   */
  Array.prototype.swap = function(ele1, ele2) {
    return LCNativeArray.swap(this, ele1, ele2);
  };


  /**
   * Variant of {@link Array#swap} using index.
   * @param {number} ind1
   * @param {number} ind2
   * @return {this}
   */
  Array.prototype.swapByIndex = function(ind1, ind2) {
    return LCNativeArray.swapByIndex(this, ind1, ind2);
  };


  /**
   * Variant of {@link Array#map} that modifies original array.
   * @param {function(any): any} mapF
   * @return {this}
   */
  Array.prototype.inSituMap = function(mapF) {
    return LCNativeArray.inSituMap(this, mapF);
  };


  /**
   * Variant of {@link Array#filter} that modifies original array.
   * @param {function(any): boolean} boolF
   * @return {this}
   */
  Array.prototype.inSituFilter = function(boolF) {
    return LCNativeArray.inSituFilter(this, boolF);
  };



  /**
   * Variant of {@link Array#sort} for numeric array.
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
   * Supports formatted array.
   * @param {number|unset} [ord]
   * @return {this}
   */
  Array.prototype.shuffle = function(ord) {
    return ord == null ?
      LCNativeArray.shuffle(this) :
      LCNativeArray.shuffle(this, ord);
  };


  /* <------------------------------ operation ------------------------------ */


  /**
   * Counts how many times an element occurs in this array.
   * Supports formatted array.
   * @param {any} ele
   * @param {(function(any): any)|unset} [mapF]
   * @param {number|unset} [ord]
   * @param {number|unset} [off]
   * @return {number}
   */
  Array.prototype.count = function(ele, mapF, ord, off) {
    return LCNativeArray.count(this, ele, tryVal(mapF, null), tryVal(ord, 1), tryVal(off, 0));
  };


  /**
   * Counts how many matching elements exist in this array.
   * Supports formatted array.
   * @param {function(any): boolean} boolF
   * @param {number|unset} [ord]
   * @param {number|unset} [off]
   * @return {number}
   */
  Array.prototype.countBy = function(boolF, ord, off) {
    return LCNativeArray.countBy(this, boolF, tryVal(ord, 1), tryVal(off, 0));
  };


  /**
   * Removes duplicates in this array.
   * @param {(function(any): any)|unset} [mapF]
   * @return {Array} New array.
   */
  Array.prototype.uniquify = function(mapF) {
    return mapF == null ?
      LCNativeArray.uniquify(this) :
      LCNativeArray.uniquify(this, mapF);
  };


  /**
   * Finds elements exist in both arrays.
   * @param {Array} arr
   * @param {(function(any): any)|unset} [mapF]
   * @return {Array} New array.
   */
  Array.prototype.intersect = function(arr, mapF) {
    return mapF == null ?
      LCNativeArray.intersect(this, arr) :
      LCNativeArray.intersect(this, arr, mapF);
  };


  /**
   * Finds elements only exist in this array.
   * @param {Array} arr
   * @param {(function(any): any)|unset} [mapF]
   * @return {Array} New array.
   */
  Array.prototype.differ = function(arr, mapF) {
    return mapF == null ?
      LCNativeArray.differ(this, arr) :
      LCNativeArray.differ(this, arr, mapF);
  };


  /**
   * Converts this formatted array into 2D-array.
   * @param {number} ord
   * @param {number|unset} [def] - Incomplete rows will be filled with `def`.
   * @return {Array} New array.
   */
  Array.prototype.chunk = function(ord, def) {
    return def == null ?
      LCNativeArray.chunk(this, ord) :
      LCNativeArray.chunk(this, ord, def);
  };


  /**
   * `Array#flat`, which doesn't exist in Rhino.
   * @return {Array}
   */
  Array.prototype.flatten = function() {
    return LCNativeArray.flatten(this);
  };


  /* <------------------------------ util ------------------------------ */


  /**
   * Gets a random element in this array, null for empty array.
   * Supports formatted array.
   * @param {number|unset} [ord]
   * @param {number|unset} [off]
   * @return {any}
   */
  Array.prototype.random = function(ord, off) {
    return LCNativeArray.random(this, tryVal(ord, 1), tryVal(off, 0));
  };


  /**
   * Picks random elements from this array.
   * @param {number|unset} [amt]
   * @return {Array} New array.
   */
  Array.prototype.sample = function(amt) {
    return amt == null ?
      LCNativeArray.sample(this) :
      LCNativeArray.sample(this, amt);
  };
  Array.prototype.sample.tmpArr = [];


  /**
   * Counts each element in an array, returns result as a 2-array.
   * Supports formatted array.
   * @param {number|unset} [ord]
   * @param {number|unset} [off]
   * @return {Array} New array. <br> `ROW`: ele, count.
   */
  Array.prototype.toCountArray = function(ord, off) {
    return LCNativeArray.toCountArray(this, tryVal(ord, 1), tryVal(off, 0));
  };


  /**
   * Creates an object by categorizing elements in this array.
   * Elements in null category will be omitted.
   * @param {function(any): string|null} categF
   * @return {Object} New object.
   */
  Array.prototype.categorize = function(categF) {
    return LCNativeArray.categorize(this, categF);
  };


  /* <------------------------------ formatted array ------------------------------ */


  /**
   * Reads data from a formatted array.
   * @param {Plural<Object>} keys_p
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
  Array.prototype.read = function(keys_p, def, isUnordered) {
    return LCNativeArray.read(this, keys_p, tryVal(def, null), tryVal(isUnordered, false));
  };


  /**
  * Variant of {@link Array#read} that returns all matching results.
  * @param {Plural<Object>} keys_p
  * @param {boolean|unset} [isUnordered]
  * @return {Array} New array.
  */
  Array.prototype.readList = function(keys_p, isUnordered) {
    return LCNativeArray.readList(this, keys_p, tryVal(isUnordered, false));
  };


  /**
   * Variant of {@link Array#read} that returns row index, -1 if not found.
   * @param {Plural<Object>} keys_p
   * @param {boolean|unset} [isUnordered]
   * @return {number}
   */
  Array.prototype.readRowIndex = function(keys_p, isUnordered) {
    return LCNativeArray.readRowIndex(this, keys_p, tryVal(isUnordered, false));
  };


  /**
   * Gets elements in the same column.
   * @param {number} ord
   * @param {number|unset} [off]
   * @return {Array}
   */
  Array.prototype.readCol = function(ord, off) {
    return LCNativeArray.readCol(this, ord, tryVal(off, 0));
  };


  /**
   * Writes data in a formatted array.
   * @param {Plural<Object>} keys_p
   * @param {any} val
   * @param {boolean|unset} [isUnordered]
   * @return {this}
   */
  Array.prototype.write = function(keys_p, val, isUnordered) {
    return LCNativeArray.write(this, keys_p, val, tryVal(isUnordered, false));
  };


  /**
   * Removes a row in a formatted array.
   * @param {number} ord
   * @param {number} rowInd
   * @return {this}
   */
  Array.prototype.removeRow = function(ord, rowInd) {
    return LCNativeArray.removeRow(this, ord, rowInd);
  };
