/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * More methods for function class that should be called later.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");


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
   * Lets a function class implements an interface.
   * ---------------------------------------- */
  ptp.implement = function(intf) {
    const thisCls = this;

    if(intf == null || !(intf instanceof CLS_interface)) ERROR_HANDLER.throw("notInterface", intf);
    if(intf.children.includes(this)) ERROR_HANDLER.throw("duplicateInterface");

    if(!thisCls.__IS_CONTENT_TEMPLATE__) {
      Object._it(intf.interfaceObj, (nm, fun) => {
        thisCls[nm] !== undefined ?
          ERROR_HANDLER.throw("interfaceMethodNameConflict", nm) :
          thisCls[nm] = fun;
      });
    } else {
      thisCls.setMethod(intf.interfaceObj);
    };
    intf.children.push(this);

    return this;
  };
