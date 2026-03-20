/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Mostly function decorators.
   */


/*
  ========================================
  Section: Definition (Function)
  ========================================
*/


  /* <------------------------------ modification ------------------------------ */


  /**
   * Wraps `Function#length`, mostly for {@link JavaAdapter}.
   * It's ridiculous.
   * @param {number|unset} [len]
   * @return {Function}
   */
  Function.prototype.wrapLen = function(len) {
    const thisFun = this;

    let len_fi = len < 0 || len == null ? -1 : Math.max(Math.round(len), 0);
    if(thisFun.length === len_fi) return thisFun;

    switch(len_fi) {
      case -1 : return thisFun;
      case 0 : return function() {return thisFun.apply(this, arguments)}.cloneProp(thisFun);
      case 1 : return function(arg1) {return thisFun.apply(this, arguments)}.cloneProp(thisFun);
      case 2 : return function(arg1, arg2) {return thisFun.apply(this, arguments)}.cloneProp(thisFun);
      case 3 : return function(arg1, arg2, arg3) {return thisFun.apply(this, arguments)}.cloneProp(thisFun);
      case 4 : return function(arg1, arg2, arg3, arg4) {return thisFun.apply(this, arguments)}.cloneProp(thisFun);
      case 5 : return function(arg1, arg2, arg3, arg4, arg5) {return thisFun.apply(this, arguments)}.cloneProp(thisFun);
      case 6 : return function(arg1, arg2, arg3, arg4, arg5, arg6) {return thisFun.apply(this, arguments)}.cloneProp(thisFun);
      case 7 : return function(arg1, arg2, arg3, arg4, arg5, arg6, arg7) {return thisFun.apply(this, arguments)}.cloneProp(thisFun);
      case 8 : return function(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {return thisFun.apply(this, arguments)}.cloneProp(thisFun);
      case 9 : return function(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {return thisFun.apply(this, arguments)}.cloneProp(thisFun);
      case 10 : return function(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {return thisFun.apply(this, arguments)}.cloneProp(thisFun);
      case 11 : return function(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {return thisFun.apply(this, arguments)}.cloneProp(thisFun);
      case 12 : return function(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12) {return thisFun.apply(this, arguments)}.cloneProp(thisFun);
      case 13 : return function(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13) {return thisFun.apply(this, arguments)}.cloneProp(thisFun);
      case 14 : return function(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14) {return thisFun.apply(this, arguments)}.cloneProp(thisFun);
      case 15 : return function(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg15) {return thisFun.apply(this, arguments)}.cloneProp(thisFun);
      default : ERROR_HANDLER.throw("functionLengthWrapFail", len_fi);
    };
  };


  /**
   * Marks a method as abstract method.
   * @return {Function}
   */
  Function.prototype.setAbstr = function() {
    return function() {
      throw new Error("Abstract method should be overrided before being called!");
    };
  };


  /* <------------------------------ util ------------------------------ */


  /**
   * Calls a method after some miliseconds.
   * No returned value.
   * @param {number} delay
   * @param {Arguments|unset} [args]
   * @param {any} [thisVal]
   * @return {void}
   */
  Function.prototype.delay = function(delay, args, thisVal) {
    Time.run(delay, args == null ? () => this.call(tryVal(thisVal, null)) : () => this.apply(tryVal(thisVal, null), args));
  };


  /**
   * Calls a method after everything else has been called.
   * No returned value.
   * @param {Arguments|unset} [args]
   * @param {any} [thisVal]
   * @return {void}
   */
  Function.prototype.post = function(args, thisVal) {
    Core.app.post(args == null ? () => this.call(tryVal(thisVal, null)) : () => this.apply(tryVal(thisVal, null), args));
  };


  /* <------------------------------ decorator ------------------------------ */


  /**
   * Returned values will be cached for this method for better performance.
   * Used for costy methods that have static inputs.
   * @param {ObjectMap|unset} [objMap] - If set, this object map will be used to store cache.
   * @param {(function(): number)|unset} [stateGetter] - If set, cache will be cleared when state is changed.
   * @return {Function}
   */
  Function.prototype.setCache = function thisDecor(objMap, stateGetter) {
    const thisFun = this;

    let cacheMap = objMap != null ? objMap : new ObjectMap();
    let fun = function() {
      let hash = thisDecor.calcHash.apply(this, arguments);

      // Reset cache if state is changed
      if(stateGetter != null && stateGetter.call(this) !== fun.__CACHED_STATE__) {
        cacheMap.clear();
        fun.__CACHED_STATE__ = stateGetter();
      };

      if(cacheMap.containsKey(hash)) return cacheMap.get(hash);
      let val = thisFun.apply(this, arguments);
      cacheMap.put(hash, val);

      return val;
    };
    fun.cloneProp(thisFun);

    return fun;
  }
  .setProp({
    calcHash: function() {
      let str = "";
      let i = 0, iCap = arguments.length;
      while(i < iCap) {
        str += arguments[i] + ",";
        i++;
      };

      return str;
    },
  });


  /**
   * For test only. Monitors time spent on this method.
   * @param {number|unset} [dataAmt] - How many data to collect before printing the average.
   * @return {Function}
   */
  Function.prototype.setTimeTest = function(dataAmt) {
    const thisFun = this;

    let meanWin = new WindowedMean(tryVal(dataAmt, 60));
    let fun = function() {
      Time.mark();
      let returnVal = thisFun.apply(this, arguments);
      meanWin.add(Time.elapsed());
      if(meanWin.hasEnoughData()) {
        Log.info("[LOVEC] Method cost: ${1} ms.".format(meanWin.mean()));
        meanWin.clear();
      };

      return returnVal;
    };
    fun.cloneProp(thisFun);

    return fun;
  };


  /**
   * For test only. Monitors various behaviors of this method.
   * @return {Function}
   */
  Function.prototype.setSpy = function thisDecor() {
    const thisFun = this;

    let fun = function() {
      fun.__CALLED_COUNT__++;
      fun.__CALLED_THIS__.push(this);
      fun.__CALLED_ARGS__.push(Array.from(arguments));
      let returnVal = thisFun.apply(this, arguments);
      fun.__RETURNED_VALS__.push(returnVal);

      return returnVal;
    };
    fun.cloneProp(thisFun);
    fun.__CALLED_COUNT__ = 0;
    fun.__CALLED_THIS__ = [];
    fun.__CALLED_ARGS__ = [];
    fun.__RETURNED_VALS__ = [];

    thisDecor.setMethods(fun);

    return fun;
  }
  .setProp({
    setMethods: function(fun) {


      fun.getCallCount = function() {
        return fun.__CALLED_COUNT__;
      };


      fun.getCallThis = function() {
        return fun.__CALLED_THIS__.cpy();
      };


      fun.getLastThis = function() {
        return fun.__CALLED_THIS__.cpy();
      };


      fun.hasCalledOn = function(obj) {
        return fun.__CALLED_THIS__.includes(obj);
      };


      fun.getCallArgs = function() {
        return fun.__CALLED_ARGS__.cpy();
      };


      fun.getLastCallArg = function() {
        return fun.__CALLED_ARGS__.last();
      };


      fun.isArgCalled = function(args) {
        return fun.__CALLED_ARGS__.some(args1 => args.equals(args1));
      };


      fun.getReturnVals = function() {
        return fun.__RETURNED_VALS__.cpy();
      };


      fun.getLastReturnVal = function() {
        return fun.__RETURNED_VALS__.last();
      };


      fun.hasReturned = function(val) {
        return fun.__RETURNED_VALS__.includes(val);
      };


    },
  });
