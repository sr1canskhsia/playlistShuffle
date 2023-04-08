import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { AspectRatio } from "@chakra-ui/react";
import ReactPlayer from "react-player/youtube";

const Player = ({
  player,
  isPlaying,
  previousSong,
  currentSong,
  nextSong,
  playlistSongsById,
}) => {
  const playerRef = useRef(null);

  useEffect(() => {
    const player = playerRef.current.getInternalPlayer();
    if (player) {
      console.log("STATE    ", player.getPlayerState());
    }
  });

  useEffect(() => {
    if (playlistSongsById[player.currentActivePlaylistId]) {
      currentSong(
        playlistSongsById[player.currentActivePlaylistId][0]?.snippet.resourceId
          .videoId
      );
    }
  }, []);

  const afterSongEnds = () => {
    const currIndex = playlistSongsById[
      player.currentActivePlaylistId
    ].findIndex((ele) => {
      return ele.snippet?.resourceId.videoId === player.currentSong;
    });
    if (
      currIndex <
      playlistSongsById[player.currentActivePlaylistId].length - 1
    ) {
      previousSong(
        playlistSongsById[player.currentActivePlaylistId][currIndex]?.snippet
          .resourceId.videoId
      );
      currentSong(
        playlistSongsById[player.currentActivePlaylistId][currIndex + 1]
          ?.snippet.resourceId.videoId
      );
      nextSong(
        playlistSongsById[player.currentActivePlaylistId][currIndex + 2]
          ?.snippet.resourceId.videoId
      );
    } else {
      previousSong(
        playlistSongsById[player.currentActivePlaylistId][currIndex]?.snippet
          .resourceId.videoId
      );
      currentSong(
        playlistSongsById[player.currentActivePlaylistId][currIndex + 1]
          ?.snippet.resourceId.videoId
      );
      nextSong("");
    }
  };

  const handleEnd = () => {
    if (
      playlistSongsById[player.currentActivePlaylistId].findIndex(
        (ele) => ele.snippet.resourceId.videoId === player.currentSong
      ) ===
      playlistSongsById[player.currentActivePlaylistId].length - 1
    ) {
      console.log("Playlist Ended");
      isPlaying(false);
    } else afterSongEnds();
  };
  // When some songs can't be played outside of youtube this function will trigger and playlist the next song, or if it is the last the playlist will end
  const handleError = (e) => {
    if (
      playlistSongsById[player.currentActivePlaylistId].findIndex(
        (ele) => ele.snippet.resourceId.videoId === player.currentSong
      ) ===
      playlistSongsById[player.currentActivePlaylistId].length - 1
    ) {
      console.log("Playlist Ended");
      isPlaying(false);
    } else afterSongEnds();
  };

  const handlePlay = () => {
    isPlaying(true);
  };
  const handlePause = () => {
    isPlaying(false);
  };

  const handleReady = () => {
    isPlaying(true);
  };

  return (
    <AspectRatio
      w={"100%"}
      h={["100%"]}
      passive="true"
      _before={{ pb: "0" }}
      ratio={1}
      className="player"
    >
      <ReactPlayer
        ref={playerRef}
        passive="true"
        onError={handleError}
        onPlay={() => handlePlay}
        onPause={() => handlePause}
        onReady={() => handleReady}
        onEnded={handleEnd}
        width={"100%"}
        height={"100%"}
        controls={true}
        loop={player.isLoopActive}
        playing={player.isPlaying}
        url={`https://www.youtube.com/watch?v=${player.currentSong}`}
      />
    </AspectRatio>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    isPlaying: (payload) => dispatch({ type: "player/isPlaying", payload }),
    previousSong: (payload) =>
      dispatch({ type: "player/previousSong", payload }),
    currentSong: (payload) => dispatch({ type: "player/currentSong", payload }),
    nextSong: (payload) => dispatch({ type: "player/nextSong", payload }),
  };
};

const mapStateToProps = (state) => {
  return {
    songs: state.songs,
    player: state.player,
    playlistSongsById: state.playlistSongsById,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Player);
