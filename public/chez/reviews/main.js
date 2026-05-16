const VIEWER = document.getElementById("view");
VIEWER.setAttribute('onclick', 'viewer("")');
let query = window.location.search.replace("?", "");
if (query !== "") {viewer(query);}


function viewer(query) {
    let newUrl = window.location.origin + window.location.pathname;
    if (query.length > 0) {
        VIEWER.classList.add('open');
        document.getElementById(query).classList.add('target');
        newUrl += "?" + query;
    } else if (event.target === VIEWER) {
        VIEWER.classList.remove('open');
        document.getElementsByClassName('target')[0].classList.remove('target');
    }
    window.history.replaceState({}, '', newUrl);
}

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