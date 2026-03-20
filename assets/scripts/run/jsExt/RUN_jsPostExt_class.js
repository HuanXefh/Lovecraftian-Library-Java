/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * More methods for function class that should be defined later.
   */


/*
  ========================================
  Section: Definition (Function)
  ========================================
*/


  /**
   * Lets a function class implements an interface.
   * @param {CLS_interface} intf
   * @param {boolean|unset} [shouldOverride] - If true, this method will override existing methods instead of throwing an error.
   * @return {this}
   */
  Function.prototype.implement = function(intf, shouldOverride) {
    if(!(intf instanceof CLS_interface)) ERROR_HANDLER.throw("notInterface", intf);
    if(intf.children.includes(this)) ERROR_HANDLER.throw("duplicateInterface");

    if(!this.__IS_CONTENT_TEMPLATE__) {
      Object._it(intf.interfaceObj, (nm, fun) => {
        if(nm === "__PROTO__") {
          this.prototype[nm] !== undefined && !shouldOverride ?
            ERROR_HANDLER.throw("interfaceMethodNameConflict", nm) :
            this.prototype[nm] = fun;
        } else {
          this[nm] !== undefined && !shouldOverride ?
            ERROR_HANDLER.throw("interfaceMethodNameConflict", nm) :
            this[nm] = fun;
        };
      });
    } else {
      if(this.nm === "CLS_contentTemplate") throw new Error("Are you trying to implement interface on the root template?");
      let arr = LCTempParentMap.get(this.nm);
      if(String.isEmpty(intf.nm)) {
        Log.warn("[LOVEC] Content template ${1} is implementing an anonymous interface!".format(this.nm));
      } else {
        arr.push(intf.nm);
      };
      intf.parentIntfs.forEachCond(ointf => !String.isEmpty(ointf.nm), ointf => arr.push(ointf.nm));
      this.setMethod(intf.interfaceObj, true);
    };
    intf.children.push(this);

    return this;
  };
