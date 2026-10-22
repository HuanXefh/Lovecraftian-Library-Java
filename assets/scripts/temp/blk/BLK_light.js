/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<GenericCrafter, BLK_light>} BLKLight
     */


    /**
     * @typedef {TemplateInstance<GenericCrafter.GenericCrafterBuild, B_light>} BLight
     * @prop {BLKLight} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseFactory");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKLight} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.emitLight = true;
        blk.allowedInPayloads = false;
        if(blk.delegee.fogRadFrac > 0.0) {
            blk.flags.with(BlockFlag.hasFogRadius)
        };

        blk.self.ex_addLogicF(LogicProp.range, b => blk.delegee.lightRad * b.delegee.lightWarmup / Vars.tilesize);
    };


    /**
     * @private
     * @param {BLKLight} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.add(Stat.range, blk.delegee.lightRad / Vars.tilesize, StatUnit.blocks);
    };


    /**
     * @private
     * @param {BLKLight} blk
     * @param {number} tx
     * @param {number} ty
     * @param {number} rot
     * @param {boolean} valid
     * @return {void}
     */
    function comp_drawPlace(blk, tx, ty, rot, valid) {
        Drawf.dashCircle(tx.toFCoord(blk.size), ty.toFCoord(blk.size), blk.delegee.lightRad, valid ? GLB_color.accent : GLB_color.remove);
    };


    /**
     * @private
     * @param {BLight} b
     * @return {void}
     */
    function comp_updateTile(b) {
        b.delegee.lightWarmup = Mathf.approachDelta(b.delegee.lightWarmup, Mathf.clamp(b.efficiency), 0.004);
        if(GLB_timer.secQuarter && b.block.delegee.fogRadFrac > 0.0) {
            b.delegee.fogRad = b.block.delegee.lightRad * b.block.delegee.fogRadFrac * b.delegee.lightWarmup / Vars.tilesize;
            if(!b.delegee.lastFogRad.fEqual(b.delegee.fogRad, 0.5)) {
                GLB_var.fogControl.forceUpdate(b.team, b);
                b.delegee.lastFogRad = b.delegee.fogRad;
            };
        };
    };


    /**
     * @private
     * @param {BLight} b
     * @return {void}
     */
    function comp_drawSelect(b) {
        Drawf.dashCircle(b.x, b.y, b.block.delegee.lightRad * b.delegee.lightWarmup, GLB_color.accent);
    };


    /**
     * @private
     * @param {BLight} b
     * @return {void}
     */
    function comp_drawLight(b) {
        LCDrawf.light(
            b.x, b.y, b.delegee.lightWarmup,
            b.block.delegee.lightRad * b.delegee.lightWarmup * 0.6,
            b.block.size, LCDrawf.lightColor,
            b.block.delegee.lightA * Interp.pow3In.apply(b.delegee.lightWarmup),
        );
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Light block but actually a crafter.
         * The range and lightness are determined by efficiency.
         * @class BLK_light
         * @extends BLK_baseFactory
         */
        newClass()
        .extendClass(PARENT[0], "BLK_light")
        .initTemplate()
        .setParent("GenericCrafter")
        .setTags("blk-non-fac")
        .setParam({


            /**
             * `PARAM`: Light radius of this block at efficiency of 1.0.
             * @memberof BLK_light
             * @instance
             * @type {number}
             */
            lightRad: 200.0,
            /**
             * `PARAM`: Lightness of this block.
             * @memberof BLK_light
             * @instance
             * @type {number}
             */
            lightA: 0.65,
            /**
             * `PARAM`: Fraction of light radius as fog radius. Uses static fog radius if not set.
             * @memberof BLK_light
             * @instance
             * @type {number}
             */
            fogRadFrac: 0.0,


        })
        .setParamParser([
            "lightRad", function(val) {
                this["lightClipSize"] = val * 3.0;
                return val;
            },
        ])
        .setMethod({


            init: function() {
                comp_init(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            drawPlace: function(tx, ty, rot, valid) {
                comp_drawPlace(this, tx, ty, rot, valid);
            },


        }),


        /**
         * @class B_light
         * @extends B_baseFactory
         */
        newClass()
        .extendClass(PARENT[1], "B_light")
        .initTemplate()
        .setParent("GenericCrafter.GenericCrafterBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_light
             * @instance
             * @type {number}
             */
            lightWarmup: 0.0,
            /**
             * `INTERNAL`
             * @memberof B_light
             * @instance
             * @type {number}
             */
            fogRad: 0.0,
            /**
             * `INTERNAL`
             * @memberof B_light
             * @instance
             * @type {number}
             */
            lastFogRad: 0.0,


        })
        .setMethod({


            updateTile: function() {
                comp_updateTile(this);
            },


            warmup: function() {
                return this.delegee.lightWarmup;
            }
            .setProp({
                noSuper: true,
            }),


            fogRadius: function() {
                return this.block.delegee.fogRadFrac < 0.0001 ?
                    this.block.fogRadius :
                    this.delegee.fogRad;
            }
            .setProp({
                noSuper: true,
            }),


            drawSelect: function() {
                comp_drawSelect(this);
            },


            drawLight: function() {
                comp_drawLight(this);
            }
            .setProp({
                noSuper: true,
            }),


            write: function(wr) {
                this.self.ex_processData(wr);
                wr.f(this.delegee.lightWarmup);
            },


            read: function(rd, revi) {
                if(this.delegee.LCRevi === 5) {
                    rd.s();
                };
                this.self.ex_processData(rd);
                this.delegee.lightWarmup = rd.f();
            },


            /**
             * @memberof B_light
             * @instance
             * @func
             * @param {Writes|Reads} wr0rd
             * @return {void}
             */
            ex_processData: function(wr0rd) {
                // Do nothing
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


        }),


    ];
