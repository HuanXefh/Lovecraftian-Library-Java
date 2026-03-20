/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Registers new logs to {@link LOG_HANDLER}.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- base ----------> */


  batchCall(DB_HANDLER, function() {


    /** Blocks that have reload bar. */
    this.addContentReader("blk-reload");
    /** Block pressure resistence. */
    this.addContentReader("blk-pres-res");
    /** Block vacuum resistence. */
    this.addContentReader("blk-vac-res");
    /** Block heat resistence. */
    this.addContentReader("blk-heat-res");
    /** Block corrosion resistence. */
    this.addContentReader("blk-cor-res");
    /** Block pollution. */
    this.addContentReader("blk-pol");
    /** Block pollution tolerance. */
    this.addContentReader("blk-pol-tol");


    /** Mounts on some unit for 1st reload bar. */
    this.addContentReader("utp-reload-ind-0");
    /** Mounts on some unit for 2nd reload bar. */
    this.addContentReader("utp-reload-ind-1");
    /** Mounts on some unit for 3rd reload bar. */
    this.addContentReader("utp-reload-ind-2");
    /** Unit pollution tolerance. */
    this.addContentReader("utp-pol-tol");


    /** Resource short name. */
    this.addContentReader("rs-short-name");
    /** Resource chemical formula. */
    this.addContentReader("rs-formula");
    /** Resource pollution. */
    this.addContentReader("rs-pol");
    /** Item hardness. */
    this.addContentReader("itm-hardness");
    /** Item sintering temperature. */
    this.addContentReader("itm-sint-temp");
    /** Payload form of some item (usually an ore). */
    this.addContentReader("itm-pay-blk");
    /** Fluid density. */
    this.addContentReader("liq-dens");
    /** Fluid boiling point. */
    this.addContentReader("liq-boil-pon");
    /** Fluid heat. */
    this.addContentReader("liq-fheat");
    /** Fluid viscosity. */
    this.addContentReader("liq-visc");
    /** Fluid corrosion power. */
    this.addContentReader("liq-cor-pow");
    /** Fluid for some solvent name. */
    this.addReader("liq-solvent", (obj, solvent, def) => {
      return tryVal(findContent(tryVal(obj[solvent], null)), def);
    });


  });
