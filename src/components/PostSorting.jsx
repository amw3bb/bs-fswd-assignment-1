import PropTypes from 'prop-types'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'

export function PostSorting({
  fields = [],
  value,
  onChange,
  orderValue,
  onOrderChange,
}) {
  return (
    <Stack direction='column' spacing={2} width='100%'>
      <FormControl fullWidth size='small'>
        <InputLabel id='sort-by-label'>Sort by</InputLabel>
        <Select
          labelId='sort-by-label'
          id='sortBy'
          name='sortBy'
          value={value}
          label='Sort by'
          onChange={(e) => onChange(e.target.value)}
        >
          {fields.map((field) => (
            <MenuItem key={field} value={field}>
              {field}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth size='small'>
        <InputLabel id='sort-order-label'>Sort order</InputLabel>
        <Select
          labelId='sort-order-label'
          id='sortOrder'
          name='sortOrder'
          value={orderValue}
          label='Sort order'
          onChange={(e) => onOrderChange(e.target.value)}
        >
          <MenuItem value='ascending'>ascending</MenuItem>
          <MenuItem value='descending'>descending</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  )
}
PostSorting.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  orderValue: PropTypes.string.isRequired,
  onOrderChange: PropTypes.func.isRequired,
}
