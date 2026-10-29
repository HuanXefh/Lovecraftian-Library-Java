/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<BeamNode, BLK_wireRelay>} BLKWireRelay
     */


    /**
     * @typedef {TemplateInstance<BeamNode.BeamNodeBuild, B_wireRelay>} BWireRelay
     * @prop {BLKWireRelay} block
     */


    const PARENT = require("lovec/temp/blk/BLK_basePowerTransmitter");
    const INTF_BLK_wireDamageInducer = require("lovec/temp/intf/INTF_BLK_wireDamageInducer");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKWireRelay} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.consumesPower = true;
        blk.conductivePower = false;
        blk.connectedPower = true;
        if(blk.delegee.setupVanillaProp) {
            blk.underBullets = blk.size === 1;
        };
    };


    /**
     * @private
     * @param {BLKWireRelay} blk
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} size1
     * @param {number} size2
     * @return {void}
     */
    function comp_drawLaser(blk, x1, y1, x2, y2, size1, size2) {
        let dst = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2)) / Vars.tilesize;
        if(dst < (blk.size * 0.5 + 1.0)) return;

        let offSize = (dst - (size1 + size2) * 0.5) * Vars.tilesize;
        let pon2 = Geometry.d4[Tile.relativeTo(x1, y1, x2, y2)];
        SLCDrawf.wire(
            x1 + pon2.x * blk.size * 0.5 * Vars.tilesize,
            y1 + pon2.y * blk.size * 0.5 * Vars.tilesize,
            x1 + pon2.x * (blk.size * 0.5 * Vars.tilesize + offSize),
            y1 + pon2.y * (blk.size * 0.5 * Vars.tilesize + offSize),
            blk.delegee.wireMat,
            blk.self.ex_getWireStrokeScl(),
            blk.self.ex_getWireGlowAlpha(x1, y1, x2, y2),
            Layer.power + blk.size * 0.001,
        );
    };


    /**
     * @private
     * @param {BWireRelay} b
     * @return {void}
     */
    function comp_draw(b) {
        SLCDrawf.baseBuildingDraw(b);
        if(b.team === Team.derelict) return;

        let
            ot,
            ob;
        for(let i = 0; i < 4; i++) {
            ot = b.dests[i];
            ob = b.links[i];
            if(ot == null) continue;
            if(ob.block instanceof BeamNode) {
                if(ob.tileX() !== b.tileX() && ob.tileY() !== b.tileY()) continue;
                if(ob.id > b.id && b.block.range < ob.block.range) continue;
                if(b.block.range > ob.block.range) continue;
            };
            b.block.drawLaser(b.x, b.y, ob.x, ob.y, b.block.size, ob.block.size);
        };
    };


    /**
     * @private
     * @param {BWireRelay} b
     * @return {Building|null}
     */
    function comp_ex_findWireTarget(b) {
        return b.links[(3).randInt(0)];
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Just beam node.
         * @class BLK_wireRelay
         * @extends BLK_basePowerTransmitter
         * @extends INTF_BLK_wireDamageInducer
         */
        newClass()
        .extendClass(PARENT[0], "BLK_wireRelay")
        .implement(INTF_BLK_wireDamageInducer[0])
        .initTemplate()
        .setParent("BeamNode")
        .setTags("blk-pow-relay")
        .setParam({})
        .setMethod({


            init: function() {
                comp_init(this);
            },


            drawLaser: function(x1, y1, x2, y2, size1, size2) {
                comp_drawLaser(this, x1, y1, x2, y2, size1, size2);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_wireRelay
             * @instance
             * @func
             * @return {number}
             */
            ex_getWireStrokeScl: function() {
                return this.laserWidth;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


        /**
         * @class B_wireRelay
         * @extends B_basePowerTransmitter
         * @extends INTF_B_wireDamageInducer
         */
        newClass()
        .extendClass(PARENT[1], "B_wireRelay")
        .implement(INTF_BLK_wireDamageInducer[1])
        .initTemplate()
        .setParent("BeamNode.BeamNodeBuild")
        .setParam({})
        .setMethod({


            draw: function() {
                comp_draw(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof B_wireRelay
             * @instance
             * @func
             * @return {Building|null}
             */
            ex_findWireTarget: function() {
                return comp_ex_findWireTarget(this);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


    ];
