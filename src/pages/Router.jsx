import App from './App'
import {BrowserRouter, Routes, Route} from 'react-router-dom';

export default () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App/>} key={1}></Route>
                <Route path='/user/:username' element={<App/>} key={2}></Route>
            </Routes>
        </BrowserRouter>
    )
}