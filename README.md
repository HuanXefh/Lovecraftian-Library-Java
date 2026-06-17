# Lovecraftian Library

A **JavaScript** library mostly for my other mods, containing utility methods and all the content templates. The library does not add any new contents.

Library features:

- Method extension for convenience in JS modding.

- JS-based class structure and methods.

- Extensible content templates for adding contents, which also supports JSON/HJSON.

- Code for multi-crafter and more.

Lovec is based on my previous mod [Reindustrialization](https://github.com/HuanXefh/Reindustrialization), which has been archived and separated into several mods now. Also see [LovecLab](https://github.com/HuanXefh/Lovecraftian-Laboratory) and [ProjReind](https://github.com/HuanXefh/Project-Reindustrialization) where actual contents are created.

Mod forum on Discord: https://discord.com/channels/391020510269669376/1346118807734845440.

<br>

## How To Use Content Template In JSON/HJSON

First you should see [ProjReind](https://github.com/HuanXefh/Project-Reindustrialization) for examples on how to create contents with templates in JavaScript (like [CT_BLK_recipeFactory](https://github.com/HuanXefh/Project-Reindustrialization/blob/main/scripts/ct/CT_BLK_recipeFactory.js)).

As you can see there, when values of some fields should be changed, an parameter object is passed to `TEMPLATE.build` method. Data in that parameter object can be written in JSON/HJSON. For example, if you want to create a multi-crafter ([EXT_BLK_recipeFactory](https://github.com/HuanXefh/Lovecraftian-Library-Java/blob/master/assets/scripts/tempExt/blk/EXT_BLK_recipeFactory.js)):

```
template: EXT_BLK_recipeFactory

rcMdl: your-block
rcSourceMod: your-mod
```

The file should be named as "your-block.json" or "your-block.hjson" based on the format you have used. The JSON/HJSON file should be located in "scripts/auxFi/json/content" (sub-folder supported).

Note that the content template JSON file only calls JavaScript codes to create a content, **you still need to modify it with JSON file in "content" folder** like what JSON mods do. Since content template JSON creates content, **do not use `type` in regular JSON**.

Objects like color and effects are parsed differently in a template JSON, see [DB_parser](https://github.com/HuanXefh/Lovecraftian-Library-Java/blob/master/assets/scripts/db/DB_parser.js):

```
someColor1: {
  type: class.Color
  name: white
}

someColor2: {
  type: method.Hex
  name: "ffc999"
}

someEffect1: {
  type: class.Fx
  name: smeltsmoke
}

someEffect2: {
  type: module.TP_effect
  name: _flare
  param: {
    color: {
      type: class.Pal
      name: accent
    }
    scl: 2.0
  }
}
```

Normally you don't need to change values for fields in a building template ("B_xxx" instead of "BLK_xxx"), but if you do need on rare occasions, you can use `build: {}` in your template JSON and write data inside the object.

<br>

## For JavaScript modding learners

It's not a good start to learn modding by looking at codes here, since there are major changes in modding structure and common methods. For beginners, I personally recommend [Sapphirium](https://github.com/3Snake3/Sapphirium) and [More Defences](https://github.com/coaldeficit/MoreDefences).

A lot of methods in Lovec are defined globally (and used everywhere). See [globalScript.js](https://github.com/HuanXefh/Lovecraftian-Library-Java/blob/master/assets/scripts/globalScript.js), [glbScr](https://github.com/HuanXefh/Lovecraftian-Library-Java/tree/master/assets/scripts/run/glbScr) and [jsExt](https://github.com/HuanXefh/Lovecraftian-Library-Java/tree/master/assets/scripts/run/jsExt) for more info. If you do overcome the difficulties and have understood how things work here, you'll know the possibilities of JS modding finally.
