from django.shortcuts import render

from .i18n import LANG_SWITCH, OG_LOCALE, HTML_LANG, TRANSLATIONS, normalize_lang


def index(request, lang: str | None = None):
    lang = normalize_lang(lang)
    tr = TRANSLATIONS[lang]

    context = {
        "lang": lang,
        "html_lang": HTML_LANG.get(lang, lang),
        "og_locale": OG_LOCALE.get(lang, "ru_RU"),
        "lang_switch": LANG_SWITCH,
        "tr": tr,
    }
    return render(request, "main/index.html", context)