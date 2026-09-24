/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<RegionPart, PART_regionPart>} PARTRegionPart
     */


    const PARENT = require("lovec/temp/part/PART_basePart");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Vanilla region parts.
     * @class PART_regionPart
     * @extends PART_basePart
     */
    module.exports = newClass()
    .extendClass(PARENT, "PART_regionPart")
    .initTemplate()
    .setParent(RegionPart)
    .setTags()
    .setParam({


        /* <------------------------------ vanilla ------------------------------> */


        children: tprov(() => []),
        moves: tprov(() => []),


    })
    .setParamParser([
        "children", function(val) {
            // Defined as array and finally converted to seq
            return tprov(() => val.get().toSeq());
        },
        "moves", function(val) {
            // Defined as array and finally converted to seq
            return tprov(() => val.get().toSeq());
        },
    ])
    .setMethod({});
