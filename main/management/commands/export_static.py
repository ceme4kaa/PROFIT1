import os
import shutil
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.test import Client, override_settings

ROUTES = (
    ("index.html", "/"),
    ("kk/index.html", "/kk/"),
    ("en/index.html", "/en/"),
    ("zh/index.html", "/zh/"),
    ("yandex_5b9223d505b81cda.html", "/yandex_5b9223d505b81cda.html"),
    ("google9873e2cf07eba082.html", "/google9873e2cf07eba082.html"),
)


class Command(BaseCommand):
    help = "Export the site as static HTML/CSS/JS for GitHub Pages."

    def add_arguments(self, parser):
        parser.add_argument(
            "--output",
            default="_site",
            help="Output directory (default: _site)",
        )

    def handle(self, *args, **options):
        out = Path(options["output"])
        if out.exists():
            shutil.rmtree(out)
        out.mkdir(parents=True)

        client = Client()
        hosts = list(settings.ALLOWED_HOSTS) + ["testserver"]

        with override_settings(ALLOWED_HOSTS=hosts):
            for rel_path, url in ROUTES:
                response = client.get(url)
                if response.status_code != 200:
                    raise CommandError(f"{url} returned HTTP {response.status_code}")

                target = out / rel_path
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text(response.content.decode("utf-8"), encoding="utf-8")
                self.stdout.write(f"  {url} -> {rel_path}")

        main_static = Path(settings.BASE_DIR) / "main" / "static"
        if not main_static.is_dir():
            raise CommandError(f"App static directory not found: {main_static}")

        shutil.copytree(main_static, out / "static", dirs_exist_ok=True)
        self.stdout.write("  main/static/ -> static/")

        (out / ".nojekyll").touch()

        cname = os.environ.get("GITHUB_PAGES_CNAME", "").strip()
        if cname:
            (out / "CNAME").write_text(cname, encoding="utf-8")
            self.stdout.write(f"  CNAME -> {cname}")

        # GitHub Pages uses 404.html for unknown paths; serve the main page.
        shutil.copy2(out / "index.html", out / "404.html")

        self.stdout.write(self.style.SUCCESS(f"Exported to {out.resolve()}"))
