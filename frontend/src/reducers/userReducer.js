const initialState = {
  users: [],
  status: "idle",
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case "REQUEST_USERS": {
      return {
        ...state,
        status: "loading",
      };
    }
    case "RECEIVE_USERS": {
      return {
        ...state,
        users: action.users,
        status: "idle",
      };
    }
    default: {
      return state;
    }
  }
}

export const usersArray = (state) => Object.values(state.users.users);
