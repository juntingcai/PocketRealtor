import React, { Fragment, useState } from "react";
import LocationOnOutlinedIcon from "@material-ui/icons/LocationOnOutlined";
import "../css/PlaceInput.css";
import PlacesAutocomplete from "react-places-autocomplete";

const PlaceInput = (props) => {

    const [showSuggestion, setShowSuggestion] = useState(false);
  
    // const [inputValue, setInputValue] = useState("");
    const handleSelect = (address) => {
      props.setValue(address);
    };
  
    return (
      <Fragment>
        <PlacesAutocomplete
          value={props.value}
          onChange={props.setValue}
          onSelect={handleSelect}
          highlightFirstSuggestion={true}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <form className="place-auto-complete">
              
              <input
                onFocusCapture={() => {
                  setShowSuggestion(true);
                }}
                onBlurCapture={() => {
                  setShowSuggestion(false);
                  console.log(showSuggestion);
                }}
                {...getInputProps({
                  placeholder: "Enter City or Neighborhood",
                  className: "search-input",
                })}
              />
              
            
              {suggestions.length > 0 && (
                <div className="autocomplete-dropdown-container">
                  {/* {loading && <div>Loading...</div>} */}
                  {suggestions.map((suggestion, index) => {
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
                        key={index}
                        {...getSuggestionItemProps(suggestion, {
                          className,
                          style,
                        })}
                      >
                        
                        <span>{suggestion.description}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </form>
          )}
        </PlacesAutocomplete>
      </Fragment>
    );
};

export default PlaceInput