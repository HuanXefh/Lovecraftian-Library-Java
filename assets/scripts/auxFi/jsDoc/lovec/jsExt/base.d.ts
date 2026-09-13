interface ObjectConstructor {
    setProp<T, K>(obj: T, propObj: K): T&K
    setProps<T>(obj: T, isFinal: boolean, ...args: Array<Object>): T
    clear<T>(obj: T): T
}
interface Object {
    setProp<T>(propObj: T): this&T
    setProps(isFinal: boolean, ...args: Array<Object>): this
}


interface Number {
    last(): number
    next(): number
}


interface String {
    iCap(): number
}


interface Array<T> {
    iCap(): number
    clear(): this
    cpy(): Array<T>
    cpy(arr: Array<T>): this
    deepCpy(): Array<T>
}
