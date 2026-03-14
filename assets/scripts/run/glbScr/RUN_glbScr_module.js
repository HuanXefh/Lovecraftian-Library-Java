/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Used to load modules globally, so that you don't need to {@link require}.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  require("lovec/tp/TP_error");
  require("lovec/tp/TP_log");
  require("lovec/tp/TP_db");
  require("lovec/run/RUN_methodExt");
  /** @global */
  CLS_annotation = require("lovec/cls/struct/CLS_annotation");
  /** @global */
  CLS_interface = require("lovec/cls/struct/CLS_interface");
  require("lovec/run/RUN_methodPostExt");
  /** @global */
  MDL_event = require("lovec/mdl/MDL_event");
  require("lovec/tp/TP_anno");
  require("lovec/run/RUN_global");
  require("lovec/tp/TP_shader");
  require("lovec/tp/TP_cacheLayer");
  /** @global */
  CLS_paramBuilder = require("lovec/cls/util/builder/CLS_paramBuilder");
  /** @global */
  CLS_objectBox = require("lovec/cls/struct/CLS_objectBox");
  /** @global */
  CLS_damageTextMode = require("lovec/cls/util/CLS_damageTextMode");
  /** @global */
  CLS_contentTemplate = require("lovec/cls/util/CLS_contentTemplate");
  /** @global */
  VAR = require("lovec/glb/GLB_var");
  /** @global */
  TP_attr = require("lovec/tp/TP_attr");
  /** @global */
  MATH_geometry = require("lovec/math/MATH_geometry");
  /** @global */
  MATH_interp = require("lovec/math/MATH_interp");
  /** @global */
  MATH_probability = require("lovec/math/MATH_probability");
  /** @global */
  MATH_statistics = require("lovec/math/MATH_statistics");
  /** @global */
  CLS_whiteNoise = require("lovec/cls/math/noise/CLS_whiteNoise");
  /** @global */
  CLS_valueNoise = require("lovec/cls/math/noise/CLS_valueNoise");
  /** @global */
  CLS_perlinNoise = require("lovec/cls/math/noise/CLS_perlinNoise");
  /** @global */
  LIB_pinyin = require("lovec/lib/LIB_pinyin");
  /** @global */
  MDL_bundle = require("lovec/mdl/MDL_bundle");
  /** @global */
  MDL_text = require("lovec/mdl/MDL_text");
  /** @global */
  CLS_eventTrigger = require("lovec/cls/util/CLS_eventTrigger");
  /** @global */
  TRIGGER = require("lovec/glb/BOX_trigger");
  /** @global */
  MDL_backend = require("lovec/mdl/MDL_backend");
  /** @global */
  TIMER = require("lovec/glb/GLB_timer");
  /** @global */
  MDL_file = require("lovec/mdl/MDL_file");
  /** @global */
  MDL_json = require("lovec/mdl/MDL_json");
  /** @global */
  MDL_net = require("lovec/mdl/MDL_net");
  /** @global */
  DB_block = require("lovec/db/DB_block");
  /** @global */
  DB_item = require("lovec/db/DB_item");
  /** @global */
  DB_fluid = require("lovec/db/DB_fluid");
  /** @global */
  DB_status = require("lovec/db/DB_status");
  /** @global */
  DB_unit = require("lovec/db/DB_unit");
  /** @global */
  MDL_color = require("lovec/mdl/MDL_color");
  /** @global */
  MDL_texture = require("lovec/mdl/MDL_texture");
  /** @global */
  TP_effect = require("lovec/tp/TP_effect");
  /** @global */
  EFF = require("lovec/glb/GLB_eff");
  /** @global */
  DB_env = require("lovec/db/DB_env");
  /** @global */
  MDL_content = require("lovec/mdl/MDL_content");
  /** @global */
  MDL_cond = require("lovec/mdl/MDL_cond");
  /** @global */
  MDL_io = require("lovec/mdl/MDL_io");
  /** @global */
  MDL_pos = require("lovec/mdl/MDL_pos");
  /** @global */
  MDL_terrain = require("lovec/mdl/MDL_terrain");
  /** @global */
  FRAG_puddle = require("lovec/frag/FRAG_puddle");
  /** @global */
  DB_misc = require("lovec/db/DB_misc");
  /** @global */
  MDL_util = require("lovec/mdl/MDL_util");
  /** @global */
  MDL_recipeDict = require("lovec/mdl/MDL_recipeDict");
  /** @global */
  PARAM = require("lovec/glb/GLB_param");
  /** @global */
  CLS_settingTerm = require("lovec/cls/util/CLS_settingTerm");
  /** @global */
  MDL_attr = require("lovec/mdl/MDL_attr");
  /** @global */
  FRAG_faci = require("lovec/frag/FRAG_faci");
  /** @global */
  SAVE = require("lovec/glb/GLB_save");
  /** @global */
  MDL_flag = require("lovec/mdl/MDL_flag");
  /** @global */
  MDL_market = require("lovec/mdl/MDL_market");
  /** @global */
  VARGEN = require("lovec/glb/GLB_varGen");
  /** @global */
  MDL_pollution = require("lovec/mdl/MDL_pollution");
  /** @global */
  MDL_fuel = require("lovec/mdl/MDL_fuel");
  /** @global */
  MDL_flow = require("lovec/mdl/MDL_flow");
  /** @global */
  MDL_entity = require("lovec/mdl/MDL_entity");
  /** @global */
  MDL_draw = require("lovec/mdl/MDL_draw");
  /** @global */
  MDL_effect = require("lovec/mdl/MDL_effect");
  /** @global */
  DB_reaction = require("lovec/db/DB_reaction");
  /** @global */
  MDL_reaction = require("lovec/mdl/MDL_reaction");
  /** @global */
  MDL_call = require("lovec/mdl/MDL_call");
  /** @global */
  FRAG_attack = require("lovec/frag/FRAG_attack");
  /** @global */
  FRAG_item = require("lovec/frag/FRAG_item");
  /** @global */
  FRAG_fluid = require("lovec/frag/FRAG_fluid");
  /** @global */
  FRAG_payload = require("lovec/frag/FRAG_payload");
  /** @global */
  FRAG_unit = require("lovec/frag/FRAG_unit");
  /** @global */
  MDL_ai = require("lovec/mdl/MDL_ai");
  /** @global */
  FRAG_recipe = require("lovec/frag/FRAG_recipe");
  /** @global */
  MDL_recipe = require("lovec/mdl/MDL_recipe");
  /** @global */
  CLS_recipeBuilder = require("lovec/cls/util/builder/CLS_recipeBuilder");
  /** @global */
  CLS_recipeGenerator = require("lovec/cls/util/CLS_recipeGenerator");
  /** @global */
  TP_recipeGen = require("lovec/tp/TP_recipeGen");
  /** @global */
  MDL_ui = require("lovec/mdl/MDL_ui");
  /** @global */
  MDL_table = require("lovec/mdl/MDL_table");
  /** @global */
  CLS_dialogFlowBuilder = require("lovec/cls/util/builder/CLS_dialogFlowBuilder");
  /** @global */
  CLS_achievement = require("lovec/cls/util/CLS_achievement");
  /** @global */
  CLS_window = require("lovec/cls/ui/CLS_window");
  /** @global */
  MOD_tmi = require("lovec/mod/MOD_tmi");
  /** @global */
  MOD_multiBlockLib = require("lovec/mod/MOD_multiBlockLib");
  /** @global */
  CLS_dragButton = require("lovec/cls/ui/CLS_dragButton");
  require("lovec/tp/TP_ability");
  require("lovec/tp/TP_ai");
  require("lovec/tp/TP_cons");
  /** @global */
  TP_dial = require("lovec/tp/TP_dial");
  require("lovec/tp/TP_dialFlow");
  require("lovec/tp/TP_drawer");
  require("lovec/tp/TP_keyBind");
  require("lovec/tp/TP_setting");
  require("lovec/tp/TP_sortF");
  require("lovec/tp/TP_stat");
  require("lovec/run/RUN_input");
  require("lovec/run/RUN_event");
  require("lovec/run/RUN_render");
  require("lovec/run/RUN_rule");
  require("lovec/run/RUN_tmi");
