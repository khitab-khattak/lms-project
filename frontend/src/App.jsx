
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './components/pages/Home'
import ChangePassword from './components/pages/account/ChangePassword'
import Detail from './components/pages/Detail'
import Login from './components/pages/Login'
import Register from './components/pages/Register'
import MyCourses from './components/pages/account/MyCourses'
import WatchCourse from './components/pages/account/WatchCourse'
import Layout from './components/common/Layout'
import MyLearning from './components/pages/account/MyLearning'
import { Toaster } from 'react-hot-toast';
import Dashboard from './components/pages/account/Dashboard'
import {RequireAuth} from './components/common/RequireAuth'
import EditCourse from './components/pages/account/courses/EditCourse'
import CreateCourse from './components/pages/account/courses/CreateCourse'
import EditLesson from './components/pages/account/courses/EditLesson'
import AllCourses from './components/pages/AllCourses'

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/account/my-courses" element={<MyCourses/>}/>
      <Route path="/courses" element={<AllCourses/>}/>
      <Route path="/detail" element={<Detail/>}/>
      <Route path="/account/change-password" element={<ChangePassword/>}/>
      <Route path="/account/login" element={<Login/>}/>
      <Route path="/account/register" element={<Register/>}/>
      <Route path="/account/my-learning" element={<MyLearning/>}/>
      <Route path="/account/watch-course" element={<WatchCourse/>}/>
      <Route path="/header" element={<Layout/>}/>
      <Route path="/account/courses/create" element=
      {
        <RequireAuth>
          <CreateCourse/>
        </RequireAuth>
        
      }/>
        <Route path="/account/courses/edit/:id" element=
      {
        <RequireAuth>
          <EditCourse/>
        </RequireAuth>
        
      }/>
      <Route path="/account/lesson/edit/:courseId/:id" element=
      {
        <RequireAuth>
          <EditLesson/>
        </RequireAuth>
        
      }/>
      <Route path="/account/dashboard" element=
      {
        <RequireAuth>
          <Dashboard/>
        </RequireAuth>
        
      }/>
  
    </Routes>
    </BrowserRouter>
    <Toaster position="top-center" reverseOrder={false} />
    </>
  )
}

export default App
