---
layout: none
---
function wrap(el, wrapper) { el.parentNode.insertBefore(wrapper, el); wrapper.appendChild(el); }

var lightbox = document.createElement('div');
lightbox.setAttribute('onclick', 'closeLightBox()');
lightbox.id = 'lightbox';
lightbox.innerHTML = `
  <div id="lightbox-content">
      <button id="lightbox-prev"></button>

      <img src="#" alt="">
      
      <button id="lightbox-next"></button>

      <div id="lightbox-info">
          <a href="#"></a>
      </div>
  </div>
`
document.body.prepend(lightbox);

//adding links to images
images = document.querySelectorAll(".justified-gallery img")
fetch("/art/main.json?v={{ site.time | date: '%Y-%m-%d' }}")
  .then((response) => response.json())
  .then((art) => {
    for (let i = 0; i < images.length; i++) {
      let result = document.createElement("button");
      result.style.setProperty("--width", images[i].style.getPropertyValue("--width"));
      result.style.setProperty("--height", images[i].style.getPropertyValue("--height"));
      result.setAttribute("onclick", 'openImg(' + i + ')');

      let index = getIndex(art, images[i].src.split("img/")[1]);
      if (index > -1) { 
        result.dataset.link = "/art/p/" + art[index].img.split('.')[0];
        
        let e;
        if (e = art[index].alt)
          images[i].alt = e;

        let title = getTitle(art[index]);
        result.dataset.title = title;
        result.title = "Open " + title;
      } else {
        result.dataset.link = "#";
        result.dataset.title = images[i].src.split("/").pop().split(".")[0].replaceAll("-", " ");
      }

      images[i].style.setProperty("--trueIndex", index);
      wrap(images[i], result);
    }
  }
)

function getIndex(json, current) {
  for (let i = 0; i < json.length; i++) {
    // checks the usual image
    if (json[i].img === current)
      return i;

    // checks the extras
    if (json[i].extra !== undefined)
      for (let x = 0; x < json[i].extra.length; x++)
        if (json[i].extra[x].img === current)
          return i;
  }
  return -1;
}

function getTitle(data) {
  return data.title;
}

function getDate(data) {
  if (data.date)
    return data.date;
  else
    return undefined;
}

lb_open = false
lb_e = document.getElementById("lightbox")
lb_e_prop = getComputedStyle(lb_e)
lb_c = document.getElementById("lightbox-content")
lb_i = document.getElementById("lightbox-info")

lb_height = lb_e_prop.getPropertyValue("--default-height")
lb_color = lb_e_prop.getPropertyValue("--default-color")
lb_img = lb_e_prop.getPropertyValue("--default-img")
lb_time = parseFloat(lb_e_prop.getPropertyValue("--time")) * 1500

function closeLightBox() {
  if (lb_c.contains(event.target) === false) {
    lb_open = false
    lb_e.style.background = "unset"
    lb_e.style.height = "0vh"
    lb_e.querySelector("img").style.maxHeight = "0"
  }
}

function openImg(i) {
  lb_open = true

  lb_e.style.background = lb_color
  lb_e.style.height = lb_height
  lb_e.querySelector("img").style.maxHeight = lb_img

  lb_e.querySelector("img").src = images[i].src

  if (images[i - 1]) { prev = i - 1 } else { prev = images.length - 1 }
  if (images[i + 1]) { next = i + 1 } else { next = 0 }
  document.getElementById("lightbox-prev").setAttribute("onclick", 'openImg(' + prev + ')')
  document.getElementById("lightbox-next").setAttribute("onclick", 'openImg(' + next + ')')

  lb_item = document.querySelectorAll(".justified-gallery button")[i]

  lb_i.querySelector("a").innerHTML = lb_item.dataset.title + " »"
  lb_i.querySelector("a").href = lb_item.dataset.link
}

// navigation
document.onkeydown = function (event) {
  if (lb_open == true) {
    switch (event.keyCode) {
      case 37:
        document.getElementById("lightbox-prev").click()
        break;
      case 39:
        document.getElementById("lightbox-next").click()
        break;
      case 27:
        lb_e.click()
        break;
      case 13:
        lb_i.querySelector("a").click()
        break;
    }
  } else if (document.activeElement === document.body && document.getElementById('viewer')) {
    switch (event.keyCode) {
      case 37:
        if (e = document.getElementById("nextprev-next"))
          e.click();
        break;
      case 39:
        if (e = document.getElementById("nextprev-prev"))
          e.click();
        break;
      case 27:
        if (e = document.getElementById("nextprev-home"))
          e.click();
        break;
      case 82:
        document.getElementById("random-art").click()
        break;
    }
  }
}

// random art
function randomArt() {
  fetch("/art/main.json")
    .then((response) => response.json())
    .then((art) => {
      randomNum = Math.floor(Math.random() * art.length);
      window.location.href = "/art/p/" + art[randomNum].img.split('.')[0];
    })
}

const POST_RELATED = document.getElementById("art_related"),
      POST_RELATED_MAX = 3;

const TAGS_FILTER_OUT = [
  'ocs',
  'fanart-by-others',
  'fanart',
  'digital',
  'traditional',
  'acrylic',
  'watercolor',
  'ink',
  'oil-pastel',
  'crayon',
  'pencil',
  'multi',
  'doodle',
  'with-commentary'
];

if (e = document.getElementById('art_index')) { 
  curr_idx = e.textContent;
  fetch("/art/main.json?v={{ site.time | date: '%Y-%m-%d' }}")
    .then((response) => response.json())
    .then((art) => {
      // TAGS » pls remember to tidy this up
      let tags = art[curr_idx].tags;
      let related = [];

      if (tags !== undefined){
        let tags_filtered = tags.split(' ').filter(v=>v!='');
        
        TAGS_FILTER_OUT.forEach(e => {
          tags_filtered = tags_filtered.filter(v=>v!=e);
        });
        
        for (let i = curr_idx + 1; i < art.length + curr_idx; i++) {
          let index = i % art.length;
          let e = art[index].tags;
          if(e === undefined) continue;

          let regex = new RegExp(`\\b(${tags_filtered.join('|')})\\b`, 'i');
          if (regex.test(e)) related.push(art[index]);
          if (related.length >= POST_RELATED_MAX) break;
        }
      }

      if (related.length === 0)
        for (let i = curr_idx + 1; i < curr_idx + (POST_RELATED_MAX + 1); i++)
          related.push(art[(i % art.length)]);

      related.forEach(e => {
        let item = document.createElement('a');
        item.classList.add('art-related');
        item.href = '/art/p/' + e.img.split('.')[0];
        
        img = document.createElement('img');
        img.src = '/art/img/' + e.img;
        
        let alt;
        if (alt = e.alt)
          img.alt = alt;

        let dims = e.dimension.split('x');
        img.width = dims[0];
        img.height = dims[1];
        
        item.append(img);
        POST_RELATED.append(item);
      });
    }
  )
}