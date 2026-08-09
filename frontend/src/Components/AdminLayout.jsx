import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Layout/Sidebar/sidebar'
import Topbar from './Layout/Topbar/Topbar'


const AdminLayout = () => {

  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="app-shell">
        
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />

        {/*Header et contenu */}
        <div className="app-main">
          <Topbar onToggle={()=> setIsOpen(!isOpen)} />
          <main className="app-content">
            <Outlet/>
          </main>
        </div>
    
    </div>
  )
}

export default AdminLayout