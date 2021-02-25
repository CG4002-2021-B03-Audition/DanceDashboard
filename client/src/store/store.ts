import { applyMiddleware, createStore } from "redux"
import { composeWithDevTools } from "redux-devtools-extension";
import { sessionReducer } from "./session/reducer";
import { wsReducer } from "./ws/reducer";
import { combineReducers } from "redux"
import thunkMiddleware from 'redux-thunk';

// type RootState = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
    liveStore: wsReducer,
    sessionStore: sessionReducer,
})

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))
const store = createStore(rootReducer, composedEnhancer)

export default store