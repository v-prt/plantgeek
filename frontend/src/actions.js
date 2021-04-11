export const requestPlants = () => ({
  type: "REQUEST_PLANTS",
});

export const receivePlants = (plants) => ({
  type: "RECEIVE_PLANTS",
  plants,
});
