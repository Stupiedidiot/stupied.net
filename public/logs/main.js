var categories = [
    "crafted",
    "wrote",
    "played"
]

const TARGET = document.getElementById("log_target");
const TARGET_NEXT = document.getElementById("nextprev_next");
const TARGET_PREV = document.getElementById("nextprev_prev");
const TARGET_CURR = document.getElementById("nextprev_curr");

const TARGET_TEXT = document.getElementById("view_target");
const TARGET_HEAD = document.getElementById("view_target_head");
const TARGET_NEXT_SUB = document.getElementById("nextprev_next_sub");
const TARGET_PREV_SUB = document.getElementById("nextprev_prev_sub");

var year;
var month;
var ctr = 0;
var months = ["January","February","March","April","May","June", "July","August","September","October","November","December"];
var micro;

const DATE_CURRENT = new Date();
const QUERY = new URL(window.location.href);

if (QUERY.search){
    if (QUERY.searchParams.has('y')){
        year = parseInt(QUERY.searchParams.get('y'));
    } else {
        year = DATE_CURRENT.getFullYear();
    }

    if (QUERY.searchParams.has('m')){
        month = parseInt(QUERY.searchParams.get('m'));
    } else {
        month = 0;
    }
} else {
    year = DATE_CURRENT.getFullYear();
    month = DATE_CURRENT.getMonth();
}

const DATE_SELECTED = new Date(year, month , 0);
document.querySelector('h1').textContent = months[month] + " " + year; 
TARGET_NEXT.href = "./?y=" + ((month == 11)? (year + 1) : year) + "&m=" + ((month + 1) % 12);
TARGET_PREV.href = "./?y=" + ((month == 0)? (year - 1) : year) + "&m=" + ((month == 0)? 11 : (month - 1));
TARGET_CURR.href = "./?y=" + DATE_CURRENT.getFullYear() + "&m=" +  DATE_CURRENT.getMonth();


// BUILD CALENDAR START
 
add_spacing(DATE_SELECTED.getDay());

for (let i = 1; i <= DATE_SELECTED.getDate(); i++) {
    let el = document.createElement('li');
    el.id = "day-" + i;

    let label = document.createElement('span');
    label.className = 'calendar-date';
    label.textContent = i;
    
    el.append(label);
    add_to_cal(el);
}

if (ctr % 7 !== 0){
    add_spacing(7 - (ctr % 7));
}

fetch("main.json")
    .then((response) => response.json())
    .then((data) => {
        var link = document.createElement('button');
        link.className = 'calendar-link';
        link.role = 'button';

        let idx = 0;

        if (data[year] && data[year][month + 1]){
            days = data[year][month + 1];
            for(const day of days){
                let tar = document.getElementById("day-" + day.day);
                
                if(day.text){
                    let el = link.cloneNode(true);
                    el.setAttribute('onclick', 'viewDay(' + (idx++) + '); toggleModal();');
                    el.dataset.text = day.text;
                    el.dataset.day = day.date;
                    tar.append(el);
                }

                for (let i = 0; i < categories.length; i++) {
                    let el = document.createElement('div');
                    el.className = "yay";
                    if(day[categories[i]]){
                        el.classList.add(categories[i]);
                    }
                    tar.append(el);
                }
            }
        }
        micro = TARGET.querySelectorAll("[data-text]");
    }
)

// FUNCTIONS
function add_spacing(n){
    for (let i = 0; i < n; i++) {
        let el = document.createElement('li');
        add_to_cal(el);
    }
}

function add_to_cal(el){
    TARGET.append(el);
    ctr++;
}

function viewDay(i) {
    let self = micro[i];
    TARGET_HEAD.textContent = self.dataset.day;
    TARGET_TEXT.innerHTML = self.dataset.text;

    let next = (i + 1) % micro.length;
    let prev = ((i - 1 + micro.length)) % micro.length;
    TARGET_NEXT_SUB.setAttribute('onclick', 'viewDay(' + next + ')');
    TARGET_PREV_SUB.setAttribute('onclick', 'viewDay(' + prev + ')');
}

const MODAL = document.querySelector('.modal');
function toggleModal(){
    MODAL.classList.toggle('close');
}

// NAVIGATION
document.onkeydown = function (event) {
  if (!MODAL.classList.contains('close')) {
    switch (event.keyCode) {
      case 37:
        TARGET_PREV_SUB.click()
        break;
      case 39:
        TARGET_NEXT_SUB.click()
        break;
      case 27:
        toggleModal()
        break;
    }
  }
}