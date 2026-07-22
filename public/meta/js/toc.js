const TOC_CONTENT = document.querySelector('.content');
if (TOC_CONTENT) {
    const TOC_PARENT = document.querySelector('.toc-parent');
    const TOC_TARGET = document.querySelector('.toc-target');
    const TOC_HEADERS = TOC_CONTENT.querySelectorAll('h2, h3, h4, h5, h6');
    
    // pls update this to do nesting!

    if (TOC_HEADERS.length > 0) { 
        let prev;
        TOC_HEADERS.forEach(el => {
            prev = el.tagName;
            let item = document.createElement('li');

            let link = document.createElement('a');
            link.href = "#" + el.id;
            link.textContent = el.textContent;

            item.append(link);
            TOC_TARGET.append(item);
        });
        TOC_PARENT.classList.remove('hidden');
    }
}

console.log("YYYYYYYYYAy")