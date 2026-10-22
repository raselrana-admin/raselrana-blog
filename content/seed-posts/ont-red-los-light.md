---
title: "Why the ONT shows a red LOS light"
slug: ont-red-los-light
excerpt: "A red LOS light means not enough light reaches the ONT. Check the patch cord, the connectors and the splitter, in that order, with a power meter set to 1490 nm."
seoTitle: "ONT red LOS light: causes and fixes"
seoDescription: "Red LOS on a GPON ONT? Check the patch cord, connectors and splitter in this order, and confirm -25 dBm or better at 1490 nm."
category: "GPON & Fiber Optics"
contentType: "Troubleshooting"
topics: [ONT, LOS, OLT, optical power meter, dBm, SC/APC, splitter, fibre cleaning]
featuredImage:
  url: ""   # upload your own photo, 1600 x 900 or larger
  alt: "GPON ONT on a desk with its LOS light glowing red"
  suggestion: "Close-up of a real ONT front panel with LOS lit red, PON light off"
showOnMainSite: true
noindex: false
reviewNotes:
  - "Confirm the LOS/PON light behaviour matches the ONT models you use (Huawei, ZTE, etc.)"
  - "Add your own meter photo under 'Measure the light at the ONT' if you have one"
---

A red LOS (loss of signal) light on a GPON optical network terminal (ONT) means the ONT is not receiving enough light from the optical line terminal (OLT). The fault is almost always in the passive fibre path: a dirty or damaged connector, a bent or broken cable, or a problem at the splitter.

Work from the customer end back toward the OLT. Measure the light at each point with an optical power meter set to 1490 nm. The first point where the reading falls below -27 dBm is where the fault is.

## What you see when the ONT has LOS

- The LOS light is red, steady or blinking, depending on the vendor.
- The PON light is off or blinking, and the internet light is off.
- The ONT web page shows the received optical power as `--` or below -30 dBm.
- On the OLT, the ONT shows as offline with a last down cause of LOS.

If the OLT shows the last down cause as dying-gasp instead, the ONT lost power, not light. Check the adapter and the socket before you touch the fibre.

## Quick answer: clean the connectors and check the patch cord

Most LOS faults at a customer site are a dirty connector or a damaged patch cord. Clean both ends, look for kinks, and measure the light at the ONT. If the reading is still too low, the fault is further back: in the drop cable, the splitter or the feeder.

## Check in this order

### Look at the patch cord and its bends first

Follow the patch cord from the ONT to the wall box. A standard G.652D patch cord should not bend tighter than about 30 mm radius; a bend-insensitive G.657A2 drop cable tolerates about 7.5 mm.

- **Good:** smooth curves, no cable ties pulled tight, nothing pinched behind furniture.
- **Bad:** a sharp kink, a crushed section, a staple through the jacket, or a cord wrapped tightly around the ONT.

A visual fault locator (VFL), a red 650 nm laser, makes a break or a sharp bend glow through the jacket.

### Clean and inspect both connectors

Unplug the patch cord at the ONT and at the wall box. Clean every end face with a one-click cleaner, and inspect it with a fibre scope if you have one.

Check the connector colour as well. Green is SC/APC (angled), blue is SC/UPC (flat). Mating an APC connector with a UPC one adds several dB of loss and strong reflections, which is enough to trigger LOS on its own.

> [!WARNING]
> Never look into a live fibre or connector, even if you see no light. GPON uses infrared wavelengths you cannot see.

### Measure the light at the ONT

Disconnect the patch cord from the ONT, connect it to the power meter, and set the meter to 1490 nm (the GPON downstream wavelength).

| Reading at the ONT (1490 nm) | What it means |
|---|---|
| -8 dBm to -25 dBm | Good. The ONT should come up. |
| -25 dBm to -27 dBm | Marginal. It may work but drop when it rains or the cord moves. |
| Below -27 dBm | Below the sensitivity of a Class B+ ONT. Expect LOS. |
| No reading, or below -40 dBm | No light. A break, a disconnection or the wrong splitter port. |

A reading above -8 dBm is rare on a real network but overloads the receiver; it usually means the ONT is connected without a splitter in a test setup.

### Measure at the splitter output port

Open the splitter box and measure the output port that feeds this customer. With a typical OLT launch of +2 dBm to +5 dBm, a few kilometres of feeder and a 1:32 splitter (about 17 dB loss), expect roughly -15 dBm to -20 dBm at a splitter output.

- **Good at the splitter, bad at the ONT:** the fault is in the drop cable or the wall box.
- **Low on every splitter port:** the fault is in the feeder or at the OLT. Check whether other customers on the same splitter are also down.

### Check the OLT port

If every ONT on the same PON port is offline, the problem is at the OLT or in the feeder cable. Check the OLT port status and the transmit power of its SFP module, and check for recent work on the feeder route.

## Fix the cause you found

1. **Dirty connector:** clean it, re-measure, and plug it back in.
2. **Damaged patch cord:** replace it with one of the same polish type (SC/APC to SC/APC in most GPON networks).
3. **Bent or broken drop cable:** re-route it to remove the bend, or splice the break. A good fusion splice adds under 0.1 dB.
4. **Faulty splitter port:** move the drop to a spare port on the same splitter. The ONT stays registered on the same PON port, so no OLT change is needed.
5. **Feeder or OLT fault:** escalate with your readings. An optical time-domain reflectometer (OTDR) trace from the OLT end will show the distance to the fault.

## Confirm it is fixed

- The power meter reads -25 dBm or better at the ONT.
- The LOS light goes off and the PON light turns steady green within about two minutes.
- The OLT shows the ONT online, and its upstream receive power (1310 nm) at the OLT is inside the OLT's range.

Check both directions. A clean downstream reading with a poor upstream reading at the OLT points to a dirty connector that only affects one direction, or a reflective joint.

## Stop it happening again

- Keep dust caps on every unused port and connector.
- Clean every connector before you plug it in, even a new one.
- Leave slack in a loop, not a coil pulled tight, and keep cable ties loose.
- Label the splitter port for each customer so the next visit starts at the right port.
