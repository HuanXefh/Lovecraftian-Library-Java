# Custom Tags

This lib uses some custom JSDoc tags for documentation.

| Tag                   | Target          | Description                                                                              | Value               |
|-----------------------|-----------------|------------------------------------------------------------------------------------------|---------------------|
| `@lovecOrderless`     | Array           | This formatted array can be read orderlessly.                                            |                     |
| `@lovecContentGen`    | Array           | For DB array. Elements are pushed automatically.                                         |                     |
| `@lovecAutoRecipe`    | Array           | For recipe generation raw data. Recipes here can be automatically selected.              |                     |
| `@lovecExtensible`    | Object          | For DB object. New arrays can be registered with {@link LCModDBRegister}.                | {@link targetArray} |
| `@lovecTryBlock`      | Function        | This method includes a try-catch block and should not be called in main loops.           |                     |
| `@lovecPropGen`       | Function        | This method generates new properties for this instance.                                  | {@link targetClass} |
| `@lovecAttached`      | Function        | This method does not exist on the orginal class, and is usually added with Java adapter. |                     |
| `@lovecTypeSensitive` | Function        | This method should not accept unwrapped Java types.                                      |                     |

Apart from JSDoc tags, there are comment tags to describe fields and methods in more detail.

| Tag          | Target          | Description                                                                   | Value                         |
|--------------|-----------------|-------------------------------------------------------------------------------|-------------------------------|
| `PARAM`      | Field           | This field is a parameter.                                                    | description                   |
| `INTERNAL`   | Field           | This field is an internal parameter.                                          | description                   |
| `ALIAS`      | Field           | This field is an alias of another field.                                      | realField                     |
| `VALS`       | Field           | Possible values for this field.                                               | value1, value2, value3, ...   |
| `TUPLE`      | Array           | Describes elements in a tuple.                                                | name                          |
| `ROW`        | Array           | Describes row elements in a formatted array.                                  | name1, name2, name3, ...      |
| `ARGS`       | Function        | Arguments that this method accepts. Multiple tags imply an overloaded method. | argName <br> `type` - argName |
| `LATER`      | Function        | This method is expected to be overrided later.                                |                               |
| `NAMEGEN`    | ContentTemplate | Contents created with this template may have generated names.                 |                               |
| `SINGLESIZE` | ContentTemplate | Blocks created with this template should have `size: 1`.                      |                               |
| `REALIZED`   | -               | Used when this field or method overrides previous value.                      | description                   |
| `BUNDLE`     | -               | Bundle entry related to this field or method.                                 | `bundleEntry`                 |
| `FILE`       | -               | File path related to this field or method.                                    | `filePath`                    |
| `DB`         | -               | DB JSON file related to this field or method.                                 | `fileName`                    |
| `IMPORTANT`  | -               | Important things about the code.                                              | text                          |
| `DEDICATION` | -               | Code is inspired by other's work.                                             | text                          |
| `REFERENCE`  | -               | Knowledge or algorithm involved.                                              | text                          |
| `TABLE`      | -               | Marks code for building a table.                                              | tableName                     |
