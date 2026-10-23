---
title: "How 802.1Q VLAN tags keep traffic apart on one cable"
slug: how-vlan-tagging-works
excerpt: "An 802.1Q tag adds 4 bytes to each Ethernet frame, carrying a 12-bit VLAN ID. Switches use that number to keep up to 4,094 networks separate on the same ports and cables."
seoTitle: "How 802.1Q VLAN tagging works"
seoDescription: "What an 802.1Q tag adds to a frame, how access and trunk ports use it, what the native VLAN is, and the numbers that limit a VLAN design."
category: "Networking"
contentType: "Explainer"
topics: [VLAN, 802.1Q, trunk port, access port, native VLAN, Ethernet frame, QinQ]
featuredImage:
  url: ""
  alt: "Managed switch with colour-coded patch cables for three VLANs"
  suggestion: "Rack switch with patch cords in different colours per VLAN"
showOnMainSite: true
noindex: false
reviewNotes:
  - "Add a real example from your own network (VLAN numbers changed) under 'Where VLANs show up in real work'"
---

A virtual LAN (VLAN) splits one physical switch network into several separate ones. The switch marks each Ethernet frame with a number, the VLAN ID, and only delivers it to ports that belong to that VLAN. Under the IEEE 802.1Q standard, that mark is a 4-byte tag inserted into the frame, and its 12-bit ID allows 4,094 usable VLANs.

Devices at the edge usually never see the tag. The switch adds it when a frame enters, carries it across the links between switches, and removes it before the frame leaves toward a PC, camera or phone.

## How a frame travels through a VLAN

Follow one frame from a PC in VLAN 20 to a server in VLAN 20 on another switch:

1. **The PC sends a normal, untagged frame.** It has no idea VLANs exist.
2. **The access port assigns the VLAN.** The switch port is set as an access port in VLAN 20, so the switch treats the frame as VLAN 20.
3. **The trunk carries the tag.** To reach the second switch, the frame leaves on a trunk port, a link that carries many VLANs. Here the switch inserts the 802.1Q tag with VLAN ID 20.
4. **The second switch reads the tag.** It looks up the destination MAC address only among VLAN 20 ports.
5. **The access port removes the tag.** The server's port is an access port in VLAN 20, so the frame leaves untagged.

A frame in VLAN 30 can cross the same trunk at the same moment and never reach VLAN 20 ports. To move traffic between VLANs, a router or layer 3 switch has to route it, which is also where you apply firewall rules between them.

## What the 4-byte tag contains

The tag sits between the source MAC address and the EtherType field.

| Field | Size | What it holds |
|---|---|---|
| TPID (tag protocol identifier) | 16 bits | `0x8100`, which says "this frame is tagged" |
| PCP (priority code point) | 3 bits | Priority 0–7, used for QoS (voice is often 5) |
| DEI (drop eligible indicator) | 1 bit | Marks frames that can be dropped first under congestion |
| VID (VLAN identifier) | 12 bits | The VLAN number, 0–4095 |

## The numbers that matter

- **Usable VLAN IDs: 1–4094.** ID 0 means "priority tag only, no VLAN", and 4095 is reserved.
- **Frame size grows by 4 bytes.** The largest standard frame goes from 1,518 to 1,522 bytes. Switches handle this, but older or cheap devices in the path may drop tagged full-size frames.
- **QinQ adds another 4 bytes.** IEEE 802.1ad stacks an outer tag (TPID `0x88A8`) around the customer's tag, so a carrier can carry many customers' VLANs inside one of its own. Every link must then pass at least 1,526-byte frames.
- **VLAN 1 is the default** on most switches. Leave it unused for user traffic so a forgotten port does not land in a live network.

## Access ports, trunk ports and the native VLAN

An **access port** belongs to one VLAN and sends and receives untagged frames. A **trunk port** carries several VLANs, tagged.

A trunk can also carry one VLAN untagged: the **native VLAN** (on MikroTik and many others, the port's PVID). Untagged frames arriving on the trunk are put in it. Both ends of a trunk must agree on the native VLAN; if they do not, traffic from one VLAN silently appears in another.

## Where VLANs show up in real work

- **GPON and broadband:** an ONT often carries internet on one VLAN, VoIP on another and IPTV on a third, all on the same fibre. A wrong VLAN ID on the ONT's WAN connection is a common reason a new connection gets no address.
- **Offices:** staff, guest Wi-Fi, IP phones and CCTV each get their own VLAN, so a guest cannot reach a camera's web page.
- **Router on a stick:** one router port with several VLAN sub-interfaces routes between VLANs that all arrive on one trunk.

On a MikroTik switch or router, a basic access port in VLAN 20 plus a trunk looks like this:

```routeros
/interface bridge add name=br1 vlan-filtering=no
/interface bridge port add bridge=br1 interface=ether2 pvid=20
/interface bridge port add bridge=br1 interface=ether5
/interface bridge vlan add bridge=br1 vlan-ids=20 tagged=br1,ether5 untagged=ether2
/interface bridge set br1 vlan-filtering=yes
```

> [!WARNING]
> Turn on `vlan-filtering` last, while connected through a port the change does not affect. Turning it on with the wrong port settings can cut your own management access.

For the next step, see how a MikroTik hands out PPPoE sessions on a customer-facing port or VLAN in [Set up a PPPoE server on MikroTik RouterOS 7](/blog/mikrotik-pppoe-server).
