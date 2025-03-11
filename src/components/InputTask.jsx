import React from 'react'

export const InputTask = ({addTask, handleInput, inputValue }) => {
  return (
    <>
        <div className='container' >
            <h2>Agregar una nueva tarea</h2>
            <form className='input-container' onSubmit={addTask}>
                <input 
                    className='input-new-task'
                    type="text"  
                    onChange={handleInput} 
                    value={inputValue} 
                    placeholder='Estudiar NestJS , no evitarlo (?'
                />
                <button type='submit'>Agregar</button>
            </form>
        </div>
    </>
  )
}
