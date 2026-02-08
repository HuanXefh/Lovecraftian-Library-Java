/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Various methods which are mostly wrapped {extend} designed for content templates.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- base ----------> */


  CONTENT_HANDLER = {

    __NAME_MAP__: new ObjectMap(),
    __TYPE_MAPS__: {},


    add(ct) {
      CONTENT_HANDLER.__NAME_MAP__.put(ct.name, ct);
      if(CONTENT_HANDLER.__TYPE_MAPS__[ct.getContentType()] !== undefined) {
        CONTENT_HANDLER.__TYPE_MAPS__[ct.getContentType()].put(ct.name, ct);
      } else {
        CONTENT_HANDLER.__TYPE_MAPS__[ct.getContentType()] = new ObjectMap();
      };
    },


    fetch: newMultiFunction(
      function(nm) {return CONTENT_HANDLER.__NAME_MAP__.get(nm)},
      function(nm, ctType) {return CONTENT_HANDLER.__TYPE_MAPS__[ctType].get(nm)},
    ),


  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a content that is created by using content templates.
   * This method is meant to be used before INIT.
   * ---------------------------------------- */
  fetchContent = function(nmCt, ctType) {
    let ct = ctType == null ?
      CONTENT_HANDLER.fetch(nmCt) :
      CONTENT_HANDLER.fetch(nmCt, ctType);
    if(ct == null) throw new Error("Content [$1] is not registered through template!".format(nmCt));

    return ct;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Temporarily changes the class loader, so that {extend} can be called on some externally Java classes.
   * The default situation is for classes from other Java mods.
   * Remember to call this twice!
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * Love version of {extend} using content templates.
   * ---------------------------------------- */
  extendBase = function(temp, nmCt, obj) {
    processClassLoader();
    let ct = extend(temp.getParent(), nmCt, tryValProv(obj, prov(() => temp.build())));
    CONTENT_HANDLER.add(ct);
    processClassLoader();

    return ct;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {extend} used for blocks.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {extend} used for unit types.
   * ---------------------------------------- */
  extendUnit = function(temp, nmUtp, objUtp) {
    processClassLoader();
    let utp = extend(temp.getParent(), nmUtp, tryValProv(objUtp, prov(() => temp.build())));
    temp.initUnit(utp);
    CONTENT_HANDLER.add(utp);
    processClassLoader();

    return utp;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {extend} used for planets.
   * ---------------------------------------- */
  extendPlanet = function(temp, nmPla, sectorSize, objPla) {
    processClassLoader();
    let pla = extend(temp.getParent(), nmPla, null, 1.0, sectorSize, tryValProv(objPla, prov(() => temp.build())));
    temp.initPlanet(pla);
    CONTENT_HANDLER.add(pla);
    processClassLoader();

    return pla;
  };
