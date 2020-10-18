import React, { Fragment, useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import '../home.css';

import PlacesAutocomplete from 'react-places-autocomplete';


const SearchInput = (props) => {
    const [address, setAddress] = useState("");

    const [showSuggestion, setShowSuggestion] = useState(false);

    // const [inputValue, setInputValue] = useState("");
    const handleSelect = address => {
        setAddress(address);
        props.onSelectAddr(address)
        
    };
    
    return (
        <Fragment>

            <PlacesAutocomplete
                value={address}

                onChange={setAddress}
                onSelect={handleSelect}
                highlightFirstSuggestion={true}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <form className="search-box">
                        <div className="input-box">
                            <input
                                onFocusCapture={() => { setShowSuggestion(true) }}
                                onBlurCapture={() => { setShowSuggestion(false); console.log(showSuggestion) }}
                                {...getInputProps({
                                    placeholder: 'City, Neigbherhood, or ZIP code',
                                    className: 'location-search-input',
                                })}
                            />
                            <SearchIcon fontSize="large" style={{ color: "#1634d8", fontWeight: "900" }} />
                        </div>
                        {showSuggestion && <div className="autocomplete-dropdown-container">
                            {/* {loading && <div>Loading...</div>} */}
                            {suggestions.map((suggestion, index) => {
                                const className = suggestion.active
                                    ? 'suggestion-item--active'
                                    : 'suggestion-item';
                                // inline style for demonstration purpose
                                const style = suggestion.active
                                    ? { backgroundColor: '#1634d8', color: '#fff', cursor: 'pointer' }
                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                return (
                                    <div
                                        key={index}
                                        {...getSuggestionItemProps(suggestion, {
                                            className,
                                            style,
                                        })}
                                    >
                                        {props.data.home && <LocationOnOutlinedIcon style={{ marginRight: '1rem' }} />}<span>{suggestion.description}</span>
                                    </div>
                                );
                            })}
                        </div>}
                    </form>
                )}
            </PlacesAutocomplete>


        </Fragment>
    )
}

export default SearchInput