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
      } else if (res.status === 404) {
        console.log("Something went wrong");
      }
    });
  };

  const [username, setUsername] = useState("");
  const handleUsername = (ev) => {
    setUsername(ev.target.value);
  };

  const changeUsername = () => {
    // check if username is taken
    // if not, update username
    // else, show error
  };

  const [password, setPassword] = useState("");
  const handlePassword = (ev) => {
    setPassword(ev.target.value);
  };

  const changePassword = () => {
    // update password
  };

  const deleteAccount = () => {
    console.log(user);
    // TODO: ask to confirm, delete account if yes
    // history push to homepage
  };

  return (
    <Wrapper>
      <Banner />
      <Heading>account settings</Heading>
      <UserDetails>
        {user && user.image && <img src={user.image[0]} alt="" />}
        {user && <p>{user.username}</p>}
      </UserDetails>
      <Options>
        <Option key="upload-image">
          {user && user.image ? (
            <p>Change your profile image</p>
          ) : (
            <p>Upload a profile image</p>
          )}
          <form>
            <Input type="text" placeholder="image url" onChange={handleUrl} />
            <Button type="submit" onClick={handleUpload}>
              Upload
            </Button>
          </form>
        </Option>
        <Option key="change-username">
          {user && user.username && <p>Change your username</p>}
          <form>
            <Input
              type="text"
              placeholder="new username"
              onChange={handleUsername}
            />
            <Button type="submit" onClick={changeUsername} disabled={true}>
              Change
            </Button>
          </form>
        </Option>
        <Option key="change-password">
          {user && user.password && <p>Change your password</p>}
          <form>
            <Input
              type="text"
              placeholder="new password"
              onChange={handlePassword}
            />
            <Button type="submit" onClick={changePassword} disabled={true}>
              Change
            </Button>
          </form>
        </Option>
        <Option last={true}>
          <p>Permanently delete your account</p>
          <Button onClick={deleteAccount} disabled={true}>
            Delete
          </Button>
        </Option>
      </Options>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background: ${COLORS.lightest};
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

const UserDetails = styled.div`
  display: flex;
  align-items: center;
  img {
    height: 150px;
    border-radius: 50%;
    margin: 20px;
  }
  p {
    font-size: 2rem;
  }
`;

const Options = styled.ul`
  background: #f2f2f2;
  width: 80%;
  margin: 20px;
  border-radius: 20px;
  @media (max-width: 800px) {
    width: 100%;
    border-radius: 0px;
  }
`;

const Option = styled.li`
  color: ${(props) => (props.last ? "#cc0000" : "")};
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: ${(props) => (props.last ? "none" : "1px dotted #ccc")};
  padding: 10px;
  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

const Heading = styled.h1`
  background: ${COLORS.medium};
  color: #fff;
  width: 100%;
  text-align: center;
  border-bottom: 3px solid ${COLORS.light};
`;

const Input = styled.input`
  height: 40px;
  padding: 0 10px;
  margin: 5px;
  border: none;
  border-radius: 10px;
`;

const Button = styled.button`
  background: ${COLORS.light};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 40px;
  margin: 5px;
  border-radius: 10px;
  h2 {
    margin-right: 10px;
  }
  &:hover {
    background: ${COLORS.medium};
    color: #fff;
  }
  &:disabled {
    cursor: not-allowed;
    background: #ccc;
    color: #000;
  }
`;
