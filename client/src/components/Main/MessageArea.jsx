import React, { useEffect, useState } from 'react'
import splash from '../../assets/image.png'
import './MessageArea.css'

const NOTES_KEY = 'noteit_notes'
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
        <div className="message-area-container">
            {!selectedGroupId ? (
                <div className="splash-container">
                    <div className="splash-inner">
                        <div className="splash-content">
                            <img src={splash} alt="splash" className="splash-image" />
                            <h1 className="splash-title">Pocket Notes</h1>
                            <p className="splash-description">
                                Send and receive messages without keeping your phone online.
                                Use Pocket Notes on up to 4 linked devices and 1 mobile phone
                            </p>
                        </div>

                        <div className="splash-footer">
                            <svg width="17" height="21" viewBox="0 0 17 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.125 21C1.54063 21 1.04019 20.804 0.623689 20.412C0.207189 20.02 -0.000706529 19.5493 1.80391e-06 19V9C1.80391e-06 8.45 0.208252 7.979 0.624752 7.587C1.04125 7.195 1.54133 6.99933 2.125 7H3.1875V5C3.1875 3.61667 3.70565 2.43733 4.74194 1.462C5.77823 0.486667 7.03092 -0.000665984 8.5 6.8306e-07C9.96979 6.8306e-07 11.2228 0.487667 12.2591 1.463C13.2954 2.43833 13.8132 3.61733 13.8125 5V7H14.875C15.4594 7 15.9598 7.196 16.3763 7.588C16.7928 7.98 17.0007 8.45067 17 9V19C17 19.55 16.7918 20.021 16.3753 20.413C15.9588 20.805 15.4587 21.0007 14.875 21H2.125ZM8.5 16C9.08438 16 9.58482 15.804 10.0013 15.412C10.4178 15.02 10.6257 14.5493 10.625 14C10.625 13.45 10.4168 12.979 10.0003 12.587C9.58375 12.195 9.08367 11.9993 8.5 12C7.91563 12 7.41519 12.196 6.99869 12.588C6.58219 12.98 6.37429 13.4507 6.375 14C6.375 14.55 6.58325 15.021 6.99975 15.413C7.41625 15.805 7.91634 16.0007 8.5 16ZM5.3125 7H11.6875V5C11.6875 4.16667 11.3776 3.45833 10.7578 2.875C10.138 2.29167 9.38542 2 8.5 2C7.61459 2 6.86198 2.29167 6.24219 2.875C5.6224 3.45833 5.3125 4.16667 5.3125 5V7Z" fill="#292929" />
                            </svg>
                            <span>end-to-end encrypted</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="message-main">
                    <header className="message-header">
                        {onBack && (
                            <button onClick={onBack} aria-label="Back" className="mobile-back">
                                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.27501 10.85C6.47501 10.65 6.57101 10.4083 6.56301 10.125C6.55501 9.84167 6.45068 9.6 6.25001 9.4L3.42501 6.575H14.575C14.8583 6.575 15.096 6.479 15.288 6.287C15.48 6.095 15.5757 5.85767 15.575 5.575C15.575 5.29167 15.479 5.054 15.287 4.862C15.095 4.67 14.8577 4.57433 14.575 4.575H3.42501L6.27501 1.725C6.47501 1.525 6.57501 1.28733 6.57501 1.012C6.57501 0.736666 6.47501 0.499333 6.27501 0.3C6.07501 0.0999997 5.83734 0 5.56201 0C5.28668 0 5.04934 0.0999997 4.85001 0.3L0.275009 4.875C0.175009 4.975 0.104008 5.08333 0.0620079 5.2C0.0200081 5.31667 -0.000658989 5.44167 7.62939e-06 5.575C7.62939e-06 5.70833 0.0210094 5.83333 0.0630093 5.95C0.105009 6.06667 0.175675 6.175 0.275009 6.275L4.87501 10.875C5.05834 11.0583 5.28734 11.15 5.56201 11.15C5.83668 11.15 6.07434 11.05 6.27501 10.85Z" fill="white" />
                                </svg>
                            </button>
                        )}
                        <div
                            className="group-avatar"
                            style={{ background: group?.color || '#0b53ff' }}
                        >
                            {getInitials(group?.name || 'My Notes')}
                        </div>
                        <h3 className="group-name" style={{color: 'white'}}>{group?.name || 'My Notes'}</h3>
                    </header>

                    <div className="notes-area">
                        {notes.map((n) => (
                            <div key={n.id} className="note-card">
                                <div className="note-content">{n.content}</div>
                                <div className="note-footer">
                                    <span>
                                        {new Date(n.createdAt).toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </span>
                                    <span className="dot"></span>
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

                    <div className="input-container">
                        <div className="input-box">
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter your text here..........."
                            />
                            <button
                                onClick={handleSend}
                                aria-label="Send note"
                                className={`send-btn ${text.trim() ? 'active' : ''}`}
                            >
                                <svg width="30" height="30" viewBox="0 0 35 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 29V18.125L14.5 14.5L0 10.875V0L34.4375 14.5L0 29Z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MessageArea
