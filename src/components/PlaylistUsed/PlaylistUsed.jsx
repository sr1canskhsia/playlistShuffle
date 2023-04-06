import React, { useEffect } from "react";
import { connect } from "react-redux";
import { fetchData } from "../utils/fetchData";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Flex,
  Spacer,
  Image,
  Text,
  CloseButton,
  Heading,
} from "@chakra-ui/react";

const PlaylistUsed = ({
  playlistDetails,
  addSongs,
  currentSong,
  nextSong,
  deleteFromPlaylistDetails,
}) => {
  const navigate = useNavigate();
  const baseURL = import.meta.env.BASE_URL;

  const playlists = playlistDetails.map((element) => (
    <Card
      w={"100%"}
      mt={2}
      display={"flex"}
      flexDirection={"row"}
      bg="red.500"
      borderRadius={"lg"}
      cursor={"pointer"}
      m={"16 0"}
      className="playlistUsedList"
      key={element.playlistId}
      onClick={() => handleClick(element.playlistId)}
    >
      <Flex className="usedContentTextandImage">
        <Image
          borderRadius="lg"
          alt={element.playlistName}
          boxSize={["75px", "85px", "120px"]}
          objectFit="cover"
          className="imgUsedPlaylist"
          src={element.PlaylistImage}
        />
        <Heading
          size={["md", "md", "lg"]}
          noOfLines={"2"}
          className="usedPlaylistName"
        >
          <Text color={"whiteAlpha.900"} noOfLines={[2, 2]}>
            {element.playlistName}
          </Text>
        </Heading>
      </Flex>
      <Spacer />
      <CloseButton
        ml={["5px", "5px", "15px", "15px"]}
        colorScheme="whiteAlpha"
        color={"white"}
        className="playlistUsedButton"
        onClick={() => deleteFromPlaylist(element.playlistId)}
      />
    </Card>
  ));

  const handleClick = async (id) => {
    const data = await fetchData(id);
    addSongs(data.responseArrToAdd);
    currentSong(data.currentSong);
    nextSong(data.nextSong);

    navigate(`${baseURL}/playlist/${id}`);
  };

  const deleteFromPlaylist = (id) => {
    deleteFromPlaylistDetails(id);
  };

  return (
    <Flex flexDirection={"column"} className="playlistUsedContainer">
      {playlistDetails.length ? playlists : null}
    </Flex>
  );
};

const mapStateToProps = (state) => {
  return {
    songs: state.songs,
    player: state.player,
    playlistDetails: state.playlistDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addSongs: (payload) => dispatch({ type: "songs/addSongs", payload }),
    currentSong: (payload) => dispatch({ type: "player/currentSong", payload }),
    nextSong: (payload) => dispatch({ type: "player/nextSong", payload }),
    addToPlaylistDetails: (payload) =>
      dispatch({ type: "playlistDetails/addToPlaylistDetails", payload }),

    deleteFromPlaylistDetails: (payload) =>
      dispatch({ type: "playlistDetails/deleteFromPlaylistDetails", payload }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistUsed);