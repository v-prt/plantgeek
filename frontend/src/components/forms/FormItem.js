import React from 'react'
import { Field, ErrorMessage } from 'formik'
import styled from 'styled-components/macro'
import { COLORS } from '../../GlobalStyles'
import { Tooltip } from 'antd'
import { QuestionCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

export const FormItem = ({
  children,
  name,
  label,
  required,
  sublabel,
  subtext,
  size = '',
  info = '',
  ...props
}) => {
  return (
    <Wrapper size={size}>
      <Field>
        {({ field, form }) => {
          const hasError = form.errors[name] && form.touched[name]
          return (
            <div>
              <label className='item-label' style={{ color: !hasError || 'red' }}>
                {info && (
                  <Tooltip color={COLORS.accent} placement='topLeft' title={info}>
                    <span className='info'>
                      <QuestionCircleOutlined />
                    </span>
                  </Tooltip>
                )}
                {label && <span className='label'>{label} </span>}
                {sublabel && <span className='sublabel'>{sublabel} </span>}
              </label>
              {subtext && <p className='subtext'>{subtext}</p>}
              {children}
              {name && (
                <ErrorMessage
                  name={name}
                  component='div'
                  render={msg => (
                    <div
                      style={{
                        color: 'red',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '0.8rem',
                      }}>
                      <ExclamationCircleOutlined style={{ marginRight: '5px' }} />
                      <span>{msg}</span>
                    </div>
                  )}
                />
              )}
            </div>
          )
        }}
      </Field>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  margin: 10px 0;

  .item-label {
    display: block;
    line-height: 1.2;
    margin-bottom: 2px;
    .label {
      text-transform: uppercase;
      font-size: 0.8rem;
      letter-spacing: 1px;
    }
    .info {
      color: ${COLORS.accent};
    }
    .sublabel {
      font-size: 0.8rem;
      color: rgba(0, 0, 0, 0.5);
      font-weight: normal;
    }
  }
  .subtext {
  }
  .info-text {
    color: rgba(0, 0, 0, 0.7);
    font-size: 0.8rem;
  }
  .ant-input,
  .ant-input-number,
  .ant-select .ant-select-selector {
    color: black;
    &.ant-input-disabled {
      color: rgba(0, 0, 0, 0.7);
      cursor: auto;
      resize: none;
    }
  }
  .ant-input-number {
    display: block;
    width: 100%;
    max-width: 200px;
  }
`
