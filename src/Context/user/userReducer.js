import { SET_LOADING, GET_USER, LOGOUT } from "../types";

const userReducer = (state, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_USER:
      return {
        ...state,
        tests: action.payload.tests,
        username: action.payload.username,
        role: action.payload.role,
        isAuthenticated: true,
        loading: false,
      };
    case LOGOUT:
      return {
        ...state,
        tests: null,
        username: null,
        isAuthenticated: false,
        loading: false,
      };
    default:
      return state;
  }
};

export default userReducer;
