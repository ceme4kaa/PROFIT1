from django.conf import settings
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
        "site_base": getattr(settings, "SITE_BASE_PATH", ""),
        "tr": tr,
        "i18n_bundle": {
            "translations": TRANSLATIONS,
            "htmlLang": HTML_LANG,
            "ogLocale": OG_LOCALE,
            "current": lang,
        },
    }
    return render(request, "main/index.html", context)