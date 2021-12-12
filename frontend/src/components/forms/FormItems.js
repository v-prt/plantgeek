import { useField } from 'formik'

export const Text = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  return (
    <>
      <label className='text-label' htmlFor={props.id || props.name}>
        {label}
      </label>
      <input className='text-input' {...field} {...props} />
      {meta.touched && meta.error ? <div className='error'>{meta.error}</div> : null}
    </>
  )
}

export const Checkbox = ({ children, ...props }) => {
  const [field, meta] = useField({ ...props, type: 'checkbox' })
  return (
    <>
      <label className='checkbox-label'>
        <input className='checkbox-input' {...field} {...props} type='checkbox' />
        {children}
      </label>
      {meta.touched && meta.error ? <div className='error'>{meta.error}</div> : null}
    </>
  )
}
