/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * More methods for Lovec class that should be defined later.
   */


/*
  ========================================
  Section: Definition (Function)
  ========================================
*/


  /**
   * Lets a Lovec class implements an interface.
   * @param {CLS_interface} intf
   * @param {boolean|unset} [shouldOverride] - If true, this method will override existing methods instead of throwing an error.
   * @return {this}
   */
  Function.prototype.implement = function(intf, shouldOverride) {
    if(!(intf instanceof CLS_interface)) ERROR_HANDLER.throw("notInterface", intf);
    if(intf.children.includes(this)) ERROR_HANDLER.throw("duplicateInterface");

    if(!this.__isContentTemplate__) {
      Object._it(intf.intfObj, (name, fun) => {
        if(name === "__proto__") {
          this.prototype[name] !== undefined && !shouldOverride ?
            ERROR_HANDLER.throw("interfaceMethodNameConflict", name) :
            this.prototype[name] = fun;
        } else {
          this[name] !== undefined && !shouldOverride ?
            ERROR_HANDLER.throw("interfaceMethodNameConflict", name) :
            this[name] = fun;
        };
      });
    } else {
      if(this.nm === "CLS_contentTemplate") throw new Error("Are you trying to implement interface on the root template?");
      let arr = LCTempParentMap.get(this.nm);
      if(String.isEmpty(intf.name)) {
        console.warn("[LOVEC] Content template ${1} is implementing an anonymous interface!".format(this.nm));
      } else {
        arr.push(intf.name);
      };
      intf.parentIntfs.forEachCond(ointf => !String.isEmpty(ointf.name), ointf => arr.push(ointf.name));
      this.setMethod(intf.intfObj, true);
    };
    intf.children.push(this);

    return this;
  };
