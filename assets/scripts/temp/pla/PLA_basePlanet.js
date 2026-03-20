/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = CLS_contentTemplate;


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Root of all planets.
   * <br> <IMPORTANT>: Do not put .json files under "content/planets", content parser will create these planets and there's no way to modify them with JS. Put them under "scripts/auxFi/json/planets".
   * @class PLA_basePlanet
   * @extends CLS_contentTemplate
   */
  module.exports = newClass().extendClass(PARENT, "PLA_basePlanet").initClass()
  .setParent(null)
  .setTags("")
  .setParam({


    /**
     * <PARAM>: See {@link RS_baseResource}.
     * @memberof PLA_basePlanet
     * @instance
     */
    overwriteVanillaStat: true,
    /**
     * <PARAM>: See {@link RS_baseResource}.
     * @memberof PLA_basePlanet
     * @instance
     */
    overwriteVanillaProp: true,
    /**
     * <PARAM>: If true, mesh won't be parsed.
     * @memberof PLA_basePlanet
     * @instance
     */
    skipMeshParse: false,
    /**
     * <PARAM>: If true, cloud mesh won't be parsed.
     * @memberof PLA_basePlanet
     * @instance
     */
    skipCloudMeshParse: false,
    /**
     * <PARAM>: If true, planet generator won't be parsed.
     * @memberof PLA_basePlanet
     * @instance
     */
    skipGeneratorParse: false,


    /* <------------------------------ vanilla ------------------------------ */


    tidalLock: false,
    drawOrbit: true,
    hasAtmosphere: true,
    bloom: false,
    updateLighting: true,


  })
  .setMethod({


    /**
     * Mesh used when JSON for this is not parsed.
     * <br> <LATER>
     * @memberof PLA_basePlanet
     * @instance
     * @return {GenericMesh|null}
     */
    ex_getMesh: function() {
      return null;
    }
    .setProp({
      noSuper: true,
    }),


    /**
     * Cloud mesh used when JSON for this is not parsed.
     * <br> <LATER>
     * @memberof PLA_basePlanet
     * @instance
     * @return {GenericMesh|null}
     */
    ex_getCloudMesh: function() {
      return null;
    }
    .setProp({
      noSuper: true,
    }),


  });


  /**
   * @memberof PLA_basePlanet
   * @param {Planet} pla
   * @return {void}
   */
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

    if(jsonVal.has("mesh") && !pla.skipMeshParse) {
      let mesh = jsonVal.get("mesh");
      if(!mesh.isObject() && !mesh.isArray()) ERROR_HANDLER.throw("planetMeshLoadFail", "base", pla.name);
      jsonVal.remove("mesh");
      pla.meshLoader = prov(() => {
        let mesh_fi;
        try {
          mesh_fi = thisFun.parseMesh(pla, mesh);
        } catch(err) {
          Log.err(err);
          mesh_fi = new ShaderSphereMesh(pla, Shaders.unlit, 2);
        };
        return mesh_fi;
      });
    } else {
      jsonVal.remove("mesh");
      pla.meshLoader = prov(() => pla.ex_getMesh());
    };

    if(jsonVal.has("cloudMesh") && !pla.skipCloudMeshParse) {
      let mesh = jsonVal.get("cloudMesh");
      if(!mesh.isObject() && !mesh.isArray()) ERROR_HANDLER.throw("planetMeshLoadFail", "cloud", pla.name);
      jsonVal.remove("cloudMesh");
      pla.cloudMeshLoader = prov(() => {
        let mesh_fi;
        try {
          mesh_fi = thisFun.parseMesh(pla, mesh);
        } catch(err) {
          Log.err(err);
          mesh_fi = null;
        };
        return mesh_fi;
      });
    } else {
      jsonVal.remove("cloudMesh");
      pla.cloudMeshLoader = prov(() => pla.ex_getCloudMesh());
    };

    if(jsonVal.has("generator") && !pla.skipGeneratorParse) {
      // TODO: Generator things, maybe for years.
    } else {
      jsonVal.remove("generator");
    };

    Reflect.set(ContentParser, VAR.ctParser, "currentContent", pla);
    thisFun.read(run(() => thisFun.readFields(pla, jsonVal)));

    // I don't know why but `pla.orbitRadius` is not read in this frame
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
