/**
 * Database of mostly JSON parsers.
 * @module lovec/db/DB_parser
 */


const db = {


    /* <------------------------------ CHUNK SPLITTER ------------------------------> */


    /**
     * Resolves `type`. Used in {@link CLS_contentTemplateParser}.
     * <br> `ROW`: typeStr, valF.
     * @type {F2Array<string, FFunction<Object, Object>>}
     */
    template: [

        /* <------------------------------ common struct ------------------------------> */

        "class.Seq", raw => {
            let seq = new Seq();
            raw.array.forEachFast(val => {
                seq.add(CLS_contentTemplateParser.parseField(val));
            }, true);
            return seq;
        },
        "class.ObjectSet", raw => {
            let set = new ObjectSet();
            raw.array.forEachFast(val => {
                set.add(CLS_contentTemplateParser.parseField(val));
            }, true);
            return set;
        },
        "class.ObjectMap", raw => {
            let map = new ObjectMap();
            Object.eachPair(raw.object, (key, val) => map.put(key, CLS_contentTemplateParser.parseField(val)));
            return map;
        },
        "class.OrderedMap", raw => {
            let map = new OrderedMap();
            Object.eachPair(raw.object, (key, val) => map.put(key, CLS_contentTemplateParser.parseField(val)));
            return map;
        },

        /* <------------------------------ color ------------------------------> */

        "class.Color", raw => Color[raw.name],
        "class.Pal", raw => Pal[raw.name],
        "method.Hex", raw => Color.valueOf(raw.value),

        /* <------------------------------ effect ------------------------------> */

        "class.Fx", raw => Fx[raw.name],
        "module.GLB_eff", raw => raw.index !== "number" ? GLB_eff[raw.name] : GLB_eff[raw.name][raw.index],
        "module.TP_effect", raw => TP_effect[raw.name](CLS_contentTemplateParser.parseFields(raw.param)),

        /* <------------------------------ layer ------------------------------> */

        "class.Layer", raw => Layer[raw.name] + tryVal(raw.offset, 0.0),
        "module.GLB_var.layer", raw => GLB_var.layer[raw.name] + tryVal(raw.offset, 0.0),

    ],


    /* <------------------------------ CHUNK SPLITTER ------------------------------> */


};


mergeDB(db, "DB_parser");


exports.db = db;
