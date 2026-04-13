export interface DistrictGuide {
  slug: string
  district: number
  name: string
  tagline: string
  heroImage: string
  overview: string
  highlights: string[]
  demographics: {
    typicalBuyers: string
    avgPsfSale: number
    avgRentalPsf: number
    yoyPriceChange: string
  }
  transport: {
    mrtStations: string[]
    expressways: string[]
    commuteToCbd: string
  }
  schools: Array<{ name: string; type: 'primary' | 'secondary' | 'jc' | 'international' }>
  amenities: Array<{ name: string; type: 'mall' | 'park' | 'food' | 'hospital' }>
  propertyTypes: string[]
  priceRanges: {
    salePrice: string
    rental: string
  }
  pros: string[]
  cons: string[]
  similarDistricts: number[]
}

export const DISTRICT_GUIDES: DistrictGuide[] = [
  {
    slug: 'd9-orchard',
    district: 9,
    name: 'District 9 — Orchard & River Valley',
    tagline: 'Singapore\'s luxury heartbeat — shopping, dining, and prime freehold living.',
    heroImage: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1600&h=700&fit=crop',
    overview: `District 9 is the undisputed crown of Singapore's residential market. Anchored by Orchard Road — one of Asia's most famous shopping streets — this district combines world-class retail, Michelin-starred dining, and some of the island's most sought-after freehold addresses. River Valley, nestled just south of Orchard, offers a quieter residential character with wide tree-lined streets, boutique restaurants, and a mix of pre-war conservation shophouses alongside modern condominium towers.

The address premium here is real and enduring. Properties in District 9 command the highest per-square-foot prices outside of Sentosa Cove, driven by scarce freehold land, excellent connectivity, and the prestige associated with an Orchard or River Valley postal code. ION Orchard, Paragon, Takashimaya, and Mandarin Gallery are all within walking distance, making this one of the few districts where residents genuinely need no car for day-to-day life.

The residential landscape is dominated by luxury condominiums — iconic towers like The Orchard Residences (atop ION Orchard), Ardmore Park, and Boulevard Vue attract high-net-worth locals, expatriate executives, and institutional investors alike. Service apartments along Orchard Boulevard cater to corporate tenants on short-term postings, keeping rental demand consistently strong.

Beyond shopping, the district offers access to Singapore Botanic Gardens (a UNESCO World Heritage Site) within 10 minutes, the lush greenery of Fort Canning Park at its southern edge, and the vibrant Robertson Quay dining and nightlife precinct straddling the Singapore River. River Valley Primary School is one of the most sought-after primary schools in Singapore, making the district especially attractive to families with young children.

For investors, District 9 historically delivers stable capital appreciation and low vacancy rates. The rental market is underpinned by a steady flow of expatriate professionals from financial institutions and multinationals headquartered nearby, ensuring a deep and liquid leasing market throughout the economic cycle.`,
    highlights: [
      'Walking distance to ION Orchard, Paragon, Takashimaya, and Mandarin Gallery',
      'UNESCO-listed Singapore Botanic Gardens within 10 minutes',
      'River Valley Primary School — one of Singapore\'s most coveted primary catchments',
      'Strong freehold supply — rare in land-scarce Singapore',
      'Robertson Quay and Clarke Quay nightlife and dining precincts on the doorstep',
      'Consistently high rental yields driven by expatriate demand',
    ],
    demographics: {
      typicalBuyers: 'Wealthy Singaporean families, expatriate executives, and institutional investors seeking prime freehold assets',
      avgPsfSale: 2800,
      avgRentalPsf: 6.5,
      yoyPriceChange: '+2.8%',
    },
    transport: {
      mrtStations: ['Orchard (NS/TE)', 'Somerset (NS)', 'Dhoby Ghaut (NS/NE/CC)', 'Great World (TE)'],
      expressways: ['CTE', 'PIE'],
      commuteToCbd: '5–10 min',
    },
    schools: [
      { name: 'River Valley Primary School', type: 'primary' },
      { name: 'Anglo-Chinese School (Primary)', type: 'primary' },
      { name: 'Chatsworth International School (Orchard)', type: 'international' },
      { name: 'ISS International School', type: 'international' },
    ],
    amenities: [
      { name: 'ION Orchard', type: 'mall' },
      { name: 'Paragon Shopping Centre', type: 'mall' },
      { name: 'Takashimaya / Ngee Ann City', type: 'mall' },
      { name: 'Fort Canning Park', type: 'park' },
      { name: 'Robertson Quay F&B Strip', type: 'food' },
      { name: 'Mount Elizabeth Hospital', type: 'hospital' },
    ],
    propertyTypes: [
      'Luxury freehold condominiums',
      'Prime 99-year leasehold condos',
      'Serviced apartments',
      'Conservation shophouses (River Valley)',
      'Super-luxury penthouses',
    ],
    priceRanges: {
      salePrice: '$2.5M – $15M+',
      rental: '$4,500 – $20,000/mo',
    },
    pros: [
      'Unmatched lifestyle convenience — malls, dining, parks all walkable',
      'Strong and liquid rental market for investors',
      'Significant freehold stock preserves long-term value',
      'Multiple MRT lines ensure commute flexibility',
      'Top primary school catchment in River Valley',
    ],
    cons: [
      'Among the highest entry prices on the island',
      'Traffic congestion along Orchard Road during peak hours',
      'Limited public market / hawker culture — lifestyle skews expensive',
      'Weekend crowds near Orchard MRT can be intense',
    ],
    similarDistricts: [10, 11, 1],
  },
  {
    slug: 'd10-tanglin-holland',
    district: 10,
    name: 'District 10 — Tanglin, Holland & Bukit Timah',
    tagline: 'Embassy belt, prestigious schools, and Singapore\'s finest Good Class Bungalow enclaves.',
    heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=700&fit=crop',
    overview: `District 10 is where Singapore's old money meets old trees. Stretching from the embassy belt of Tanglin through the bohemian charm of Holland Village to the forested ridges of Bukit Timah, this district is defined by space, greenery, and a quiet prestige that sets it apart from the glitzy energy of nearby Orchard.

The district is home to some of the island's most exclusive Good Class Bungalow (GCB) areas — Nassim Road, Dalvey Estate, and White House Park — where sprawling colonial-era and modern GCBs change hands for tens of millions. These are among the rarest and most restricted property types in Singapore, available only to Singapore citizens, making them a cornerstone of ultra-high-net-worth local demand.

Holland Village is the district's social hub: a low-rise enclave of al fresco restaurants, wine bars, independent boutiques, and weekend farmers markets that attracts both young expats and established families. The completion of the Circle Line extension brought Holland Village and Farrer Road MRT stations, significantly improving the area's already solid connectivity. Dempsey Hill, formerly military barracks, now houses a curated cluster of upscale restaurants, galleries, and homeware stores set among mature rain trees.

For families, District 10 is arguably Singapore's premier address for schooling. Henry Park Primary, Nanyang Primary, and Raffles Girls' Primary consistently rank among the nation's top primary schools, and their proximity to Holland Road and Bukit Timah drives sustained demand from parents willing to pay a premium to secure within-1km catchment addresses. Hwa Chong Institution and National Junior College anchor secondary and pre-university education in the same corridor.

The residential mix covers the entire spectrum: landed homes from semi-detached to detached, mid-range condominiums along Holland Road and Farrer Road, and boutique freehold developments tucked into quiet residential streets. District 10 properties hold their value well in downturns and consistently attract foreign buyers given the district's international character.`,
    highlights: [
      'Singapore\'s densest concentration of Good Class Bungalow land',
      'Henry Park Primary, Nanyang Primary, and Raffles Girls\' Primary — all top-ranked',
      'Holland Village\'s vibrant café, dining, and lifestyle precinct',
      'Dempsey Hill — Singapore\'s best upscale dining and design destination',
      'Direct access to Bukit Timah Nature Reserve and the Rail Corridor',
      'Strong expatriate community with a cosmopolitan, village-like atmosphere',
    ],
    demographics: {
      typicalBuyers: 'Wealthy Singaporean families prioritising schools, senior expatriate professionals, and GCB investors',
      avgPsfSale: 2400,
      avgRentalPsf: 5.8,
      yoyPriceChange: '+1.9%',
    },
    transport: {
      mrtStations: ['Orchard Boulevard (TE)', 'Holland Village (CC)', 'Farrer Road (CC)', 'Botanic Gardens (CC/DT)', 'King Albert Park (DT)'],
      expressways: ['PIE', 'AYE'],
      commuteToCbd: '10–18 min',
    },
    schools: [
      { name: 'Henry Park Primary School', type: 'primary' },
      { name: 'Nanyang Primary School', type: 'primary' },
      { name: 'Raffles Girls\' Primary School', type: 'primary' },
      { name: 'Hwa Chong Institution', type: 'secondary' },
      { name: 'National Junior College', type: 'jc' },
      { name: 'Tanglin Trust School', type: 'international' },
      { name: 'United World College (Dover)', type: 'international' },
    ],
    amenities: [
      { name: 'Holland Road Shopping Centre', type: 'mall' },
      { name: 'The Star Vista', type: 'mall' },
      { name: 'Dempsey Hill F&B Enclave', type: 'food' },
      { name: 'Bukit Timah Nature Reserve', type: 'park' },
      { name: 'Singapore Botanic Gardens', type: 'park' },
      { name: 'Gleneagles Hospital', type: 'hospital' },
    ],
    propertyTypes: [
      'Good Class Bungalows (GCB)',
      'Semi-detached and terrace houses',
      'Freehold condominiums',
      'Boutique low-rise residential developments',
      '99-year leasehold condos along Holland Road',
    ],
    priceRanges: {
      salePrice: '$2M – $50M+ (GCBs)',
      rental: '$4,000 – $30,000/mo',
    },
    pros: [
      'Best school catchment addresses in Singapore',
      'GCB land — appreciates consistently and is strictly regulated',
      'Mature greenery and quieter, lower-density residential streets',
      'Holland Village and Dempsey Hill provide exceptional lifestyle variety',
      'Strong expatriate rental demand for larger landed homes',
    ],
    cons: [
      'Very high price quantum for landed properties and GCBs',
      'Public transport connectivity below District 9 standard in some pockets',
      'Limited hawker centres — dining leans expensive',
      'Primary school over-subscription means no guarantee of catchment placement',
    ],
    similarDistricts: [9, 11, 21],
  },
  {
    slug: 'd15-east-coast',
    district: 15,
    name: 'District 15 — East Coast & Marine Parade',
    tagline: 'Beach breezes, legendary food, and Singapore\'s most beloved coastal neighbourhood.',
    heroImage: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1600&h=700&fit=crop',
    overview: `District 15 holds a special place in Singapore's heart. Stretching from the landed enclaves of Siglap and Frankel to the art-deco Peranakan streets of Joo Chiat and the seaside promenade of East Coast Park, this district blends a relaxed coastal lifestyle with some of Singapore's richest cultural heritage.

East Coast Park is the district's greatest asset — 15 kilometres of beachside greenery used daily by cyclists, joggers, picnickers, and weekend barbecue crews. The park runs the entire length of the district's southern edge, making it arguably Singapore's best-loved public space. For residents, living within 15 minutes of the beach is a genuine quality-of-life differentiator that few other Singapore districts can match.

The food scene in District 15 is legendary. Joo Chiat and Katong are home to some of Singapore's oldest and most celebrated Peranakan restaurants, Eurasian bakeries, and independent cafés. East Coast Road's hawker stalls and coffeeshops serve generations of loyal regulars, while a newer wave of specialty coffee shops and wine bars has emerged to serve younger residents. East Coast Lagoon Food Village remains one of the island's best-loved outdoor hawker centres, especially famous for its satay and seafood.

The residential market spans a wide range. Joo Chiat and Katong are lined with beautifully restored Peranakan conservation shophouses, many converted into family homes or boutique guesthouses. Larger landed estates in Siglap, Frankel, and Opera Estate offer freehold semi-detached and detached homes with private gardens and car porches — rare commodities that command premiums among multi-generational families. The East Coast also has a good supply of condominiums along Marine Parade Road, particularly suited to young professionals and dual-income families.

The opening of the Thomson-East Coast Line (TEL) stations — Marine Parade, Marine Terrace, Siglap, Bayshore, and Bedok South — has dramatically improved connectivity, addressing the area's long-standing "MRT gap" and delivering a meaningful property value uplift across the district.`,
    highlights: [
      '15km of East Coast Park seafront — Singapore\'s most popular green corridor',
      'Renowned Peranakan cultural heritage in Joo Chiat and Katong',
      'Legendary hawker scene — East Coast Lagoon Food Village, Katong laksa',
      'Significant freehold landed supply in Siglap, Frankel, and Opera Estate',
      'TEL stations opened — Marine Parade, Siglap, Marine Terrace now connected',
      'Excellent schools including Tao Nan, Victoria School, and CHIJ Katong Convent',
    ],
    demographics: {
      typicalBuyers: 'Families who value the beach lifestyle, Peranakan heritage lovers, HDB upgraders seeking freehold landed homes',
      avgPsfSale: 1800,
      avgRentalPsf: 4.2,
      yoyPriceChange: '+3.5%',
    },
    transport: {
      mrtStations: ['Marine Parade (TE)', 'Marine Terrace (TE)', 'Siglap (TE)', 'Bayshore (TE)', 'Paya Lebar (CC/EW)'],
      expressways: ['ECP', 'PIE'],
      commuteToCbd: '15–20 min',
    },
    schools: [
      { name: 'Tao Nan School', type: 'primary' },
      { name: 'CHIJ (Katong) Primary', type: 'primary' },
      { name: 'Haig Girls\' School', type: 'primary' },
      { name: 'CHIJ Katong Convent', type: 'secondary' },
      { name: 'Victoria School', type: 'secondary' },
      { name: 'Dunman High School', type: 'secondary' },
    ],
    amenities: [
      { name: 'Parkway Parade', type: 'mall' },
      { name: 'i12 Katong', type: 'mall' },
      { name: 'East Coast Lagoon Food Village', type: 'food' },
      { name: 'Joo Chiat / Katong F&B Street', type: 'food' },
      { name: 'East Coast Park', type: 'park' },
      { name: 'Changi General Hospital (nearby)', type: 'hospital' },
    ],
    propertyTypes: [
      'Freehold semi-detached and terrace houses',
      'Peranakan shophouse conversions',
      'Condominiums along Marine Parade Road',
      'HDB estates in Marine Parade and Bedok',
      'Boutique freehold developments in Siglap',
    ],
    priceRanges: {
      salePrice: '$1.2M – $8M+',
      rental: '$2,800 – $12,000/mo',
    },
    pros: [
      'East Coast Park on the doorstep — unmatched outdoor lifestyle',
      'Rich cultural heritage adds character and charm to daily life',
      'Excellent school options including popular SAP schools',
      'Good freehold landed supply for multi-generational families',
      'TEL connectivity finally resolves the area\'s historic MRT gap',
    ],
    cons: [
      'ECP traffic can be congested, especially on weekends',
      'Older HDB estates in Marine Parade are aging and may require estate renewal',
      'Some conservation shophouses require significant upkeep costs',
      'Flood-prone pockets during heavy monsoon rainfall',
    ],
    similarDistricts: [16, 14, 19],
  },
  {
    slug: 'd1-raffles-place',
    district: 1,
    name: 'District 1 — Raffles Place, Marina & Cecil',
    tagline: 'Singapore\'s iconic skyline address — the city\'s financial, cultural, and entertainment nucleus.',
    heroImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1600&h=700&fit=crop',
    overview: `District 1 is the postcard face of Singapore. Anchored by the gleaming towers of Raffles Place — the financial district — and stretching through the Marina Bay waterfront and the historic Cecil Street corridor, this is where Singapore's economic story is written every day. The skyline here, with its mix of colonial landmarks, glass skyscrapers, and the unmistakable silhouette of Marina Bay Sands, is among the most recognised in Asia.

Living in District 1 is fundamentally different from any other part of Singapore. This is a genuine urban live-work-play environment: offices, residences, restaurants, museums, and world-class entertainment are layered within walking distance of each other. The Marina Bay waterfront offers a linear park connecting Gardens by the Bay, the ArtScience Museum, the Esplanade Theatres on the Bay, and Marina Bay Sands — all accessible on foot from most residential developments.

The residential stock reflects the district's premium positioning. Properties like The Sail @ Marina Bay, Marina One Residences, and Wallich Residence (formerly home to Singapore's most expensive apartment) set the benchmark for high-altitude, high-specification urban living. Most units target young professionals, dual-income couples, and international executives who prioritise a zero-commute lifestyle and easy access to CBD dining and entertainment. Foreign ownership is strong here, making it one of Singapore's most internationally traded residential markets.

The absence of major local schools is a consistent trade-off — District 1 is not a family school catchment area. Stamford American International School serves the expatriate community nearby, but families seeking top SAP or GEP schools will look to neighbouring districts. This creates a population profile that skews younger and more transient than, say, Districts 10 or 20.

Despite high entry prices, rental yields in District 1 are among the most compelling in Singapore. Short-term lease demand from banking and finance professionals ensures low vacancy rates, and the perpetual pipeline of CBD workers keeps the market liquid through economic cycles.`,
    highlights: [
      'Walking distance to Marina Bay Sands, Gardens by the Bay, and the Esplanade',
      'Direct MRT connections across five lines — the best-connected district on the island',
      'Rental yields consistently among the highest in Singapore',
      'World-class restaurants, hotels, and cultural venues at ground level',
      'Full urban lifestyle — zero commute for CBD professionals',
      'International investment appeal with strong foreign buyer demand',
    ],
    demographics: {
      typicalBuyers: 'Young professionals, CBD workers, international investors, and expatriate executives on corporate leases',
      avgPsfSale: 2600,
      avgRentalPsf: 6.0,
      yoyPriceChange: '+1.5%',
    },
    transport: {
      mrtStations: ['Raffles Place (NS/EW)', 'Downtown (DT)', 'Marina Bay (NS/TE/CE)', 'Bayfront (CE/DT)', 'Telok Ayer (DT)', 'Tanjong Pagar (EW)'],
      expressways: ['ECP', 'AYE', 'MCE'],
      commuteToCbd: '0–5 min',
    },
    schools: [
      { name: 'Stamford American International School', type: 'international' },
      { name: 'The School of the Arts (SOTA)', type: 'secondary' },
    ],
    amenities: [
      { name: 'Marina Bay Sands Shoppes', type: 'mall' },
      { name: 'One Raffles Place', type: 'mall' },
      { name: 'Gardens by the Bay', type: 'park' },
      { name: 'Marina Barrage Rooftop Garden', type: 'park' },
      { name: 'Lau Pa Sat Festival Market', type: 'food' },
      { name: 'CBD Restaurant Row (Telok Ayer)', type: 'food' },
      { name: 'Raffles Hospital', type: 'hospital' },
    ],
    propertyTypes: [
      'High-rise luxury condominiums',
      'Service apartments',
      'Heritage shophouse conversions',
      'Super-tall residential towers',
      'Integrated mixed-use developments',
    ],
    priceRanges: {
      salePrice: '$1.5M – $20M+',
      rental: '$3,200 – $18,000/mo',
    },
    pros: [
      'Zero-commute living for CBD professionals',
      'Unmatched MRT connectivity — 5 lines within walking distance',
      'Strong rental demand and yields from corporate tenants',
      'Iconic address with global brand recognition',
      'World-class entertainment, dining, and cultural venues all within walking distance',
    ],
    cons: [
      'Very limited family-oriented amenities and local school catchments',
      'Weekend quietness in the financial district can feel sterile',
      'High price quantum for relatively smaller unit sizes',
      'Traffic into and out of the CBD is congested at peak hours',
    ],
    similarDistricts: [9, 2, 6],
  },
  {
    slug: 'd11-newton-novena',
    district: 11,
    name: 'District 11 — Newton & Novena',
    tagline: 'Singapore\'s medical hub — top schools, upmarket living, and exceptional centrality.',
    heroImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&h=700&fit=crop',
    overview: `District 11 occupies a sweet spot in Singapore's property map: central enough for a short CBD commute, residential enough to feel like a genuine neighbourhood, and endowed with both the island's top medical cluster and some of its most prestigious schools. Newton and Novena sit just north of Orchard Road, making this district one of the most accessible and liveable in the city.

The Novena medical cluster — built around Tan Tock Seng Hospital, Mount Elizabeth Novena Hospital, the Specialist Centre, and dozens of specialist clinics — has transformed the precinct into one of Southeast Asia's premier private healthcare destinations. This concentration of medical professionals has driven consistent demand for residential properties within walking distance, keeping vacancy rates low and rental premiums high.

Newton Circus, Singapore's most iconic open-air food centre, anchors the neighbourhood socially. The circular hawker centre, with its famous satay and rojak stalls, is a gathering point for residents across generations. Surrounding it are tree-lined streets, coffee shops, and the quiet charm of landed estates in the Newton and Chancery Hill area — semi-Ds and bungalows that rarely come to market.

The school landscape is exceptional. ACS Primary, Anglo-Chinese Junior College, Raffles Girls' School (Secondary), SCGS, and St Joseph's Institution are all within the district or immediately adjacent, making this a top-tier school catchment address that rivals District 10. Parents frequently cite school proximity as the primary driver for their decision to pay a premium for within-1km registration addresses.

Residential stock spans the spectrum from boutique freehold condominiums to large-format 99-year leasehold developments. Thomson Road and Novena's corridor of well-kept condos attracts a professional demographic, while the upcoming Mount Pleasant MRT station (part of the Cross Island Line) will further enhance the district's already strong connectivity. Novena Square and United Square are the district's commercial heartbeats, with restaurants, cafés, and essential services within easy reach of most addresses.`,
    highlights: [
      'Southeast Asia\'s largest private medical cluster at Novena',
      'ACS Primary, Raffles Girls\' School, and SCGS — three of Singapore\'s best schools',
      'Newton Circus — Singapore\'s most iconic hawker centre',
      'Highly central location — Orchard MRT just one stop away',
      'Strong upside from upcoming Cross Island Line at Mount Pleasant',
      'Quiet landed enclave in Newton and Chancery Hill area',
    ],
    demographics: {
      typicalBuyers: 'Medical and healthcare professionals, families prioritising top school catchments, mid-to-senior expatriate professionals',
      avgPsfSale: 2300,
      avgRentalPsf: 5.5,
      yoyPriceChange: '+2.2%',
    },
    transport: {
      mrtStations: ['Newton (NS/DT)', 'Novena (NS)', 'Toa Payoh (NS)', 'Mount Pleasant (CR — upcoming)'],
      expressways: ['CTE', 'PIE'],
      commuteToCbd: '8–12 min',
    },
    schools: [
      { name: 'ACS (Primary)', type: 'primary' },
      { name: 'Anglo-Chinese School (Barker Road)', type: 'secondary' },
      { name: 'Raffles Girls\' School (Secondary)', type: 'secondary' },
      { name: 'Singapore Chinese Girls\' School (SCGS)', type: 'secondary' },
      { name: 'Anglo-Chinese Junior College', type: 'jc' },
      { name: 'St Joseph\'s Institution', type: 'secondary' },
    ],
    amenities: [
      { name: 'Novena Square', type: 'mall' },
      { name: 'United Square', type: 'mall' },
      { name: 'Newton Food Centre', type: 'food' },
      { name: 'MacRitchie Reservoir Park', type: 'park' },
      { name: 'Tan Tock Seng Hospital', type: 'hospital' },
      { name: 'Mount Elizabeth Novena Hospital', type: 'hospital' },
    ],
    propertyTypes: [
      'Freehold and 99-year leasehold condominiums',
      'Boutique low-rise freehold apartments',
      'Landed homes in Newton and Chancery Hill',
      'Serviced residences near Novena medical cluster',
    ],
    priceRanges: {
      salePrice: '$1.8M – $8M+',
      rental: '$3,500 – $12,000/mo',
    },
    pros: [
      'World-class medical facilities on the doorstep — ideal for health-conscious buyers',
      'Top school catchment addresses — ACS Primary and Raffles Girls\' nearby',
      'Highly central location with dual MRT line access at Newton',
      'Newton Circus hawker centre — one of Singapore\'s best',
      'Upcoming Cross Island Line station at Mount Pleasant will enhance value further',
    ],
    cons: [
      'Thomson Road can be congested during morning and evening peaks',
      'Limited large-format malls compared to nearby Orchard',
      'Some parts of Novena feel more commercial than residential',
      'CRL station timeline uncertainty adds risk for short-term speculation',
    ],
    similarDistricts: [9, 10, 12],
  },
  {
    slug: 'd20-bishan-ang-mo-kio',
    district: 20,
    name: 'District 20 — Bishan, Ang Mo Kio & Thomson',
    tagline: 'Singapore\'s most family-friendly heartland — elite schools, great parks, and outstanding connectivity.',
    heroImage: 'https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?w=1600&h=700&fit=crop',
    overview: `District 20 is the definitive Singapore family district. Bishan and Ang Mo Kio are two of the island's most beloved and well-planned HDB new towns, delivering a complete neighbourhood ecosystem — markets, schools, parks, and MRT stations — that defines the heartland ideal. The district has been consistently transformed in recent decades: the Bishan-Ang Mo Kio Park, a landmark biophilic urban park widely recognised as a model of ecological design, runs through the heart of the district and remains one of Singapore's most visited green spaces.

The school landscape is the district's most compelling draw. Raffles Institution and Raffles Girls' School — widely considered the most prestigious secondary schools in Singapore — are both located in Bishan. Catholic High School, CHIJ St Nicholas Girls' School, and Ai Tong School (one of Singapore's most oversubscribed primary schools) complete a school corridor that has few equals nationally. Parents regularly make deliberate residential decisions based on proximity to these institutions, sustaining strong demand for 1km catchment addresses around each school.

Junction 8 at Bishan MRT serves as the district's commercial hub, offering a full range of retail, dining, and services. AMK Hub in Ang Mo Kio provides additional anchoring, and the Upper Thomson Road stretch has emerged as a vibrant café and restaurant corridor — a quieter, more neighbourhood-friendly version of Holland Village. Thomson Plaza and a scattering of neighbourhood coffeeshops and markets ensure residents never need to travel far for daily needs.

The residential market here is dominated by HDB — most of the housing stock is public housing, making the district inherently more affordable than prime districts. However, the private market (executive condominiums, landed homes in Sunrise Estate and Thomson Road, and mid-range condominiums near the MRT) is active and well-supported. The Thomson-East Coast Line has enhanced connectivity further, with Bright Hill and Upper Thomson stations opening up previously under-served parts of the district.

For HDB upgraders, District 20 offers a clear path: purchase a resale flat with school catchment priority, grow equity over five to ten years, and use the proceeds to purchase private property locally or in adjacent districts. This cycle has been a consistent driver of demand and price stability.`,
    highlights: [
      'Raffles Institution and Raffles Girls\' School — Singapore\'s top secondary schools',
      'Catholic High, CHIJ St Nicholas, and Ai Tong among the district\'s primary options',
      'Bishan-Ang Mo Kio Park — 62 hectares of award-winning ecological park',
      'Junction 8 and AMK Hub for full retail and dining convenience',
      'Thomson-East Coast Line adds Bright Hill and Upper Thomson connectivity',
      'Upper Thomson Road\'s emerging café and restaurant scene',
    ],
    demographics: {
      typicalBuyers: 'Singaporean families with school-going children, HDB upgraders seeking private property, buyers prioritising school catchment',
      avgPsfSale: 1600,
      avgRentalPsf: 3.8,
      yoyPriceChange: '+2.1%',
    },
    transport: {
      mrtStations: ['Bishan (NS/CC)', 'Marymount (CC)', 'Ang Mo Kio (NS)', 'Bright Hill (TE)', 'Upper Thomson (TE)'],
      expressways: ['CTE', 'SLE'],
      commuteToCbd: '18–25 min',
    },
    schools: [
      { name: 'Ai Tong School', type: 'primary' },
      { name: 'Catholic High School (Primary)', type: 'primary' },
      { name: 'CHIJ St Nicholas Girls\' School (Primary)', type: 'primary' },
      { name: 'Raffles Institution', type: 'secondary' },
      { name: 'Raffles Girls\' School (Secondary)', type: 'secondary' },
      { name: 'Catholic High School', type: 'secondary' },
      { name: 'Anderson Serangoon Junior College', type: 'jc' },
    ],
    amenities: [
      { name: 'Junction 8', type: 'mall' },
      { name: 'AMK Hub', type: 'mall' },
      { name: 'Thomson Plaza', type: 'mall' },
      { name: 'Bishan-Ang Mo Kio Park', type: 'park' },
      { name: 'MacRitchie Reservoir (nearby)', type: 'park' },
      { name: 'Upper Thomson Road F&B Strip', type: 'food' },
      { name: 'Ang Mo Kio Polyclinic', type: 'hospital' },
    ],
    propertyTypes: [
      'HDB flats (3-room to executive maisonette)',
      'Executive condominiums',
      'Mid-range 99-year leasehold condos',
      'Landed homes in Thomson Road and Sunrise Estate',
    ],
    priceRanges: {
      salePrice: '$450K – $4M+',
      rental: '$2,200 – $7,000/mo',
    },
    pros: [
      'Singapore\'s best secondary school corridor — Raffles Institution, Raffles Girls\', Catholic High',
      'Highly liveable neighbourhood with complete amenities',
      'More affordable entry point than prime districts',
      'Excellent MRT connectivity on NS and CC lines',
      'Award-winning Bishan-AMK Park for daily recreation',
    ],
    cons: [
      'Longer CBD commute compared to core central districts',
      'Predominantly HDB — private residential land is limited',
      'Competition for school catchment addresses is intense and drives premiums',
      'District feels less cosmopolitan than Orchard or Holland Village',
    ],
    similarDistricts: [19, 26, 11],
  },
]

export function getGuideBySlug(slug: string): DistrictGuide | undefined {
  return DISTRICT_GUIDES.find(g => g.slug === slug)
}

export function getGuideByDistrict(district: number): DistrictGuide | undefined {
  return DISTRICT_GUIDES.find(g => g.district === district)
}

export function getAllGuides(): DistrictGuide[] {
  return DISTRICT_GUIDES
}
