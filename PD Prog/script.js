import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSetings = {
  databaseURL: "https://realtime-database-df7b3-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSetings);
const database = getDatabase(app);
const ListInDB = ref(database, "task-list");


const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const taskListEl = document.getElementById("task-list");

addButtonEl.addEventListener("click", function() {
  let inputValue = inputFieldEl.value;

  push(ListInDB, inputValue);

  clearInputFieldEl();

});

onValue(ListInDB, function(snapshot) {

  if(snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    clearTaskEl();

    for(let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];
  
      appendItemToTaskListEl(currentItem);
    }
  } else {
    taskListEl.innerHTML = "No task here..yet"
  }

});
function clearTaskEl() {
  taskListEl.innerHTML = "";
};

function clearInputFieldEl() {
  inputFieldEl.value = "";
};

function appendItemToTaskListEl(item) {
  let itemID = item[0];
  let itemValue = item[1];
  
  let newEl = document.createElement("li");
  
  newEl.textContent = itemValue;
  
  newEl.addEventListener("click", function() {
    let exactLocationOfDB = ref(database, `task-list/${itemID}`);
    remove(exactLocationOfDB);
  })

  taskListEl.append(newEl);

};

addButtonEl.addEventListener("click", function(event) {
  event.preventDefault();

  let inputValue = inputFieldEl.value;

  // Проверка на пустую строку
  if(inputValue.trim() !== "") {
    let newTaskRef = push(ListInDB);
    set(newTaskRef, inputValue).then(() => {
      clearInputFieldEl();
    }).catch((error) => {
      console.error("Error adding a task: ", error);
    });
  }
});

onValue(ListInDB, function(snapshot) {

  if(snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    clearTaskEl();

    for(let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];

      if(currentItemValue.trim() !== "") {
        appendItemToTaskListEl(currentItem);
      }
    }
  } else {
    taskListEl.innerHTML = "No task here..yet"
  }

});
