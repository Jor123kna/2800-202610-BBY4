export function isLocationOpenNow(location) {
  if (!location.hours) {
    return {
      isOpen: null,
      label: "Hours unknown"
    };
  }

  const now = new Date();

  const dayName = now
    .toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: location.timezone || "America/Vancouver"
    })
    .toLowerCase();

  const currentTime = now.toLocaleTimeString("en-CA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: location.timezone || "America/Vancouver"
  });

  const todayHours = location.hours[dayName];

  if (!todayHours || todayHours.closed) {
    return {
      isOpen: false,
      label: "Closed today"
    };
  }

  if (!todayHours.open || !todayHours.close) {
    return {
      isOpen: null,
      label: "Hours unknown"
    };
  }

  const isOpen =
    currentTime >= todayHours.open &&
    currentTime <= todayHours.close;

  return {
    isOpen,
    label: isOpen
      ? `Open now until ${todayHours.close}`
      : `Closed now · Opens ${todayHours.open}`
  };
}

export function getLocationOpenInfo(loc) {
  if (!loc?.hours) {
    return {
      isOpen: null,
      label: "Hours unknown",
      todayHours: "Hours unknown"
    };
  }

  const timezone = loc.timezone || "America/Vancouver";
  const now = new Date();

  const dayName = now
    .toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: timezone
    })
    .toLowerCase();

  const currentTime = now.toLocaleTimeString("en-CA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone
  });

  const today = loc.hours[dayName];

  if (!today || today.closed) {
    return {
      isOpen: false,
      label: "Closed now",
      todayHours: "Closed today"
    };
  }

  if (!today.open || !today.close) {
    return {
      isOpen: null,
      label: "Hours unknown",
      todayHours: "Hours unknown"
    };
  }

  const isOpen = currentTime >= today.open && currentTime <= today.close;

  return {
    isOpen,
    label: isOpen ? "Open now" : "Closed now",
    todayHours: `${today.open} - ${today.close}`
  };
}