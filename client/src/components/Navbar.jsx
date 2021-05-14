import React,{useContext, useRef, useEffect, useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'

const Navbar = () => {
    const searchModal = useRef(null)
    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()
    const [search, setSearch] = useState('')
    const [userData, setUserdata] = useState([])

    const fetchUsers = (query)=>{
        setSearch(query)
        if(query){
            fetch('/search-users',{
                method:"post",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    query
                })
            })
            .then(res=>res.json())
            .then(results=>setUserdata(results.users))
        }
    }

    useEffect(()=>{
        M.Modal.init(searchModal.current)
    },[])

    const renderList = ()=>{
        if(state){
            return[
                <li key="1"><Link to="/"><i data-target="modal1"className="material-icons modal-trigger" style={{color:"black"}}>search</i></Link></li>,
                <li key="2"><Link to="/profile">Profile</Link></li>,
                <li key="3"><Link to="/create">Create Post</Link></li>,
                <li key="4"><Link to="/myfollowingpost">My following</Link></li>,
                <li key="5">
                    <button 
                    className="btn #e53935 red darken-1" type="submit" 
                    name="action"
                    onClick={()=>{
                        localStorage.clear()
                        dispatch({type:"CLEAR"})
                        history.push('/signin')
                    }}
                    >Log out
                    </button>
                </li>
            ]
        }else{
            return [
                <li key="6"><Link to="/signin">Signin</Link></li>,
                <li key="7"><Link to="/signup">Signup</Link></li>
            ]
        }
    }


    return (
        <div>
            <nav>
                <div className="nav-wrapper white">
                    <Link to={state?"/":"/signin"} className="brand-logo left">Instagram</Link>
                    <ul id="nav-mobile" className="right">
                        {renderList()}
                    </ul>
                </div>
                <div id="modal1" className="modal" ref={searchModal} styke={{color:"black"}}>
                    <div className="modal-content">
                        <input 
                        type="text"
                        placeholder="search users"
                        value={search}
                        onChange={e=>fetchUsers(e.target.value)}
                    />
                    <ul className="collection">
                        {userData.map(item=>{
                            return <Link 
                            onClick={()=>{setSearch('');M.Modal.getInstance(searchModal.current).close(); setUserdata([]);}}
                            key={item._id} 
                            to={item._id===state._id?"/profile":`/profile/${item._id}`}>
                            <li  className="collection-item">{item.email}</li>
                            </Link>
                        })}
                    </ul>
                    </div>
                    <div className="modal-footer">
                        <button  className="modal-close waves-effect waves-green btn-flat" onClick={()=>{setSearch('')}}>Close</button>
                    </div>
                </div>
            </nav>                   
        </div>
    )
}

export default Navbar

