# Custom Tags

This lib uses some custom JSDoc tags for documentation.

| Tag             | Target   | Description                                             | Value                |
|-----------------|----------|---------------------------------------------------------|----------------------|
| `@lovecRow`     | Array    | This array is a formatted array.                        | `type` - fieldName   |
| `@lovecPropgen` | Function | This method generates new properties for this instance. | {@link targetClass } |

Apart from JSDoc tags, there are comment tags to describe fields and methods in more detail.

| Tag          | Target   | Description                                                                   | Value                         |
|--------------|----------|-------------------------------------------------------------------------------|-------------------------------|
| `ARGS`       | Function | Arguments that this method accepts. Multiple tags imply an overloaded method. | argName <br> `type` - argName |
| `IMPORTANT`  | -        | Important things about the code.                                              | text                          |
| `DEDICATION` | -        | Code is inspired by other's work.                                             | text                          |
| `REFERENCE`  | -        | Knowledge or algorithm involved.                                              | text                          |
| `TABLE`      | -        | Marks code for building a table.                                              | tableName                     |
