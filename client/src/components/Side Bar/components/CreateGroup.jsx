import React, { useRef, useState } from 'react'
import './CreateGroup.css' // 👈 import the styles

// Utility to read/write groups to localStorage
const GROUPS_KEY = 'noteit_groups'

const loadGroups = () => {
  try {
    const raw = localStorage.getItem(GROUPS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveGroups = (groups) => {
  localStorage.setItem(GROUPS_KEY, JSON.stringify(groups))
}

const CreateGroup = ({ setIsOpen, onCreate }) => {
  const [name, setName] = useState('')
  const [color, setColor] = useState('#7f5af0')
  const ref = useRef()

  const getInitials = (full) => {
    if (!full) return ''
    const parts = full.trim().split(/\s+/)
    if (parts.length === 1) return (parts[0].slice(0, 2) || '').toUpperCase()
    const first = parts[0][0] || ''
    const last = parts[parts.length - 1][0] || ''
    return (first + last).toUpperCase()
  }

  const COLORS = ['#caa6ff', '#ff7fe0', '#42e6ff', '#f2a57d', '#0b53ff', '#6f94ff']

  const handleSubmit = (e) => {
    e && e.preventDefault()
    const trimmed = name.trim()
    if (trimmed.length < 2) {
      alert('Group name must be at least 2 characters')
      return
    }

    const groups = loadGroups()
    const exists = groups.some((g) => g.name.toLowerCase() === trimmed.toLowerCase())
    if (exists) {
      alert('A group with this name already exists')
      return
    }

    const avatar = getInitials(trimmed)
    const newGroup = { id: Date.now().toString(), name: trimmed, color, avatar }
    const updated = [newGroup, ...groups]
    saveGroups(updated)
    onCreate && onCreate(newGroup)
    setIsOpen(false)
  }

  return (
    <div className="cg-overlay">
      <div onClick={() => setIsOpen(false)} className="cg-backdrop" />
      <div ref={ref} onClick={(e) => e.stopPropagation()} className="create-modal">
        <h2 className="cg-title">Create New Group</h2>

        <form onSubmit={handleSubmit} className="create-form">
          <div className="cg-row">
            <div className="cg-field">
              <label className="cg-label cg-label-1">Group Name</label>
              <input
                className="cg-input"
                id="groupName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter group name"
              />
            </div>

            <div className="cg-field color-row">
              <label className="cg-label cg-labe-2">Choose Colour</label>
              <div className="cg-colors">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    title={c}
                    className={`color-btn ${color === c ? 'active' : ''}`}
                    style={{ background: c }}
                    aria-label={`color-${c}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="cg-actions">
            <button type="submit" className="cg-submit">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateGroup