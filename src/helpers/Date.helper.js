

export const getStartAndEndOfToday= (currentDate) =>{
    return {
      start:  getStartOfDay(currentDate),
      end:  getEndOfDay(currentDate),
    };
  }

  export const getStartOfDay= (date) =>{
    // Set the time to the beginning of the current date (midnight)
    const startOfDate= new Date(date);
    startOfDate.setHours(0, 0, 0, 0);
    const startOfDayISOString = startOfDate.toISOString();
    return startOfDayISOString
  }

  export const getEndOfDay = (date) =>{
    // Set the time to the end of the current date (right before midnight)
    const endDay = new Date(date);
    endDay.setHours(23, 59, 59, 999);
    const endOfDayISOString = endDay.toISOString();
    return endOfDayISOString
  }


  export const getStartAndEndOfWeek = (currentDate) => {
    // Copy the current date to avoid modifying the original object
    const currentDateCopy = new Date(currentDate);
  
    // Calculate the difference between the current day of the week and Monday
    const diff = currentDateCopy.getDay() - 1; // Sunday is 0, Monday is 1, ..., Saturday is 6
  
    // Adjust the date to the start of the week (Monday)
    currentDateCopy.setDate(currentDateCopy.getDate() - diff);
  
    // Set the time to the beginning of the current date (midnight)
    currentDateCopy.setHours(0, 0, 0, 0);
    const startOfWeekISOString = currentDateCopy.toISOString();
  
    // Adjust the date to the end of the week (Sunday)
    currentDateCopy.setDate(currentDateCopy.getDate() + 6);
  
    // Set the time to the end of the current date (right before midnight)
    currentDateCopy.setHours(23, 59, 59, 999);
    const endOfWeekISOString = currentDateCopy.toISOString();
    return {
      start: startOfWeekISOString,
      end: endOfWeekISOString,
    };
  }
  