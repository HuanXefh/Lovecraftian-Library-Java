/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Creates extra func methods.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  function create(name, javaIntf) {
    Object.globalize(fun => extendSafe(javaIntf, {
      get: fun,
    }), name);
  };


/*
  ========================================
  Section: Application
  ========================================
*/




  create("boolf2", Boolf2);
  create("boolf3", Boolf3);
  create("boolf4", fetchClass("lovec.utils.func.Boolf4"));
  create("boolf5", fetchClass("lovec.utils.func.Boolf5"));
  create("boolf6", fetchClass("lovec.utils.func.Boolf6"));
  create("cons2", Cons2);
  create("cons3", Cons3);
  create("cons4", Cons4);
  create("cons5", fetchClass("lovec.utils.func.Cons5"));
  create("cons6", fetchClass("lovec.utils.func.Cons6"));
  create("func2", Func2);
  create("func3", Func3);
  create("func4", fetchClass("lovec.utils.func.Func4"));
  create("func5", fetchClass("lovec.utils.func.Func5"));
  create("func6", fetchClass("lovec.utils.func.Func6"));
