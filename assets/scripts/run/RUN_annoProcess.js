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


  globalize(new ObjectMap(), "__annoTargetMap__");


  __annoTargetMap__.put("FromScript", [
    "LCScriptUtil",
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


    // @FromScript
    __annoTargetMap__.get("FromScript").forEachFast(nameCls => {
      cls = eval(nameCls);
      cls.__javaObject__.getDeclaredFields().forEachFast(field => {
        anno = field.getDeclaredAnnotation(FromScript);
        if(anno == null) return;
        name = anno.name();
        if(name == "!UNDEF") {
          name = field.getName();
        };
        eval(nameCls + "." + field.getName() + " = " + anno.source() + "." + name);
      }, true);
    }, true);


  });
