import React, { useEffect, useState } from "react";
import "../styles/DisasterEffects.css";

export default function DisasterEffects({ type }) {
  const [visible, setVisible] = useState(false);
  const [currentType, setCurrentType] = useState(null);

  // Mount/unmount with CSS transition trigger
  useEffect(() => {
    if (type) {
      setCurrentType(type);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      const timer = setTimeout(() => setCurrentType(null), 800);
      return () => clearTimeout(timer);
    }
  }, [type]);

  // Page-level effects (applied to app root)
  useEffect(() => {
    const rootElement = document.getElementById("root");
    const appContainer = document.querySelector(".app-container");
    const appRoot = rootElement || document.body;
    const targets = [appRoot, document.body, rootElement, appContainer].filter(
      Boolean,
    );
    const classes = {
      disaster_earthquake: "de-page-earthquake",
      disaster_tsunami: "de-page-tsunami",
      "disaster_extreme-heat": "de-page-heat",
      disaster_windstorm: "de-page-windstorm",
      "disaster_wildfire-smoke": "de-page-smoke",
      disaster_landslide: "de-page-landslide",
    };

    // Remove all page classes first from every relevant wrapper
    Object.values(classes).forEach((c) => {
      targets.forEach((node) => node.classList.remove(c));
    });

    if (type && classes[type]) {
      targets.forEach((node) => node.classList.add(classes[type]));
      const durations = {
        disaster_earthquake: 2500,
        disaster_tsunami: 2000,
        "disaster_extreme-heat": 3200,
        disaster_windstorm: 2600,
        "disaster_wildfire-smoke": 3200,
        disaster_landslide: 2600,
      };
      const timer = setTimeout(
        () => targets.forEach((node) => node.classList.remove(classes[type])),
        durations[type] || 2500,
      );
      return () => {
        clearTimeout(timer);
        targets.forEach((node) => node.classList.remove(classes[type]));
      };
    }
  }, [type]);

  if (!currentType) return null;

  const effectId = currentType.replace("disaster_", "");

  return (
    <div
      className={`de-overlay de-overlay--${effectId} ${visible ? "de-visible" : ""}`}
    >
      {/* ── FLOOD: rain + rising water + floating debris ── */}
      {effectId === "flood" && (
        <>
          <div className="de-rain" />
          <div className="de-flood-water" />
          <div className="de-flood-wave-l1" />
          <div className="de-flood-wave-l2" />
          <div className="de-flood-wave-l3" />
          <span className="de-splash de-splash--1" />
          <span className="de-splash de-splash--2" />
          <span className="de-splash de-splash--3" />
          <span className="de-splash de-splash--4" />
          <span className="de-splash de-splash--5" />
          <span className="de-splash de-splash--6" />
          <span className="de-splash de-splash--7" />
          <span className="de-float de-float--1">🌿</span>
          <span className="de-float de-float--2">🪵</span>
          <span className="de-float de-float--3">🛖</span>
          <span className="de-float de-float--4">🌿</span>
        </>
      )}

      {/* ── EARTHQUAKE: crack lines + dust ── */}
      {effectId === "earthquake" && (
        <>
          <div className="de-quake-dust" />
          <div className="de-quake-flash" />
        </>
      )}

      {/* ── WILDFIRE: fire from edges + flying embers ── */}
      {effectId === "wildfire" && (
        <>
          <div className="de-fire-bottom" />
          <div className="de-fire-top" />
          <span className="de-ember de-ember--1">🔥</span>
          <span className="de-ember de-ember--2">✨</span>
          <span className="de-ember de-ember--3">🔥</span>
          <span className="de-ember de-ember--4">✨</span>
          <span className="de-ember de-ember--5">🔥</span>
          <span className="de-ember de-ember--6">✨</span>
          <span className="de-ember de-ember--7">🔥</span>
          <span className="de-ember de-ember--8">✨</span>
        </>
      )}

      {/* ── TSUNAMI ── */}
      {effectId === "tsunami" && (
        <>
          {/* Phase 1 – ocean recedes, seafloor exposed */}
          <div className="de-tsunami-recede" />

          {/* Phase 2 – sky darkens, distant wave visible on horizon */}
          <div className="de-tsunami-horizon" />

          {/* Phase 3 – massive wave rises from the deep */}
          <div className="de-tsunami-wave2" />
          <div className="de-tsunami-body" />
          <div className="de-tsunami-face" />
          <div className="de-tsunami-crest" />
          <div className="de-tsunami-spray" />

          {/* Phase 4 – full submersion, caustics, bubbles */}
          <div className="de-tsunami-flood" />
          <div className="de-tsunami-caustic" />
          <span className="de-bubble de-bubble--1" />
          <span className="de-bubble de-bubble--2" />
          <span className="de-bubble de-bubble--3" />
          <span className="de-bubble de-bubble--4" />
          <span className="de-bubble de-bubble--5" />
          <span className="de-bubble de-bubble--6" />
          <span className="de-bubble de-bubble--7" />
        </>
      )}

      {/* ── EXTREME HEAT: sun glow + shimmer lines ── */}
      {effectId === "extreme-heat" && (
        <>
          <div className="de-heat-vignette" />
          <div className="de-sun" />
          <div className="de-heat-wave de-heat-wave--1" />
          <div className="de-heat-wave de-heat-wave--2" />
          <div className="de-heat-wave de-heat-wave--3" />
          <div className="de-heat-wave de-heat-wave--4" />
        </>
      )}

      {/* ── LANDSLIDE: page slides down + rocks fall ── */}
      {effectId === "landslide" && (
        <>
          <div className="de-mud-wall" />
          <span className="de-debris de-debris--1">🪨</span>
          <span className="de-debris de-debris--2">🪨</span>
          <span className="de-debris de-debris--3">🪨</span>
          <span className="de-debris de-debris--4">🪨</span>
          <span className="de-debris de-debris--5">🪨</span>
          <span className="de-debris de-debris--6">🪨</span>
          <span className="de-debris de-debris--7">🪨</span>
          <span className="de-debris de-debris--8">🪨</span>
          <span className="de-debris de-debris--9">🪨</span>
          <span className="de-debris de-debris--10">🪨</span>
        </>
      )}

      {/* ── WINDSTORM: page tilts + streaks + flying debris ── */}
      {effectId === "windstorm" && (
        <>
          <div className="de-wind-streak de-wind-streak--1" />
          <div className="de-wind-streak de-wind-streak--2" />
          <div className="de-wind-streak de-wind-streak--3" />
          <div className="de-wind-streak de-wind-streak--4" />
          <div className="de-wind-streak de-wind-streak--5" />
          <span className="de-wind-debris de-wind-debris--1">🍃</span>
          <span className="de-wind-debris de-wind-debris--2">🌿</span>
          <span className="de-wind-debris de-wind-debris--3">🍂</span>
          <span className="de-wind-debris de-wind-debris--4">🍃</span>
          <span className="de-wind-debris de-wind-debris--5">🍂</span>
        </>
      )}

      {/* ── WILDFIRE SMOKE: smoke billows + ash particles ── */}
      {effectId === "wildfire-smoke" && (
        <>
          <div className="de-smoke-billow de-smoke-billow--1" />
          <div className="de-smoke-billow de-smoke-billow--2" />
          <div className="de-smoke-billow de-smoke-billow--3" />
          <div className="de-smoke-billow de-smoke-billow--4" />
          <div className="de-smoke-billow de-smoke-billow--5" />
          <div className="de-smoke-glow" />
          <div className="de-ash de-ash--1" />
          <div className="de-ash de-ash--2" />
          <div className="de-ash de-ash--3" />
          <div className="de-ash de-ash--4" />
          <div className="de-ash de-ash--5" />
          <div className="de-ash de-ash--6" />
          <div className="de-ash de-ash--7" />
        </>
      )}
    </div>
  );
}
