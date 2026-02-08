/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Root of all planets.
   * ----------------------------------------
   * IMPORTANT:
   *
   * Don't put Json files under "content/planets" which will cause name conflict.
   * Put them under "scripts/auxFi/json/planets".
   * In the Json file mod name prefix is always required.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/cls/util/CLS_contentTemplate");
  const VAR = require("lovec/glb/GLB_var");


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_file = require("lovec/mdl/MDL_file");
  const MDL_json = require("lovec/mdl/MDL_json");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(null)
  .setTags("")
  .setParam({
    // @PARAM: See {RS_baseResource}.
    overwriteVanillaStat: true,
    // @PARAM: See {RS_baseResource}.
    overwriteVanillaProp: true,

    skipMeshParse: false,
    skipCloudMeshParse: false,
    skipGeneratorParse: false,
    tidalLock: false,
    drawOrbit: true,
    hasAtmosphere: true,
    bloom: false,
    updateLighting: true,
  })
  .setMethod({


    // @LATER
    ex_getMesh: function() {
      return null;
    }
    .setProp({
      noSuper: true,
    }),


    // @lATER
    ex_getCloudMesh: function() {
      return null;
    }
    .setProp({
      noSuper: true,
    }),


  });


  // Parse the Json file without creating a new planet
  module.exports.initPlanet = function thisFun(pla) {
    let dir = MDL_file._script(MDL_content._mod(pla)).child("auxFi").child("json").child("planets");
    let fi = (function() {
      let tmp = dir.child(MDL_content._nmCtNoPrefix(pla) + ".json");
      return tmp.exists() ? tmp : dir.child(MDL_content._nmCtNoPrefix(pla) + ".hjson");
    })();
    let jsonVal = MDL_json.parse(fi);
    if(jsonVal == null || jsonVal.isString()) return;

    pla.parent = thisFun.locate(ContentType.planet, jsonVal.getString("parent", ""));
    jsonVal.remove("parent");

    if(jsonVal.has("mesh")) {
      if(!pla.skipMeshParse) {
        let mesh = jsonVal.get("mesh");
        if(!mesh.isObject() && !mesh.isArray()) ERROR_HANDLER.throw("planetMeshLoadFail", "base", pla.name);
        jsonVal.remove("mesh");
        pla.meshLoader = prov(() => {
          try {
            return thisFun.parseMesh(pla, mesh);
          } catch(err) {
            Log.err(err);
            return new ShaderSphereMesh(pla, Shaders.unlit, 2);
          };
        });
      } else {
        jsonVal.remove("mesh");
        pla.meshLoader = prov(() => pla.ex_getMesh());
      };
    };

    if(jsonVal.has("cloudMesh")) {
      if(!pla.skipCloudMeshParse) {
        let mesh = jsonVal.get("cloudMesh");
        if(!mesh.isObject() && !mesh.isArray()) ERROR_HANDLER.throw("planetMeshLoadFail", "cloud", pla.name);
        jsonVal.remove("cloudMesh");
        pla.cloudMeshLoader = prov(() => {
          try {
            return thisFun.parseMesh(pla, mesh);
          } catch(err) {
            Log.err(err);
            return null;
          };
        });
      } else {
        jsonVal.remove("cloudMesh");
        pla.cloudMeshLoader = prov(() => pla.ex_getCloudMesh());
      };
    };

    if(pla.skipGeneratorParse && jsonVal.has("generator")) {
      jsonVal.remove("generator");
    };

    Reflect.set(ContentParser, VAR.ctParser, "currentContent", pla);
    thisFun.read(run(() => thisFun.readFields(pla, jsonVal)));

    // I don't know why but {pla.orbitRadius} is not read in this frame
    Time.run(1.0, () => {
      pla.orbitTime = Mathf.pow(pla.orbitRadius, 1.5) * 1000.0;
      if(pla.parent != null) {
        pla.parent.children.add(pla);
        pla.parent.updateTotalRadius();
      };
    });

    if(pla.sectors.size === 0) pla.sectors.add(new Sector(pla, PlanetGrid.Ptile.empty));
  }
  .setProp({
    locate: (ctType, nm) => Reflect.invoke(ContentParser, VAR.ctParser, "locate", [ctType, nm], [ContentType, JAVA.string]),
    read: runnable => Reflect.invoke(ContentParser, VAR.ctParser, "read", [runnable], [JAVA.runnable]),
    readFields: (obj, jVal) => Reflect.invoke(ContentParser, VAR.ctParser, "readFields", [obj, jVal], [JAVA.object, JsonValue]),
    parseMesh: (pla, jVal) => Reflect.invoke(ContentParser, VAR.ctParser, "parseMesh", [pla, jVal], [Planet, JsonValue]),
  });
