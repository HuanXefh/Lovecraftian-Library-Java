/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Most generated parameters, some are only populated after CLIENT LOAD.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_texture = require("lovec/mdl/MDL_texture");


  const DB_block = require("lovec/db/DB_block");
  const DB_env = require("lovec/db/DB_env");
  const DB_fluid = require("lovec/db/DB_fluid");
  const DB_item = require("lovec/db/DB_item");
  const DB_misc = require("lovec/db/DB_misc");


  /* <---------- key binding ----------> */


  const bindings = {};
  exports.bindings = bindings;


  const addKeyBind = function(nm, keyCodeDef, categ) {
    if(bindings[nm] !== undefined) {
      Log.warn("[LOVEC] Key binding [$1] has already been registered!".format(nm.color(Pal.accent)));
      return false;
    };
    bindings[nm] = KeyBind.add(nm, keyCodeDef, categ);

    return true;
  };
  exports.addKeyBind = addKeyBind;


  /* <---------- dialog flow ----------> */


  const dialFlowNmCtMap = new ObjectMap();
  exports.dialFlowNmCtMap = dialFlowNmCtMap;


  /* <---------- achievement ----------> */


  const achievements = [];
  exports.achievements = achievements;


  /* <---------- sprite ----------> */


  MDL_event._c_onLoad(() => {


    exports.iconRegs = (function() {
      const obj = {};
      DB_misc.db["texture"]["icon"].forEachRow(2, (nm, nmReg) => {
        obj[nm] = Core.atlas.find(nmReg);
      });
      return obj;
    })();


    exports.icons = (function() {
      const obj = {};
      Object._it(module.exports.iconRegs, (nm, reg) => {
        obj[nm] = new TextureRegionDrawable(reg);
      });
      return obj;
    })();


    exports.blockHeatRegs = [
      Core.atlas.find("error"),
      MDL_texture._regHeat(1),
      MDL_texture._regHeat(2),
      MDL_texture._regHeat(3),
      MDL_texture._regHeat(4),
      MDL_texture._regHeat(5),
      MDL_texture._regHeat(6),
      MDL_texture._regHeat(7),
      MDL_texture._regHeat(8),
      MDL_texture._regHeat(9),
      MDL_texture._regHeat(10),
      MDL_texture._regHeat(11),
      MDL_texture._regHeat(12),
      MDL_texture._regHeat(13),
      MDL_texture._regHeat(14),
      MDL_texture._regHeat(15),
    ];


    exports.wireRegs = (function() {
      const obj = {};
      obj.regMap = new ObjectMap();
      obj.endRegMap = new ObjectMap();
      DB_block.db["grpParam"]["wireMatReg"].forEachRow(2, (wireMat, nmReg) => {
        obj.regMap.put(wireMat, Core.atlas.find(nmReg));
        obj.endRegMap.put(wireMat, Core.atlas.find(nmReg + "-end"));
      });
      obj.glowReg = Core.atlas.find("lovec-ast-wire-glow");
      obj.shaReg = Core.atlas.find("lovec-ast-wire-shadow");
      return obj;
    })();


    exports.miscRegs = {
      arrow: Core.atlas.find("bridge-arrow"),
      laserLine: Core.atlas.find("laser"),
      laserEnd: Core.atlas.find("laser-end"),
    };


    exports.noiseTexs = (function() {
      const obj = {};
      let load = path => {
        Core.assets.load(path, Texture);
        return Core.assets.get(path, Texture);
      };
      DB_misc.db["texture"]["noise"].forEachRow(2, (nm, path) => {
        try {
          obj[nm] = load(path);
          obj[nm].setFilter(Texture.TextureFilter.linear);
          obj[nm].setWrap(Texture.TextureWrap.repeat);
        } catch(err) {
          Log.warn("[LOVEC] Cannot load noise texture for: " + path);
        };
      });
      return obj;
    })();


  }, 25777741);


  /* <---------- list ----------> */


  MDL_event._c_onLoad(() => {


    /* team */


    exports.mainTeams = [
      Team.sharded,
      Team.crux,
      Team.malis,
      Team.green,
      Team.blue,
      Team.neoplastic,
    ].pushAll(DB_env.db["extraMainTeam"]);


    /* planet */


    exports.lovecPlas = Vars.content.planets().select(pla => pla.accessible && (pla.minfo.mod == null ? "" : pla.minfo.mod.name) === "loveclab").toArray();


    /* weather */


    exports.weaEns = (function() {
      const obj = {};
      Vars.content.weathers().each(wea => {
        let weaEn = new Weather.WeatherEntry(wea);
        weaEn.always = true;
        obj[wea.name] = weaEn;
      });
      return obj;
    })();


    /* resource */


    exports.rss = Vars.content.items().toArray().concat(Vars.content.liquids().toArray()).inSituFilter(rs => !rs.hidden);
    exports.sandItms = (function() {
      const arr = [];
      DB_item.db["group"]["sand"].forEachFast(nm => {
        let itm = MDL_content._ct(nm, "rs");
        if(itm != null) arr.push(itm);
      });
      return arr;
    })();
    exports.hotFlds = (function() {
      const arr = [];
      Vars.content.liquids().each(
        liq => DB_HANDLER.read("liq-fheat", liq, 0.0) >= 50.0,
        liq => arr.push(liq),
      );
      return arr;
    })();
    exports.fuelItms = (function() {
      const arr = [];
      DB_item.db["param"]["fuel"]["item"].forEachRow(2, (nm, params) => {
        let itm = MDL_content._ct(nm, "rs");
        if(itm != null) arr.push(itm);
      });
      return arr;
    })();
    exports.fuelLiqs = (function() {
      const arr = [];
      DB_item.db["param"]["fuel"]["fluid"].forEachRow(2, (nm, params) => {
        let liq = MDL_content._ct(nm, "rs");
        if(liq != null && !liq.gas) arr.push(liq);
      });
      return arr;
    })();
    exports.fuelGases = (function() {
      const arr = [];
      DB_item.db["param"]["fuel"]["fluid"].forEachRow(2, (nm, params) => {
        let liq = MDL_content._ct(nm, "rs");
        if(liq != null && liq.gas) arr.push(liq);
      });
      return arr;
    })();
    exports.intmds = (function() {
      const obj = {};
      DB_item.db["intmd"]["tag"].forEachFast(tag => obj[tag] = []);
      Vars.content.items().each(itm => tryFun(itm.ex_getIntmdTags, itm, Array.air).forEachFast(tag => obj[tag].push(itm)));
      Vars.content.liquids().each(liq => tryFun(liq.ex_getIntmdTags, liq, Array.air).forEachFast(tag => obj[tag].push(liq)));
      return obj;
    })();
    exports.wasItms = Vars.content.items().select(itm => MDL_cond._isWaste(itm)).toArray();
    exports.wasFlds = Vars.content.liquids().select(liq => MDL_cond._isWaste(liq)).toArray();
    exports.exploItms = Vars.content.items().select(itm => itm.explosiveness >= 0.3 && itm.flammability >= 0.3).toArray();
    exports.exploFlds = Vars.content.liquids().select(liq => (liq.explosiveness >= 0.3 || liq.flammability >= 0.3) && !MDL_cond._isAuxiliaryFluid(liq)).toArray();
    exports.auxs = Vars.content.liquids().select(liq => MDL_cond._isAuxiliaryFluid(liq)).toArray();


    /* block */


    exports.nonEnvBlks = Vars.content.blocks().select(blk => blk.synthetic()).toArray();
    Time.run(1.0, () => {
      exports.payMatBlks = module.exports.nonEnvBlks.filter(blk => global.lovec.mdl_recipeDict.rcDict.cons.block[blk.id].length > 0 || global.lovec.mdl_recipeDict.rcDict.prod.block[blk.id].length > 0);
    });


    /* unit type */


    exports.buildaleUtps = Vars.content.units().select(utp => !utp.internal && (TechTree.all.find(node => node.content === utp && node.requirements.length > 0) != null || tryVal(utp.getRequirements(null, null), Array.air).length > 0)).toArray();
    exports.vanillaUtps = Vars.content.units().select(utp => MDL_content._mod(utp) === "vanilla").toArray();
    exports.bioticUtps = Vars.content.units().select(utp => MDL_cond._isNonRobot(utp)).toArray();
    exports.navalUtps = Vars.content.units().select(utp => utp.naval).toArray();
    exports.missileUtps = Vars.content.units().select(utp => utp instanceof MissileUnitType).toArray();


    /* status effect */


    exports.fadeStas = Vars.content.statusEffects().select(sta => MDL_cond._isFadeStatus(sta)).toArray();
    exports.deathStas = Vars.content.statusEffects().select(sta => MDL_cond._isDeathStatus(sta)).toArray();
    exports.stackStas = Vars.content.statusEffects().select(sta => MDL_cond._isStackStatus(sta)).toArray();


    /* misc */


    exports.factions = (function() {
      const obj = {};
      DB_block.db["grpParam"]["factionColor"].forEachRow(2, (faction, colorStr) => {
        if(faction === "none") return;
        obj[faction] = MDL_content._factionCts(faction);
      });
      return obj;
    })();
    exports.facFamis = (function() {
      const obj = {};
      MDL_content._facFamisDefined().forEachFast(fami => obj[fami] = MDL_content._facFamiBlks(fami));
      return obj;
    })();
    exports.rcDictCts = [];


  }, 79532268);


  /* <---------- misc ----------> */


  MDL_event._c_onLoad(() => {


    exports.auxPres = Vars.content.liquid("loveclab-aux0aux-pressure");
    exports.auxVac = Vars.content.liquid("loveclab-aux0aux-vacuum");
    exports.auxHeat = Vars.content.liquid("loveclab-aux0aux-heat");
    exports.auxTor = Vars.content.liquid("loveclab-aux0aux-torque");
    exports.auxRpm = Vars.content.liquid("loveclab-aux0aux-rpm");


    exports.staHiddenWell = Vars.content.statusEffect("loveclab-sta-hidden-well");
    exports.staStunned = Vars.content.statusEffect("loveclab-sta-stunned");


  }, 54888119);
