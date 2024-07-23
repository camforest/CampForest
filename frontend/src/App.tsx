import '@styles/App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from '@components/Navbar/Navbar';

import Login from '@pages/Login';
import Regist from '@pages/Regist';
import Main from '@pages/Main';
import ProfileEdit from '@pages/ProfileEdit';
import MyPage from '@pages/MyPage';
import CampingSearch from '@pages/CampingSearch';
import Transaction from '@pages/Transaction';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className='flex'>
          {/* Desktop Navigation bar용 공간 */}
          <div className='hidden lg:block w-[15rem]'/>
          <div className='flex-grow'>
            {/* 여기서 부터 */}
            <Routes>
              <Route path='/' element={<Main/>}/>
              <Route path='/user/login' element={<Login/>}/>
              <Route path="/user/regist/*" element={<Regist/>}/>
              <Route path="/user/mypage/*" element={<MyPage/>}/>
              <Route path="/user/profile/edit" element={<ProfileEdit/>}/>
              <Route path='/transaction/*' element={<Transaction/> }/>
              <Route path='/camping' element={<CampingSearch/> }/>
            </Routes>
            {/* 여기까지 컨텐츠 */}
          </div> 
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;