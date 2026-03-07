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


  /* <---------- import ----------> */


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
    if(ct == null) throw new Error("Content [$1] is not registered through template!".format(nmCt));

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
   * Temporarily changes class loader, so that {@link extend} can be applied on mod Java classes.
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
   * Lovec version of {@extend} using content templates.
   * @global
   * @param {Function} temp
   * @param {string} nmCt
   * @param {Object|unset} [obj]
   * @return {UnlockableContent}
   */
  extendBase = function(temp, nmCt, obj) {
    processClassLoader();
    let ct = extend(temp.getParent(), nmCt, tryValProv(obj, prov(() => temp.build())));
    CONTENT_HANDLER.add(ct);
    processClassLoader();

    return ct;
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
    let obj = tryValProv(objBlk, prov(() => temp[0].build()));
    if(obj.forceUseDrawer) {
      let load = obj.load;
      obj.load = function() {
        if(load != null) {
          load.load();
        };
        this.super$load();
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
    let blk = extend(temp[0].getParent(), nmBlk, obj);
    blk.buildType = () => {
      processClassLoader();
      let obj1 = tryValProv(objB, prov(() => temp[1].build()));
      if(obj.forceUseDrawer) {
        obj1.draw = function() {
          this.drawTeamTop();
          this.block.delegee == null ?
            this.block.drawer.draw(this) :
            this.block.delegee.drawer.draw(this);
        };
        obj1.drawLight = function() {
          this.block.delegee == null ?
            this.block.drawer.drawLight(this) :
            this.block.delegee.drawer.drawLight(this);
        };
      };
      /** @type {Building} b */
      let b = extend(temp[1].getParent(), blk, obj1);
      temp[1].initBuild(b);
      processClassLoader();
      return b;
    };
    temp[0].initBlock(blk);
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
    let utp = extend(temp.getParent(), nmUtp, tryValProv(objUtp, prov(() => temp.build())));
    temp.initUnit(utp);
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
    let pla = extend(temp.getParent(), nmPla, null, 1.0, sectorSize, tryValProv(objPla, prov(() => temp.build())));
    temp.initPlanet(pla);
    CONTENT_HANDLER.add(pla);
    processClassLoader();

    return pla;
  };
