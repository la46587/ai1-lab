const usrLoc = document.getElementById('loc');

let center = [53.44704272080419, 14.492251060784335],
    width = 500,
    height = 500;

const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    osmAttrib = '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    osm = L.tileLayer(osmUrl, {
        maxZoom: 18,
        attribution: osmAttrib
    });

map = new L.Map('map', {
    layers: [osm],
    center: new L.LatLng(center[0], center[1]),
    zoom: 14
});

// Pierwiastek kwadratowy z ogólnej liczby puzzli (16)
const pieces = 4;
const puzzleWidth = '120px';
const puzzleHeight = '120px';

// Powiadomienie o poprawnym ułożeniu puzzli
function showVictoryNotification() {
    Notification.requestPermission().then(perm => {
        console.log('Status notyfikacji:', perm);
        new Notification('Gratulacje!', {
            body: `Udało ci się ułożyć puzzle!`
        });
    });
}

// Pobranie lokalizacji
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
}

// Pokazanie lokalizacji
function showPosition(position) {
    let newLat = position.coords.latitude;
    let newLng = position.coords.longitude;
    map.setView([newLat, newLng], 18);
}

// Błędy lokalizacji
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            usrLoc.innerHTML = "Użytkownik odmówił udostępnienia lokalizacji.";
            break;
        case error.POSITION_UNAVAILABLE:
            usrLoc.innerHTML = "Informacja o lokalizacji jest niedostępna.";
            break;
        case error.TIMEOUT:
            usrLoc.innerHTML = "Przekroczono limit czasu na pobranie lokalizacji.";
            break;
    }
}

// Mieszanie elementów
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Zapisanie obrazu, pocięcie go na puzzle i wyłożenie elementów do układania
function captureMap() {
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    leafletImage(map, function(err, canvas) {
        if (err) {
            console.log(err);
            return;
        }

        let pieceWidth = canvas.width / pieces;
        let pieceHeight = canvas.height / pieces;

        let puzzleContainer = document.getElementById('puzzle');
        puzzleContainer.innerHTML = '';
        let elements = [];

        for (let i = 0; i < pieces; i++) {
            for (let j = 0; j < pieces; j++) {
                let placeholder = document.createElement('div');
                placeholder.className = 'placeholder';
                placeholder.id = 'placeholder-' + i + '-' + j;
                placeholder.style.width = puzzleWidth;
                placeholder.style.height = puzzleHeight;
                placeholder.addEventListener('dragover', (ev) => {
                    ev.preventDefault();
                    placeholder.classList.add('dragover');
                });
                placeholder.addEventListener('dragleave', () => {
                    placeholder.classList.remove('dragover');
                });
                placeholder.addEventListener('drop', (ev) => {
                    ev.preventDefault();
                    placeholder.classList.remove('dragover');
                });
                puzzleContainer.appendChild(placeholder);

                let pieceCanvas = document.createElement('canvas');
                pieceCanvas.width = pieceWidth;
                pieceCanvas.height = pieceHeight;
                let context = pieceCanvas.getContext('2d');
                context.drawImage(canvas, j * pieceWidth, i * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);

                let img = document.createElement('img');
                img.className = 'piece';
                img.id = 'piece-' + i + '-' + j;
                img.src = pieceCanvas.toDataURL();
                img.style.width = puzzleWidth;
                img.style.height = puzzleHeight;
                img.draggable = true;
                img.ondragstart = drag;
                img.ondragend = puzzleCheck;
                elements.push(img);
            }
        }

        let elementsContainer = document.getElementById('elements');
        elementsContainer.innerHTML = '';
        shuffleArray(elements);
        elements.forEach(img => elementsContainer.appendChild(img));
    });
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    let draggedElementId = ev.dataTransfer.getData("text");
    let draggedElement = document.getElementById(draggedElementId);
    let dropTarget = ev.target;

    if (dropTarget.className === 'placeholder' || dropTarget.id === 'elements')
        dropTarget.appendChild(draggedElement);

    if (ev.target.className === 'piece') {
        swapPieces(draggedElement, dropTarget);
    }
}

// Zamiana puzzli miejscami
function swapPieces(piece1, piece2) {
    let parent1 = piece1.parentNode;
    let next1 = piece1.nextSibling;

    let parent2 = piece2.parentNode;
    let next2 = piece2.nextSibling;

    parent1.insertBefore(piece2, next1);
    parent2.insertBefore(piece1, next2);
}

// Sprawdzenie czy wszystkie puzzle są na swoich miejscach
function puzzleCheck() {
    let elements = document.getElementById('elements');
    let correct = true;

    if (elements.innerHTML === '') {
        for (let i = 0; i < pieces; i++) {
            for (let j = 0; j < pieces; j++) {
                let currentPlaceholderId = 'placeholder-' + i + '-' + j;
                let currentPlaceholder = document.getElementById(currentPlaceholderId);
                let expectedPuzzleId = 'piece-' + i + '-' + j;
                let placedPuzzle = currentPlaceholder.firstChild;

                if (expectedPuzzleId !== placedPuzzle.id) {
                    correct = false;
                }
                console.log(currentPlaceholderId, correct);
            }
        }
    } else correct = false;

    if (correct) {
        showVictoryNotification();
    }
}