const initialState = {
  plants: [],
  status: "idle",
};

export default function plantReducer(state = initialState, action) {
  switch (action.type) {
    case "REQUEST_PLANTS": {
      return {
        ...state,
        status: "loading",
      };
    }
    case "RECEIVE_PLANTS": {
      return {
        ...state,
        plants: action.plants,
        status: "idle",
      };
    }
    default: {
      return state;
    }
  }
}

export const plantsArray = (state) => Object.values(state.plants.plants);
