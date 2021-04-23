import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { requestPlants, receivePlants } from "../actions.js";
import { LoginContext } from "../context/LoginContext";

import styled from "styled-components";
import { COLORS } from "../GlobalStyles";
import { BiSend } from "react-icons/bi";

export const Comments = ({ plant }) => {
  const dispatch = useDispatch();
  const { currentUser } = useContext(LoginContext);

  const [comment, setComment] = useState("");
  const handleComment = (ev) => {
    setComment(ev.target.value);
  };

  const submitComment = (ev) => {
    ev.preventDefault();
    fetch(`/plants/${plant._id}/comments`, {
      method: "PUT",
      body: JSON.stringify({
        comments: { comment: comment, username: currentUser.username },
      }),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        console.log(`Posted a new comment about ${plant.name}`);
        setComment("");
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
          value={comment}
        />
        <button type="submit" onClick={submitComment}>
          <BiSend />
        </button>
      </form>
      {plant.comments ? (
        <>
          {plant.comments.map((comment) => {
            return (
              <Card key={comment}>
                <Username to={`/user-profile/${comment.username}`}>
                  {comment.username}
                </Username>
                <Comment>{comment.comment}</Comment>
              </Card>
            );
          })}
        </>
      ) : (
        <Card>no comments yet</Card>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.section`
  background: #f2f2f2;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  margin: 15px;
  padding: 10px 20px;
  width: 300px;
  h2 {
    margin-bottom: 5px;
  }
  form {
    background: #fff;
    height: 100px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    border: 2px solid ${COLORS.light};
    border-radius: 20px;
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

const Card = styled.div`
  background: #fff;
  margin: 5px 0;
  border-radius: 20px;
  padding: 10px;
`;

const Username = styled(Link)`
  font-size: 0.8rem;
`;

const Comment = styled.p`
  color: #333;
`;
