let highlight = document.querySelectorAll('figure.highlight');
for (let i = 0; i < highlight.length; i++) {
    let button = document.createElement('button');
    button.setAttribute('onclick','copyHighlight()')
    highlight[i].prepend(button)
}

function copyHighlight() {
    let self = event.target.parentNode;
    let text = self.querySelector('pre').textContent;
    navigator.clipboard.writeText(text);
    alert('Text Copied')
}