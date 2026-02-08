/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Adds some methods to {global} so you can use them in game, if you know how to use console.
   * Can be used to avoid module coupling.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const NOISE = require("lovec/glb/BOX_noise");
  const TRIGGER = require("lovec/glb/BOX_trigger");
  const EFF = require("lovec/glb/GLB_eff");
  const PARAM = require("lovec/glb/GLB_param");
  const SAVE = require("lovec/glb/GLB_save");
  const TIMER = require("lovec/glb/GLB_timer");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const CLS_matrix = require("lovec/cls/math/CLS_matrix");
  const CLS_enumBuilder = require("lovec/cls/struct/CLS_enumBuilder");
  const CLS_objectBox = require("lovec/cls/struct/CLS_objectBox");
  const CLS_window = require("lovec/cls/ui/CLS_window");
  const CLS_achievement = require("lovec/cls/util/CLS_achievement");
  const CLS_settingTerm = require("lovec/cls/util/CLS_settingTerm");


  const MATH_function = require("lovec/math/MATH_function");
  const MATH_geometry = require("lovec/math/MATH_geometry");
  const MATH_interp = require("lovec/math/MATH_interp");
  const MATH_probability = require("lovec/math/MATH_probability");
  const MATH_statistics = require("lovec/math/MATH_statistics");


  const FRAG_attack = require("lovec/frag/FRAG_attack");
  const FRAG_faci = require("lovec/frag/FRAG_faci");
  const FRAG_fluid = require("lovec/frag/FRAG_fluid");
  const FRAG_item = require("lovec/frag/FRAG_item");
  const FRAG_payload = require("lovec/frag/FRAG_payload");
  const FRAG_puddle = require("lovec/frag/FRAG_puddle");
  const FRAG_unit = require("lovec/frag/FRAG_unit");


  const MDL_ai = require("lovec/mdl/MDL_ai");
  const MDL_attr = require("lovec/mdl/MDL_attr");
  const MDL_backend = require("lovec/mdl/MDL_backend");
  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_call = require("lovec/mdl/MDL_call");
  const MDL_color = require("lovec/mdl/MDL_color");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_entity = require("lovec/mdl/MDL_entity");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_file = require("lovec/mdl/MDL_file");
  const MDL_flag = require("lovec/mdl/MDL_flag");
  const MDL_flow = require("lovec/mdl/MDL_flow");
  const MDL_fuel = require("lovec/mdl/MDL_fuel");
  const MDL_io = require("lovec/mdl/MDL_io");
  const MDL_json = require("lovec/mdl/MDL_json");
  const MDL_market = require("lovec/mdl/MDL_market");
  const MDL_net = require("lovec/mdl/MDL_net");
  const MDL_pollution = require("lovec/mdl/MDL_pollution");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_reaction = require("lovec/mdl/MDL_reaction");
  const MDL_recipe = require("lovec/mdl/MDL_recipe");
  const MDL_recipeDict = require("lovec/mdl/MDL_recipeDict");
  const MDL_table = require("lovec/mdl/MDL_table");
  const MDL_terrain = require("lovec/mdl/MDL_terrain");
  const MDL_text = require("lovec/mdl/MDL_text");
  const MDL_texture = require("lovec/mdl/MDL_texture");
  const MDL_ui = require("lovec/mdl/MDL_ui");
  const MDL_util = require("lovec/mdl/MDL_util");


  const TP_attr = require("lovec/tp/TP_attr");
  const TP_effect = require("lovec/tp/TP_effect");
  const TP_recipeGen = require("lovec/tp/TP_recipeGen");


  const DB_block = require("lovec/db/DB_block");
  const DB_env = require("lovec/db/DB_env");
  const DB_fluid = require("lovec/db/DB_fluid");
  const DB_item = require("lovec/db/DB_item");
  const DB_misc = require("lovec/db/DB_misc");
  const DB_reaction = require("lovec/db/DB_reaction");
  const DB_status = require("lovec/db/DB_status");
  const DB_unit = require("lovec/db/DB_unit");


  const MOD_tmi = require("lovec/mod/MOD_tmi");


/*
  ========================================
  Section: Application
  ========================================
*/




  MDL_event._c_onLoad(() => {


    global.lovec = {


      noise: NOISE,
      trigger: TRIGGER,
      eff: EFF,
      param: PARAM,
      save: SAVE,
      timer: TIMER,
      var: VAR,
      varGen: VARGEN,


      cls_matrix: CLS_matrix,
      cls_enumBuilder: CLS_enumBuilder,
      cls_objectBox: CLS_objectBox,
      cls_window: CLS_window,
      cls_achievement: CLS_achievement,
      cls_settingTerm: CLS_settingTerm,


      math_function: MATH_function,
      math_geometry: MATH_geometry,
      math_interp: MATH_interp,
      math_probability: MATH_probability,
      math_statistics: MATH_statistics,


      frag_attack: FRAG_attack,
      frag_faci: FRAG_faci,
      frag_fluid: FRAG_fluid,
      frag_item: FRAG_item,
      frag_payload: FRAG_payload,
      frag_puddle: FRAG_puddle,
      frag_unit: FRAG_unit,


      mdl_ai: MDL_ai,
      mdl_attr: MDL_attr,
      mdl_backend: MDL_backend,
      mdl_bundle: MDL_bundle,
      mdl_call: MDL_call,
      mdl_color: MDL_color,
      mdl_cond: MDL_cond,
      mdl_content: MDL_content,
      mdl_draw: MDL_draw,
      mdl_effect: MDL_effect,
      mdl_entity: MDL_entity,
      mdl_event: MDL_event,
      mdl_file: MDL_file,
      mdl_flag: MDL_flag,
      mdl_flow: MDL_flow,
      mdl_fuel: MDL_fuel,
      mdl_io: MDL_io,
      mdl_json: MDL_json,
      mdl_market: MDL_market,
      mdl_net: MDL_net,
      mdl_pollution: MDL_pollution,
      mdl_pos: MDL_pos,
      mdl_reaction: MDL_reaction,
      mdl_recipe: MDL_recipe,
      mdl_recipeDict: MDL_recipeDict,
      mdl_table: MDL_table,
      mdl_terrain: MDL_terrain,
      mdl_text: MDL_text,
      mdl_texture: MDL_texture,
      mdl_ui: MDL_ui,
      mdl_util: MDL_util,


      tp_attr: TP_attr,
      tp_effect: TP_effect,
      tp_recipeGen: TP_recipeGen,


      db_block: DB_block,
      db_env: DB_env,
      db_fluid: DB_fluid,
      db_item: DB_item,
      db_misc: DB_misc,
      db_reaction: DB_reaction,
      db_status: DB_status,
      db_unit: DB_unit,


      mod_tmi: MOD_tmi,


    };


    global.lovec.debug = {


      printLiq(tx, ty) {
        LOG_HANDLER.log("liquidInfo", tx, ty);
      },


      printCep(team) {
        LOG_HANDLER.log("cepInfo", team);
      },


    };


    Time.run(1.0, () => {
      MDL_event._c_onDraw(() => {
        if(DRAW_TEST.enabled) DRAW_TEST.draw();
      });
    });


  }, 75112593);
