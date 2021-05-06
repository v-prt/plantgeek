import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  requestPlants,
  receivePlants,
  requestUsers,
  receiveUsers,
} from "../actions.js";

export const usePlantsFetcher = async () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(requestPlants());
    fetch("/plants")
      .then((res) => res.json())
      .then((json) => {
        dispatch(receivePlants(json.data));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch]);
};

export const useUsersFetcher = async () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(requestUsers());
    fetch("/users")
      .then((res) => res.json())
      .then((json) => {
        dispatch(receiveUsers(json.data));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch]);
};
