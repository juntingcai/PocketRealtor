// import React, { useState, useEffect, Fragment } from "react";
// import { Link } from "react-router-dom";

// import Loading from "../../utils/Loading";

// import {URL} from "../../utils/constants"
// import axios from "axios";


// import Container from "@material-ui/core/Container"
// import Button from "@material-ui/core/Button"

// import { makeStyles } from "@material-ui/core/styles";
// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
// import TableContainer from "@material-ui/core/TableContainer";
// import TableHead from "@material-ui/core/TableHead";
// import TableRow from "@material-ui/core/TableRow";
// import Paper from "@material-ui/core/Paper";
// // import Container from "@material-ui/core/Container"
// // import Button from "@material-ui/core/Button"
// // import {URL} from "../../utils/constants"
// // import axios from "axios"

// const useStyles = makeStyles({
//   table: {
//     minWidth: 650,
//   },
// });

// const CreateListing = (
// ) => {
//   const [listingsData, setListingsData] = useState([]);
//   const [loading, setLoading] = useState(false)

//   const getListings = async () => {
//     try {
//       setLoading(true)
//       const response = await axios.get(`${URL}/listing/owner/listings`);
//       const listings = response.data;
//       console.log("Response:")
//       console.log(response)
//       console.log("Listings:");
//       console.log(listings);
//       setListingsData(listings);
//       setLoading(false)
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   useEffect(() => {
//     getListings();
//   }, []);

//   const deleteListing = async (listingId) => {
//     // route:  /listing/delete/
//     try {
//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       };
//       const data = {
//       }
//       const res = await axios.delete(
//         `${URL}/listing/delete/${listingId}`,
//         data,
//         config
//       );
//       console.log("withdrawing approval of listing = ")
//       console.log(res)
  
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   const classes = useStyles();

//   return loading ? (
//     <Loading />
//   ) : (
//     <Container>
//     <Fragment>
//       {listingsData && listingsData.length > 0 ? (
        
//         <Fragment>
//           <h1>Host Portal</h1>
//           <br/>
//           {/* <Link to="/createlisting" className="btn btn-success my-1">
//             Post New Listing
//           </Link> */}
//           <Button href="/createlisting" variant="contained" color="primary">Create New Listing</Button>
//           {/* <ListingsTable
//             listings={listingsData}
//           /> */}
//     <Fragment>
//       {listingsData && listingsData.length > 0 ? (
//         <Fragment>
//           <h3>Displaying {listingsData.length} Listings </h3>
//           <TableContainer component={Paper}>
//           <Table className={classes.table} aria-label="simple table">
//             {" "}
//             <TableHead>
//             <TableRow>
//               <TableCell>Title</TableCell>
//               <TableCell>Address</TableCell>
//               <TableCell>City</TableCell>
//               <TableCell>State</TableCell>
//               <TableCell>Rent Per Room</TableCell>
//               <TableCell><Button color="primary">Edit</Button></TableCell>
//               <TableCell><Button color="secondary">Delete</Button></TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
            
//               {listingsData.map((listing) => (
//                 <TableRow key={listing.address}>
                
//                   <TableCell>{listing.title}</TableCell>
//                   <TableCell>{listing.address}</TableCell>
//                   <TableCell>{listing.city}</TableCell>
//                   <TableCell>{listing.state}</TableCell>
//                   <TableCell>${listing.rent_price}</TableCell>
//                   <TableCell><Button variant="contained" color="primary">Edit</Button></TableCell>
//                   {/* <TableCell><Button variant="contained" color="secondary">Delete</Button></TableCell> */}
//                   <TableCell><Button variant="contained" color="secondary" onClick={() => deleteListing(listing.id)}>Delete</Button></TableCell>
//                   </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//           </TableContainer>
//         </Fragment>
//       ) : (
//         <p>Displaying {listingsData.length} Listings </p>
//       )}
//     </Fragment>

//         </Fragment>
//       ) : (
//         <Fragment>
//           {/* <Link to="/createlisting" className="btn btn-success my-1">
//             Create a New Listing
//           </Link> */}
//           <br/>
//           <br/>
//           <h2></h2>
//           <Button href="/createlisting" variant="contained" color="primary">Create New Listing</Button>
//         </Fragment>
//       )}
//     </Fragment>
//     </Container>
//   );
// };
// export default CreateListing;
import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";

// import Spinner from "../layout/Spinner";
import Spinner from "../../utils/Loading"

import {URL} from "../../utils/constants"
import ListingsTable from "../listings/ListingsTable";

import axios from "axios";


import Container from "@material-ui/core/Container"
import Button from "@material-ui/core/Button"

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
// import Container from "@material-ui/core/Container"
// import Button from "@material-ui/core/Button"
// import {URL} from "../../utils/constants"
// import axios from "axios"

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const CreateListing = (
) => {
  const [listingsData, setListingsData] = useState([]);
  const [loading, setLoading] = useState(false)

  const getListings = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${URL}/listing/owner/listings`);
      const listings = response.data;
      console.log("Response:")
      console.log(response)
      console.log("Listings:");
      console.log(listings);
      setListingsData(listings);
      setLoading(false)
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getListings();
  }, []);

  const deleteListing = async (listingId) => {
    // route:  /listing/delete/
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const data = {
      }
      const res = await axios.delete(
        `${URL}/listing/delete/${listingId}`,
        data,
        config
      );
      console.log("withdrawing approval of listing = ")
      console.log(res)
  
    } catch (error) {
      console.log(error)
    }
  }

  const classes = useStyles();

  return loading ? (
    <Spinner />
  ) : (
    <Container>
    <Fragment>
      {listingsData && listingsData.length > 0 ? (
        
        <Fragment>
          <h1>Host Portal</h1>
          <br/>
          {/* <Link to="/createlisting" className="btn btn-success my-1">
            Post New Listing
          </Link> */}
          <Button href="/createlisting" variant="contained" color="primary">Create New Listing</Button>
          {/* <ListingsTable
            listings={listingsData}
          /> */}
    <Fragment>
      {listingsData && listingsData.length > 0 ? (
        <Fragment>
          <h3>Displaying {listingsData.length} Listings </h3>
          <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            {" "}
            <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Rent</TableCell>
              <TableCell><Button color="primary">Edit</Button></TableCell>
              <TableCell><Button color="secondary">Delete</Button></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            
              {listingsData.map((listing) => (
                <TableRow key={listing.address}>
                
                  <TableCell>{listing.title}</TableCell>
                  <TableCell>{listing.address}</TableCell>
                  <TableCell>{listing.city}</TableCell>
                  <TableCell>{listing.state}</TableCell>
                  <TableCell>${listing.rent_price}</TableCell>
                  <TableCell><Button variant="contained" color="primary">Edit</Button></TableCell>
                  {/* <TableCell><Button variant="contained" color="secondary">Delete</Button></TableCell> */}
                  <TableCell><Button variant="contained" color="secondary" onClick={() => deleteListing(listing.id)}>Delete</Button></TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
          </TableContainer>
        </Fragment>
      ) : (
        <p>Displaying {listingsData.length} Listings </p>
      )}
    </Fragment>

        </Fragment>
      ) : (
        <Fragment>
          {/* <Link to="/createlisting" className="btn btn-success my-1">
            Create a New Listing
          </Link> */}
          <br/>
          <br/>
          <h2></h2>
          <Button href="/createlisting" variant="contained" color="primary">Create New Listing</Button>
        </Fragment>
      )}
    </Fragment>
    </Container>
  );
};
export default CreateListing;
