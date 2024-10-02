import { describe, it, expect, beforeEach } from 'vitest';

// Configuración de un entorno de DOM usando jsdom para simular un navegador
import { JSDOM } from 'jsdom';
let dom;
let document;

beforeEach(() => {
  // Inicializar el DOM antes de cada prueba con un HTML simulado
  dom = new JSDOM(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>App de lista de Tareas</title>
      <link rel="stylesheet" href="app.css">
    </head>
    <body>
      <div class="container">
        <h1>Lista de Tareas</h1>
        <div class="input-container">
          <input type="text" id="taskInput" placeholder="Agregar nueva tarea">
          <button id="addTaskBtn">Agregar Tarea</button>
        </div>
        <ul id="taskList"></ul>
      </div>
      <script src="app.js"></script>
    </body>
    </html>
  `);

  document = dom.window.document;

  // Simulación del script `app.js`, donde se añade funcionalidad a los botones
  document.getElementById('addTaskBtn').addEventListener('click', addTask);

  // Función que se encarga de agregar una tarea nueva
  function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    // Validar que el texto de la tarea no esté vacío
    if (taskText !== "") {
      const taskList = document.getElementById('taskList');
      const li = document.createElement('li');

      // Estructura de la nueva tarea con botones para completar, editar y eliminar
      li.innerHTML = `
        <span class="task-text">${taskText}</span>
        <div class="task-buttons">
          <button class="complete-btn">✔</button>
          <button class="edit-btn">✎</button>
          <button class="delete-btn">✖</button>
        </div>
      `;

      // Agregar la tarea a la lista
      taskList.appendChild(li);
      taskInput.value = ''; // Limpiar el campo de entrada

      // Agregar funcionalidad al botón de completar tarea
      li.querySelector('.complete-btn').addEventListener('click', function() {
        li.classList.toggle('completed'); // Alternar clase 'completed'
      });

      // Funcionalidad para eliminar la tarea
      li.querySelector('.delete-btn').addEventListener('click', function() {
        taskList.removeChild(li); // Eliminar el elemento de la lista
      });

      // Funcionalidad para editar la tarea
      li.querySelector('.edit-btn').addEventListener('click', function() {
        const newTaskText = dom.window.prompt("Editar tarea:", taskText); // Pedir nuevo texto
        if (newTaskText !== null && newTaskText.trim() !== "") {
          li.querySelector('.task-text').textContent = newTaskText; // Actualizar el texto de la tarea
        }
      });
    } else {
      alert("Por favor ingresa una tarea válida."); // Alertar si no hay texto válido
    }
  }
});

// Definición de las pruebas
describe('App de Lista de Tareas', () => {
  // Prueba para agregar una tarea
  it('debería agregar una tarea de "comprar libro"', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    
    taskInput.value = 'comprar libro'; // Simular entrada del usuario
    addTaskBtn.click(); // Simular clic en el botón de agregar tarea

    const taskList = document.getElementById('taskList');
    
    // Comprobaciones: que haya 1 tarea y que el texto sea el correcto
    expect(taskList.children.length).toBe(1);
    expect(taskList.children[0].querySelector('.task-text').textContent).toBe('comprar libro');
  });

  // Prueba para marcar una tarea como completada
  it('debería marcar una tarea como completada', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    
    taskInput.value = 'tarea de prueba'; // Agregar una tarea
    addTaskBtn.click();

    const completeBtn = document.querySelector('.complete-btn');
    completeBtn.click(); // Simular clic en el botón de completar

    const task = document.querySelector('li');
    expect(task.classList.contains('completed')).toBe(true); // Verificar que la clase 'completed' se añadió
  });

  // Prueba para eliminar una tarea
  it('debería eliminar una tarea de la lista', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    
    taskInput.value = 'tarea para eliminar'; // Agregar una tarea para luego eliminarla
    addTaskBtn.click();

    const deleteBtn = document.querySelector('.delete-btn');
    deleteBtn.click(); // Simular clic en el botón de eliminar

    const taskList = document.getElementById('taskList');
    expect(taskList.children.length).toBe(0); // Verificar que no hay tareas en la lista
  });

  // Prueba para verificar que se muestran las tareas en la lista
  it('debería mostrar las tareas agregadas en la lista', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    
    // Agregar dos tareas a la lista
    taskInput.value = 'tarea 1';
    addTaskBtn.click();
    taskInput.value = 'tarea 2';
    addTaskBtn.click();

    const taskList = document.getElementById('taskList');
    
    // Verificar que hay dos tareas y que los textos son correctos
    expect(taskList.children.length).toBe(2);
    expect(taskList.children[0].querySelector('.task-text').textContent).toBe('tarea 1');
    expect(taskList.children[1].querySelector('.task-text').textContent).toBe('tarea 2');
  });

  // Prueba para editar una tarea
  it('debería permitir editar una tarea', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    
    taskInput.value = 'tarea para editar'; // Agregar una tarea
    addTaskBtn.click();

    const editBtn = document.querySelector('.edit-btn');
    
    // Simular el prompt para editar la tarea
    dom.window.prompt = () => 'tarea editada';
    editBtn.click(); // Simular clic en el botón de editar

    const taskText = document.querySelector('.task-text').textContent;
    
    // Verificar que el texto de la tarea fue actualizado
    expect(taskText).toBe('tarea editada');
  });
});
