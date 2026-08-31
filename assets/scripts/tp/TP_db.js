/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Registers new database objects to {@link DB_HANDLER}.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  batchCall(DB_HANDLER, function() {


    /** Blocks that have reload bar. */
    this.addContentReader("block-reload");
    /** Block pressure resistence. */
    this.addContentReader("block-pressure-resistance");
    /** Block vacuum resistence. */
    this.addContentReader("block-vacuum-resistance");
    /** Block heat resistence. */
    this.addContentReader("block-heat-resistance");
    /** Block corrosion resistence. */
    this.addContentReader("block-corrosion-resistance");
    /** Block pollution. */
    this.addContentReader("block-pollution");
    /** Block pollution tolerance. */
    this.addContentReader("block-pollution-tolerance");


    /** Mounts on some unit for 1st reload bar. */
    this.addContentReader("unit-reload-0");
    /** Mounts on some unit for 2nd reload bar. */
    this.addContentReader("unit-reload-1");
    /** Mounts on some unit for 3rd reload bar. */
    this.addContentReader("unit-reload-2");
    /** Unit pollution tolerance. */
    this.addContentReader("unit-pollution-tolerance");


    /** Resource short name. */
    this.addContentReader("resource-short-name");
    /** Resource chemical formula. */
    this.addContentReader("resource-chemical-formula");
    /** Resource pollution. */
    this.addContentReader("resource-pollution");
    /** Item hardness. */
    this.addContentReader("item-hardness");
    /** Item sintering temperature. */
    this.addContentReader("item-sintering-temperature");
    /** Payload form of some item (usually an ore). */
    this.addContentReader("item-payload-block");
    /** Fluid density. */
    this.addContentReader("liquid-density");
    /** Fluid boiling point. */
    this.addContentReader("liquid-boiling-point");
    /** Fluid heat. */
    this.addContentReader("liquid-fluid-heat");
    /** Fluid viscosity. */
    this.addContentReader("liquid-viscosity");
    /** Fluid corrosion power. */
    this.addContentReader("liquid-corrosion-power");
    /** Fluid for some solvent name. */
    this.addReader("liquid-solvent", (obj, solvent, def) => {
      return tryVal(findContent(tryVal(obj[solvent], null)), def);
    });


  });
