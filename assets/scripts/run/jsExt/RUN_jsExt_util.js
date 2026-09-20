/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * Utility methods.
     */


/*
  ========================================
  Section: Definition (Object)
  ========================================
*/


  /**
   * Gets a random key in `obj`.
   * @template K
   * @param {Object<K, Object>} obj
   * @return {K}
   */
    Object.randKey = function(obj) {
        return Object.keys(obj).random();
    };


    /**
     * Variant of {@link Object.randKey} with result cached.
     * @template K
     * @template V
     * @param {Object<K, V>} obj
     * @return {K}
     */
    Object.randKeyCached = function(obj) {
        let keys = Object.randKeyCached.cacheMap.get(obj);
        if(keys == null) {
            keys = Object.keys(obj);
            Object.randKeyCached.cacheMap.put(obj, keys);
        };
        return keys.random();
    };
    /** @type {ObjectMap<Object, Array>} */
    Object.randKeyCached.cacheMap = new ObjectMap();


    /**
     * Gets key by reading through values in `obj`.
     * @template K
     * @template V
     * @param {Object<K, V>} obj
     * @param {V} val
     * @param {K|unset} [def]
     * @return {K|unset}
     */
    Object.keyByVal = function(obj, val, def) {
        let key_fi = def;
        for(let key in obj) {
            if(obj[key] !== val) continue;
            key_fi = key;
        };
        return key_fi;
    };


    /**
     * Gets last child object found in `obj` by searching with given keys.
     * @param {Object} obj
     * @param {Array<string>} keys
     * @param {Object|unset} [def] - If given, returns `def` when not found.
     * @return {Object|unset}
     */
    Object.searchByKeys = function(obj, keys, def) {
        let target = obj;
        let tmp = null;

        let i = 0, iCap = keys.iCap();
        while(i < iCap) {
            tmp = target[keys[i]];
            if(tmp != null) {
                target = tmp;
            } else if(def !== undefined) {
                return def;
            } else break;
            i++;
        };

        return target;
    };


    /**
     * Converts an array or arguments object to object.
     * @param {Arguments} arr
     * @return {Object}
     */
    Object.fromArr = function(arr) {
        let obj = {};
        let i = 0, iCap = arr.iCap();
        while(i < iCap) {
            obj[i] = arr[i];
            i++;
        };
        return obj;
    };


    /**
     * Converts an object to array (loses all keys).
     * @template K
     * @template V
     * @param {Object<K, V>} obj
     * @return {Array<V>}
     */
    Object.toArr = function(obj) {
        let arr = [];
        let i = 0;
        for(let key in obj) {
            arr[i] = obj[key];
            i++;
        };
        return arr;
    };


    /**
     * Converts an object to 2-array (keeps all keys).
     * @template K
     * @template V
     * @param {Object<K, V>} obj
     * @return {F2Array<K, V>}
     */
    Object.to2Arr = function(obj) {
        let arr = [];
        if(obj == null) return arr;

        let i = 0;
        for(let key in obj) {
            arr[i] = key;
            arr[i + 1] = obj[key];
            i += 2;
        };

        return arr;
    };


/*
  ========================================
  Section: Definition (Number)
  ========================================
*/


    /**
     * Converts a tile coordinate to world coordinate.
     * @param {number|unset} [size]
     * @return {number}
     */
    Number.prototype.toFCoord = function(size) {
        return size == null ?
            LCPos.toFCoord(this) :
            LCPos.toFCoord(this, size);
    };


    /**
     * Converts a world coordinate to tile coordinate.
     * @return {number}
     */
    Number.prototype.toIntCoord = function() {
        return LCPos.toIntCoord(this);
    };


    /**
     * Converts a rectangular range parameter to full width.
     * @param {number} size
     * @return {number}
     */
    Number.prototype.toRectW = function(size) {
        return LCPos.calcRectW(this, size);
    };


    /**
     * Converts a rectangular range parameter to half width.
     * @param {number} size
     * @return {number}
     */
    Number.prototype.toRectHW = function(size) {
        return LCPos.calcRectHW(this, size);
    };


/*
  ========================================
  Section: Definition (Array)
  ========================================
*/


    /**
     * Whether `ins` is instance of any class (or content template) from this array.
     * @param {Object} ins
     * @return {boolean}
     */
    Array.prototype.hasIns = function(ins) {
        return this.some(cls => checkInstance(ins, cls));
    };
