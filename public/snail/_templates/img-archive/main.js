---
---

{% unless include.demo %}const IMG_FOLDER = '/art/img/'; // this is the folder your images are stored in
{% else %}const IMG_FOLDER = 'img'; // this is the folder your images are stored in - relative to the page location
{% endunless %}
const START = 3; // the amount shown when first loaded in

const ARCHIVE_TAGS = [
  {% unless include.demo %}
  "psych",
  {%- for item in site.data.art.tags.psych -%}
    {{ item | jsonify }}
    {%- unless forloop.last -%},{%- endunless -%}
  {%- endfor -%}
{% else %}
  "tag-1",
  "tag-2",
  "tag-3"
{% endunless %}
]

const ARCHIVE_LIST = [
{% unless include.demo %}
  {%- assign limit = 69 -%}
  {%- assign SELECTED_RAW = site.data.art.list | where_exp: 'item','item.tags contains "psych"' -%}
  {%- assign SELECTED = "" | split: ""-%}
  {%- for item in SELECTED_RAW -%}
      {%- unless item.img contains 'doodle/' or item.tags contains 'doodle' -%}
          {%- assign SELECTED = SELECTED | push: item -%}
      {%- endunless -%}
      
      {%- if SELECTED.size >= limit -%}
          {%- break -%}
      {%- endif -%}
  {%- endfor -%}
  
  {%- for item in SELECTED -%}
      {
          "img": {{ item.img | jsonify }}
          
          {%- if item.title -%}
              ,"title": {{ item.title | jsonify }}
          {%- endif -%}

          {%- if item.desc -%}
              ,"desc": {{ item.desc | markdownify  | strip_html | jsonify  }}
          {%- endif -%}

          {%- if item.extra -%}
              ,"extra": [
                  {%- for extra in item.extra -%}
                      {{ extra | jsonify }}
                      {%- unless forloop.last -%},{%- endunless -%}
                  {%- endfor -%}
              ]
          {%- endif -%}

          {%- if item.tags -%}
              ,"tags": {{ item.tags | join: ' ' | jsonify }}
          {%- endif -%}
      }
      {%- unless forloop.last -%},{%- endunless -%}
  {%- endfor -%}
{% else %}
// Topmost part is the most recent.

  { "img": "hello-world.png" }, // This is all you need to write. This is relative to IMG_FOLDER.
  { "img": "/folder/2025.jpg" }, // You can put them into folders.
  
  {
    "img": "custom-title.png",
    "title": "ヽ(✿ﾟ▽ﾟ)ノ", // Custom Title. Will override default title.
    "desc": "This is an awesome description!", // Description of image. Will get enclose in a <p> tag.
    "tags": "tag-1 tag-2" // used to filter your images.
  },

  {
    "img": "moving.gif",
    // you can add additional images.
    "extra": [
      "not-moving-1.png",
      "/folder/not-moving-2.png"
    ],
  },

  // This is what it looks like with all optional items filled in!
  {
    "img": "final.png",
    "title": "This is the final image!",
    "desc": "Thank you for using my dumb ass scripts. I hope they're helpful in some way :D",
    "extra": ["final-for-realzies.png"],
    "tags": "tag-2 tag-3"
  }
{% endunless %}
];

// ATTENTION - don't touch unless you know what you're doing 
const TARGET = document.getElementById("archive_content");
const COUNTER_TARGET = document.getElementById("archive_counter");
var MAX = ARCHIVE_LIST.length; 
var counter = 0;

document.getElementById('archive_max').textContent = MAX;

ARCHIVE_LIST.forEach(item => {
  let result = document.createElement('div');
  result.classList.add('archive-item');
  result.classList.add('hidden');
  result.dataset.tags = item.tags;

  result.append(writeImage(item.img));
  if (item.extra !== undefined)
    item.extra.forEach(extra => { result.append(writeImage(extra)); });

  // Info
  let info = document.createElement('div');
  let title = document.createElement('h2');
  title.classList.add('archive-item-title');
  title.textContent = getTitle(item);
  info.append(title);

  if (item.desc !== undefined) {
    let desc = document.createElement('p');
    desc.classList.add('archive-item-desc');
    desc.textContent = item.desc;
    info.append(desc);
  }
  result.append(info);
  
  // Tags
  if (item.tags !== undefined) {
    let tags = document.createElement('div');
    tags.classList.add('archive-item-tags');
    
    let tags_arr = item.tags.split(' ');
    tags_arr.forEach(tag => {
      let button = document.createElement('button');
      button.setAttribute('onclick', `getChecked('${tag}')`);
      button.textContent = tag;
      tags.append(button);
    });
    result.append(tags);
  }

  TARGET.append(result);
});

function getTitle(e) {
  if (e.title !== undefined) {
    return e.title;
  } else {
    let title = e.img;
    title = title.split("/");
    title = title[title.length - 1];
    title = title.slice(0, title.indexOf('.'))
    title = title.replaceAll("-", " ");
    return title;
  }
}

function writeImage(item) { 
  // Link
  let link = IMG_FOLDER + '/' + item;
  let anchor = document.createElement('a');
  anchor.href = link;

  // Image
  let img = document.createElement('img');
  img.dataset.src = link;
  img.src = '#';
  img.alt = item;
  anchor.append(img);
  return anchor;
}

const TAGS_TARGET = document.getElementById('archive_tags');
ARCHIVE_TAGS.forEach(tag => {
  let label = document.createElement('label');
  label.classList.add('archive-tag')
  label.for = tag;

  let input = document.createElement('input');
  input.type = 'checkbox';
  input.name = 'tags';
  input.value = tag;
  input.name = tag;
  input.id = tag;
  label.append(input);

  let span = document.createElement('span');
  span.textContent = tag;
  label.append(span);

  TAGS_TARGET.append(label);
});

var items = TARGET.querySelectorAll('& > *');
var query = window.location.search.replace("?","");
var separator = '+';
    

if (query === "") showEm(START);
else sortEm();

function getChecked(value) {
  let result = "?";
  if (value === undefined) {
    // if clicking the filter button
    let checked = document.querySelectorAll('input:checked');
    checked.forEach(check => {
      result += check.value + separator;
    });
    result = result.slice(0, result.length - 1)
  } else {
    // if clicking the tag from item
    if (query !== "") {
      split = query.split(separator);
      if (split.includes(value)) return;

      split.forEach(tag => {
        result += tag + separator;
      });
    }
    result += value;
  }
  window.location.href = result;
}


function sortEm() {
  let tags = new Set(query.split(separator));
  tags = Array.from(tags)
  let counter = 0;

  tags.forEach(tag => {
    if (e = document.getElementById(tag))
      e.checked = true;
  });

  for (let i = 0; i < items.length; i++) {
    if (items[i].dataset.tags === undefined) return;
    let data = items[i].dataset.tags.split(" "); 
    let mixed = tags.concat(data);
    let goal = mixed.length - tags.length;
    let set = new Set(mixed).size;

    if (set === goal) {
      counter++;
      items[i].classList.add("all-tags");
    } else {
      items[i].remove();
    }
  }
  
  MAX = counter;
  items = TARGET.querySelectorAll('& > *');
  document.getElementById('archive_max').textContent = counter;
  showEm(START);
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
    document.getElementById("archive_buttons").remove()
  }

  for (let i = prev; i < counter; i++)
    showItem(i);
  COUNTER_TARGET.textContent = counter;
}

function showItem(i) {
  items[i].classList.remove('hidden');
  let thumb = items[i].querySelectorAll('img');
  thumb.forEach(img => {
    img.src = img.dataset.src;
  });
}