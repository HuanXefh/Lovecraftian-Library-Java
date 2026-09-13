declare namespace java {
    namespace io {
        /** java.io.Serializable */
        interface Serializable {}
        /** java.io.AutoCloseable */
        interface AutoCloseable {}
        /** java.io.Closeable */
        interface Closeable extends AutoCloseable {}
        /** java.io.Appendable */
        interface Appendable {}
        /** java.io.Flushable */
        interface Flushable {}


        /** java.io.File */
        class File implements Serializable, java.lang.Comparable<File> {}


        /** java.io.Writer */
        class Writer implements Appendable, Closeable, Flushable {}
        /** java.io.Readable */
        interface Readable {}
        /** java.io.Reader */
        class Reader implements Readable, Closeable {}


        /** java.io.DataOutput */
        interface DataOutput {}
        /** java.io.DataInput */
        interface DataInput {}


        /** java.io.InputStream */
        class InputStream implements Closeable {}
        /** java.io.FilterInputStream */
        class FilterInputStream extends InputStream {}
        /** java.io.DataInputStream */
        class DataInputStream extends FilterInputStream implements DataInput {}
        /** java.io.OutputStream */
        class OutputStream implements Closeable, Flushable {}
        /** java.io.FilterOutputStream */
        class FilterOutputStream extends OutputStream {}
        /** java.io.DataOutputStream */
        class DataOutputStream extends FilterOutputStream implements DataOutput {}
    }
}
