export interface Article {
  slug: string
  title: string
  subtitle: string
  category: 'market-insights' | 'guides' | 'new-launches' | 'investment' | 'legal-tax'
  author: string
  authorRole: string
  publishedAt: string // ISO date
  readMinutes: number
  coverImage: string
  excerpt: string
  content: string
  tags: string[]
  featured: boolean
}

export const ARTICLES: Article[] = [
  {
    slug: 'hdb-resale-market-q1-2026-report',
    title: 'Singapore HDB Resale Market Q1 2026 Report',
    subtitle: 'Prices climb 3.2% year-on-year as demand outpaces supply in mature estates',
    category: 'market-insights',
    author: 'Rachel Lim',
    authorRole: 'Market Analyst',
    publishedAt: '2026-04-02',
    readMinutes: 7,
    coverImage: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&fit=crop',
    excerpt: 'HDB resale prices rose 3.2% year-on-year in Q1 2026, led by Bishan, Tampines, and Queenstown. Here\'s what the data means for buyers and sellers this quarter.',
    featured: true,
    tags: ['HDB', 'resale', 'market report', 'Q1 2026', 'Singapore property'],
    content: `## Key Findings

- HDB resale prices rose 3.2% year-on-year in Q1 2026, with the composite index at 181.4
- 4-room flats in mature estates accounted for 38% of all transactions — the highest share in three years
- Cash-Over-Valuation (COV) returned to positive territory across all flat types, averaging $18,000
- Bishan, Queenstown, and Tampines outperformed the market, posting gains of 4.8%, 4.1%, and 3.9% respectively
- First-time buyers now make up 61% of resale transactions, up from 54% a year ago

## Market Overview

The HDB resale market entered 2026 on firm footing, with transaction volumes rising 8% quarter-on-quarter to 7,312 units. The sustained demand reflects a structural mismatch between supply and the preferences of a growing cohort of upgraders and young couples who want immediate occupancy rather than the three-to-five-year wait for a Build-To-Order (BTO) flat.

HDB's flash estimate for the Q1 Resale Price Index stood at 181.4, up from 175.8 in Q1 2025. That 3.2% annual gain is notable because it comes on the back of a year in which cooling measures — including higher Additional Buyer's Stamp Duty for second-property buyers — were expected to dampen sentiment. Instead, the resale segment proved resilient, absorbing the added transaction costs without a meaningful price correction.

## Top Performing Estates

### Bishan

Bishan continued its multi-year run as one of Singapore's most coveted mature estates. Proximity to Bishan-Ang Mo Kio Park, excellent schools (Catholic High, Raffles Institution nearby), and the interchange between the Circle and North-South Lines all underpin demand. Five-room flats in the estate transacted at a median of $985,000 in Q1, with several units breaking the $1.1 million mark. Expect prices here to hold firm as supply remains tight — only 12 resale transactions were recorded in the estate during the quarter.

### Tampines

Tampines' appeal is its relative affordability compared to central estates combined with strong transport links and the upcoming Tampines North MRT station on the Cross Island Line. The 4-room resale median in Tampines hit $638,000 in Q1, a 3.9% increase year-on-year. The estate also benefited from strong HDB Plus restrictions in recent BTO launches, which prevent those flat buyers from selling into the resale market for a longer window — a dynamic that keeps supply constrained.

### Queenstown

Queenstown remains the perennial favourite for buyers who prize central living at sub-Orchard prices. A 3-room flat at Commonwealth Avenue traded at $820,000 in Q1 — a record for that flat type in the estate. The redevelopment pipeline along the Ayer Rajah corridor continues to draw professionals and younger couples who want to be close to the one-north tech and biomedical cluster.

## 4-Room Flat Trends

4-room flats continued to dominate resale activity, accounting for 38% of all Q1 transactions. The island-wide median for a 4-room resale flat reached $612,000 in Q1 2026, up from $589,000 a year ago. Notable is the widening gap between mature and non-mature estates: 4-room flats in mature estates like Bishan, Queenstown, and Toa Payoh transact at a 30–40% premium over comparable units in non-mature estates like Woodlands and Jurong West.

The persistent premium suggests buyers attach significant value to established amenities, shorter commutes, and school proximity — factors that are difficult to replicate quickly in newer towns.

## Cash-Over-Valuation (COV) Returns

After two consecutive quarters of near-zero or negative COV in late 2024, Q1 2026 saw a meaningful reversal. The average COV across all flat types was approximately $18,000, with 4-room flats in central and mature estates commanding COVs of $25,000–$40,000. This signals that HDB valuations are lagging actual market prices — a common occurrence during periods of strong demand — and means buyers are increasingly deploying cash savings above and beyond their CPF.

## Buyer Profile Shifts

First-time buyers now make up the majority of resale transactions at 61%, a sharp increase from 54% twelve months ago. This shift reflects two forces: (1) a growing pool of young couples who missed out on BTO ballots and are turning to the resale market as a reliable alternative, and (2) tightened eligibility rules for singles purchasing BTO flats in prime and plus locations, which has redirected a portion of solo buyers into the resale segment.

The proportion of buyers aged 26–35 purchasing resale flats reached 33% in Q1 — the highest on record. This demographic is particularly active in estates with strong rental yields and proximity to employment clusters.

## Q2 2026 Outlook

The outlook for Q2 is cautiously positive. HDB has committed to launching around 19,600 BTO units in 2026, which should gradually alleviate demand pressures over the medium term. However, the full effect of new supply will not be felt in the resale market for several years given the minimum occupation period.

Interest rates remain a key variable. If the US Federal Reserve proceeds with the two rate cuts the market is pricing in for mid-2026, mortgage rates in Singapore are likely to edge down from the current 3.2–3.5% range, potentially stimulating further resale activity.

## What This Means for Buyers

If you are considering a resale purchase, act on well-priced units in popular estates rather than waiting for a price correction that may not materialise in the near term. Get your HDB Flat Eligibility (HFE) letter in order and ensure your CPF and cash buffers can accommodate a COV of $15,000–$30,000 in mature estates.

## What This Means for Sellers

Conditions are as favourable as they have been in several years. Buyers are active, financing is available, and appetite for well-maintained flats with good attributes is strong. If you are upgrading to a private property, be aware that the extended occupation period for newer BTO flats in plus and prime categories may affect the eventual resale pool for those properties.`,
  },
  {
    slug: '5-new-launch-condos-to-watch-2026',
    title: '5 New Launch Condos to Watch in 2026',
    subtitle: 'From freehold East Coast gems to affordable Lentor estate options, here are the launches that matter this year',
    category: 'new-launches',
    author: 'James Koh',
    authorRole: 'Property Editor',
    publishedAt: '2026-03-18',
    readMinutes: 8,
    coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=630&fit=crop',
    excerpt: 'Five new launch condominiums stand out in 2026 for their locations, unit mixes, and value propositions. Here\'s what you need to know before making a decision.',
    featured: true,
    tags: ['new launch', 'condos', 'Singapore property', '2026', 'investment'],
    content: `The Singapore new launch landscape in 2026 is more varied than it has been in years — a mix of boutique luxury in District 9, large-scale family-friendly developments in District 21, and the continued build-out of the Lentor estate in District 26. Here are five launches that represent the full spectrum of what is available, with analysis of who each suits best.

## 1. Lentor Mansion (District 26)

**Developer:** GuocoLand and Hong Leong Holdings
**Unit Mix:** 533 units, 1-bedroom to 5-bedroom
**Starting Price:** From $1.32M (1-bedroom), $2.5M (3-bedroom)
**Status:** Launched Q4 2025, units still available

Lentor Mansion is the flagship development of the rapidly maturing Lentor estate. GuocoLand has been the most active developer in this micro-market, and Lentor Mansion represents the refinement of earlier Lentor projects, with a stronger emphasis on full-facility living and a more expansive landscape deck.

The key draw is the Thomson-East Coast Line (TEL). Lentor MRT station is a short covered walk away, putting residents two stops from the future Woodlands Regional Centre and seven stops from Orchard Road. For families, the developing Lentor Hills precinct includes a future community park, childcare centres, and proximity to Anderson Secondary School and CHIJ St. Nicholas Girls'.

The development sits above Lentor Modern, a mixed-use project with a supermarket, childcare, and retail — essentially a built-in lifestyle amenity at your doorstep. That convenience factor is significant for busy professionals. Investors should note that rental demand in D26 has strengthened materially over the past 18 months as the estate fills out.

## 2. The Continuum (District 15)

**Developer:** Hoi Hup Realty and Sunway Developments
**Unit Mix:** 816 units across two freehold parcels, 1-bedroom to 5-bedroom
**Starting Price:** From $1.5M (1-bedroom), $2.9M (3-bedroom)
**Status:** Launched 2023, close to full sales

The Continuum is one of the last large freehold launches in the coveted East Coast corridor. District 15 — covering the Katong, Joo Chiat, and Marine Parade areas — is perennially popular with both owner-occupiers seeking a landed-like neighbourhood feel and investors who know the area commands strong rental premiums from expats and young professionals.

What sets The Continuum apart is its freehold tenure and its sheer scale for a D15 development. The project spans two parcels connected by an overhead sky bridge, giving residents access to a wide array of facilities. The closest MRT options are Dakota (Circle Line) and the upcoming Marine Parade MRT on the TEL, which will substantially improve connectivity once operational.

Remaining inventory is limited, and resale prices have held up well since the launch period — a sign of genuine market conviction. For buyers who missed the launch, the secondary market is worth monitoring.

## 3. Orchard Sophia (District 9)

**Developer:** CEL Development and Sing-Haiyi Crystal
**Unit Mix:** 78 units (boutique), predominantly 2-bedroom to 3-bedroom
**Starting Price:** From $2.45M (2-bedroom)
**Status:** Launched 2023, near full sales

Orchard Sophia is the antithesis of the mega-development. Just 78 units in a boutique setting along Mount Sophia, a heritage-rich slope overlooking the Dhoby Ghaut area. The development targets buyers who want genuine District 9 credentials — walkable to Orchard, Somerset, and Dhoby Ghaut MRT — without the anonymity of a 500-unit complex.

The unit design emphasises quality over quantity: high ceilings, premium fittings, and larger-than-average floor plates for the price bracket. At around $3,100–$3,400 psf, it is priced below many of its Orchard-fringe competitors. The limited supply makes it relatively liquid in the resale market — boutique developments in D9 with proven track records attract a narrow but decisive buyer pool.

This is a buy-to-own or strategic buy-to-let for professionals with international mobility. The rental yield is not exceptional (sub-3%), but capital preservation in a freehold D9 asset has historically been reliable.

## 4. Pinetree Hill (District 21)

**Developer:** UOL Group and Singapore Land Group
**Unit Mix:** 520 units, 1-bedroom to 5-bedroom
**Starting Price:** From $1.09M (1-bedroom), $2.1M (3-bedroom)
**Status:** Launched 2023, ongoing sales

District 21 — covering Holland Village, Buona Vista, and the Bukit Timah corridor — is one of Singapore's most established private residential belts. Pinetree Hill sits near the top of Pandan Valley, offering verdant hillside views and easy access to the Ulu Pandan Park Connector.

UOL and SingLand are blue-chip developers known for build quality and thoughtful site planning. Pinetree Hill's extensive facilities — including a 50-metre lap pool, tennis courts, and a sky terrace — target families who want generous common spaces. It is not a short walk to the nearest MRT (Beauty World, three stops from Botanic Gardens), but the trade-off is space, greenery, and a neighbourhood identity that dense central condos cannot replicate.

At launch, the project's competitive pricing relative to the neighbourhood drew strong interest. Families who bought for own-use purposes are generally satisfied, and the rental market in D21 has proved durable given proximity to international schools and the NUS/one-north employment corridor.

## 5. Hillock Green (District 26)

**Developer:** Soilbuild and CNQC Realty
**Unit Mix:** 474 units, 1-bedroom to 4-bedroom
**Starting Price:** From $1.08M (1-bedroom), $2.0M (3-bedroom)
**Status:** Launched end-2023, units available

Hillock Green offers entry-level pricing into the Lentor estate. Compared to Lentor Mansion or the earlier Lentor Modern, Hillock Green targets buyers who are more price-sensitive but still want exposure to D26's infrastructure build-out. It is a short walk to Lentor MRT and directly adjacent to a future neighbourhood park.

The development's value proposition is straightforward: buy into an estate that has credible infrastructure coming (schools, parks, MRT), at a price below the flagship Lentor developments. The risk is that the estate's overall character will take several more years to fully form. For investors willing to hold for five to seven years, the risk-reward profile is reasonable. First-time private property buyers who want a D26 foothold without stretching to $2.5M+ price points should shortlist this.

## The Bottom Line

Each of these five developments serves a distinct buyer profile. Lentor Mansion and Hillock Green are for buyers betting on the Lentor estate's transformation story. The Continuum is for those who want a freehold asset on the East Coast corridor at current inventory levels. Orchard Sophia is boutique D9 for the capital-preservation buyer. And Pinetree Hill suits families who prioritise space and greenery over MRT proximity.

All five are from credible developers with track records in Singapore's market. Due diligence — particularly on estimated TOP dates, maintenance fees, and prevailing psf relative to recent comparable transactions — is essential before committing.`,
  },
  {
    slug: 'first-time-buyer-guide-singapore-property',
    title: "First-Time Buyer's Guide to Singapore Property",
    subtitle: 'Everything you need to know — from eligibility to key collection — before you sign on the dotted line',
    category: 'guides',
    author: 'Michael Tan',
    authorRole: 'Senior Advisor',
    publishedAt: '2026-03-05',
    readMinutes: 10,
    coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=630&fit=crop',
    excerpt: 'Buying property in Singapore for the first time? This complete guide covers eligibility, HDB vs private, CPF usage, stamp duties, and the full purchase process step by step.',
    featured: true,
    tags: ['first-time buyer', 'guide', 'HDB', 'private property', 'CPF', 'stamp duty'],
    content: `Buying your first property in Singapore is one of the largest financial decisions you will ever make. The good news is that the regulatory framework is transparent, the financing options are well-structured, and the process — while procedurally involved — is predictable. This guide walks you through every stage from determining your eligibility to collecting your keys.

## Step 1: Determine Your Eligibility

Your nationality determines what you can buy.

**Singapore Citizens** have the widest options: HDB flats (new BTO or resale), executive condominiums (EC), and all private residential properties. Citizens buying their first property pay no Additional Buyer's Stamp Duty (ABSD). Citizens buying a second property pay 20% ABSD.

**Permanent Residents (PRs)** can buy resale HDB flats (not new BTO), ECs, and private property. PRs pay 5% ABSD on their first purchase and 30% on subsequent ones. For resale HDB, at least one applicant must be a PR and the household must meet the relevant eligibility schemes.

**Foreigners** are restricted to private residential properties and certain ECs. They pay 60% ABSD, which effectively prices most foreigners into the higher-end segment where the ABSD as a percentage of asset value is relatively less burdensome.

## Step 2: HDB vs Private Property

The fundamental divide in Singapore property is between the public housing system (HDB) and the private market.

**HDB flats** — accounting for roughly 80% of Singapore's residential stock — are subsidised homes sold by the Housing & Development Board. They come with rules: minimum occupation periods (typically 5 years), restrictions on renting out the entire flat, and rules on subletting rooms. The upside is price: a new 4-room BTO in a non-mature estate can cost $350,000–$550,000, versus $600,000+ in the resale market for a comparable unit in a popular estate.

**Private property** — condominiums, apartments, and landed homes — comes without the occupation period and ownership restrictions of HDB. Owners can rent freely, sell whenever they choose (stamp duty caveats aside), and use the property more flexibly. The trade-off is price: a new launch condo entry unit in a non-central district starts around $1 million.

Executive Condominiums (ECs) are a hybrid: private in construction and amenities, but with HDB eligibility conditions and income ceilings during the initial purchase period. After 10 years they are fully privatised.

## Step 3: BTO vs Resale HDB

If you qualify for an HDB flat and can wait, the Build-To-Order (BTO) route is usually cheaper. Flats are sold at below-market prices with CPF Housing Grants for eligible households. The catch: you apply in a public ballot and successful applicants wait 3–5 years for the flat to be built.

For couples who need a home now, the **resale market** is the alternative. Prices are set by negotiation between buyer and seller (subject to HDB valuation), and you can move in within weeks of completing the transaction. CPF grants of up to $80,000 are available for eligible resale buyers.

## Step 4: CPF Usage and Down Payment

CPF Ordinary Account (OA) savings can be used to pay the down payment (after the required cash portion) and monthly mortgage instalments.

For HDB purchases using an HDB concessionary loan (2.6% per annum), the minimum cash down payment is zero — you can use 100% CPF if you have sufficient savings. For a bank loan, you must pay at least 5% in cash, with the remainder of the 25% down payment from CPF.

For private property, the Loan-to-Value (LTV) limit is 75% from banks, meaning you need to fund 25% yourself — at least 5% in cash and the rest from CPF. If you already have an outstanding mortgage, LTV drops to 45%, with at least 25% in cash.

## Step 5: Legal Fees and Stamp Duties

**Buyer's Stamp Duty (BSD)** applies to all buyers:
- First $180,000: 1%
- Next $180,000: 2%
- Next $640,000: 3%
- Next $500,000: 4%
- Next $1.5M: 5%
- Above $3M: 6%

On a $1 million property, BSD comes to $24,600.

**Additional Buyer's Stamp Duty (ABSD)** is on top of BSD and depends on your residency status and how many properties you own. Singapore Citizens buying their first property pay zero ABSD.

**Legal fees** for a standard private property purchase typically run $2,500–$4,000 for the buyer's solicitor. For HDB transactions, conveyancing is simpler and cheaper, often in the $1,500–$2,500 range.

**Other costs** to budget: valuation fee ($300–$800), home insurance, and any renovation costs.

## Step 6: Engaging a Property Agent

You are not required to use an agent in Singapore, but most buyers do. Agents are licensed by the Council for Estate Agencies (CEA) — verify any agent's licence at the CEA website before engaging them.

For HDB resale and most private resale transactions, the seller pays the agent commission (typically 1–2% of transaction price). As a buyer, you generally do not pay agent fees. For new launches, the developer pays the agent commission from the sales proceeds.

A good agent will help you identify suitable properties, negotiate price, manage the OTP process, and liaise with solicitors and HDB or the developer.

## Step 7: The Option to Purchase (OTP)

When you and the seller agree on a price for a private property, the seller issues you an **Option to Purchase (OTP)**. You pay an Option Fee (typically 1% of purchase price) and have 14 or 21 days to exercise the option by paying the Exercise Fee (a further 4%). Once exercised, the transaction is legally binding.

For HDB resale transactions, the process is similar but regulated by HDB, with standard forms and a mandatory HDB appointment to complete the resale application.

## Step 8: Completion

For private property, completion typically occurs 8–12 weeks after exercising the OTP. Your solicitor coordinates the transfer of title, the drawdown of the bank loan, and the payment of stamp duties.

For HDB resale, the completion appointment at HDB takes place 6–8 weeks after HDB approves the resale application. At the appointment, ownership is transferred, keys are handed over, and CPF is disbursed.

## A Word on Timing

Singapore property does not have dramatic boom-bust cycles by international standards, but timing still matters. Buying when interest rates are high and then refinancing when rates fall is a genuine value-creation strategy. Buying in a cooling measures environment — when ABSD is high and market sentiment is subdued — can yield better entry prices than buying in a hot market.

Most importantly, buy what you can comfortably afford. The stress test rate (4% per annum) that banks apply to mortgage applications exists for a reason. Build in a buffer for rate rises, maintenance costs, and life events.`,
  },
  {
    slug: 'understanding-tdsr-msr-borrowing-limits',
    title: 'Understanding TDSR and MSR: How Much Can You Really Borrow?',
    subtitle: 'Two critical ratios determine your mortgage eligibility — here\'s how to calculate them and improve your position',
    category: 'legal-tax',
    author: 'David Wong',
    authorRole: 'Finance Writer',
    publishedAt: '2026-02-20',
    readMinutes: 6,
    coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=630&fit=crop',
    excerpt: 'TDSR caps your total debt repayments at 55% of gross income. MSR caps your HDB mortgage at 30%. Here\'s how they work, how lenders apply them, and how to improve your borrowing capacity.',
    featured: false,
    tags: ['TDSR', 'MSR', 'mortgage', 'borrowing', 'finance', 'HDB loan'],
    content: `Before any Singapore bank or HDB will approve your mortgage, two ratios scrutinise your finances: the Total Debt Servicing Ratio (TDSR) and — for HDB loans — the Mortgage Servicing Ratio (MSR). Understanding both is essential before you make an offer on a property.

## What Is TDSR?

The Total Debt Servicing Ratio requires that your total monthly debt obligations — including the proposed mortgage — do not exceed 55% of your gross monthly income.

The formula is straightforward:

**TDSR = (All monthly debt obligations ÷ Gross monthly income) × 100**

"All monthly debt obligations" includes your proposed mortgage, car loans, student loans, credit card minimum payments (generally counted at 5% of the outstanding balance), personal loans, and any other regular debt repayments.

"Gross monthly income" for salaried employees is typically the base salary (excluding variable components like bonuses, which are weighted at 30% of the monthly average). For self-employed individuals, lenders typically use 70% of the average monthly net profit from the past two years' tax assessments.

The TDSR was introduced by the Monetary Authority of Singapore in 2013 and has been a cornerstone of Singapore's property cooling framework ever since. It applies to all private residential property loans and to HDB loans financed through banks.

## What Is MSR?

The Mortgage Servicing Ratio is a tighter constraint that applies specifically to HDB flat purchases and Executive Condominium purchases from developers.

**MSR = (Monthly mortgage repayment ÷ Gross monthly income) × 100**

The cap is 30%. Note that MSR only counts the mortgage in question — it does not aggregate other debts the way TDSR does. However, for HDB purchases, both MSR (30%) and TDSR (55%) must be satisfied simultaneously.

In practice, the MSR is almost always the binding constraint for HDB buyers because 30% of income is a tighter limit than the 55% TDSR cap after excluding other debts.

## The Stress Test Rate

Banks do not calculate your mortgage repayment at the current prevailing rate. The MAS mandates a stress test: your mortgage must be serviceable at a notional interest rate of **4% per annum**, regardless of what the actual rate is today.

This matters considerably. If you are borrowing $1 million over 25 years at an actual rate of 3.2% per annum, your actual monthly repayment is approximately $4,840. But the bank calculates your TDSR/MSR eligibility using a repayment of $5,280 — the figure at 4%.

The stress test ensures that borrowers retain capacity to service their loans if interest rates rise materially.

## Worked Example: $10,000 Gross Monthly Income

Assume you earn $10,000 gross per month and want to buy an HDB resale flat with a bank loan. You have a car loan costing $800 per month and one credit card with $5,000 outstanding (counted as $250/month at 5%).

**TDSR calculation:**
- Available for mortgage: 55% × $10,000 = $5,500, minus $800 car loan, minus $250 credit card = $4,450 per month at the stress test rate of 4%
- That supports a loan of approximately $842,000 over 30 years (or $715,000 over 25 years)

**MSR calculation:**
- Available for mortgage: 30% × $10,000 = $3,000 per month at 4%
- That supports a loan of approximately $567,000 over 30 years (or $481,000 over 25 years)

In this scenario, the MSR is the binding constraint. The buyer can afford a property priced at roughly $710,000 if they have a 25% down payment of approximately $143,000 (based on $567,000 loan at full LTV).

For a private property purchase (not subject to MSR), the same buyer with only TDSR applies could potentially borrow $715,000–$842,000 depending on loan tenure.

## How to Improve Your TDSR

### Clear high-cost debt before applying

Credit cards and personal loans count against your TDSR. Clearing $20,000 of credit card debt removes roughly $1,000 from your monthly obligations (counted at 5%) — immediately improving your TDSR position.

### Extend the loan tenure

A longer tenure reduces the monthly repayment at the 4% stress test rate, allowing you to borrow more. The maximum for private property is 30 years (or until age 75, whichever comes first). For HDB, the maximum with an HDB loan is 25 years.

### Include a co-borrower's income

If your spouse or a family member is willing to be a co-borrower, their income can be added to the denominator. This is the most common approach for young couples who need to combine incomes to qualify for a larger loan.

### Increase verifiable income

For business owners and freelancers, lenders typically average two years of tax assessments. A strong recent year that has not yet been filed may not count. Filing promptly and maintaining clean financial records is important.

### Time it right

ABSD remissions and cooling measures change periodically. Timing your purchase to coincide with favourable policy settings — or simply when your financial position is strongest — can make a material difference to your eligibility and the terms you receive.

## The Bottom Line

TDSR and MSR are not obstacles — they are guardrails that have arguably made Singapore's property market more stable than most developed economies. Borrowers who understand these ratios before viewing properties save themselves the disappointment of falling in love with a unit they cannot finance. Run the numbers before you start your search.`,
  },
  {
    slug: 'absd-changes-foreign-buyers-2026',
    title: 'ABSD Changes: What Foreign Buyers Need to Know in 2026',
    subtitle: 'With foreigners paying 60% ABSD, understanding the exemptions under free trade agreements is more important than ever',
    category: 'legal-tax',
    author: 'Rachel Lim',
    authorRole: 'Market Analyst',
    publishedAt: '2026-01-15',
    readMinutes: 5,
    coverImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&h=630&fit=crop',
    excerpt: 'Singapore\'s 60% ABSD for foreign buyers is among the highest property transaction taxes in the world. Here\'s what foreign nationals need to know about rates, exemptions, and FTA concessions.',
    featured: false,
    tags: ['ABSD', 'foreign buyers', 'stamp duty', 'FTA', 'Singapore property tax'],
    content: `Singapore's Additional Buyer's Stamp Duty (ABSD) regime has tightened significantly over the past three years. For foreign nationals — defined as anyone who is not a Singapore Citizen or Permanent Resident — the ABSD rate on any residential property purchase currently stands at 60%. For entities (companies, trusts, and collective investment schemes), the rate is 65%. These are among the highest property transaction taxes in the developed world.

## Current ABSD Rates at a Glance

- **Singapore Citizens (1st property):** 0%
- **Singapore Citizens (2nd property):** 20%
- **Singapore Citizens (3rd and subsequent):** 30%
- **Permanent Residents (1st property):** 5%
- **Permanent Residents (2nd and subsequent):** 30%
- **Foreigners (any residential property):** 60%
- **Entities:** 65%

These rates apply on top of Buyer's Stamp Duty (BSD), which is payable by all buyers. On a $3 million property purchased by a foreign national, total stamp duty — BSD plus 60% ABSD — would exceed $1.9 million.

## Why So High?

The government has been explicit that the foreign buyer ABSD is a deliberate tool to keep Singapore housing predominantly for Singapore residents. The concern is that Singapore's small land area, high rental yield, and stable governance make it attractive as a wealth store for overseas capital — and that unchecked foreign buying would price local residents out of the private property market.

The rate was raised from 30% to 60% in April 2023, a step-change that fundamentally altered the economics for most foreign buyers. Transaction volumes from foreign nationals dropped sharply in the subsequent quarters, though the luxury segment remained relatively active given the smaller proportional impact of stamp duty on ultra-high-value purchases.

## FTA Exemptions

Singapore has negotiated ABSD exemptions for nationals of four jurisdictions under its bilateral Free Trade Agreements. Qualifying nationals from these countries pay the same ABSD rates as **Singapore Citizens** — that is, 0% on their first residential property:

1. **United States** — under the US-Singapore Free Trade Agreement (USSFTA)
2. **Switzerland** — under the European Free Trade Association (EFTA)-Singapore FTA
3. **Norway** — under the EFTA-Singapore FTA
4. **Liechtenstein** — under the EFTA-Singapore FTA
5. **Iceland** — under the EFTA-Singapore FTA

Nationals of these countries must be natural persons (not companies) and must meet the applicable conditions. The exemption applies to the first residential property purchase only. Subsequent purchases follow standard Citizen ABSD rates (20% second property, 30% third and beyond).

This is a significant concession. An American national buying a $3 million condo pays zero ABSD on their first purchase, compared to the $1.8 million ABSD a non-FTA foreign national would pay.

## Remissions for Citizens Selling Before Buying

Singapore Citizens who sell an existing residential property within **6 months** of purchasing a new one are eligible for an ABSD remission on the new purchase. The practical effect: if you are a Citizen buying your second property while intending to sell your first, you pay 20% ABSD upfront but receive a full refund after proving the sale of the original property within the 6-month window.

Permanent Residents have a similar remission — purchasing a new flat while selling a resale HDB flat within 6 months qualifies for a partial remission.

This remission is important for upgraders. It allows you to secure the new property first (avoiding the risk of having no home while searching) and then complete the sale of your existing property without permanently losing the ABSD paid.

## Practical Implications for Foreign Buyers

For foreign nationals from non-FTA countries, the 60% ABSD makes Singapore residential property prohibitively expensive for most investment purposes. Gross rental yields on Singapore condominiums typically run 2.5%–3.5%. After ABSD, the breakeven holding period on a pure yield basis is often 15–20 years — making the economics work only for ultra-long-term capital preservation strategies.

Certain foreign buyers continue to purchase despite the ABSD: individuals relocating to Singapore for work who prefer ownership to renting, or ultra-high-net-worth individuals treating Singapore property as a component of a diversified wealth store rather than a yield instrument.

For FTA-eligible nationals (particularly Americans and Swiss), the calculus is fundamentally different. Zero first-purchase ABSD makes Singapore property genuinely competitive against other global gateway cities at similar price points.

## What to Watch

The government has indicated that cooling measures will be reviewed periodically and adjusted based on market conditions. A reduction in the foreign buyer ABSD rate would likely trigger a meaningful uptick in transaction volumes and prices in the luxury segment. However, with housing affordability a politically sensitive issue in Singapore, a material relaxation of foreign buyer restrictions in the near term appears unlikely.`,
  },
  {
    slug: 'is-it-good-time-to-buy-singapore-2026',
    title: 'Is It a Good Time to Buy in 2026? Market Outlook',
    subtitle: 'Interest rates, new supply, rental dynamics, and URA data — a comprehensive look at where Singapore property is headed',
    category: 'investment',
    author: 'Sarah Chen',
    authorRole: 'Senior Agent',
    publishedAt: '2026-04-08',
    readMinutes: 9,
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=630&fit=crop',
    excerpt: 'Singapore property prices have held firm into 2026. But with interest rates poised to ease and a substantial new launch pipeline, the next 12 months may look different. Here\'s the full picture.',
    featured: true,
    tags: ['market outlook', '2026', 'investment', 'Singapore property', 'interest rates', 'URA'],
    content: `The question I hear most often from prospective buyers right now is some version of: "Should I buy now, or wait?" It is never a simple question to answer, because the decision depends on your specific circumstances, your time horizon, and what you are buying for. But the current macro picture does offer some real clarity on where the market is heading.

## The Interest Rate Environment

The biggest variable affecting Singapore property over the past three years has been the interest rate cycle. From the historic lows of 2020–2021 (SORA near zero, fixed rates as low as 1.1%), the market moved to a regime of 3.2%–3.8% fixed rates that repriced affordability significantly.

The shift is now underway. The US Federal Reserve's pivot to rate cuts — two cuts are priced in for mid-to-late 2026 — will flow through to Singapore bank mortgage rates with a lag of two to three quarters. Fixed rates, which had already begun declining from their 2024 peaks, are expected to reach the 2.6%–2.9% range by early 2027. SORA-pegged floating rates have already eased.

Lower rates matter in two ways: they directly reduce monthly repayments (improving affordability), and they reduce the opportunity cost of deploying capital into property versus liquid assets. Both effects are stimulative for demand.

## New Launches Pipeline

The Urban Redevelopment Authority (URA) has confirmed a healthy pipeline of new private residential launches for 2026. Approximately 7,500–9,000 new private units are expected to launch across the year — a step up from 2025 but not an oversupply situation given the absorption rate of Singapore's market.

Key launches to watch include additional phases in the Lentor estate (District 26), new sites in the Jurong Lake District (long-mooted as Singapore's second CBD), and several redevelopment plots in the Core Central Region. The Jurong Lake District launches are particularly significant if they materialise — they represent the first meaningful new private supply in that precinct in over a decade.

For buyers, the pipeline means choice will be better than it has been in recent years. For investors already holding properties bought in 2020–2022, there is some concern that increased supply dampens capital appreciation. Historical data suggests Singapore absorbs incremental supply reasonably well given structural land constraints, but pockets of oversupply in specific micro-markets are possible.

## Resale Supply Dynamics

On the resale side, supply remains constrained by two structural factors. First, the Minimum Occupation Period (MOP) for BTO flats launched in 2020 and 2021 — when BTO volumes were relatively low due to COVID-related construction delays — means fewer flats are entering the resale market now than typical. Second, the introduction of HDB Plus and Prime designations has extended restrictions on resale for newer BTO flats, limiting the eventual supply pipeline.

URA flash estimates suggest the Overall Private Residential Property Price Index rose 1.8% in Q1 2026, following a 2.1% gain in Q4 2025. The rate of increase is moderating from the elevated levels of 2022–2023, but prices are not falling. The market is best characterised as one of cautious consolidation — a normalisation phase rather than a correction.

## Rental Demand from Expatriates

Singapore's rental market, which surged 30%+ during the 2021–2023 period, has moderated but remains structurally supported. Vacancy rates in the private residential sector sit around 6–7%, consistent with a balanced market (anything below 8% is considered healthy).

Expatriate inflows — a key driver of rental demand — remain robust. Singapore's status as a regional hub for financial services, technology, and commodities trading continues to attract C-suite talent and mid-level professionals on relocation packages. The Ministry of Manpower reported a 4.2% increase in Employment Pass holders in 2025, adding to rental demand particularly in the $5,000–$12,000/month segment that targets city-fringe and prime districts.

For investors, the rental market underpins yield calculations. Gross yields of 2.5%–3.5% in the private market are modest in absolute terms but compare reasonably to net yields on Singapore Government Securities and are supported by potential capital appreciation.

## What URA Data Is Saying

The URA's Q1 2026 flash data, released in early April, shows:
- Overall private residential prices: +1.8% quarter-on-quarter
- Landed property prices: +2.3% quarter-on-quarter
- Non-landed Rest of Central Region (RCR): +2.1% quarter-on-quarter
- Non-landed Outside Central Region (OCR): +1.4% quarter-on-quarter
- Non-landed Core Central Region (CCR): +0.9% quarter-on-quarter

The OCR outperformance relative to CCR is a persistent trend reflecting the price gap between mass market and luxury segments. Mass market buyers are constrained by TDSR/MSR and cannot absorb price increases as easily as CCR buyers, which should moderate the OCR pace going forward.

## Buying for Own Use vs Investment

This distinction changes the calculus significantly.

**For own use:** The best time to buy is when you need the property and can afford it. Trying to perfectly time the market is a fool's errand — studies of Singapore buyers who waited for a 10% correction and instead saw prices rise 15% are cautionary tales. If you need a home, can service the mortgage comfortably, and have a holding period of at least 7–10 years, the current market is a reasonable entry point. The moderation in price gains means you are not buying at a parabolic peak.

**For investment:** The calculus is harder. At 3% gross yields with carrying costs of 2.5%+ in mortgage interest, positive net yield is thin or absent. The investment case rests on capital appreciation — a reasonable bet historically in Singapore but not guaranteed. The most compelling investment opportunities are currently in the mass market (OCR) and city-fringe (RCR), where supply constraints and improving MRT infrastructure support medium-term appreciation.

## The 12-Month Outlook

My expectation for the 12 months from Q2 2026 is modest positive price movement of 3–5% overall, with the landed and RCR segments outperforming CCR. The easing interest rate environment provides a tailwind. Cooling measures remain in place and prevent frothy speculation. HDB resale prices will likely track private market movements at a slight lag given the higher sensitivity to interest rates through the MSR framework.

The biggest upside risk: faster-than-expected Fed cuts that bring Singapore fixed rates below 2.5% sooner, reigniting buyer activity. The biggest downside risk: a global recession driven by trade tensions or financial instability that dents business confidence and reduces expatriate inflows.

For most buyers with a genuine long-term need for housing in Singapore, 2026 represents a reasonable entry point — not the buying opportunity of a lifetime, but not an obvious trap either. Buy what you can afford, in a location you believe in, with a mortgage that leaves you comfortable margin for life's unexpected turns.`,
  },
]

export function getArticles(filter?: { category?: Article['category']; featured?: boolean }): Article[] {
  let results = [...ARTICLES]
  if (filter?.category) {
    results = results.filter((a) => a.category === filter.category)
  }
  if (filter?.featured !== undefined) {
    results = results.filter((a) => a.featured === filter.featured)
  }
  return results.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug)
}

export function getFeaturedArticles(): Article[] {
  return getArticles({ featured: true })
}

export function getRelatedArticles(slug: string, limit = 3): Article[] {
  const article = getArticleBySlug(slug)
  if (!article) return []
  // Same category first, then other articles, excluding current
  const sameCategory = ARTICLES.filter((a) => a.slug !== slug && a.category === article.category)
  const others = ARTICLES.filter((a) => a.slug !== slug && a.category !== article.category)
  return [...sameCategory, ...others].slice(0, limit)
}
