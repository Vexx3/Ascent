# Tickets & Shop

Players earn tickets by beating towers and spend them in the ticket shop on Tools, Trails and Auras. Both are set up under `Config > Economy`.

## Turning It Off

| Field | Default | Turns off |
| :-- | :-- | :-- |
| `enabled.tickets` | `true` | Tickets, the counter, and the shop with them. |
| `enabled.shop` | `true` | Just the shop. Tickets are still earned. |

Turning something off removes its menu and stops the server from accepting it. Nothing saved is lost; turning it back on restores everything.

## Earning Tickets

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

| Field | Default | Purpose |
| :-- | :-- | :-- |
| `cooldownDays` | `7` | Days before the same tower pays the same player again. `0` for no cooldown. |
| `rewards` | — | Tickets per **difficulty name**. `0`, or leaving one out, pays nothing. |
| `perTower[x].multiplier` | `1` | Scales one tower's reward. |
| `perTower[x].allowRebeats` | `false` | That tower pays on every win, ignoring the cooldown. |

A tower can carry these itself, as the `TicketMultiplier` and `AllowRebeats` attributes, which win over `perTower`.

The shipped rewards:

| Easy | Medium | Hard | Difficult | Challenging | Intense | Remorseless | Insane | Extreme | Terrifying | Catastrophic |
| --: | --: | --: | --: | --: | --: | --: | --: | --: | --: | --: |
| 5 | 5 | 10 | 10 | 20 | 50 | 150 | 250 | 550 | 1125 | 2250 |

Horrific, Unreal and Nil pay `0`.

### When a win pays

A win pays when it is in Normal mode, on the tower's main winpad, with no boost item used, and the tower is not on cooldown. Practice, All Jumps and tower rush wins don't pay.

### How much it pays

```text
rewards[difficulty]
  x  tower type's ticketMultiplier      Citadel x2, Steeple x0.5
  x  the tower's own multiplier
  x  the player's game pass multiplier
```

Each step rounds down. **The tower type is easy to forget**: an Insane Citadel pays 500, not 250.

Every ticket earned and spent shows up in the Creator Dashboard's economy analytics, tagged with the Area it happened in. Admin grants aren't counted.

## Add An Item

Each shop item is one entry under `shop.items`, keyed by an ID that is saved when someone buys it, so never rename it after release:

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

| Field | Purpose |
| :-- | :-- |
| `name` | What players see. |
| `description` | The text in `InfoModal`. |
| `price` | Whole-number ticket cost. |
| `category` | `Items`, `Trails` or `Auras`. |
| `rarity` | `Uncommon`, `Rare`, `Epic`, `Legendary` or `Mythic`. Picks its colour from `rarityColors`. |
| `icon` | A Roblox image. An `Items` entry shows its Tool's own icon, so it only needs one if the Tool has none. Trails and Auras need one. |
| `template` | For `Items`: the Tool's name in `ServerStorage > TicketShopItems > Tools`. Defaults to `name`. |
| `featuredOnly` | For `Items`: listed only on the Featured page, never discounted. |

What a purchase gives:

- `Items`: the Tool, permanently.
- `Trails` / `Auras`: unlocks the cosmetic **with the same ID** under `Economy > cosmetics`. It is equipped from the Cosmetics menu.

A purchase is charged once, however many times it is clicked, and an owned item can't be bought again.

## Featured Rotation

```luau
featured = {
	refreshMinutes = 60,
	itemCount = 4,
	discountPercent = 25,
	categories = { "Trails", "Auras", "Items" },
},
```

Every server shows the same featured items and changes them at the same time. Featured items are `discountPercent` off (`0` for none, at most 90, never below 1 ticket). Players are warned 30 seconds before the change; the words are in `Config > Messages.shopRotation`.

## The Shop Menu

```text
ShopMenu
  InfoModal
    InfoName
    InfoPrice
    DescriptionFrame
      Description
      Rarity
      Type
    Options
      Purchase
      Preview          <- optional
      Cancel
  AllList
    TrailsList
      Template
    AurasList
      Template
    ItemsList
      Template
  FeaturedList
    CountdownFrame
      Fill
      CountdownLabel
    FeatureList
      Template
    ItemsList
      Template
    GamepassList
      Template         <- an ImageLabel
        NameLabel
        BuyButton
```

`FeaturedButton` and `AllButton`, anywhere in `ShopMenu`, switch between the two lists. `Preview` shows only for a trail or aura; see [Previewing a cosmetic](./cosmetics.md#previewing-a-cosmetic). `GamepassList` lists your [game passes](./game-passes.md).

Assets:

```text
ServerStorage
├─ TicketShopItems
│  └─ Tools
│     └─ Gravity Coil
└─ Cosmetics
   ├─ Trails
   └─ Auras
```

## Troubleshooting

| Problem | Fix |
| :-- | :-- |
| An item is missing | Check its `category` is spelled exactly. |
| A Tool purchase fails | Match `template` to a Tool in `ServerStorage > TicketShopItems > Tools`. |
| A cosmetic purchase fails | Give the shop item and the cosmetic the same ID. |
| The last item in a list is cut off | Give the list a `UIListLayout` or `UIGridLayout` and set its `AutomaticCanvasSize`. |
