import { useEffect,  } from 'react';
import { RecoilRoot } from 'recoil';
import css from './App.module.scss';
import Header from './Header.jsx';
import UserHeader from './UserHeader.jsx';
import UserMain from './UserMain.jsx';
import UserSidebar from './UserSidebar.jsx';

const l = console.log 

function App() {
  
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
                <Header/>
                  <div id={css.body} >
                    <UserHeader/>
                    <div id={css.main}>
                      <UserSidebar/>
                      <UserMain/>
                    </div>      
                  </div>    
            </div>
        </RecoilRoot>
    </>
  );
}

export default App;