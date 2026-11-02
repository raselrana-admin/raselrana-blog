# Blog post writing guide

Oct 30, 2026 · @Rasel Rana

## Who you are writing for

Write every post for one person: an engineer or technician who searched for a problem and has your page open next to the equipment. They want the answer, the steps, and the numbers that tell them it worked.

- **Most readers arrive from search** with a fault to fix (an ONT showing LOS, a dropped PPPoE session) or a task to do (set up a VLAN, size a battery bank). The blog home sends them in by need: Troubleshooting, How-to, Explainer, Comparison.
- **Peers and recruiters come second.** They judge you by whether the post is correct, specific and drawn from real work, not by how polished the prose is.
- **A good post answers in the first two paragraphs**, then gives the detail. If a reader stops after the intro, they should still know what to do or what the answer is.

## Pick the post type first

Choose the content type before you write a word: it decides the outline, and it is how readers find the post from the home page. Each post has exactly one.

| Type | The reader's question | Title pattern | Example |
| --- | --- | --- | --- |
| Troubleshooting | "Something is broken. Why, and how do I fix it?" | The symptom, as the reader would type it | Why the ONT shows a red LOS light |
| How-to | "How do I set this up?" | The task and its result | Set up a PPPoE server on MikroTik |
| Explainer | "How does this work?" | The thing, and the angle | How GPON splits one fibre between 64 homes |
| Comparison | "Which one should I choose?" | The options and the deciding factor | Lead-acid or lithium for a BTS battery bank |

Use these outlines as the `##` headings. Rename them to fit the post; keep the order.

**Troubleshooting**

1. The symptom: what the reader sees (lights, alarms, error text, readings).
2. Quick answer: the most likely cause and fix in two or three sentences.
3. Check in this order: one `###` per check, cheapest and most likely first, each with what a good and a bad result looks like.
4. Fix: the steps for each cause.
5. Confirm it is fixed: the reading or behaviour that proves it.
6. Stop it happening again (optional).

**How-to**

1. What you will end up with, and what you need first (hardware, firmware version, access).
2. Steps, numbered, one action each, with the exact commands or settings.
3. Check it works.
4. Common problems (optional).

**Explainer**

1. The one-paragraph answer.
2. How it works, in the order the signal, power or data actually flows.
3. The numbers that matter (budgets, limits, typical values).
4. Where it shows up in real work.

**Comparison**

1. The short answer: which to choose, and when the other wins.
2. A table of the options against the factors that decide it (cost in BDT, lifespan, capacity, maintenance).
3. One section per deciding factor.
4. Recommendation by situation.

## Title, address and summary

The title and excerpt are what people see in search results, on the blog home and in link previews, so write them last, once you know what the post says.

| Field | Limit | Rule | Example |
| --- | --- | --- | --- |
| Title | 200 characters; aim for 50–70 | Say the problem or task in the reader's words. Use sentence case. No clickbait, no "Ultimate guide". | Why the ONT shows a red LOS light |
| Slug (address) | 120 characters | Filled from the title. Shorten it to the key words, lower case, hyphens. Decide before publishing: an old address redirects, but can never be reused. | ont-red-los-light |
| Excerpt | 300 characters; aim for 150–200 | One or two sentences that give the answer or the outcome. Needed to publish. Shown on the home list (two lines) and used as the description. | A red LOS light means no light reaches the ONT. Check the patch cord, connectors and splitter, in that order. |
| SEO title | 60 characters, optional | Only when the title is too long for search results. | ONT red LOS light: causes and fixes |
| SEO description | 160 characters, optional | Only when the excerpt is longer than 160 characters or reads badly in search. The editor warns if it is empty; the excerpt is used instead. | Red LOS on a GPON ONT? Check the patch cord, connectors and splitter in this order. |

Avoid putting the date or "2026" in a title or slug: the post should stay useful, and "Last updated" carries the freshness.

## Structure and length

Aim for 600–1,500 words; the editor warns below 300. Length follows the problem: a how-to with ten steps needs more words than an explainer of one idea, and padding hurts both.

- **Start with the answer.** No "In this post I will…" and no history lesson. The first paragraph says what is wrong, what to do, or how it works.
- **Use `##` for sections and `###` inside them.** Never `#`: the title is already the page's one main heading. Three or more `##`/`###` headings make a table of contents appear beside the post, and every heading gets a `#` link readers can share.
- **Write headings as answers or actions**, so the table of contents reads like a summary: "Check the patch cord first", not "Step 2" or "Analysis".
- **Keep paragraphs to 2–4 sentences.** Long paragraphs on a phone become a wall.
- **Use numbered lists for steps that happen in order**, and bullets for items that do not. One action per step.
- **Put every command, config line and log message in a code block**, so readers can copy it with one click.
- **Use a table when you compare values** across items (light levels, battery types, port settings), not a paragraph of numbers.
- **End when you are done.** No "Conclusion" that repeats the post. If there is a next step, link to the post that covers it.

