export const requestPlants = () => ({
  type: "REQUEST_PLANTS",
});

export const receivePlants = (plants) => ({
  type: "RECEIVE_PLANTS",
  plants,
});

export const requestUsers = () => ({
  type: "REQUEST_USERS",
});

export const receiveUsers = (users) => ({
  type: "RECEIVE_USERS",
  users,
});
