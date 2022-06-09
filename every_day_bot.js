let cron = require("node-cron");

console.log("Welcome to weekday bot!");
console.log("I will let you know when it is 10:05 AM");

cron.schedule('5 10 * * *', () => 
    {
        let days = [
            'sunday', 'monday', 'tuesday', 'wednesday', 
            'thursday','friday', 'saturday'
        ];
        let date = new Date();
        console.log(`It is 10:05 on a ${days[date.getDay()]}!`);
    }, 
    {
        scheduled: true,
        timezone: "America/New_York"
    }
);