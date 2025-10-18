import React, { useRef, useState } from 'react'

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

    // Use click on the overlay to close the modal. Stops propagation inside the modal

    const COLORS = ['#caa6ff', '#ff7fe0', '#42e6ff', '#f2a57d', '#0b53ff', '#6f94ff']

    const handleSubmit = (e) => {
        e && e.preventDefault()
        const trimmed = name.trim()
        if (trimmed.length < 2) {
            alert('Group name must be at least 2 characters')
            return
        }

        const groups = loadGroups()
        const exists = groups.some(g => g.name.toLowerCase() === trimmed.toLowerCase())
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
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
            <div onClick={() => setIsOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', cursor: 'pointer', zIndex: 10 }} />
            <div ref={ref} onClick={(e) => e.stopPropagation()} className="create-modal" style={{ background: '#fff', padding: 30, borderRadius: 12, boxShadow: '0 6px 24px rgba(0,0,0,0.25)', zIndex: 20 }}>
                <h2 style={{ fontSize: 29, fontWeight: 500, letterSpacing: '0.035em', margin: 0, marginBottom: 18, marginTop: 6 }}>Create New group</h2>

                {/* Avatar preview */}
                {/* <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 28, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18 }}>{getInitials(name) || '??'}</div>
                    <div style={{ color: '#333' }}>
                        <div style={{ fontWeight: 700 }}>{name || 'Group preview'}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>Choose a name and color for the group</div>
                    </div>
                </div> */}

                <form onSubmit={handleSubmit} className="create-form" style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div className="cg-row" style={{ width: '100%' }}>
                        <div className="cg-field" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'start', width: '100%' }}>
                            <label className="cg-label" style={{ width: '30%', fontWeight: 600, fontSize: 20, letterSpacing: '0.02em' }}>Group Name</label>
                            <input className="cg-input" id="groupName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter group name" style={{ width: '65%', height: 44, padding: '0px 16px', borderRadius: 22, border: '2px solid #CCCCCC', fontSize: 18 }} />
                        </div>
                        <div className="cg-field" style={{ marginBottom: 18, display: 'flex', justifyContent: 'center', width: '100%', alignItems: 'center', gap: '4%' }}>
                            <label className="cg-label" style={{ width: '30%', display: 'block', fontSize: 20, fontWeight: 600, letterSpacing: '0.02em' }}>Choose colour</label>
                            <div className="cg-colors" style={{ width: '65%', display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                    {COLORS.map(c => (
                                        <button key={c} type="button" onClick={() => setColor(c)} title={c} className="color-btn" style={{ width: 40, height: 40, borderRadius: '50%', background: c, border: color === c ? '3px solid #222' : '2px solid rgba(0,0,0,0.08)' }} aria-label={`color-${c}`} />
                                    ))}
                                </div>                           
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', cursor: 'pointer', marginTop: 6 }}>
                        <button type="submit" className="cg-submit" style={{ width: 160, height: 44, background: '#24008b', color: '#fff', borderRadius: 10, border: 'none', fontSize: 18, cursor: 'pointer' }}>Create</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateGroup