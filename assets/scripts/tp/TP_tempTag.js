/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Registers content template tags.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  batchCall(CLS_contentTemplate, function() {


    /* <------------------------------ resource ------------------------------ */


    // Ore
    this.registerTag("rs-ore");
    // Intermediate
    this.registerTag("rs-intmd");
    // Waste
    this.registerTag("rs-was");
    // Abstract fluid
    this.registerTag("rs-aux");
    // Abstract fluid (no amount cap)
    this.registerTag("rs-aux-nocap");


    /* <------------------------------ block ------------------------------ */


    // Ore scanner
    this.registerTag("blk-scan");
    // Crop
    this.registerTag("blk-crop");
    // Not a container
    this.registerTag("blk-non-cont");
    // Cogwheel
    this.registerTag("blk-cog");
    // Gear box
    this.registerTag("blk-cog-box");
    // Transmission rod
    this.registerTag("blk-tor-rod");
    // Power relay, transmitters without this tag will be treated as nodes
    this.registerTag("blk-pow-relay");
    // Not a factory
    this.registerTag("blk-non-fac");
    // Not a repairer
    this.registerTag("blk-non-mend");
    // Not a defense wall
    this.registerTag("blk-non-wall");


    // Material floor
    this.registerTag("env-mat-flr");
    // Tree
    this.registerTag("env-tree");
    // Tall grass
    this.registerTag("env-grass-tall");
    // Depth ore
    this.registerTag("env-dpore");
    // Depth liquid
    this.registerTag("env-dpliq");


    /* <------------------------------ status effect ------------------------------ */


    // Fading status
    this.registerTag("sta-fade");
    // Death status
    this.registerTag("sta-death");


  });
