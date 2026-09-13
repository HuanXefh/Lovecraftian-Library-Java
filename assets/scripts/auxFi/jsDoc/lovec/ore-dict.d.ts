type OreDictionaryConsumeSetter = (
    blk: Block,
    cons: Consume|null,
    oreDict: ObjectMap<Resource, Resource>,
) => void
type OreDictionaryProduceSetter = (
    blk: Block,
    oreDict: ObjectMap<Resource, Resource>,
) => void
