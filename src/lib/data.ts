import type { Agent, Listing, Inquiry, SearchFilters, ListingType } from '@/types/listing'

const AGENTS: Agent[] = [
  {
    id: 'agent-1',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    phone: '+65 9123 4567',
    agency: 'ERA Realty Network',
    license_no: 'R012345A',
    photo_url: 'https://api.dicebear.com/9.x/notionists/svg?seed=Sarah&backgroundColor=c0aede',
    bio: 'Specialising in District 9-11 luxury condos with 12 years of experience. Trusted by over 200 families to find their dream home in Singapore.',
    listings_count: 8,
    strata_agent_id: 'strata-1',
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'agent-2',
    name: 'Michael Tan',
    email: 'michael@example.com',
    phone: '+65 9234 5678',
    agency: 'PropNex Realty',
    license_no: 'R023456B',
    photo_url: 'https://api.dicebear.com/9.x/notionists/svg?seed=Michael&backgroundColor=b6e3f4',
    bio: 'HDB specialist covering Tampines, Bedok, and East Coast. Known for fast turnarounds and transparent service.',
    listings_count: 12,
    strata_agent_id: 'strata-2',
    created_at: '2024-02-20T00:00:00Z',
  },
  {
    id: 'agent-3',
    name: 'Rachel Lim',
    email: 'rachel@example.com',
    phone: '+65 9345 6789',
    agency: 'OrangeTee & Tie',
    license_no: 'R034567C',
    photo_url: 'https://api.dicebear.com/9.x/notionists/svg?seed=Rachel&backgroundColor=ffd5dc',
    bio: 'Award-winning agent specialising in landed properties and Good Class Bungalows. Fluent in English, Mandarin, and Malay.',
    listings_count: 6,
    strata_agent_id: null,
    created_at: '2024-03-10T00:00:00Z',
  },
  {
    id: 'agent-4',
    name: 'David Wong',
    email: 'david@example.com',
    phone: '+65 9456 7890',
    agency: 'Huttons Asia',
    license_no: 'R045678D',
    photo_url: 'https://api.dicebear.com/9.x/notionists/svg?seed=David&backgroundColor=d1d4f9',
    bio: 'Commercial and industrial property specialist. Helping businesses find the perfect space since 2015.',
    listings_count: 5,
    strata_agent_id: 'strata-3',
    created_at: '2024-04-05T00:00:00Z',
  },
]

