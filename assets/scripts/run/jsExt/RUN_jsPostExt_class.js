/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * More methods for function class that should be called later.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- function ----------> */


  /**
   * Lets a function class implements an interface.
   * @param {CLS_interface} intf
   * @param {boolean|unset} [shouldOverride] - If true, this method will override existing methods instead of throwing an error.
   * @return {this}
   */
  Function.prototype.implement = function(intf, shouldOverride) {
    const thisCls = this;
    if(!(intf instanceof CLS_interface)) ERROR_HANDLER.throw("notInterface", intf);
    if(intf.children.includes(this)) ERROR_HANDLER.throw("duplicateInterface");

    if(!thisCls.__IS_CONTENT_TEMPLATE__) {
      Object._it(intf.interfaceObj, (nm, fun) => {
        if(nm === "__PROTO__") {
          thisCls.prototype[nm] !== undefined && !shouldOverride ?
            ERROR_HANDLER.throw("interfaceMethodNameConflict", nm) :
            thisCls.prototype[nm] = fun;
        } else {
          thisCls[nm] !== undefined && !shouldOverride ?
            ERROR_HANDLER.throw("interfaceMethodNameConflict", nm) :
            thisCls[nm] = fun;
        };
      });
    } else {
      if(thisCls.nm === "CLS_contentTemplate") throw new Error("Are you trying to implement interface on the root template?");
      let arr = LCTempParentMap.get(thisCls.nm);
      arr.push(intf.nm);
      intf.parentIntfs.forEachCond(ointf => ointf.nm !== "", ointf => arr.push(ointf.nm));
      thisCls.setMethod(intf.interfaceObj, true);
    };
    intf.children.push(this);

    return this;
  };
