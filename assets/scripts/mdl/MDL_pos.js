/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * Methods to calculate position.
     * Most methods are defined in {@link LCPos}.
     * @module lovec/mdl/MDL_pos
     */


/*
  ========================================
  Section: Definition
  ========================================
*/


    /** @global */
    const SideFracModes = newEnum({
        /** @type {ENumber} */
        ALL: -1,
        /** @type {ENumber} */
        FRONT: 0,
        /** @type {ENumber} */
        BACK: 1,
        /** @type {ENumber} */
        SIDE: 2,
        /** @type {ENumber} */
        NON_FRONT: 3,
        /** @type {ENumber} */
        NON_BACK: 4,
    }, "SideFracModes");


    /**
     * Calculates fraction of sides in contact.
     * @param {Building} b_f
     * @param {Building} b_t
     * @param {ENumber|unset} [mode] - Determines which sides can be used. See {@link SideFracModes}.
     * @param {boolean|unset} [useToAsParent] - If true, size of `b_t` will be used as denominator instead.
     * @param {boolean|unset} [forceOneSide] - If true, only one side will be considered regardless of mode.
     * @return {number}
     */
    const calcSideFrac = function thisFun(b_f, b_t, mode, useToAsParent, forceOneSide) {
        if(mode == null) mode = SideFracModes.FRONT;
        if(!SideFracModes.has(mode)) return 0.0;

        let frac = 0.0;
        if(!useToAsParent ? !b_f.block.rotate : !b_t.block.rotate) {
            frac = LCPos
            .getTilesEdge(thisFun.tmpTs, (useToAsParent ? b_t : b_f).tile, (useToAsParent ? b_t : b_f).block.size, false)
            .count(useToAsParent ? b_f : b_t, ot => ot.build)
            / thisFun.tmpTs.length
            * (forceOneSide ? 4.0 : 1.0);
        } else {
            switch(mode) {

                case SideFracModes.ALL :
                    if(!useToAsParent) {
                        frac = LCPos
                        .getTilesEdge(thisFun.tmpTs, b_f.tile, b_f.block.size, false)
                        .count(b_t, ot => ot.build)
                        / thisFun.tmpTs.length;
                    } else {
                        frac = LCPos
                        .getTilesEdge(thisFun.tmpTs, b_t.tile, b_t.block.size, false)
                        .count(b_f, ot => ot.build)
                        / thisFun.tmpTs.length;
                    };
                    break;

                case SideFracModes.FRONT :
                    if(!useToAsParent) {
                        frac = LCPos
                        .getTilesRot(thisFun.tmpTs, b_f.tile, b_f.rotation, b_f.block.size)
                        .count(b_t, ot => ot.build)
                        / thisFun.tmpTs.length;
                    } else {
                        frac = LCPos
                        .getTilesRot(thisFun.tmpTs, b_t.tile, Mathf.mod(b_f.rotation + 2, 4), b_t.block.size)
                        .count(b_f, ot => ot.build)
                        / thisFun.tmpTs.length;
                    };
                    break;

                case SideFracModes.BACK :
                    if(!useToAsParent) {
                        frac = LCPos
                        .getTilesRot(thisFun.tmpTs, b_f.tile, Mathf.mod(b_f.rotation + 2, 4), b_f.block.size)
                        .count(b_t, ot => ot.build)
                        / thisFun.tmpTs.length;
                    } else {
                        frac = LCPos
                        .getTilesRot(thisFun.tmpTs, b_t.tile, b_t.rotation, b_t.block.size)
                        .count(b_f, ot => ot.build)
                        / thisFun.tmpTs.length;
                    };
                    break;

                case SideFracModes.SIDE :
                    if(!useToAsParent) {
                        frac = (
                            (
                                LCPos
                                .getTilesRot(thisFun.tmpTs, b_f.tile, Mathf.mod(b_f.rotation + 1, 4), b_f.block.size)
                                .count(b_t, ot => ot.build)
                            ) + (
                                LCPos
                                .getTilesRot(thisFun.tmpTs, b_f.tile, Mathf.mod(b_f.rotation - 1, 4), b_f.block.size)
                                .count(b_t, ot => ot.build)
                            )
                        ) / thisFun.tmpTs.length;
                    } else {
                        frac = (
                            (
                                LCPos
                                .getTilesRot(thisFun.tmpTs, b_t.tile, Mathf.mod(b_t.rotation + 1, 4), b_t.block.size)
                                .count(b_f, ot => ot.build)
                            ) + (
                                LCPos
                                .getTilesRot(thisFun.tmpTs, b_t.tile, Mathf.mod(b_t.rotation - 1, 4), b_t.block.size)
                                .count(b_f, ot => ot.build)
                            )
                        ) / thisFun.tmpTs.length;
                    };
                    break;

                case SideFracModes.NON_FRONT :
                    if(!useToAsParent) {
                        frac = LCPos
                        .getTilesEdge(thisFun.tmpTs, b_f.tile, b_f.block.size)
                        .count(b_t, ot => b_f.block.rotate && LCPos.getRotation(b_f.tile, ot) === b_f.rotation ? null : ot.build)
                        * 4
                        / thisFun.tmpTs.length;
                    } else {
                        frac = LCPos
                        .getTilesEdge(thisFun.tmpTs, b_t.tile, b_t.block.size)
                        .count(b_f, ot => b_f.block.rotate && LCPos.getRotation(b_f.tile, ot) === b_f.rotation ? null : ot.build)
                        * 4
                        / thisFun.tmpTs.length;
                    }
                    break;

                case SideFracModes.NON_BACK :
                    if(!useToAsParent) {
                        frac = LCPos
                        .getTilesEdge(thisFun.tmpTs, b_f.tile, b_f.block.size)
                        .count(b_t, ot => b_f.block.rotate && Mathf.mod(LCPos.getRotation(b_f.tile, ot) + 2, 4) === b_f.rotation ? null : ot.build)
                        * 4
                        / thisFun.tmpTs.length;
                    } else {
                        frac = LCPos
                        .getTilesEdge(thisFun.tmpTs, b_t.tile, b_t.block.size)
                        .count(b_f, ot => b_f.block.rotate && Mathf.mod(LCPos.getRotation(b_f.tile, ot) + 2, 4) === b_f.rotation ? null : ot.build)
                        * 4
                        / thisFun.tmpTs.length;
                    }
                    break;

            };
        };

        return frac;
    }
    .setProp({
        /**
         * @memberof calcSideFrac
         * @type {Array<Tile>}
         */
        tmpTs: [],
    });
    exports.calcSideFrac = calcSideFrac;
