
export const Task = ({title, completed, removeTask, handleComplete, _id}) => {
  return (
    <>
     <div className='task-container'>
        <li className='task-li'>
            <div className='task'>
              <form onSubmit={(e) => removeTask(e, _id)}>
                <button type='submit' className='btn-delete'>❌</button>
              </form>
              <p>{title}</p>
              <form onSubmit={(e) => handleComplete(e, _id, completed)}>
                <button className='btn-complete' type="submit">
                  <span>{completed ? `✅`: `⭕`}</span>
                </button>
              </form>
            </div>
        </li>
     </div>
    </>
  )
}
