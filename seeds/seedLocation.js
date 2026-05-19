require("dotenv").config();
const mongoose = require("mongoose");
const Location = require("../models/locations");

const regularCommunityHours = {
  monday: { open: "09:00", close: "21:00", closed: false },
  tuesday: { open: "09:00", close: "21:00", closed: false },
  wednesday: { open: "09:00", close: "21:00", closed: false },
  thursday: { open: "09:00", close: "21:00", closed: false },
  friday: { open: "09:00", close: "21:00", closed: false },
  saturday: { open: "09:00", close: "17:00", closed: false },
  sunday: { open: "10:00", close: "17:00", closed: false }
};

const weekdayHours = {
  monday: { open: "09:00", close: "17:00", closed: false },
  tuesday: { open: "09:00", close: "17:00", closed: false },
  wednesday: { open: "09:00", close: "17:00", closed: false },
  thursday: { open: "09:00", close: "17:00", closed: false },
  friday: { open: "09:00", close: "17:00", closed: false },
  saturday: { open: "", close: "", closed: true },
  sunday: { open: "", close: "", closed: true }
};

const locations = [
  {
    name: "Coal Harbour Community Centre",
    address: "480 Broughton Street",
    city: "Vancouver",
    lat: 49.2907,
    lng: -123.1274,
    type: "community centre",
    services: [
      "community gathering",
      "information",
      "washrooms",
      "wifi",
      "charging stations",
      "fitness/recreation",
      "arts/culture",
      "accessibility support"
    ],
    status: "open",
    foodLevel: "unknown",
    waterLevel: "medium",
    shelterLevel: "unknown",
    suppliesLevel: "unknown",
    capacity: null,
    needsSupplies: false,
    contactInfo: {
      phone: "604-718-8222",
      email: "coalharbourcc@vancouver.ca",
      website: "https://vancouver.ca/parks-recreation-culture/coal-harbour-community-centre.aspx"
    },
    notes: "Community centre in downtown Vancouver. Useful as a public gathering and information location during regular hours.",
    volunteers: [],
    reports: [],
    hours: {
      monday: { open: "09:00", close: "22:00", closed: false },
      tuesday: { open: "09:00", close: "22:00", closed: false },
      wednesday: { open: "09:00", close: "22:00", closed: false },
      thursday: { open: "09:00", close: "22:00", closed: false },
      friday: { open: "09:00", close: "21:00", closed: false },
      saturday: { open: "09:00", close: "17:00", closed: false },
      sunday: { open: "10:00", close: "17:00", closed: false }
    },
    timezone: "America/Vancouver"
  },
  {
    name: "Hastings Community Centre",
    address: "3096 East Hastings Street",
    city: "Vancouver",
    lat: 49.2811,
    lng: -123.0371,
    type: "community centre",
    services: [
      "community gathering",
      "information",
      "washrooms",
      "fitness/recreation",
      "youth programs",
      "senior programs",
      "accessibility support"
    ],
    status: "open",
    foodLevel: "unknown",
    waterLevel: "medium",
    shelterLevel: "unknown",
    suppliesLevel: "unknown",
    capacity: null,
    needsSupplies: false,
    contactInfo: {
      phone: "604-718-6222",
      email: "hastingscc@vancouver.ca",
      website: "https://vancouver.ca/parks-recreation-culture/hastings-community-centre.aspx"
    },
    notes: "Community centre and fitness centre in East Vancouver.",
    volunteers: [],
    reports: [],
    hours: {
      monday: { open: "09:00", close: "21:45", closed: false },
      tuesday: { open: "09:00", close: "21:45", closed: false },
      wednesday: { open: "09:00", close: "21:45", closed: false },
      thursday: { open: "09:00", close: "21:45", closed: false },
      friday: { open: "09:00", close: "21:45", closed: false },
      saturday: { open: "09:00", close: "16:45", closed: false },
      sunday: { open: "10:00", close: "14:00", closed: false }
    },
    timezone: "America/Vancouver"
  },
  {
    name: "Kensington Community Centre",
    address: "5175 Dumfries Street",
    city: "Vancouver",
    lat: 49.2385,
    lng: -123.0741,
    type: "community centre",
    services: [
      "community gathering",
      "information",
      "washrooms",
      "fitness/recreation",
      "youth programs",
      "senior programs",
      "accessibility support"
    ],
    status: "open",
    foodLevel: "unknown",
    waterLevel: "medium",
    shelterLevel: "unknown",
    suppliesLevel: "unknown",
    capacity: null,
    needsSupplies: false,
    contactInfo: {
      phone: "604-718-6200",
      email: "kensingtoncc@vancouver.ca",
      website: "https://vancouver.ca/parks-recreation-culture/kensington-community-centre.aspx"
    },
    notes: "Community centre with recreation facilities in southeast Vancouver.",
    volunteers: [],
    reports: [],
    hours: regularCommunityHours,
    timezone: "America/Vancouver"
  },
  {
    name: "Mount Pleasant Community Centre",
    address: "1 Kingsway",
    city: "Vancouver",
    lat: 49.2635,
    lng: -123.0961,
    type: "community centre",
    services: [
      "community gathering",
      "information",
      "washrooms",
      "wifi",
      "fitness/recreation",
      "arts/culture",
      "youth programs",
      "senior programs",
      "newcomer support",
      "accessibility support"
    ],
    status: "open",
    foodLevel: "unknown",
    waterLevel: "medium",
    shelterLevel: "unknown",
    suppliesLevel: "unknown",
    capacity: null,
    needsSupplies: false,
    contactInfo: {
      phone: "604-257-3080",
      email: "",
      website: "https://vancouver.ca/parks-recreation-culture/community-and-cultural-centres.aspx"
    },
    notes: "Central Vancouver community centre near Main Street and Kingsway.",
    volunteers: [],
    reports: [],
    hours: regularCommunityHours,
    timezone: "America/Vancouver"
  },
  {
    name: "Carnegie Community Centre",
    address: "401 Main Street",
    city: "Vancouver",
    lat: 49.2814,
    lng: -123.1001,
    type: "community centre",
    services: [
      "community gathering",
      "information",
      "washrooms",
      "low-cost meals",
      "senior programs",
      "arts/culture",
      "accessibility support"
    ],
    status: "open",
    foodLevel: "medium",
    waterLevel: "medium",
    shelterLevel: "unknown",
    suppliesLevel: "low",
    capacity: null,
    needsSupplies: true,
    contactInfo: {
      phone: "604-665-2220",
      email: "",
      website: "https://vancouver.ca/parks-recreation-culture/community-and-cultural-centres.aspx"
    },
    notes: "Downtown Eastside community centre. Seeded with low-cost meals service for demo filtering.",
    volunteers: [],
    reports: [],
    hours: regularCommunityHours,
    timezone: "America/Vancouver"
  },
  {
    name: "Vancouver Disaster Support Hub - Trout Lake Area",
    address: "3360 Victoria Drive",
    city: "Vancouver",
    lat: 49.2544,
    lng: -123.0650,
    type: "disaster support hub",
    services: [
      "disaster support hub",
      "information",
      "community gathering",
      "family reunification",
      "recovery information",
      "water",
      "supplies",
      "charging stations"
    ],
    status: "limited",
    foodLevel: "unknown",
    waterLevel: "medium",
    shelterLevel: "unknown",
    suppliesLevel: "medium",
    capacity: null,
    needsSupplies: false,
    contactInfo: {
      phone: "311",
      email: "",
      website: "https://vancouver.ca/home-property-development/disaster-support-hubs.aspx"
    },
    notes: "Demo disaster support hub near Trout Lake. Confirm activation and services with official city emergency updates.",
    volunteers: [],
    reports: [],
    hours: regularCommunityHours,
    timezone: "America/Vancouver"
  },
  {
    name: "Greater Vancouver Food Bank Head Office",
    address: "8345 Winston Street",
    city: "Burnaby",
    lat: 49.2580,
    lng: -122.9236,
    type: "food bank",
    services: [
      "food",
      "information",
      "supplies",
      "accessibility support"
    ],
    status: "open",
    foodLevel: "high",
    waterLevel: "unknown",
    shelterLevel: "none",
    suppliesLevel: "medium",
    capacity: null,
    needsSupplies: false,
    contactInfo: {
      phone: "604-876-3601",
      email: "reception@foodbank.bc.ca",
      website: "https://foodbank.bc.ca/find-food/locations/"
    },
    notes: "Food bank organization contact. Users should check official distribution locations and schedules before going.",
    volunteers: [],
    reports: [],
    hours: weekdayHours,
    timezone: "America/Vancouver"
  },
  {
    name: "Quest Food Exchange - Vancouver",
    address: "611 East Hastings Street",
    city: "Vancouver",
    lat: 49.2813,
    lng: -123.0922,
    type: "food bank",
    services: [
      "food",
      "low-cost meals",
      "information",
      "accessibility support"
    ],
    status: "open",
    foodLevel: "medium",
    waterLevel: "unknown",
    shelterLevel: "none",
    suppliesLevel: "unknown",
    capacity: null,
    needsSupplies: false,
    contactInfo: {
      phone: "604-602-0186",
      email: "",
      website: "https://www.questoutreach.org/"
    },
    notes: "Food access organization. Verify eligibility, hours, and location details directly with the organization.",
    volunteers: [],
    reports: [],
    hours: weekdayHours,
    timezone: "America/Vancouver"
  },
  {
    name: "Directions Youth Services Centre",
    address: "1138 Burrard Street",
    city: "Vancouver",
    lat: 49.2801,
    lng: -123.1279,
    type: "emergency shelter",
    services: [
      "shelter",
      "food",
      "water",
      "showers",
      "laundry",
      "medical support",
      "youth programs",
      "information",
      "accessibility support"
    ],
    status: "limited",
    foodLevel: "medium",
    waterLevel: "medium",
    shelterLevel: "low",
    suppliesLevel: "low",
    capacity: 5,
    needsSupplies: true,
    contactInfo: {
      phone: "604-633-1472",
      email: "",
      website: "https://www.fsgv.ca/find-support/youth-services/directions-youth-services/"
    },
    notes: "Youth-focused support centre. Capacity is demo data and should be confirmed before use.",
    volunteers: [],
    reports: [],
    hours: {
      monday: { open: "00:00", close: "23:59", closed: false },
      tuesday: { open: "00:00", close: "23:59", closed: false },
      wednesday: { open: "00:00", close: "23:59", closed: false },
      thursday: { open: "00:00", close: "23:59", closed: false },
      friday: { open: "00:00", close: "23:59", closed: false },
      saturday: { open: "00:00", close: "23:59", closed: false },
      sunday: { open: "00:00", close: "23:59", closed: false }
    },
    timezone: "America/Vancouver"
  },
  {
    name: "First United Shelter",
    address: "320 East Hastings Street",
    city: "Vancouver",
    lat: 49.2813,
    lng: -123.0972,
    type: "emergency shelter",
    services: [
      "shelter",
      "food",
      "water",
      "washrooms",
      "showers",
      "laundry",
      "supplies",
      "information",
      "accessibility support"
    ],
    status: "limited",
    foodLevel: "medium",
    waterLevel: "medium",
    shelterLevel: "low",
    suppliesLevel: "low",
    capacity: 3,
    needsSupplies: true,
    contactInfo: {
      phone: "604-681-8365",
      email: "",
      website: "https://firstunited.ca/"
    },
    notes: "Emergency shelter/support service. Capacity and availability are seeded demo values.",
    volunteers: [],
    reports: [],
    hours: {
      monday: { open: "00:00", close: "23:59", closed: false },
      tuesday: { open: "00:00", close: "23:59", closed: false },
      wednesday: { open: "00:00", close: "23:59", closed: false },
      thursday: { open: "00:00", close: "23:59", closed: false },
      friday: { open: "00:00", close: "23:59", closed: false },
      saturday: { open: "00:00", close: "23:59", closed: false },
      sunday: { open: "00:00", close: "23:59", closed: false }
    },
    timezone: "America/Vancouver"
  },
  {
    name: "City Centre Community Centre",
    address: "5900 Minoru Boulevard",
    city: "Richmond",
    lat: 49.1713,
    lng: -123.1436,
    type: "community centre",
    services: [
      "community gathering",
      "information",
      "washrooms",
      "wifi",
      "fitness/recreation",
      "arts/culture",
      "youth programs",
      "senior programs",
      "accessibility support"
    ],
    status: "open",
    foodLevel: "unknown",
    waterLevel: "medium",
    shelterLevel: "unknown",
    suppliesLevel: "unknown",
    capacity: null,
    needsSupplies: false,
    contactInfo: {
      phone: "604-204-8588",
      email: "citycentre@richmond.ca",
      website: "https://www.richmond.ca/parks-recreation/centres/citycentre.htm"
    },
    notes: "Richmond community centre with multipurpose spaces, meeting rooms, fitness centre, kitchen, arts studio, and music rooms.",
    volunteers: [],
    reports: [],
    hours: regularCommunityHours,
    timezone: "America/Vancouver"
  },
  {
    name: "South Arm Community Centre",
    address: "8880 Williams Road",
    city: "Richmond",
    lat: 49.1404,
    lng: -123.1267,
    type: "community centre",
    services: [
      "community gathering",
      "information",
      "washrooms",
      "fitness/recreation",
      "youth programs",
      "senior programs",
      "accessibility support"
    ],
    status: "open",
    foodLevel: "unknown",
    waterLevel: "medium",
    shelterLevel: "unknown",
    suppliesLevel: "unknown",
    capacity: null,
    needsSupplies: false,
    contactInfo: {
      phone: "604-238-8060",
      email: "southarm@richmond.ca",
      website: "https://www.richmond.ca/parks-recreation/centres/southarm.htm"
    },
    notes: "Richmond community centre. Contact and seniors information is available from City of Richmond pages.",
    volunteers: [],
    reports: [],
    hours: regularCommunityHours,
    timezone: "America/Vancouver"
  },
  {
    name: "Edmonds Community Centre",
    address: "7433 Edmonds Street",
    city: "Burnaby",
    lat: 49.2181,
    lng: -122.9537,
    type: "community centre",
    services: [
      "community gathering",
      "information",
      "washrooms",
      "wifi",
      "fitness/recreation",
      "youth programs",
      "senior programs",
      "childcare",
      "accessibility support"
    ],
    status: "open",
    foodLevel: "unknown",
    waterLevel: "medium",
    shelterLevel: "unknown",
    suppliesLevel: "unknown",
    capacity: null,
    needsSupplies: false,
    contactInfo: {
      phone: "604-297-4838",
      email: "",
      website: "https://www.burnaby.ca/recreation-and-arts/recreation-facilities/edmonds-community-centre"
    },
    notes: "Burnaby community centre.",
    volunteers: [],
    reports: [],
    hours: regularCommunityHours,
    timezone: "America/Vancouver"
  },
  {
    name: "Surrey Urban Mission",
    address: "10776 King George Boulevard",
    city: "Surrey",
    lat: 49.1997,
    lng: -122.8462,
    type: "community kitchen",
    services: [
      "food",
      "low-cost meals",
      "water",
      "supplies",
      "information",
      "community gathering"
    ],
    status: "open",
    foodLevel: "medium",
    waterLevel: "medium",
    shelterLevel: "none",
    suppliesLevel: "low",
    capacity: null,
    needsSupplies: true,
    contactInfo: {
      phone: "604-581-5172",
      email: "",
      website: "https://surreyurbanmission.org/"
    },
    notes: "Community meal/support organization in Surrey. Verify current programs and hours directly.",
    volunteers: [],
    reports: [],
    hours: weekdayHours,
    timezone: "America/Vancouver"
  },
  {
    name: "Surrey Emergency Warming Centre - Demo",
    address: "13450 104 Avenue",
    city: "Surrey",
    lat: 49.1913,
    lng: -122.8490,
    type: "warming centre",
    services: [
      "warming centre",
      "shelter",
      "water",
      "washrooms",
      "information",
      "accessibility support"
    ],
    status: "limited",
    foodLevel: "unknown",
    waterLevel: "medium",
    shelterLevel: "low",
    suppliesLevel: "unknown",
    capacity: 10,
    needsSupplies: false,
    contactInfo: {
      phone: "604-591-4011",
      email: "",
      website: "https://www.surrey.ca/"
    },
    notes: "Demo warming centre entry. Activation depends on weather/emergency operations and should be confirmed through official city notices.",
    volunteers: [],
    reports: [],
    hours: {
      monday: { open: "20:00", close: "23:59", closed: false },
      tuesday: { open: "20:00", close: "23:59", closed: false },
      wednesday: { open: "20:00", close: "23:59", closed: false },
      thursday: { open: "20:00", close: "23:59", closed: false },
      friday: { open: "20:00", close: "23:59", closed: false },
      saturday: { open: "20:00", close: "23:59", closed: false },
      sunday: { open: "20:00", close: "23:59", closed: false }
    },
    timezone: "America/Vancouver"
  },
  {
    name: "Vancouver Cooling Centre - Library Square Demo",
    address: "350 West Georgia Street",
    city: "Vancouver",
    lat: 49.2797,
    lng: -123.1156,
    type: "cooling centre",
    services: [
      "cooling centre",
      "water",
      "washrooms",
      "wifi",
      "charging stations",
      "information",
      "accessibility support"
    ],
    status: "open",
    foodLevel: "none",
    waterLevel: "high",
    shelterLevel: "unknown",
    suppliesLevel: "unknown",
    capacity: null,
    needsSupplies: false,
    contactInfo: {
      phone: "604-331-3603",
      email: "",
      website: "https://www.vpl.ca/"
    },
    notes: "Demo cooling location. Cooling centre activation should be confirmed through official heat-response notices.",
    volunteers: [],
    reports: [],
    hours: regularCommunityHours,
    timezone: "America/Vancouver"
  },
  {
    name: "Vancouver Coastal Health - City Centre Urgent and Primary Care Centre",
    address: "1290 Hornby Street",
    city: "Vancouver",
    lat: 49.2766,
    lng: -123.1290,
    type: "medical support",
    services: [
      "medical support",
      "information",
      "accessibility support"
    ],
    status: "open",
    foodLevel: "none",
    waterLevel: "unknown",
    shelterLevel: "none",
    suppliesLevel: "unknown",
    capacity: null,
    needsSupplies: false,
    contactInfo: {
      phone: "604-416-1811",
      email: "",
      website: "https://www.vch.ca/"
    },
    notes: "Urgent and primary care location. Call 911 for emergencies.",
    volunteers: [],
    reports: [],
    hours: {
      monday: { open: "08:00", close: "22:00", closed: false },
      tuesday: { open: "08:00", close: "22:00", closed: false },
      wednesday: { open: "08:00", close: "22:00", closed: false },
      thursday: { open: "08:00", close: "22:00", closed: false },
      friday: { open: "08:00", close: "22:00", closed: false },
      saturday: { open: "08:00", close: "22:00", closed: false },
      sunday: { open: "08:00", close: "22:00", closed: false }
    },
    timezone: "America/Vancouver"
  },
  {
    name: "BC SPCA Vancouver Community Animal Centre",
    address: "1205 East 7th Avenue",
    city: "Vancouver",
    lat: 49.2645,
    lng: -123.0794,
    type: "pet support",
    services: [
      "pet support",
      "information",
      "supplies",
      "accessibility support"
    ],
    status: "open",
    foodLevel: "none",
    waterLevel: "unknown",
    shelterLevel: "unknown",
    suppliesLevel: "medium",
    capacity: null,
    needsSupplies: false,
    contactInfo: {
      phone: "604-879-7721",
      email: "",
      website: "https://spca.bc.ca/locations/vancouver/"
    },
    notes: "Pet support and animal welfare location. Verify emergency pet support availability directly.",
    volunteers: [],
    reports: [],
    hours: weekdayHours,
    timezone: "America/Vancouver"
  },
  {
    name: "TransLink Customer Service Centre - Waterfront Station",
    address: "601 West Cordova Street",
    city: "Vancouver",
    lat: 49.2856,
    lng: -123.1116,
    type: "information centre",
    services: [
      "information",
      "recovery information",
      "accessibility support"
    ],
    status: "open",
    foodLevel: "none",
    waterLevel: "unknown",
    shelterLevel: "none",
    suppliesLevel: "unknown",
    capacity: null,
    needsSupplies: false,
    contactInfo: {
      phone: "604-953-3333",
      email: "",
      website: "https://www.translink.ca/"
    },
    notes: "Transit information point. Useful for transportation updates during disruptions.",
    volunteers: [],
    reports: [],
    hours: weekdayHours,
    timezone: "America/Vancouver"
  }
];

async function seedLocations() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await Location.deleteMany({});
    await Location.insertMany(locations);

    console.log(`Seeded ${locations.length} locations successfully.`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding locations:", error);
    process.exit(1);
  }
}

seedLocations();