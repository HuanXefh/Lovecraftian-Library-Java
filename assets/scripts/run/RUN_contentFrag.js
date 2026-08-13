/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Creates global references for content frags automatically.
   */


/*
  ========================================
  Section: Application
  ========================================
*/




  Object.globalize({}, "__contentFrags__");




  let i = 0;
  let name;
  let ins;
  fetchClasses("lovec.content.frag").forEach(cls => {
    name = cls.__javaObject__.getSimpleName();
    ins = new cls();
    Object.globalize(ins, name);
    __contentFrags__[name] = ins;
    i++;
  });
  console.log("[LOVEC] Processed reference for ${1} content frag classes.".format(i.color(Pal.accent)));
