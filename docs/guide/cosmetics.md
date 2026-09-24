# Cosmetics

The kit supports permanent Trails and Auras. There are two ways to add one, and
you can mix them.

## On the model, with no code

Every cosmetic already has a model in `ServerStorage > Cosmetics`, so it can
describe itself right there. The model's name is the cosmetic's ID.

```text
ServerStorage
└─ Cosmetics
   ├─ Trails
   │  └─ BlueTrail  -- the model name is the cosmetic ID
   └─ Auras
```

Select `BlueTrail` and set `Rarity = "Rare"`, `CosmeticName = "Blue Trail"` and
`UnlockTower = "ETV5"` in the Properties window. That is the whole cosmetic.

| Attribute | Kind | Purpose |
| :-- | :-- | :-- |
| `Rarity` | String | Required. `Uncommon`, `Rare`, `Epic`, `Legendary` or `Mythic`; anything else is ignored with a warning. This is what makes a model a cosmetic. |
| `CosmeticName` | String | The name players see. Defaults to the model's name. |
| `Hint` | String | Shown while it is still locked. |
| `UnlockTower` | String | Beat one exact tower. |
| `UnlockDifficulty` | String | Beat a tower of that exact difficulty. |
| `UnlockTowerCount` | Number | Beat that many unique normal towers. |
| `UnlockGroupId` | Number | Be in that group. Pair with `UnlockGroupRank`. |
| `UnlockGroupRank` | Number | The rank the group check requires. |
| `UnlockPremium` | Boolean | Have Roblox Premium. |
| `BodyPart` | String | Where it attaches. Defaults to `HumanoidRootPart`. |
| `AttachmentName` | String | Aura attachment name. |
| `Attachment0Name`, `Attachment1Name` | String | Trail attachment names. |

Set no unlock attributes and the cosmetic can only come from the ticket shop or
a game pass, which is what you want for a purchase.

## In `Config > Economy`

Add it under `cosmetics` instead, which keeps every cosmetic and its rules in
one list you can read top to bottom:

```luau
cosmetics = {
	Trails = {
		BlueTrail = {
			name = "Blue Trail",
			rarity = "Rare",
			hint = "Beat ETV5 to unlock this trail.",
			unlocks = {
				{ type = "Tower", tower = "ETV5" },
			},
		},
	},

	Auras = {},
}
```

The model still has to exist. Use optional `template` only when the asset name
differs from the cosmetic ID.

When a cosmetic has both, the model's attributes win field by field, so you can
list one in code and still change its rarity in Studio. Unlock rules are the
exception: one unlock attribute replaces the entry's whole `unlocks` list rather
than adding to it. Set `UnlockPremium` on a model whose entry names a tower and
Premium becomes the only way in.

## Unlock Rules

If any rule passes, the cosmetic is available.

| Rule | Attribute | In code | Meaning |
| :-- | :-- | :-- | :-- |
| Tower | `UnlockTower = "ETV5"` | `{ type = "Tower", tower = "ETV5" }` | Beat one exact tower. |
| Difficulty | `UnlockDifficulty = "Hard"` | `{ type = "Difficulty", difficulty = "Hard" }` | Beat a tower of that exact difficulty. |
| TowerCount | `UnlockTowerCount = 10` | `{ type = "TowerCount", count = 10 }` | Beat enough unique normal towers. |
| Group | `UnlockGroupId = 123`, `UnlockGroupRank = 1` | `{ type = "Group", groupId = 123, minRank = 1 }` | Be in a group at the required rank. |
| Premium | `UnlockPremium = true` | `{ type = "Premium" }` | Have Roblox Premium. |

A cosmetic that needs more than one rule of the same kind, such as two different
towers, needs the config list. Attributes cover one of each.

::: warning `Difficulty` here is not `difficulties` in Config > Worlds
They read the same and behave differently. A cosmetic's `Difficulty` matches
**that tier exactly** — beating an Insane tower does not satisfy a `Remorseless`
rule. A locked Area's `difficulties` means that tier **or harder**, so the same
Insane clear counts toward every line below it.

An aura opening on `ETV6` (Insane) **or** on any Remorseless tower has two
genuinely different routes only because of that. Read it the Area's way and the
Insane clear would satisfy the Remorseless line as well, and the second route
would be dead.
:::

### Worked examples

`Config > Economy` ships five cosmetics, and only two carry a rule: `BlueTrail`
opens on `ETV5` and `Moonflower` on `ETV6`. Every rule is worked through here
instead. Paste this over the shipped `cosmetics` table to watch each one behave,
and give `Shinning` a real group id or drop that line. `VIPTrail` and `Fallen`
stay in it because the VIP pass and the shop name them.

