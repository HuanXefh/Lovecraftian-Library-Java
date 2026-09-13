type ReactionParamObject = {
    pow?: number;
    dmg?: number;
    amt?: number;
    solvent?: string;
    puddleScl?: number;
}

type ReactionEntity = Building|Unit
type ReactionInvoker = (paramObj: ReactionParamObject, x: number, y: number, e: ReactionEntity|null, rs: Resource|null) => void
/** `TUPLE`: p, reacInvoker. */
type ReactionTuple = [number, ReactionInvoker]


type Reactant = string|Resource
