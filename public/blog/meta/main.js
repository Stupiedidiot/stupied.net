// navigation
document.onkeydown = function(event) {
  if( document.activeElement === document.querySelector("body") ){
    switch (event.keyCode) {
        case 37:
			    if(e=document.getElementById("nextprev-next")){e.click()}
        break;
        case 39:
			    if(e=document.getElementById("nextprev-prev")){e.click()}
        break;
        case 27:
			    document.getElementById("nextprev-archive").click()
        break;
        }
  }
}

// Code Highlights
if (document.querySelector("figure.highlight")){
  var script = document.createElement('script');
  script.src = "/meta/js/highlight.js";
  document.head.appendChild(script);
}

function randomPost(){
    fetch("/blog/meta/posts.json")
        .then((response) => response.json())
        .then((posts) => {
            randomNum = Math.floor(Math.random() * posts.length);
            window.location.href = posts[randomNum]
    })
}