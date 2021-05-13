export const initialState = null

export const reducer = (state, action)=>{
    
    if(action.type === "USER"){
        return action.payload
    }
    
    if(action.type ==="CLEAR"){
        return null
    }
    if(action.type === "UPDATE"){
        return {
            //spread the previous state
            /*example state:{
                name:"name",
                email:"email"
            }
            this will destructure into
            name:"name",
            email:"email"
            this way the next parameter will be "appended"
            */
            ...state,
            followers:action.payload.followers,
            following:action.payload.following
        }
    }
    if(action.type === "UPDATEPIC"){
        return{
            ...state,pic:action.payload
        }
    }


    return state
}