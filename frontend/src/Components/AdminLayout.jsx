import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Layout/Sidebar/sidebar'
import Topbar from './Layout/Topbar/Topbar'


const AdminLayout = () => {
  return (
    <div className="app-shell">
        
        <Sidebar/>

        {/*Header et contenu */}
        <div className="app-content">
          <Topbar/>
          <main className="app-content">
            <Outlet/>
          </main>
        </div>
    
    </div>
  )
}

export default AdminLayout