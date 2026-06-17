/**
 * Database of mostly JSON parsers.
 * @module lovec/db/DB_parser
 */


const db = {


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  /**
   * Used in {@link CLS_contentTemplateParser}.
   */
  template: [

    /* common struct */

    "class.Seq", raw => new Seq(raw.array),
    "class.ObjectMap", raw => raw => {
      let map = new ObjectMap();
      Object._it(raw.object, (key, val) => map.put(key, CLS_contentTemplateParser.parseField(val)));
      return map;
    },

    /* color */

    "class.Color", raw => Color[raw.name],
    "class.Pal", raw => Pal[raw.name],
    "method.Hex", raw => Color.valueOf(raw.value),

    /* effect */

    "class.Fx", raw => Fx[raw.name],
    "module.EFF", raw => raw.index !== "number" ? EFF[raw.name] : EFF[raw.name][raw.index],
    "module.TP_effect", raw => TP_effect[raw.name](CLS_contentTemplateParser.parseFields(raw.param)),

    /* layer */

    "class.Layer", raw => Layer[raw.name] + tryVal(raw.offset, 0.0),
    "module.VAR.layer", raw => VAR.layer[raw.name] + tryVal(raw.offset, 0.0),

  ],


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


};


Object.mergeDB(db, "DB_parser");


exports.db = db;
