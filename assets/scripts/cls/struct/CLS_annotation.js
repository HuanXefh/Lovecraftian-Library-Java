/*
  ========================================
  Section: Definition
  ========================================
*/


  /**
   * Used to modify methods.
   * Annotations can be applied by `fun.setAnno(name, annoArgs, skipDef)`.
   * @class
   * @param {string} name
   * @param {Function|unset} [funCaller] - Called before the original function is called, `this` refers to the original function. If ture is returned, the original function will be skipped.
   * @param {Function|unset} [loadScr] - Called just after the original function is defined, `this` refers to the original function.
   * @param {Function|unset} [funArgCaller] - Like `funCaller` but `this` refers to arguments of the original function.
   */
  const CLS_annotation = newClass().initClass();


  CLS_annotation.prototype.init = function(name, funCaller, loadScr, funArgCaller) {
    this.name = registerUniqueName(name, insNames, "annotation");
    this.initAnno();

    if(funCaller != null) {
      this.type = "on-call";
      this.onCall = function(fun, annoArgs) {
        return funCaller.apply(fun, annoArgs);
      };
    };
    if(loadScr != null) {
      this.type = "on-load";
      this.onLoad = function(fun, annoLoadArgs) {
        loadScr.apply(fun, annoLoadArgs);
      };
    };
    if(funArgCaller != null) {
      this.type = "argument";
      this.onArgCall = function(funArgs, annoArgArgs) {
        return funArgCaller.apply(funArgs, annoArgArgs);
      };
    };
    if(this.type === "undefined") {
      console.warn("[LOVEC] Annotation ${1} has undefined type!".format(this.name.color(Pal.accent)));
    };
  };


  const insNames = [];
  const nameAnnoMap = new ObjectMap();


/*
  ========================================
  Section: Definition (Static)
  ========================================
*/


  /**
   * Gets an annotation by name.
   * @param {string} name
   * @return {CLS_annotation}
   */
  CLS_annotation.get = function(name) {
    let anno = nameAnnoMap.get(name);
    if(anno == null) throw new Error("Annotation " + name + " is not found!");
    return anno;
  };


/*
  ========================================
  Section: Definition (Instance)
  ========================================
*/


  /**
   * Initializes some paramaters on this annotation.
   * @return {void}
   */
  CLS_annotation.prototype.initAnno = function() {
    nameAnnoMap.put(this.name, this);

    this.onCall = Function.airFalse;
    this.onLoad = Function.air;
    this.onArgCall = Function.airFalse;
    this.type = "undefined";
  };




module.exports = CLS_annotation;
