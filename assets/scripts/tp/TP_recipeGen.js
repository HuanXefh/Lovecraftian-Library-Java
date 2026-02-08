/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Collection of recipe generators.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const VARGEN = require("lovec/glb/GLB_varGen");


  const CLS_recipeGenerator = require("lovec/cls/util/CLS_recipeGenerator");
  const CLS_recipeBuilder = require("lovec/cls/util/builder/CLS_recipeBuilder");


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_entity = require("lovec/mdl/MDL_entity");
  const MDL_fuel = require("lovec/mdl/MDL_fuel");


  const DB_item = require("lovec/db/DB_item");


  /* <---------- generator ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: alloy furnace.
   * Converts materials into alloy metal.
   * ---------------------------------------- */
  const _g_alloyFurnace = new CLS_recipeGenerator(function(rc, paramObj) {
    let
      objF = readParam(paramObj, "objF", Function.air),
      boolF = readParam(paramObj, "boolF", Function.airTrue),
      amtO = readParam(paramObj, "amtO", 1),
      pO = readParam(paramObj, "pO", 1.0),
      maxTemp = readParam(paramObj, "maxTemp", Infinity);

    DB_item.db["map"]["recipe"]["alloying"].forEachRow(2, (nmItm, paramObj) => {
      let
        tempReq = readParam(paramObj, "tempReq", 0.0),
        rawBi = readParam(paramObj, "bi", Array.air);

      let itm = MDL_content._ct(nmItm, "rs");
      if(itm == null) return;
      if(!boolF(itm) || tempReq > maxTemp) return;

      this.addRc(
        rc, itm.name, "alloying", null,
        obj => {this.setBaseParam(obj, paramObj); objF(obj)},
        new CLS_recipeBuilder()
        .__bi(this.parseRawBi(rawBi, amtO, pO))
        .__bo(this.processBo(itm, amtO, pO, paramObj))
        .build(),
      );
    });
  });
  exports._g_alloyFurnace = _g_alloyFurnace;


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: brick kiln.
   * Converts brick blend to brick.
   * ---------------------------------------- */
  const _g_brickKiln = new CLS_recipeGenerator(function(rc, paramObj) {
    let
      objF = readParam(paramObj, "objF", Function.air),
      boolF = readParam(paramObj, "boolF", Function.airTrue),
      amtI = readParam(paramObj, "amtI", 1),
      pI = readParam(paramObj, "pI", 1.0),
      amtO = readParam(paramObj, "amtO", 1),
      pO = readParam(paramObj, "pO", 1.0),
      maxTemp = readParam(paramObj, "maxTemp", Infinity);

    DB_item.db["map"]["recipe"]["brickBaking"].forEachRow(2, (nmItm, paramObj) => {
      let
        tempReq = readParam(paramObj, "tempReq", 0.0),
        nmItmTg = readParam(paramObj, "itmTg", null);

      let itm = MDL_content._ct(nmItm, "rs");
      if(itm == null) return;
      let itmTg = MDL_content._ct(nmItmTg, "rs");
      if(itmTg == null) return;
      if(!boolF(itm, itmTg) || tempReq > maxTemp) return;

      this.addRc(
        rc, itm.name, "brick-baking", null,
        obj => {this.setBaseParam(obj, paramObj); objF(obj)},
        new CLS_recipeBuilder()
        .__bi(this.processBi(itm, amtI, pI, paramObj))
        .__bo(this.processBo(itmTg, amtO, pO, paramObj))
        .build(),
      );
    });
  });
  exports._g_brickKiln = _g_brickKiln;


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: caster.
   * Converts materials into casting target items.
   * ---------------------------------------- */
  const _g_caster = new CLS_recipeGenerator(function(rc, paramObj) {
    let
      objF = readParam(paramObj, "objF", Function.air),
      boolF = readParam(paramObj, "boolF", Function.airTrue),
      amtO = readParam(paramObj, "amtO", 1),
      pO = readParam(paramObj, "pO", 1.0),
      payAmtO = readParam(paramObj, "payAmtO", amtO),
      maxTemp = readParam(paramObj, "maxTemp", Infinity),
      sizeCap = readParam(paramObj, "sizeCap", Infinity);

    DB_item.db["map"]["recipe"]["casting"].forEachRow(2, (nmCt, paramObj) => {
      let
        isPayTg = readParam(paramObj, "isPayTg", false),
        tempReq = readParam(paramObj, "tempReq", 0.0),
        rawBi = readParam(paramObj, "bi", Array.air),
        rawPayi = readParam(paramObj, "payi", Array.air);

      let ct = MDL_content._ct(nmCt, null, true);
      if(ct == null) return;
      if(!boolF(ct) || MDL_entity._size(ct) > sizeCap || tempReq > maxTemp) return;

      let rcBuilder = new CLS_recipeBuilder();
      !isPayTg ?
        rcBuilder.__bi(this.parseRawBi(rawBi, amtO, pO)) :
        rcBuilder.__bi(this.parseRawBi(rawBi, payAmtO, 1.0));
      rcBuilder.__payi(this.parseRawPayi(rawPayi, payAmtO));
      !isPayTg ?
        rcBuilder.__bo(this.processBo(ct, amtO, pO, paramObj)) :
        rcBuilder.__payo(this.processPayo(ct, payAmtO, paramObj));

      this.addRc(
        rc, ct.name, "casting", null,
        obj => {this.setBaseParam(obj, paramObj); objF(obj)},
        rcBuilder.build(),
      );
    });
  });
  exports._g_caster = _g_caster;


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: forge.
   * Converts materials into forging target items.
   * ---------------------------------------- */
  const _g_forge = new CLS_recipeGenerator(function(rc, paramObj) {
    let
      objF = readParam(paramObj, "objF", Function.air),
      boolF = readParam(paramObj, "boolF", Function.airTrue),
      amtO = readParam(paramObj, "amtO", 1),
      pO = readParam(paramObj, "pO", 1.0),
      payAmtO = readParam(paramObj, "payAmtO", amtO),
      maxTemp = readParam(paramObj, "maxTemp", Infinity),
      sizeCap = readParam(paramObj, "sizeCap", Infinity);

    DB_item.db["map"]["recipe"]["forging"].forEachRow(2, (nmCt, paramObj) => {
      let
        isPayTg = readParam(paramObj, "isPayTg", false),
        tempReq = readParam(paramObj, "tempReq", 0.0),
        rawBi = readParam(paramObj, "bi", Array.air),
        rawPayi = readParam(paramObj, "payi", Array.air);

      let ct = MDL_content._ct(nmCt, null, true);
      if(ct == null) return;
      if(!boolF(ct) || MDL_entity._size(ct) > sizeCap || tempReq > maxTemp) return;

      let rcBuilder = new CLS_recipeBuilder();
      !isPayTg ?
        rcBuilder.__bi(this.parseRawBi(rawBi, amtO, pO)) :
        rcBuilder.__bi(this.parseRawBi(rawBi, payAmtO, 1.0));
      rcBuilder.__payi(this.parseRawPayi(rawPayi, payAmtO));
      !isPayTg ?
        rcBuilder.__bo(this.processBo(ct, amtO, pO, paramObj)) :
        rcBuilder.__payo(this.processPayo(ct, payAmtO, paramObj));

      this.addRc(
        rc, ct.name, "forging", null,
        obj => {this.setBaseParam(obj, paramObj); objF(obj)},
        rcBuilder.build(),
      );
    });
  });
  exports._g_forge = _g_forge;


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: mixer.
   * Mixes materials into blend.
   * ---------------------------------------- */
  const _g_mixer = new CLS_recipeGenerator(function(rc, paramObj) {
    let
      objF = readParam(paramObj, "objF", Function.air),
      boolF = readParam(paramObj, "boolF", Function.airTrue),
      isBallMill = readParam(paramObj, "isBallMill", false),
      amtO = readParam(paramObj, "amtO", 1),
      pO = readParam(paramObj, "pO", 1.0),
      minHardness = readParam(paramObj, "minHardness", 0),
      maxHardness = readParam(paramObj, "maxHardness", Infinity),
      abrasionFactor = readParam(paramObj, "abrasionFactor", 1.0);

    DB_item.db["map"]["recipe"][isBallMill ? "ballMillMixing" : "mixing"].forEachRow(2, (nmItm, paramObj) => {
      let
        rawBi = readParam(paramObj, "bi", Array.air);

      let itm = MDL_content._ct(nmItm, "rs");
      if(itm == null) return;
      if(!boolF(itm)) return;

      let bi = this.parseRawBi(rawBi, amtO, pO);
      let hardness = Math.max.apply(null, bi.flatten().pullAll(-1.0).readCol(3, 0).inSituMap(nmRs => MDL_content._ct(nmRs, "rs").hardness).pullAll(undefined).unshiftAll(0.0));

      this.addRc(
        rc, itm.name, isBallMill ? "ball-mill-mixing" : "mixing", null,
        obj => {if(isBallMill) obj.durabDecMtp = Mathf.lerp(1.0, 1.5 * abrasionFactor, Mathf.maxZero(hardness - minHardness) / 10.0); this.setBaseParam(obj, paramObj); objF(obj)},
        new CLS_recipeBuilder()
        .__bi(bi)
        .__bo(this.processBo(itm, amtO, pO, paramObj))
        .build(),
      );
    });
  });
  exports._g_mixer = _g_mixer;


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: liquid mixer.
   * Mixes items and liquids to produce a solution.
   * ---------------------------------------- */
  const _g_liquidMixer = new CLS_recipeGenerator(function(rc, paramObj) {
    let
      objF = readParam(paramObj, "objF", Function.air),
      boolF = readParam(paramObj, "boolF", Function.airTrue),
      time = readParam(paramObj, "time", 1.0),
      amtO = readParam(paramObj, "amtO", 1);

    DB_item.db["map"]["recipe"]["mixingLiquid"].forEachRow(2, (nmLiq, paramObj) => {
      let
        rawCi = readParam(paramObj, "ci", Array.air),
        rawBi = readParam(paramObj, "bi", Array.air);

      let liq = MDL_content._ct(nmLiq, "rs");
      if(liq == null) return;
      if(!boolF(liq)) return;

      this.addRc(
        rc, liq.name, "liquid-mixing", null,
        obj => {this.setBaseParam(obj, paramObj); objF(obj)},
        new CLS_recipeBuilder()
        .__ci(this.parseRawCi(liq, amtO * 6.0 / time))
        .__bi(this.parseRawBi(liq, amtO))
        .__co(this.processCo(liq, amtO * 6.0 / time, paramObj))
        .build(),
      );
    });

    VARGEN.intmds["rs-sol"].forEachFast(liq => {
      let parent = liq.delegee.intmdParent;
      if(parent == null) return;
      let liqSolv = DB_HANDLER.read("liq-solvent", liq.delegee.solvent, null);
      if(liqSolv == null) return;
      if(!boolF(parent, liqSolv)) return;

      this.addRc(
        rc, parent.name, "liquid-mixing", liqSolv.name,
        obj => {objF(obj)},
        new CLS_recipeBuilder()
        .__ci(this.processCi(liqSolv, amtO * 6.0 / time))
        .__bi(this.processBi(parent, amtO, 1.0))
        .__co(this.processCo(liq, amtO * 6.0 / time))
        .build(),
      );
    });
  });
  exports._g_liquidMixer = _g_liquidMixer;


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: filter.
   * Separates items from slurry, or liquids from morbid solution.
   * ---------------------------------------- */
  const _g_filter = new CLS_recipeGenerator(function(rc, paramObj) {
    let
      objF = readParam(paramObj, "objF", Function.air),
      boolF = readParam(paramObj, "boolF", Function.airTrue),
      isItemFilter = readParam(paramObj, "isItemFilter", false),
      amtI = readParam(paramObj, "amtI", 1),
      pI = readParam(paramObj, "pI", 1.0),
      amtO = readParam(paramObj, "amtO", 1),
      pO = readParam(paramObj, "pO", 1.0);

    DB_item.db["map"]["recipe"][isItemFilter ? "filtration" : "filtrationLiquid"].forEachRow(2, (nmItm, paramObj) => {
      let
        nmItmTg = readParam(paramObj, "itmTg", null);

      let itm = MDL_content._ct(nmItm, "rs");
      if(itm == null) return;
      let itmTg = MDL_content._ct(nmItmTg, "rs");
      if(itmTg == null) return;
      if(!boolF(itm, itmTg)) return;

      this.addRc(
        rc, itm.name, "filtration", null,
        obj => {this.setBaseParam(obj, paramObj); objF(obj)},
        new CLS_recipeBuilder()
        .__bi(this.processBi(itm, amtI, pI, paramObj))
        .__bo(this.processBo(itmTg, amtO, pO, paramObj))
        .build(),
      );
    });
  });
  exports._g_filter = _g_filter;


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: purifier.
   * Purifies ore chunks/dusts.
   * ---------------------------------------- */
  const _g_purifier = new CLS_recipeGenerator(function(rc, paramObj) {
    let
      objF = readParam(paramObj, "objF", Function.air),
      boolF = readParam(paramObj, "boolF", Function.airTrue),
      tier = readParam(paramObj, "tier", 1),
      amtI = readParam(paramObj, "amtI", 1),
      pI = readParam(paramObj, "pI", 1.0);

    DB_item.db["map"]["recipe"][tier === 2 ? "purificationII" : "purificationI"].forEachRow(2, (nmItm, paramObj) => {
      let
        rawBo = readParam(paramObj, "bo", Array.air);

      let itm = MDL_content._ct(nmItm, "rs");
      if(itm == null) return;
      if(!boolF(itm)) return;

      this.addRc(
        rc, itm.name, "purification", null,
        obj => {this.setBaseParam(obj, paramObj); objF(obj)},
        new CLS_recipeBuilder()
        .__bi(this.processBi(itm, amtI, pI, paramObj))
        .__bo(this.parseRawBo(rawBo, amtI, amtI))
        .build(),
      );
    });
  });
  exports._g_purifier = _g_purifier;


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: purifier.
   * Purifies ore chunks/dusts. Specially designed for magnetic separators.
   * ---------------------------------------- */
  const _g_purifierMagnetic = new CLS_recipeGenerator(function(rc, paramObj) {
    let
      objF = readParam(paramObj, "objF", Function.air),
      boolF = readParam(paramObj, "boolF", Function.airTrue),
      amtI = readParam(paramObj, "amtI", 1),
      pI = readParam(paramObj, "pI", 1.0);

    DB_item.db["map"]["recipe"]["purificationMagnetic"].forEachRow(2, (nmItm, paramObj) => {
      let
        rawBo = readParam(paramObj, "bo", Array.air);

      let itm = MDL_content._ct(nmItm, "rs");
      if(itm == null) return;
      if(!boolF(itm)) return;

      this.addRc(
        rc, itm.name, "purification", null,
        objF,
        new CLS_recipeBuilder()
        .__bi(this.processBi(itm, amtI, pI, paramObj))
        .__bo(this.parseRawBo(rawBo, amtI, pI))
        .build(),
      );
    });
  });
  exports._g_purifierMagnetic = _g_purifierMagnetic;


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: rock crusher.
   * Converts ore items into chunks.
   * ---------------------------------------- */
  const _g_rockCrusher = new CLS_recipeGenerator(function(rc, paramObj) {
    let
      objF = readParam(paramObj, "objF", Function.air),
      boolF = readParam(paramObj, "boolF", Function.airTrue),
      amtI = readParam(paramObj, "amtI", 1),
      pI = readParam(paramObj, "pI", 1.0),
      amtO = readParam(paramObj, "amtO", 1),
      pO = readParam(paramObj, "pO", 1.0),
      minHardness = readParam(paramObj, "minHardness", 0),
      maxHardness = readParam(paramObj, "maxHardness", Infinity),
      abrasionFactor = readParam(paramObj, "abrasionFactor", 1.0);

    VARGEN.intmds["rs-chunks"].forEachCond(itm => !itm.ex_getIntmdTags().includesAny("rs-p1", "rs-p2"), itm => {
      let itmParent = itm.delegee.intmdParent;
      if(itmParent == null) return;
      let hardness = itmParent.hardness;
      if(!boolF(itm, itmParent) || hardness < minHardness || hardness > maxHardness) return;

      this.addRc(
        rc, itm.name, "rock-crushing", null,
        obj => {obj.durabDecMtp = Mathf.lerp(1.0, 2.0 * abrasionFactor, Mathf.maxZero(hardness - minHardness) / 10.0); objF(obj)},
        new CLS_recipeBuilder()
        .__bi(this.processBi(itmParent, amtI, pI))
        .__bo(this.processBo(itm, amtO, pO))
        .build(),
      );
    });
  });
  exports._g_rockCrusher = _g_rockCrusher;


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: rock crusher.
   * Converts some rocks into aggregate.
   * See {DB_item.db["group"]["aggregate"]}.
   * ---------------------------------------- */
  const _g_rockCrusherAggregate = new CLS_recipeGenerator(function(rc, paramObj) {
    let
      objF = readParam(paramObj, "objF", Function.air),
      boolF = readParam(paramObj, "boolF", Function.airTrue),
      amtI = readParam(paramObj, "amtI", 1),
      pI = readParam(paramObj, "pI", 1.0),
      amtO = readParam(paramObj, "amtO", 1),
      pO = readParam(paramObj, "pO", 1.0),
      minHardness = readParam(paramObj, "minHardness", 0),
      maxHardness = readParam(paramObj, "maxHardness", Infinity),
      abrasionFactor = readParam(paramObj, "abrasionFactor", 1.0);

    // Coarse aggregate to fine aggregate on top of everything
    this.addRc(
      rc, "loveclab-item0buil-coarse-aggregate", "aggregate-crushing", null,
      objF,
      new CLS_recipeBuilder()
      .__bi(this.processBi("loveclab-item0buil-coarse-aggregate", amtI, pI))
      .__bo(this.processBo("loveclab-item0buil-fine-aggregate", amtO, pO))
      .build(),
    );

    DB_item.db["group"]["aggregate"].forEachRow(2, (nmItm, mtp) => {
      let itm = MDL_content._ct(nmItm, "rs");
      if(itm == null) return;
      let hardness = itm.hardness;
      if(!boolF(itm) || hardness < minHardness || hardness > maxHardness) return;

      this.addRc(
        rc, itm.name, "aggregate-crushing", null,
        obj => {obj.durabDecMtp = Mathf.lerp(1.0, 2.0 * abrasionFactor, Mathf.maxZero(hardness - minHardness) / 10.0); objF(obj)},
        new CLS_recipeBuilder()
        .__bi(this.processBi(itm, Math.round(amtI * Math.max(mtp, 1.0)), pI * Math.min(mtp, 1.0)))
        .__bo(this.processBo("loveclab-item0buil-coarse-aggregate", amtO, pO))
        .build(),
      );
    });
  });
  exports._g_rockCrusherAggregate = _g_rockCrusherAggregate;


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: pulverizer.
   * Converts ore items into dust.
   * ---------------------------------------- */
  const _g_pulverizer = new CLS_recipeGenerator(function(rc, paramObj) {
    let
      objF = readParam(paramObj, "objF", Function.air),
      boolF = readParam(paramObj, "boolF", Function.airTrue),
      amtI = readParam(paramObj, "amtI", 1),
      pI = readParam(paramObj, "pI", 1.0),
      amtO = readParam(paramObj, "amtO", 1),
      pO = readParam(paramObj, "pO", 1.0),
      minHardness = readParam(paramObj, "minHardness", 0),
      maxHardness = readParam(paramObj, "maxHardness", Infinity),
      abrasionFactor = readParam(paramObj, "abrasionFactor", 1.0);

    VARGEN.intmds["rs-dust"].forEachCond(itm => !itm.ex_getIntmdTags().includesAny("rs-p1", "rs-p2"), itm => {
      let itmParent = itm.delegee.intmdParent;
      if(itmParent == null) return;
      let hardness = itmParent.hardness;
      if(!boolF(itm, itmParent) || hardness < minHardness || hardness > maxHardness) return;

      this.addRc(
        rc, itm.name, "pulverization", null,
        obj => {obj.durabDecMtp = Mathf.lerp(1.0, 1.5 * abrasionFactor, Mathf.maxZero(hardness - minHardness) / 10.0); objF(obj)},
        new CLS_recipeBuilder()
        .__bi(this.processBi(itmParent, amtI, pI))
        .__bo(this.processBo(itm, amtO, pO))
        .build(),
      );
    });
  });
  exports._g_pulverizer = _g_pulverizer;


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: roasting furnace.
   * Converts items to their roasted form.
   * ---------------------------------------- */
  const _g_roastingFurnace = new CLS_recipeGenerator(function(rc, paramObj) {
    let
      objF = readParam(paramObj, "objF", Function.air),
      boolF = readParam(paramObj, "boolF", Function.airTrue),
      isConcentrate = readParam(paramObj, "isConcentrate", false),
      amtI = readParam(paramObj, "amtI", 1),
      pI = readParam(paramObj, "pI", 1.0),
      amtO = readParam(paramObj, "amtO", 1),
      pO = readParam(paramObj, "pO", 1.0),
      maxTemp = readParam(paramObj, "maxTemp", Infinity),
      maxFlam = readParam(paramObj, "maxFlam", Infinity);

    DB_item.db["map"]["recipe"][!isConcentrate ? "roasting" : "concentrateRoasting"].forEachRow(2, (nmItm, paramObj) => {
      let
        tempReq = readParam(paramObj, "tempReq", 0.0),
        nmItmTg = readParam(paramObj, "itmTg", null);

      let itm = MDL_content._ct(nmItm, "rs");
      if(itm == null) return;
      let itmTg = MDL_content._ct(nmItmTg, "rs");
      if(itmTg == null) return;
      if(!boolF(itm, itmTg) || tempReq > maxTemp || itm.flammability > maxFlam || itmTg.flammability > maxFlam) return;

      this.addRc(
        rc, itm.name, "roasting", null,
        obj => {this.setBaseParam(obj, paramObj); objF(obj)},
        new CLS_recipeBuilder()
        .__bi(this.processBi(itm, amtI, pI))
        .__bo(this.processBo(itmTg, amtO, pO))
        .build(),
      );
    });
  });
  exports._g_roastingFurnace = _g_roastingFurnace;


  /* ----------------------------------------
  * NOTE:
  *
  * Recipe generator: sintering furnace.
  * Converts dust items back into their parent items (the ore at most time).
  * ---------------------------------------- */
  const _g_sinteringFurnace = new CLS_recipeGenerator(function(rc, paramObj) {
    let
      objF = readParam(paramObj, "objF", Function.air),
      boolF = readParam(paramObj, "boolF", Function.airTrue),
      isConcentrate = readParam(paramObj, "isConcentrate", false),
      amtI = readParam(paramObj, "amtI", 1),
      pI = readParam(paramObj, "pI", 1.0),
      amtO = readParam(paramObj, "amtO", 1),
      pO = readParam(paramObj, "pO", 1.0),
      maxTemp = readParam(paramObj, "maxTemp", Infinity),
      maxFlam = readParam(paramObj, "maxFlam", Infinity);

    if(!isConcentrate) {
      VARGEN.intmds["rs-dust"].forEachCond(itm => !itm.ex_getIntmdTags().includesAny("rs-p1", "rs-p2"), itm => {
        let itmParent = itm.delegee.intmdParent;
        if(itmParent == null) return;
        let tempReq = DB_HANDLER.read("itm-sint-temp", itmParent);
        if(tempReq < 0.0) return;
        if(!boolF(itm, itmParent) || tempReq > maxTemp || itm.flammability > maxFlam || itmParent.flammability > maxFlam) return;

        this.addRc(
          rc, itm.name, "sintering", null,
          obj => {obj.tempReq = tempReq; objF(obj)},
          new CLS_recipeBuilder()
          .__bi(this.processBi(itm, amtI, pI))
          .__bo(this.processBo(itmParent, amtO, pO))
          .build(),
        );
      });
    } else {
      VARGEN.intmds["rs-chunks"].concat(VARGEN.intmds["rs-dust"]).filter(itm => !itm.ex_getIntmdTags().includesAny("rs-p1", "rs-p2")).forEachFast(itm => {
        let itmParent = itm.delegee.intmdParent;
        if(itmParent == null) return;
        let itmTg = MDL_content._intmd(itm, "rs-ore0conc");
        if(itmTg == null) return;
        let tempReq = DB_HANDLER.read("itm-sint-temp", itmParent);
        if(tempReq < 0.0) return;
        if(!boolF(itm, itmParent, itmTg) || tempReq > maxTemp || itm.flammability > maxFlam || itmParent.flammability > maxFlam || itmTg.flammability > maxFlam) return;

        this.addRc(
          rc, itmTg.name, "concentrate-sintering", null,
          obj => {obj.tempReq = tempReq; objF(obj)},
          new CLS_recipeBuilder()
          .__bi(this.processBi(itm, amtI, pI))
          .__bo(this.processBo(itmTg, amtO, pO))
          .build(),
        );
      });
    };
  });
  exports._g_sinteringFurnace = _g_sinteringFurnace;


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: smelter.
   * Converts ore items (or concentrate items) to their refined form.
   * ---------------------------------------- */
  const _g_smelter = new CLS_recipeGenerator(function(rc, paramObj) {
    let
      objF = readParam(paramObj, "objF", Function.air),
      boolF = readParam(paramObj, "boolF", Function.airTrue),
      isConcentrate = readParam(paramObj, "isConcentrate", false),
      amtI = readParam(paramObj, "amtI", 1),
      pI = readParam(paramObj, "pI", 1.0),
      maxTemp = readParam(paramObj, "maxTemp", Infinity);

    DB_item.db["map"]["recipe"][!isConcentrate ? "smelting" : "concentrateSmelting"].forEachRow(2, (nmItm, paramObj) => {
      let
        rawBo = readParam(paramObj, "bo", Array.air),
        tempReq = readParam(paramObj, "tempReq", 0.0);

      let itm = MDL_content._ct(nmItm, "rs");
      if(itm == null) return;
      if(!boolF(itm) || tempReq > maxTemp) return;

      this.addRc(
        rc, itm.name, "smelting", null,
        obj => {this.setBaseParam(obj, paramObj); objF(obj)},
        new CLS_recipeBuilder()
        .__bi(this.processBi(itm, amtI, pI))
        .__bo(this.parseRawBo(rawBo, amtI, pI))
        .build(),
      );
    });
  });
  exports._g_smelter = _g_smelter;
