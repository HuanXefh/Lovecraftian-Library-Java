/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Adds new error types.
   */


/*
  ========================================
  Section: Application
  ========================================
*/



    /**
     * Container of all custom error types registered with {@link registerNewError}.
     * @global
     * @name LCError
     * @type {Object}
     * @prop {typeof Error} NullArgumentError
     * @prop {typeof Error} HeaderConflictError
     * @prop {typeof Error} FetchUnregisteredContentError
     * @prop {typeof Error} NotCreatedByTemplateError
     * @prop {typeof Error} ContentNotFoundError
     * @prop {typeof Error} NoItemModuleError
     * @prop {typeof Error} NoLiquidModuleError
     * @prop {typeof Error} NoPowerModuleError
     * @prop {typeof Error} RecipeDictionaryUninitializedError
     * @prop {typeof Error} RecipeDictionaryCustomFieldNotFoundError
     * @prop {typeof Error} DialogFlowDataStructureError
     */
    globalize({}, "LCError");




    registerNewError("NullArgumentError");
    registerNewError("HeaderConflictError");
    registerNewError("FetchUnregisteredContentError");
    registerNewError("NotCreatedByTemplateError");
    registerNewError("ContentNotFoundError");
    registerNewError("NoItemModuleError");
    registerNewError("NoLiquidModuleError");
    registerNewError("NoPowerModuleError");
    registerNewError("RecipeDictionaryUninitializedError");
    registerNewError("RecipeDictionaryCustomFieldNotFoundError");
    registerNewError("DialogFlowDataStructureError");
