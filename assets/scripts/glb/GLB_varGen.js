/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Most generated parameters, some are only populated after CLIENT LOAD.
   * @module lovec/glb/GLB_varGen
   */


/*
  ========================================
  Section: Definition (Util)
  ========================================
*/


  /* <---------- graph ----------> */


  const initGraphMethodMap = new ObjectMap();
  const updateGraphMethodMap = new ObjectMap();
  const updateGraphQueue = [];


  /**
   * Adds a graph to the update queue.
   * If the graph is already added, this method does nothing.
   * @param {MathGraph|null} graph
   * @return {void}
   */
  const queueGraphUpdate = function(graph) {
    if(Vars.state.isPaused() || graph == null) return;
    updateGraphQueue.pushUnique(graph);
  };
  exports.queueGraphUpdate = queueGraphUpdate;


  /**
   * Sets init method of a graph type.
   * @param {string} graphType - See {@link INTF_BLK_graphBlock}.
   * @param {function(MathGraph): void} fun - <ARGS>: graph
   * @return {void}
   */
  const setGraphInit = function(graphType, fun) {
    initGraphMethodMap.put(graphType, fun);
  };
  exports.setGraphInit = setGraphInit;


  /**
   * Sets update method of a graph type.
   * @param {string} graphType - See {@link INTF_BLK_graphBlock}.
   * @param {function(MathGraph): void} fun - <ARGS>: graph
   * @return {void}
   */
  const setGraphUpdate = function(graphType, fun) {
    updateGraphMethodMap.put(graphType, fun);
  };
  exports.setGraphUpdate = setGraphUpdate;


  MDL_event._c_onUpdate(() => {

    if(Vars.state.isPaused()) return;

    updateGraphQueue.forEachFast(graph => {
      if(graph.graphData == null) {
        graph.graphData = {
          justShrunk: false,
        };
        initGraphMethodMap.get(graph.graphTag, Function.air)(graph);
      };
      updateGraphMethodMap.get(graph.graphTag, Function.air)(graph);
    });
    updateGraphQueue.clear();

  }, 29151587);


  /* <---------- key binding ----------> */


  const bindings = {};


  /**
   * Gets a key binding by name.
   * @param {string} name
   * @return {KeyBind|null}
   */
  const _keyBind = function(name) {
    return tryVal(bindings[name], null);
  };
  exports._keyBind = _keyBind;


  /**
   * Adds a new key binding.
   * @param {string} name
   * @param {KeyCode} keyCodeDef
   * @param {string} categ
   * @return {boolean}
   */
  const addKeyBind = function(name, keyCodeDef, categ) {
    if(bindings[name] !== undefined) {
      console.warn("[LOVEC] Key binding ${1} has already been registered!".format(name.color(Pal.accent)));
      return false;
    };
    bindings[name] = KeyBind.add(name, keyCodeDef, categ);

    return true;
  };
  exports.addKeyBind = addKeyBind;


  /* <---------- content ----------> */


  exports.nameModTempParserMap = new ObjectMap();


  /* <---------- dialog flow ----------> */


  exports.dialFlowNameCtMap = new ObjectMap();
  exports.dialFlowTextLog = [];
  exports.dialFlowBgPool = [];
  exports.dialFlowImgPool = [];
  exports.dialFlowCharaPool = [];
  exports.dialFlowSelectionPool = [];


  /* <---------- achievement ----------> */


  exports.achievements = [];


  /* <---------- remains ----------> */


  const blkRemainsMap = new ObjectMap();
  exports.blkRemainsMap = blkRemainsMap;
  const unitRemainsArr = [];
  exports.unitRemainsArr = unitRemainsArr;


  MDL_event._c_onLoad(() => {

    TRIGGER.mapExit.addGlobalListener(() => {
      blkRemainsMap.clear();
      unitRemainsArr.clear();
    });

  });


  /* <---------- unit data ----------> */


  const expiredUnits = [];


  const unitDataMap = new ObjectMap();
  exports.unitDataMap = unitDataMap;


  MDL_event._c_onLoad(() => {

    TRIGGER.majorIter.start.addGlobalListener(() => {
      expiredUnits.clear();
      unitDataMap.each((unit, dataObj) => {
        if(!unit.isAdded()) expiredUnits.push(unit);
      });
      expiredUnits.forEachFast(unit => unitDataMap.remove(unit));
    });

  }, 16200057);


