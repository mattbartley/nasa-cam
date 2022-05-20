import React, { useState, useEffect, useRef } from "react";
import "./css/App.css";
import { motion, AnimatePresence } from "framer-motion";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import PhotoGallery from "./components/PhotoGallery";
import GalleryFilter from "./components/GalleryFilter";
import DateSummary from "./components/DateSummary";
import SolPicker from "./components/SolPicker";
import HomeScreen from "./components/HomeScreen";
import moment from "moment";

function App() {
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

  // Fetches all photos by given Earth date
  // ?? Move to component ??
  const getPhotosByDate = async (date) => {
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

  //Handle Clicked Image - gets the selected image object from img onClick inside PhotoGallery component
  useEffect(() => {
    if (selectedImage.length > 0) {
      console.log(selectedImage[0].img_src + " - ID: " + selectedImage[1]);
    }
  }, [selectedImage]);

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

  //Datepicker takes function that retures true or false to disable any dates
  //If it's not in the manifestDates, return true to disable it
  const getDisabledDates = (date) => {
    return !manifestDates.includes(date.toISOString().split("T")[0]);
  };

  return (
    <div className="app">
      <HomeScreen />
      <SolPicker
        fetchedPhotos={fetchedPhotos}
        solPicked={solPicked}
        setSolPicked={setSolPicked}
      />
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          value={fetchedPhotos != "" ? fetchedPhotos[0].earth_date : datePicked}
          onChange={(newDate) => {
            setDatePicked(moment(newDate).format("YYYY-MM-DD"));
          }}
          renderInput={(params) => <TextField {...params} />}
          disableFuture={true}
          shouldDisableDate={getDisabledDates}
        />
      </LocalizationProvider>
      <GalleryFilter
        images={fetchedPhotos}
        setFilteredPhotos={setFilteredPhotos}
        activeCamera={activeCamera}
        setActiveCamera={setActiveCamera}
        setActiveCameraName={setActiveCameraName}
      />
      <DateSummary
        fetchedPhotos={fetchedPhotos}
        filteredPhotos={filteredPhotos}
        activeCamera={activeCamera}
        activeCameraName={activeCameraName}
      />
      <motion.div layout className="photo__gallery__container">
        <AnimatePresence>
          {filteredPhotos.map((image, i) => {
            return (
              <PhotoGallery
                image={image}
                key={image.id}
                index={i}
                setSelectedImage={setSelectedImage}
              />
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default App;
