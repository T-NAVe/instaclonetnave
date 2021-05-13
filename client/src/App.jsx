import React, {useEffect, createContext, useReducer, useContext} from 'react'
import Navbar from './components/Navbar'
import './App.css'
import { BrowserRouter, Route, Switch, useHistory }from 'react-router-dom'
import Home from './components/screens/Home'
import Profile from './components/screens/Profile'
import Signup from './components/screens/Signup'
import Signin from './components/screens/Signin'
import CreatePost from './components/screens/CreatePost'
import {initialState, reducer} from './reducers/userReducers'
import UserProfile from './components/screens/UserProfile'
import SubscribedUserPosts from './components/screens/SubscribedUserPosts'

export const UserContext = createContext()
 //wrap everything in a new component to be able to access use history
 //since app is not a rendered component it doesn't have useHistory
const Routing = ()=>{
  const history = useHistory()
  // eslint-disable-next-line
  const {state, dispatch} = useContext(UserContext)

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    
    if(user){
      dispatch({type:"USER", payload:user})
    }else{
      history.push('/signin')
    }
    // eslint-disable-next-line
  },[])

  return(
    <Switch>
      <Route exact path="/">
        <Home/>
      </Route>
      <Route exact path="/signin">
        <Signin></Signin>
      </Route>
      <Route exact path="/signup">
        <Signup></Signup>
      </Route>
      <Route exact path="/profile">
        <Profile></Profile>
      </Route>
      <Route exact path="/create">
        <CreatePost></CreatePost>
      </Route>
      <Route exact path="/profile/:userid">
        <UserProfile></UserProfile>
      </Route>
      <Route exact path="/myfollowingpost">
        <SubscribedUserPosts></SubscribedUserPosts>
      </Route>
    </Switch>
  );
}


function App() {

  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    //have access to dispatch in all components
    <UserContext.Provider value={{state, dispatch}}>
    <BrowserRouter>
      <Navbar/>
      <Routing/>
    </BrowserRouter>   
    </UserContext.Provider> 
  );
}

export default App;
