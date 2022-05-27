import React, { useState, useEffect, useRef } from "react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Grid, Container, Box, Tooltip, Fab, Fade } from "@mui/material/";
import HelpIcon from "@mui/icons-material/Help";
import TextField from "@mui/material/TextField";
import PhotoGallery from "./components/PhotoGallery";
import GalleryFilter from "./components/GalleryFilter";
import DateSummary from "./components/DateSummary";
import SolPicker from "./components/SolPicker";
import HomeScreen from "./components/HomeScreen";
import ScrollToTop from "./components/ScrollToTop";
import moment from "moment";
import "./css/App.css";

function App() {
  // MUI custom palette set up
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
      primary: {
        main: "#519591",
      },
      secondary: {
        main: "#334756",
      },
      focus: {
        main: "#519591",
      },
      info: {
        main: "#dd7e7e",
      },
      background: {
        paper: "#101824",
        default: "#101824",
      },
      action: {
        active: "#334756",
        hover: "#5195914f",
        hoverOpacity: "0.2",
        selected: "#db6d35",
        selectedOpacity: ".16",
        disabled: "rgb(82 82 82)",
        disabledBackground: "rgb(63 63 63 / 63%)",
        focus: "#db6d35",
        focusOpacity: "0",
      },
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
  const [numberOfFilteredPhotos, setNumberOfFilteredPhotos] = useState();
  // ↓ Photos filtered by selected activeCamera
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  // ↓ Photo selected by onClick
  const [selectedImage, setSelectedImage] = useState(null);

  // ↓ API URLs
  const apiManifestUrl =
    "https://mars-photos.herokuapp.com/api/v1/manifests/perseverance/";

  const apiDateBase =
    "https://mars-photos.herokuapp.com/api/v1/rovers/perseverance/photos?earth_date=";

  const apiSolBase =
    "https://mars-photos.herokuapp.com/api/v1/rovers/perseverance/photos?sol=";

  // Fetches all photos by given Earth date
  const getPhotosByDate = async (date) => {
    setImagesPerPage(25);
    if (isManifestReadyDate.current === true) {
      if (date) {
        const response = await (await fetch(apiDateBase + date)).json();
        setFetchedPhotos(response.photos);
        setFilteredPhotos(response.photos);
        setNumberOfFilteredPhotos(response.photos.length);
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
    if (activeCamera === 0) {
      setCurrentImages(fetchedPhotos.slice(0, imagesPerPage));
      setCurrentFilteredImages(fetchedPhotos.slice(0, imagesPerPage));
    } else {
      setCurrentFilteredImages(currentFilteredImages.slice(0, imagesPerPage));
    }
  }, [imagesPerPage, fetchedPhotos]);

  //Infinite Scroll loading for gallery
  const [loadMore, handleLoadMore] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", calcLoadMore);
    if (loadMore) {
      setImagesPerPage(imagesPerPage + 25);
    }
  }, [loadMore]);

  const calcLoadMore = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 200
    ) {
      handleLoadMore(true);
    } else {
      handleLoadMore(false);
    }
    return () => window.removeEventListener("scroll", calcLoadMore);
  };

  //The MUI Datepicker takes function that retures true or false to disable any dates
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
              color: "secondary",
              fontSize: ".85rem",
              paddingLeft: 2,
              paddingRight: 2,
              m: 1,
              borderBottom: 1,
              borderColor: "secondary",
              maxWidth: 40 / 100,
              alignmentBaseline: "bottom",
            }}
          >
            <p className="search__intro">
              Search by Earth Date or <em>Sol</em>
              <Tooltip
                title="A Sol is one solar day on Mars. Sol 0 is the first day for Perseverance on Mars."
                color="info"
              >
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
              currentImages={currentImages}
              setCurrentFilteredImages={setCurrentFilteredImages}
              activeCamera={activeCamera}
              setActiveCamera={setActiveCamera}
              setActiveCameraName={setActiveCameraName}
              setImagesPerPage={setImagesPerPage}
              fetchedPhotos={fetchedPhotos}
              numberOfFilteredPhotos={numberOfFilteredPhotos}
              setNumberOfFilteredPhotos={setNumberOfFilteredPhotos}
            />
          </Grid>
        </Grid>
        <DateSummary
          fetchedPhotos={fetchedPhotos}
          filteredPhotos={filteredPhotos}
          activeCamera={activeCamera}
          activeCameraName={activeCameraName}
          numberOfFilteredPhotos={numberOfFilteredPhotos}
        />
        <PhotoGallery
          currentFilteredImages={currentFilteredImages}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          fetchedPhotos={fetchedPhotos}
          numberOfFilteredPhotos={numberOfFilteredPhotos}
        />

        <ScrollToTop />
      </ThemeProvider>
    </div>
  );
}

export default App;
