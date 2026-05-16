// Komic by Stupied: https://stupied.net

//TABLE OF CONTENTS
// 1. Comic List
// 2. Settings
// 3. Da Code!
// 4. Functions

//-------------------------------------------------

// [1] COMIC LIST

const COMIC = [
	// All you need is a file
	{ "file": "Cover-Page.jpg" },

	// You can add more than 1 files - separate with a comma
	{ "file": "Dress-Up.jpg,Letters.jpg" },

	// Or you can write it as an array.
	{ "file": ["Penny-Glamor.jpg", "Penny-Glamor-2.jpg"] },

	// You can give it a title, date, description, and thumbnail
	{
		"file": "Surrealism.jpg",
		"title": "It's Not Surrealism!",
		"date": "2025-09", // you can leave the day empty
		"desc": "Also, yes I stole the buttons from <a href='https://rarebit.neocities.org/' target='blank'>Rarebit</a>",
		"thumb": "Surrealism.jpg"
	},
	{
		"file": "Weather.jpg",
		"title": "Poor Weather",
		"date":"2025-09-20",
		"desc": "Henlooo, this is basically my attempt of making something similar to <a href='https://rarebit.neocities.org/' target='blank'>Rarebit</a>. I didn't really have a purpose for making it. I just impulsively wanted to. So there might be some stuff I overlooked.",
		"thumb": "Weather.jpg"
	}
];

//-------------------------------------------------

// [2] SETTINGS
const SKIP_HEADER = true; // skips to the header 
const IMG_FOLDER = 'img'; // folder for all your images

// buttons for comic navigation - you can make em images
const NAV_BUTTON = {
	first: `<img src='./img/button/first.png' alt='first button'>`,
	prev: `<img src='./img/button/prev.png' alt='previous button'>`,
	next: `<img src='./img/button/next.png' alt='next button'>`,
	last: `<img src='./img/button/last.png' alt='last button'>`
}

const HEADER = `
<h1>Comic Title</h1>
`

const NAV = `
<a href="/index.html">Home</a>
<a href="#">Archive</a>
<a href="#">About</a>
`;

const FOOTER = `
<!-- Feel free to remove the credit -->
Layout by <a href="https://stupied.net" target="_blank">Stupied</a>
`;

const LAYOUT = `
<header id='mainHeader'>${HEADER}</header>
<nav id='mainNav'>${NAV}</nav>
<main></main>
<footer id='mainFooter'>${FOOTER}</footer>
`

//-------------------------------------------------

// [3] DA CODE! 

const BODY = document.querySelector('body');
BODY.innerHTML += LAYOUT;

content = document.querySelectorAll('.main-content')
for (let i = 0; i < content.length; i++) {
	document.querySelector('main').append(content[i])
}


var current = { index: window.location.search.replace('?', '') };
if (current.index === '') { current.index = COMIC.length - 1; }
current.index = Number(current.index);

BODY.classList.add(`part-${current.index}`)

current.files = getFiles(current.index)
current.output = writeFiles(current.files)

if (current.index >= 0) {
	current.prev = current.index - 1;
}

if (current.index < COMIC.length - 1) {
	current.next = current.index + 1;
}

const COMIC_VIEW = document.getElementById('comicView');
const COMIC_HEADER = document.getElementById('comicHeader');
const COMIC_DATE = document.getElementById('comicDate');
const COMIC_DESC = document.getElementById('comicDesc');
const COMIC_NAV_TOP = document.getElementById('comicNavTop');
const COMIC_NAV_BOTTOM = document.getElementById('comicNavBottom');
const COMIC_ARCHIVE = document.getElementById('comicArchive');

appendTo(COMIC_VIEW, current.output);

current.nav = writeNav(current.index);
appendTo(COMIC_NAV_TOP, current.nav.cloneNode(true));
appendTo(COMIC_NAV_BOTTOM, current.nav);

current.title = writeTitle(current.index);
appendTo(COMIC_HEADER, current.title);

appendTo(COMIC_VIEW, current.output);

current.date = writeDate(current.index)
if (current.date) {
	appendTo(COMIC_DATE, current.date)
}

current.desc = writeDesc(current.index)
if (current.desc) {
	appendTo(COMIC_DESC, current.desc)
}

