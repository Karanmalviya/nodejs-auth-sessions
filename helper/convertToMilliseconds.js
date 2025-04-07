function convertToMilliseconds(timeString) {
  const timeValue = parseInt(timeString);
  if (timeString.includes("d")) return timeValue * 24 * 60 * 60 * 1000;
  if (timeString.includes("h")) return timeValue * 60 * 60 * 1000;
  if (timeString.includes("m")) return timeValue * 60 * 1000;
  if (timeString.includes("s")) return timeValue * 1000;
  return timeValue;
}

module.exports = convertToMilliseconds;
