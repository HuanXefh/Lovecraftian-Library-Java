/** arc.files.Fi */
declare class Fi {
    path(): string
    absolutePath(): string
    pathWithoutExtension(): string
    name(): string
    extension(): string
    nameWithoutExtension(): string
    extEquals(): boolean
    file(): java.io.File
    length(): number
    lastModified(): number

    isDirectory(): boolean
    exists(): boolean

    child(name: string): Fi
    sibling(name: string): Fi
    parent(): Fi

    readBytes(): Array<java.lang.Byte>
    readString(charset?: string): string
    writeBytes(bytes: Array<java.lang.Byte>, append?: boolean): void
    writeString(str: string, append?: boolean, charset?: string): void
    writePng(pix: Pixmap): void
    copyTo(to: Fi): void
    copyFilesTo(to: Fi): void
    moveTo(to: Fi): void
    delete(): boolean
    deleteDirectory(): boolean
    emptyDirectory(preserveTree?: boolean): boolean

    walk(cons: Cons<Fi>): void
    findAll(boolF?: Boolf<Fi>): Seq<Fi>
    list(): Array<Fi>
    seq(): Seq<Fi>
}


/** arc.files.ZipFi */
declare class ZipFi extends Fi {}
