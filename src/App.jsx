import './App.css';
import { useEffect, useState } from 'react';
import { Task } from './components/Task.jsx';
import { InputTask } from './components/InputTask.jsx';


const API_URL = import.meta.env.VITE_API_URL;
function App() {
  let taskPrueba = {
    _id: 1,
    title:'soy una prueba',
    completed: false
  };
  let taskPrueba1 = {
    _id: 2,
    title:'soy una prueba2',
    completed: true
  };

  // task sera el enviado a la DB
  const [tasks, setTasks] = useState([ taskPrueba , taskPrueba1 ]);
  // inputValue se utilizara para tomar el valor del input
  const [inputValue, setInputValue] = useState('');

  // funcion para setear el valor del input y luego utilizarlo para actualizar.
  const handleInput = (event) => {
      const { value } = event.target;
      if(!value || !value.trim()) return;
      setInputValue(value);
  }

  const addTask = async (event) => {
    event.preventDefault();

    const URL = `${API_URL}/api/task`;

    if(!inputValue || !inputValue.trim()) return;

    const newTask = {
      title: inputValue,
      completed: false,
    };

    try {
      const response = await fetch(URL, {
        method: 'POST',
        body: JSON.stringify(newTask),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if(!response.ok) {
        console.log('No se pudo agregar la tarea');
        return;
      }

      const data = await response.json();
      console.log({message: 'tarea agregada con exito', data});
      const newTaskData = data.task;
      setTasks([...tasks, newTaskData]);
      setInputValue('');
      

    } catch (error) {
      console.error('Error al agregar la tarea:', error);
    }
  }

  // funcion para traer todas las task
  const getAllTasks = async () => {
    const URL = `${API_URL}/api/task`;

    try {
      const getData = await fetch(URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (!getData.ok) {
        console.log('Error al obtener las tareas');
        return;
      }

      const data = await getData.json();
  
      if (!data || !data.tasks) {
        console.log('No hay tareas disponibles');
        return;
      }
       console.log(data.tasks);
       
       setTasks(data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
   
    
  }
  // esta funcion eliminara el task de la db y la vista
  const removeTask = async (event, tid)=> {
    event.preventDefault();
    
    console.log(tid);

    const URL = `${API_URL}/api/task/${tid}`;

    try {
      const taskRemoved = await fetch(URL, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if(!taskRemoved.ok) {
        console.log('No se pudo eliminar la tarea');
        return;
      }

      const dataEliminated = await taskRemoved.json();
      console.log({message: 'tarea eliminada con exito', dataEliminated});

      const restoreTasks = tasks.filter((task) => task._id !== tid);

      setTasks(restoreTasks);

    } catch (error) {
      console.log('Error al eliminar la tarea', error);

    }
  };
  // funcion para marcar como completada una task
  const handleComplete = async (event ,tid, currentCompleted )=>{
    event.preventDefault();

    const URL = `${API_URL}/api/task/${tid}`;
    try {
      const taskComplete = await fetch(URL, {
        method: 'PATCH',
        body: JSON.stringify({completed: !currentCompleted}),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if(!taskComplete.ok) {
        console.log('No se pudo actualizar la tarea');
        return;
      }

      const dataUpdated = await taskComplete.json();
      if(!dataUpdated) return;

      console.log({message: 'tarea actualizada con exito', dataUpdated});
      // trabajamos la vista
      const updatedTasks = tasks.map(task => 
        task._id === tid
          ? { ...task, completed: !task.completed }
          : task
      );
      setTasks(updatedTasks);
      
    } catch (error) {
      console.log('Error al actualizar la tarea:', error);
    }
  }

  // nos comunicamos con la db para obtener las tasks guardadas
  useEffect(()=>{
    getAllTasks();

  },[]);



  return (
    <>
      <h1>Tareas Pendientes</h1>
      <InputTask addTask={addTask} handleInput={handleInput} inputValue={inputValue} removeTask={removeTask} />
      <div className='ul-container'>
        <ul>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <Task
                key={task._id}
                _id={task._id}
                title={task.title}
                completed={task.completed}
                removeTask={removeTask}
                handleComplete={handleComplete}
              />
            ))
          ) : (
            <p>No hay tareas pendientes</p>
          )}
        </ul>
      </div>
    </>
  )
}


export default App
