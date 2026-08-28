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
    globalize(fun => extendSafe(javaIntf, {
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
  create("integerf", Intf);
  create("integerf2", fetchClass("lovec.utils.func.Intf2"));
  create("integerf3", fetchClass("lovec.utils.func.Intf3"));
  create("integerf4", fetchClass("lovec.utils.func.Intf4"));
  create("integerf5", fetchClass("lovec.utils.func.Intf5"));
  create("integerf6", fetchClass("lovec.utils.func.Intf6"));
  create("floatf2", fetchClass("lovec.utils.func.Floatf2"));
  create("floatf3", fetchClass("lovec.utils.func.Floatf3"));
  create("floatf4", fetchClass("lovec.utils.func.Floatf4"));
  create("floatf5", fetchClass("lovec.utils.func.Floatf5"));
  create("floatf6", fetchClass("lovec.utils.func.Floatf6"));
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
  create("tfunc", TemplateFunc);
  create("tprov", TemplateProv);
