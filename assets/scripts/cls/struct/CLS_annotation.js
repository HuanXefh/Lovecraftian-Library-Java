/* ----------------------------------------
 * NOTE:
 *
 * Annotation marks and modifies other methods.
 * See {Function.prototype.setAnno} in {RUN_methodExt}.
 *
 * {funCaller} defines how to modify the original method {this}.
 * If you are using {this}, don't write arrow functions!
 * By returning {true} the original method will not be called.
 * Format: (arg1, arg2, arg3, ...) => {...}.
 *
 * {loadScr} is called just after the function is defined.
 *
 * {funArgCaller} is similar to {funCaller}, but {this} refers to {arguments} of the original method.
 * ---------------------------------------- */


/* <---------- import ----------> */


/* <---------- meta ----------> */


const CLS_annotation = newClass().initClass();


CLS_annotation.prototype.init = function(nm, funCaller, loadScr, funArgCaller) {
  this.name = registerUniqueName(nm, insNms, "annotation");
  this.onCall = Function.airFalse;
  if(funCaller != null) {
    this.type = "on-call";
    this.onCall = function(fun, annoArgs) {
      return funCaller.apply(fun, annoArgs);
    };
  };
  this.onLoad = Function.air;
  if(loadScr != null) {
    this.type = "on-load";
    this.onLoad = function(fun, annoLoadArgs) {
      loadScr.apply(fun, annoLoadArgs);
    };
  };
  this.onArgCall = Function.airFalse;
  if(funArgCaller != null) {
    this.type = "argument";
    this.onArgCall = function(funArgs, annoArgArgs) {
      return funArgCaller.apply(funArgs, annoArgArgs);
    };
  };
  if(this.type == null) {
    this.type = "undefined";
    Log.warn("[LOVEC] Annotation [$1] has undefined type!".format(nm.color(Pal.accent)));
  };

  LCAnno[this.name] = this;
};


const insNms = [];


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


module.exports = CLS_annotation;