```luau
cosmetics = {
	Trails = {
		GreenTrail = {
			name = "Green Trail",
			rarity = "Uncommon",
			hint = "Purchase Green Trail in the ticket shop.",
			unlocks = {},
		},
		BlueTrail = {
			name = "Blue Trail",
			rarity = "Rare",
			hint = "Beat ETV5 to unlock this trail.",
			unlocks = {
				{ type = "Tower", tower = "ETV5" },
			},
		},
		VIPTrail = {
			name = "VIP Trail",
			rarity = "Legendary",
			hint = "Own the VIP game pass to unlock this trail.",
			unlocks = {},
		},
	},
	Auras = {
		Fallen = {
			name = "Fallen",
			rarity = "Epic",
			hint = "Purchase Fallen in the ticket shop.",
			unlocks = {},
		},
		Moonflower = {
			name = "Moonflower",
			rarity = "Legendary",
			hint = "Beat ETV6, or any Remorseless tower.",
			unlocks = {
				{ type = "Tower", tower = "ETV6" },
				{ type = "Difficulty", difficulty = "Remorseless" },
			},
		},
		Shinning = {
			name = "Shinning",
			rarity = "Mythic",
			hint = "Beat ten towers, hold Premium, or join the group.",
			unlocks = {
				{ type = "TowerCount", count = 10 },
				{ type = "Premium" },
				{ type = "Group", groupId = 1234567, minRank = 1 },
			},
		},
	},
}
```

| Cosmetic | Opens on |
| :-- | :-- |
| `GreenTrail`, `Fallen` | nothing — shop only |
| `VIPTrail` | nothing — the VIP pass only |
| `BlueTrail` | one named tower |
| `Moonflower` | a named tower, **or** an exact difficulty |
| `Shinning` | ten towers, **or** Premium, **or** a group |

The same set written as attributes needs no code: `Rarity` and `Hint` on the
model, then `UnlockTower = "ETV6"`, `UnlockTowerCount = 10`, `UnlockPremium =
true`, and so on. The one thing attributes cannot express is two rules of the
same kind — two different named towers, say — which is when the config list is
the answer.

## Shop And Pass Unlocks

- A ticket-shop Trail or Aura unlocks the cosmetic with the same item ID.
- The built-in VIP pass can name a Trail in its `trail` field.
- Both are saved as permanent ownership.

Players choose one Trail and one Aura from the Cosmetics menu. Unlocking does not automatically equip it.

`enabled.cosmetics` in `Config > Economy` switches the Cosmetics menu off, and
`enabled.cosmeticCategories` one category at a time. A category that is off
loses its tab, its shop items stop selling, and the server refuses to equip or
grant one. What players already own stays in their save.

## Trail Assets

A Trail asset may be a `Trail`, `Folder`, or `Model`. By default, it attaches to `HumanoidRootPart`. Advanced entries may set `bodyPart`, attachment names, or attachment positions in the cosmetic table.

## Aura Assets

An Aura may contain particle effects, attachments, lights, `Fire`, `Smoke`, `Sparkles`, parts, folders, or models. For a rig-style aura, name child folders after character body parts; their effects are copied to the matching parts.

## Previewing a cosmetic

A player can look at a trail or an aura on a character before buying it. The
shop's `InfoModal` shows a **Preview** button for those two categories, and
pressing it hides the menu, puts the camera on a mannequin wearing the
cosmetic, and stops the player walking off. **StopPreview** — a `GuiButton`
directly under the `MainMenu` ScreenGui — brings the menu back with the same
item still open. Dragging rotates the view.

It needs one thing from you: a character `Model` called **`Rig`** in
`Workspace`. Any R6 or R15 rig will do, and how you have dressed it does not
matter — the copy is dressed as whoever is looking at it, read off the
character they are standing in. It has to have a `HumanoidRootPart` and be
`Archivable`. Without one the button does nothing, which the
Output window says once and the [Tower Setup window](./tower-setup-plugin.md#setup)
reports on its Setup tab.

Both buttons are optional. A menu without them loses the preview and nothing
else.

::: tip Nobody else sees it
The mannequin is built for one player and parented to them, so two people can
preview different trails at the same time and the `Rig` standing in your lobby
never changes. It is hidden for the player previewing, because their copy is
standing in the same spot.
:::

::: warning Why a previewed trail is redrawn
A trail only draws where its attachments move, and the kit hangs them on the
body's centre — the part every animation is measured against, which never goes
anywhere on a mannequin walking on the spot. Left alone it would show nothing.
So while a trail is previewed its own `Trail` is switched off, and the kit draws
a copy that streams backwards from the body at walking speed, with a small
stride sway: the ribbon a player would really leave. An aura has no such problem
and stands still.
:::

## Existing UI

The menu controller uses the existing Studio instances and does not build fallback UI:

```text
CosmeticsMenu
  SearchBox
  ButtonTabHolder
    TrailsButton
    AurasButton
  TrailsList
    CosmeticButton
      CosmeticName
  AurasList
    CosmeticButton
      CosmeticName
  HintHover
```

Each scrolling list needs a `UIListLayout` or `UIGridLayout`, and its `AutomaticCanvasSize` set to the direction it scrolls. The kit then sizes its canvas from the layout so the final item remains reachable.

Rarity colors are in `Economy > rarityColors` and are shared with the shop.

## See Also

- [Configuration Reference: Economy](./configuration.md#economy)
- [Ticket Shop](./ticket-shop.md)
- [Tower Setup plugin: Cosmetics](./tower-setup-plugin.md#cosmetics)
