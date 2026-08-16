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


  const contentFrags = {};
  Object.globalize(contentFrags, "__contentFrags__");


  function exposeContentFrags() {
    let i = 0;
    let name;
    let ins;
    fetchClasses("lovec.content.frag").forEach(cls => {
      name = cls.__javaObject__.getSimpleName();
      ins = new cls();
      Object.globalize(ins, name);
      contentFrags[name] = ins;
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
  exposeClasses("lovec.graphics.drawer");