current.archive = writeList();
appendTo(COMIC_ARCHIVE, current.archive)

//-------------------------------------------------

// [4] FUNCTION

function appendTo(parent, element) {
	if (parent) {
		parent.append(element);
	}
	return null;
}

function getFiles(index) {
	let files = COMIC[index].file;
	let result = files;
	if (typeof (files) === 'string') {
		result = result.split(',');
	}
	current.file = result[0];
	return result;
}

function writeFiles(files) {
	let result = document.createElement('section');
	result.class = 'comic-page';

	for (let i = 0; i < files.length; i++) {
		item = document.createElement('img');
		item.src = `./${IMG_FOLDER}/${files[i].trimStart()}`;
		item.class = i;
		result.append(item);
	}
	return result;
}

function writeNav() {
	let result = document.createElement('div');
	let jumpto;
	if (SKIP_HEADER === true) { jumpto = '#comicHeader'; }
	
	if (current.index > 0) {
		let first = document.createElement('a');
		first.href = `?0` + jumpto;
		first.innerHTML = NAV_BUTTON.first;
		result.append(first);
	}

	if (current.prev >= 0) {
		let prev = document.createElement('a');
		prev.href = '?' + current.prev + jumpto;
		prev.innerHTML = NAV_BUTTON.prev;
		result.append(prev);
	}

	if (current.next) {
		let next = document.createElement('a');
		next.href = '?' + current.next + jumpto;
		next.innerHTML = NAV_BUTTON.next;
		result.append(next);
	}

	if (current.index < COMIC.length - 1) {
		let last = document.createElement('a');
		last.href = '?' + (COMIC.length - 1) + jumpto;
		last.innerHTML = NAV_BUTTON.last;
		result.append(last);
	}
	return result;
}

function getTitle(index) {
	if (COMIC[index].title) {
		return COMIC[index].title;
	} else {
		let items = getFiles(index)
		let result = items[0];
		result = result.replaceAll('-', ' ');
		result = result.replaceAll('_', ' ');
		result = result.substring(0, result.lastIndexOf('.'))
		return result;
	}
}

function writeTitle(index) {
	let result = document.createElement('h1');
	let title = getTitle(index);
	result.textContent = `[${index}] ${title}`;
	return result;
}

function getDate(index) {
	if (COMIC[index].date) {
		let date = new Date(COMIC[index].date);
		let result = date.toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		})
		return result;
	}
	return null;
}

function writeDate(index) {
	let result = document.createElement('div');
	result.textContent = getDate(index);
	return result;
}

function writeDesc(index) {
	let result = document.createElement('div');
	if (COMIC[index].desc) {
		result.innerHTML = COMIC[index].desc
	} else { 
		result.textContent = "No Description Provided"
	}
	return result;
}

function writeList(first, last, reversed) {
	if (first === undefined || first === 'auto') { first = 0; }
	if (last === undefined || last === 'auto') { last = COMIC.length; } else { last++ }
	if (reversed === undefined || reversed === 'auto') { reversed = false; }

	let result = document.createElement('article');
	result.classList.add('comic-list');

	for (let i = first; i < last; i++) {
		let item = writePart(i)

		if (reversed === true) {
			result.prepend(item);
		} else {
			result.append(item);
		}
	}
	return result;
}

function writePart(index) {
	let link = document.createElement('a');
	link.href = './?' + index;

	let result = document.createElement('div');
	result.className = 'comic-list-item'

	let label = document.createElement('div');
	label.className = 'comic-list-index';
	label.innerHTML = `<span>#${index}</span>`
	result.append(label)

	let titleContent = getTitle(index);
	let title = document.createElement('div');
	title.className = 'comic-list-title';
	let info = `<span>${titleContent}</span>`;
	if (COMIC[index].date) {
		info += `<br>${COMIC[index].date}`
	}
	title.innerHTML = `<span>${info}</span>`
	result.append(title)

	if (COMIC[index].thumb) {
		let thumb = document.createElement('img');
		thumb.src = `./${IMG_FOLDER}/${COMIC[index].thumb}`
		result.append(thumb)
	}

	let thumb = document.createElement('div');
	thumb.className = 'comic-list-thumb'

	link.append(result)
	return link;
}