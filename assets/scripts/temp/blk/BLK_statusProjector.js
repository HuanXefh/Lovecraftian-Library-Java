/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<MendProjector, BLK_statusProjector>} BLKStatusProjector
     */


    /**
     * @typedef {TemplateInstance<MendProjector.MendBuild, B_statusProjector>} BStatusProjector
     * @prop {BLKStatusProjector} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseProjector");
    const INTF_BLK_radiusDisplay = require("lovec/temp/intf/INTF_BLK_radiusDisplay");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKStatusProjector} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.suppressable = false;

        blk.delegee.blkRad = blk.range;
        // noinspection JSValidateTypes
        blk.delegee.staTarget = MDL_content.getCt(blk.delegee.staTarget, ContentGetModes.STA);
    };


    /**
     * @private
     * @param {BLKStatusProjector} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.remove(Stat.repairTime);
        stats.remove(Stat.booster);

        if(blk.delegee.staTarget != null) {
            stats.add(fetchStat("lovec", "blk0misc-status"), StatValues.content([blk.delegee.staTarget].toSeq()));
        };
    };


    /**
     * @private
     * @param {BLKStatusProjector} blk
     * @param {number} tx
     * @param {number} ty
     * @param {number} rot
     * @param {boolean} valid
     * @return {void}
     */
    function comp_drawPlace(blk, tx, ty, rot, valid) {
        LCDrawf.baseBlockDrawPlace(blk, tx, ty, rot, valid);
        LCDrawf.diskExpand(tx.toFCoord(blk.size), ty.toFCoord(blk.size), blk.range, 1.5, blk.baseColor, 0.3);
    };


    /**
     * @private
     * @param {BStatusProjector} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(b.block.delegee.staTarget == null) return;

        b.heat = Mathf.lerpDelta(b.heat, b.efficiency > 0.0 ? 1.0 : 0.0, 0.01);
        if(b.heat < 0.01) {
            b.heat = 0.0;
        };
        b.charge += b.heat * b.delta();

        if(b.efficiency > 0.0) {
            b.delegee.useTimeCur += b.delta();
            if(b.delegee.useTimeCur >= b.block.useTime) {
                b.delegee.useTimeCur %= b.block.useTime;
                b.consume();
            };
        };

        if(b.charge > b.block.reload - 0.0001) {
            b.charge = 0.0;
            let rad = b.block.range * b.heat;
            if(rad > 1.0) {
                LCEntity.eachUnit(
                    b.x, b.y, null, rad,
                    ounit => b.block.delegee.filterScr.get(b, ounit),
                    ounit => ounit.apply(b.block.delegee.staTarget, b.block.delegee.staDur),
                );
            };
        };
    };


    /**
     * @private
     * @param {BStatusProjector} b
     * @return {void}
     */
    function comp_drawSelect(b) {
        LCDrawf.diskExpand(b.x, b.y, b.block.range * b.heat, 1.5, b.block.baseColor, 0.3);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * A block that periodically applies some status effect on units in range.
         * No optional item input!
         * @class BLK_statusProjector
         * @extends BLK_baseProjector
         * @extends INTF_BLK_radiusDisplay
         */
        newClass()
        .extendClass(PARENT[0], "BLK_statusProjector")
        .implement(INTF_BLK_radiusDisplay[0])
        .initTemplate()
        .setParent("MendProjector")
        .setTags("blk-non-mend")
        .setParam({


            /**
             * `PARAM`: Status effect to apply.
             * @memberof BLK_statusProjector
             * @instance
             * @type {StatusGn}
             */
            staTarget: StatusEffects.none,
            /**
             * `PARAM`: Duration of the applied status effect.
             * @memberof BLK_statusProjector
             * @instance
             * @type {number}
             */
            staDur: 0.0,
            /**
             * `PARAM`: Filter for target units. You can create effects here.
             * `ARGS`: b, ounit.
             * @memberof BLK_statusProjector
             * @instance
             * @type {Boolf2<Building, Unit>}
             */
            filterScr: boolf2(function(b, ounit) {return true}),


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            drawPlace: function(tx, ty, rot, valid) {
                comp_drawPlace(this, tx, ty, rot, valid);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_statusProjector
             * @instance
             * @func
             * @param {boolean} valid
             * @return {Color}
             */
            ex_getBlkRadColor: function(valid) {
                return this.baseColor;
            }
            .setProp({
                noSuper: true,
                override: true,
                argLen: 1,
            }),


        }),


        /**
         * @class B_statusProjector
         * @extends B_baseProjector
         * @extends INTF_B_radiusDisplay
         */
        newClass()
        .extendClass(PARENT[1], "B_statusProjector")
        .implement(INTF_BLK_radiusDisplay[1])
        .initTemplate()
        .setParent("MendProjector.MendBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_statusProjector
             * @instance
             * @type {number}
             */
            useTimeCur: 0.0,


        })
        .setMethod({


            updateTile: function() {
                comp_updateTile(this);
            }
            .setProp({
                noSuper: true,
            }),


            drawSelect: function() {
                comp_drawSelect(this);
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
