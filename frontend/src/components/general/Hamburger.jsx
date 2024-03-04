import styled from 'styled-components'

export const Hamburger = ({ expanded }) => {
  return (
    <Wrapper className={expanded && 'expanded'}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  * {
    margin: 0;
    padding: 0;
  }
  width: 22px;
  height: 16px;
  position: relative;
  -webkit-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  transform: rotate(0deg);
  -webkit-transition: 0.5s ease-in-out;
  -moz-transition: 0.5s ease-in-out;
  -o-transition: 0.5s ease-in-out;
  transition: 0.5s ease-in-out;
  cursor: pointer;
  span {
    display: block;
    position: absolute;
    height: 3px;
    width: 50%;
    background: #fff;
    opacity: 1;
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
    -webkit-transition: 0.25s ease-in-out;
    -moz-transition: 0.25s ease-in-out;
    -o-transition: 0.25s ease-in-out;
    transition: 0.25s ease-in-out;
  }

  span:nth-child(even) {
    left: 50%;
  }

  span:nth-child(odd) {
    left: 0px;
  }

  span:nth-child(1),
  span:nth-child(2) {
    top: 0px;
  }

  span:nth-child(3),
  span:nth-child(4) {
    top: 6px;
  }

  span:nth-child(5),
  span:nth-child(6) {
    top: 12px;
  }

  &.expanded span:nth-child(1),
  &.expanded span:nth-child(6) {
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg);
  }

  &.expanded span:nth-child(2),
  &.expanded span:nth-child(5) {
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }

  &.expanded span:nth-child(1) {
    left: 2px;
    top: 2px;
  }

  &.expanded span:nth-child(2) {
    left: calc(50% - 2px);
    top: 2px;
  }

  &.expanded span:nth-child(3) {
    left: -50%;
    opacity: 0;
  }

  &.expanded span:nth-child(4) {
    left: 100%;
    opacity: 0;
  }

  &.expanded span:nth-child(5) {
    left: 2px;
    top: 9px;
  }

  &.expanded span:nth-child(6) {
    left: calc(50% - 2px);
    top: 9px;
  }
`