## Writing style

Write the way you would explain it to a colleague at the site: plain words, real numbers, first person when it is your own experience.

- **Be specific.** Give the value, the unit and the condition: "-27 dBm or better at the ONT", not "good signal".
- **Use active voice and say who acts.** "Clean the connector", not "The connector should be cleaned".
- **Explain an abbreviation the first time** it appears: "optical line terminal (OLT)". After that, the short form is fine.
- **Use SI units with a space**: 48 V, 200 Ah, 1.5 km, -25 dBm. Write money in BDT.
- **Say where it comes from.** Separate what you measured or saw on site from what a datasheet or standard says, and link the source.
- **Name versions.** RouterOS 7.14, firmware dates, model numbers: steps change between versions.
- **Keep it about the work.** Leave out anything that identifies a customer, a site's exact location, passwords, IP addresses of live equipment or internal BTCL documents.

| Instead of | Write |
| --- | --- |
| It is important to note that the signal level should be checked. | Check the light level first. |
| The power was found to be insufficient. | The ONT received -31 dBm, 4 dB below its -27 dBm sensitivity. |
| Utilise a suitable cleaning tool. | Clean the connector with a one-click cleaner. |
| There are many factors to consider. | Two things decide it: backup time and budget. |

## Markdown you can use

The editor takes GitHub-style Markdown, with a live preview that matches the published page. Raw HTML is dropped, so use these instead.

**Code, commands and logs.** Name the language after the opening fence for colours (`bash`, `routeros`, `json`, `yaml`, `python`). Every block gets a Copy button.

````markdown
```bash
/interface pppoe-server server add service-name=isp interface=ether2
```
````

**Callout boxes** for a tip, a side note, or something that can damage equipment or cause an outage. Use them sparingly: one or two per post.

```markdown
> [!NOTE]
> The OLT port numbering starts at 0 on this model.

> [!TIP]
> Clean both connectors before you replace a patch cord.

> [!WARNING]
> Never look into a live fibre or connector.
```

**A photo with a caption**: put the caption in quotes after the address.

```markdown
![Light meter showing -18.4 dBm](https://res.cloudinary.com/... "Reading at the ONT after cleaning")
```

**A photo grid**: two or more images on lines directly under each other, with nothing else in that paragraph. Each opens full size.

```markdown
![Splitter box before](https://res.cloudinary.com/...)
![Splitter box after](https://res.cloudinary.com/...)
```

**A YouTube video**: paste the address alone on its own line. It shows a thumbnail and loads the player only when clicked. A YouTube link inside a sentence stays a normal link.

```markdown
https://www.youtube.com/watch?v=VIDEO_ID
```

**Tables, task lists and strikethrough** work as on GitHub. Wide tables scroll sideways on phones instead of breaking the page.

**Links**: write link text that says where it goes ("the ITU-T G.984 standard"), never "click here". Links to other sites open in a new tab by themselves.

**Links to tools**: use the full address, starting with `https://raselrana.com.bd/tools`. It counts as part of your own site, so it opens as a normal link in the same tab.

## Images

Every published post needs a featured image with a description. Use your own photos from the work wherever you can: they are proof you did it.

- **Featured image:** landscape, at least 1600 × 900 px (16:9). It shows full width above the post, on the home page when the post is newest, and as the link preview when someone shares the post. Keep the subject in the middle: cards crop the edges.
- **Files:** JPG, PNG, WebP, GIF or AVIF, up to 5 MB each. No SVG. Images are resized for each screen automatically, so upload the original.
- **In the post:** use the Image button in the editor toolbar. It asks for the description and an optional caption, then puts the Markdown line at the cursor; the Gallery button does the same for a photo grid. Add a photo only when it shows something the text cannot: a reading on a meter, a wiring layout, a screen.
- **Screenshots:** crop to the part that matters, and blur passwords, IP addresses, serial numbers and customer names before uploading.

**Alt text** (the image description) is read aloud by screen readers and shown when an image fails to load. It is needed to publish the featured image, and the editor warns when an image in the post has none.

| Instead of | Write |
| --- | --- |
| image1 | Fibre splitter box with eight drop cables, two unlabelled |
| Photo of meter | Optical power meter reading -18.4 dBm at 1490 nm |
| Screenshot | MikroTik Winbox showing three active PPPoE sessions |

Describe what the reader needs from the picture, in one sentence under 200 characters. Do not start with "Image of".

## Category, topics and settings

Every published post needs one category; topics and the rest are what make it findable.

