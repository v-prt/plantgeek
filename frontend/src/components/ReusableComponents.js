import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'

export const Button = styled.button`
  line-height: 1;
  background: ${COLORS.medium};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px;
  padding: 10px 20px;
  border-radius: 10px;
  h2 {
    margin-right: 10px;
  }
  &:hover {
    background: ${COLORS.light};
    color: #000;
  }
  &:disabled {
    pointer-events: none;
    background: #ccc;
    color: #000;
  }
`
