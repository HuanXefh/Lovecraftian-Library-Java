/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * More methods for JavaScript function that should be called later.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_annotation = require("lovec/cls/struct/CLS_annotation");


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
   * Modifies the method, the behaviour is defined in annotation.
   * {skipVal} is the value returned when method is skipped somehow.
   * ----------------------------------------
   * IMPORTANT:
   *
   * Annotation application should be done last, after any other function decorators!
   * ---------------------------------------- */
  ptp.setAnno = function(nmAnno, args_p, skipVal) {
    const thisFun = this;

    let anno = LCAnno[nmAnno];
    if(anno == null || !(anno instanceof CLS_annotation)) ERROR_HANDLER.throw("notAnno", nmAnno);
    if(args_p == null) args_p = [];
    let args = args_p instanceof Array ? args_p : [args_p];

    if(anno.type === "on-load") {
      anno.onLoad(thisFun, args);
    };

    let fun = function() {
      return (anno.type === "on-load" ? false : anno.type === "on-call" ? anno.onCall(thisFun, args) : anno.type === "argument" ? anno.onArgCall(arguments, args) : false) ?
        skipVal :
        thisFun.apply(this, arguments);
    };
    fun.cloneProp(thisFun);
    fun.annos = this.getAnnos().pushAll(anno);

    return fun;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a copy of the annotation list of this function.
   * ---------------------------------------- */
  ptp.getAnnos = function() {
    return tryVal(this.annos, Array.air).cpy();
  };
