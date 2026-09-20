declare namespace java {
    namespace io {
        /** java.io.Serializable */
        interface Serializable {}
        /** java.io.AutoCloseable */
        interface AutoCloseable {
            close(): void
        }
        /** java.io.Closeable */
        interface Closeable extends AutoCloseable {}
        /** java.io.Appendable */
        interface Appendable {
            append(l: java.lang.Character): this
            append(charSequence: java.lang.CharSequence): this
            append(charSequence: java.lang.CharSequence, start: number, end: number): this
        }
        /** java.io.Flushable */
        interface Flushable {
            flush(): void
        }


        /** java.io.File */
        class File implements Serializable, java.lang.Comparable<File> {}
        interface File extends Serializable, java.lang.Comparable<File> {}


        /** java.io.Writer */
        class Writer implements Appendable, Closeable, Flushable {}
        interface Writer extends Appendable, Closeable, Flushable {}
        /** java.io.Reader */
        class Reader implements java.lang.Readable, Closeable {}
        interface Reader extends java.lang.Readable, Closeable {}


        /** java.io.DataOutput */
        interface DataOutput {}
        /** java.io.DataInput */
        interface DataInput {}


        /** java.io.InputStream */
        class InputStream implements Closeable {}
        interface InputStream extends Closeable {}
        /** java.io.FilterInputStream */
        class FilterInputStream extends InputStream {}
        /** java.io.DataInputStream */
        class DataInputStream extends FilterInputStream implements DataInput {}
        interface DataInputStream extends InputStream {}
        /** java.io.OutputStream */
        class OutputStream implements Closeable, Flushable {}
        interface OutputStream extends Closeable, Flushable {}
        /** java.io.FilterOutputStream */
        class FilterOutputStream extends OutputStream {}
        /** java.io.DataOutputStream */
        class DataOutputStream extends FilterOutputStream implements DataOutput {}
        interface DataOutputStream extends DataOutput {}
    }
}
