import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function DisasterDetail() {
  const { disasterId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const disasterData = {
    flood: {
      icon: "🌊",
      name: "Flood",
      description: "Heavy rain, river overflow",
      officialLink: {
        label: "PreparedBC Flood Guide",
        url: "https://www2.gov.bc.ca/gov/content/safety/emergency-management/preparedbc/guides-and-resources",
      },
      overview: [
        {
          icon: "📖",
          label: "WHAT IS IT",
          colorClass: "info",
          text: "A flood occurs when water overflows onto normally dry land. In BC, floods are most common during winter when heavy rains overwhelm rivers and storm drains.",
        },
        {
          icon: "📍",
          label: "RISK IN BC",
          colorClass: "risk",
          text: "Vancouver coastal areas, the Fraser Valley, and low-lying neighbourhoods are at high risk during winter storms and spring snowmelt.",
        },
        {
          icon: "⚠️",
          label: "WARNING SIGNS",
          colorClass: "warning",
          text: "Heavy rainfall lasting several hours, rapidly rising water levels, official evacuation orders, and water pooling around your property.",
        },
      ],
      todo: {
        before: [
          "Prepare an emergency kit (water, food, flashlight, first aid)",
          "Know your evacuation routes",
          "Sign up for emergency alerts via the Alertable app",
          "Move valuables to higher floors",
        ],
        during: [
          "Move to higher ground immediately",
          "Avoid walking or driving through flood waters",
          "Listen to emergency broadcasts",
          "Disconnect electrical appliances if safe to do so",
        ],
        after: [
          "Document damage with photos before cleaning up",
          "Contact your insurance company",
          "Avoid flood-damaged buildings until inspected",
          "Boil tap water until officials say it is safe",
        ],
      },
    },

    earthquake: {
      icon: "🌍",
      name: "Earthquake",
      description: "Ground shaking, building damage",
      officialLink: {
        label: "PreparedBC Earthquake & Tsunami Guide",
        url: "https://www2.gov.bc.ca/gov/content/safety/emergency-management/preparedbc/guides-and-resources",
      },
      overview: [
        {
          icon: "📖",
          label: "WHAT IS IT",
          colorClass: "info",
          text: "An earthquake is a sudden shaking of the ground caused by movement of tectonic plates. BC is in an active earthquake zone along the Pacific Ring of Fire.",
        },
        {
          icon: "📍",
          label: "RISK IN BC",
          colorClass: "risk",
          text: "BC has the highest earthquake risk in Canada. A major earthquake (magnitude 7+) is expected in the region within the next 50 years.",
        },
        {
          icon: "⚠️",
          label: "WARNING SIGNS",
          colorClass: "warning",
          text: "There are usually no warning signs. Earthquakes happen suddenly, which is why preparation is critical.",
        },
      ],
      todo: {
        before: [
          "Secure heavy furniture and shelves to walls",
          "Identify safe spots in each room (under sturdy desks)",
          'Practice "Drop, Cover, and Hold On"',
          "Keep an emergency kit accessible",
        ],
        during: [
          "Drop, Cover, and Hold On — get under a desk or table",
          "Stay indoors until shaking stops",
          "If outside, move away from buildings and power lines",
          "If driving, pull over and stay in the vehicle",
        ],
        after: [
          "Check yourself and others for injuries",
          "Be prepared for aftershocks",
          "Inspect your home for damage before re-entering",
          "Use text messages instead of calls to reach loved ones",
        ],
      },
    },

    wildfire: {
      icon: "🔥",
      name: "Wildfire",
      description: "Fast-spreading fire and smoke",
      officialLink: {
        label: "PreparedBC Wildfire Guide",
        url: "https://www2.gov.bc.ca/gov/content/safety/emergency-management/preparedbc/guides-and-resources",
      },
      overview: [
        {
          icon: "📖",
          label: "WHAT IS IT",
          colorClass: "info",
          text: "A wildfire is an uncontrolled fire in forests or grasslands. Smoke from wildfires can affect air quality even hundreds of kilometres away.",
        },
        {
          icon: "📍",
          label: "RISK IN BC",
          colorClass: "risk",
          text: "Wildfire season runs from May to October. Interior BC and forested areas around Metro Vancouver are at high risk during dry summers.",
        },
        {
          icon: "⚠️",
          label: "WARNING SIGNS",
          colorClass: "warning",
          text: "Smoke or hazy skies, smell of burning, fire alerts on news/radio, and visible flames or glow on the horizon.",
        },
      ],
      todo: {
        before: [
          "Create a defensible space around your home",
          "Pack a go-bag with essentials and important documents",
          "Plan multiple evacuation routes",
          "Sign up for local emergency alerts via the Alertable app",
        ],
        during: [
          "Evacuate immediately if ordered",
          "Stay indoors with windows closed if smoke is heavy",
          "Wear an N95 mask if you must go outside",
          "Listen to emergency broadcasts for updates",
        ],
        after: [
          "Wait for officials to say it is safe to return",
          "Watch for hot spots and flare-ups",
          "Check air quality before opening windows",
          "Document property damage for insurance",
        ],
      },
    },

    tsunami: {
      icon: "🌀",
      name: "Tsunami",
      description: "Coastal wave surge after earthquake",
      officialLink: {
        label: "National Tsunami Warning Centre",
        url: "https://www.tsunami.gov/",
      },
      overview: [
        {
          icon: "📖",
          label: "WHAT IS IT",
          colorClass: "info",
          text: "A tsunami is a series of large ocean waves triggered by underwater earthquakes, landslides, or volcanic activity. Even a small wave can carry enormous force.",
        },
        {
          icon: "📍",
          label: "RISK IN BC",
          colorClass: "risk",
          text: "The Lower Mainland is considered a lower-risk tsunami zone compared to the outer coast, but a major Cascadia subduction zone earthquake could generate local waves. Coastal areas like False Creek and the waterfront remain vulnerable.",
        },
        {
          icon: "⚠️",
          label: "WARNING SIGNS",
          colorClass: "warning",
          text: "Strong or prolonged earthquake shaking, unusual rapid ocean receding, a loud roaring sound from the ocean, or an official tsunami warning alert.",
        },
      ],
      todo: {
        before: [
          "Know your tsunami zone and nearest high ground",
          "If near the coast, have a plan to reach 30m+ elevation quickly",
          "Sign up for BC Emergency Alerts",
          "Prepare a grab-and-go emergency kit",
        ],
        during: [
          "If you feel a major earthquake near the coast, move inland immediately — do not wait for an official warning",
          "Move to high ground or inland as fast as possible",
          "Stay away from the shore",
          "A tsunami is a series of waves — the first may not be the largest",
        ],
        after: [
          "Do not return to low-lying areas until officials give the all-clear",
          "Stay away from debris-filled water",
          "Check for injuries and structural damage",
          "Listen to emergency broadcasts for further instructions",
        ],
      },
    },

    "extreme-heat": {
      icon: "☀️",
      name: "Extreme Heat",
      description: "Dangerous heat waves and heatstroke",
      officialLink: {
        label: "City of Vancouver — Extreme Heat",
        url: "https://vancouver.ca/home-property-development/hazards-that-could-affect-our-city.aspx",
      },
      overview: [
        {
          icon: "📖",
          label: "WHAT IS IT",
          colorClass: "info",
          text: "Extreme heat events occur when temperatures reach dangerous levels for multiple consecutive days. Extreme heat causes more weather-related deaths in Canada per year than any other hazard.",
        },
        {
          icon: "📍",
          label: "RISK IN BC",
          colorClass: "risk",
          text: "The 2021 BC heat dome killed hundreds of people across the Lower Mainland. With climate change, severe heat waves are expected to become more frequent and intense in Metro Vancouver.",
        },
        {
          icon: "⚠️",
          label: "WARNING SIGNS",
          colorClass: "warning",
          text: "Environment Canada heat warnings, temperatures above 29°C for two or more consecutive days, overnight temperatures staying above 16°C, and high humidity.",
        },
      ],
      todo: {
        before: [
          "Identify your nearest cooling centre (libraries, community centres)",
          "Install window coverings to block direct sun",
          "Stock up on water and electrolyte drinks",
          "Check on elderly neighbours, children, and pets",
        ],
        during: [
          "Stay in the coolest part of your home or go to a cooling centre",
          "Drink water regularly even if you are not thirsty",
          "Avoid strenuous outdoor activity between 11am–4pm",
          "Never leave children or pets in a parked car",
        ],
        after: [
          "Continue hydrating and rest",
          "Check on vulnerable neighbours",
          "Seek medical attention if you or someone shows signs of heat stroke (confusion, no sweating, high body temperature)",
          "Report heat-related illness to 8-1-1 (HealthLinkBC)",
        ],
      },
    },

    landslide: {
      icon: "⛰️",
      name: "Landslide",
      description: "Slope failure, mudslide, debris flow",
      officialLink: {
        label: "PreparedBC Landslide Guide",
        url: "https://www2.gov.bc.ca/gov/content/safety/emergency-management/preparedbc/guides-and-resources",
      },
      overview: [
        {
          icon: "📖",
          label: "WHAT IS IT",
          colorClass: "info",
          text: "A landslide is the movement of rock, earth, or debris down a slope. They can occur suddenly with little warning, especially during or after heavy rainfall.",
        },
        {
          icon: "📍",
          label: "RISK IN BC",
          colorClass: "risk",
          text: "North Vancouver, West Vancouver, Burnaby Mountain, and other hilly areas of the Lower Mainland are at elevated risk, especially during heavy winter rains and periods of rapid snowmelt.",
        },
        {
          icon: "⚠️",
          label: "WARNING SIGNS",
          colorClass: "warning",
          text: "Cracks in the ground or foundations, tilting trees or fences, sudden changes in water flow or colour, unusual rumbling sounds, and doors/windows that suddenly jam.",
        },
      ],
      todo: {
        before: [
          "Know if your property is in a landslide-prone area",
          "Ensure proper drainage around your home",
          "Avoid building on steep slopes or near drainage channels",
          "Have an evacuation plan ready",
        ],
        during: [
          "Move away quickly — do not go back for belongings",
          "If indoors, move to an upper floor and stay away from windows",
          "If outside, run to the nearest high ground away from the slide path",
          "If escape is impossible, curl into a ball and protect your head",
        ],
        after: [
          "Stay away from the slide area — secondary slides can occur",
          "Check for injured or trapped persons and call 9-1-1",
          "Report damage to the municipality",
          "Do not re-enter your home until it has been inspected",
        ],
      },
    },

    windstorm: {
      icon: "🌬️",
      name: "Windstorm",
      description: "High winds, downed trees and power lines",
      officialLink: {
        label: "Environment Canada — BC Weather Alerts",
        url: "https://weather.gc.ca/warnings/index_e.html?prov=bc",
      },
      overview: [
        {
          icon: "📖",
          label: "WHAT IS IT",
          colorClass: "info",
          text: "Windstorms bring powerful gusts that can down trees, damage buildings, and knock out power. The Lower Mainland experiences severe wind events most commonly in fall and winter.",
        },
        {
          icon: "📍",
          label: "RISK IN BC",
          colorClass: "risk",
          text: "Metro Vancouver's geography creates dangerous wind tunnels. Stanley Park, exposed coastal areas, and communities with mature trees are especially vulnerable. The 2006 Stanley Park windstorm felled thousands of trees in a single night.",
        },
        {
          icon: "⚠️",
          label: "WARNING SIGNS",
          colorClass: "warning",
          text: "Environment Canada wind warnings (sustained winds over 70 km/h or gusts over 90 km/h), rapidly falling barometric pressure, and darkening skies.",
        },
      ],
      todo: {
        before: [
          "Secure or bring in outdoor furniture, decorations, and loose items",
          "Trim dead branches from trees near your home",
          "Charge devices and have flashlights ready in case of power outage",
          "Stock a 72-hour emergency kit",
        ],
        during: [
          "Stay indoors and away from windows",
          "Avoid driving — downed trees and debris are common hazards",
          "Stay away from downed power lines — treat them as live",
          "If power goes out, use flashlights instead of candles",
        ],
        after: [
          "Inspect your roof and property for damage before re-entering",
          "Report downed power lines to BC Hydro (1-888-769-3766)",
          "Clear debris only when it is safe to do so",
          "Check on elderly or vulnerable neighbours",
        ],
      },
    },

    "wildfire-smoke": {
      icon: "💨",
      name: "Wildfire Smoke",
      description: "Poor air quality from regional fires",
      officialLink: {
        label: "City of Vancouver — Wildfire Smoke",
        url: "https://vancouver.ca/home-property-development/hazards-that-could-affect-our-city.aspx",
      },
      overview: [
        {
          icon: "📖",
          label: "WHAT IS IT",
          colorClass: "info",
          text: "Wildfire smoke contains fine particles (PM2.5) and gases that are harmful to breathe. Even when fires are hundreds of kilometres away, smoke can blanket Metro Vancouver for days or weeks.",
        },
        {
          icon: "📍",
          label: "RISK IN BC",
          colorClass: "risk",
          text: "Vancouver regularly experiences poor air quality from BC Interior wildfires during summer. The city's geography traps smoke in the Fraser Valley. People with asthma, heart disease, children, and older adults are most at risk.",
        },
        {
          icon: "⚠️",
          label: "WARNING SIGNS",
          colorClass: "warning",
          text: "Hazy, orange-tinted skies, smell of smoke, Air Quality Health Index (AQHI) rating of 7 or higher, and advisories from Metro Vancouver's Air Quality department.",
        },
      ],
      todo: {
        before: [
          "Get an N95 or P100 respirator mask for each household member",
          "Know how to set your home's HVAC to recirculate air (not draw from outside)",
          "Identify your nearest air quality refuge (a clean-air shelter)",
          "Check the AQHI at aqhi.ca before outdoor activities",
        ],
        during: [
          "Stay indoors with windows and doors closed",
          "Set your air conditioning or ventilation to recirculate mode",
          "Wear an N95 mask if you must go outside — a cloth mask is not enough",
          "Avoid exercise outdoors — physical activity increases how much smoke you inhale",
        ],
        after: [
          "Wait for AQHI to return to a rating of 3 or lower before resuming outdoor activities",
          "Open windows to ventilate your home once air quality improves",
          "Change HVAC filters after a prolonged smoke event",
          "Seek medical advice if you experience persistent cough, shortness of breath, or chest pain",
        ],
      },
    },
  };

  const disaster = disasterData[disasterId];

  if (!disaster) {
    return (
      <div className="page-padding">
        <div style={{ textAlign: "center", marginTop: "var(--space-8)" }}>
          <div style={{ fontSize: "48px", marginBottom: "var(--space-4)" }}>
            ❓
          </div>
          <h1 style={{ marginBottom: "var(--space-2)" }}>Guide not found</h1>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "var(--text-sm)",
              marginBottom: "var(--space-6)",
            }}
          >
            We couldn't find that disaster guide.
          </p>
          <button className="btn btn-primary" onClick={() => navigate("/info")}>
            Back to all guides
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-padding">
      {/* Back link */}
      <button
        className="back-link"
        onClick={() => navigate("/info")}
        aria-label="Back to disaster guides"
      >
        ‹ Back to guides
      </button>

      {/* Disaster header */}
      <div className="disaster-detail-header">
        <div className="disaster-detail-icon" aria-hidden="true">
          {disaster.icon}
        </div>
        <h1 className="disaster-detail-name">{disaster.name}</h1>
        <p className="disaster-detail-desc">{disaster.description}</p>

        {/* Official resource link */}
        <a
          href={disaster.officialLink.url}
          target="_blank"
          rel="noopener noreferrer"
          className="official-link"
          aria-label={`Official resource: ${disaster.officialLink.label} (opens in new tab)`}
        >
          <span className="official-link-icon" aria-hidden="true">
            🏛️
          </span>
          <span className="official-link-text">
            {disaster.officialLink.label}
          </span>
          <span className="official-link-arrow" aria-hidden="true">
            ↗
          </span>
        </a>
      </div>

      {/* Tab toggle (big cards) */}
      <div className="detail-tabs">
        <button
          type="button"
          className={`detail-tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
          aria-pressed={activeTab === "overview"}
        >
          <span className="detail-tab-icon" aria-hidden="true">
            📖
          </span>
          <span className="detail-tab-label">Overview</span>
        </button>
        <button
          type="button"
          className={`detail-tab ${activeTab === "todo" ? "active" : ""}`}
          onClick={() => setActiveTab("todo")}
          aria-pressed={activeTab === "todo"}
        >
          <span className="detail-tab-icon" aria-hidden="true">
            ✓
          </span>
          <span className="detail-tab-label">To-Do</span>
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "overview" ? (
        <div className="detail-overview">
          {disaster.overview.map((section, index) => (
            <div key={index} className="overview-card">
              <div className={`overview-card-header ${section.colorClass}`}>
                <span className="overview-card-icon" aria-hidden="true">
                  {section.icon}
                </span>
                <span className="overview-card-label">{section.label}</span>
              </div>
              <div className="overview-card-text">{section.text}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="detail-todo">
          {/* BEFORE card */}
          <div className="todo-stage-card">
            <div className="todo-stage-header before">
              <span className="todo-stage-icon" aria-hidden="true">
                📋
              </span>
              <span className="todo-stage-label">BEFORE</span>
            </div>
            <ul className="todo-stage-list">
              {disaster.todo.before.map((item, index) => (
                <li key={index} className="todo-stage-item before">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* DURING card */}
          <div className="todo-stage-card">
            <div className="todo-stage-header during">
              <span className="todo-stage-icon" aria-hidden="true">
                ⚠️
              </span>
              <span className="todo-stage-label">DURING</span>
            </div>
            <ul className="todo-stage-list">
              {disaster.todo.during.map((item, index) => (
                <li key={index} className="todo-stage-item during">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* AFTER card */}
          <div className="todo-stage-card">
            <div className="todo-stage-header after">
              <span className="todo-stage-icon" aria-hidden="true">
                ✅
              </span>
              <span className="todo-stage-label">AFTER</span>
            </div>
            <ul className="todo-stage-list">
              {disaster.todo.after.map((item, index) => (
                <li key={index} className="todo-stage-item after">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default DisasterDetail;
