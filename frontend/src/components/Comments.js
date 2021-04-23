import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { requestPlants, receivePlants } from "../actions.js";

import styled from "styled-components";
import { COLORS } from "../GlobalStyles";
import { BiSend } from "react-icons/bi";

export const Comments = ({ plant }) => {
  const dispatch = useDispatch();

  const [comment, setComment] = useState("");
  const handleComment = (ev) => {
    setComment(ev.target.value);
  };

  const submitComment = (ev) => {
    ev.preventDefault();
    fetch(`/plants/${plant._id}/comments`, {
      method: "PUT",
      body: JSON.stringify({ comments: comment }),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        console.log(`Posted a new comment about ${plant.name}`);
        dispatch(requestPlants());
        fetch("/plants")
          .then((res) => res.json())
          .then((json) => {
            dispatch(receivePlants(json.data));
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (res.status === 404) {
        console.log("Something went wrong");
      }
    });
  };

  return (
    <Wrapper>
      <h2>comments</h2>
      <form>
        <textarea
          type="text"
          onChange={handleComment}
          placeholder="do you have any questions or tips you would like to share?"
        />
        <button type="submit" onClick={submitComment}>
          <BiSend />
        </button>
      </form>
      <div>render all comments here</div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  background: #f2f2f2;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  margin: 15px;
  padding: 20px;
  width: 300px;
  form {
    background: #fff;
    height: 100px;
    width: 100%;
    border: 2px solid ${COLORS.light};
    border-radius: 20px;
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    textarea {
      width: 90%;
      margin: 10px;
      border: none;
      resize: none;
      &:focus {
        outline: none;
      }
    }
    button {
      align-self: flex-end;
      margin-right: 10px;
      padding-top: 5px;
      font-size: 1.7rem;
      &:hover {
        color: ${COLORS.light};
      }
    }
  }
`;
