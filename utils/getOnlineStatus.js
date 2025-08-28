function getOnlineStatus(givenTime) {
  // Parse the given time as a Date object
  const givenDate = new Date(givenTime);

  // Get the current UTC time
  const now = new Date();

  // Calculate the difference in minutes
  const diffInMinutes = Math.abs(now - givenDate) / (1000 * 60);
  // Return true if the difference is 10 minutes or less
  return diffInMinutes <= 1;
}

export default getOnlineStatus;
