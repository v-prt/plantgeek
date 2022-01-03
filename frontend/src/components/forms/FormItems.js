import { useField } from 'formik'

// TODO: radio

export const Text = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  return (
    <div className='form-item'>
      <div className='text-wrapper'>
        <label className='text-label' htmlFor={props.id || props.name}>
          {label}
        </label>
        <input className='text-input' {...field} {...props} />
      </div>
      {meta.touched && meta.error ? <div className='error'>{meta.error}</div> : null}
    </div>
  )
}

export const Select = ({ label, options, ...props }) => {
  const [field, meta] = useField(props)
  return (
    <div className='form-item'>
      <div className='select-wrapper'>
        <label className='select-label' htmlFor={props.id || props.name}>
          {label}
        </label>
        <select className='select-input' {...field} {...props}>
          <option value='' disabled>
            select
          </option>
          {options.map((option) => {
            return (
              <option key={option} value={option}>
                {option}
              </option>
            )
          })}
        </select>
      </div>
      {meta.touched && meta.error ? <div className='error'>{meta.error}</div> : null}
    </div>
  )
}

export const Checkbox = ({ children, ...props }) => {
  const [field, meta] = useField({ ...props, type: 'checkbox' })
  return (
    <div className='form-item'>
      <div className='checkbox-wrapper'>
        <label className='checkbox-label'>
          <input className='checkbox-input' {...field} {...props} type='checkbox' />
          {children}
        </label>
      </div>
      {meta.touched && meta.error ? <div className='error'>{meta.error}</div> : null}
    </div>
  )
}