const LISTINGS: Listing[] = [
  {
    id: 'listing-1',
    agent_id: 'agent-1',
    agent: AGENTS[0],
    type: 'sale',
    property_type: 'condo',
    title: 'Luxury 3BR at The Orchard Residences',
    description: 'Stunning corner unit at the iconic Orchard Residences with breathtaking city views. This spacious 3-bedroom unit features premium Italian marble flooring, Miele kitchen appliances, and floor-to-ceiling windows. Walking distance to ION Orchard and Paragon. 24/7 concierge, infinity pool, and full gym facilities.\n\nPerfect for families who appreciate the convenience of Orchard Road living with the tranquility of a premium residence.',
    price: 4200000,
    price_psf: 2800,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1500,
    address: '238 Orchard Boulevard',
    district: 9,
    postal_code: '248652',
    lat: 1.3048,
    lng: 103.8318,
    amenities: ['Pool', 'Gym', 'Concierge', 'Tennis Court', 'BBQ Pit', 'Function Room'],
    photos: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1616137466211-f736a1b12b24?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    ],
    floor_plan_url: null,
    furnishing: 'fully',
    floor_level: 'High (25-30)',
    tenure: '99 years from 2007',
    top_year: 2011,
    mrt_nearest: 'Orchard',
    mrt_distance_m: 200,
    status: 'active',
    featured: true,
    views: 1245,
    created_at: '2026-03-15T08:00:00Z',
    updated_at: '2026-04-01T10:00:00Z',
  },
  {
    id: 'listing-2',
    agent_id: 'agent-2',
    agent: AGENTS[1],
    type: 'rent',
    property_type: 'hdb',
    title: 'Spacious 4-Room HDB in Tampines Central',
    description: 'Well-maintained 4-room HDB flat in the heart of Tampines. Recently renovated with modern kitchen and bathrooms. Minutes walk to Tampines MRT, Tampines Mall, and Century Square.\n\nNear top schools including St. Hilda\'s Primary and Junyuan Secondary. Perfect for young families looking for convenience and affordability.',
    price: 2800,
    price_psf: null,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 990,
    address: '823 Tampines Street 81',
    district: 18,
    postal_code: '520823',
    lat: 1.3530,
    lng: 103.9453,
    amenities: ['Nearby MRT', 'Hawker Centre', 'Playground', 'Fitness Corner'],
    photos: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
    ],
    floor_plan_url: null,
    furnishing: 'partial',
    floor_level: 'Mid (10-15)',
    tenure: '99 years from 1995',
    top_year: 1998,
    mrt_nearest: 'Tampines',
    mrt_distance_m: 400,
    status: 'active',
    featured: true,
    views: 892,
    created_at: '2026-03-20T08:00:00Z',
    updated_at: '2026-03-28T14:00:00Z',
  },
  {
    id: 'listing-3',
    agent_id: 'agent-3',
    agent: AGENTS[2],
    type: 'sale',
    property_type: 'landed',
    title: 'Stunning Semi-D at Namly Estate',
    description: 'Beautifully rebuilt semi-detached house in the prestigious Namly Estate. This 3-storey home features 5 bedrooms, a private pool, and a landscaped garden. Modern tropical architecture with natural ventilation design.\n\nQuiet residential neighbourhood with easy access to Holland Village and Buona Vista MRT. Zoned for Henry Park Primary School.',
    price: 8500000,
    price_psf: 1700,
    bedrooms: 5,
    bathrooms: 4,
    sqft: 5000,
    address: '12 Namly Crescent',
    district: 10,
    postal_code: '267676',
    lat: 1.3196,
    lng: 103.7855,
    amenities: ['Private Pool', 'Garden', 'Car Porch', 'Helper\'s Room', 'Roof Terrace'],
    photos: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop',
    ],
    floor_plan_url: null,
    furnishing: 'unfurnished',
    floor_level: null,
    tenure: 'Freehold',
    top_year: 2022,
    mrt_nearest: 'Holland Village',
    mrt_distance_m: 800,
    status: 'active',
    featured: true,
    views: 2103,
    created_at: '2026-03-10T08:00:00Z',
    updated_at: '2026-04-05T16:00:00Z',
  },
  {
    id: 'listing-4',
    agent_id: 'agent-1',
    agent: AGENTS[0],
    type: 'rent',
    property_type: 'condo',
    title: 'Modern 2BR at Marina One Residences',
    description: 'Sleek 2-bedroom unit at Marina One with stunning Marina Bay views. Comes fully furnished with designer furniture. The development features a Green Heart — a lush 65,000 sqft garden podium with pools, tennis courts, and dining pavilions.\n\nDirect connection to Marina Bay MRT via underground walkway. Walking distance to Marina Bay Sands, Gardens by the Bay, and the CBD.',
    price: 5500,
    price_psf: null,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1055,
    address: '23 Marina Way',
    district: 1,
    postal_code: '018978',
    lat: 1.2789,
    lng: 103.8536,
    amenities: ['Pool', 'Gym', 'Tennis Court', 'Sky Garden', 'Concierge', 'Direct MRT Access'],
    photos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    ],
    floor_plan_url: null,
    furnishing: 'fully',
    floor_level: 'High (35-40)',
    tenure: '99 years from 2011',
    top_year: 2018,
    mrt_nearest: 'Marina Bay',
    mrt_distance_m: 100,
    status: 'active',
    featured: false,
    views: 678,
    created_at: '2026-04-01T08:00:00Z',
    updated_at: '2026-04-08T09:00:00Z',
  },
  {
    id: 'listing-5',
    agent_id: 'agent-2',
    agent: AGENTS[1],
    type: 'sale',
    property_type: 'hdb',
    title: 'Executive Maisonette in Bishan',
    description: 'Rare executive maisonette in the heart of Bishan. Dual-level layout with 5 bedrooms and a spacious living area. Well-maintained with original layout intact — great potential for renovation.\n\nSteps from Bishan MRT and Junction 8. Top school catchment: Raffles Institution, Catholic High, Kuo Chuan Presbyterian.',
    price: 1080000,
    price_psf: 720,
    bedrooms: 5,
    bathrooms: 3,
    sqft: 1500,
    address: '250 Bishan Street 22',
    district: 20,
    postal_code: '570250',
    lat: 1.3526,
    lng: 103.8352,
    amenities: ['Near MRT', 'Near Schools', 'Hawker Centre', 'Park Connector'],
    photos: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    ],
    floor_plan_url: null,
    furnishing: 'unfurnished',
    floor_level: 'High (9-10)',
    tenure: '99 years from 1988',
    top_year: 1991,
    mrt_nearest: 'Bishan',
    mrt_distance_m: 300,
    status: 'active',
    featured: false,
    views: 1567,
    created_at: '2026-03-25T08:00:00Z',
    updated_at: '2026-04-02T11:00:00Z',
  },
  {
    id: 'listing-6',
    agent_id: 'agent-4',
    agent: AGENTS[3],
    type: 'rent',
    property_type: 'commercial',
    title: 'Prime Office Space at One Raffles Place',
    description: 'Grade A office space in the heart of the CBD. Open floor plan with panoramic city views. Fitted with raised flooring, VRV air-con, and fiber connectivity. Building features direct access to Raffles Place MRT.\n\nIdeal for fintech startups, consulting firms, or regional headquarters.',
    price: 12000,
    price_psf: null,
    bedrooms: 0,
    bathrooms: 2,
    sqft: 2000,
    address: '1 Raffles Place, Tower 2',
    district: 1,
    postal_code: '048616',
    lat: 1.2840,
    lng: 103.8510,
    amenities: ['24/7 Access', 'Loading Bay', 'Meeting Rooms', 'Pantry', 'Direct MRT'],
    photos: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop',
    ],
    floor_plan_url: null,
    furnishing: 'partial',
    floor_level: 'High (30-35)',
    tenure: '99 years from 1983',
    top_year: 1986,
    mrt_nearest: 'Raffles Place',
    mrt_distance_m: 50,
    status: 'active',
    featured: false,
    views: 432,
    created_at: '2026-04-05T08:00:00Z',
    updated_at: '2026-04-10T15:00:00Z',
  },
  {
    id: 'listing-7',
    agent_id: 'agent-1',
    agent: AGENTS[0],
    type: 'sale',
    property_type: 'condo',
    title: 'Penthouse at Reflections at Keppel Bay',
    description: 'Iconic Daniel Libeskind-designed penthouse with uninterrupted sea views. This duplex penthouse features 4 bedrooms, a private roof terrace, and premium finishes throughout. Direct waterfront living with marina berth available.\n\nWorld-class facilities including 7 swimming pools, putting green, and private dining rooms.',
    price: 6800000,
    price_psf: 2267,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 3000,
    address: '1 Keppel Bay View',
    district: 4,
    postal_code: '098417',
    lat: 1.2650,
    lng: 103.8138,
    amenities: ['Pool', 'Gym', 'Marina Berth', 'Concierge', 'Tennis Court', 'BBQ', 'Putting Green'],
    photos: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1616137466211-f736a1b12b24?w=800&h=600&fit=crop',
    ],
    floor_plan_url: null,
    furnishing: 'fully',
    floor_level: 'Penthouse',
    tenure: '99 years from 2007',
    top_year: 2012,
    mrt_nearest: 'Harbourfront',
    mrt_distance_m: 600,
    status: 'active',
    featured: true,
    views: 3201,
    created_at: '2026-03-05T08:00:00Z',
    updated_at: '2026-04-09T12:00:00Z',
  },
  {
    id: 'listing-8',
    agent_id: 'agent-2',
    agent: AGENTS[1],
    type: 'rent',
    property_type: 'condo',
    title: 'Cosy Studio at The Sail @ Marina Bay',
    description: 'Efficient studio apartment at The Sail with bay views. Comes fully furnished with washer/dryer, kitchen essentials, and a queen bed. Perfect for singles or couples working in the CBD.\n\nBuilding amenities include infinity pool, gym, and sky lounge. Steps from Marina Bay MRT.',
    price: 3200,
    price_psf: null,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 474,
    address: '2 Marina Boulevard',
    district: 1,
    postal_code: '018987',
    lat: 1.2800,
    lng: 103.8543,
    amenities: ['Pool', 'Gym', 'Sky Lounge', 'Concierge', 'Near MRT'],
    photos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    ],
    floor_plan_url: null,
    furnishing: 'fully',
    floor_level: 'Mid (20-25)',
    tenure: '99 years from 2004',
    top_year: 2008,
    mrt_nearest: 'Marina Bay',
    mrt_distance_m: 200,
    status: 'active',
    featured: false,
    views: 556,
    created_at: '2026-04-03T08:00:00Z',
    updated_at: '2026-04-07T10:00:00Z',
  },
  {
    id: 'listing-9',
    agent_id: 'agent-3',
    agent: AGENTS[2],
    type: 'sale',
    property_type: 'landed',
    title: 'Brand New Corner Terrace at Siglap',
    description: 'Newly built corner terrace with 4 bedrooms and rooftop terrace. Modern minimalist design with an open-concept living and dining area flowing into a private courtyard garden.\n\nLocated in the charming Siglap neighbourhood, minutes from East Coast Park, Siglap Centre, and top schools including Victoria School and CHIJ Katong.',
    price: 5200000,
    price_psf: 1480,
    bedrooms: 4,
    bathrooms: 4,
    sqft: 3514,
    address: '56 Siglap Road',
    district: 15,
    postal_code: '456112',
    lat: 1.3110,
    lng: 103.9230,
    amenities: ['Roof Terrace', 'Garden', 'Car Porch', 'Helper\'s Room', 'Smart Home'],
    photos: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop',
    ],
    floor_plan_url: null,
    furnishing: 'unfurnished',
    floor_level: null,
    tenure: 'Freehold',
    top_year: 2026,
    mrt_nearest: 'Siglap',
    mrt_distance_m: 500,
    status: 'active',
    featured: false,
    views: 987,
    created_at: '2026-03-28T08:00:00Z',
    updated_at: '2026-04-06T14:00:00Z',
  },
  {
    id: 'listing-10',
    agent_id: 'agent-4',
    agent: AGENTS[3],
    type: 'rent',
    property_type: 'commercial',
    title: 'Shophouse Office at Tanjong Pagar',
    description: 'Beautifully restored conservation shophouse with modern office fit-out. Character-filled space with exposed brick walls, timber beams, and modern amenities. Ground floor reception with upper floor open-plan workspace.\n\nPrime Tanjong Pagar location, walking distance to MRT and surrounded by restaurants and cafes.',
    price: 8500,
    price_psf: null,
    bedrooms: 0,
    bathrooms: 2,
    sqft: 1500,
    address: '78 Tanjong Pagar Road',
    district: 2,
    postal_code: '088498',
    lat: 1.2790,
    lng: 103.8440,
    amenities: ['Heritage Building', 'AC', 'Pantry', 'Meeting Room', 'Near MRT'],
    photos: [
      'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    ],
    floor_plan_url: null,
    furnishing: 'partial',
    floor_level: 'Ground + Upper',
    tenure: '999 years from 1885',
    top_year: null,
    mrt_nearest: 'Tanjong Pagar',
    mrt_distance_m: 200,
    status: 'active',
    featured: false,
    views: 321,
    created_at: '2026-04-08T08:00:00Z',
    updated_at: '2026-04-10T09:00:00Z',
  },
  {
    id: 'listing-11',
    agent_id: 'agent-1',
    agent: AGENTS[0],
    type: 'rent',
    property_type: 'condo',
    title: 'Family 3BR at D\'Leedon',
    description: 'Spacious 3-bedroom unit in the award-winning Zaha Hadid-designed D\'Leedon. Features an open kitchen, balcony with greenery views, and generous bedrooms. Full condo facilities including multiple pools, tennis courts, and a children\'s playground.\n\nConvenient location near Farrer Road MRT, Holland Village, and Dempsey Hill.',
    price: 5800,
    price_psf: null,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1335,
    address: '7 Leedon Heights',
    district: 10,
    postal_code: '267953',
    lat: 1.3150,
    lng: 103.8090,
    amenities: ['Pool', 'Gym', 'Tennis', 'Playground', 'BBQ', 'Function Room'],
    photos: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    ],
    floor_plan_url: null,
    furnishing: 'partial',
    floor_level: 'Mid (12-18)',
    tenure: '99 years from 2010',
    top_year: 2014,
    mrt_nearest: 'Farrer Road',
    mrt_distance_m: 400,
    status: 'active',
    featured: false,
    views: 445,
    created_at: '2026-04-02T08:00:00Z',
    updated_at: '2026-04-09T11:00:00Z',
  },
  {
    id: 'listing-12',
    agent_id: 'agent-2',
    agent: AGENTS[1],
    type: 'sale',
    property_type: 'condo',
    title: 'New Launch 2BR at Lentor Mansion',
    description: 'Brand new 2-bedroom unit at the highly anticipated Lentor Mansion. Features quality finishes, efficient layout, and lush landscaping. Located in the rapidly developing Lentor precinct with excellent connectivity.\n\nWalking distance to Lentor MRT on the Thomson-East Coast Line. Near upcoming Lentor Central mixed-use development.',
    price: 1380000,
    price_psf: 2100,
    bedrooms: 2,
    bathrooms: 1,
    sqft: 657,
    address: '18 Lentor Central',
    district: 26,
    postal_code: '789012',
    lat: 1.3850,
    lng: 103.8360,
    amenities: ['Pool', 'Gym', 'BBQ', 'Playground', 'Rooftop Garden'],
    photos: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    ],
    floor_plan_url: null,
    furnishing: 'unfurnished',
    floor_level: 'Mid (8-12)',
    tenure: '99 years from 2023',
    top_year: 2027,
    mrt_nearest: 'Lentor',
    mrt_distance_m: 300,
    status: 'active',
    featured: false,
    views: 1890,
    created_at: '2026-04-06T08:00:00Z',
    updated_at: '2026-04-10T16:00:00Z',
  },
]

