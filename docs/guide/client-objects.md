# Client-Sided Objects

Client-sided objects are local tower objects. Use them for visual effects, local interactables, lighting changes, buttons, moving platforms, and objects that should not run as normal server physics.

## Where To Put Them

Either of two places, whichever suits how you build:

```text
Workspace
└─ Towers
   └─ ToH
      └─ ClientSidedObjects  -- beside the tower you are editing
ServerStorage
├─ TowerClientObjects
│  └─ ToH                    -- out of the Workspace, same effect
└─ EverpresentCOs            -- loaded for everyone, always
```

When a player loads a tower, the kit gives that player a copy of the matching
folder. Nobody else sees it, and nothing in it is server physics.

`EverpresentCOs` is the exception: it loads for every player on join, wherever
they are. A legacy `Workspace > Towers > EverpresentCOs` is moved into
`ServerStorage` at startup when the stable folder is not there.

## Object Scripts

The loader recognizes these descendants:

| Name | Purpose |
| :-- | :-- |
| `ClientObjectScript` | Runs object logic for the local player. |
| `RunRepoScript` | Runs one of the kit's bundled object scripts. |
| `SetCollisionGroup` | Sets a `BasePart` collision group. |
| `LightingChanger` | Local lighting trigger. |

Folders with a `KitVersion` attribute use the newer client object manager.

## Legacy Support

Older EToH/JToH-style objects such as button models, `_G.Buttons`, and legacy lighting changers are still supported. New towers should prefer `ClientSidedObjects` and the built-in object scripts.

## Place Lighting

Light your place in Studio the way you normally would: the `Lighting` service's
own properties, plus a `Sky`, an `Atmosphere`, and any post-processing effects.

On join, the framework replaces those children with copies of its own named
`LCSky`, `LCAtmosphere` and so on, because those are what a `LightingChanger`
drives. The kit hands them your values first, so what you built in Studio is
what players see, and it is what a lighting changer set to `Default` returns to.

Two things are worth knowing:

- Only the first instance of each class is adopted. Two `Sky` objects in
  `Lighting` was already ambiguous, and the kit does not make it less so.
- A post-processing effect you leave **disabled** stays exactly where it is. It
  renders nothing, so it is treated as a preset you parked in `Lighting` rather
  than as part of the place's look.

## Tower Visibility

The player setting `towerLoadingBehavior` controls local tower visibility:

| Value | Behavior |
| :-- | :-- |
| `Load All` | Keeps everything visible. |
| `Unload Towers` | Hides inactive tower `Obby` folders. |
| `Unload All` | Hides inactive tower `Obby` folders, and `Workspace > Lobby` while inside a tower. |

This is client-side only and does not affect server validation.

## See Also

- [Tower Setup](./tower-setup.md)
- [Extending the Kit](./extending-gameplay.md)
