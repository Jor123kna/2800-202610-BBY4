const DEFAULT_TIMEZONE = "America/Vancouver";

const getTimezone = (location) => {
  return location.timezone || DEFAULT_TIMEZONE;
};

const getCurrentDayName = (timezone) => {
  return new Date()
    .toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: timezone,
    })
    .toLowerCase();
};

const getCurrentTime = (timezone) => {
  return new Date().toLocaleTimeString("en-CA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
  });
};

const getTodayHours = (location) => {
  const timezone = getTimezone(location);
  const dayName = getCurrentDayName(timezone);

  return {
    timezone,
    todayHours: location.hours?.[dayName],
  };
};

const hasUnknownHours = (todayHours) => {
  return !todayHours || !todayHours.open || !todayHours.close;
};

const isClosedToday = (todayHours) => {
  return !todayHours || todayHours.closed;
};

const checkIsOpen = (currentTime, todayHours) => {
  return currentTime >= todayHours.open && currentTime <= todayHours.close;
};

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