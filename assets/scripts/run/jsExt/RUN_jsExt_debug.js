/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * Methods for debugging.
     */


/*
  ========================================
  Section: Definition (Function)
  ========================================
*/


    /**
     * Variant of {@link print} called on a function.
     * @return {void}
     */
    Function.prototype.print = function() {
        print(this);
    };


/*
  ========================================
  Section: Definition (Array)
  ========================================
*/


    /**
     * Variant of {@link print} called on an array.
     * @return {void}
     */
    Array.prototype.print = function() {
        print(this);
    };


    /**
     * Multiline version of {@link Array#print}.
     * @return {void}
     */
    Array.prototype.printEach = function() {
        this.forEachFast(i => print(i), true);
    };


    /**
     * Variant of {@link Array#print} used for formatted arrays.
     * @param {number|unset} [ord]
     * @return {void}
     */
    Array.prototype.printFormat = function(ord) {
        this.forEachRow(tryVal(ord, 1), () => {
            print(Array.from(arguments));
        }, true);
    };
