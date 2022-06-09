let cron = require("node-cron");

let isClockDisplaying;
let asciiMap;

// Can't call task.stop from within the task
// so setup this to allow for the first execution
// of the minute task to then stop the task that is
// waiting for the top of the minute to print updated clock
let isWaitForMinuteTaskAlive;
let hasStartedMinuteTask;
let waitForTopOfMinuteTask;

function main() {
    init();
    waitForTopOfMinute();
}

main();

function init() {
    isClockDisplaying = false;
    isWaitForMinuteTaskAlive = true;
    hasStartedMinuteTask = false;
    asciiMap = buildAsciiMap();
}



function waitForTopOfMinute() {
    waitForTopOfMinuteTask = cron.schedule('* * * * * *', () => {
        let date = new Date();
        let seconds = date.getSeconds();
        if(seconds === 0 && !hasStartedMinuteTask) {
            hasStartedMinuteTask = true;
            startClock();
        } else if(!isClockDisplaying) {
            isClockDisplaying = true;
            printClock();
        }
    });
}

function startClock() {
    printClock();
    cron.schedule('* * * * *', () => {
        if(isWaitForMinuteTaskAlive) {
            isWaitForMinuteTaskAlive = false;
            stopTask(waitForTopOfMinuteTask);
        }
        printClock();
    });
}

function printClock() {
    console.clear();
    let segments = buildTimeSegments();
    printAsciiClock(segments);
}

function buildTimeSegments() {
    let date = new Date();
    let minutes = date.getMinutes();
    let minutesDisplay = minutes < 10 ? `0${minutes}` : `${minutes}`;
    let timeString = `${date.getHours()}:${minutesDisplay}`;

    return [...timeString].map(digit => {
        if(digit === ':') {
            return asciiMap['colon'];
        }
        return asciiMap[digit];
    })
}

function printAsciiClock(asciiElements) {
    let rows = asciiElements[0].length;
    for(let row = 0; row < rows; row++) {
        let line = '';
        asciiElements.forEach(asciiArt => {
            line += asciiArt[row];
        });
        console.log(line);
    }
    console.log("\n");
}

function stopTask(task) {
    task.stop();
}


function buildAsciiMap() { 
    return {
        '0': [
            `   ,a8888a,      `,
            ` ,8P"'  '"Y8,    `,
            `,8P        Y8,   `,
            `88          88   `,
            `88          88   `,
            ` 8b        d8'   `,
            ` '8ba,  ,ad8'    `,
            `   "Y8888P"      `,
        ],
        '1': [
            `    88   `,
            `  ,d88   `,
            `888888   `,
            `    88   `,
            `    88   `,
            `    88   `,
            `    88   `,
            `    88   `,           
        ],
        '2': [
            `ad888888b,    `,  
            `d8"     "88   `,  
            `        a8P   `,  
            `     ,d8P"    `,   
            `   a8P"       `,      
            ` a8P'         `,        
            `d8"           `,          
            `88888888888   `,  
        ],
        '3': [
            `ad888888b,    `,
            `d8"     "88   `,
            `        a8P   `,
            `     aad8"    `,
            `     ""Y8,    `,
            `        "8b   `,
            `Y8,     a88   `,
            ` "Y888888P'   `,
        ],
        '4': [
            `        ,d8     `,
            `      ,d888     `,
            `    ,d8" 88     `,
            `  ,d8"   88     `,
            `,d8"     88     `,
            `8888888888888   `,
            `         88     `,
            `         88     `,
        ],
        '5': [
            `8888888888    `,
            `88            `,
            `88  ____      `,
            `88a8PPPP8b,   `,
            `PP"     '8b   `,
            `         d8   `,
            `Y8a     a8P   `,
            ` "Y88888P"    `,
        ],
        '6': [
        ` ad8888ba,    `,
        ` 8P'    "Y8   `,
        `d8            `,
        `88,dd888bb,   `,
        `88P'    '8b   `,
        `88       d8   `,
        `88a     a8P   `,
        ` "Y88888P"    `,
        ],
        '7': [
            `888888888888   `,
            `        ,8P'   `,
            `       d8"     `,
            `     ,8P'      `,
            `    d8"        `,
            `  ,8P'         `,
            ` d8"           `,
            `8P'            `,
        ],
        '8': [
            ` ad88888ba    `,
            `d8"     "8b   `,
            `Y8a     a8P   `,
            ` "Y8aaa8P"    `,
            ` ,d8"""8b,    `,
            `d8"     "8b   `,
            `Y8a     a8P   `,
            ` "Y88888P"    `,
        ],
        '9': [
            ` ad88888ba    `,
            `d8"     "88   `,
            `8P       88   `,
            `Y8,    ,d88   `,
            ` "PPPPPP"88   `,
            `         8P   `,
            `8b,    a8P    `,
            `'"Y8888P'     `,
        ],
        'colon': [
            `      `,      
            `888   `,  
            `888   `,  
            `      `,  
            `      `,  
            `888   `,  
            `888   `,  
            `      `,  
        ],
    };       
}


        



