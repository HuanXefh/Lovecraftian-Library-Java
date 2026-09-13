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
      if(!(intf instanceof CLS_interface)) throw new TypeError(intf + " is not an interface");
      if(intf.children.includes(this)) throw new Error("Do not implement the same interface twice!");

      if(!this.__isContentTemplate__) {
          Object.eachPair(intf.intfObj, (name, fun) => {
              if(name === "__protoF__") {
                  if(this.prototype[name] !== undefined && !shouldOverride) throw new Error("Prototype method name conflict: " + name);
                  this.prototype[name] = fun;
              } else {
                  if(this[name] !== undefined && !shouldOverride) throw new Error("Method name conflict: " + name);
                  this[name] = fun;
              };
          });
      } else {
          if(this.clsName === "CLS_contentTemplate") throw new Error("Are you trying to implement interface on the root template?");
          let arr = CLS_contentTemplate.getTempParents(this.clsName);
          if(String.isEmpty(intf.name)) {
              console.warn("[LOVEC] Content template ${1} is implementing an anonymous interface!".format(this.clsName));
          } else {
              arr.push(intf.name);
          };
          intf.parentIntfs.forEachCond(ointf => !String.isEmpty(ointf.name), ointf => arr.push(ointf.name), true);
          this.setMethod(intf.intfObj, true);
      };
      intf.children.push(this);

      return this;
  };
