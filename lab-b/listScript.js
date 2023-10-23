let Todo = {
    tasks: [],
    date: [],
    status: [],
    term: document.getElementById('search'),
    draw: function() {
        Todo.sortList();
        const ul = document.getElementById('list');
        ul.id = 'list';
        ul.innerHTML = '';
        for (let i = 0; i < Todo.tasks.length; i++) {
            let li = document.createElement('li');
            li.id = 'listElement'
            li.className = Todo.status[i];
            ul.appendChild(li);

            // Treść i jej edycja
            let para = document.createElement('p');
            let text = document.createTextNode(Todo.tasks[i]);
            para.onclick = function() {
                const paraEdit = document.createElement('input');
                paraEdit.className = 'editPara';
                paraEdit.id = 'editPara';
                paraEdit.type = 'text';
                paraEdit.value = Todo.tasks[i];
                paraEdit.onblur = function() {
                    if (paraEdit.value === '' || paraEdit.value.length < 3 || paraEdit.value.length > 255 ||
                    paraEdit.value.charAt(0) === ' ' || paraEdit.value.charAt(paraEdit.value.length - 1) === ' ')
                        alert('Treść zadania musi mieć między 3 a 255 znaków i nie może zaczynać ani kończyć się spacją.')
                    else
                        Todo.tasks[i] = paraEdit.value;
                    li.removeChild(paraEdit);
                    li.appendChild(para);
                    localStorage.setItem('tasks', JSON.stringify(Todo.tasks));
                    Todo.draw();
                }
                li.removeChild(para);
                li.appendChild(paraEdit);
                Todo.getFocus('editPara');
            }
            li.appendChild(para);
            para.appendChild(text);

            // Data i jej edycja
            let time = document.createElement('time');
            let date = document.createTextNode(Todo.date[i]);
            time.onclick = function() {
                const timeEdit = document.createElement('input');
                timeEdit.className = 'editDate';
                timeEdit.id = 'editDate';
                timeEdit.type = 'date';
                timeEdit.value = Todo.date[i];
                timeEdit.onblur = function() {
                    if (timeEdit.value === '')
                        Todo.date[i] = 'bezterminowo'
                    else
                        Todo.date[i] = timeEdit.value;
                    li.removeChild(timeEdit);
                    li.appendChild(time);
                    localStorage.setItem('date', JSON.stringify(Todo.date));
                    Todo.draw();
                }
                li.removeChild(time);
                li.appendChild(timeEdit);
                Todo.getFocus('editDate');
            }
            li.appendChild(time);
            time.appendChild(date);

            // Dodanie znacznika statusu
            let checkBtn = document.createElement('button');
            let check = document.createElement('i');
            checkBtn.className = 'check';
            checkBtn.onclick = function() {
                if (li.className === 'unchecked') {
                    Todo.status[i] = 'checked';
                    check.className = 'fa fa-check-square-o';
                    Todo.draw();
                } else {
                    Todo.status[i] = 'unchecked';
                    check.className = 'fa fa-square-o';
                    Todo.draw();
                }
            };
            if (li.className === 'unchecked')
                check.className = 'fa fa-square-o';
            else if (li.className === 'checked')
                check.className = 'fa fa-check-square-o';
            li.append(checkBtn);
            checkBtn.append(check);

            // Usunięcie zadania
            let closeBtn = document.createElement('button');
            let close = document.createElement('i');
            closeBtn.className = 'close';
            closeBtn.onclick = function() {
                Todo.tasks.splice(i, 1);
                Todo.date.splice(i, 1);
                Todo.status.splice(i, 1);
                
                localStorage.setItem('tasks', JSON.stringify(Todo.tasks));
                localStorage.setItem('date', JSON.stringify(Todo.date));
                localStorage.setItem('status', JSON.stringify(Todo.status));
                Todo.draw();
            };
            close.className = 'fa fa-close';
            li.append(closeBtn);
            closeBtn.append(close);

            // Zapisanie do localStorage
            localStorage.setItem('tasks', JSON.stringify(Todo.tasks));
            localStorage.setItem('date', JSON.stringify(Todo.date));
            localStorage.setItem('status', JSON.stringify(Todo.status));
        }
        if (Todo.term.value)
            Todo.getFilteredTasks();
    },
    // Dodawanie zadania
    addTask: function() {
        const todaysDate = new Date().toJSON().slice(0, 10);
        let inputText = document.getElementById('add');
        let inputDate = document.getElementById('addDate');
        if (inputText.value.length >= 3 && inputText.value.length <= 255 && inputText.value.charAt(0) !== ' ' &&
        inputText.value.charAt(inputText.value.length - 1) !== ' ') {
            if (inputDate.value >= todaysDate || inputDate.value === ''){
                Todo.tasks.push(inputText.value);
                if (inputDate.value === '')
                    Todo.date.push('bezterminowo');
                else
                    Todo.date.push(inputDate.value)
                Todo.status.push('unchecked');
                inputText.value = '';
                inputDate.value = '';
                Todo.loseFocus('addDate');
                Todo.getFocus('add');
                Todo.draw();
            }
            else
                alert('Data nie może być z przeszłości.');
        } else
            alert('Treść zadania musi mieć między 3 a 255 znaków i nie może zaczynać ani kończyć się spacją.');
    },
    // Sortowanie datami i statusem ukończenia
    sortList: function() {
        const limitlessDate = [];
        const limitlessTasks = [];
        const limitlessStatus = [];
        for (let i = 0; i < Todo.date.length; i++) {
            if (Todo.date[i] === 'bezterminowo') {
                limitlessDate.push(Todo.date[i]);
                limitlessTasks.push(Todo.tasks[i]);
                limitlessStatus.push(Todo.status[i]);
                Todo.date.splice(i, 1);
                Todo.tasks.splice(i, 1);
                Todo.status.splice(i, 1);
                i--;
            }
        }
        const tmpDate = Todo.date.slice().sort();
        const tmpTasks = [];
        const tmpStatus = [];
        for (let i = 0; i < tmpDate.length; i++) {
            let j = 0
            for (j; j < Todo.date.length; j++) {
                if (tmpDate[i] === Todo.date[j]) {
                    tmpTasks.push(Todo.tasks[j]);
                    tmpStatus.push(Todo.status[j]);
                    break;
                }
            }
            Todo.tasks.splice(j, 1);
            Todo.date.splice(j, 1);
            Todo.status.splice(j, 1);
        }
        Todo.tasks = tmpTasks.concat(limitlessTasks);
        Todo.date = tmpDate.concat(limitlessDate);
        Todo.status = tmpStatus.concat(limitlessStatus);

        const checkedStatus = [];
        const checkedTasks = [];
        const checkedDate = [];
        for (let i = 0; i < Todo.status.length; i++) {
            if (Todo.status[i] === 'checked') {
                checkedTasks.push(Todo.tasks[i]);
                checkedDate.push(Todo.date[i]);
                checkedStatus.push(Todo.status[i]);
                Todo.tasks.splice(i, 1);
                Todo.date.splice(i, 1);
                Todo.status.splice(i, 1);
                i--;
            }
        }
        Todo.tasks = Todo.tasks.concat(checkedTasks);
        Todo.date = Todo.date.concat(checkedDate);
        Todo.status = Todo.status.concat(checkedStatus);
    },
    // Wyszukiwanie
    getFilteredTasks: function() {
        let filter = Todo.term.value.toUpperCase();
        let filterNoCap = Todo.term.value.slice();
        let ul = document.getElementById('list');
        let li = ul.getElementsByTagName('li');
        for (let i = 0; i < Todo.tasks.length; i++) {
            let p = li[i].firstChild;
            let pText = p.innerHTML;
            if (Todo.tasks[i].toUpperCase().includes(filter)) {
                li[i].style.display = '';
                pText = Todo.tasks[i];
                if (filter !== '')
                    pText = Todo.highlight(pText, filterNoCap);
                li[i].firstChild.innerHTML = pText;
            } else {
                li[i].style.display = 'none';
            }
            if (filter === '')
                Todo.draw();
        }
    },
    // Podświetlenie wyszukiwanej frazy
    highlight: function(text, filter) {
        let replacement = new RegExp(filter, 'gi');
        return text.replace(replacement, `<mark>$&</mark>`)
    },
    // Focus na polu do wprowadzania
    getFocus: function(id) {
        document.getElementById(id).focus();
    },
    // Utrata focusu na polu do wprowadzania
    loseFocus: function(id) {
        document.getElementById(id).blur();
    }
}

// Dodawanie zadania i daty enterem
const addTextField = document.getElementById('add');
const dateField = document.getElementById('addDate');
addTextField.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        Todo.addTask();
    }
});
dateField.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        Todo.addTask();
    }
});

// Wczytanie localStorage
const tasksJSON = localStorage.getItem('tasks');
const dateJSON = localStorage.getItem('date');
const statusJSON = localStorage.getItem('status');
if (tasksJSON && dateJSON && statusJSON) {
    Todo.tasks = JSON.parse(tasksJSON);
    Todo.date = JSON.parse(dateJSON);
    Todo.status = JSON.parse(statusJSON);
    Todo.draw();
}