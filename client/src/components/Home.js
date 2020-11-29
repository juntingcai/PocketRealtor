import React, { Fragment, useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import LocationOnOutlinedIcon from "@material-ui/icons/LocationOnOutlined";
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popover from '@material-ui/core/Popover';
import "../css/Home.css";

import PlacesAutocomplete from "react-places-autocomplete";

const Home = (props) => {
  const [address, setAddress] = useState("");

  const [type, setType] = useState({
    text: "All",
    id: 0,
  });
  const handleSelect = (address) => {
    props.history.push({
      pathname: "/list",

      state: {
        address: address,
        type: type.id
      },
    });
  };

  // const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    handleSelect(address);
  };
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleSelectType = (event) => {
    console.log(event.target.id,event.target.value)
    setType({
      text: event.target.id,
      id: event.target.value
    })
    handleClose();
  }

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };
  return (
    <Fragment>
      <div className="home-wrap">
        <div className="home-shadow">
          <div className="home-title">Find Your New Home</div>

          {/* <input type="text"
                            placeholder="City, Neighborhood"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                        />
                        <SearchIcon fontSize="large" style={{ color: "#1634d8", position: "absolute", top: "1rem", right: "2rem", fontWeight: "900" }} /> */}
          <PlacesAutocomplete
            value={address}
            minLength={3}
            onChange={setAddress}
            onSelect={handleSelect}
            highlightFirstSuggestion={true}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
                <form className="search-box" onSubmit={handleSubmit}>
                  
                  <div className="input-box">
                  <div className="search-type">
                      <div aria-describedby="search-type-popover" className="search-type-btn" onClick={handleOpen}>
                        {type.text}
                      </div>
                      <Popover
                        id="search-type-popover"
                        open={open}
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
                        <div className="pop-title">
                          Price type
                        </div>
                        <MenuList>
                          <MenuItem value={0} id="All" onClick={handleSelectType}>All Type</MenuItem>
                          <MenuItem value={1} id="Sale" onClick={handleSelectType}>For Sale</MenuItem>
                          <MenuItem value={2} id="Rent" onClick={handleSelectType}>For Rent</MenuItem>
                        </MenuList>
                      </Popover>
                    </div>
                    <input
                      {...getInputProps({
                        placeholder: "City, Neighborhood, or ZIP code",
                        className: "location-search-input",
                      })}
                    />
                    <SearchIcon
                      onClick={handleSubmit}
                      fontSize="large"
                      style={{ color: "#1634d8", fontWeight: "900", cursor: "pointer"}}
                    />
                  </div>

                  {suggestions.length > 0 && (
                    <div className="autocomplete-dropdown-container">
                      {suggestions.length !== 0 && (
                        <div className="divider"></div>
                      )}


                      {suggestions.map((suggestion, index) => {
                        // console.log(suggestion);
                        suggestion.id = index;
                        const className = suggestion.active
                          ? "suggestion-item--active"
                          : "suggestion-item";
                        // inline style for demonstration purpose
                        const style = suggestion.active
                          ? {
                            backgroundColor: "#1634d8",
                            color: "#fff",
                            cursor: "pointer",
                          }
                          : { backgroundColor: "#ffffff", cursor: "pointer" };

                        return (
                          <div
                            id={index}
                            {...getSuggestionItemProps(suggestion, {
                              className,
                              style,
                            })}
                          >
                            <LocationOnOutlinedIcon
                              style={{ marginRight: "1rem" }}
                            />
                            <span>{suggestion.description}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </form>
              )}
          </PlacesAutocomplete>
        </div>
      </div>
    </Fragment>
  );
};

export default withRouter(Home);
