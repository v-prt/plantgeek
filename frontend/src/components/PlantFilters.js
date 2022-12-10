import styled from 'styled-components/macro'
import { Select } from 'formik-antd'
import { FormItem } from './forms/FormItem'
import { COLORS, BREAKPOINTS } from '../GlobalStyles'
const { Option } = Select

export const PlantFilters = ({
  values,
  setValues,
  submitForm,
  currentUser,
  formData,
  setFormData,
}) => {
  return (
    <Wrapper>
      <div className='sort'>
        <FormItem label='Sort'>
          <Select
            getPopupContainer={trigger => trigger.parentNode}
            name='sort'
            value={formData.sort}
            onChange={e => {
              setFormData({ ...formData, sort: e })
              setValues({ ...values, sort: e })
              submitForm()
            }}
            placeholder='Select'
            style={{ width: '100%' }}>
            <Option value='name-asc'>Name (A-Z)</Option>
            <Option value='name-desc'>Name (Z-A)</Option>
            <Option value='most-hearts'>Most loved</Option>
            <Option value='most-owned'>Most owned</Option>
            <Option value='most-wanted'>Most wanted</Option>
          </Select>
        </FormItem>
      </div>
      <FormItem label='Light'>
        <Select
          getPopupContainer={trigger => trigger.parentNode}
          name='light'
          value={formData.light}
          onChange={e => {
            setFormData({ ...formData, light: e })
            setValues({ ...values, light: e })
            submitForm()
          }}
          placeholder='Select'
          style={{ width: '100%' }}
          allowClear>
          <Option value='low to bright indirect'>low to bright indirect</Option>
          <Option value='medium to bright indirect'>medium to bright indirect</Option>
          <Option value='bright indirect'>bright indirect</Option>
          {currentUser?.role === 'admin' && <Option value='unknown'>unknown</Option>}
        </Select>
      </FormItem>
      <FormItem label='Water'>
        <Select
          getPopupContainer={trigger => trigger.parentNode}
          name='water'
          value={formData.water}
          onChange={e => {
            setFormData({ ...formData, water: e })
            setValues({ ...values, water: e })
            submitForm()
          }}
          placeholder='Select'
          style={{ width: '100%' }}
          allowClear>
          <Option value='low'>low</Option>
          <Option value='low to medium'>low to medium</Option>
          <Option value='medium'>medium</Option>
          <Option value='medium to high'>medium to high</Option>
          <Option value='high'>high</Option>
          {currentUser?.role === 'admin' && <Option value='unknown'>unknown</Option>}
        </Select>
      </FormItem>
      <FormItem label='Temperature'>
        <Select
          getPopupContainer={trigger => trigger.parentNode}
          name='temperature'
          value={formData.temperature}
          onChange={e => {
            setFormData({ ...formData, temperature: e })
            setValues({ ...values, temperature: e })
            submitForm()
          }}
          placeholder='Select'
          style={{ width: '100%' }}
          allowClear>
          <Option value='average'>average</Option>
          <Option value='above average'>above average</Option>
          {currentUser?.role === 'admin' && <Option value='unknown'>unknown</Option>}
        </Select>
      </FormItem>
      <FormItem label='Humidity'>
        <Select
          getPopupContainer={trigger => trigger.parentNode}
          name='humidity'
          value={formData.humidity}
          onChange={e => {
            setFormData({ ...formData, humidity: e })
            setValues({ ...values, humidity: e })
            submitForm()
          }}
          placeholder='Select'
          style={{ width: '100%' }}
          allowClear>
          <Option value='low'>low</Option>
          <Option value='medium'>medium</Option>
          <Option value='high'>high</Option>
          {currentUser?.role === 'admin' && <Option value='unknown'>unknown</Option>}
        </Select>
      </FormItem>
      <FormItem label='Toxicity'>
        <Select
          getPopupContainer={trigger => trigger.parentNode}
          name='toxicity'
          value={formData.toxicity}
          onChange={e => {
            setFormData({ ...formData, toxicity: e })
            setValues({ ...values, toxicity: e })
            submitForm()
          }}
          placeholder='Select'
          style={{ width: '100%' }}
          allowClear>
          <Option value='toxic'>toxic</Option>
          <Option value='nontoxic'>nontoxic</Option>
          {currentUser?.role === 'admin' && <Option value='unknown'>unknown</Option>}
        </Select>
      </FormItem>
      <FormItem label='Climate'>
        <Select
          getPopupContainer={trigger => trigger.parentNode}
          name='climate'
          value={formData.climate}
          onChange={e => {
            setFormData({ ...formData, climate: e })
            setValues({ ...values, climate: e })
            submitForm()
          }}
          placeholder='Select'
          style={{ width: '100%' }}
          allowClear>
          <Option value='tropical'>tropical</Option>
          <Option value='subtropical'>subtropical</Option>
          <Option value='temperate'>temperate</Option>
          <Option value='desert'>desert</Option>
          {currentUser?.role === 'admin' && <Option value='unknown'>unknown</Option>}
        </Select>
      </FormItem>
      <FormItem label='Rarity'>
        <Select
          getPopupContainer={trigger => trigger.parentNode}
          name='rarity'
          value={formData.rarity}
          onChange={e => {
            setFormData({ ...formData, rarity: e })
            setValues({ ...values, rarity: e })
            submitForm()
          }}
          placeholder='Select'
          style={{ width: '100%' }}
          allowClear>
          <Option value='common'>common</Option>
          <Option value='uncommon'>uncommon</Option>
          <Option value='rare'>rare</Option>
          <Option value='very rare'>very rare</Option>
          <Option value='unicorn'>unicorn</Option>
          {currentUser?.role === 'admin' && <Option value='unknown'>unknown</Option>}
        </Select>
      </FormItem>
      {currentUser?.role === 'admin' && (
        <FormItem label='Review status' sublabel='(Admin)'>
          <Select
            getPopupContainer={trigger => trigger.parentNode}
            name='review'
            value={formData.review}
            onChange={e => {
              setFormData({ ...formData, review: e })
              setValues({ ...values, review: e })
              submitForm()
            }}
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
