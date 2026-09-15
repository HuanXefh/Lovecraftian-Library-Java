declare namespace tmi {
    /** tmi.RecipeEntry */
    interface RecipeEntry {}




    namespace recipe {
        /** tmi.recipe.Recipe */
        class Recipe {}
        /** tmi.recipe.RecipesManager */
        class RecipesManager {}
        /** tmi.recipe.RecipeType */
        class RecipeType {
            static factory: RecipeType;
            static building: RecipeType;
            static collecting: RecipeType;
            static generator: RecipeType;
            static ammo: RecipeType;
        }
        /** tmi.recipe.RecipeItemManager */
        class RecipeItemManager {}
        /** tmi.recipe.RecipeItemGroup */
        class RecipeItemGroup {}
        /** tmi.recipe.RecipeItemStack */
        class RecipeItemStack<T> {}


        /** tmi.recipe.AmountFormatter */
        interface AmountFormatter {}


        /** tmi.recipe.RecipeParser */
        class RecipeParser<T> {}




        namespace types {
            /** tmi.recipe.types.RecipeItem */
            class RecipeItem {}
            /** tmi.recipe.types.RecipeItemType */
            class RecipeItemType {
                static NORMAL: RecipeItemType;
                static ISOLATED: RecipeItemType;
                static POWER: RecipeItemType;
                static AMMO: RecipeItemType;
                static SPECIAL: RecipeItemType;
                static ATTRIBUTE: RecipeItemType;
                static BOOSTER: RecipeItemType;
                static SIDEPRODUCT: RecipeItemType;
                static PROBABILITY: RecipeItemType;
                static GARBAGE: RecipeItemType;
            }


            /** tmi.recipe.types.SingleItemMark */
            class SingleItemMark {}
            /** tmi.recipe.types.PowerMark */
            class PowerMark extends SingleItemMark {
                static INSTANCE: PowerMark;
            }
            /** tmi.recipe.types.HeatMark */
            class HeatMark extends SingleItemMark {
                static INSTANCE: HeatMark;
            }


            /** tmi.recipe.types.FactoryRecipe */
            class FactoryRecipe extends RecipeType {}
            /** tmi.recipe.types.BuildingRecipe */
            class BuildingRecipe extends RecipeType {}
            /** tmi.recipe.types.CollectingRecipe */
            class CollectingRecipe extends RecipeType {}
            /** tmi.recipe.types.GeneratorRecipe */
            class GeneratorRecipe extends RecipeType {}
            /** tmi.recipe.types.AmmoRecipe */
            class AmmoRecipe extends RecipeType {}
        }




        namespace parser {
            /** tmi.recipe.parser.BuildingParser */
            class BuildingParser extends RecipeParser<Block> {}
            /** tmi.recipe.parser.ConsumeParser */
            class ConsumeParser extends RecipeParser<Block> {}
        }
    }
}
