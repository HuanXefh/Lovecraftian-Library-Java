/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * Registers new database objects to {@link LCDBFileHandler}.
     */


/*
  ========================================
  Section: Definition
  ========================================
*/


    batchCall(LCDBFileHandler, function() {


        this.addContentReader("block-reload");
        this.addContentReader("block-pressure-resistance");
        this.addContentReader("block-vacuum-resistance");
        this.addContentReader("block-heat-resistance");
        this.addContentReader("block-corrosion-resistance");
        this.addContentReader("block-pollution");
        this.addContentReader("block-pollution-tolerance");


        this.addContentReader("unit-reload-0");
        this.addContentReader("unit-reload-1");
        this.addContentReader("unit-reload-2");
        this.addContentReader("unit-pollution-tolerance");


        this.addContentReader("resource-short-name");
        this.addContentReader("resource-chemical-formula");
        this.addContentReader("resource-pollution");
        this.addContentReader("item-hardness");
        this.addContentReader("item-sintering-temperature");
        this.addContentReader("item-payload-block");
        this.addContentReader("liquid-density");
        this.addContentReader("liquid-boiling-point");
        this.addContentReader("liquid-fluid-heat");
        this.addContentReader("liquid-viscosity");
        this.addContentReader("liquid-corrosion-power");
        this.addReader("liquid-solvent", (obj, solvent, def) => {
            return tryVal(findContent(tryVal(obj[solvent], null)), def);
        });


    });
