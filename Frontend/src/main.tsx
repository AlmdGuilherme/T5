import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './ReactPages/HomePage/Home.tsx'
import Filtro from './ReactPages/FiltroPage/Filtro.tsx'
import CadastroPage from './ReactPages/CadastroPage/Cadastro.tsx'
import Navbar from './Components/Navbar/Navbar.tsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ClientePage from './ReactPages/ClientePage/Cliente.tsx'
import UpdateCliente from './ReactPages/UpdatePage/Update.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/Lista-Filtros' element={<Filtro/>}></Route>
        <Route path='/Cadastro-Clientes' element={<CadastroPage/>}></Route>
        <Route path="/Cliente/:id" element={<ClientePage/>}></Route>
        <Route path='/Atualizar-Cliente/:id' element={<UpdateCliente/>}></Route>
      </Routes>
    </Router>
  </StrictMode>,
)
