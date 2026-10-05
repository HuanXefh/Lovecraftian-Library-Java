/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Unit, INTF_ENTITY_tetheredEntity>} INTFENTITYTetheredEntity
     */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFENTITYTetheredEntity} unit
     * @return {void}
     */
    function comp_update(unit) {
        if(!unit.type.delegee.isTetheredUnit) return;

        if(isNaN(unit.delegee.noTetherDespawnTime)) {
            unit.delegee.noTetherDespawnTime = 0.0;
        };
        if(unit.type.delegee.noTetherDespawnTime >= 0.0 && (unit.delegee.bLink == null || !unit.delegee.bLink.isValid() || unit.delegee.bLink.team !== unit.team)) {
            unit.delegee.noTetherDespawnTimeCur += Time.delta;
        } else {
            unit.delegee.noTetherDespawnTimeCur = Mathf.maxZero(unit.delegee.noTetherDespawnTimeCur - Time.delta);
        };
        if(unit.delegee.noTetherDespawnTimeCur >= unit.type.delegee.noTetherDespawnTime) {
            Call.unitDespawn(unit);
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * A unit linked to some building.
     * @class INTF_ENTITY_tetheredEntity
     */
    module.exports = new CLS_interface("INTF_ENTITY_tetheredEntity", {


        __paramObjM__: function() {
            return {


                /* <------------------------------ internal ------------------------------> */


                /**
                 * `INTERNAL`: Tethered building.
                 * @memberof INTF_ENTITY_tetheredEntity
                 * @instance
                 * @type {Building|null}
                 */
                bLink: null,
                /**
                 * `INTERNAL`
                 * @memberof INTF_ENTITY_tetheredEntity
                 * @instance
                 * @type {number}
                 */
                noTetherDespawnTimeCur: 0.0,


            };
        },


        update: function() {
            comp_update(this);
        },


        /**
         * Sets tethered building of this unit.
         * @memberof INTF_ENTITY_tetheredEntity
         * @instance
         * @func
         * @param {Building|null} ob
         * @return {void}
         */
        ex_setBLink: function(ob) {
            if(ob == null || (ob.isValid() && ob.team === unit.team)) {
                this.delegee.bLink = ob;
            };
        }
        .setProp({
            noSuper: true,
            argLen: 1,
        }),


        /**
         * @memberof INTF_ENTITY_tetheredEntity
         * @instance
         * @func
         * @param {Object} dataObj
         * @return {void}
         */
        ex_writeUnitData: function(dataObj) {
            dataObj.bLinkPos = this.delegee.bLink == null ? -1 : this.delegee.bLink.pos();
        }
        .setProp({
            noSuper: true,
            argLen: 1,
        }),


        /**
         * @memberof INTF_ENTITY_tetheredEntity
         * @instance
         * @func
         * @param {Object} dataObj
         * @return {void}
         */
        ex_readUnitData: function(dataObj) {
            let posInt = Number(dataObj.bLinkPos);
            this.delegee.bLink = GLB_var.world.build(isNaN(posInt) ? -1 : posInt);
        }
        .setProp({
            noSuper: true,
            argLen: 1,
        }),


    });
