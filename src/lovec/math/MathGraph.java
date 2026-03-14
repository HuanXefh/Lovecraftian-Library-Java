package lovec.math;

import arc.func.Boolf2;
import arc.func.Cons2;
import arc.struct.IntIntMap;
import arc.struct.IntQueue;
import arc.struct.Seq;
import arc.util.Log;

public class MathGraph {


    protected static final IntIntMap mergeVertMap = new IntIntMap();
    protected static final StringBuilder strBuilder = new StringBuilder();


    protected int vertices;
    protected final boolean isDirectional;
    protected Seq<Seq<MathGraphEdge>> adjSeq;
    protected Seq dataSeq;


    public static class MathGraphEdge {
        protected int vert_f;
        protected int vert_t;
        protected float dst;

        public MathGraphEdge(int vert_f, int vert_t, float dst) {
            this.vert_f = vert_f;
            this.vert_t = vert_t;
            this.dst = dst;
        };
        // Overloading
        public MathGraphEdge(int vert_f, int vert_t) {
            this(vert_f, vert_t, 1f);
        };
    };


    public MathGraph(int vertices, Object data, boolean isDirectional) {
        this.vertices = vertices;
        this.adjSeq = new Seq(vertices);
        this.dataSeq = new Seq(vertices);
        for(int i = 0; i < vertices; i++) {
            this.adjSeq.add(new Seq<MathGraphEdge>());
            this.dataSeq.add(data);
        };
        this.isDirectional = isDirectional;
    };
    // Overloading
    public MathGraph(int vertices, Object data) {
        this(vertices, data, false);
    };


    /*
      ========================================
      Section: Definition (Static)
      ========================================
    */


    /*
      ========================================
      Section: Definition (Instance)
      ========================================
    */


    /* <-------------------- property --------------------> */


    /**
     * Gets size of this graph.
     */
    public int getSize() {
        return vertices;
    };


    /**
     * Gets degree of a vertex.
     */
    public int getDegree(int vert) {
        return adjSeq.get(vert).size;
    };


    /* <-------------------- data --------------------> */


    /**
     * Gets data of a vertex.
     */
    public Object getData(int vert) throws IllegalArgumentException {
        if(vert >= vertices) throw new IllegalArgumentException("Vertex not used: " + vert);
        return dataSeq.get(vert);
    };


    /**
     * Sets data of a vertex.
     */
    public MathGraph setData(int vert, Object data) throws IllegalArgumentException {
        if(vert >= vertices) throw new IllegalArgumentException("Vertex not used: " + vert);
        dataSeq.set(vert, data);
        return this;
    };


    /**
     * Gets a vertex by data.
     */
    public int getVertByData(Object data) {
        if(data == null) return -1;
        return dataSeq.indexOf(data);
    };


    /* <-------------------- condition --------------------> */


    /**
     * Whether an edge exists in this graph.
     */
    public boolean hasEdge(int vert_f, int vert_t) {
        if(vert_f == vert_t) return true;
        for(MathGraphEdge edge : adjSeq.get(vert_f)) {
            if(edge.vert_t == vert_t) return true;
        };
        return false;
    };


    /**
     * Whether some data exists in this graph.
     */
    public boolean hasData(Object data) {
        return dataSeq.contains(data);
    };


    /* <-------------------- iteration --------------------> */


    /**
     * Iterates through all vertices in this graph.
     */
    public void each(Boolf2<Object, Integer> filter, Cons2<Object, Integer> cons2) {
        for(int i = 0; i < vertices; i++) {
            if(filter.get(getData(i), i)) {
                cons2.get(getData(i), i);
            };
        };
    };
    // Overloading
    public void each(Cons2<Object, Integer> cons2) {
        each((data, vert) -> true, cons2);
    };


    private void stepDFS(int vert, boolean[] visited, int[] result, Boolf2<Object, Integer> filter) {
        if(result[0] != -1) return;
        visited[vert] = true;
        if(filter.get(getData(vert), vert)) {
            result[0] = vert;
        };
        for(MathGraphEdge edge : adjSeq.get(vert)) {
            int overt = edge.vert_t;
            if(!visited[overt]) {
                stepDFS(overt, visited, result, filter);
            };
        };
    };


    /**
     * Performs Depth-First Search on this graph.
     * Returns vertex of the target found with `filter`, -1 if no target found.
     */
    public int applyDFS(int vert, Boolf2 filter) {
        boolean[] visited = new boolean[vertices];
        int[] result = {-1};
        stepDFS(vert, visited, result, filter);
        return result[0];
    };


