# sitemap-check

This cli tool will parse your XML sitemaps and issue a `HEAD` request to URLs they contain and warn you against problems such as invalid XML or unreachable pages.
If you give it a sitemap index URL which contains other sitemaps, it will parse all of them.

## Install
```bash
npm install sitemap-check --global
```

## Usage

```bash
$ sitemap-check http://url-to-your-sitemap
```

## Options

| Description                                            | command           |
| ------------------------------------------------------ | ----------------- |
| Timeout (in seconds) for a single URL                  | `-t`, `--timeout` |
| Maximum number of URLs to visit in a single sitemap    | `--maxPerSitemap` |
