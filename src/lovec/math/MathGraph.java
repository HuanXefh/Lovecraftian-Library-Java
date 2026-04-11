package lovec.math;

import arc.func.Boolf2;
import arc.func.Cons2;
import arc.struct.*;
import arc.util.Log;
import arc.util.Nullable;

import java.util.Arrays;
import java.util.Iterator;
import java.util.NoSuchElementException;

public class MathGraph implements Iterable<Integer> {


    protected static final PQueue<Integer> pQueue = new PQueue<>();
    protected static final IntIntMap mergeVertMap = new IntIntMap();
    protected static final StringBuilder strBuilder = new StringBuilder();


    protected int vertices;
    protected final boolean isDirectional;
    protected Seq<Seq<MathGraphEdge>> adjSeq;
    protected Seq dataSeq;
    protected FloatSeq weightSeq;
    private @Nullable MathGraphIterator iterator;


    public String graphTag = "";
    public @Nullable Object graphData;


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


    public MathGraph(int vertices, Object data, float weight, boolean isDirectional) {
        this.vertices = vertices;
        this.adjSeq = new Seq(vertices);
        this.dataSeq = new Seq(vertices);
        this.weightSeq = new FloatSeq(vertices);
        for(int i = 0; i < vertices; i++) {
            this.adjSeq.add(new Seq<MathGraphEdge>());
            this.dataSeq.add(data);
            this.weightSeq.add(weight);
        };
        this.isDirectional = isDirectional;
    };
    // Overloading
    public MathGraph(int vertices, Object data, float weight) {
        this(vertices, data, weight, false);
    };
    public MathGraph(int vertices, Object data, boolean isDirectional) {
        this(vertices, data, 0, isDirectional);
    };
    public MathGraph(int vertices, Object data) {
        this(vertices, data, 0);
    };
    public MathGraph(boolean isDirectional) {
        this.vertices = 0;
        this.adjSeq = new Seq(0);
        this.dataSeq = new Seq(0);
        this.weightSeq = new FloatSeq(0);
        this.isDirectional = isDirectional;
    };
    public MathGraph() {
        this(false);
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


    /**
     * Gets data of a vertex.
     */
    public Object getData(int vert) throws IllegalArgumentException {
        if(vert >= vertices) throw new IllegalArgumentException("Vertex not used: " + vert);
        return dataSeq.get(vert);
    };


    /**
     * Gets a vertex by data.
     */
    public int getVertByData(Object data) {
        if(data == null) return -1;
        return dataSeq.indexOf(data);
    };


    /**
     * Gets weight of a vertex.
     */
    public float getWeight(int vert) throws IllegalArgumentException {
        if(vert >= vertices) throw new IllegalArgumentException("Vertex not used: " + vert);
        return weightSeq.get(vert);
    };


    /* <-------------------- condition --------------------> */


    /**
     * Whether an edge exists in this graph.
     */
    public boolean hasEdge(int vert_f, int vert_t) throws IllegalArgumentException {
        if(vert_f >= vertices) throw new IllegalArgumentException("Vertex not used: " + vert_f);
        if(vert_t >= vertices) throw new IllegalArgumentException("Vertex not used: " + vert_t);
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
     * Returns vertex of the target found using {@code filter}, -1 if no target found.
     */
    public int applyDFS(int vert, Boolf2 filter) {
        boolean[] visited = new boolean[vertices];
        int[] result = {-1};
        stepDFS(vert, visited, result, filter);
        return result[0];
    };


    /**
     * Performs Breadth-First Search on this graph.
     * Returns vertex of the target found using {@code filter}, -1 if no target found.
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


    /**
     * Performs Dijkstra algorithm on this graph to calculate distances from `vert` to other vertices.
     * The actual distance is edge distance minus start node weight.
     */
    public float[] applyDijkstra(int vert, float[] dsts) {
        pQueue.clear();
        Arrays.fill(dsts, Float.MAX_VALUE);

        dsts[vert] = 0f;
        pQueue.add(vert);
        while(!pQueue.empty()) {
            int vertCur = pQueue.poll();
            for(MathGraphEdge edge : adjSeq.get(vertCur)) {
                int overt = edge.vert_t;
                float weight = getWeight(overt);
                if(dsts[vertCur] < dsts[overt] - weight) {
                    dsts[overt] = dsts[vertCur] + edge.dst + weight;
                    pQueue.add(overt);
                };
            };
        };

        return dsts;
    };
    // Overloading
    public float[] applyDijkstra(int vert) {
        return applyDijkstra(vert, new float[vertices]);
    };


    /**
     * Performs Dijkstra algorithm on this graph to find the shortest path between `vert_f` and `vert_t`.
     * Returns the path as an integer seq, empty if no path found.
     */
    public IntSeq applyDijkstra(int vert_f, int vert_t, IntSeq pathSeq) {
        pQueue.clear();
        pathSeq.clear();
        var dsts = new float[vertices];
        Arrays.fill(dsts, Float.MAX_VALUE);
        var prev = new int[vertices];
        Arrays.fill(prev, -1);
        var visited = new boolean[vertices];

        dsts[vert_f] = 0f;
        pQueue.add(vert_f);
        while(!pQueue.empty()) {
            int vertCur = pQueue.poll();
            if(visited[vertCur]) continue;
            visited[vertCur] = true;
            if(vertCur == vert_t) break;

            for(MathGraphEdge edge : adjSeq.get(vertCur)) {
                int overt = edge.vert_t;
                float weight = getWeight(overt);
                if(!visited[overt] && dsts[vertCur] < dsts[overt] - weight) {
                    dsts[overt] = dsts[vertCur] + edge.dst + weight;
                    prev[overt] = vertCur;
                    pQueue.add(overt);
                };
            };
        };

        int vertCur = vert_t;
        while(vertCur != -1) {
            pathSeq.add(vertCur);
            vertCur = prev[vertCur];
        };
        pathSeq.reverse();
        if(!pathSeq.isEmpty() && pathSeq.first() != vert_f) {
            pathSeq.clear();
        };

        return pathSeq;
    };
    // Overloading
    public IntSeq applyDijkstra(int vert_f, int vert_t) {
        return applyDijkstra(vert_f, vert_t, new IntSeq());
    };


    /* <-------------------- modification --------------------> */


    /**
     * Sets data of a vertex.
     */
    public MathGraph setData(int vert, Object data) throws IllegalArgumentException {
        if(vert >= vertices) throw new IllegalArgumentException("Vertex not used: " + vert);
        dataSeq.set(vert, data);
        return this;
    };


    /**
     * Sets weight of a vertex.
     */
    public MathGraph setWeight(int vert, float weight) throws IllegalArgumentException {
        if(vert >= vertices) throw new IllegalArgumentException("Vertex not used: " + vert);
        weightSeq.set(vert, weight);
        return this;
    };


    /**
     * Adds a new vertex to the graph.
     */
    public MathGraph addVert(Object data, float weight) {
        if(hasData(data)) {
            Log.warn("[LOVEC] Data already in this graph:\n" + data);
            return this;
        };
        vertices++;
        adjSeq.add(new Seq<MathGraphEdge>());
        dataSeq.add(data);
        weightSeq.add(weight);
        return this;
    };
    // Overloading
    public MathGraph addVert(Object data) {
        return addVert(data, 0f);
    };


    /**
     * Adds a new vertex that is linked by/to some vertices.
     */
    public MathGraph appendVert(int[] overts, Object data, float weight, float dst, boolean revDir) throws IllegalArgumentException {
        addVert(data, weight);
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
    public MathGraph appendVert(int[] overts, Object data, float weight, float dst) {
        return appendVert(overts, data, weight, dst, false);
    };
    public MathGraph appendVert(int[] overts, Object data, boolean revDir) {
        return appendVert(overts, data, 0f, 1f, revDir);
    };
    public MathGraph appendVert(int[] overts, Object data) {
        return appendVert(overts, data, 0f, 1f);
    };
    public MathGraph appendVert(int overt, Object data, float weight, float dst, boolean revDir) {
        return appendVert(new int[]{overt}, data, weight, dst, revDir);
    };
    public MathGraph appendVert(int overt, Object data, float weight, float dst) {
        return appendVert(overt, data, weight, dst, false);
    };
    public MathGraph appendVert(int overt, Object data, boolean revDir) {
        return appendVert(overt, data, 0f, 1f, revDir);
    };
    public MathGraph appendVert(int overt, Object data) {
        return appendVert(overt, data, 0f, 1f);
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
        // Set up migration map
        for(int i = 0; i < graph.vertices; i++) {
            int overt = i;
            int vertMerge = applyBFS(0, (data, vert) -> equalCheck.get(data, graph.getData(overt)));
            // If no matching vertex found, add a new one to current graph
            if(vertMerge == -1) {
                addVert(graph.getData(overt), graph.getWeight(overt));
                vertMerge = vertices - 1;
            };
            mergeVertMap.put(overt, vertMerge);
        };
        // Set up edges
        for(int i = 0; i < graph.vertices; i++) {
            for(MathGraphEdge edge : graph.adjSeq.get(i)) {
                addEdge(mergeVertMap.get(edge.vert_f), mergeVertMap.get(edge.vert_t), edge.dst);
            };
        };
        if(graphTag.isEmpty() && !graph.graphTag.isEmpty()) {
            graphTag = graph.graphTag;
        };
        if(graphData == null && graph.graphData != null) {
            graphData = graph.graphData;
        };
        return this;
    };
    // Overloading
    public MathGraph merge(MathGraph graph) {
        return merge(graph, Object::equals);
    };


    /**
     * Removes unnecessary vertices.
     */
    public MathGraph shrink(Boolf2<Object, Integer> filter) {
        mergeVertMap.clear();
        // Set up migration map
        for(int i = 0, j = 0; i < vertices; i++) {
            if(filter.get(getData(i), i)) {
                mergeVertMap.put(j, i);
                j++;
            };
        };
        if(mergeVertMap.size == vertices) return this;

        var graph = new MathGraph(isDirectional);
        // Set up vertices
        for(int i = 0; i < mergeVertMap.size; i++) {
            graph.addVert(getData(mergeVertMap.get(i)), getWeight(mergeVertMap.get(i)));
        };
        // Set up edges
        for(int i = 0; i < mergeVertMap.size; i++) {
            for(MathGraphEdge edge : adjSeq.get(mergeVertMap.get(i))) {
                if(mergeVertMap.containsKey(edge.vert_f) && mergeVertMap.containsKey(edge.vert_t)) {
                    graph.addEdge(mergeVertMap.findKey(edge.vert_f, 0), mergeVertMap.findKey(edge.vert_t, 0), edge.dst);
                };
            };
        };
        vertices = graph.vertices;
        adjSeq = graph.adjSeq;
        dataSeq = graph.dataSeq;
        weightSeq = graph.weightSeq;
        return this;
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


    /* <-------------------- iterator --------------------> */


    @Override
    public Iterator<Integer> iterator() {
        if(iterator == null) iterator = new MathGraphIterator();
        return iterator;
    };


    private class MathGraphIterator implements Iterator<Integer> {


        int ind;
        boolean done = true;


        @Override
        public boolean hasNext() {
            if(ind >= vertices) done = true;
            return ind < vertices;
        };


        @Override
        public Integer next() {
            if(ind >= vertices) throw new NoSuchElementException(String.valueOf(ind));
            return ind++;
        };


    };


};
