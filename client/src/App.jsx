import './App.css'
import MessageArea from './components/Main/MessageArea';
import Sidebar from './components/Side Bar/Sidebar';
import { useState } from 'react'

function App() {
  const [selectedGroup, setSelectedGroup] = useState(localStorage.getItem('noteit_selected_group') || null)

  return (
    <div className={`app ${selectedGroup ? 'group-selected' : ''}`}>
      <aside className="app-sidebar">
        <Sidebar onSelectGroup={setSelectedGroup} />
      </aside>
      <main className="app-main">
        <MessageArea selectedGroupId={selectedGroup} onBack={() => setSelectedGroup(null)} />
      </main>
    </div>
  )
}

export default App
