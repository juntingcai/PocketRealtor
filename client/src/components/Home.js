import React, { Fragment, useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import '../home.css';

import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';



const Home = (props) => {
    const [address, setAddress] = useState("");

    const [inputAddr, setInputAddr] = useState("");

    const [showSuggestion, setShowSuggestion] = useState(false);

    const handleSelect = address => {
        
        props.history.push({
            pathname: '/list',

            state: {
                address: address,
            }
        });
                
    };

    // const [inputValue, setInputValue] = useState("");

    const handleSubmit = e => {

        e.preventDefault();
        var lat = 0, lng = 0;
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                lat = latLng.lat;
                lng = latLng.lng;

            })
            .catch(error => console.error('Error', error))
            .finally(() => {
                    props.history.push({
                        pathname: '/list',

                        state: {
                            address: {
                                addr: address,
                                lat: lat,
                                lng: lng,
                            }
                        }
                    });
                }
            )
    }
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
                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                
                                <form className="search-box" onSubmit={handleSubmit}>
                                    <div className="input-box">
                                    <input
                                        onFocusCapture={() => {setShowSuggestion(true)}}
                                        onBlurCapture={() => {setShowSuggestion(false); console.log(showSuggestion)}}
                                        {...getInputProps({
                                            placeholder: 'City, Neigbherhood, or ZIP code',
                                            className: 'location-search-input',
                                        })}
                                    />
                                    <SearchIcon fontSize="large" style={{ color: "#1634d8", fontWeight: "900" }} />
                                    </div>
                                
                                    {showSuggestion && <div className="autocomplete-dropdown-container">
                                        {suggestions.length !== 0 && <div className="divider"></div>}
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
                                                    id={index}
                                                    {...getSuggestionItemProps(suggestion, {
                                                        className,
                                                        style,
                                                    })}
                                                >
                                                    <LocationOnOutlinedIcon style={{marginRight: '1rem' }}/><span>{suggestion.description}</span>
                                                </div>
                                            );
                                        })}
                                    </div>}
                                </form>
                            )}
                        </PlacesAutocomplete>
                    
                </div>
            </div>
        </Fragment>
    )
}

export default Home