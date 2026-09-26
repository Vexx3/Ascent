# Game Passes

Passes are set up in `Config > GamePasses`, one entry per pass. Roblox supplies each pass's name, description, picture, price and sale status, so only what the pass *does* goes in Config.

## Included Passes

```luau
VIP = {
	id = 0,
	kind = "VIP",
	ticketMultiplier = 1.25,
	trail = "VIPTrail",
	chatTag = "VIP",
	tickets = 200,
	-- giftProductId = 1234567890,
},
PersonalServers = {
	id = 0,
	kind = "PersonalServers",
},
```

Both ship with `id = 0`, which means **off**. Create the pass under **Monetization → Passes** in the Creator Dashboard and put its ID in. For a pass you won't sell, set `disabled = true`.

| Field | For | Purpose |
| :-- | :-- | :-- |
| `id` | all | The Roblox pass ID. `0` is off. |
| `kind` | all | `"Tool"`, `"VIP"` or `"PersonalServers"`. |
| `disabled` | all | Turns the pass off. |
| `giftProductId` | all | A developer product that gifts the pass. See [Gifting A Pass](#gifting-a-pass). |
| `tool` | `Tool` | The Tool to give. |
| `ticketMultiplier` | `VIP` | Multiplies ticket rewards. |
| `trail` | `VIP` | A trail it unlocks. |
| `chatTag` | `VIP` | A chat tag from `Config > Chat > tags > styles`. |
| `tickets` | `VIP` | Tickets given once. |

The key on the left (`VIP`) is saved with owners, so never rename it after release. `PersonalServers` lets its owners create personal servers; anyone can join one with a code.

## Add A Tool Pass

```luau
MyToolPass = {
	id = 1234567890,
	kind = "Tool",
	tool = "My Tool",
},
```

Put a Tool with exactly that name in `ServerStorage > TicketShopItems > Tools`. Owners get one permanent copy, back after every respawn. Add as many Tool passes as you like.

## In The Shop

Passes are listed in the shop's `FeaturedList > GamepassList`:

```text
ShopMenu
├─ FeaturedList
│  └─ GamepassList
│     └─ Template      -- an ImageLabel, copied per pass
│        ├─ NameLabel
│        └─ BuyButton  -- opens InfoModal
└─ InfoModal
   ├─ InfoName
   ├─ InfoPrice
   ├─ DescriptionFrame
   │  ├─ Description
   │  ├─ Rarity        -- hidden for a pass
   │  └─ Type
   ├─ Options
   │  ├─ Purchase
   │  ├─ Gift          -- optional
   │  └─ Cancel
   └─ GiftingFrame     -- optional
      ├─ RecipientBox
      └─ MessageBox
```

`Purchase` opens Roblox's purchase prompt, and reads `OWNED` for a pass the player has. The benefit applies straight away. A pass Roblox says isn't for sale is hidden, but its owners keep their benefits.

## Gifting A Pass

Roblox can't buy a game pass for someone else, so a gift is a **developer product** that grants the pass:

1. In the Creator Dashboard, create a developer product priced the same as the pass.
2. Put its ID in the pass's `giftProductId`.

The pass's shop panel then shows **Gift**. The first click opens `GiftingFrame` for a username and an optional note; the second sends it. The recipient gets the pass the next time they play, on any server. Gifting to someone who already owns it is refused before any payment. The note is text-filtered. The words are under `gifts` in `Config > Messages`.

::: warning Test with a real product
In Studio, a made-up product ID makes Roblox refuse the prompt, which shows as a cancelled gift.
:::

## Troubleshooting

| Problem | Check |
| :-- | :-- |
| The pass isn't in the shop | It isn't disabled, and it's for sale in this experience. |
| No Tool is given | `tool` matches a Tool in `ServerStorage > TicketShopItems > Tools`. |
| No VIP trail | `trail` matches a cosmetic and its model. |
| No VIP chat tag | `chatTag` matches a tag in `Config > Chat`. |
| One-time tickets given again | The pass's key was renamed. |
| No Gift button | Set `giftProductId`, and add `Gift` and `GiftingFrame` to `InfoModal`. |
| Every gift says cancelled | `giftProductId` isn't a product of this experience. |
