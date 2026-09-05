# Custom Tags

This lib uses some custom JSDoc tags for documentation.

| Tag                | Target   | Description                                                                 | Value                                                    |
|--------------------|----------|-----------------------------------------------------------------------------|----------------------------------------------------------|
| `@lovecRow`        | Array    | This array is a formatted array.                                            | `type` - fieldName <br> `type` - fieldName - description |
| `@lovecOrderless`  | Array    | This formatted array can be read orderlessly.                               |                                                          |
| `@lovecContentGen` | Array    | For DB array. Elements are pushed automatically.                            |                                                          |
| `@lovecAutoRecipe` | Array    | For recipe generation raw data. Recipes here can be automatically selected. |                                                          |
| `@lovecExtensible` | Object   | For DB object. New arrays can be registered with {@link LCModDBRegister}.   | {@link targetArray}                                      |
| `@lovecPropGen`    | Function | This method generates new properties for this instance.                     | {@link targetClass}                                      |
| `@lovecBundle`     | -        | Bundle entry related to this field or method.                               | `bundleEntry`                                            |

Apart from JSDoc tags, there are comment tags to describe fields and methods in more detail.

| Tag          | Target   | Description                                                                   | Value                         |
|--------------|----------|-------------------------------------------------------------------------------|-------------------------------|
| `VALS`       | Field    | Possible values for this field.                                               | value1, value2, value3, ...   |
| `TUPLE`      | Array    | Describes elements in a tuple.                                                | name                          |
| `ARGS`       | Function | Arguments that this method accepts. Multiple tags imply an overloaded method. | argName <br> `type` - argName |
| `IMPORTANT`  | -        | Important things about the code.                                              | text                          |
| `DEDICATION` | -        | Code is inspired by other's work.                                             | text                          |
| `REFERENCE`  | -        | Knowledge or algorithm involved.                                              | text                          |
| `TABLE`      | -        | Marks code for building a table.                                              | tableName                     |
