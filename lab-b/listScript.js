let Todo = {
    tasks: [],
    date: [],
    status: [],
    term: '',
    draw: function() {
        const ul = document.getElementById('list');
        ul.innerHTML = '';
        for (let i = 0; i < Todo.tasks.length; i++) {
            let li = document.createElement('li');
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
                        Todo.date[i] = 'bezterminowe'
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

            // Check
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

            // Usunięcie
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

            localStorage.setItem('tasks', JSON.stringify(Todo.tasks));
            localStorage.setItem('date', JSON.stringify(Todo.date));
            localStorage.setItem('status', JSON.stringify(Todo.status));
        }
    },
    addTask: function() {
        const todaysDate = new Date().toJSON().slice(0, 10);
        let inputText = document.getElementById('add');
        let inputDate = document.getElementById('addDate');
        if (inputText.value.length >= 3 && inputText.value.length <= 255 && inputText.value.charAt(0) !== ' ' && inputText.value.charAt(inputText.value.length - 1) !== ' ') {
            if (inputDate.value >= todaysDate || inputDate.value === ''){
                Todo.tasks.push(inputText.value);
                if (inputDate.value === '')
                    Todo.date.push('bezterminowe');
                else
                    Todo.date.push(inputDate.value)
                Todo.status.push('unchecked');
                inputText.value = '';
                inputDate.value = '';
                Todo.loseFocus('add');
                Todo.loseFocus('addDate');
                Todo.draw();
            }
            else
                alert('Data nie może być z przeszłości.');
        } else
            alert('Treść zadania musi mieć między 3 a 255 znaków i nie może zaczynać ani kończyć się spacją.');
    },
    getFilteredTasks: function() {

    },
    getFocus: function(id) {
        document.getElementById(id).focus();
    },
    loseFocus: function(id) {
        document.getElementById(id).blur();
    }
}

// Dodawanie zadania enterem
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