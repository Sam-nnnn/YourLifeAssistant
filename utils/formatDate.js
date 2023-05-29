 
function convertToMilliseconds(stringDate) {
    const parts = stringDate.split('-');
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; 
    const day = parseInt(parts[2]);
    const hour = parseInt(parts[3]);
    const minute = parseInt(parts[4]);
    const second = parseInt(parts[5]);
  
    const targetDate = new Date(year, month, day, hour, minute, second);
    const currentTime = new Date();
  
    const millisecondsDiff = targetDate.getTime() - currentTime.getTime();
 
  
    return millisecondsDiff;
}
 

module.exports = convertToMilliseconds
 