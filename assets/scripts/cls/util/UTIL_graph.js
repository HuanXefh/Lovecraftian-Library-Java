/*
  ========================================
  Section: Definition
  ========================================
*/


    /**
     * Utility class for handling {@link MathGraph}.
     * @class
     */
    const UTIL_graph = newClass().initClass();


    /** @type {Array<MathGraph>} */
    const updateQueue = [];
    /** @type {ObjectMap<string, CFunction<MathGraph>>} */
    const typeInitMap = new ObjectMap();
    /** @type {ObjectMap<string, CFunction<MathGraph>>} */
    const typeUpdateMap = new ObjectMap();


    (function() {
        let i, iCap, graph;
        MDL_event.onUpdate(() => {
            if(Vars.state.isPaused()) return;

            i = 0;
            iCap = updateQueue.iCap();
            while(i < iCap) {
                graph = updateQueue[i];
                if(graph.graphData == null) {
                    graph.graphData = {
                        justShrunk: false,
                    };
                    typeInitMap.get(graph.graphTag, Function.air)(graph);
                };
                typeUpdateMap.get(graph.graphTag, Function.air)(graph);
                i++;
            };
            updateQueue.clear();
        });
    })();


/*
  ========================================
  Section: Definition (Static)
  ========================================
*/


    /**
     * Adds a graph to the update queue.
     * @param {MathGraph|null} graph
     * @return {void}
     */
    UTIL_graph.queueUpdate = function(graph) {
        if(Vars.state.isPaused() || graph == null) return;
        updateQueue.pushUnique(graph);
    };


    /**
     * Sets init method of a graph type. See {@link INTF_BLK_graphBlock}.
     * @param {string} graphType
     * @param {CFunction<MathGraph>} scr
     * @return {void}
     */
    UTIL_graph.setInit = function(graphType, scr) {
        typeInitMap.put(graphType, scr);
    };


    /**
     * Sets update method of a graph type. See {@link INTF_BLK_graphBlock}.
     * @param {string} graphType
     * @param {CFunction<MathGraph>} scr
     * @return {void}
     */
    UTIL_graph.setUpdate = function(graphType, scr) {
        typeUpdateMap.put(graphType, scr);
    };


/*
  ========================================
  Section: Definition (Instance)
  ========================================
*/




module.exports = UTIL_graph;
