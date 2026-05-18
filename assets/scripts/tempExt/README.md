Unlike regular templates, any template defined under "lovec/scripts/tempExt" are made for other mods with most Lovec mechanics stripped off to fit in vanilla gameplay.

For example, if you're making a multi-crafter:

```js
const TEMPLATE = require("lovec/tempExt/blk/EXT_BLK_recipeFactory");

const yourCrafter = extendBlock(
  TEMPLATE, "your-crafter",
  TEMPLATE[0].build({
    rcMdl: "your-crafter",
    rcSourceMod: "your-mod",
  }),
);

// Remember to create recipe data file as "your-mod/scripts/auxFi/rc/your-mod-your-crafter.js"
```

See **LovecLab** or **ProjReind** for more examples on how to create contents with content templates!

If you'd like to see some external version of existing Lovec templates, feel free to submit an issue on GitHub.