/*
  ========================================
  Section: Definition (Generic)
  ========================================
*/


  /* <---------- sprite ----------> */


  MDL_event._c_onLoad(() => {


    /**
     * Extra texture regions registered in {@link DB_misc}.
     * @type {Object<string, TextureRegion>}
     */
    exports.iconRegs = (function() {
      let obj = {};
      DB_misc.db["texture"]["icon"].forEachRow(2, (name, nameReg) => {
        obj[name] = findRegion(nameReg);
      });
      return obj;
    })();


    /**
     * Extra drawable texture regions registered in {@link DB_misc}.
     * @type {Object<string, TextureRegionDrawable>}
     */
    exports.icons = (function() {
      let obj = {};
      Object._it(module.exports.iconRegs, (name, reg) => {
        obj[name] = new TextureRegionDrawable(reg);
      });
      return obj;
    })();


    /**
     * Default heat regions for blocks.
     * @type {Array<TextureRegion>}
     */
    exports.blockHeatRegs = [
      findRegion("error"),
      MDL_texture._regHeat(1),
      MDL_texture._regHeat(2),
      MDL_texture._regHeat(3),
      MDL_texture._regHeat(4),
      MDL_texture._regHeat(5),
      MDL_texture._regHeat(6),
      MDL_texture._regHeat(7),
      MDL_texture._regHeat(8),
      findRegion("error"),
      findRegion("error"),
      findRegion("error"),
      findRegion("error"),
      findRegion("error"),
      findRegion("error"),
      findRegion("error"),
    ];


    /**
     * Texture regions used for wire.
     * @type {Object}
     * @prop {ObjectMap} regMap - Maps a material to wire region.
     * @prop {ObjectMap} endRegMap - Maps a material to wire end region.
     * @prop {TextureRegion} glowReg - Wire glow region.
     * @prop {TextureRegion} shaReg - Wire shadow region.
     */
    exports.wireRegs = (function() {
      let obj = {};
      obj.regMap = new ObjectMap();
      obj.endRegMap = new ObjectMap();
      DB_block.db["grpParam"]["wireMatReg"].forEachRow(2, (wireMat, nameReg) => {
        obj.regMap.put(wireMat, findRegion(nameReg));
        obj.endRegMap.put(wireMat, findRegion(nameReg + "-end"));
      });
      obj.glowReg = findRegion("lovec-ast-wire-glow");
      obj.shaReg = findRegion("lovec-ast-wire-shadow");
      return obj;
    })();


    /**
     * Miscellaneous texture regions.
     * @type {Object<string, TextureRegion>}
     */
    exports.miscRegs = {
      arrow: findRegion("bridge-arrow"),
      laserLine: findRegion("laser"),
      laserEnd: findRegion("laser-end"),
    };


    /**
     * Extra noise textures registered in {@link DB_misc}.
     * @type {Object<string, Texture>}
     */
    exports.noiseTexs = (function() {
      let obj = {};
      let load = path => {
        if(Vars.headless) return new Texture();
        Core.assets.load(path, Texture);
        return Core.assets.get(path, Texture);
      };
      DB_misc.db["texture"]["noise"].forEachRow(2, (name, path) => {
        try {
          obj[name] = load(path);
          obj[name].setFilter(Texture.TextureFilter.linear);
          obj[name].setWrap(Texture.TextureWrap.repeat);
        } catch(err) {
          console.warn("[LOVEC] Cannot load noise texture for: " + path);
        };
      });
      return obj;
    })();


  }, 25777741);


  /* <---------- list ----------> */


  MDL_event._c_onLoad(() => {


    /**
     * Teams for major iteration.
     * @type {Array<Team>}
     */
    exports.mainTeams = [
      Team.sharded,
      Team.crux,
      Team.malis,
      Team.green,
      Team.blue,
      Team.neoplastic,
    ].pushAll(DB_env.db["extraMainTeam"]);


    /**
     * Maps faction to contents under it.
     * @type {Object<string, Array<UnlockableContent>>}
     */
    exports.factions = (function() {
      let obj = {};
      DB_block.db["grpParam"]["factionColor"].forEachRow(2, (faction, colorStr) => {
        if(faction === "none") return;
        obj[faction] = MDL_content._factionCts(faction);
      });
      return obj;
    })();


    /**
     * Maps factory family to blocks under it.
     * @type {Object<string, Array<Block>>}
     */
    exports.facFamis = (function() {
      let obj = {};
      MDL_content._facFamisDefined().forEachFast(fami => obj[fami] = MDL_content._facFamiBlks(fami));
      return obj;
    })();


    /**
     * All contents that are registered in recipe dictionary.
     * @type {Array<UnlockableContent>}
     */
    exports.rcDictCts = [];


    /* <------------------------------ resource ------------------------------ */


    /**
     * All shown items and liquids.
     * @type {Array<Resource>}
     */
    exports.rss = Vars.content.items().toArray().concat(Vars.content.liquids().toArray()).inSituFilter(rs => !rs.hidden);


    /**
     * Items in the sand group, see {@link DB_item}.
     * @type {Array<Item>}
     */
    exports.sandItms = (function() {
      let arr = [];
      DB_item.db["group"]["sand"].forEachFast(name => {
        let itm = MDL_content._ct(name, "rs");
        if(itm != null) arr.push(itm);
      });
      return arr;
    })();


    /**
     * Fluids with fluid heat.
     * @type {Array<Liquid>}
     */
    exports.hotFlds = (function() {
      let arr = [];
      Vars.content.liquids().each(
        liq => DB_HANDLER.read("liq-fheat", liq, 0.0) >= 50.0,
        liq => arr.push(liq),
      );
      return arr;
    })();


    /**
     * Items that can be used as fuel.
     * @type {Array<Item>}
     */
    exports.fuelItms = (function() {
      let arr = [];
      DB_item.db["param"]["fuel"]["item"].forEachRow(2, (name, params) => {
        let itm = MDL_content._ct(name, "rs");
        if(itm != null) arr.push(itm);
      });
      return arr;
    })();


    /**
     * Liquids (no gases) that can be used as fuel.
     * @type {Array<Liquid>}
     */
    exports.fuelLiqs = (function() {
      let arr = [];
      DB_item.db["param"]["fuel"]["fluid"].forEachRow(2, (name, params) => {
        let liq = MDL_content._ct(name, "rs");
        if(liq != null && !liq.gas) arr.push(liq);
      });
      return arr;
    })();


    /**
     * Gases that can be used as fuel.
     * @type {Array<Liquid>}
     */
    exports.fuelGases = (function() {
      let arr = [];
      DB_item.db["param"]["fuel"]["fluid"].forEachRow(2, (name, params) => {
        let liq = MDL_content._ct(name, "rs");
        if(liq != null && liq.gas) arr.push(liq);
      });
      return arr;
    })();


    /**
     * Maps intermediate tags to intermediate resources under it.
     * @type {Object<string, Array<Resource>>}
     */
    exports.intmds = (function() {
      let obj = {};
      DB_item.db["intmd"]["tag"].forEachFast(tag => obj[tag] = []);
      Vars.content.items().each(itm => tryFun(itm.ex_getIntmdTags, itm, Array.air).forEachFast(tag => obj[tag].push(itm)));
      Vars.content.liquids().each(liq => tryFun(liq.ex_getIntmdTags, liq, Array.air).forEachFast(tag => obj[tag].push(liq)));
      return obj;
    })();


    /**
     * All waste items.
     * @type {Array<Item>}
     */
    exports.wasItms = Vars.content.items().select(itm => MDL_cond._isWaste(itm)).toArray();


    /**
     * All waste fluids.
     * @type {Array<Liquid>}
     */
    exports.wasFlds = Vars.content.liquids().select(liq => MDL_cond._isWaste(liq)).toArray();


    /**
     * Items that are considered explosive.
     * @type {Array<Item>}
     */
    exports.exploItms = Vars.content.items().select(itm => itm.explosiveness >= 0.3 && itm.flammability >= 0.3).toArray();


    /**
     * Fluids that are considered explosive.
     * @type {Array<Liquid>}
     */
    exports.exploFlds = Vars.content.liquids().select(liq => (liq.explosiveness >= 0.3 || liq.flammability >= 0.3) && !MDL_cond._isAuxiliaryFluid(liq)).toArray();


    /**
     * All abstract fluids.
     * @type {Array<Liquid>}
     */
    exports.auxs = Vars.content.liquids().select(liq => MDL_cond._isAuxiliaryFluid(liq)).toArray();


    /**
     * All non-abstract fluids.
     * @type {Array<Liquid>}
     */
    exports.nonAuxs = Vars.content.liquids().select(liq => !MDL_cond._isAuxiliaryFluid(liq)).toArray();


    /* <------------------------------ block ------------------------------ */


    /**
     * All non-environmental blocks.
     * @type {Array<Block>}
     */
    exports.nonEnvBlks = Vars.content.blocks().select(blk => blk.synthetic()).toArray();


    /**
     * See {@link BLK_rawOreBlock}.
     * @type {Array<Block>}
     */
    exports.rawOreBlks = Vars.content.blocks().select(blk => checkCreatedByTemp(blk) && blk.ex_isSubInsOf("BLK_rawOreBlock")).toArray();


    Time.run(0.0, () => {
      /**
       * Blocks that can be payload input or output.
       * @type {Array<Block>}
       */
      exports.payMatBlks = module.exports.nonEnvBlks.filter(blk => MDL_recipeDict.rcDict.cons.block[blk.id].length > 0 || MDL_recipeDict.rcDict.prod.block[blk.id].length > 0);
    });


    /* unit type */


    Time.run(0.0, () => {
      /**
       * Unit types that can be crafted.
       * @type {Array<UnitType>}
       */
      exports.buildableUtps = Vars.content.units().select(utp => !utp.internal && (MDL_recipeDict.rcDict.cons.unit[utp.id].length > 0 || MDL_recipeDict.rcDict.prod.unit[utp.id].length > 0)).toArray();
    });


    /**
     * All vanilla unit types.
     * @type {Array<UnitType>}
     */
    exports.vanillaUtps = Vars.content.units().select(utp => MDL_content._mod(utp) === "vanilla").toArray();


    /**
     * Non-robot unit types.
     * @type {Array<UnitType>}
     */
    exports.bioticUtps = Vars.content.units().select(utp => MDL_cond._isNonRobot(utp)).toArray();


    /**
     * Naval unit types.
     * @type {Array<UnitType>}
     */
    exports.navalUtps = Vars.content.units().select(utp => utp.naval).toArray();


    /**
     * Missile unit types.
     * @type {Array<UnitType>}
     */
    exports.missileUtps = Vars.content.units().select(utp => utp instanceof MissileUnitType).toArray();


    /* <------------------------------ status effect ------------------------------ */


    /**
     * Fading status effect.
     * @type {Array<StatusEffect>}
     */
    exports.fadeStas = Vars.content.statusEffects().select(sta => MDL_cond._isFadeStatus(sta)).toArray();


    /**
     * On-death status effect.
     * @type {Array<StatusEffect>}
     */
    exports.deathStas = Vars.content.statusEffects().select(sta => MDL_cond._isDeathStatus(sta)).toArray();


    /**
     * Stackable status effect.
     * @type {Array<StatusEffect>}
     */
    exports.stackStas = Vars.content.statusEffects().select(sta => MDL_cond._isStackStatus(sta)).toArray();


    /* <------------------------------ planet ------------------------------ */


    /**
     * Planets added by LovecLab.
     * @type {Array<Planet>}
     */
    exports.lovecPlas = Vars.content.planets().select(pla => pla.accessible && (pla.minfo.mod == null ? "" : pla.minfo.mod.name) === "loveclab").toArray();


    /* <------------------------------ weather ------------------------------ */


    /**
     * Permanent weather entries for all weathers.
     * @type {Array<Weather.WeatherEntry>}
     */
    exports.weaEns = (function() {
      let obj = {};
      Vars.content.weathers().each(wea => {
        let weaEn = new Weather.WeatherEntry(wea);
        weaEn.always = true;
        obj[wea.name] = weaEn;
      });
      return obj;
    })();


  }, 79532268);


  /* <---------- misc ----------> */


  MDL_event._c_onLoad(() => {


    exports.auxPres = Vars.content.liquid("loveclab-aux0aux-pressure");
    exports.auxVac = Vars.content.liquid("loveclab-aux0aux-vacuum");
    exports.auxHeat = Vars.content.liquid("loveclab-aux0aux-heat");
    exports.auxTor = Vars.content.liquid("loveclab-aux0aux-torque");
    exports.auxRpm = Vars.content.liquid("loveclab-aux0aux-rpm");


    exports.staNoConstruction = Vars.content.statusEffect("loveclab-sta-no-construction");
    exports.staHiddenWell = Vars.content.statusEffect("loveclab-sta-hidden-well");
    exports.staStunned = Vars.content.statusEffect("loveclab-sta-stunned");
    exports.staSlightlyInjured = Vars.content.statusEffect("loveclab-sta-slightly-injured");
    exports.staInjured = Vars.content.statusEffect("loveclab-sta-injured");
    exports.staHeavilyInjured = Vars.content.statusEffect("loveclab-sta-heavily-injured");
    exports.staDamaged = Vars.content.statusEffect("loveclab-sta-damaged");
    exports.staSeverelyDamaged = Vars.content.statusEffect("loveclab-sta-severely-damaged");
    exports.staOverheated = Vars.content.statusEffect("loveclab-sta0bur-overheated");


  }, 54888119);
