import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { usersArray } from "../../reducers/userReducer";
import { requestUsers, receiveUsers } from "../../actions.js";
import { LoginContext } from "../../context/LoginContext";

import styled from "styled-components";
import { COLORS } from "../../GlobalStyles";
import background from "../../assets/monstera-bg.jpg";

export const Settings = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { loggedIn } = useContext(LoginContext);
  const users = useSelector(usersArray);
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    setUser(users.find((user) => user.username === loggedIn.username));
  }, [loggedIn, users]);

  const [existingImage, setExistingImage] = useState(undefined);
  useEffect(() => {
    if (user && user.image) {
      setExistingImage(user.image[0]);
    }
  }, [user]);

  const [url, setUrl] = useState("");
  const handleUrl = (ev) => {
    setUrl(ev.target.value);
  };

  const handleUpload = (ev) => {
    ev.preventDefault();
    // REMOVES EXISTING IMAGE
    if (existingImage) {
      fetch(`/${user.username}/remove`, {
        method: "PUT",
        body: JSON.stringify({ image: existingImage }),
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      }).then((res) => {
        if (res.status === 200) {
          dispatch(requestUsers());
          fetch("/users")
            .then((res) => res.json())
            .then((json) => {
              dispatch(receiveUsers(json.data));
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (res.status === 404) {
          console.log("Something went wrong");
        }
      });
    }
    // ADDS NEW IMAGE
    fetch(`/${user.username}/add`, {
      method: "PUT",
      body: JSON.stringify({ image: url }),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        dispatch(requestUsers());
        fetch("/users")
          .then((res) => res.json())
          .then((json) => {
            dispatch(receiveUsers(json.data));
          })
          .catch((err) => {
            console.log(err);
          });
        history.push(`/user-profile/${user.username}`);
      } else if (res.status === 404) {
        console.log("Something went wrong");
      }
    });
  };

  return (
    <Wrapper>
      <Banner />
      <Heading>profile settings</Heading>
      <ImageUpload>
        {user && user.image ? (
          <h2>change your profile image</h2>
        ) : (
          <h2>upload a profile image</h2>
        )}
        <form>
          <Input type="text" placeholder="image url" onChange={handleUrl} />
          <Button type="submit" onClick={handleUpload}>
            upload
          </Button>
        </form>
      </ImageUpload>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background: #f2f2f2;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  form {
    display: flex;
  }
`;

const Banner = styled.div`
  background: url(${background}) center center / cover;
  height: 120px;
  width: 100%;
`;

const ImageUpload = styled.div`
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Heading = styled.h1`
  background: ${COLORS.medium};
  color: #fff;
  width: 100%;
  text-align: center;
  border-bottom: 3px solid ${COLORS.light};
`;

const Input = styled.input`
  padding: 5px;
  margin: 5px;
  border: none;
  border-radius: 10px;
`;

const Button = styled.button`
  background: ${COLORS.light};
  display: flex;
  align-items: center;
  margin: 5px;
  border-radius: 10px;
  padding: 5px;
  h2 {
    margin-right: 10px;
  }
  &:hover {
    background: ${COLORS.medium};
    color: #fff;
  }
`;
