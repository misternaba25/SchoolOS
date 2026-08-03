import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Layout/Navbar/navbar';
import Loginform from './Components/forms/LoginForm/loginform';

function App() {
  return (
    <div className="App">
      
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path='/Connexion' element={<Loginform/>}/>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
