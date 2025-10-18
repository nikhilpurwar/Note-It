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
      <style>
        {`
          .option {
            height: 98px;
            display: flex;
            align-items: center;
            gap: 30px;
            padding: 36px;
            cursor: pointer;
            border-radius: 16px;
            background: transparent;
            transition: background 0.2s ease;
          }

          .option:hover {
            background: rgba(47, 47, 47, 0.06);
          }

          .option.selected {
            background: rgba(47, 47, 47, 0.17);
          }

          @media (max-width: 720px) {
            .option{
              padding: 20px
            }
              .floating-plus{
                height: 75px;
                width: 75px;
                font-size: 40px;
              }
          }
      `}
      </style>
      <div style={{ height: '100vh', position: 'relative', width: '100%', display: 'flex', flexDirection: 'column' }}>
        <header className='pocketNotes' style={{ padding: '24px 12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h1 style={{ fontSize: 32, fontWeight: 600 }}>Pocket Notes</h1>
        </header>

        <div className='sidebar' style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingRight: 8, paddingLeft: 4 }}>
          {
            groups.map(g => (
              <div
                key={g.id}
                onClick={() => handleSelect(g)}
                className={`option ${selectedId === g.id ? 'selected' : ''}`}
              >
                <div style={{
                  width: 68,
                  height: 68,
                  borderRadius: '50%',
                  background: g.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 24.12,
                  fontWeight: 500,
                  lineHeight: 24,
                  letterSpacing: '0.02em'
                }}>
                  {getInitials(g?.name || 'My Notes')}
                </div>
                <div style={{
                  color: 'black',
                  fontSize: 24,
                  fontWeight: 500,
                  letterSpacing: '0.02em'
                }}>
                  {g.name}
                </div>
              </div>
            ))
          }
        </div>

        <div style={{ position: 'absolute', right: 24, bottom: 24 }}>
          <button className='floating-plus' onClick={() => setIsOpen(true)}>+</button>
        </div>

        {isOpen && (<CreateGroup setIsOpen={setIsOpen} onCreate={handleCreate} />)}
      </div>
    </>
  )
}

export default Sidebar


