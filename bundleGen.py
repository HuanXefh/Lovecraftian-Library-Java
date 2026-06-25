import pandas as PANDAS


BUNDLE_PATH_TEST = "H:\\Dropbox\\_gm_mdt\\lovec\\mabo-lovecraftian-library\\"
BUNDLE_PATH_LOVEC = "H:\\Dropbox\\_gm_mdt\\lovec\\mabo-lovecraftian-library\\assets\\bundles\\"
BUNDLE_PATH_LOVECLAB = "H:\\Dropbox\\_gm_mdt\\lovec\\mabo-lovecraftian-laboratory\\bundles\\"
BUNDLE_PATH_PROJREIND = "H:\\Dropbox\\_gm_mdt\\lovec\\mabo-project-reindustrialization\\bundles\\"
BUNDLE_PATH_SERP2 = "H:\\Dropbox\\_gm_mdt\\lovec\\mabo-serpulo-squared\\bundles\\"
BUNDLE_PATH_FCELL = "H:\\Dropbox\\_gm_mdt\\lovec\\mabo-fluid-cells\\bundles\\"
BUNDLE_FILE_NAME = "lovec-bundle-gen.xlsx"
LANG_SUFFIX_DICT = {
    "EN": "",
    "CN": "_zh_CN",
    "CN-TW": "_zh_TW",
    "JP": "_ja",
    "KO": "_ko",
}


def build(nmMod="lovec", dirTg=BUNDLE_PATH_TEST, lang="EN"):
    path = dirTg + "bundle" + LANG_SUFFIX_DICT[lang] + ".properties"
    fi = open(path, mode="w", encoding="utf-8")
    data = PANDAS.read_excel(BUNDLE_FILE_NAME, sheet_name=nmMod)
    fi.write(data["Output [" + lang + "]"].str.cat())
    fi.close()


build("lovec", BUNDLE_PATH_LOVEC, "EN")
build("lovec", BUNDLE_PATH_LOVEC, "CN")
build("loveclab", BUNDLE_PATH_LOVECLAB, "EN")
build("loveclab", BUNDLE_PATH_LOVECLAB, "CN")
build("projreind", BUNDLE_PATH_PROJREIND, "EN")
build("projreind", BUNDLE_PATH_PROJREIND, "CN")
build("serp2", BUNDLE_PATH_SERP2, "EN")
build("serp2", BUNDLE_PATH_SERP2, "CN")
build("fcell", BUNDLE_PATH_FCELL, "EN")
build("fcell", BUNDLE_PATH_FCELL, "CN")
