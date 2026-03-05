/* <---------- import ----------> */


/* <---------- meta ----------> */


/**
 * Used to modify methods.
 * Annotations can be applied by `fun.setAnno(nm, annoArgs, skipDef)`.
 * @class
 * @param {string} nm
 * @param {Function|unset} [funCaller] - Called before the original function is called, `this` refers to the original function. If ture is returned, the original function will be skipped.
 * @param {Function|unset} [loadScr] - Called just after the original function is defined, `this` refers to the original function.
 * @param {Function|unset} [funArgCaller] - Like `funCaller` but `this` refers to arguments of the original function.
 */
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
