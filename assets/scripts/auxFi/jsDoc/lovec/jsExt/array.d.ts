interface ArrayConstructor {
    forEachPair<T, K>(arr1: Array<T>, arr2: Array<K>, scr: C2Function<T, K>, noWrap?: boolean): void

    someIncludes<T>(ele: T, ...arrs: Array<Array<T>>): boolean
    everyIncludes<T>(ele: T, ...arrs: Array<Array<T>>): boolean

    getIndexArray(cap: number, startsAtOne?: boolean): Array<number>

    newJavaArr(javaCls: Class<T>, cap?: number): JavaArray<T>
    newIntArr(cap?: number): JavaArray<java.lang.Integer>
    newByteArr(cap?: number): JavaArray<java.lang.Byte>
    newShortArr(cap?: number): JavaArray<java.lang.Short>
    newLongArr(cap?: number): JavaArray<java.lang.Long>
    newFArr(cap?: number): JavaArray<java.lang.Float>
    newDoubleArr(cap?: number): JavaArray<java.lang.Double>
    newBoolArr(cap?: number): JavaArray<java.lang.Boolean>
    newCharArr(cap?: number): JavaArray<java.lang.Character>
    newStrArr(cap?: number): JavaArray<java.lang.String>
    newObjArr(cap?: number): JavaArray<Object>
}
interface Array<T> {
    print(): void
    printEach(): void
    printFormat(ord: number): void

    forEachFast(scr: CFunction<T>, noWrap?: boolean): void
    forEachCond(boolF: FFunction<T, boolean>, scr: CFunction<T>, noWrap?: boolean): void
    forEachRow(ord: number, scr: (...args: Array<T>) => void, noWrap?: boolean): void
    forEachAll(scr: C3Function<Object, number, Array<Object>>, noWrap?: boolean): void

    first(): T|null
    last(): T|null
    lastIndex(): number
    calcIndexFrac(ele: T, useInd?: boolean): number

    includesAny(...eles: Array<T>): boolean
    includesAll(...eles: Array<T>): boolean
    arrayEquals<K>(arr: Array<T>, mapF?: FFunction<T, K>): boolean
    looseEquals(arr: Array<T>): boolean
    looseIncludes(arr: Array<T>): boolean
    colIncludes(ele: T, ord:number, off?: number): boolean
    subsetOf(arr: Array<T>): boolean

    setValue(val_fn:Dynamic<T>, len?: number): this
    pushUnique(ele: T): this
    pushNonNull(ele: T): this
    pushAll(eles_p: Plural<T>): this
    insert(ind: number, ele: T): number
    insertAll(ind: number, eles_p: Plural<T>): this
    with(...eles: Array<T>): this
    withAll(eles: Arguments): this
    remove(eles: T, mapF?: FFunction<T, T>): T|null
    removeAll(eles_p: Plural<T>): this
    removeAt(ind: number): T|null
    pull(ele: T): number
    pullAll(eles_p: Plural<T>): this
    compact(): this
    shiftAll(amt: number, resultOut?: Array<T>): Array<T>
    unshiftAll(eles_p: Plural<T>): this
    swap(ele1: T, ele2: T): this
    swapByIndex(ind1: number, ind2: number): this
    inSituMap(mapF: FFunction<T, T>): this
    inSituFilter(boolF: FFunction<T, boolean>): this
    numSort(rev?: boolean): this
    mixSort(): this
    shuffle(ord?: number): this

    count<K>(ele: T, mapF?: FFunction<T, K>, ord?: number, off?: number): number
    countBy(boolF: FFunction<T, boolean>, ord?: number, off?: number): number
    uniquify<K>(mapF?: FFunction<T, K>): Array<T>
    intersect<K>(arr: Array<T>, mapF?: FFunction<T, K>): Array<T>
    differ<K>(arr: Array<T>, mapF?: FFunction<T, K>): Array<T>
    chunk(ord: number, def?: T): Array<T>
    flatten(): Array<Object>

    random(ord?: number, off?: number): T|null
    sample(amt?: number): Array<T>
    toCountArray(ord?: number, off?: number): F2Array<T, number>
    categorize(categF: FFunction<T, string|null>): Record<string, T>

    read(keys_p: Plural<T>, def?: T, isUnordered?: boolean): T|null
    readList(keys_p: Plural<T>, isUnordered?: boolean): Array<T>
    readRowIndex(keys_p: Plural<T>, isUnordered?: boolean): number
    readCol(ord: number, off?: number): Array<T>
    write(keys_p: Plural<T>, val: T, isUnordered?: boolean): this
    removeRow(ord: number, rowInd: number): this

    sum(mapF?: FFunction<T, number>): number
    prod(mapF?: FFunction<T, number>): number
    mean(mapF?: FFunction<T, number>): number
    meanPow(pow: number): number
    operWith<K, R>(arr: Array<K>, fun: F2Function<T, K, R>): Array<R>
    addWith(arr: Array<number>): this
    subWith(arr: Array<number>): this
    mulWith(arr: Array<number>): this
    divWith(arr: Array<number>): this
    modWith(arr: Array<number>): this
    powWith(arr: Array<number>): this
    cumOper(fun: F2Function<number, T, number>): Array<number>
    cumSum(): Array<number>
    cumProd(): Array<number>
    diff(repeat?: number): Array<number>

    toJavaArr<K>(javaCls: Class<K>): JavaArray<K>
    toSeq(): Seq<T>
    toObjSet(): ObjectSet<T>
    toObjMap(): ObjectMap<Object>

    hasIns(ins: Object|null): boolean

    convol(contArr: Array<number>|unset, arr: Array<number>, mode?: ENumber): Array<number>
}
