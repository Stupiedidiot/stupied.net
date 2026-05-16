const BOARD = document.getElementById('board');

// First two digits if the width
// Everything else is board data
const LEVELS = [
    {
    "title":"Hello World",
        "src":"03101110101"
    },
    {
        "title":"Hello World",
        "src":"051011101011011101011101011"
    }
]
// MAIN MENU (?)
// Have a drop down of all the levels: [5x5] Hello World
// Have the option to hide mistakes
// Have the option to show completed rows

// START GAME
// get the query - see what level
// search through LEVELS and get src data
// sets array of board n users
// each click checks if both rows and columns
// update board

// if showMistakes == true
// then disable click once the user is wrong (can't click it again)


// CUSTOM BOARDS
// tell user to not leave any empty rows or columns
/* query should have 
    - c='level info'
    - s='state' (if editing or playing)
    - t='level title' (optional)

*/

var current = {};
current.level = LEVELS[getQuery()]
current.src = current.level.src
current.width = Number(current.src.slice(0,2));

var mistakes = {};
mistakes.html = document.getElementById('mistakes');
mistakes.counter = 0

var user = {};
user.mode = "pen";

// Whether mistakes is shown
// Show completed rows
var settings = {
    showMistakes: false,
    showCompleted: false
};

var solved = {};

initGame();

function initGame () {
    setMatrix();
};


function setMatrix () {
    BOARD.style.setProperty('--columns', current.width);

    current.row = [];
    current.col = [];

    user.row = [];
    user.col = [];

    solved.row = [];
    solved.col = [];

    let offset = 2;
    let rowStart = -1;

    for (let i = 0; i < current.width; i++) {
        current.col.push("");
        user.col.push("");
        solved.col.push("0");
    };

    for (let i = 0; i < current.src.length - offset ;i++) {
        let state = current.src[i + offset];
        let mod = i % current.width;

        let item = document.createElement('div');
        item.setAttribute('onclick','clickTile()');
        item.className = 'tile';
        item.dataset.state = state;
        item.id = i;
        BOARD.append(item);

        if ( mod > 0 ) {
            current.row[rowStart] += state;
            user.row[rowStart] += "0"
        } else {
            rowStart++;
            current.row.push(state);
            user.row.push("0");
            solved.row.push("0");
        };
        current.col[mod] += state;
        user.col[mod] += "0";
    }
};

function clickTile (){
    let self = event.target;

    let state = self.dataset.state;
    let id = self.id
    let mod = id % current.width;
    let row = Math.floor( id / current.width );

    if (state == 1){
        self.classList.add('right');
        user.row[row] = editChar(user.row[row], mod, "1");
            user.col[mod] = editChar(user.col[mod], row, "1");
    } else {
        self.classList.add('wrong');
        mistakes.counter ++;
        mistakes.html.innerHTML = mistakes.counter;
    };
    self.removeAttribute('onclick')
    self.classList.add('mark');

    if ( user.row[row] == current.row[row]) {
        solved.row[row] = "1"
    }

    if ( user.col[mod] == current.col[mod]) {
        solved.col[mod] = "1"
    }

    if (!solved.row.includes('0') && !solved.col.includes('0')) {
        alert('puzzle solved!')
    }
}

addHints()

function addHints () {
    let extra = document.createElement('div');
    extra.classList = 'hint';
    extra.id = 'extra'
    BOARD.prepend(extra)

    let boardStart = document.getElementById('0')
    for (let i = 0; i < current.width; i++) {
        let hint = document.createElement('div');
        hint.classList = 'hint top';
        hint.innerHTML = getHints(current.col[i]);
        BOARD.insertBefore(hint, boardStart)
    }

    mew = BOARD.querySelectorAll('.tile')
    for (let i = 0; i < mew.length; i+= current.width) {
        trueI = i / current.width
        let hint = document.createElement('div');
        hint.classList = 'hint left';
        hint.innerHTML = getHints(current.row[trueI]);
        BOARD.insertBefore(hint,mew[i])
    }
}

console.log( "Current Data =================" )
console.log( current.row )
console.log( current.col )
console.log( "User Data ====================" )
console.log( user.row )
console.log( user.col )
console.log( "==============================" )

console.log("row 0: " + getHints(current.row[0]))
console.log("row 1: " + getHints(current.row[1]))
console.log("row 2: " + getHints(current.row[2]))

console.log( "==============================" )

console.log("col 0: " + getHints(current.col[0]))
console.log("col 1: " + getHints(current.col[1]))
console.log("col 2: " + getHints(current.col[2]))


function getHints (selected) {
    let items = selected.split('');
    let result=[];

    let group = -1;
    let previous = 0;
    
    for( let i = 0; i < items.length; i++ ){
        if ( items[i] == 0 ) { 
            previous = items[i];
            continue;
        } else if ( previous == 0 ) {
            result.push(Number(items[i]));
            group++;
        } else {
            result[group] += Number(items[i]);
        }
        previous = items[i];
    }
    return result;
};

// grabs the first non zero - starts a group
// if next one is > 1 - add to group
// else grab the next non zero

function getQuery() {
    let query = window.location.search.replace('?','');
    if(query === ""){query = LEVELS.length - 1;}
    return query;
}

function editChar (string, index, char) {
    result = string.substring(0, index) + char + string.substring(index + 1)
    return result; 
}


// IDEAS???
// use session storage to store user's progress
// Achievements w/ local storage
// Allow dragging
// array with all the levels
// var levels = [{"title":"","src":"(the binary string)"}]
