import React, { useEffect, useState } from 'react'
import CreateGroup from './components/CreateGroup'
import './Sidebar.css' // 👈 import CSS

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

// const saveSelected = (id) => localStorage.setItem(SELECTED_GROUP_KEY, id || '')

const Sidebar = ({ onSelectGroup }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [groups, setGroups] = useState([])
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    setGroups(loadGroups())
  }, [])

  const handleCreate = (newGroup) => {
    const updated = [newGroup, ...groups]
    setGroups(updated)
    setSelectedId(newGroup.id)
    // saveSelected(newGroup.id)
    onSelectGroup && onSelectGroup(newGroup.id)
  }

  const handleSelect = (g) => {
    setSelectedId(g.id)
    // saveSelected(g.id)
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
    <div className="sidebar-container">
      <header className="pocketNotes">
        <h1>Pocket Notes</h1>
      </header>

      <div className="sidebar">
        {groups.map((g) => (
          <div
            key={g.id}
            onClick={() => handleSelect(g)}
            className={`option ${selectedId === g.id ? 'selected' : ''}`}
          >
            <div
              className="group-avatar"
              style={{ background: g.color }}
            >
              {getInitials(g?.name || 'My Notes')}
            </div>
            <div className="group-name">{g.name}</div>
          </div>
        ))}
      </div>

      <div className="floating-btn-container">
        <button className="floating-plus" onClick={() => setIsOpen(true)}>
          +
        </button>
      </div>

      {isOpen && <CreateGroup setIsOpen={setIsOpen} onCreate={handleCreate} />}
    </div>
  )
}

export default Sidebar
