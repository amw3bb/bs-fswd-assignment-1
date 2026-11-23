import PropTypes from 'prop-types'
import TextField from '@mui/material/TextField'

export function PostFilter({ field, value, onChange }) {
  return (
    <TextField
      fullWidth
      size='small'
      label={field}
      name={`filter-${field}`}
      id={`filter-${field}`}
      type='text'
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
PostFilter.propTypes = {
  field: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}
