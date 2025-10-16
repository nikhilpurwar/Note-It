import './App.css'
import MessageArea from './components/Main/MessageArea';
import Sidebar from './components/Side Bar/Sidebar';
import { useState } from 'react'

function App() {
  const [selectedGroup, setSelectedGroup] = useState(localStorage.getItem('noteit_selected_group') || null)

  return (
    <>
      <div style={{display: 'flex'}}>
        <aside style={{width: '320px', borderRight: '1px solid #ccc'}}>
          <Sidebar onSelectGroup={setSelectedGroup} />
        </aside>
        <main style={{flex:1}}>
          <MessageArea selectedGroupId={selectedGroup} />
        </main>
      </div>

    </>
  )
}

export default App
