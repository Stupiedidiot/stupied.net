class node {
    constructor(level, id, title){
        this.level = level;
        this.link = id;
        this.title = title;
        this.children = [];
    }

    addChild(node){
        this.children.push(node);
    }
}


const TOC_CONTENT = document.querySelector('.content');
if (TOC_CONTENT) {
    const TOC_PARENT = document.querySelector('.toc-parent');
    const TOC_TARGET = document.querySelector('.toc-target');
    const TOC_HEADERS = TOC_CONTENT.querySelectorAll('h2, h3, h4, h5, h6');
    
    if (TOC_HEADERS.length > 0) { 
        let root = createTree(TOC_HEADERS);
        let result = preorder(root);
        result.querySelector('ul > li').remove();
        TOC_TARGET.append(result);
        TOC_PARENT.classList.remove('hidden');
    }
}

function createTree(arr){
    let root = new node(1, "#", "#");
    let stack = [root];
    arr.forEach(el => {
        let t = new node(parseInt(el.tagName.slice(1,2)), el.id, el.textContent);

        while (stack && stack[stack.length - 1].level >= t.level){
            stack.pop();
        }

        if(stack){
            stack[stack.length - 1].addChild(t);
        }

        stack.push(t);
    });
    return root;
}

function preorder(head){
    if(!node) return;
    let result = document.createElement("ul");

    let item = document.createElement('li');
    item.className = "toc-top";
    
    let link = document.createElement('a');
    link.href = "#" + head.link;
    link.textContent = head.title;
    item.append(link)
    result.append(item);
    
    if(head.children){
        head.children.forEach(child =>{
            let item = document.createElement('li');
            item.className = "toc-child";
            
            item.append(preorder(child))
            result.append(item);
        })
    }

    return result;
}