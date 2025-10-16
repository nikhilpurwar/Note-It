import React, { useEffect, useState } from 'react'
import splash from '../../assets/image.png'
import { SendHorizontal, LockKeyhole } from 'lucide-react'

const NOTES_KEY = 'noteit_notes' // will store object mapping groupId -> array of notes
const GROUPS_KEY = 'noteit_groups'

const loadNotesAll = () => {
    try {
        const raw = localStorage.getItem(NOTES_KEY)
        return raw ? JSON.parse(raw) : {}
    } catch {
        return {}
    }
}

const saveNotesAll = (obj) => {
    localStorage.setItem(NOTES_KEY, JSON.stringify(obj))
}

const loadGroupsAll = () => {
    try {
        const raw = localStorage.getItem(GROUPS_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

const getGroupById = (id) => {
    if (!id) return null
    const list = loadGroupsAll()
    return list.find((g) => g.id === id) || null
}

const getInitials = (name) => {
    if (!name) return '??'
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    const first = parts[0][0] || ''
    const last = parts[parts.length - 1][0] || ''
    return (first + last).toUpperCase()
}

const MessageArea = ({ selectedGroupId }) => {
    const [notes, setNotes] = useState([])
    const [text, setText] = useState('')
    const [group, setGroup] = useState(null)

    useEffect(() => {
        if (!selectedGroupId) {
            setNotes([])
            setGroup(null)
            return
        }
        const all = loadNotesAll()
        setNotes(all[selectedGroupId] || [])
        setGroup(getGroupById(selectedGroupId))
    }, [selectedGroupId])

    const saveNote = (content) => {
        if (!selectedGroupId) return
        const all = loadNotesAll()
        const now = new Date().toISOString()
        const note = { id: Date.now().toString(), content, createdAt: now, updatedAt: now }
        const list = all[selectedGroupId] ? [note, ...all[selectedGroupId]] : [note]
        const updated = { ...all, [selectedGroupId]: list }
        saveNotesAll(updated)
        setNotes(list)
        setText('')
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            const trimmed = text.trim()
            if (trimmed.length === 0) return
            saveNote(trimmed)
        }
    }

    const handleSend = () => {
        const trimmed = text.trim()
        if (trimmed.length === 0) return
        saveNote(trimmed)
    }

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>


            {!selectedGroupId ? (
                // splash / empty state
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e3eefb' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: 20 }}>
                        <div>
                            <img src={splash} alt="splash" style={{ maxWidth: 420, width: '80%', marginBottom: 24 }} />
                            <h1 style={{ fontSize: 48, marginBottom: 8 }}>Pocket Notes</h1>
                            <p style={{ color: '#333', maxWidth: 560, margin: '0 auto' }}>Send and receive messages without keeping your phone online. Use Pocket Notes on up to 4 linked devices and 1 mobile phone</p>
                        </div>

                        <div style={{ marginTop: 32, color: '#666' }}>
                            <span role="img" aria-label="lock"><LockKeyhole /></span> end-to-end encrypted
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <header style={{ background: '#001F8B', color: '#fff', padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 22, background: (group && group.color) || '#0b53ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{getInitials(group && group.name ? group.name : 'My Notes')}</div>
                        <h3 style={{ margin: 0, fontSize: 24, fontWeight: 500 }}>{(group && group.name) || 'My Notes'}</h3>
                    </header>
                    <div
                        style={{
                            width: '80vw',
                            flex: 1,
                            padding: 20,
                            background: '#DAE5F5',
                            overflowY: 'auto',
                        }}
                    >
                        {notes.map((n) => (
                            <div
                                key={n.id}
                                style={{
                                    background: '#FFFFFF',
                                    padding: 20,
                                    borderRadius: 8,
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                                    marginBottom: 16,
                                }}
                            >
                                <div
                                    style={{
                                        whiteSpace: 'pre-wrap',
                                        color: '#000000',
                                        fontSize: 16,
                                        lineHeight: '1.6',
                                    }}
                                >
                                    {n.content}
                                </div>

                                <div
                                    style={{
                                        textAlign: 'right',
                                        color: '#353535',
                                        marginTop: 12,
                                        fontSize: 18,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        gap: 8,
                                    }}
                                >
                                    <span>
                                        {new Date(n.createdAt).toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </span>

                                    <span
                                        style={{
                                            width: 6,
                                            height: 6,
                                            backgroundColor: '#353535',
                                            borderRadius: '50%',
                                            display: 'inline-block',
                                        }}
                                    ></span>

                                    <span>
                                        {new Date(n.createdAt).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true,
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>


                    <div style={{ height: 140, padding: 16, background: '#001F8B' }}>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a note..."
                                style={{ flex: 1, padding: 12, borderRadius: 8, height: 110, resize: 'none', outline: 'none', boxShadow: 'none', border: 'none', fontSize: 16, lineHeight: 1.5 }}
                            />
                            <button
                                onClick={handleSend}
                                aria-label="Send note"

                                style={{
                                    position: 'absolute',
                                    right: 20,
                                    bottom: 12,
                                    border: 'none',
                                    background: 'transparent',
                                    color: text.trim() ? '#001F8B' : '#ABABAB',
                                    fontSize: 22,
                                    cursor: text.trim() ? 'pointer' : 'default'
                                }}
                            >
                                <SendHorizontal size={30} />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default MessageArea