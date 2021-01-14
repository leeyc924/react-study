import { createAction, handleActions } from "redux-actions";

const CHANGE_INPUT = "searchbar/CHANGE_INPUT";

export const changeInput = createAction(CHANGE_INPUT, (value) => value);

const init = {
  input: "",
};

const searchbar = handleActions(
  {
    [CHANGE_INPUT]: (state, { payload: value }) => ({
      ...state,
      input: value,
    }),
  },
  init
);

export default searchbar;