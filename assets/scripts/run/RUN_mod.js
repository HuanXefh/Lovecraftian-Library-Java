/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Runs some scripts if matching mods are found.
   */


/*
  ========================================
  Section: Application
  ========================================
*/


  if(fetchMod("社会主义工业化") != null) require("lovec/run/mod/RUN_mod_gi");
  if(fetchMod("tmi") != null) require("lovec/run/mod/RUN_mod_tmi");