const INQUIRIES: Inquiry[] = [
  {
    id: 'inq-1',
    listing_id: 'listing-1',
    listing: LISTINGS[0],
    agent_id: 'agent-1',
    name: 'James Koh',
    email: 'james.koh@example.com',
    phone: '+65 9111 2222',
    message: 'Hi, I\'m interested in viewing this unit. Is it still available? I can come this weekend.',
    status: 'new',
    strata_lead_id: null,
    created_at: '2026-04-10T14:30:00Z',
  },
  {
    id: 'inq-2',
    listing_id: 'listing-2',
    listing: LISTINGS[1],
    agent_id: 'agent-2',
    name: 'Priya Sharma',
    email: 'priya.s@example.com',
    phone: '+65 9222 3333',
    message: 'Looking to rent for a 2-year lease. Is the landlord flexible on the price for a longer lease?',
    status: 'contacted',
    strata_lead_id: null,
    created_at: '2026-04-09T10:00:00Z',
  },
  {
    id: 'inq-3',
    listing_id: 'listing-3',
    listing: LISTINGS[2],
    agent_id: 'agent-3',
    name: 'Robert Loh',
    email: 'robert.loh@example.com',
    phone: '+65 9333 4444',
    message: 'We\'re a family of 5 looking to upgrade from our condo. Would like to schedule a viewing with my wife.',
    status: 'new',
    strata_lead_id: null,
    created_at: '2026-04-10T09:15:00Z',
  },
]

