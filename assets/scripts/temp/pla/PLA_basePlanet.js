/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {Planet&PLA_basePlanet} PLABasePlanet
     */


    const PARENT = CLS_contentTemplate;


    /* <------------------------------ component ------------------------------ */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Root of all planets.
     * <br> `IMPORTANT`: Do not put .json files under `content/planets`, content parser will create these planets and there's no way to modify them with JS. Put them under `scripts/auxFi/json/planets`.
     * @class PLA_basePlanet
     * @extends CLS_contentTemplate
     */
    module.exports = newClass()
    .extendClass(PARENT, "PLA_basePlanet")
    .initClass()
    .setParent(null)
    .setTags()
    .setParam({


        /**
         * `PARAM`: See {@link RS_baseResource}.
         * @memberof PLA_basePlanet
         * @instance
         * @type {boolean}
         */
        overwriteVanillaStat: true,
        /**
         * `PARAM`: See {@link RS_baseResource}.
         * @memberof PLA_basePlanet
         * @instance
         * @type {boolean}
         */
        overwriteVanillaProp: true,
        /**
         * `PARAM`: If true, mesh won't be parsed.
         * @memberof PLA_basePlanet
         * @instance
         * @type {boolean}
         */
        skipMeshParse: false,
        /**
         * `PARAM`: If true, cloud mesh won't be parsed.
         * @memberof PLA_basePlanet
         * @instance
         * @type {boolean}
         */
        skipCloudMeshParse: false,
        /**
         * `PARAM`: If true, planet generator won't be parsed.
         * @memberof PLA_basePlanet
         * @instance
         * @type {boolean}
         */
        skipGeneratorParse: false,


    })
    .setMethod({


          /**
           * Mesh used when JSON for this is not parsed.
           * <br> `LATER`
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
           * <br> `LATER`
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
     * @override
     * @memberof PLA_basePlanet
     * @param {Planet} pla
     * @return {void}
     */
    module.exports.initContent = function thisFun(pla) {
        this.super("initContent", pla);

        let dir = MDL_file.getScriptDir(MDL_content.getMod(pla)).child("auxFi").child("json").child("planets");
        let fi = (function() {
            let tmp = dir.child(MDL_content.getCtNameNoPrefix(pla) + ".json");
            return tmp.exists() ? tmp : dir.child(MDL_content.getCtNameNoPrefix(pla) + ".hjson");
        })();
        let jval = jsonToJval(fi);
        // Convert `Jval` to `JsonValue` in v8
        if(LCCompatibilityResolver.isV8) {
            jval = eval("VAR.jsonParser.fromJson(null, jval.toString(Jval.Jformat.plain))");
        };
        if(jval == null || jval.isString()) return;

        pla.parent = thisFun.locate(ContentType.planet, jval.getString("parent", ""));
        jval.remove("parent");

        // Parse mesh
        if(jval.has("mesh") && !pla.skipMeshParse) {
            let mesh = jval.get("mesh");
            if(!mesh.isObject() && !mesh.isArray()) throw new Error("Failed to parse base mesh: " + pla);
            jval.remove("mesh");
            pla.meshLoader = prov(() => {
                let mesh_fi;
                try {
                    mesh_fi = thisFun.parseMesh(pla, mesh);
                } catch(err) {
                    console.err(err);
                    mesh_fi = new ShaderSphereMesh(pla, Shaders.unlit, 2);
                };
                return mesh_fi;
            });
        } else {
            jval.remove("mesh");
            pla.meshLoader = prov(() => pla.ex_getMesh());
        };

        // Parse cloud mesh
        if(jval.has("cloudMesh") && !pla.skipCloudMeshParse) {
            let mesh = jval.get("cloudMesh");
            if(!mesh.isObject() && !mesh.isArray()) throw new Error("Failed to parse cloud mesh: " + pla);
            jval.remove("cloudMesh");
            pla.cloudMeshLoader = prov(() => {
                let mesh_fi;
                try {
                    mesh_fi = thisFun.parseMesh(pla, mesh);
                } catch(err) {
                    console.err(err);
                    mesh_fi = null;
                };
                return mesh_fi;
            });
        } else {
            jval.remove("cloudMesh");
            pla.cloudMeshLoader = prov(() => pla.ex_getCloudMesh());
        };

        // Parse generator
        if(jval.has("generator") && !pla.skipGeneratorParse) {
            // TODO: Generator things, maybe for years.
        } else {
            jval.remove("generator");
        };

        Reflect.set(ContentParser, VAR.ctParser, "currentContent", pla);
        thisFun.read(run(() => thisFun.readFields(pla, jval)));

        // I don't know why but `pla.orbitRadius` is not read in this frame
        Time.run(0.0, () => {
            pla.orbitTime = Mathf.pow(pla.orbitRadius, 1.5) * 1000.0;
            if(pla.parent != null) {
                pla.parent.children.add(pla);
                pla.parent.updateTotalRadius();
            };
        });
    }
    .setProp({
        /**
         * @memberof PLA_basePlanet.initContent
         * @param {ContentType} ctType
         * @param {string} name
         * @return {UnlockableContent}
         */
        locate: function(ctType, name) {
            return Reflect.invoke(ContentParser, VAR.ctParser, "locate", [ctType, name], ContentType, JAVA.string)
        },
        /**
         * @memberof PLA_basePlanet.initContent
         * @param {java.lang.Runnable} run
         * @return {void}
         */
        read: function(run) {
            Reflect.invoke(ContentParser, VAR.ctParser, "read", [run], JAVA.runnable);
        },
        /**
         * @memberof PLA_basePlanet.initContent
         * @param {Object} obj
         * @param {Jval} jval
         * @return {void}
         */
        readFields: function(obj, jval) {
            Reflect.invoke(ContentParser, VAR.ctParser, "readFields", [obj, jval], JAVA.object, LCCompatibilityResolver.isV8 ? eval("JsonValue") : Jval);
        },
        /**
        * @memberof PLA_basePlanet.initContent
        * @param {Planet} pla
        * @param {Jval} jval
        * @return {GenericMesh}
         */
        parseMesh: function(pla, jval) {
            return Reflect.invoke(ContentParser, VAR.ctParser, "parseMesh", [pla, jval], Planet, LCCompatibilityResolver.isV8 ? eval("JsonValue") : Jval);
        },
    });
