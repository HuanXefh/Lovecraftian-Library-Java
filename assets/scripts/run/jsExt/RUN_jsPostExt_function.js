/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * More methods for JavaScript function that should be defined later.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- function ----------> */


  /**
   * Modifies the method with annotation.
   * <br> <IMPORTANT>: Should be applied last after any decorator!
   * @param {string} nmAnno
   * @param {any} [args_p] - Arguments passed down to the annotation.
   * @param {any} [skipVal] - Value returned if the original method is skipped.
   * @return {this}
   */
  Function.prototype.setAnno = function(nmAnno, args_p, skipVal) {
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


  /**
   * Gets a list of annotations applied on this function.
   * @return {Array<CLS_annotation>}
   */
  Function.prototype.getAnnos = function() {
    if(this.annos == null) {
      this.annos = [];
    };
    return this.annos;
  };
