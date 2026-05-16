function openNav() {
    let e = document.querySelector('#container > nav');
    if (!e.classList.contains('open')) {
        e.classList.add('open')
    } else {
        e.classList.remove('open')
    }
}