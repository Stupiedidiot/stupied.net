---
layout: none
---

const json = document.currentScript.dataset.src;
const IMG_SRC = "/art/img/";
const YAY = "./?p=";

const NEXT = document.getElementById('nextprev_next'); 
const PREV = document.getElementById('nextprev_prev');
const COMM = document.getElementById('nextprev_comment');
const ARCH = document.getElementById('nextprev_archive');

const PAGE = new URL(window.location.href);
var query;

// use hashes w/ next properties in da future
// update the lightbox for the art also plssss
async function start(){
    const response = await fetch(json + "?v={{ site.time | date: '%Y-%m-%d' }}");
    const DATA = await response.json();
    
    if (PAGE.searchParams.has('p')) {
        query = PAGE.searchParams.get('p');
    } else {
        query = DATA[0].img;
    }

    if(ARCH){
        const ARCH_LIST = ARCH.querySelector('ul');

        for (let i = 0; i < DATA.length; i++) {
            const el = DATA[i];
            
            let item = document.createElement('li');
            
            let link = document.createElement('a');
            link.textContent = " " + el.title;
            link.href = YAY + el.img;

            let date = document.createElement('span');
            date.textContent = el.date.slice(0, 10) + ' »';
            date.className = 'h6';

            link.prepend(date);
            item.append(link);  
            ARCH_LIST.append(item);

            if(el.img == query){
                document.getElementById("comic_title").textContent = el.title;
                let target = document.getElementById("comic");
                target.append(createImg(el));

                if(el.extra){
                    el.extra.forEach(ex => {
                        target.append(createImg(ex));
                    });
                }

                if(el.desc){
                    let yep = document.getElementById("comic_notes");
                    yep.parentElement.classList.remove('hidden');
                    yep.innerHTML = el.desc;
                }

                COMM.href = el.url;

                let prev = DATA[i + 1];
                if(prev){
                    PREV.href = YAY + prev.img;
                } else {
                    PREV.parentElement.remove();
                }

                let next = DATA[i - 1]; 
                if(next){
                    NEXT.href = YAY + next.img;
                } else {
                    NEXT.parentElement.remove();
                }
            }
        }

        ARCH.classList.remove('hidden');
    }
}

function createImg(el){
    let href = IMG_SRC + el.img;
    let link = document.createElement('a');
    link.href = href;

    let img = document.createElement('img');
    img.src = href;
    img.alt = el.alt;

    link.append(img);
    return link;
}

start();