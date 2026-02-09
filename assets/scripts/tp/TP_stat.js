/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Registers stats, stat units and stat categories.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- stat category ----------> */


  newStatCategory("lovec", "pressure");
  newStatCategory("lovec", "heat");


  /* <---------- stat ----------> */


  newStat("lovec", "blk-minr");
  newStat("lovec", "blk-cd");
  newStat("lovec", "blk-cdinit");
  newStat("lovec", "blk-canexplode");
  newStat("lovec", "blk-explor");
  newStat("lovec", "blk-explodmg");
  newStat("lovec", "blk-exploliq");
  newStat("lovec", "blk-impactr");
  newStat("lovec", "blk-shortcircuit");
  newStat("lovec", "blk-attrreq");
  newStat("lovec", "blk-attroutput");
  newStat("lovec", "blk-terreq");
  newStat("lovec", "blk-terban");
  newStat("lovec", "blk-pol");
  newStat("lovec", "blk-polred");
  newStat("lovec", "blk-poltol");


  newStat("lovec", "blk0env-ventsize", StatCat.general);
  newStat("lovec", "blk0env-treetype", StatCat.general);
  newStat("lovec", "blk0env-rslvl", StatCat.general);
  newStat("lovec", "blk0env-depthlvl", StatCat.general);


  newStat("lovec", "blk0min-basedrillspd", StatCat.crafting);
  newStat("lovec", "blk0min-boosteddrillspd", StatCat.crafting);
  newStat("lovec", "blk0min-drilltier", StatCat.crafting);
  newStat("lovec", "blk0min-depthmtp", StatCat.crafting);
  newStat("lovec", "blk0min-blockeditms", StatCat.crafting);
  newStat("lovec", "blk0min-alloweditms", StatCat.crafting);
  newStat("lovec", "blk0min-scantier", StatCat.crafting);


  newStat("lovec", "blk0fac-payroom", StatCat.crafting);
  newStat("lovec", "blk0fac-prodspd", StatCat.crafting);
  newStat("lovec", "blk0fac-durabtime", StatCat.crafting);
  newStat("lovec", "blk0fac-recipes", StatCat.crafting);


  newStat("lovec", "blk0itm-unloadable", StatCat.items);
  newStat("lovec", "blk0itm-exposed", StatCat.items);


  newStat("lovec", "blk0liq-presoutput", fetchStatCategory("lovec", "pressure"));
  newStat("lovec", "blk0liq-vacoutput", fetchStatCategory("lovec", "pressure"));
  newStat("lovec", "blk0liq-presreq", fetchStatCategory("lovec", "pressure"));
  newStat("lovec", "blk0liq-vacreq", fetchStatCategory("lovec", "pressure"));
  newStat("lovec", "blk0liq-presres", fetchStatCategory("lovec", "pressure"));
  newStat("lovec", "blk0liq-vacres", fetchStatCategory("lovec", "pressure"));


  newStat("lovec", "blk0liq-matgrp");
  newStat("lovec", "blk0liq-cloggable");


  newStat("lovec", "blk0fac-extheatmtp", fetchStatCategory("lovec", "heat"));
  newStat("lovec", "blk0fac-fuel", fetchStatCategory("lovec", "heat"));
  newStat("lovec", "blk0fac-fuelconsmtp", fetchStatCategory("lovec", "heat"));
  newStat("lovec", "blk0fac-fuellvlmtp", fetchStatCategory("lovec", "heat"));
  newStat("lovec", "blk0heat-tempreq", fetchStatCategory("lovec", "heat"));
  newStat("lovec", "blk0heat-heatres", fetchStatCategory("lovec", "heat"));


  newStat("lovec", "blk0pow-powmtp", StatCat.power);
  newStat("lovec", "blk0pow-powloss", StatCat.power);
  newStat("lovec", "blk0pow-powuseper100hu", StatCat.power);


  newStat("lovec", "blk0misc-maxdur");
  newStat("lovec", "blk0misc-reloadtime");
  newStat("lovec", "blk0misc-cepprov");
  newStat("lovec", "blk0misc-cepuse");
  newStat("lovec", "blk0misc-repairamt");
  newStat("lovec", "blk0misc-unitrepairamt");
  newStat("lovec", "blk0misc-repairr");
  newStat("lovec", "blk0misc-repairintv");
  newStat("lovec", "blk0misc-status");
  newStat("lovec", "blk0misc-blktg");


  newStat("lovec", "rs-isore");
  newStat("lovec", "rs-sinttemp");
  newStat("lovec", "rs-isintermediate");
  newStat("lovec", "rs-iswaste");


  newStat("lovec", "rs0int-parent");


  newStat("lovec", "rs0fuel-point");
  newStat("lovec", "rs0fuel-level");


  newStat("lovec", "rs-buildable");
  newStat("lovec", "rs-hardness");


  newStat("lovec", "rs-fluidstatus");
  newStat("lovec", "rs-conductiveliq");
  newStat("lovec", "rs-dens");
  newStat("lovec", "rs-fheat");
  newStat("lovec", "rs-elegrp");
  newStat("lovec", "rs-ftags");
  newStat("lovec", "rs-corpow");


  newStat("lovec", "rs-blockrelated");


  newStat("lovec", "utp-notrobot");


  newStat("lovec", "sta-robotonly");
  newStat("lovec", "sta-bursttime");
  newStat("lovec", "sta-burstdmg");


  newStat("lovec", "spec-faction");
  newStat("lovec", "spec-facfami");
  newStat("lovec", "spec-oredict");
  newStat("lovec", "spec-fromto");
  newStat("lovec", "spec-info");
  newStat("lovec", "spec-dialflow");


  /* <---------- stat unit ----------> */


  newStatUnit("lovec", "perblock", true);
  newStatUnit("lovec", "polunits");


  newStatUnit("lovec", "heatunits");
