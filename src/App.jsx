import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import OrgDetail from './pages/OrgDetail/OrgDetail';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/org/:name" element={<OrgDetail />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
