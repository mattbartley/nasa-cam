import React, { useState, useEffect, useRef } from "react";
import "./css/App.css";
import { motion, AnimatePresence } from "framer-motion";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Grid, Container, Box, Tooltip } from "@mui/material/";
import HelpIcon from "@mui/icons-material/Help";
import TextField from "@mui/material/TextField";
import PhotoGallery from "./components/PhotoGallery";
import GalleryFilter from "./components/GalleryFilter";
import DateSummary from "./components/DateSummary";
import SolPicker from "./components/SolPicker";
import HomeScreen from "./components/HomeScreen";

import moment from "moment";

function App() {
  const darkTheme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
    palette: {
      mode: "dark",
    },
    typography: {
      fontFamily: [
        "Jura",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
      ].join(","),
    },
    primary: {
      color: "#5ccfc4",
    },
    focused: {
      color: "#5ccfc4",
    },
  });
  // Refs to prevent redundant API fetches on first load
  const isManifestLoaded = useRef(false);
  const isManifestReadyDate = useRef(false);
  const isManifestReadySol = useRef(false);

  // ↓ Data from manifest api
  const [manifestData, setManifestData] = useState("");
  const [manifestDates, setManifestDates] = useState([]);
  // ↓ Photos fetched from getPhotosByDate() or getPhotosBySol()
  const [fetchedPhotos, setFetchedPhotos] = useState([]);
  // ↓  Date or Sol Picked by user
  const [datePicked, setDatePicked] = useState("");
  const [solPicked, setSolPicked] = useState("");
  // ↓ Currently selected camera filter for photo gallery - 0 state returns all - real cameras have unique ids
  const [activeCamera, setActiveCamera] = useState(0);
  const [activeCameraName, setActiveCameraName] = useState("");
  // ↓ Photos filtered by selected activeCamera
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  // ↓ Photo selected by onClick
  const [selectedImage, setSelectedImage] = useState([]);

  // ↓ API URLs
  const apiManifestUrl =
    "https://mars-photos.herokuapp.com/api/v1/manifests/perseverance/";

  const apiDateBase =
    "https://mars-photos.herokuapp.com/api/v1/rovers/perseverance/photos?earth_date=";

  const apiSolBase =
    "https://mars-photos.herokuapp.com/api/v1/rovers/perseverance/photos?sol=";

  const lightboxContainer = useRef(null);

  // Fetches all photos by given Earth date
  // ?? Move to component ??
  const getPhotosByDate = async (date) => {
    setImagesPerPage(25);
    if (isManifestReadyDate.current === true) {
      if (date) {
        const response = await (await fetch(apiDateBase + date)).json();
        setFetchedPhotos(response.photos);
        setFilteredPhotos(response.photos);
        return response;
      }
      if (!date) {
        console.log("Loading..Waiting for date from manifest");
      }
    } else {
      isManifestReadyDate.current = true;
    }
  };

  // Fetches all photos by given Sol
  // ?? Move to component ??
  const getPhotosBySol = async (sol) => {
    setImagesPerPage(25);
    if (isManifestReadySol.current === true) {
      if (sol) {
        const response = await (await fetch(apiSolBase + sol)).json();
        setFetchedPhotos(response.photos);
        setFilteredPhotos(response.photos);
        return response;
      }
      if (!sol) {
        console.log("Loading..Waiting for Sol from manifest");
      }
    } else {
      isManifestReadySol.current = true;
    }
  };

  // 1. - Fetches mission manifest to get latest date photos were provided
  // 2. - Uses that date to call getPhotosByDate(date) to display the most recent images
  // 3. - Uses date for setDatePicked(date) to update the Datepicker placeholder
  // ?? Move to component ??

  useEffect(() => {
    if (isManifestLoaded.current === false) {
      fetch(apiManifestUrl)
        .then((response) => response.json())
        .then((response) => {
          setDatePicked(response.photo_manifest.max_date);
          setManifestData(response.photo_manifest);
          isManifestLoaded.current = true;
          return response.photo_manifest;
        });
    }
  }, []);

  useEffect(() => {
    getPhotosByDate(datePicked);
  }, [datePicked]);

  useEffect(() => {
    getPhotosBySol(solPicked);
  }, [solPicked]);

  //Get all earth dates from manifest that had photos to use for datepicker
  useEffect(() => {
    if (isManifestLoaded.current === true) {
      setManifestDates(
        Object.values(manifestData.photos).map((item) => {
          return item.earth_date;
        })
      );
    } else console.log("manifest loaded: " + isManifestLoaded.current);
  }, [manifestData]);

  //Load 25 images at a time
  const [imagesPerPage, setImagesPerPage] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentFilteredImages, setCurrentFilteredImages] = useState([]);

  useEffect(() => {
    setCurrentImages(fetchedPhotos.slice(0, imagesPerPage));
    setCurrentFilteredImages(fetchedPhotos.slice(0, imagesPerPage));
    console.log("App currentimages: " + currentImages.length);
    console.log("App filteredimages: " + currentFilteredImages.length);
  }, [imagesPerPage, fetchedPhotos]);

  const handleLoadMore = () => {
    setImagesPerPage(imagesPerPage + 25);
    return;
  };

  //Datepicker takes function that retures true or false to disable any dates
  //If it's not in the manifestDates, return true to disable it
  const getDisabledDates = (date) => {
    return !manifestDates.includes(date.toISOString().split("T")[0]);
  };

  return (
    <div className="app">
      <ThemeProvider theme={darkTheme}>
        <HomeScreen />
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              color: "#ccc",
              fontSize: ".85rem",
              paddingLeft: 2,
              paddingRight: 2,
              m: 1,
              borderBottom: 1,
              borderColor: "rgba(255, 355, 255, 0.23)",
              maxWidth: 40 / 100,
              alignmentBaseline: "bottom",
            }}
          >
            <p className="search__intro">
              Search by Earth Date or <em>Sol</em>
              <Tooltip title="A Sol is one solar day on Mars. Sol 0 is the first day for Perseverance on Mars.">
                <HelpIcon
                  sx={{ fontSize: "1rem", textAlign: "right", marginLeft: 1 }}
                />
              </Tooltip>
            </p>
          </Box>
        </Container>

        <Grid
          container
          id="query__section"
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ paddingBottom: 2, paddingTop: 1 }}
        >
          <Grid item xs="auto">
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                sx={{ m: 0 }}
                value={
                  fetchedPhotos != "" ? fetchedPhotos[0].earth_date : datePicked
                }
                onChange={(newDate) => {
                  setDatePicked(moment(newDate).format("YYYY-MM-DD"));
                }}
                renderInput={(params) => <TextField {...params} />}
                disableFuture={true}
                shouldDisableDate={getDisabledDates}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs="auto">
            <SolPicker
              fetchedPhotos={fetchedPhotos}
              solPicked={solPicked}
              setSolPicked={setSolPicked}
            />
          </Grid>

          <Grid item xs="auto">
            <GalleryFilter
              images={currentImages}
              setCurrentFilteredImages={setCurrentFilteredImages}
              activeCamera={activeCamera}
              setActiveCamera={setActiveCamera}
              setActiveCameraName={setActiveCameraName}
            />
          </Grid>
        </Grid>
        <DateSummary
          fetchedPhotos={fetchedPhotos}
          filteredPhotos={filteredPhotos}
          activeCamera={activeCamera}
          activeCameraName={activeCameraName}
        />
        <motion.div layout className="photo__gallery__container">
          <AnimatePresence>
            {currentFilteredImages.map((image, index) => {
              return (
                <PhotoGallery
                  image={image}
                  key={image.id}
                  index={index}
                  filteredPhotos={filteredPhotos}
                  imagesPerPage={imagesPerPage}
                  setImagesPerPage={setImagesPerPage}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>
      </ThemeProvider>
      <button
        onClick={handleLoadMore}
        disabled={imagesPerPage >= fetchedPhotos.length ? "disabled" : ""}
      >
        Load More
      </button>
    </div>
  );
}

export default App;
