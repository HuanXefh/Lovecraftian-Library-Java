/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Various methods which are mostly wrapped {@link extend} designed for content templates.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- base ----------> */


  /**
   * Stores contents created with {@link extendBase} and its variants.
   * @global
   */
  CONTENT_HANDLER = {

    __NAME_MAP__: new ObjectMap(),
    __TYPE_MAPS__: {},


    /**
     * Adds a content to the storage.
     * @param {UnlockableContent} ct
     * @return {void}
     */
    add(ct) {
      CONTENT_HANDLER.__NAME_MAP__.put(ct.name, ct);
      if(CONTENT_HANDLER.__TYPE_MAPS__[ct.getContentType()] !== undefined) {
        CONTENT_HANDLER.__TYPE_MAPS__[ct.getContentType()].put(ct.name, ct);
      } else {
        CONTENT_HANDLER.__TYPE_MAPS__[ct.getContentType()] = new ObjectMap();
      };
    },


    /**
     * Gets a content from the storage.
     * Usually {@link fetchContent} is used instead.
     * @param {string} nmCt
     * @param {ContentType|unset} [ctType]
     * @return {UnlockableContent|null}
     */
    fetch: newMultiFunction(
      function(nmCt) {return CONTENT_HANDLER.__NAME_MAP__.get(nmCt)},
      function(nmCt, ctType) {return CONTENT_HANDLER.__TYPE_MAPS__[ctType].get(nmCt)},
    ),


  };


  /**
   * Gets a content that is created with {@link extendBase} or its variants.
   * This method is meant to replace {@link require} for cross-mod compatibility, do not abuse this after INIT!
   * @global
   * @param {string} nmCt
   * @param {ContentType|unset} [ctType]
   * @return {UnlockableContent}
   */
  fetchContent = function(nmCt, ctType) {
    let ct = ctType == null ?
      CONTENT_HANDLER.fetch(nmCt) :
      CONTENT_HANDLER.fetch(nmCt, ctType);
    if(ct == null) throw new Error("Content ${1} is not registered through template!".format(nmCt));

    return ct;
  };


  /**
   * Generalized version of {@link Vars.content.byName}.
   * Does not give warning when content not found.
   * Do not abuse this, use {@link MDL_content._ct} if possible.
   * @global
   * @param {ContentGn} ct_gn
   * @return {UnlockableContent|null}
   */
  findContent = function(ct_gn) {
    return ct_gn == null ?
      null :
      ct_gn instanceof UnlockableContent ?
        ct_gn :
        Vars.content.byName(ct_gn);
  };


  /**
   * Used to temporarily switch current mod to null.
   * Should always be called twice!
   * @global
   * @return {void}
   */
  processModCur = function() {
    if(!processModCur.isTail) {
      processModCur.modPrev = Reflect.get(ContentLoader, Vars.content, "currentMod");
      Reflect.set(ContentLoader, Vars.content, "currentMod", null);
    } else {
      Reflect.set(ContentLoader, Vars.content, "currentMod", processModCur.modPrev);
    };

    processModCur.isTail = !processModCur.isTail;
  };
  processModCur.isTail = false;
  processModCur.modPrev = null;


  /**
   * Temporarily changes class loader, so that {@link extendBase} can be applied on mod Java classes.
   * Should always be called twice!
   * @global
   * @param {java.lang.ClassLoader|unset} [clsLoader]
   * @return {void}
   */
  processClassLoader = function(clsLoader) {
    if(clsLoader == null) clsLoader = Vars.mods.mainLoader();

    if(!processClassLoader.isTail) {
      CONTEXT.setApplicationClassLoader(clsLoader);
    } else {
      CONTEXT.setApplicationClassLoader(processClassLoader.defLoader);
    };

    processClassLoader.isTail = !processClassLoader.isTail;
  };
  processClassLoader.isTail = false;
  processClassLoader.defLoader = CONTEXT.getApplicationClassLoader();


  /**
   * Lovec version of {@link extend} using content templates.
   * Significantly simplifies content codes.
   * @global
   * @param {Function} temp
   * @param {string} nmCt
   * @param {Object|unset} [obj]
   * @return {UnlockableContent}
   */
  extendBase = function(temp, nmCt, obj) {
    processClassLoader();
    obj = extendBase.setupObj(temp, obj);
    // Can't implement interfaces with `extend`, that's why `new JavaAdapter(...)` is used
    // You cannot pass an array as arguments to a constructor function directly, here it's wrapped in `ctorCall`
    let ct = ctorCall(JavaAdapter, extendBase.setupArgs(temp, obj, nmCt));
    extendBase.setupFields(ct, obj);
    temp.initContent(ct);
    CONTENT_HANDLER.add(ct);
    processClassLoader();

    return ct;
  };
  extendBase.setupObj = function(temp, obj) {
    // If `obj` not given, build it from template with default values
    return obj != null ? obj : temp.build();
  };
  extendBase.setupArgs = function(temp, obj) {
    // <ARGS>: javaCls, javaIntf1, javaIntf2, javaIntf3, ..., obj, arg1, arg2, arg3, ...
    let args = [temp.getParent()];
    if(args[0] == null) throw new Error("${1} has no parent Java class!".format(temp.nm));
    args.pushAll(temp.getParentIntfs(obj));
    args.push(obj);

    let restArgs = Array.from(arguments);
    restArgs.splice(0, 2);
    args.pushAll(restArgs);

    return args;
  };
  extendBase.setupFields = function(ins, obj) {
    // Java adapter only copies methods, I almost forgot this
    for(let key in obj) {
      if(typeof obj[key] === "function") continue;
      ins[key] = obj[key];
    };
    return ins;
  };


  /**
   * Variant of {@link extendBase} for blocks.
   * @global
   * @param {Array} temp
   * @param {string} nmBlk
   * @param {Object|unset} [objBlk]
   * @param {Object|unset} [objB]
   * @return {Block}
   */
  extendBlock = function(temp, nmBlk, objBlk, objB) {
    processClassLoader();
    let obj = extendBase.setupObj(temp[0], objBlk);

    if(obj.forceUseDrawer) {
      let load = obj.load;
      obj.load = function() {
        this.super$load();
        if(load != null) {
          load();
        };
        this.drawer.load(this);
      };
      obj.drawPlanRegion = function(bPlan, bPlans) {
        this.drawer.drawPlan(this, bPlan, bPlans);
      };
      obj.getRegionsToOutline = function(regSeqOut) {
        this.drawer.getRegionsToOutline(this, regSeqOut);
      };
    };

    /** @type {Block} blk */
    let blk = ctorCall(JavaAdapter, extendBase.setupArgs(temp[0], obj, nmBlk));
    extendBase.setupFields(blk, obj);
    blk.buildType = () => {
      processClassLoader();
      let obj1 = extendBase.setupObj(temp[1], objB);

      if(obj.forceUseDrawer) {
        obj1.__BACKUP_DRAW__ = obj1.draw;
        obj1.draw = function() {
          this.block.delegee == null ?
            this.block.drawer.draw(this) :
            this.block.delegee.drawer.draw(this);
          this.drawTeamTop();
        };
        obj1.__BACKUP_DRAWLIGHT__ = obj1.drawLight;
        obj1.drawLight = function() {
          this.block.delegee == null ?
            this.block.drawer.drawLight(this) :
            this.block.delegee.drawer.drawLight(this);
        };
      };

      // Building field "blk$xxx" will copy value from block field "xxx" before being used, for edge cases
      Object._it(obj1, (key, val) => {
        if(!key.startsWith("blk$")) return;
        obj1[key] = obj[key.replace("blk$", "")];
      });

      /** @type {Building} b */
      let b = ctorCall(JavaAdapter, extendBase.setupArgs(temp[1], obj1, blk));
      extendBase.setupFields(b, obj1);
      temp[1].initContent(b);
      processClassLoader();
      return b;
    };
    temp[0].initContent(blk);
    CONTENT_HANDLER.add(blk);
    processClassLoader();

    return blk;
  };


  /**
   * Variant of {@link extendBase} for unit types.
   * @global
   * @param {Function} temp
   * @param {string} nmUtp
   * @param {Object|unset} [objUtp]
   * @return {UnitType}
   */
  extendUnit = function(temp, nmUtp, objUtp) {
    processClassLoader();
    objUtp = extendBase.setupObj(temp, objUtp);
    let utp = ctorCall(JavaAdapter, extendBase.setupArgs(temp, objUtp, nmUtp));
    extendBase.setupFields(utp, objUtp);
    temp.initContent(utp);
    CONTENT_HANDLER.add(utp);
    processClassLoader();

    return utp;
  };


  /**
   * Variant of {@link extendBase} for planets.
   * @global
   * @param {CLS_contentTemplate} temp
   * @param {string} nmPla
   * @param {number} sectorSize
   * @param {Object|unset} [objPla]
   * @return {Planet}
   */
  extendPlanet = function(temp, nmPla, sectorSize, objPla) {
    processClassLoader();
    objPla = extendBase.setupObj(temp, objPla);
    let pla = ctorCall(JavaAdapter, extendBase.setupArgs(temp, objPla, nmPla, null, 1.0, sectorSize));
    extendBase.setupFields(temp, objPla);
    temp.initContent(pla);
    CONTENT_HANDLER.add(pla);
    processClassLoader();

    return pla;
  };
