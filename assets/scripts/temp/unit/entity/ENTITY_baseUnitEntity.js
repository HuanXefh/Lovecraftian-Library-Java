/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Unit, ENTITY_baseUnitEntity>} ENTITYBaseUnitEntity
     */


    const PARENT = CLS_contentTemplate;
    const INTF_ENTITY_unitDurabilityHandler = require("lovec/temp/intf/INTF_ENTITY_unitDurabilityHandler");
    const INTF_ENTITY_tetheredEntity = require("lovec/temp/intf/INTF_ENTITY_tetheredEntity");


    /* <------------------------------ auxiliary ------------------------------> */


    /**
     * @private
     * @type {ObjectMap<Unit, EntityCollisions.SolidPred>}
     */
    const solidPredCache = new ObjectMap();


    /**
     * @private
     * @param {ENTITYBaseUnitEntity} unit
     * @return {EntityCollisions.SolidPred}
     */
    const getBaseSolidPred = function(unit) {
        return extend(EntityCollisions.SolidPred, {
            solid(tx, ty) {
                return (unit.super$solidity() != null && unit.super$solidity().solid(tx, ty))
                    // Terrain wall is solid to air units in a cave map
                    || (PARAM.IS_CAVE_MAP && EntityCollisions.legsSolid(tx, ty));
            },
        });
    }
    .setCache(solidPredCache)
    .setAnno("init", function() {
        TRIGGER.mapChange.addGlobalListener(() => {
            solidPredCache.clear();
        });
    });


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {ENTITYBaseUnitEntity} unit
     * @return {number}
     */
    function comp_collisionLayer(unit) {
        return unit.type.allowLegStep && unit.type.legPhysicsLayer ?
            PhysicsProcess.layerLegs :
            !unit.isFlying() ?
                PhysicsProcess.layerGround :
                PhysicsProcess.layerFlying;
    };


    /**
     * @private
     * @param {ENTITYBaseUnitEntity} unit
     * @return {EntityCollisions.SolidPred}
     */
    function comp_solidity(unit) {
        return getBaseSolidPred(unit);
    };


    /**
     * @private
     * @param {ENTITYBaseUnitEntity} unit
     * @param {Item} item
     * @return {boolean}
     */
    function comp_acceptsItem(unit, item) {
        return !unit.type.delegee.itemBlacklist.includes(item.name);
    };


    /**
     * @private
     * @param {ENTITYBaseUnitEntity} unit
     * @param {Tile} t
     * @param {boolean} checkDst
     * @return {boolean}
     */
    function comp_validMine(unit, t, checkDst) {
        return t != null
            // Depth ore should not be mineable
            && !checkTempTag(t.overlay(), "env-dpore")
            // Fixes a bug in tall block mining
            && (!unit.isPlayer() || !(t.overlay().itemDrop != null ? t.overlay() : (t.block() !== Blocks.air ? t.block() : t.floor())).playerUnmineable)
            && unit.super$validMine(t, tryVal(checkDst, true));
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Base template for all unit entities.
     * Unlike blocks, the entity of a unit type is defined as a separate template for more flexibility.
     * @class ENTITY_baseUnitEntity
     * @extends CLS_contentTemplate
     * @extends INTF_ENTITY_unitDurabilityHandler
     * @extends INTF_ENTITY_tetheredEntity
     */
    module.exports = newClass()
    .extendClass(PARENT, "ENTITY_baseUnitEntity")
    .implement(INTF_ENTITY_unitDurabilityHandler)
    .implement(INTF_ENTITY_tetheredEntity)
    .initTemplate()
    .setParent(null)
    .setParam({})
    .setMethod({


        collisionLayer: function() {
            return comp_collisionLayer(this);
        }
        .setProp({
            noSuper: true,
        }),


        isGrounded: function() {
            return this.elevation < VAR.param.groundElev;
        }
        .setProp({
            noSuper: true,
        }),


        isFlying: function() {
            return this.elevation >= VAR.param.airElev;
        }
        .setProp({
            noSuper: true,
        }),


        solidity: function() {
            return comp_solidity(this);
        }
        .setProp({
            noSuper: true,
        }),


        acceptsItem: function(item) {
            return comp_acceptsItem(this, item);
        }
        .setProp({
            boolMode: "and",
        }),


        validMine: function(t, checkDst) {
            return comp_validMine(this, t, checkDst);
        }
        .setProp({
            noSuper: true,
        }),


        /**
         * @memberof ENTITY_baseUnitEntity
         * @instance
         * @func
         * @param {Object} dataObj
         * @return {void}
         */
        ex_writeUnitData: function(dataObj) {

        }
        .setProp({
            noSuper: true,
            argLen: 1,
        }),


        /**
         * @memberof ENTITY_baseUnitEntity
         * @instance
         * @func
         * @param {Object} dataObj
         * @return {void}
         */
        ex_readUnitData: function(dataObj) {

        }
        .setProp({
            noSuper: true,
            argLen: 1,
        }),


    });
