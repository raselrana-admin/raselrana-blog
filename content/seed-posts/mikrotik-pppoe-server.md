---
title: "Set up a PPPoE server on MikroTik RouterOS 7"
slug: mikrotik-pppoe-server
excerpt: "Create an IP pool, a PPP profile with a speed limit, user secrets and a PPPoE server on one port, then NAT the pool to the internet and confirm sessions in /ppp active."
seoTitle: "PPPoE server on MikroTik RouterOS 7: step by step"
seoDescription: "Set up a PPPoE server on MikroTik RouterOS 7: IP pool, PPP profile with rate limit, secrets, server, NAT, and how to check that users connect."
category: "MikroTik"
contentType: "How-to"
topics: [PPPoE, RouterOS 7, PPP profile, IP pool, rate limit, NAT, Winbox]
featuredImage:
  url: ""
  alt: "MikroTik Winbox showing active PPPoE sessions in the PPP window"
  suggestion: "Winbox screenshot of PPP > Active Connections with usernames and addresses blurred"
showOnMainSite: true
noindex: false
reviewNotes:
  - "Test every command on your RouterOS version and put that exact version in the first section (e.g. 7.16)"
---

This guide sets up a MikroTik router as a PPPoE server: customers on one port dial in with a username and password, get an address from a pool, are limited to a set speed, and reach the internet through NAT. It takes about ten minutes on a fresh router.

The commands are for RouterOS 7. You can paste them into the terminal in Winbox, or make the same settings in the Winbox menus named in each step.

## What you will end up with, and what you need

- **Result:** PPPoE clients on `ether2` get an address from `100.64.10.0/24`, a 10 Mbps limit each way, and internet access through `ether1`.
- **Router:** any MikroTik running RouterOS 7, with full admin access.
- **WAN:** working internet on `ether1` (DHCP client, static address or upstream PPPoE).
- **Customer side:** `ether2`, a bridge or a VLAN interface facing the customers. It needs no IP address of its own.

The pool uses `100.64.0.0/10`, the shared address space set aside for carrier NAT, so it never clashes with a customer's home network.

## Steps

### 1. Create the address pool

```routeros
/ip pool add name=pppoe-pool ranges=100.64.10.2-100.64.10.254
```

This gives 253 addresses. The router keeps `100.64.10.1` for itself in the next step.

### 2. Create a PPP profile with the speed limit

```routeros
/ppp profile add name=pppoe-10m local-address=100.64.10.1 \
    remote-address=pppoe-pool dns-server=1.1.1.1,8.8.8.8 \
    rate-limit=10M/10M only-one=yes change-tcp-mss=yes
```

- `rate-limit` creates a dynamic queue for each session.
- `only-one=yes` stops the same username logging in twice.
- `change-tcp-mss=yes` adjusts TCP packets to the smaller PPPoE MTU, which prevents pages that half-load.

> [!TIP]
> In `rate-limit`, the first value is what the router receives (the customer's upload) and the second is what it sends (the customer's download). `5M/20M` gives 5 Mbps up and 20 Mbps down.

### 3. Add a secret for each customer

```routeros
/ppp secret add name=user01 password=CHANGE-ME service=pppoe profile=pppoe-10m
/ppp secret add name=user02 password=CHANGE-ME service=pppoe profile=pppoe-10m
```

Use a long, unique password for each customer. To give one customer a fixed address, add `remote-address=100.64.10.50` to their secret, outside the range you expect the pool to hand out first, or shrink the pool.

### 4. Start the PPPoE server on the customer port

```routeros
/interface pppoe-server server add service-name=isp interface=ether2 \
    default-profile=pppoe-10m authentication=chap,mschap2 \
    max-mtu=1480 max-mru=1480 one-session-per-host=yes disabled=no
```

An MTU of 1480 leaves room for the 8-byte PPPoE header with margin. If an old client only supports PAP, add `pap` to `authentication`, knowing that PAP sends the password in clear text.

### 5. NAT the pool to the internet

```routeros
/ip firewall nat add chain=srcnat src-address=100.64.10.0/24 \
    out-interface=ether1 action=masquerade comment="PPPoE clients"
```

### 6. Remove anything else serving `ether2`

If a DHCP server or a bridge with a DHCP server still covers `ether2`, customers can get an address without logging in. Check and disable it:

```routeros
/ip dhcp-server print
```

## Check it works

1. Connect a test router or a PC to `ether2` and dial PPPoE with `user01`.
2. On the MikroTik, list the active sessions:

   ```routeros
   /ppp active print
   ```

   The user appears with an address from `100.64.10.0/24`.

3. Confirm the speed limit queue was created:

   ```routeros
   /queue simple print where dynamic
   ```

   You should see a queue named `<pppoe-user01>` with a 10M/10M limit.

4. Run a speed test on the client. It should top out close to 10 Mbps each way.

## Common problems

| Symptom | Likely cause | Fix |
|---|---|---|
| Client never gets an offer | Server on the wrong interface or VLAN | Check `/interface pppoe-server server print` |
| "Authentication failed" | Wrong password, or the client only speaks PAP | Re-enter the secret, or allow `pap` |
| Connected, but no web pages | Missing NAT rule or DNS | Recheck steps 2 and 5 |
| Some sites half-load | MSS too large | Make sure `change-tcp-mss=yes` is on the profile |
| Second login is refused | `only-one=yes` | Expected; disconnect the old session in `/ppp active` |

For anything else, watch the log while the client dials:

```routeros
/log print follow where topics~"pppoe"
```
