/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Vanilla asteroid.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/pla/PLA_basePlanet");


  /* <---------- component ----------> */


  function comp_init(pla) {
    pla.camRadius = pla.radius * 5.6;
    pla.clipRadius = pla.radius * 16.6;
  };


  function comp_ex_getMesh(pla) {
    let meshes = [];
    let rand = new Rand(pla.id + 2);
    let colorBase = pla.blkBase.mapColor;
    let colorTint = (function() {
      let color = pla.blkTint.mapColor.cpy();
      color.a = 1.0 - pla.blkTint.mapColor.a;
      return color;
    })()
    meshes.push(new NoiseMesh(
      pla, pla.astSeed, 2, pla.radius, 2, 0.55, 0.45, 14.0,
      colorBase, colorTint, 3, 0.6, 0.38, pla.tintThr,
    ));
    pla.astAmt._it(1, i => {
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


  module.exports = newClass().extendClass(PARENT, "PLA_asteroid").initClass()
  .setParent(Planet)
  .setTags("pla-ast")
  .setParam({
    // @PARAM: The wall used for base color.
    blkBase: Blocks.stoneWall,
    // @PARAM: The wall used for tint color.
    blkTint: Blocks.iceWall,
    // @PARAM: Random generation seed.
    astSeed: -1,
    // @PARAM: Tint threshold.
    tintThr: 0.5,
    // @PARAM: Amount of asteroids.
    astAmt: 12,
    // @PARAM: Scaling of the asteroid.
    astScl: 1.0,

    skipMeshParse: true,
    skipCloudMeshParse: true,
    drawOrbit: false,
    hasAtmosphere: false,
    updateLighting: false,
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    ex_getMesh: function() {
      return comp_ex_getMesh(this);
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
