/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Planet, PLA_basePlanet>} PLABasePlanet
     */


    const PARENT = CLS_contentTemplate;


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Root of all planets.
     * <br> `IMPORTANT`: Do not put .json files in `content/planets`, content parser will create these planets and there's no way to modify them with JS. Put them in `scripts/auxFi/json/planets` instead.
     * @class PLA_basePlanet
     * @extends CLS_contentTemplate
     */
    module.exports = newClass()
    .extendClass(PARENT, "PLA_basePlanet")
    .initTemplate()
    .setParent(null)
    .setTags()
    .setParam({


        /**
         * `PARAM`: See {@link RS_baseResource#setupVanillaStat}.
         * @memberof PLA_basePlanet
         * @instance
         * @type {boolean}
         */
        setupVanillaStat: true,
        /**
         * `PARAM`: See {@link RS_baseResource#setupVanillaProp}.
         * @memberof PLA_basePlanet
         * @instance
         * @type {boolean}
         */
        setupVanillaProp: true,
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


        /* <------------------------------ vanilla ------------------------------> */


        tidalLock: false,


    })
    .setMethod({


        /**
         * Mesh used when JSON for this is not parsed.
         * <br> `LATER`
         * @memberof PLA_basePlanet
         * @instance
         * @func
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
         * @func
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
     * @func
     * @param {PLABasePlanet} pla
     * @return {void}
     */
    module.exports.initContent = function(pla) {
        this.super("initContent", pla);

        let jval = LCContentParser.getJval(pla);
        if(jval != null) {
            LCContentParser.setField(pla, jval, "parent");
            LCContentParser.parsePlanet(pla, jval);
            LCContentParser.setupFields(pla, jval);

            // I don't know why but `pla.orbitRadius` is not read in this frame
            Time.run(0.0, () => {
                pla.orbitTime = Mathf.pow(pla.orbitRadius, 1.5) * 1000.0;
                if(pla.parent != null) {
                    pla.parent.children.add(pla);
                    pla.parent.updateTotalRadius();
                };
            });
        };
    };
