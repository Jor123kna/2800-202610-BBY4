import { useEffect, useState } from "react";
import { Monitor, Smartphone } from "lucide-react";

function getInstallInstructions() {
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);
  const isSamsung = /SamsungBrowser/i.test(ua);
  const isFirefox = /Firefox/i.test(ua);
  const isEdge = /Edg\//i.test(ua);
  const isChrome = /Chrome/i.test(ua) && !isEdge && !isSamsung;
  const isSafari = /Safari/i.test(ua) && !/Chrome/i.test(ua);

  if (isIOS && isSafari)
    return {
      browser: "Safari",
      isMobile: true,
      steps: [
        "Tap the Share button ↗ at the bottom of Safari",
        'Tap "Add to Home Screen"',
        'Tap "Add" to confirm',
      ],
    };

  if (isIOS && isChrome)
    return {
      browser: "Chrome",
      isMobile: true,
      steps: [
        "Tap the Share button ↗ at the bottom",
        'Tap "Add to Home Screen"',
        'Tap "Add" to confirm',
      ],
    };

  if (isIOS)
    return {
      browser: "your browser",
      isMobile: true,
      steps: [
        "Tap the Share button ↗ at the bottom",
        'Tap "Add to Home Screen"',
        'Tap "Add" to confirm',
      ],
    };

  if (isAndroid && isSamsung)
    return {
      browser: "Samsung Browser",
      isMobile: true,
      steps: [
        "Tap the menu ⋮ in the top right",
        'Tap "Add page to" → "Home screen"',
        'Tap "Add" to confirm',
      ],
    };

  if (isAndroid && isFirefox)
    return {
      browser: "Firefox",
      isMobile: true,
      steps: [
        "Tap the menu ⋮ at the bottom right",
        'Tap "Add to Home screen"',
        'Tap "Add" to confirm',
      ],
    };

  if (isAndroid && isChrome)
    return {
      browser: "Chrome",
      isMobile: true,
      steps: [
        "Tap the menu ⋮ in the top right",
        'Tap "Add to Home screen"',
        'Tap "Add" to confirm',
      ],
    };

  if (isAndroid)
    return {
      browser: "your browser",
      isMobile: true,
      steps: [
        "Tap the menu in the top right",
        'Tap "Add to Home screen"',
        'Tap "Add" to confirm',
      ],
    };

  if (isEdge)
    return {
      browser: "Edge",
      isMobile: false,
      steps: [
        "Click the install icon ⊕ in the address bar",
        'Click "Install" to confirm',
      ],
    };

  if (isFirefox)
    return {
      browser: "Firefox",
      isMobile: false,
      steps: [
        "Firefox doesn't support direct install",
        "Open RouteRelief in Chrome for the best experience",
      ],
      warn: true,
    };

  return {
    browser: "Chrome",
    isMobile: false,
    steps: [
      "Click the install icon ⊕ in the address bar",
      'Click "Install" to confirm',
    ],
  };
}

export default function InstallGuideCard() {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }
  }, []);

  if (isInstalled) return null;

  const { browser, isMobile, steps, note, warn } = getInstallInstructions();
  const DeviceIcon = isMobile ? Smartphone : Monitor;

  return (
    <div className="install-guide-card">
      <div className="install-guide-header">
        <div className="install-guide-header-icon" aria-hidden="true">
          <DeviceIcon size={20} />
        </div>
        <div className="install-guide-title-group">
          <p className="install-guide-card-title">Add to Home Screen</p>
          <p className="install-guide-card-desc">
            Quick access during emergencies
          </p>
        </div>
        <span className="install-guide-badge">
          <DeviceIcon size={12} aria-hidden="true" />
          {browser}
        </span>
      </div>

      <ol className="install-guide-steps">
        {steps.map((step, i) => (
          <li key={i} className={`install-guide-step${warn ? " warn" : ""}`}>
            <span className="install-guide-step-num" aria-hidden="true">
              {i + 1}
            </span>
            <span className="install-guide-step-text">{step}</span>
          </li>
        ))}
      </ol>

      {note && <p className="install-guide-note">{note}</p>}
    </div>
  );
}
