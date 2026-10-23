---
title: "Size a UPS for a small server rack"
slug: size-ups-small-server-rack
excerpt: "Add up the real load in watts, add 25 % headroom, then choose the VA rating from the UPS power factor. Size the batteries from the runtime chart, not the Ah on the label."
seoTitle: "How to size a UPS for a small server rack"
seoDescription: "Size a UPS for a server rack: measure the real load, add headroom, convert watts to VA, and pick batteries from the runtime chart for the backup you need."
category: "IT & Technology"
contentType: "How-to"
topics: [UPS, VA rating, power factor, runtime, load calculation, battery backup, server rack]
featuredImage:
  url: ""
  alt: "Online UPS at the bottom of a small server rack showing 48 % load on its display"
  suggestion: "Photo of your rack UPS display showing load % and battery level"
showOnMainSite: true
noindex: false
reviewNotes:
  - "Replace the example rack with your own measured loads if you have them"
---

To size a UPS, measure what the equipment actually draws in watts, add 25 % for growth, and pick a UPS whose watt rating covers that. Then choose the batteries from the manufacturer's runtime chart for the backup time you need. The nameplate on a power supply and the Ah on the battery label both mislead, so neither should decide it.

This guide sizes an online UPS for a small rack: a switch, two servers, a network video recorder (NVR) and a router.

## What you will end up with, and what you need

- **Result:** a UPS rating in VA and W, and a battery configuration that gives a stated runtime, for example 30 minutes.
- **A list of every device** that will run from the UPS.
- **A way to measure the load:** a clamp meter on the rack's feed, a metered PDU, or the display of an existing UPS.
- **The runtime chart** of the UPS models you are considering, from the datasheet or supplier.

## Steps

### 1. Measure the real load in watts

Measure the whole rack while it works normally, not at idle. A server with a 550 W power supply often draws 150–250 W; the power supply rating is its maximum, not its use.

If you can only measure current, multiply by voltage: 2.1 A at 230 V is about 480 VA. Treat that as watts for sizing; it errs on the safe side.

An example rack:

| Device | Measured draw |
|---|---|
| Core switch, 24 ports | 45 W |
| Two servers | 2 × 180 W = 360 W |
| NVR | 35 W |
| Router | 25 W |
| ONT and small devices | 15 W |
| **Total** | **480 W** |

### 2. Add headroom

Multiply by 1.25 to leave room for growth and for start-up peaks:

```text
480 W × 1.25 = 600 W
```

Running a UPS at 50–80 % of its rating also keeps it cooler and gives longer battery runtime.

### 3. Convert watts to VA

A UPS has two limits: VA and W. Divide by the UPS output power factor from its datasheet; current online UPS models are usually 0.9 or 1.0.

```text
600 W ÷ 0.9 = 667 VA
```

A 1 kVA / 900 W online UPS covers this rack at about 53 % load (480 W of 900 W). Check both numbers: the load must stay under the VA rating and under the W rating.

### 4. Choose online double-conversion where power is unstable

An online (double-conversion) UPS makes clean output all the time, so voltage swings, frequent cuts and generator frequency drift never reach the servers. A line-interactive UPS is cheaper and fine for a desktop, but switches to battery more often on an unstable supply, which wears the batteries.

### 5. Size the batteries from the runtime chart

First work out the energy needed, allowing about 90 % inverter efficiency:

```text
480 W × 0.5 h ÷ 0.9 ≈ 267 Wh
```

Then use the runtime chart, not this number, to choose. Lead-acid batteries deliver much less than their rated capacity at high current. A 1 kVA UPS with three internal 12 V 9 Ah batteries holds about 324 Wh on the label, but at 480 W it runs for only a few minutes.

For 30 minutes, choose a long-backup model with an external battery bank, and pick the bank that the chart shows giving at least 36 minutes at your load. The extra 20 % covers the capacity batteries lose as they age.

### 6. Plan the input and outputs

- A 1 kVA UPS at 230 V draws about 4.3 A, plus charging current. A 16 A circuit with its own breaker is enough.
- Count the outlets and their type (C13 or C19) against your plugs, or add a PDU.
- Keep laser printers and heaters off the UPS. Their start-up current overloads it.

## Check it works

1. With everything running, read the load on the UPS display. It should be close to your estimate (here, about 50–55 %).
2. Outside working hours, switch off the UPS input breaker and time how long the UPS runs until its low-battery alarm. Compare it with the runtime you sized for.
3. Switch the input back on and confirm the UPS returns to mains and starts charging.

> [!WARNING]
> Run the battery test at a quiet time with someone at the rack. If the batteries are weaker than expected, the servers will lose power.

## Common problems

- **The UPS beeps overload when something starts:** a device with a high start-up current is on it. Move it to mains.
- **Runtime falls after two or three years:** normal for lead-acid, faster in a hot room. Plan to test every six months and replace batteries every 3–5 years.
- **The UPS stays on battery while the generator runs:** the generator's frequency is outside the UPS input range. Widen the input frequency tolerance in the UPS settings if the model allows it.
