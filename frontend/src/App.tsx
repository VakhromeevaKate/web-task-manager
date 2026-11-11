import { Filters } from './components/Filters'
import './App.css'
import { TasksPage } from './pages/TasksPage'

function App() {
  return (
    <div>
      <div className='header'>
        Менеджер задач
      </div>
      <p className='subtitle'>Управляйте своими делами</p>
      <section className='filters'>
        <Filters />
      </section>
      <section className='table'>
        <TasksPage />
      </section>
    </div>
  )
}

export default App
