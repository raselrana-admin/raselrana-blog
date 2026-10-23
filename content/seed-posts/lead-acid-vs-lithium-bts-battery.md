---
title: "Lead-acid or lithium (LiFePO4) for a BTS battery bank"
slug: lead-acid-vs-lithium-bts-battery
excerpt: "For a hot shelter with daily outages, LiFePO4 costs more upfront but usually less per year. Lead-acid still wins on a tight budget, rare outages or a cool, air-conditioned room."
seoTitle: "Lead-acid vs LiFePO4 for a BTS battery bank"
seoDescription: "Lead-acid or LiFePO4 for a 48 V telecom battery bank: usable capacity, life in hot shelters, cost per year, rectifier settings and when each wins."
category: "Telecommunications"
contentType: "Comparison"
topics: [BTS, battery bank, VRLA, LiFePO4, 48 V DC, rectifier, backup time, depth of discharge]
featuredImage:
  url: ""
  alt: "48 V VRLA battery bank beside a rack-mount LiFePO4 battery in a telecom shelter"
  suggestion: "Photo of both battery types in a shelter, site details not visible"
showOnMainSite: true
noindex: false
reviewNotes:
  - "Add current BDT quotes from your suppliers to the cost table before publishing"
  - "Confirm charge voltages against the datasheets of the batteries you actually use"
---

Choose lithium iron phosphate (LiFePO4) when the site has daily power cuts, a shelter that runs hot, or a tight space and weight limit. It costs more to buy but delivers more usable energy, lasts several times longer in heat, and usually works out cheaper per year.

Choose valve-regulated lead-acid (VRLA) when the budget for this year is the hard limit, outages are rare, or the batteries sit in a cool, air-conditioned room where they reach their rated life.

## The options against the factors that decide it

Figures are for a 48 V, 100 Ah bank. Lead-acid is four 12 V blocks in series; LiFePO4 is one 16-cell module (51.2 V nominal).

| Factor | VRLA lead-acid | LiFePO4 |
|---|---|---|
| Upfront cost (BDT) | Lower | About 2–3 times higher per kWh |
| Usable capacity | About 50 % of rated for long life | 80–90 % of rated |
| Cycle life | About 500–1,200 cycles at 50 % depth of discharge | About 3,000–6,000 cycles at 80 % |
| Life at 25 °C | 5–10 years design life | 10+ years |
| Life in a 35 °C shelter | About half of design life | Little change |
| Weight | About 120 kg | About 40–50 kg |
| Charge efficiency | About 80–85 % | About 95 % or better |
| Rectifier | Works with any telecom rectifier | Needs settings matched to the battery, often a BMS link |

> [!NOTE]
> Prices move with the exchange rate and supplier. Ask for quotes per bank on the same day before you compare.

## Usable energy decides the backup time

A 48 V, 100 Ah bank stores about 4.8 kWh on paper. Lead-acid gives long life only if you stop at about 50 % depth of discharge, so you can plan on about 2.4 kWh. LiFePO4 can deliver 80–90 % every day, about 4 kWh.

At a 1.2 kW site load, that is roughly 2 hours from lead-acid against more than 3 hours from LiFePO4 of the same Ah rating. To match LiFePO4's backup with lead-acid, you need a bank about 1.6–1.8 times larger.

## Heat shortens lead-acid life the most

VRLA design life is stated at 25 °C. As a rule of thumb, it halves for every 8–10 °C above that. A battery rated for 10 years at 25 °C lasts about 5 years at 35 °C and about 3 years in a shelter that sits at 40 °C through summer.

LiFePO4 tolerates heat far better and is commonly rated to discharge up to 45–55 °C. Where shelter air conditioning fails often, this factor alone usually decides it.

## Cost per year, not price per bank

Compare the cost of each usable kilowatt-hour over the battery's life:

```text
cost per usable kWh per year = bank price ÷ (rated kWh × usable fraction × expected years)
```

As an example of how the ratio works, suppose LiFePO4 costs 2.5 times as much as lead-acid. It gives about 1.7 times the usable energy and, in a hot shelter, lasts about 3 times as long. Per usable kilowatt-hour per year, it costs roughly half as much as lead-acid. In a cool room, where lead-acid reaches its full design life, the gap closes.

## Charging and the rectifier

A 24-cell VRLA string floats at about 53.5–54.5 V (2.23–2.27 V per cell), and every telecom rectifier supports it.

LiFePO4 needs a charge voltage, float voltage and current limit set for that battery, typically around 56 V charge for a 16-cell module. Many telecom LiFePO4 modules talk to the rectifier controller through a battery management system (BMS). Check that your rectifier supports the module before you buy, and set the low-voltage disconnect to the battery's value, not the old lead-acid one.

## Weight, space and security

LiFePO4 weighs about a third as much and fits in the rack, which matters on rooftop sites and in small cabinets. Both types are stolen from unmanned sites. Rack-mount modules can be locked in, and many have a BMS that reports location or disconnects if removed, which some operators use against theft.

## Which to choose, by situation

- **Daily outages, hot shelter, rooftop or small cabinet:** LiFePO4.
- **Cooled room, outages a few times a month, tight capital budget:** VRLA.
- **Old rectifier that cannot be set for lithium:** VRLA, or budget for a controller upgrade alongside LiFePO4.
- **Mixing types:** do not put lead-acid and lithium on the same DC bus without a controller designed for it. Replace the whole bank with one type.
