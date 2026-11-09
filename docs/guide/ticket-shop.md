# Tickets & Shop

Players earn tickets by beating towers, and spend them in the ticket shop on
tools, trails and auras. Both are set up in `Config > Economy`.

## Turning them off

| Setting | Default | Set to `false` to turn off |
| :-- | :-- | :-- |
| `enabled.tickets` | `true` | Tickets, the ticket counter and the shop. |
| `enabled.shop` | `true` | Just the shop. Players still earn tickets. |

Turning something off removes its menu and the server stops accepting it. Nothing
saved is lost, so turning it back on gives players everything back.

## Earning tickets

```luau
tickets = {
	cooldownDays = 7,
	rewards = { Easy = 5, Hard = 10, Insane = 250 },
	perTower = {
		ToH = { multiplier = 2 },
		ToE = { multiplier = 1.5, allowRebeats = true },
	},
},
```

| Setting | Default | What it does |
| :-- | :-- | :-- |
| `cooldownDays` | `7` | Days before the same tower pays the same player again. `0` means no cooldown. |
| `rewards` | | Tickets for each **difficulty name**. A difficulty that's `0` or left out pays nothing. |
| `perTower[acronym].multiplier` | `1` | Multiplies one tower's reward. |
| `perTower[acronym].allowRebeats` | `false` | That tower pays every time it's beaten, ignoring the cooldown. |

You can also set these on the tower itself with the `TicketMultiplier` and
`AllowRebeats` attributes. The attributes win over `perTower`.

The kit ships with these rewards:

| Easy | Medium | Hard | Difficult | Challenging | Intense | Remorseless | Insane | Extreme | Terrifying | Catastrophic |
| --: | --: | --: | --: | --: | --: | --: | --: | --: | --: | --: |
| 5 | 5 | 10 | 10 | 20 | 50 | 150 | 250 | 550 | 1125 | 2250 |

Horrific, Unreal and Nil pay `0`.

### When a win pays

A win pays tickets when **all** of these are true:

- It's a Normal mode win.
- It's on the tower's main winpad, not a side ending.
- No boost item was used.
- The tower's difficulty has a reward in `rewards`.
- The tower isn't on cooldown for that player.

Practice, All Jumps and tower rush wins never pay tickets.

While a tower is on cooldown, its details in Completions show **Ticket Cooldown**
with the time left, such as `5d 21h 1m 46s`. The words are `ticketCooldown` in
the `completions` group of `Config > Messages`.

### How much a win pays

```text
rewards[difficulty]
  × the tower type's ticketMultiplier      (Citadel ×2, Steeple ×0.5)
  × the tower's own multiplier
  = rounded down
  × the player's game pass multiplier      (such as VIP)
  = rounded down again
```

**Don't forget the tower type.** An Insane Citadel pays 500 tickets, not 250.

## Add a shop item

Each item is one entry in `shop.items`. Its key is an ID that's saved when someone
buys the item, so don't rename it after release:

```luau
GravityCoil = {
	name = "Gravity Coil",
	description = "A permanent movement tool.",
	price = 75,
	category = "Items",
	rarity = "Rare",
	template = "Gravity Coil",
},
```

| Setting | What it does |
| :-- | :-- |
| `name` | The item's name, which players see. |
| `description` | The text shown when a player opens the item. |
| `price` | What it costs, in whole tickets. |
| `category` | `"Items"`, `"Trails"` or `"Auras"`. |
| `rarity` | `"Uncommon"`, `"Rare"`, `"Epic"`, `"Legendary"` or `"Mythic"`. Its colour comes from `rarityColors`. |
| `icon` | A Roblox image ID. An `Items` entry uses its Tool's own icon, so it only needs one if the Tool has none. Trails and auras always need one. |
| `template` | For `Items`: the name of the Tool in `ServerStorage > TicketShopItems > Tools`. Defaults to `name`. |
| `featuredOnly` | For `Items`: only sold on the Featured page, and never discounted. |

What a purchase gives:

- An `Items` purchase gives the Tool, forever.
- A `Trails` or `Auras` purchase unlocks the cosmetic **with the same ID** in
  `Economy > cosmetics`. The player equips it from the Cosmetics menu.

A purchase is only charged once, however many times the button is clicked, and
an item a player owns can't be bought again.

## Daily items

```luau
featured = {
	enabled = false,
	refreshMinutes = 60,
	refreshWarning = 30,
	itemCount = 4,
	discountPercent = 25,
	categories = { "Trails", "Auras", "Items" },
},
```

Daily items ship off. Set `enabled = true` to add them to the top of the Featured
page. Off, the Featured page shows only items marked `featuredOnly` and your game
passes.

The row shows `itemCount` items at `discountPercent` off (`0` for no
discount, `90` at most). Every server shows the same items, and they change every
`refreshMinutes`.

Players are warned `refreshWarning` seconds before the items change (`0` for no
warning). The warning's text is the `shopRotation` group in `Config > Messages`.

## Where items go

```text
ServerStorage
├─ TicketShopItems
│  └─ Tools
│     └─ Gravity Coil
└─ Cosmetics
   ├─ Trails
   └─ Auras
```

The shop's **Preview** button only shows for a trail or aura. See
[Previewing a cosmetic](./cosmetics.md#previewing-a-cosmetic).

## Troubleshooting

| Problem | Fix |
| :-- | :-- |
| An item doesn't show up | Check its `category` is spelled exactly right. |
| Buying a tool fails | Make `template` match a Tool in `ServerStorage > TicketShopItems > Tools`. |
| Buying a trail or aura fails | Give the shop item and the cosmetic the same ID. |
| The last item in a list is cut off | Give the list a `UIListLayout` or `UIGridLayout`, and set its `AutomaticCanvasSize`. |
