# Client-Sided Objects

Client-sided objects are the parts of a tower that each player runs on their own
screen: buttons, moving platforms, conveyors, lighting changes and anything else
that shouldn't be shared between players. When one player presses a button, it
only opens for them.

Ascent runs them with the Eternal Towers of Hell tower framework, so objects from
EToH's Tower Creation Kit work as they are, both v5 and v6.

## Where to put them

Put them in either of these places. Both work the same way:

```text
Workspace
└─ Towers
   └─ ToH
      └─ ClientSidedObjects   -- inside the tower, handy while you build
ServerStorage
├─ TowerClientObjects
│  └─ ToH                     -- outside the Workspace, the same result
└─ EverpresentCOs             -- loaded for every player, all the time
```

When a player enters a tower, they get their own copy of that tower's objects.
`EverpresentCOs` is for objects outside any tower, such as lobby buttons. It's
loaded for every player as soon as they join.

## What the kit runs

The kit looks for these inside a client objects folder:

| Name | What it is |
| :-- | :-- |
| `ClientObjectScript` | A script that runs an object for the player, such as a button or a platform. |
| `RunRepoScript` | Runs one of the framework's built-in object scripts. |
| `SetCollisionGroup` | Puts a part in a collision group. |
| `LightingChanger` | A part that changes the lighting when touched. |

A folder made with the v6 Tower Creation Kit has a `KitVersion` attribute, and the
kit loads it with the v6 framework. A folder without one is loaded the v5 way, so
older objects such as v5 buttons and lighting changers keep working.

## Your place's lighting

Light your place in Studio as you normally would: the `Lighting` service's
properties, plus a `Sky`, an `Atmosphere` and any post-processing effects.

That's what players see, and it's what a lighting changer set to `Default` goes
back to.

- Only the first of each kind is used, so keep just one `Sky`.
- A post-processing effect you've turned off (`Enabled` unticked) stays off.

## Hiding other towers

Players choose how much of the map stays loaded with the **Tower Loading Behavior**
setting (`towerLoadingBehavior` in `Config > Settings`):

| Option | What it does |
| :-- | :-- |
| `Load All` | Everything stays visible. |
| `Unload Towers` | Hides the other towers' `Obby` folders. |
| `Unload All` | Hides the other towers' `Obby` folders, and `Workspace > Lobby` while the player is in a tower. |

This only changes what that player sees. It doesn't affect the server's checks.
