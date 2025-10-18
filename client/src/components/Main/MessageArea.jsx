import React, { useEffect, useState } from 'react'
import splash from '../../assets/image.png'
// import { SendHorizontal, LockKeyhole } from 'lucide-react'

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

const MessageArea = ({ selectedGroupId, onBack }) => {
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
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>


            {!selectedGroupId ? (
                // splash / empty state
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#e3eefb',
                        height: '100vh',
                        padding: '40px 20px',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            maxWidth: 600,
                            textAlign: 'center',
                        }}
                    >
                        <div style={{ flex: 1, marginBottom: 90 }}>
                            <img
                                src={splash}
                                alt="splash"
                                style={{
                                    maxWidth: 450,
                                    width: '100%',
                                    marginBottom: 32,
                                }}
                            />
                            <h1
                                style={{
                                    fontSize: 48,
                                    fontWeight: 600,
                                    marginBottom: 12,
                                    color: '#000000',
                                }}
                            >
                                Pocket Notes
                            </h1>
                            <p
                                style={{
                                    color: '#333',
                                    fontSize: 20,
                                    lineHeight: 1.6,
                                    maxWidth: 560,
                                    margin: '0 auto',
                                }}
                            >
                                Send and receive messages without keeping your phone online. Use Pocket Notes on up to 4 linked devices and 1 mobile phone
                            </p>
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                bottom: 24,
                                color: '#292929',
                                fontSize: 16,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                            }}
                        >
                            <span role="img" aria-label="lock">
                                <svg width="17" height="21" viewBox="0 0 17 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.125 21C1.54063 21 1.04019 20.804 0.623689 20.412C0.207189 20.02 -0.000706529 19.5493 1.80391e-06 19V9C1.80391e-06 8.45 0.208252 7.979 0.624752 7.587C1.04125 7.195 1.54133 6.99933 2.125 7H3.1875V5C3.1875 3.61667 3.70565 2.43733 4.74194 1.462C5.77823 0.486667 7.03092 -0.000665984 8.5 6.8306e-07C9.96979 6.8306e-07 11.2228 0.487667 12.2591 1.463C13.2954 2.43833 13.8132 3.61733 13.8125 5V7H14.875C15.4594 7 15.9598 7.196 16.3763 7.588C16.7928 7.98 17.0007 8.45067 17 9V19C17 19.55 16.7918 20.021 16.3753 20.413C15.9588 20.805 15.4587 21.0007 14.875 21H2.125ZM8.5 16C9.08438 16 9.58482 15.804 10.0013 15.412C10.4178 15.02 10.6257 14.5493 10.625 14C10.625 13.45 10.4168 12.979 10.0003 12.587C9.58375 12.195 9.08367 11.9993 8.5 12C7.91563 12 7.41519 12.196 6.99869 12.588C6.58219 12.98 6.37429 13.4507 6.375 14C6.375 14.55 6.58325 15.021 6.99975 15.413C7.41625 15.805 7.91634 16.0007 8.5 16ZM5.3125 7H11.6875V5C11.6875 4.16667 11.3776 3.45833 10.7578 2.875C10.138 2.29167 9.38542 2 8.5 2C7.61459 2 6.86198 2.29167 6.24219 2.875C5.6224 3.45833 5.3125 4.16667 5.3125 5V7Z" fill="#292929" />
                                </svg>
                            </span>
                            <span>end-to-end encrypted</span>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                        {/* topbar area */}
                        <header className="message-header" style={{ width: '100%', height: '12%', background: '#001F8B', color: '#fff', padding: 16, display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}>
                            {/* mobile back button - shown only when onBack provided */}
                            {onBack && (
                                <button onClick={onBack} aria-label="Back" style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 26, marginRight: 6, display: 'none' }} className="mobile-back">←</button>
                            )}

                            <div style={{ width: 68, height: 68, borderRadius: '50%', background: (group && group.color) || '#0b53ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, fontSize: 24, lineHeight: '28px', letterSpacing: '0.02em', color: '#FFFFFF' }}>{getInitials(group && group.name ? group.name : 'My Notes')}</div>
                            <h3 style={{ margin: 0,  fontWeight: 500, fontSize: 24, lineHeight: '28px', letterSpacing: '0.02em', color: '#FFFFFF' }}>{(group && group.name) || 'My Notes'}</h3>
                        </header>

                        {/* notes area */}
                        <div
                            className='notesArea'
                            style={{
                                flex: 1,
                                padding: 20,
                                background: '#DAE5F5',
                                overflowY: 'auto',
                                overflowX: 'hidden',
                                wordWrap: 'break-word',
                                height: '63%',
                            }}
                        >

                            {notes.map((n) => (
                                <div
                                    key={n.id}
                                    style={{
                                        background: '#FFFFFF',
                                        padding: '20px 40px 20px 20px',
                                        borderRadius: 5,
                                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
                                        marginBottom: 16,
                                        maxWidth: '100%',          // ✅ ensures card never exceeds container
                                        overflowWrap: 'break-word', // ✅ ensures long text breaks properly
                                    }}
                                >
                                    {/* content */}
                                    <div
                                        style={{
                                            whiteSpace: 'pre-wrap',     // ✅ respects line breaks in content
                                            wordBreak: 'break-word',    // ✅ breaks long continuous text
                                            color: '#000000',
                                            fontSize: 18,
                                            fontWeight: 400,
                                            letterSpacing: '0.035em',
                                            lineHeightStep: 29,
                                            lineHeight: '1.6',
                                        }}
                                    >
                                        {n.content}
                                    </div>

                                    {/* date/time */}
                                    <div
                                        style={{
                                            textAlign: 'right',
                                            color: '#353535',
                                            marginTop: 20,
                                            fontSize: 18,
                                            fontWeight: 'bold',
                                            letterSpacing: '0.02em',
                                            lineHeight: '18px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end',
                                            gap: 16,
                                            flexWrap: 'wrap', // ✅ ensures responsive alignment for date/time
                                        }}
                                    >
                                        {/* date */}
                                        <span>
                                            {new Date(n.createdAt).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </span>

                                        {/* circle */}
                                        <span
                                            style={{
                                                width: 8,
                                                height: 8,
                                                backgroundColor: '#353535',
                                                borderRadius: '50%',
                                                display: 'inline-block',
                                            }}
                                        ></span>

                                        {/* time */}
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

                        {/* text Area */}
                        <div style={{ padding: '0 20px', width: '100%', height: '25%', background: '#001F8B', display: 'flex', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' }}>
                            <div style={{ width: '100%', height: '80%', position: 'relative', display: 'flex', alignItems: 'center', background: '#FFFFFF', border: '1px solid #CCCCCC', borderRadius: 9 }}>
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Enter your text here..........."
                                    style={{ color: '#9A9A9A', flex: 1, padding: 12, borderRadius: 8, height: '100%', resize: 'none', outline: 'none', boxShadow: 'none', border: 'none', fontSize: 20, letterSpacing: '0.02em' }}
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
                                        fontSize: 22,
                                        cursor: text.trim() ? 'pointer' : 'default'
                                    }}
                                >

                                    <svg width="30" height="30" viewBox="0 0 35 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 29V18.125L14.5 14.5L0 10.875V0L34.4375 14.5L0 29Z" style={{ fill: text.trim() ? '#001F8B' : '#ABABAB' }} />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default MessageArea