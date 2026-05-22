---
layout: none
---
const TARGET = document.getElementById("archive_content");
var TARGET_DUP = document.getElementById("archive_content_duplicate");
const COUNTER_TARGET = document.getElementById("archive_counter"); 
var START = 16; // the amount shown when first loaded in

const MODE_HTML = document.getElementById('archive_mode');

var counter = 0; 

var ITEMS = document.querySelectorAll('.art-archive.first > *');
var MAX = ITEMS.length;

const PAGE = new URL(window.location.href);

var query = "";
var separator = '~';

if (PAGE.searchParams.has('t'))
  query = PAGE.searchParams.get('t');
else if (window.location.search) {
  PAGE.search = '';
  PAGE.searchParams.set('t', window.location.search.replace('?', '').replaceAll('+', separator));
  window.location.href = PAGE.toString();
}

if (query) sortEm(); 
else showEm(START);

function getChecked(value) {
  let result = '';
  if (value === undefined) {
    // if clicking the filter button
    let checked = document.querySelectorAll('input:checked');
    checked.forEach(check => {
      result += check.value + separator;
    });
    result = result.slice(0, result.length - 1)
    PAGE.searchParams.set('t', result);

    let mode = MODE_HTML.value;
    PAGE.searchParams.set('m', mode);
  } else {
    // if clicking the tag from item
    if (e = PAGE.searchParams.get('t'))
      result += e + separator;

    result += value;
    PAGE.searchParams.set('t', result);
  }
  window.location.href = PAGE.toString();
}


function sortEm() {
  let mode = PAGE.searchParams.get('m'); 
  if (mode) MODE_HTML.value = mode;
  
  let tags = new Set(query.split(separator));
  tags = Array.from(tags);
  let counter = 0;

  tags.forEach(tag => {
    if (e = document.getElementById(tag))
      e.checked = true;
  });

  if (mode == 'not') {
    // NOT
    for (let i = 0; i < ITEMS.length; i++) {
      if (ITEMS[i].dataset.tags === undefined) continue;
      let set_goal = compTags(ITEMS[i].dataset.tags, tags);
      
      if (set_goal[0] < set_goal[2]) {
        ITEMS[i].remove();
      } else {
        counter++;
        ITEMS[i].classList.add("all-tags");
      }
    }
  } else if (mode == 'or') {
    // OR
    for (let i = 0; i < ITEMS.length; i++) {
      if (ITEMS[i].dataset.tags === undefined) continue;
      let set_goal = compTags(ITEMS[i].dataset.tags, tags);
      
      if (set_goal[0] < set_goal[2]) {
        counter++;
        ITEMS[i].classList.add("all-tags");
      } else {
        ITEMS[i].remove();
      }
    }
  } else {
    // AND
    for (let i = 0; i < ITEMS.length; i++) {
      if (ITEMS[i].dataset.tags === undefined) continue;
      let set_goal = compTags(ITEMS[i].dataset.tags, tags);
      
      if (set_goal[0] === set_goal[1]) {
        counter++;
        ITEMS[i].classList.add("all-tags");
      } else {
        ITEMS[i].remove();
      }
    }
  }
  
  
  MAX = counter;
  ITEMS = TARGET.querySelectorAll('& > *');
  document.getElementById('archive_max').textContent = counter;
  showEm(START);
}

function compTags(dataset, tags) {
  let data = dataset.split(" "); 
  let mixed = tags.concat(data);
  let goal = mixed.length - tags.length;
  let set = new Set(mixed).size;
  return [set, goal, mixed.length];
}

function showEm (increment) {
  if (increment === undefined )
    increment = MAX;

  let next = counter + increment;
  let prev = counter;
   
  if ( next <  MAX ) {
    counter = next;
  } else {
    counter = MAX;
    document.getElementById("archive_buttons").remove();
  }

  for (let i = prev; i < counter; i++)
    showItem(i);
  COUNTER_TARGET.textContent = counter;
  TARGET_DUP.innerHTML = TARGET.innerHTML;
}


function showItem (i) {
  let thumb = ITEMS[i].querySelector('img');
  ITEMS[i].classList.remove('hidden');
  thumb.src = thumb.dataset.image;
}