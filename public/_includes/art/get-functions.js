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

// function getTitle(data) {
//   if (data.title !== undefined) {
//     return data.title;
//   } else {
//     let title = data.img;
//     title = title.split("/");
//     title = title[title.length - 1];
//     title = title.slice(0, title.length - 4);
//     title = title.replaceAll("-", " ");
//     return title;
//   }
// }

function getDate(data) {
  if (data.date)
    return data.date;
  else
    return undefined;
}