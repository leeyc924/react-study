import { combineReducers, createStore } from "@reduxjs/toolkit";
import counter from "./counter";

const rootReducer = combineReducers({
  reducer: counter,
});

export const store = createStore(rootReducer);

export default rootReducer;
