/*
  ================================================================================
  Section: Introduction
  ================================================================================
*/


    /**
     * Processes some Java annotations.
     */


/*
  ================================================================================
  Section: Application
  ================================================================================
*/




    let
        cls,
        anno,
        name;




    MDL_event.onLoad(() => {


        // @LCFromScript
        __annoProcData__.get("LCFromScript").forEachFast(nameCls => {
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
