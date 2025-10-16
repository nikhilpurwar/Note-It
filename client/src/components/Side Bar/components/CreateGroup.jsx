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

        const avatar = trimmed.slice(0,2).toUpperCase()
        const newGroup = { id: Date.now().toString(), name: trimmed, color, avatar }
        const updated = [newGroup, ...groups]
        saveGroups(updated)
        onCreate && onCreate(newGroup)
        setIsOpen(false)
    }

    return (
        <div style={{position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50}}>
            <div onClick={() => setIsOpen(false)} style={{position:'absolute', inset:0, background: 'rgba(0,0,0,0.4)', cursor:'pointer', zIndex: 10}} />
            <div ref={ref} onClick={(e)=>e.stopPropagation()} style={{background:'#fff', padding:24, borderRadius:8, width: 480, boxShadow: '0 6px 24px rgba(0,0,0,0.25)', zIndex:20}}>
                <h2 style={{margin:0, marginBottom:36}}>Create New group</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{marginBottom:20, display:'flex', justifyContent:'space-between', width:'100%'}}>
                        <label style={{ width:'30%', fontWeight:700}}>Group Name</label>
                        <input id="groupName" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Enter group name" style={{ width:'70%', padding:'8px 12px', borderRadius:20, border: '1px solid #ddd'}} />
                    </div>
                    <div style={{marginBottom:28, display:'flex', justifyContent:'space-between', width:'100%'}}>
                        <label style={{width:'30%', display:'block', fontWeight:700, marginBottom:8}}>Choose colour</label>
                        <div style={{width:'70%', display:'flex', gap:12}}>
                            {COLORS.map(c => (
                                <button key={c} type="button" onClick={()=>setColor(c)} style={{width:32, height:32, borderRadius:16, background:c, border: color===c ? '3px solid #222' : '2px solid rgba(0,0,0,0.08)'}} aria-label={`color-${c}`} />
                            ))}
                        </div>
                    </div>

                    <div style={{display:'flex', justifyContent:'flex-end'}}>
                        <button type="submit" style={{background:'#24008b', color:'#fff', padding:'10px 24px', borderRadius:8, border:'none'}}>Create</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateGroup