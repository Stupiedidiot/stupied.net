document.onkeydown = function (event) {
  if (document.activeElement === document.body) {
    switch (event.keyCode) {
      case 37:
        if (e = document.getElementById("nextprev-prev"))
          e.click();
        break;
      case 39:
        if (e = document.getElementById("nextprev-next"))
          e.click();
        break;
      case 27:
        if (e = document.getElementById("nextprev-archive"))
          e.click();
        break;
      case 82:
        document.getElementById("random-art").click()
        break;
    }
  }
}

const POST_RELATED = document.getElementById("art_related"),
  POST_RELATED_MAX = 3;

const POST_FOLDER = POST_RELATED.dataset.col;
const POST_CURR_IDX = parseInt(POST_RELATED.dataset.idx);

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
  'comic',
  'with-commentary'
];

if (POST_CURR_IDX !== undefined) { 
  fetch("/" + POST_FOLDER + "/main.json?v={{ site.time | date: '%Y-%m-%d' }}")
    .then((response) => response.json())
    .then((art) => {
      // TAGS » pls remember to tidy this up
      let tags = art[POST_CURR_IDX].tags;
      let related = [];

      if (tags !== undefined){
        let tags_filtered = tags.split(' ').filter(v=>v!='');
        
        TAGS_FILTER_OUT.forEach(e => {
          tags_filtered = tags_filtered.filter(v=>v!=e);
        });
        
        for (let i = POST_CURR_IDX + 1; i < (art.length + POST_CURR_IDX); i++) {
          let index = i % art.length;
          let e = art[index].tags;
          if(e === undefined) continue;

          let regex = new RegExp(`\\b(?<!\\d)(${tags_filtered.join('|')})(?!\\d)\\b`, 'i');
          if (regex.test(e)) related.push(art[index]);
          if (related.length >= POST_RELATED_MAX) break;
        }
      }

      if (related.length === 0)
        for (let i = POST_CURR_IDX + 1; i < POST_CURR_IDX + (POST_RELATED_MAX + 1); i++)
          related.push(art[(i % art.length)]);

      related.forEach(e => {
        let item = document.createElement('a');
        item.classList.add('art-related');
        item.href = '/' + POST_FOLDER + '/p/' + e.img.split('.')[0];
        
        img = document.createElement('img');
        img.src = '/' + POST_FOLDER+ '/img/' + e.img;
        
        let alt;
        if (alt = e.alt)
          img.alt = alt;

        let dims = e.dime.split('x');
        img.width = dims[0];
        img.height = dims[1];
        
        item.append(img);
        POST_RELATED.append(item);
      });
    }
  )
}