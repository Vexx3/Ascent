# Game Passes

Game passes are set up in `Config > GamePasses`, one entry per pass. Roblox already
knows each pass's name, description, picture and price, so Config only says what
the pass gives.

## The passes the kit comes with

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

Both start with `id = 0`, which means they're **off**. To turn one on:

1. Create the pass in the Creator Dashboard, under **Monetization > Passes**.
2. Copy its ID into `id`.

If you won't sell a pass, set `disabled = true` on it.

| Setting | For | What it does |
| :-- | :-- | :-- |
| `id` | All passes | The pass's Roblox ID. `0` means off. |
| `kind` | All passes | What the pass is: `"Tool"`, `"VIP"`, `"PersonalServers"` or `"SaveSlots"`. |
| `disabled` | All passes | Turns the pass off. |
| `giftProductId` | All passes | A developer product that gifts the pass. See [Gifting a pass](#gifting-a-pass). |
| `tool` | `Tool` | The Tool the pass gives. |
| `ticketMultiplier` | `VIP` | Multiplies the tickets the owner earns. |
| `trail` | `VIP` | A trail the pass unlocks. |
| `chatTag` | `VIP` | A chat tag from `tags.styles` in `Config > Chat`. |
| `tickets` | `VIP` | Tickets given once, when the player first has the pass. |

The key (`VIP`) is saved with everyone who owns the pass, so don't rename it after
release.

- A `PersonalServers` pass lets its owners make
  [personal servers](./worlds-personal-servers.md#personal-servers).
- A `SaveSlots` pass unlocks the [saved run slots](./saved-runs.md#set-it-up) that
  ask for it.

## Add a Tool pass

```luau
MyToolPass = {
	id = 1234567890,
	kind = "Tool",
	tool = "My Tool",
},
```

Put a Tool with exactly that name in `ServerStorage > TicketShopItems > Tools`.
Owners always have one copy, which comes back every time they respawn. You can add
as many Tool passes as you like.

## In the shop

Every pass that's on sale is listed on the shop's Featured page. Its **Purchase**
button opens Roblox's purchase prompt, and reads `OWNED` once the player has the
pass. What the pass gives arrives straight away.

A pass that's no longer for sale on Roblox is hidden from the shop, but people who
own it keep everything it gives.

## Gifting a pass

Roblox doesn't let players buy a game pass for someone else, so a gift is a
**developer product** that gives the pass:

1. In the Creator Dashboard, create a developer product with the same price as the
   pass.
2. Put the product's ID in the pass's `giftProductId`.

The pass's shop panel now has a **Gift** button. It asks for a username, and the
other player gets the pass the next time they play. The gift messages are in the
`gifts` group of `Config > Messages`.

::: warning Test with a real product
In Studio, a made-up product ID makes Roblox refuse the purchase prompt, which
shows up as a cancelled gift.
:::

## Troubleshooting

| Problem | Check |
| :-- | :-- |
| The pass isn't in the shop | It isn't `disabled`, and it's on sale in this experience. |
| No Tool is given | `tool` matches a Tool in `ServerStorage > TicketShopItems > Tools`. |
| No VIP trail | `trail` matches a trail in `Config > Economy` and its model. |
| No VIP chat tag | `chatTag` matches a tag in `Config > Chat`. |
| The one-time tickets were given again | The pass's key was renamed. |
| There's no Gift button | Set `giftProductId`. If it's set, the plugin's **Check** window names any missing part of the shop panel. |
| Every gift says cancelled | `giftProductId` isn't a developer product of this experience. |