    /**
     * Performs Breadth-First Search on this graph.
     * Returns vertex of the target found with `filter`, -1 if no target found.
     */
    public int applyBFS(int vert, Boolf2 filter) {
        boolean[] visited = new boolean[vertices];
        IntQueue queue = new IntQueue();
        int[] result = {-1};

        visited[vert] = true;
        if(filter.get(getData(vert), vert)) {
            result[0] = vert;
        };
        queue.addLast(vert);
        while(!queue.isEmpty() && result[0] == -1) {
            int vertCur = queue.removeFirst();
            for(MathGraphEdge edge : adjSeq.get(vertCur)) {
                int overt = edge.vert_t;
                if(!visited[overt]) {
                    visited[overt] = true;
                    queue.addLast(overt);
                    if(filter.get(getData(overt), overt)) {
                        result[0] = overt;
                    };
                };
            };
        };

        return result[0];
    };


    /* <-------------------- modification --------------------> */


    /**
     * Adds a new vertex to the graph.
     */
    public MathGraph addVert(Object data) {
        if(hasData(data)) {
            Log.warn("[LOVEC] Data already in this graph:\n" + data);
            return this;
        };
        vertices++;
        adjSeq.add(new Seq<MathGraphEdge>());
        dataSeq.add(data);
        return this;
    };


    /**
     * Adds a new vertex that is linked by/to some vertices.
     */
    public MathGraph appendVert(int[] overts, Object data, float dst, boolean revDir) throws IllegalArgumentException {
        addVert(data);
        int vert = vertices - 1;
        for(int overt : overts) {
            if(overt >= vertices) throw new IllegalArgumentException("Vertex not used: " + overt);
            if(revDir) {
                addEdge(vert, overt, dst);
            } else {
                addEdge(overt, vert, dst);
            };
        };
        return this;
    };
    // Overloading
    public MathGraph appendVert(int[] overts, Object data, float dst) {
        return appendVert(overts, data, dst, false);
    };
    public MathGraph appendVert(int[] overts, Object data, boolean revDir) {
        return appendVert(overts, data, 1f, revDir);
    };
    public MathGraph appendVert(int[] overts, Object data) {
        return appendVert(overts, data, 1f);
    };
    public MathGraph appendVert(int overt, Object data, float dst, boolean revDir) {
        return appendVert(new int[]{overt}, data, dst, revDir);
    };
    public MathGraph appendVert(int overt, Object data, float dst) {
        return appendVert(overt, data, dst, false);
    };
    public MathGraph appendVert(int overt, Object data, boolean revDir) {
        return appendVert(overt, data, 1f, revDir);
    };
    public MathGraph appendVert(int overt, Object data) {
        return appendVert(overt, data, 1f);
    };


    /**
     * Adds an edge to the graph.
     */
    public MathGraph addEdge(int vert_f, int vert_t, float dst) {
        if(hasEdge(vert_f, vert_t)) {
            return this;
        };
        adjSeq.get(vert_f).add(new MathGraphEdge(vert_f, vert_t, dst));
        if(!isDirectional) {
            adjSeq.get(vert_t).add(new MathGraphEdge(vert_t, vert_f, dst));
        };
        return this;
    };
    // Overloading
    public MathGraph addEdge(int vert_f, int vert_t) {
        return addEdge(vert_f, vert_t, 1f);
    };


    /**
     * Merge another graph into this graph.
     */
    public MathGraph merge(MathGraph graph, Boolf2 equalCheck) {
        mergeVertMap.clear();
        for(int i = 0; i < graph.vertices; i++) {
            int overt = i;
            int vertMerge = applyBFS(0, (data, vert) -> equalCheck.get(data, graph.getData(overt)));
            if(vertMerge == -1) {
                addVert(graph.getData(overt));
                vertMerge = vertices - 1;
            };
            mergeVertMap.put(overt, vertMerge);
        };
        for(int i = 0; i < graph.vertices; i++) {
            for(MathGraphEdge edge : graph.adjSeq.get(i)) {
                addEdge(mergeVertMap.get(edge.vert_f), mergeVertMap.get(edge.vert_t), edge.dst);
            };
        };
        return this;
    };
    // Overloading
    public MathGraph merge(MathGraph graph) {
        return merge(graph, Object::equals);
    };


    /* <-------------------- util --------------------> */


    @Override
    public String toString() {
        boolean anyVert = false, anyLinked = false;
        strBuilder.setLength(0);
        strBuilder.append("{");
        for(int i = 0; i < vertices; i++) {
            strBuilder.append(i).append(":").append("[");
            for(MathGraphEdge edge : adjSeq.get(i)) {
                strBuilder.append(edge.vert_t).append(",");
                anyLinked = true;
            };
            if(anyLinked) {
                strBuilder.deleteCharAt(strBuilder.length() - 1);
                anyLinked = false;
            };
            strBuilder.append("],");
            anyVert = true;
        };
        if(anyVert) {
            strBuilder.deleteCharAt(strBuilder.length() - 1);
        };
        strBuilder.append("}");
        return strBuilder.toString();
    };


};
