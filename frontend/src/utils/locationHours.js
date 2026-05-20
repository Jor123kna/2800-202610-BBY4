const DEFAULT_TIMEZONE = "America/Vancouver";

// Return the timezone for the provided location or fall back to the default.
const getTimezone = (location) => {
  return location.timezone || DEFAULT_TIMEZONE;
};

// Return the current day of the week in lowercase for the given timezone.
const getCurrentDayName = (timezone) => {
  return new Date()
    .toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: timezone,
    })
    .toLowerCase();
};

// Return the current time in HH:mm format for the given timezone.
const getCurrentTime = (timezone) => {
  return new Date().toLocaleTimeString("en-CA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
  });
};

// Return the timezone and today's hours object for the provided location.
const getTodayHours = (location) => {
  const timezone = getTimezone(location);
  const dayName = getCurrentDayName(timezone);

  return {
    timezone,
    todayHours: location.hours?.[dayName],
  };
};

// Return true if today's hours are missing or open/close values are incomplete.
const hasUnknownHours = (todayHours) => {
  return !todayHours || !todayHours.open || !todayHours.close;
};

// Return true if the location is marked closed for today.
const isClosedToday = (todayHours) => {
  return !todayHours || todayHours.closed;
};

// Return true if the current time falls within today's open hours.
const checkIsOpen = (currentTime, todayHours) => {
  return currentTime >= todayHours.open && currentTime <= todayHours.close;
};

// Return open/closed status and label for whether the location is currently open.
export function isLocationOpenNow(location) {
  if (!location.hours) {
    return {
      isOpen: null,
      label: "Hours unknown",
    };
  }

  const { timezone, todayHours } = getTodayHours(location);

  if (isClosedToday(todayHours)) {
    return {
      isOpen: false,
      label: "Closed today",
    };
  }

  if (hasUnknownHours(todayHours)) {
    return {
      isOpen: null,
      label: "Hours unknown",
    };
  }

  const currentTime = getCurrentTime(timezone);
  const isOpen = checkIsOpen(currentTime, todayHours);

  return {
    isOpen,
    label: isOpen
      ? `Open now until ${todayHours.close}`
      : `Closed now · Opens ${todayHours.open}`,
  };
}

// Return open/closed summary and today's hours string for the provided location.
export function getLocationOpenInfo(loc) {
  if (!loc?.hours) {
    return {
      isOpen: null,
      label: "Hours unknown",
      todayHours: "Hours unknown",
    };
  }

  const { timezone, todayHours } = getTodayHours(loc);

  if (isClosedToday(todayHours)) {
    return {
      isOpen: false,
      label: "Closed now",
      todayHours: "Closed today",
    };
  }

  if (hasUnknownHours(todayHours)) {
    return {
      isOpen: null,
      label: "Hours unknown",
      todayHours: "Hours unknown",
    };
  }

  const currentTime = getCurrentTime(timezone);
  const isOpen = checkIsOpen(currentTime, todayHours);

  return {
    isOpen,
    label: isOpen ? "Open" : "Closed",
    todayHours: `${todayHours.open} - ${todayHours.close}`,
  };
}