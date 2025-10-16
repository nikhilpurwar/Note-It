import React, { useEffect, useState } from 'react'
import CreateGroup from './components/CreateGroup';

const GROUPS_KEY = 'noteit_groups'
const SELECTED_GROUP_KEY = 'noteit_selected_group'

const loadGroups = () => {
  try {
    const raw = localStorage.getItem(GROUPS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveSelected = (id) => localStorage.setItem(SELECTED_GROUP_KEY, id || '')

const Sidebar = ({ onSelectGroup }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groups, setGroups] = useState([])
  const [selectedId, setSelectedId] = useState(localStorage.getItem(SELECTED_GROUP_KEY) || null)

  useEffect(() => {
    setGroups(loadGroups())
  }, [])

  const handleCreate = (newGroup) => {
    const updated = [newGroup, ...groups]
    setGroups(updated)
    setSelectedId(newGroup.id)
    saveSelected(newGroup.id)
    onSelectGroup && onSelectGroup(newGroup.id)
  }

  const handleSelect = (g) => {
    setSelectedId(g.id)
    saveSelected(g.id)
    onSelectGroup && onSelectGroup(g.id)
  }

  const getInitials = (name) => {
    if (!name) return '??'
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    const first = parts[0][0] || ''
    const last = parts[parts.length - 1][0] || ''
    return (first + last).toUpperCase()
  }

  return (
    <>
      <div style={{ padding: 28, height: '100vh', position: 'relative', width: '100%' }}>
        <header>
          <h1 style={{ fontSize: 32, fontWeight: 700 }}>Pocket Notes</h1>
        </header>

        <div style={{ marginTop: 28 }}>
          {groups.length === 0 ? (
            // show vertical empty-state list with spaced circular placeholders and plus button
            <div style={{ height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <h3 style={{ color: 'gray' }}> Make New Note </h3>
            </div>
            // <div style={{display:'flex', flexDirection:'column', gap:28, alignItems:'flex-start'}}>
            //   {Array.from({length:6}).map((_,i)=> (
            //     <div key={i} style={{display:'flex', alignItems:'center', gap:16}}>
            //       <div style={{width:64, height:64, borderRadius:32, background:'#e0e0e0'}} />
            //       <div style={{width:140, height:20, background:'#f0f0f0', borderRadius:6}} />
            //     </div>
            //   ))}
            // </div>
          ) : (
            groups.map(g => (
              <div key={g.id} onClick={() => handleSelect(g)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 6px', cursor: 'pointer', background: selectedId === g.id ? '#eee' : 'transparent', borderRadius: 8 }}>
                <div style={{ width: 48, height: 48, borderRadius: 24, background: g.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>{getInitials(g && g.name ? g.name : 'My Notes')}</div>
                <div style={{ fontSize: 16 }}>{g.name}</div>
              </div>
            ))
          )}
        </div>

        <div style={{ position: 'absolute', right: 24, bottom: 24 }}>
          <button onClick={() => setIsOpen(true)} style={{ width: 64, height: 64, borderRadius: 32, background: '#24008b', color: '#fff', fontSize: 36, border: 'none' }}>+</button>
        </div>

        {isOpen && (<CreateGroup setIsOpen={setIsOpen} onCreate={handleCreate} />)}
      </div>
    </>
  )
}

export default Sidebar