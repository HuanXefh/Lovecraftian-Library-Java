/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<RepairBeamWeapon, WEAP_repairBeam>} WEAPRepairBeam
     */


    const PARENT = require("lovec/temp/weap/WEAP_baseWeapon");


    /* <------------------------------ component ------------------------------> */


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    /**
     * Simply vanilla repair beam weapon.
     * <br> Note that repair beam weapon is by default for AI control.
     * @class WEAP_repairBeam
     * @extends WEAP_baseWeapon
     */
    module.exports = newClass()
    .extendClass(PARENT, "WEAP_repairBeam")
    .initTemplate()
    .setParent("RepairBeamWeapon")
    .setTags()
    .setParam({


        /**
         * `PARAM`: Repair radius.
         * @memberof WEAP_repairBeam
         * @instance
         * @type {number}
         * @default 40.0
         */
        repairRad: 40.0,


        /* <------------------------------ vanilla ------------------------------> */


        bullet: null,


    })
    .setParamParser([
        "bullet", function(val) {
            if(!(val instanceof BulletType)) {
                val = extend(BulletType, {
                    range: this.repairRad,
                    maxRange: this.repairRad,
                });
            };
            return val;
        },
    ])
    .setMethod({});
