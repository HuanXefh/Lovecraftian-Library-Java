type InterfaceObject = {
    __protoF__?: F0Function<Object>;
}


type UnitStatDrawF = (
    e: Building|Unit,
    x: number,
    y: number,
    frac: number,
    color: Color,
    a: number,
    w: number,
    offY: number,
    amtSeg: number,
    armor: number|null,
    shield: number|null,
    speedMtp: number|null,
    dpsMtp: number|null,
    z: number|null,
) => void
