import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Button from '@material-ui/core/Button';

import faker from "faker"
import Axios from "axios"

import {URL} from "../../utils/constants"

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  title: {
    color: "white",
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
}));



/**
 * The example data is structured as follows:
 *
 * import image from 'path/to/image.jpg';
 * [etc...]
 *
 * const tileData = [
 *   {
 *     img: image,
 *     title: 'Image',
 *     author: 'author',
 *   },
 *   {
 *     [etc...]
 *   },
 * ];
 */
export default function SuggestedGroupsGridList(props) {
  const classes = useStyles();
  console.log(localStorage.token)

  const joinGroup = async (groupId) => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.token.token
          },
        };
          const body = {}
          const url = `https://pocketxrealtor.ddns.net/tenant/group/apply/${groupId}`
          const res = await Axios.post(url,
          body,
          config
        );
        console.log(`res:`)
        console.log(res)
      } catch (error) {
        console.log(`groupId = ${groupId}`)
        console.log(error.message);
      }
  };

  const onButtonClickApply = async (groupId) => {
    try {
      // const config = {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // };
      // const data = {}
      // console.log(`${URL}/tenant/group/apply/${groupId}`)
      // const res = await axios.post(
      //   `http://54.183.129.84:80/tenant/group/apply/${groupId}`,
      //   config
      // );

      // //////
      joinGroup(groupId)
      // /////
      // try {
      //   const config = {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   };
      //     const body = {}
      //     const res = await Axios.post(`https://pocketxrealtor.ddns.net/tenant/group/apply/${groupId}`,
      //     body,
      //     config
      //   );
      //   console.log(`res: ${res}`)
      // } catch (error) {
      //   console.log(`groupId = ${groupId}`)
      //   console.log(error.message);
      // }
    } catch (error) {
      console.log(`https://pocketxrealtor.ddns.net/tenant/group/apply/${groupId}`)
      console.log(error)
    }
}

  return (
    <div className={classes.root}>
      <GridList className={classes.gridList} cols={2.5}>
        {props.tileData.map((tile) => (
          <GridListTile key={tile.id}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Color_icon_blue.svg/1200px-Color_icon_blue.svg.png" alt={tile.name} />
            <GridListTileBar
              title={tile.name}
              classes={{
                root: classes.titleBar,
                title: classes.title,
              }}
              actionIcon={
                <Button size="tiny" variant="contained" onClick={() => onButtonClickApply(tile.id)} color="secondary">Apply</Button>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}