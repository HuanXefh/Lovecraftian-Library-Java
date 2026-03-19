/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Registers new errors to {@link ERROR_HANDLER}.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- base ----------> */


  batchCall(ERROR_HANDLER, function() {

    this.add("debug", "${1} sucks.");
    this.add("nullArgument", "Argument ${1} cannot be null!");
    this.add("notProv", "Argument ${1} is not a Prov!");
    this.add("notAnno", "Argument ${1} is not an annotation!");
    this.add("headerConflict", "Header name ${1} has already been used!");
    this.add("notUniqueName", "Name ${1} (for ${2}) has already been used!");

    this.add("indexOutOfBound", "Index out of bound: ${1} >= ${2}");
    this.add("arrayLengthMismatch", "Two array arguments are expected to have same length!");
    this.add("not2dArray", "Array argument is expected to be 2D!");

    this.add("functionLengthWrapFail", "Wrapped function length (${1}) is out of bound!");
    this.add("notClass", "Argument ${1} is not a function class!");
    this.add("noSuperClass", "No super class found!");
    this.add("noSuperMethod", "Method ${1} is not found in super class!");
    this.add("noInitForClassPrototype", "Cannot find {class.prototype.init}!");
    this.add("abstractInstance", "Do not create instance of an abstract class!");
    this.add("abstractSuper", "Do not call super method from an abstract class!");
    this.add("notInterface", "Argument ${1} is not an interface!");
    this.add("duplicateInterface", "Do not implement the same interface twice!");
    this.add("nonFunctionInInterface", "Interface should only contain functions! Exception: ${1}");
    this.add("interfaceMethodNameConflict", "Cannot implement interface on a class due to name conflict (${1})!");
    this.add("notContentTemplate", "Argument ${1} is not a content template!");
    this.add("contentTemplateInstance", "Do not create instance of a content template!");
    this.add("contentTemplateNoParentJavaClass", "Cannot build the object when parent Java class is not assigned!");

    this.add("noModFound", "Mod ${1} is not found!");
    this.add("unregisteredContent", "Cannot fetch ${1}, it may be unregistered.");
    this.add("noContentFound", "Content ${1} is not found!");
    this.add("noTemplateFound", "No content template found for ${1}!");
    this.add("auxNotGas", "Abstract fluid must be gas! Exception: ${1}");
    this.add("noItemModule", "${1} has no item module!");
    this.add("noLiquidModule", "${1} has no liquid module!");
    this.add("noPowerModule", "${1} has no power module!");
    this.add("noItemDrop", "${1} has no item drop!");
    this.add("noLiquidDrop", "${1} has no liquid drop!");
    this.add("notSingleSized", "${1} is expected to have size of 1!");
    this.add("evenSizedCogwheel", "Cogwheel size cannot be even! Exception: ${1}");
    this.add("planetMeshLoadFail", "Failed to load mesh (${1}) for ${2}.");

    this.add("recipeDictionaryNotInitialized", "Recipe dictionary has not been initialized yet! Do not modify it before or just on CLIENT LOAD!");
    this.add("dialogFlowGenerateFail", "Failed to generate dialog flow. Make sure the structure is correct!");
    this.add("dialogFlowDoubleBuild", "Don't build the same dialog flow twice!");
    this.add("dialogFlowMissingBackgroundEnd", "The dialog flow has a background that never ends!");
    this.add("dialogFlowMissingMusicEnd", "The dialog flow has a BGM that never ends!");

  });
