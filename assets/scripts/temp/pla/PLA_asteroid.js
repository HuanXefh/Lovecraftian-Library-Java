/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {Planet&PLA_asteroid} PLAAsteroid
     */


    const PARENT = require("lovec/temp/pla/PLA_basePlanet");


    /* <------------------------------ component ------------------------------ */


    /**
     * @private
     * @param {PLAAsteroid} pla
     * @return {void}
     */
    function comp_init(pla) {
        pla.drawOrbit = false;
        pla.hasAtmosphere = false;
        pla.updateLighting = false;

        pla.camRadius = pla.radius * 5.6;
        pla.clipRadius = pla.radius * 16.6;
    };


    /**
     * @private
     * @param {PLAAsteroid} pla
     * @return {GenericMesh}
     */
    function comp_ex_getMesh(pla) {
        let meshes = [];
        let rand = new Rand(pla.id + 2);
        let colorBase = pla.blkBase.mapColor;
        let colorTint = (function() {
            let color = pla.blkTint.mapColor.cpy();
            color.a = 1.0 - pla.blkTint.mapColor.a;
            return color;
        })();
        meshes.push(new NoiseMesh(
            pla, pla.astSeed, 2, pla.radius, 2, 0.55, 0.45, 14.0,
            colorBase, colorTint, 3, 0.6, 0.38, pla.tintThr,
        ));
        pla.astAmt.each(i => {
            meshes.push(new MatMesh(
                new NoiseMesh(
                    pla, pla.astSeed + i + 1, 1, 0.022 + rand.random(0.039) * pla.astScl, 2, 0.6, 0.38, 20.0,
                    colorBase, colorTint, 3, 0.6, 0.38, pla.tintThr,
                ),
                new Mat3D().setToTranslation(Tmp.v31.setToRandomDirection(rand).setLength(rand.random(0.44, 1.4) * pla.astScl))
            ));
        });

        return new MultiMesh(meshes);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Vanilla asteroid.
     * @class PLA_asteroid
     * @extends PLA_basePlanet
     */
    module.exports = newClass()
    .extendClass(PARENT, "PLA_asteroid")
    .initClass()
    .setParent(Planet)
    .setTags()
    .setParam({


        /**
         * `PARAM`: Wall used for base color.
         * @memberof PLA_asteroid
         * @instance
         * @type {Block}
         */
        blkBase: Blocks.stoneWall,
        /**
         * `PARAM`: Wall used for tint color.
         * @memberof PLA_asteroid
         * @instance
         * @type {Block}
         */
        blkTint: Blocks.iceWall,
        /**
         * `PARAM`: Random generation seed.
         * @memberof PLA_asteroid
         * @instance
         * @type {number}
         */
        astSeed: -1,
        /**
         * `PARAM`: Tint threshold.
         * @memberof PLA_asteroid
         * @instance
         * @type {number}
         */
        tintThr: 0.5,
        /**
         * `PARAM`: Amount of asteroids.
         * @memberof PLA_asteroid
         * @instance
         * @type {number}
         */
        astAmt: 12,
        /**
         * `PARAM`: Scaling of asteroids.
         * @memberof PLA_asteroid
         * @instance
         * @type {number}
         */
        astScl: 1.0,


        /* <------------------------------ internal ------------------------------ */


        /**
         * `INTERNAL`: Asteroid mesh is fixed.
         * @override
         * @memberof PLA_asteroid
         * @instance
         * @type {boolean}
         */
        skipMeshParse: true,
        /**
         * `INTERNAL`: Asteroid has no cloud mesh.
         * @override
         * @memberof PLA_asteroid
         * @instance
         * @type {boolean}
         */
        skipCloudMeshParse: true,


    })
    .setMethod({


        init: function() {
            comp_init(this);
        },


        /**
         * @override
         * @memberof PLA_asteroid
         * @instance
         * @return {GenericMesh|null}
         */
        ex_getMesh: function() {
            return comp_ex_getMesh(this);
        }
        .setProp({
            noSuper: true,
            override: true,
        }),


    });