// Data access functions (will be replaced with Supabase queries later)
export function getListings(filters?: SearchFilters): Listing[] {
  let results = LISTINGS.filter(l => l.status === 'active')

  if (filters?.type) {
    results = results.filter(l => l.type === filters.type)
  }
  if (filters?.property_type) {
    results = results.filter(l => l.property_type === filters.property_type)
  }
  if (filters?.district) {
    results = results.filter(l => l.district === filters.district)
  }
  if (filters?.bedrooms) {
    results = results.filter(l => l.bedrooms >= filters.bedrooms!)
  }
  if (filters?.min_price) {
    results = results.filter(l => l.price >= filters.min_price!)
  }
  if (filters?.max_price) {
    results = results.filter(l => l.price <= filters.max_price!)
  }
  if (filters?.mrt) {
    results = results.filter(l =>
      l.mrt_nearest?.toLowerCase().includes(filters.mrt!.toLowerCase())
    )
  }
  if (filters?.query) {
    const q = filters.query.toLowerCase()
    results = results.filter(l =>
      l.title.toLowerCase().includes(q) ||
      l.address.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q) ||
      l.mrt_nearest?.toLowerCase().includes(q)
    )
  }

  switch (filters?.sort) {
    case 'price_asc':
      results.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      results.sort((a, b) => b.price - a.price)
      break
    case 'popular':
      results.sort((a, b) => b.views - a.views)
      break
    case 'newest':
    default:
      results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  return results
}

export function getFeaturedListings(): Listing[] {
  return LISTINGS.filter(l => l.featured && l.status === 'active')
}

export function getListingById(id: string): Listing | undefined {
  return LISTINGS.find(l => l.id === id)
}

export function getAgents(): Agent[] {
  return AGENTS
}

export function getAgentById(id: string): Agent | undefined {
  return AGENTS.find(a => a.id === id)
}

export function getAgentListings(agentId: string): Listing[] {
  return LISTINGS.filter(l => l.agent_id === agentId && l.status === 'active')
}

export function getInquiriesByAgent(agentId: string): Inquiry[] {
  return INQUIRIES.filter(i => i.agent_id === agentId)
}

export function getInquiriesByListing(listingId: string): Inquiry[] {
  return INQUIRIES.filter(i => i.listing_id === listingId)
}

export function formatPrice(price: number, type: ListingType): string {
  if (type === 'rent') {
    return `$${price.toLocaleString()}/mo`
  }
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(price % 1000000 === 0 ? 0 : 2)}M`
  }
  return `$${price.toLocaleString()}`
}

export function formatPriceFull(price: number, type: ListingType): string {
  if (type === 'rent') {
    return `$${price.toLocaleString()} / month`
  }
  return `$${price.toLocaleString()}`
}
