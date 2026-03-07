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
   * @return {this}
   */
  Function.prototype.implement = function(intf) {
    const thisCls = this;

    if(!(intf instanceof CLS_interface)) ERROR_HANDLER.throw("notInterface", intf);
    if(intf.children.includes(this)) ERROR_HANDLER.throw("duplicateInterface");

    if(!thisCls.__IS_CONTENT_TEMPLATE__) {
      Object._it(intf.interfaceObj, (nm, fun) => {
        thisCls[nm] !== undefined ?
          ERROR_HANDLER.throw("interfaceMethodNameConflict", nm) :
          thisCls[nm] = fun;
      });
    } else {
      thisCls.setMethod(intf.interfaceObj, true);
    };
    intf.children.push(this);

    return this;
  };
