const initialState = {
  user: {},
  status: "idle",
};

export default function loginReducer(state = initialState, action) {
  switch (action.type) {
    case "LOGIN": {
      return {
        ...state,
        user: action.user,
        status: "idle",
      };
    }
    default: {
      return state;
    }
  }
}

export const userObject = (state) => state.user.user;
