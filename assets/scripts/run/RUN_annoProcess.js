/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * Processes some Java annotations.
     */


/*
  ========================================
  Section: Definition
  ========================================
*/


    /**
     * @global
     * @internal
     * @name __annoTargetMap__
     * @type {ObjectMap<string, Array<string>>}
     */
    globalize(new ObjectMap(), "__annoTargetMap__");


    __annoTargetMap__.put("LCFromScript", [
        "SLCVersionResolver",

        "SLCPal",
        "SLCScriptUtil",
    ]);


/*
  ========================================
  Section: Application
  ========================================
*/




    let
        cls,
        anno,
        name;




    MDL_event.onLoad(() => {


        // @LCFromScript
        __annoTargetMap__.get("LCFromScript").forEachFast(nameCls => {
            cls = eval(nameCls);
            cls.__javaObject__.getDeclaredFields().forEachFast(field => {
                anno = field.getDeclaredAnnotation(LCFromScript);
                if(anno == null) return;
                name = anno.name();
                if(name == "!UNDEF") {
                    name = field.getName();
                };
                let scrStr = nameCls + "." + field.getName() + " = " + anno.source() + "." + name;
                eval(scrStr);
                if(anno.updated()) {
                    MDL_event.onUpdate(() => eval(scrStr));
                };
            }, true);
        }, true);


    });