| Setting | Rule |
| --- | --- |
| Category | Exactly one, the field the post belongs to: Telecommunications, Networking, GPON & Fiber Optics, VoIP & IP-PBX or IT & Technology. Needed to publish. Pick the most specific one. |
| Content type | The type you chose in "Pick the post type first". |
| Topics | 3–8 specific terms a reader would search for: equipment, protocols, measurements (ONT, PPPoE, dBm, VLAN). Pick from the suggestions before typing a new one, so one topic is not spelled two ways. Do not repeat the category name. The editor warns below 3. |
| Related posts | Up to 4, chosen by hand. Link the post a reader needs next or before this one. Any free places are filled with posts that share the most topics, then posts from the same category. |
| Publish date | Leave empty and the main button says Publish. Enter a future date (Dhaka time) and it says Schedule; the post then goes live by itself at that time. |
| Show on main site | On by default: the newest posts appear on raselrana.com.bd's home page. Turn it off for small or niche posts. |
| Hide from search engines (noindex) | Only for a post that should be reachable by its link but not listed or found in search. |
| Social image address | Leave empty. The featured image is used for link previews. Only set it for a purpose-made 1200 × 630 image. |
| Canonical address | Leave empty, unless the post first appeared somewhere else; then put that original address here. |

## Write in a file, then import

You can write the post as a `.md` file and press **Import .md file** in the editor. The file fills the settings and the content, the preview shows the post, and a short list says what is left to do. Nothing is published: check it, add the images, then press Publish.

The file starts with a header between `---` lines, followed by the post in Markdown:

```markdown
---
Status: Ready for review
Title: What is GPON, and why it replaced ADSL for home broadband
Slug: what-is-gpon
Excerpt: GPON carries internet and phone to homes over one fibre.
Content type: Explainer
Category: GPON & Fiber Optics
Topics: FTTH, OLT, ONT, optical splitter
Related posts: how-gpon-works (once published)
Publish date: 2026-11-05 09:30
Show on main site: Yes
Noindex: No
Featured image idea: One fibre fanning out to six homes
Featured alt: One fibre fanning out to six homes, labelled GPON
SEO title:
SEO description: GPON brings fibre to homes through passive splitters.
---

GPON (Gigabit-capable Passive Optical Network) is…
```

- **Empty fields** are skipped, and so is `Status`, which is only a note for you.
- **Category** must match an existing category, and **Content type** one of the four types. The list after the import names anything it could not match.
- **Related posts** are slugs, separated by commas. A post that does not exist yet is listed and left out.
- **Publish date** is Dhaka time; a date with no time means 09:00.
- **Featured alt** is filled in when you upload the featured image. The image itself cannot come from the file.
- **`[PHOTO: …]` lines** mark where a photo goes. Select the line and press Image to replace it. The editor will not publish a post that still has one.

Importing into a post that already has text asks first, because it replaces every field the file has a value for.

## Before you publish

Publish and Schedule open a checklist: the first group blocks publishing, the second only warns. The last group is yours to check.

**The editor will not publish without:**

- [ ] A title and a slug
- [ ] Content and an excerpt
- [ ] A category
- [ ] A featured image with its description (alt text)
- [ ] No `[PHOTO: …]` placeholders left in the post
- [ ] For Schedule: a date in the future

**The editor warns about:**

- [ ] At least one `##` heading
- [ ] At least 3 topics
- [ ] A description on every image in the post
- [ ] At least 300 words
- [ ] An SEO description (otherwise the excerpt is used)

**Check yourself:**

- [ ] The first two paragraphs give the answer or the outcome.
- [ ] Every number has a unit, and every reading says where it was measured.
- [ ] Each command was tested on the version named in the post.
- [ ] No passwords, live IP addresses, customer names, exact site locations or internal documents.
- [ ] Read the preview on your phone: headings, tables and code blocks look right.
- [ ] Every link opens and goes where its text says.
- [ ] The slug is short and final.

## After publishing

A published post keeps working for years if you keep it correct; change it in place rather than writing a new one.

| You want to | Do this |
| --- | --- |
| Fix a typo or a small detail | Edit and press Update. Readers see no date change. |
| Change what the post says (new steps, new firmware, a corrected value) | Tick Significant update, then Update. Readers see a new "Last updated" date. |
| Rename the address | Change the slug and Update. The old address redirects to the new one, and stays reserved, so no other post can take it. Do this rarely. |
| Take a post down for a while | Unpublish. It returns to draft and keeps its original publish date for when it goes back up. |
| Retire a post for good | Archive it. A post that was ever published cannot be deleted, so links to it are not broken silently. |
| Throw away a draft | Delete works only on a draft that was never published. Its images stay in Cloudinary. |

The newest posts reach the raselrana.com.bd home page within about 15 minutes of publishing. Once a year, reread posts older than 12 months (the admin overview lists them) and update the ones whose versions, prices or steps have changed.

Under every post, readers see the read count and "Was this helpful?" with Like and Dislike totals. The admin shows the same numbers on the Overview, with a Most read list, in the posts list and in the editor. A read counts every visit that stays 10 seconds, so one person can count more than once. Previews never count. When you review old posts, start with the ones that have many reads or more dislikes than likes.
