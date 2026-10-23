---
title: "One-way audio on SIP calls behind NAT"
slug: sip-one-way-audio-nat
excerpt: "One-way audio almost always means the voice (RTP) is sent to a private IP address. Turn off SIP ALG on the router, set the PBX's external address and forward the RTP ports."
seoTitle: "SIP one-way audio behind NAT: causes and fixes"
seoDescription: "One side can't hear on SIP calls? Find the private IP in the SDP, turn off SIP ALG, set Asterisk's external address and forward the RTP port range."
category: "VoIP & IP-PBX"
contentType: "Troubleshooting"
topics: [SIP, RTP, NAT, SIP ALG, Asterisk, PJSIP, SDP, sngrep]
featuredImage:
  url: ""
  alt: "sngrep call flow with the private IP address in the SDP highlighted"
  suggestion: "Screenshot of sngrep showing an INVITE with c=IN IP4 192.168.x.x, real IPs blurred"
showOnMainSite: true
noindex: false
reviewNotes:
  - "Name the Asterisk version you tested on (e.g. 20 LTS or 22 LTS) in the post"
  - "203.0.113.10 is a documentation address; keep it, do not put a real public IP"
---

One-way audio on a SIP call means the call connects and one side hears the other, but not the reverse. The signalling (SIP) works; the voice packets (RTP) are being sent to an address that cannot be reached, almost always a private IP address behind NAT.

Fix it in three places: turn off SIP ALG on the router, tell the PBX its public address and local network, and forward the RTP port range to the PBX.

## What you see

- The call rings and connects, and the call timer runs.
- One party hears the other clearly; the other hears silence.
- It happens on every call through the same router, or only for phones outside the office.
- The PBX log shows the call answered normally, with no error.

If calls instead drop after about 30 seconds, the cause is related but different: the final SIP acknowledgement is not reaching the far end. The checks below find that too.

## Quick answer: a private IP in the SDP

When a phone or PBX starts a call, its SIP message carries a session description (SDP) that says where to send the audio. Behind NAT, that address is often the private one, such as `192.168.1.20`. The far end sends audio there, and it never arrives.

A router's SIP ALG (application layer gateway), meant to rewrite these addresses, often gets it wrong and makes things worse.

## Check in this order

### Capture one call and read the SDP

On the PBX, run `sngrep` and make a test call. Open the INVITE or the 200 OK and find the connection line:

```text
c=IN IP4 192.168.1.20
m=audio 14872 RTP/AVP 8 0 101
```

- **Good:** the `c=` address is the public IP the other side can reach.
- **Bad:** it is a private address (`10.x`, `172.16–31.x`, `192.168.x`) on a message that leaves your network.

### Check the router for SIP ALG

Most home and office routers have a setting called SIP ALG, SIP helper or SIP passthrough. On MikroTik it is the `sip` service port:

```routeros
/ip firewall service-port print
```

- **Good:** SIP ALG is off, and the PBX handles NAT itself.
- **Bad:** it is on. Firmware upgrades often turn it back on.

### Check that RTP reaches the PBX

On Asterisk, watch the audio packets during a call:

```bash
asterisk -rx "rtp set debug on"
```

- **Good:** you see both `Sent RTP packet to` and `Got RTP packet from` lines for the call.
- **Bad:** only `Sent` lines. Audio from outside is not getting in, so the RTP ports are not forwarded or a firewall drops them.

## Fix

### Turn off SIP ALG

On MikroTik:

```routeros
/ip firewall service-port set sip disabled=yes
```

On other routers, find SIP ALG in the firewall or NAT settings and disable it, then reboot the router so old connections clear.

### Set the PBX's external address

In Asterisk `pjsip.conf`, tell the transport its public address and which networks are local:

```ini
[transport-udp]
type=transport
protocol=udp
bind=0.0.0.0:5060
local_net=192.168.1.0/24
external_media_address=203.0.113.10
external_signaling_address=203.0.113.10
```

For each endpoint that can be behind NAT, send audio back to where it actually came from:

```ini
[1001]
type=endpoint
direct_media=no
rtp_symmetric=yes
force_rport=yes
rewrite_contact=yes
```

Reload with `asterisk -rx "pjsip reload"`.

### Forward the RTP port range

Check the range in `rtp.conf`:

```ini
[general]
rtpstart=10000
rtpend=20000
```

Forward UDP 5060 and UDP 10000–20000 from the router to the PBX, and allow them in the PBX's own firewall. To limit exposure, allow SIP only from your provider's and remote users' addresses where you can.

> [!TIP]
> On remote IP phones, turn on NAT keep-alive (often every 20–30 seconds). It keeps the phone's NAT mapping open so incoming calls and audio still reach it.

## Confirm it is fixed

- `sngrep` shows the public address in the `c=` line of SDP leaving your network.
- `rtp set debug on` shows packets in both directions.
- Test calls both ways, inside and outside the office, last past two minutes with audio both ways.

## Stop it happening again

Write down the ports and settings you changed, and recheck SIP ALG after every router firmware upgrade or replacement.
