/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Creates global references for some Java classes.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ content frag ------------------------------ */


  globalize({}, "__contentFrags__");


  function exposeContentFrags() {
    let i = 0;
    let name;
    let ins;
    fetchClasses("lovec.content.frag").forEach(cls => {
      name = cls.__javaObject__.getSimpleName();
      ins = new cls();
      globalize(ins, name);
      __contentFrags__[name] = ins;
      i++;
    });
    console.log("[LOVEC] Created global references for ${1} content frag classes.".format(i.color(Pal.accent)));
  };


/*
  ========================================
  Section: Application
  ========================================
*/




  exposeContentFrags();
  exposeClasses("lovec.content.updater");
  exposeClasses("lovec.graphics.drawer");
  exposeClasses("lovec.type");
