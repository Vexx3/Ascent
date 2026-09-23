# Extending the Kit

::: tip Try configuration first
Most changes belong in `Shared > Config`, in your tower instances, or in
`ServerStorage` assets. Only write code when the behaviour itself has to change.
:::

## Where code goes

The Studio hierarchy groups code by feature.

| Feature | Studio location |
| :-- | :-- |
| Towers, winpads, Practice, All Jumps | `Server > Towers`, `Client > Towers` |
| Ticket shop | `Server > Shop`, `Client > Shop` |
| Cosmetics | `Server > Cosmetics`, `Client > Cosmetics` |
| Teleports and Personal Servers | `Server > Teleport`, `Client > Teleport` |
| Settings | `Server > Settings`, `Client > Settings` |
| Saved progression | `Server > Accounts` |
| Game passes | `Server > Shop > GamePasses` |
| Admin console | `Server > Commands`, `Client > Commands` |

**A feature is named after what the player sees, and keeps that name in every
tree it appears in.** The shop is `Shop` on the server, the client and in
shared. To find the code behind something on screen, open the folder with its
name on it.

## The file path is the Studio path

`src/Server/Towers/Winpads.luau` becomes
`ServerScriptService > Server > Towers > Winpads`. Nothing is renamed during the
build, so an error in the Output window names a file you can open.

| Source | Runs on | Becomes |
| :-- | :-- | :-- |
| `src/Server/` | Server | `ServerScriptService > Server` |
| `src/Client/` | Client | `StarterPlayerScripts > Client` |
| `src/Shared/` | Both | `ReplicatedStorage > Shared` |

## Naming

**One name per module.** The module's table, its file, and every `require`
binding use the same PascalCase name.

**`Config` is the one exception.** The folder already supplies the qualifier, so
`Config > Towers` is imported as `TowersConfig` — a bare `Towers` would collide
with `Shared > Towers`.

**Two files share a name only when they mirror each other** across trees. The
server module that builds a cosmetic mannequin is `PreviewRig`, not
`CosmeticPreview`, because the client already had that name and an error naming
it told you nothing about which one broke.

**A folder holding one file is fine** when it is a feature's half of a tree, or
when a tool walks the folder. Otherwise write the file.

## Lifecycles

Three names, and nothing else is one.

| Name | Meaning |
| :-- | :-- |
| `start()` | Takes no arguments, begins running. |
| `setup(instance)` | Attaches to an Instance. |
| `destroy()` | Undoes `setup`. |

A feature folder's entry module says which side it is on: `<Feature>Service` on
the server, `<Feature>Controller` on the client. So the Explorer answers "which
of these do I open first" without opening any of them.

Two folders keep an `init.luau` instead, because each must be the parent of its
own children: `Client > ClientObjects` clones a template stored under itself,
and `Server > Commands` is walked by Cmdr.

## Requires

Inside Studio, write Roblox's require-by-string:

```luau
local Difficulty = require("@game/ReplicatedStorage/Shared/Towers/Difficulty")
local TowerHud = require("./TowerHud")
```

| Form | Reaches |
| :-- | :-- |
| `@self/Child` | a ModuleScript inside this one |
| `./Sibling` | a ModuleScript beside it |
| `../Up/And/Over` | out of its parent and back down |
| `@game/Service/...` | anything, from the DataModel root |

Sort them alphabetically by the name on the left, in one run with no blank-line
sections.

::: warning Stay relative inside your own tree
Reach `Shared` and `Packages` with `@game`, but reach one client module from
another with `./` or `../` — **never** `@game/StarterPlayer/…`.

A client module is copied out of `StarterPlayerScripts` into `PlayerScripts` to
run. The absolute path finds the copy that is *not* running, so anything the
module remembers quietly exists twice.
:::

**Requires only point inward.** Server code may reach `Server` and `Shared`;
client code may reach `Client` and `Shared`; shared code may reach only
`Shared`. A require crossing that boundary names something that does not exist
at run time.

## Adding a server feature

1. Create `Server > <Feature>` returning a table with a `start()` function.
2. Guard it with a `started` flag, so a second call does nothing.
3. Add one line to `Server` (the entry script).

That script is the only place server features are started, which is what keeps
the startup order readable in one screen.

## Keeping it small

- Keep rewards, purchases, wins, teleports and saved-data changes on the server.
- Use the existing generated network messages. Add one only when a client needs it.
- Call Scribe accessors in the owning feature rather than adding a datastore service.
- Export a function only when another feature calls it.
- Prefer attributes, tags and configuration over an abstraction for one case.
- Reuse the Studio UI templates instead of building fallback UI at run time.

The internal modules are deliberately not a stable public API — see the
[API Reference](./api.md) for the parts that are.

## Working in the source repository

The kit's source is developed privately, so this is only relevant if you have
been given access to it. Everyone else edits the place, and sends a fix as a
[bug report](https://github.com/Vexx3/Ascent/issues/new?template=bug_report.yml).

Write the alias form and the build converts it to the strings above:
`@Server`, `@Client`, `@Shared`, `@Config`, `@Packages`, `@ServerPackages`,
`@ServerNetwork`, `@SharedNetwork`, `@Vendor`.

`npm run check` fails on anything else. Two more rules it enforces:

- **`local` for every binding**, and `table.freeze` where contents must not change.
- **A module returns something named.** `local Winpads = {}` … `return Winpads`, never `return { ... }` — an anonymous table has no name in a stack trace.

## See Also

- [API Reference](./api.md)
- [Studio Structure](./studio-structure.md)
