import pandas as PANDAS


BUNDLE_FILE_NAME = "lovec-bundle-gen.xlsx"
BUNDLE_PATH_DICT = {
    "lovec": "H:\\Dropbox\\_gm_mdt\\lovec\\mabo-lovecraftian-library\\assets\\bundles\\",
    "loveclab": "H:\\Dropbox\\_gm_mdt\\lovec\\mabo-lovecraftian-laboratory\\bundles\\",
    "projreind": "H:\\Dropbox\\_gm_mdt\\lovec\\mabo-project-reindustrialization\\bundles\\",
    "serp2": "H:\\Dropbox\\_gm_mdt\\lovec\\mabo-serpulo-squared\\bundles\\",
    "fcell": "H:\\Dropbox\\_gm_mdt\\lovec\\mabo-fluid-cells\\bundles\\",
}
BUNDLE_PATH_TEST = "H:\\Dropbox\\_gm_mdt\\lovec\\mabo-lovecraftian-library\\"
LANG_SUFFIX_DICT = {
    "EN": "",
    #"RU": "_ru",
    "CN": "_zh_CN",
    #"CN-TW": "_zh_TW",
    #"JP": "_ja",
    #"KO": "_ko",
}


def buildFile(nameMod="lovec", dirTg=BUNDLE_PATH_TEST, lang="EN"):
    path = dirTg + "bundle" + LANG_SUFFIX_DICT[lang] + ".properties"
    fi = open(path, mode="w", encoding="utf-8")
    data = PANDAS.read_excel(BUNDLE_FILE_NAME, sheet_name=nameMod)
    fi.write(data["Output [" + lang + "]"].str.cat())
    fi.close()


def build():
    for nameMod, dirTg in BUNDLE_PATH_DICT.items():
        for lang in LANG_SUFFIX_DICT:
            buildFile(nameMod, dirTg, lang)


build()
