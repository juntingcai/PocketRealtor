import React, { Fragment, useState } from 'react';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import NumberFormatCustom from '../../functions/NumberFomat'
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import '../../SearchFilter.css'
const SearchFilter = (props) => {



  const [values, setValues] = useState({
    max: '',
    min: '',
    bed: 0,
    bath: 0
  });

  const handleChange = (event) => {
    if ((event.target.name === 'min' && values.max < event.target.value) || (event.target.name === 'max' && values.min > event.target.value)) {
      setValues({
        min: event.target.value,
        max: event.target.value,
      })
    }
    else
      setValues({
        ...values,
        [event.target.name]: event.target.value,
      })

  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [target, setTarget] = useState('')

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setTarget(event.currentTarget.id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setTarget('')
    
  };
  const handlePrice = () => {
    handleClose();
    props.onSelectPrice(values.min, values.max);
  }
  const handleRoom = () => {
    handleClose();
    props.onSelectRoom(values.bed, values.bath);
  }

  const open = Boolean(anchorEl);
  const id = open ? 'search-filter-wrap' : undefined;

  return (
    <Fragment>
      <div>
        <Button aria-describedby={id} id="price-selector" variant="outlined" className="theme-color-2" onClick={handleClick}>
          Price
          </Button>
        <Button aria-describedby='room-selector' id="room-selector" variant="outlined" className="theme-color" onClick={handleClick}>
          Rooms
        </Button>
        <Button aria-describedby='more-selector' id="more-selector" variant="outlined" className="theme-color" onClick={handleClick}>
          More
        </Button>
        <Popover
          id={id}
          open={target === 'price-selector'}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <div className="selector-popover" id="price-selector-popover">

            <div className="selector-title">
              Price Range
                </div>
            <div className="selector-field">

              <TextField
              variant="outlined"
              size="small"
                label="Min"
                value={values.min}
                onChange={handleChange}
                name="min"
                id="min-price"
                InputProps={{
                  inputComponent: NumberFormatCustom,
                }}
              />
              <span> - </span>

              <TextField
              variant="outlined"
              size="small"
                label="Max"
                value={values.max}
                onChange={handleChange}
                name="max"
                id="max-price"
                InputProps={{
                  inputComponent: NumberFormatCustom,
                }}
              />
            </div>
            <div className="popover-confirm">
              <Button color="secondary" onClick={handleClose}>Cancel</Button>
              <Button className="confirm-btn" variant="contained" color="primary" disableElevation onClick={handlePrice}>
                Confirm
              </Button>
            </div>
          </div>
        </Popover>
        <Popover
          id="room-selector"
          open={target === 'room-selector'}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <div className="selector-popover" id="room-selector-popover">

            <div className="selector-title">
              Room Type
                </div>
            <div className="selector-field">

            <form className="room-form">
            
            <FormControl style={{marginBottom: '2rem'}}>
              <InputLabel id="demo-dialog-select-label">bedroom</InputLabel>
              <Select
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                value={values.bed}
                name='bed'
                onChange={handleChange}
                input={<Input />}
              >
                <MenuItem value={0}>
                  <em>Any</em>
                </MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5+</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="demo-dialog-select-label">bathroom</InputLabel>
              <Select
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                value={values.bath}
                name='bath'
                onChange={handleChange}
                input={<Input />}
              >
                <MenuItem value={0}>
                  <em>Any</em>
                </MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5+</MenuItem>
              </Select>
            </FormControl>
          </form>
            </div>
            <div className="popover-confirm">
              <Button color="secondary" onClick={handleClose}>Cancel</Button>
              <Button className="confirm-btn" variant="contained" color="primary" disableElevation onClick={handleRoom}>
                Confirm
              </Button>
            </div>
          </div>
        </Popover>
        
      </div>
    </Fragment>
  );

}

export default SearchFilter


