---
layout: none
---
const WARNED = localStorage.getItem("warned");

if (
  WARNED != "true" &&
  window.location.pathname != "/meta/warning"
) {
  let is_crawler = false;
  var USER_AGENT = navigator.userAgent.toLowerCase();
  const CRAWLERS = [
    {%- for e in site.data.meta.crawlers -%}
      {{ e | jsonify}}
      {%- unless forloop.last -%},{%- endunless -%}
    {%- endfor -%}
  ];

  for (let i = 0; i < CRAWLERS.length; i++) {
    if (USER_AGENT.includes(CRAWLERS[i].toLowerCase())) {
      is_crawler = true;
      break;
    }
  }
  
  if (!is_crawler) { 
    window.location.href = '/meta/warning?' + window.location.pathname + window.location.search;
  }
}

var STICKY_CLIKED;
document.addEventListener('DOMContentLoaded', () => {
  const STICKY_E = document.getElementById('page-sticky');
  if (!STICKY_E) return;

  let scrollMax = getThreshold();

  function getThreshold() {
    return (document.documentElement.scrollHeight - window.innerHeight) / 2;
  }

  function updatePosition() {
    const isTop = window.scrollY < scrollMax;
    STICKY_E.classList.toggle('top', !isTop);
    STICKY_E.classList.toggle('bottom', isTop);
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updatePosition();
        ticking = false;
      });
      ticking = true;
    }
  });

  window.addEventListener('resize', () => {
    scrollMax = getThreshold();
    updatePosition();
  });

  STICKY_CLIKED = function () {
    scrollMax = getThreshold();
    updatePosition();
  }

  updatePosition();
});