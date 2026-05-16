---
layout: none
---
const MASTER = [
    {%- include lib/list.json -%}
]

// PAGE TEMPLATE
const PATH = window.location.pathname.split("/lib")[1]
const PATH_SPLIT = PATH.split("/");
const LIST_HTML = document.getElementById('top-list');

const BODY = document.querySelector("body")

// PAGE INFO
var curr = {
    file: PATH_SPLIT.at(-1),
    folder: PATH_SPLIT.at(-2)
}

if (curr.file === "") { curr.file = "index"; }
curr.file = curr.file.split('.')[0];

curr.obj = findVolume(curr.folder);
if (curr.obj !== undefined) {
    curr.index = findIndex(curr.obj, curr.file);
}

if (curr.index > -1) {
    if (LIST_HTML) genNav(curr, LIST_HTML);
} else {
    writeVolume("comicList", findVolume(curr.folder))
}

// FUNCTIONS - What the func!
function findVolume(folder) {
    for (let i = 0; i < MASTER.length; i++) {
        if (MASTER[i].volume === folder) {
            curr.title = MASTER[i].title;
            return MASTER[i];
        }
    }
    return;
}

function findIndex(volume, file) {
    for (let i = 0; i < volume.issues.length; i++)
        if (volume.issues[i].file === file)
            return i;
    return -1;
}

function genNav(current, target) {
    let obj = current.obj
    for (let i = 0; i < obj.issues.length; i++) {
        let item = document.createElement('option');
        item.innerText = `#${i.toString().padStart(2, "0")} » ${getTitle(obj.issues[i])}`
        item.value = i;
        if (i == current.index)
            item.selected = true
        target.append(item);
    }
}

function getTitle(e) {
    return e.title;
}

function getThumbnail(e) {
    if (e.hasOwnProperty("thumb")) {
        return "./img/" + e.img;
    }
    return "#";
}

function writeVolume(id, volume, first, last) {
    if (first === undefined) { first = 0; }
    if (last === undefined) { last = volume.issues; }

    if (id = document.getElementById(id)) {
        for (let i = first; i < last.length; i++) {
            id.append(writeIssue(volume.issues[i], i));
        }
    } else { 
        console.log('PARENT NOT FOUND');
    }
}

function writeIssue(issue, i) {
    let result = document.createElement('a');
    result.href = issue.file;
    comicTitle = getTitle(issue);
    comicThumb = getThumbnail(issue);
    result.innerHTML = `<div class="comicListItem">
    <div class="comicListThumb"><img src="` + comicThumb + `"></div>
    <div class="comicListTitle"><span>` + comicTitle + `</span></div>
    <div class="comicListIndex"><span>#` + i + `</span></div>
    </div>`
    
    return result;
}

function changeIssue() {
    e = document.getElementById("top-list").value;
    window.location.href = curr.obj.issues[e].file
}