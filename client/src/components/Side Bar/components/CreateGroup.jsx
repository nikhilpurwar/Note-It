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
            <div ref={ref} onClick={(e) => e.stopPropagation()} style={{ background: '#fff', padding: 24, borderRadius: 8, width: 520, boxShadow: '0 6px 24px rgba(0,0,0,0.25)', zIndex: 20 }}>
                <h2 style={{ margin: 0, marginBottom: 18 }}>Create New group</h2>

                {/* Avatar preview */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 28, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18 }}>{getInitials(name) || '??'}</div>
                    <div style={{ color: '#333' }}>
                        <div style={{ fontWeight: 700 }}>{name || 'Group preview'}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>Choose a name and color for the group</div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <label style={{ width: '30%', fontWeight: 700 }}>Group Name</label>
                        <input id="groupName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter group name" style={{ width: '70%', padding: '8px 12px', borderRadius: 20, border: '1px solid #ddd' }} />
                    </div>
                    <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <label style={{ width: '30%', display: 'block', fontWeight: 700 }}>Choose colour</label>
                        <div style={{ width: '70%', display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                                {COLORS.map(c => (
                                    <button key={c} type="button" onClick={() => setColor(c)} title={c} style={{ width: 34, height: 34, borderRadius: 17, background: c, border: color === c ? '3px solid #222' : '2px solid rgba(0,0,0,0.08)' }} aria-label={`color-${c}`} />
                                ))}
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 8,
                                    marginLeft: 12,
                                    padding: 10,
                                    borderRadius: 10,
                                    backgroundColor: '#eff0f1ff',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                }}
                            >
                                <label
                                    htmlFor="custom-color"
                                    style={{
                                        fontSize: 14,
                                        color: '#333',
                                        fontWeight: 500,
                                        marginBottom: 4,
                                    }}
                                >
                                    Pick a color
                                </label>

                                <input
                                    id="custom-color"
                                    aria-label="custom-color"
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    style={{
                                        width: 42,
                                        height: 42,
                                        borderRadius: '50%',
                                        border: '2px solid #ddd',
                                        background: 'transparent',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.transform = 'scale(1.1)';
                                        e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.transform = 'scale(1)';
                                        e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                    }}
                                />

                                <div
                                    style={{
                                        fontSize: 13,
                                        color: '#555',
                                        backgroundColor: '#fff',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: 6,
                                        padding: '3px 8px',
                                        marginTop: 6,
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                        fontFamily: 'monospace',
                                    }}
                                >
                                    {color.toUpperCase()}
                                </div>
                            </div>

                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" style={{ background: '#24008b', color: '#fff', padding: '10px 24px', borderRadius: 8, border: 'none' }}>Create</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateGroup