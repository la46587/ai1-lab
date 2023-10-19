let i;

let existingElements = [];
let existingElementsJson = localStorage.getItem('allElements');
if (existingElementsJson) {
    existingElements = JSON.parse(existingElementsJson);
    for (i = 0; i < existingElements.length; i++) {
        let inputValue = existingElements[i]
        let li = document.createElement('li');
        let t = document.createTextNode(inputValue);
        li.appendChild(t);
        document.getElementById('list').appendChild(li);
        document.getElementById('add').value = '';

        let span = document.createElement('SPAN');
        let txt = document.createTextNode('\u00D7');
        span.className = 'close';
        span.appendChild(txt);
        li.appendChild(span);
    }
}

let myNodeList = document.getElementsByTagName('LI');
for (i = 0; i < myNodeList.length; i++) {
    let span = document.createElement('SPAN');
    let txt = document.createTextNode('\u00D7');
    span.className = 'close';
    span.appendChild(txt);
    myNodeList[i].appendChild(span);
}

let close = document.getElementsByClassName('close');
for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
        let div = this.parentElement;
        div.style.display = 'none';
    }
}

// Oznaczanie zadania jako wykonane
let list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
    if (ev.target.tagName === 'LI') {
        ev.target.classList.toggle('checked');
    }
}, false);

// Dodawanie zadania klawiszem Enter
let input = document.getElementById('add');
input.addEventListener('keypress', function(ev) {
    if (ev.key === 'Enter') {
        ev.preventDefault();
        newElement();
    }
}, false);

// Wykrywanie Spacji w nazwie lub pustej nazwy
function containsOnlySpaces(str) {
    return str.trim().length === 0;
}

function newElement() {
    let li = document.createElement('li');
    let inputValue = document.getElementById('add').value;
    let t = document.createTextNode(inputValue);
    li.appendChild(t);
    if (containsOnlySpaces(inputValue)) {
        alert('Musisz coś wpisać!');
        return false;
    } else {
        if (inputValue.charAt(0) === ' ') {
            inputValue = inputValue.trimStart()
        }
        document.getElementById('list').appendChild(li);
    }
    document.getElementById('add').value = '';

    let span = document.createElement('SPAN');
    let txt = document.createTextNode('\u00D7');
    span.className = 'close';
    span.appendChild(txt);
    li.appendChild(span);
    localStorage.setItem('element', JSON.stringify(inputValue));
    existingElements.push(inputValue);
    localStorage.setItem('allElements', JSON.stringify(existingElements));

    for (i = 0; i < close.length; i++) {
        close[i].onclick = function() {
            let div = this.parentElement;
            div.style.display = 'none';
        }
    }
}