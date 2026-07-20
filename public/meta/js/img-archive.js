---
layout: none
---
const TARGET = document.getElementById("archive_target");
const TARGET_COUNTER = document.getElementById("archive_counter"); 
const TARGET_FILTER = document.getElementById("archive_filter"); 
const TARGET_INFO = "/" + TARGET.dataset.col;
var START = 16; // the amount shown when first loaded in

const FOLDER_IMG = TARGET_INFO + "/img/"; // make sure it always end with a backslash!
const FOLDER_POST = TARGET_INFO + "/p/"
const JSON_FILE = TARGET_INFO + "/main.json";

const MODE_HTML = document.getElementById('archive_mode');

const PAGE = new URL(window.location.href);
var query = "";
var separator = '+';

if (PAGE.searchParams.has('t'))
  query = PAGE.searchParams.get('t');

var DATA;
var MAX;
var CURR_IDX = 0;

async function start() {
  const response = await fetch(JSON_FILE + "?v={{ site.time | date: '%Y-%m-%d' }}");
  const DATA_T = await response.json();
  if (!MAX) MAX = DATA_T.length;

  DATA_T.forEach(el => {
    let res = document.createElement('div');
    res.dataset.tags = el.tags;
    res.className = 'art-archive-item hidden';

    res.style.setProperty('--width', el.dime[0]);
    res.style.setProperty('--height', el.dime[1]);

    let link = document.createElement('a');
    link.href = FOLDER_POST + el.img.split('.')[0];
    link.title = el.title;

    let img = document.createElement('img');
    img.dataset.src = FOLDER_IMG + el.img;
    img.src = "#";
    link.append(img);

    let info = document.createElement('div');
    info.className = 'art-archive-info';

    let title = document.createElement('h3');
    title.className = 'art-archive-title';
    title.textContent = el.title;
    info.append(title);
    
    if (el.tags !== undefined) {
      let tags = document.createElement('div');
      tags.classList.add('art-archive-tags');
      
      let tags_arr = el.tags.split(' ');
      tags_arr.forEach(tag => {
        let button = document.createElement('button');
        button.setAttribute('onclick', `getChecked('${tag}')`);
        button.textContent = tag;
        tags.append(button);
      });
      info.append(tags);
    }

    res.append(link);
    res.append(info);
    TARGET.append(res);
  });

  DATA = TARGET.querySelectorAll('.art-archive-item');

  if (query) sortEm(); 
  else showEm(START);
}

start();

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

function rmChecked(value) { 
  const newTags = query.split(separator).filter(tag => tag !== value).join(separator);

  if (newTags) {
    PAGE.searchParams.set("t", newTags);
  } else {
    PAGE.searchParams.delete("t");
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
    if (e = document.getElementById(tag)) { 
      e.closest('details').open = true;
      e.checked = true;

      let span = document.createElement("span");
      span.className = 'icon-close-outline';

      let name = document.createElement("span");
      name.textContent = tag;
      
      let btn = document.createElement("button");
      btn.setAttribute('onclick', `rmChecked("${tag}")`)
      btn.prepend(tag)
      btn.prepend(span)
      
      TARGET_FILTER.append(btn)
      TARGET_FILTER.classList.remove('hidden');
    }
  });

  if (mode == 'not') {
    // NOT
    for (let i = 0; i < DATA.length; i++) {
      if (DATA[i].dataset.tags === undefined) continue;
      let set_goal = compTags(DATA[i].dataset.tags, tags);
      
      if (set_goal[0] < set_goal[2]) {
        DATA[i].remove();
      } else {
        counter++;
        DATA[i].classList.add("all-tags");
      }
    }
  } else if (mode == 'or') {
    // OR
    for (let i = 0; i < DATA.length; i++) {
      if (DATA[i].dataset.tags === undefined) continue;
      let set_goal = compTags(DATA[i].dataset.tags, tags);
      
      if (set_goal[0] < set_goal[2]) {
        counter++;
        DATA[i].classList.add("all-tags");
      } else {
        DATA[i].remove();
      }
    }
  } else {
    // AND
    for (let i = 0; i < DATA.length; i++) {
      if (DATA[i].dataset.tags === undefined) continue;
      let set_goal = compTags(DATA[i].dataset.tags, tags);
      
      if (set_goal[0] === set_goal[1]) {
        counter++;
        DATA[i].classList.add("all-tags");
      } else {
        DATA[i].remove();
      }
    }
  }
    
  MAX = counter;
  DATA = TARGET.querySelectorAll('& > *');
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

function showEm(increment) {
  if (increment === undefined) increment = MAX;

  let limit = Math.min(CURR_IDX + increment, MAX);

  for (let i = CURR_IDX; i < limit; i++) { 
    if (i + 1 == MAX) { 
      let buttons = document.querySelectorAll('.archive-button');
      buttons.forEach(e => {
        e.remove();
      });
    }
    showItem(i);
  }
  CURR_IDX = limit;
  TARGET_COUNTER.textContent = CURR_IDX;
}


function showItem (i) {
  let thumb = DATA[i].querySelector('img');
  DATA[i].classList.remove('hidden');
  thumb.src = thumb.dataset.src;
}

function toggleView() {
  if (TARGET.classList.contains('default')) {
    TARGET.classList.replace('default', 'justified-gallery')
  } else { 
    TARGET.classList.replace('justified-gallery', 'default')
  }
}