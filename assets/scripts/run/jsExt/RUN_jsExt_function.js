/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Mostly function decorators.
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


  /* <---------- function ----------> */


  var ptp = Function.prototype;


  /* ----------------------------------------
   * NOTE:
   *
   * Wraps {length} of this function.
   * This is ridiculous.
   * ---------------------------------------- */
  ptp.wrapLen = function(len) {
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


  /* ----------------------------------------
   * NOTE:
   *
   * The method's returned values will be cached.
   * If {objMap} is given it will be used to store cached results.
   * If {stateGetter} is given, the cache will be cleared whenever state is changed. {this} will be passed to the getter.
   * Used for very costy methods.
   * ---------------------------------------- */
  ptp.setCache = function thisDecor(objMap, stateGetter) {
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


  /* ----------------------------------------
   * NOTE:
   *
   * For test, monitors function time cost.
   * ---------------------------------------- */
  ptp.setTimeTest = function(dataAmt) {
    const thisFun = this;

    let meanWin = new WindowedMean(tryVal(dataAmt, 60));
    let fun = function() {
      Time.mark();
      let returnVal = thisFun.apply(this, arguments);
      meanWin.add(Time.elapsed());
      if(meanWin.hasEnoughData()) {
        Log.info("[LOVEC] Method cost: [$1] ms.".format(meanWin.mean()));
        meanWin.clear();
      };

      return returnVal;
    };
    fun.cloneProp(thisFun);

    return fun;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * For test, monitors behaviour of some function.
   * ---------------------------------------- */
  ptp.setSpy = function thisDecor() {
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


      /* ----------------------------------------
       * NOTE:
       *
       * Returns how many times this function has been called now.
       * ---------------------------------------- */
      fun.getCallCount = function() {
        return fun.__CALLED_COUNT__;
      };


      /* ----------------------------------------
       * NOTE:
       *
       * Returns a list of used {this} values.
       * ---------------------------------------- */
      fun.getCallThis = function() {
        return fun.__CALLED_THIS__.cpy();
      };


      /* ----------------------------------------
       * NOTE:
       *
       * Returns the last {this} value.
       * ---------------------------------------- */
      fun.getLastThis = function() {
        return fun.__CALLED_THIS__.cpy();
      };


      /* ----------------------------------------
       * NOTE:
       *
       * Whether {obj} has been {this} value of the function before.
       * ---------------------------------------- */
      fun.hasCalledOn = function(obj) {
        return fun.__CALLED_THIS__.includes(obj);
      };


      /* ----------------------------------------
       * NOTE:
       *
       * Returns a list of used arguments.
       * ---------------------------------------- */
      fun.getCallArgs = function() {
        return fun.__CALLED_ARGS__.cpy();
      };


      /* ----------------------------------------
       * NOTE:
       *
       * Returns the last argument array.
       * ---------------------------------------- */
      fun.getLastCallArg = function() {
        return fun.__CALLED_ARGS__.last();
      };


      /* ----------------------------------------
       * NOTE:
       *
       * Whether the given argument array has been called before.
       * ---------------------------------------- */
      fun.isArgCalled = function(args) {
        return fun.__CALLED_ARGS__.some(args1 => args.equals(args1));
      };


      /* ----------------------------------------
       * NOTE:
       *
       * Returns a list of returned values.
       * ---------------------------------------- */
      fun.getReturnVals = function() {
        return fun.__RETURNED_VALS__.cpy();
      };


      /* ----------------------------------------
       * NOTE:
       *
       * Returns the last returned value.
       * ---------------------------------------- */
      fun.getLastReturnVal = function() {
        return fun.__RETURNED_VALS__.last();
      };


      /* ----------------------------------------
       * NOTE:
       *
       * Whether the function has returned {val} at least once.
       * ---------------------------------------- */
      fun.hasReturned = function(val) {
        return fun.__RETURNED_VALS__.includes(val);
      };


    },
  });
