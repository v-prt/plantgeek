import styled from 'styled-components/macro'
import { Select } from 'formik-antd'
import { FormItem } from './forms/FormItem'
import { COLORS, BREAKPOINTS, Toggle } from '../GlobalStyles'
const { Option } = Select

export const PlantFilters = ({ setViewNeeds, submitForm, currentUser }) => {
  return (
    <Wrapper>
      <div className='sort'>
        <FormItem label='Sort'>
          <Select
            getPopupContainer={trigger => trigger.parentNode}
            name='sort'
            onChange={submitForm}
            placeholder='Select'
            style={{ width: '100%' }}>
            <Option value='name-asc'>Name (A-Z)</Option>
            <Option value='name-desc'>Name (Z-A)</Option>
            <Option value='most-hearts'>Most liked</Option>
            <Option value='most-owned'>Most owned</Option>
            <Option value='most-wanted'>Most wanted</Option>
          </Select>
        </FormItem>
      </div>
      <div className='toggle-wrapper'>
        <span className='toggle-option'>Show needs</span>
        <Toggle>
          <input
            id='needs-toggle'
            type='checkbox'
            onChange={ev => setViewNeeds(ev.target.checked)}
          />
          <span className='slider'></span>
        </Toggle>
      </div>
      <FormItem label='Light'>
        <Select
          getPopupContainer={trigger => trigger.parentNode}
          name='light'
          onChange={submitForm}
          placeholder='Select'
          style={{ width: '100%' }}
          allowClear>
          <Option value='low to bright indirect'>low to bright indirect</Option>
          <Option value='medium to bright indirect'>medium to bright indirect</Option>
          <Option value='bright indirect'>bright indirect</Option>
          <Option value='unknown'>unknown</Option>
        </Select>
      </FormItem>
      <FormItem label='Water'>
        <Select
          getPopupContainer={trigger => trigger.parentNode}
          name='water'
          onChange={submitForm}
          placeholder='Select'
          style={{ width: '100%' }}
          allowClear>
          <Option value='low'>low</Option>
          <Option value='low to medium'>low to medium</Option>
          <Option value='medium'>medium</Option>
          <Option value='medium to high'>medium to high</Option>
          <Option value='high'>high</Option>
          <Option value='unknown'>unknown</Option>
        </Select>
      </FormItem>
      <FormItem label='Temperature'>
        <Select
          getPopupContainer={trigger => trigger.parentNode}
          name='temperature'
          onChange={submitForm}
          placeholder='Select'
          style={{ width: '100%' }}
          allowClear>
          <Option value='average'>average</Option>
          <Option value='above average'>above average</Option>
          <Option value='unknown'>unknown</Option>
        </Select>
      </FormItem>
      <FormItem label='Humidity'>
        <Select
          getPopupContainer={trigger => trigger.parentNode}
          name='humidity'
          onChange={submitForm}
          placeholder='Select'
          style={{ width: '100%' }}
          allowClear>
          <Option value='low'>low</Option>
          <Option value='medium'>medium</Option>
          <Option value='high'>high</Option>
          <Option value='unknown'>unknown</Option>
        </Select>
      </FormItem>
      <FormItem label='Toxicity'>
        <Select
          getPopupContainer={trigger => trigger.parentNode}
          name='toxicity'
          onChange={submitForm}
          placeholder='Select'
          style={{ width: '100%' }}
          allowClear>
          <Option value='toxic'>toxic</Option>
          <Option value='nontoxic'>nontoxic</Option>
          <Option value='unknown'>unknown</Option>
        </Select>
      </FormItem>
      {currentUser?.role === 'admin' && (
        <FormItem label='Review status' sublabel='(Admin)'>
          <Select
            getPopupContainer={trigger => trigger.parentNode}
            name='review'
            onChange={submitForm}
            placeholder='Select'
            style={{ width: '100%' }}
            allowClear>
            <Option value='approved'>approved</Option>
            <Option value='pending'>pending</Option>
            <Option value='rejected'>rejected</Option>
          </Select>
        </FormItem>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  .num-results {
    color: ${COLORS.accent};
    text-align: center;
    font-weight: bold;
  }
  .label {
    font-weight: bold;
  }
  .toggle-wrapper {
    display: flex;
    align-items: center;
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    justify-content: space-between;
    margin: 10px 0;
    .toggle-option {
      margin-right: 10px;
      line-height: 1;
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.desktop}) {
    .sort {
      display: none;
    }
  }
`
