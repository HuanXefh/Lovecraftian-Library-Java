declare namespace java {
    namespace nio {
        /** java.nio.Buffer */
        class Buffer {}
        /** java.nio.CharBuffer */
        class CharBuffer extends Buffer implements java.lang.Comparable<CharBuffer>, java.io.Appendable, java.lang.CharSequence, java.lang.Readable {}
        interface CharBuffer extends java.lang.Comparable<CharBuffer>, java.io.Appendable, java.lang.CharSequence, java.lang.Readable {}




        namespace charset {
            /** java.nio.charset.Charset */
            class Charset implements java.lang.Comparable<Charset> {}
            interface Charset extends java.lang.Comparable<Charset> {}
        }
    }
}
