# Completion Tools

Completion tools are Roblox `Tool` instances awarded when a player beats a tower in Normal mode.

They are restored from the player's completed tower list, not saved as copies of the tool itself. Keep the reward tools in `ServerStorage.CompletionTools` so the kit can clone them when needed.

## Setup

Create this structure:

```text
ServerStorage
└─ CompletionTools
   └─ ToH  -- the tower acronym
      ├─ Speed Coil
      └─ Gravity Coil
```

Rules:

- The folder name under `CompletionTools` must match the tower acronym. The
  server reports a folder that matches no tower when it starts, because a
  mismatch means the reward inside it can never be handed out.
- Only `Tool` instances are cloned, and a folder holding none is reported too.
- Tools are cloned into the player's `Backpack` and `StarterGear`.
- Tools are restored again when the player's account data loads.

`CompletionTools` ships with the kit as an empty folder, so it is already in the
Explorer waiting for you. A tower with no folder under it is the normal case —
most towers award nothing — and says nothing in the Output window.

## When Tools Are Awarded

Completion tools are awarded when:

- The player completes the tower in Normal mode.
- The win is valid.
- The completion is for the main tower ending.

Completion tools are not awarded for:

- Practice mode.
- All Jumps mode.
- Custom ending-only wins that do not use the main tower ending ID.

## Boost And Debug Attributes

Tools can affect win legitimacy when equipped inside a tower.

| Attribute | Type | Effect |
| :-- | :-- | :-- |
| `BoostName` | `string` | Marks the run as boosted and records a display name for announcements. |
| `DebugItem` | `boolean` | Marks the run as debugged. Debug items are treated as assisted tools. |

If an older tool contains a nonempty `StringValue` named `BoostName`, the kit recognizes it as a boost. When equipped in a tower, the server warns and copies it to a `BoostName` attribute.

## No-Boost Towers

Add the `NoBoosts` tag to a tower folder or model and a boosted win there is
refused — the player still reaches the winpad, but nothing is awarded.

A tower rush is stricter. Set `noBoosts = true` on the rush in `Config > Towers`
and **equipping a boost item kills the player on the spot**, because a rush is
one run and there is nothing to salvage from a boosted leg of it.

Citadels and Obelisks ban boosts by type, without a tag.

## See Also

- [Tower Setup](./tower-setup.md)
- [Boost & Practice Tools](./boost-items.md)
- [Tower Setup plugin: Rewards](./tower-setup-plugin.md#rewards)
