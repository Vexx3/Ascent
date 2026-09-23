# Contributing

Thank you for helping make Ascent better. There are three ways in.

## Fixing the guide

The guide is everything under `docs/`, and pull requests to it are welcome from
anyone.

- **A typo or one wrong sentence:** click **Suggest a change to this page** at
  the bottom of the page. GitHub opens the file in your browser and makes the
  pull request for you.
- **Anything bigger:** clone the repository and preview as you write.

  ```sh
  npm install
  npm run docs:dev
  ```

  Every pull request builds the guide automatically, and one that breaks the
  build — usually a link to a page or heading that does not exist — cannot be
  merged until it passes.

Write the way the guide is written:

- Say what a setting does, and what goes wrong without it.
- Name things exactly as Studio's Explorer shows them: `ServerStorage > Cosmetics > Trails`.
- Keep to one idea per paragraph, and prefer a table to a long list of settings.
- Add a page to the sidebar in `docs/.vitepress/config.mjs`, or nobody will find it.

## Reporting a bug

Use the [bug report form](https://github.com/Vexx3/Ascent/issues/new?template=bug_report.yml).
The fields it asks for are the ones that make a bug fixable: the kit version,
the steps, and what the Output window printed.

If you have fixed it yourself, paste **only the lines you changed** into the
form's last box, and name the script by its Explorer path, such as
`ServerScriptService > Server > Towers > Winpads`. That is everything needed to
apply it.

### What not to post

Ascent is a paid kit, and issues here are public. So:

- **Never attach a place file** (`.rbxl` or `.rbxlx`) that contains the kit, and
  never paste a whole kit script. A small place that shows the problem is still
  the most useful thing a report can have — share it privately in the
  [Discord](https://discord.gg/TbqyC2hJRH) and say so in the issue.
- **Never post secrets:** Discord webhook URLs, your place's API keys, or
  anything from Creator Dashboard › Secrets. Check an Output log before pasting
  it.

## Suggesting a feature

Use the [feature request form](https://github.com/Vexx3/Ascent/issues/new?template=feature_request.yml),
and lead with what your game needs rather than the feature you picture — two
requests for the same need are often one feature. Ideas still being worked out
belong in [Discussions](https://github.com/Vexx3/Ascent/discussions).

## Code changes

The kit's source is not public, so a change to it cannot be a pull request here.
A fix goes in a bug report, as above; a larger change starts as a feature request
or a Discussion, so it can be talked through before anybody writes it.
