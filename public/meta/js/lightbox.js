function wrap(el, wrapper) {el.parentNode.insertBefore(wrapper, el);wrapper.appendChild(el);}

var lightbox = document.createElement('div');
lightbox.setAttribute('onclick', 'closeLightBox()');
lightbox.id = 'lightbox';
lightbox.innerHTML = `
  <div id="lightbox-content">
      <button id="lightbox-prev"></button>

      <img src="#" alt="">
      
      <button id="lightbox-next"></button>

      <div id="lightbox-info">
          <a href="#">View Full Image »</a>
      </div>
  </div>
`

// CHANGE THIS TO BE MORE GENERAL!!
var images = document.querySelectorAll("#p_content img:not(.sign-off)")
for (let i = 0; i < images.length; i++) {
  let result = document.createElement("button");
  result.style.setProperty("--width", images[i].style.getPropertyValue("--width"));
  result.style.setProperty("--height", images[i].style.getPropertyValue("--height"));
  result.setAttribute("onclick", 'openImg(' + i + ')');

  if (e = images[i].className) { 
    result.className = e;
    images[i].className = '';
  }
  result.classList.add("lb-item");

  result.dataset.link = images[i].src;

  wrap(images[i], result);
}

if (images) document.body.prepend(lightbox);

lb_open = false;
lb_e = document.getElementById("lightbox");
lb_e_prop = getComputedStyle(lb_e);
lb_c = document.getElementById("lightbox-content");
lb_i = document.getElementById("lightbox-info");

lb_height = lb_e_prop.getPropertyValue("--default-height");
lb_color = lb_e_prop.getPropertyValue("--default-color");
lb_img = lb_e_prop.getPropertyValue("--default-img");
lb_time = parseFloat(lb_e_prop.getPropertyValue("--time")) * 1500;

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

    if (images[i - 1]) { prev = i - 1; } else { prev = images.length - 1; }
    if (images[i + 1]) { next = i + 1; } else { next = 0; }
    document.getElementById("lightbox-prev").setAttribute("onclick", 'openImg(' + prev + ')');
    document.getElementById("lightbox-next").setAttribute("onclick", 'openImg(' + next + ')');

    lb_item = document.querySelectorAll("button.lb-item")[i];

    lb_i.querySelector("a").href = lb_item.dataset.link;
}

// NAVIGATION START
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
  }
}
// NAVIGATION END