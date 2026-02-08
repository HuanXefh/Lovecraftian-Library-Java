/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Registers new logs to {LOG_HANDLER}.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- base ----------> */


  batchCall(DB_HANDLER, function() {


    this.addContentReader("blk-reload");
    this.addContentReader("blk-pres-res");
    this.addContentReader("blk-vac-res");
    this.addContentReader("blk-heat-res");
    this.addContentReader("blk-cor-res");
    this.addContentReader("blk-pol");
    this.addContentReader("blk-pol-tol");


    this.addContentReader("utp-reload-ind-0");
    this.addContentReader("utp-reload-ind-1");
    this.addContentReader("utp-reload-ind-2");
    this.addContentReader("utp-pol-tol");


    this.addContentReader("rs-short-name");
    this.addContentReader("rs-formula");
    this.addContentReader("rs-pol");
    this.addContentReader("itm-hardness");
    this.addContentReader("itm-sint-temp");
    this.addContentReader("liq-dens");
    this.addContentReader("liq-boil-pon");
    this.addContentReader("liq-fheat");
    this.addContentReader("liq-visc");
    this.addContentReader("liq-cor-pow");
    this.addReader("liq-solvent", (obj, solvent, def) => {
      return tryVal(global.lovecUtil.fun._ct(tryVal(obj[solvent], null), "liquid"), def);
    });


  });
