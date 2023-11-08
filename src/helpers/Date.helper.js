

export function getStartAndEndOfToday(currentDate) {
    // Set the time to the beginning of the current date (midnight)
    const startToday = new Date(currentDate);
    startToday.setHours(0, 0, 0, 0);
    const startTodayISOString = startToday.toISOString();
    
    // Set the time to the end of the current date (right before midnight)
    const endToday = new Date(currentDate);
    endToday.setHours(23, 59, 59, 999);
    const endTodayISOString = endToday.toISOString();
  
    return {
      startToday: startTodayISOString,
      endToday: endTodayISOString,
    };
  }