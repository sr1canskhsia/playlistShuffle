import React, { useEffect } from "react";
import { connect } from "react-redux";
import MersenneTwister from "mersenne-twister";
import {
  Card as CardChakra,
  Flex,
  Image,
  UnorderedList,
  Box,
  Heading,
  Text,
} from "@chakra-ui/react";
const Card = ({
  songs,
  addSongs,
  player,
  previousSong,
  currentSong,
  nextSong,
}) => {
  const refs = songs.reduce((acc, value) => {
    acc[value.snippet.resourceId.videoId] = React.createRef();
    return acc;
  }, {});

  useEffect(() => {
    refs[player.currentSong].current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [player.currentSong]);

  useEffect(() => {
    shuffleisActive();
  }, [player.isShuffleActive]);

  const shuffleisActive = () => {
    if (player.isShuffleActive === true) {
      const generator = new MersenneTwister();
      let shuffleArr = [];
      shuffleArr.push(...songs);

      for (let i = shuffleArr.length - 1; i > 0; i--) {
        const j = Math.floor(generator.random() * (i + 1));
        [shuffleArr[i], shuffleArr[j]] = [shuffleArr[j], shuffleArr[i]];
      }
      addSongs(shuffleArr);

      currentSong(shuffleArr[0].snippet.resourceId.videoId);
      nextSong(shuffleArr[1].snippet.resourceId.videoId);
    } else {
      let unShuffleArr = [];
      unShuffleArr.push(...songs);
      unShuffleArr.sort(function (a, b) {
        return a.snippet.position - b.snippet.position;
      });
      addSongs(unShuffleArr);
      currentSong(unShuffleArr[0].snippet.resourceId.videoId);
      nextSong(unShuffleArr[1].snippet.resourceId.videoId);
    }
  };

  const handleClick = (id) => {
    const currIndex = songs.findIndex((ele) => {
      return ele.snippet?.resourceId.videoId === id;
    });
    previousSong(songs[currIndex - 1]?.snippet.resourceId.videoId);
    currentSong(songs[currIndex]?.snippet.resourceId.videoId);
    nextSong(songs[currIndex + 1]?.snippet.resourceId.videoId);
  };

  const song = songs?.map((ele) =>
    ele.snippet.title !== "Private video" &&
    ele.snippet.title !== "Deleted video" ? (
      <CardChakra
        borderRadius="lg"
        w={["95%", "90%"]}
        cursor={"pointer"}
        title={ele.snippet.title}
        m={"2"}
        ref={refs[ele.snippet.resourceId.videoId]}
        id={`${ele.snippet.resourceId.videoId}`}
        onClick={() => handleClick(ele.snippet.resourceId.videoId)}
        key={ele.snippet.resourceId.videoId + ele.snippet.title}
      >
        <CardChakra
          borderRadius="lg"
          bg={
            player.currentSong === ele.snippet.resourceId.videoId
              ? "var(--chakra-colors-red-600)"
              : null
          }
          color={
            player.currentSong === ele.snippet.resourceId.videoId ? "white" : ""
          }
          _hover={{
            background: "var(--chakra-colors-red-600)",
            color: "white",
          }}
        >
          <Flex>
            <Image
              borderRadius="lg"
              src={ele.snippet.thumbnails.default?.url}
              alt="song image"
              boxSize={["40px", "40px", "65px"]}
              objectFit="none"
            />
            <Box ml={"1"} className="cardText">
              <Heading size={["xs", "xs", "md", "md"]}>
                <Text noOfLines={[1, 1, 2, 2]}>{ele.snippet.title}</Text>
              </Heading>

              <Text noOfLines={"1"} className="cardArtist">
                {" "}
                {ele.snippet.videoOwnerChannelTitle}
              </Text>
            </Box>
          </Flex>
        </CardChakra>
      </CardChakra>
    ) : null
  );
  return (
    <Box
      mt={["0", "10", "10", "0"]}
      overflowY={"scroll"}
      h={"inherit"}
      className="cardContainer"
    >
      <UnorderedList
        h={"100%"}
        pt={"1"}
        w={["95%", "95%", "95%", null, "100%"]}
        margin={["0 auto", "0 auto", "0 auto", null]}
        className="ulListCards"
      >
        {song}
      </UnorderedList>
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    addSongs: (payload) => dispatch({ type: "songs/addSongs", payload }),
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Card);