import { useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import css from './App.module.scss';
import Header from '../components/Header.jsx';
import UserHeader from '../components/UserHeader.jsx';
import UserMain from '../components/UserMain.jsx';
import UserSidebar from '../components/UserSidebar.jsx';
import Footer from '../components/Footer.jsx';

const l = console.log 

function App() {
  
  l('import.meta.env', import.meta.env.PUBLIC_DB_TYPE)
  l('import.meta.env', import.meta.env.PUBLIC_DB_TYPE)

  const initLocalStorage = _ => {
    localStorage.queryHistory = localStorage.queryHistory || '[]'
    localStorage.favoriteUsers = localStorage.favoriteUsers || '[]'
  }
  
  useEffect(() => {
    initLocalStorage()
  }, [])

  return (
    <>
        <RecoilRoot>        
            <div id={css.app}>
                <Header />
                <div id={css.body} >
                  <UserHeader/>
                  <div id={css.main}>
                    <UserSidebar/>
                    <UserMain/>
                  </div>      
                </div>       
                <Footer/>
            </div>
        </RecoilRoot>
    </>
  );
}

export default App;