/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
// MUI components
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CalendarPickerSkeleton } from '@mui/x-date-pickers/CalendarPickerSkeleton';
import { ThemeProvider } from '@mui/material/styles';
import { Grid, Container, Box, Tooltip } from '@mui/material/';
import HelpIcon from '@mui/icons-material/Help';
import TextField from '@mui/material/TextField';
import DarkTheme from './utils/Pallete';

// Custom components
import PhotoGallery from './components/PhotoGallery';
import GalleryFilter from './components/GalleryFilter';
import DateSummary from './components/DateSummary';
import SolPicker from './components/SolPicker';
import HomeScreen from './components/HomeScreen';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import moment from 'moment';
import Stats from './components/Stats';

import './css/App.css';

function App() {
  // Refs to prevent redundant API fetches on first load
  const isManifestLoaded = useRef(false);
  const isManifestReadyDate = useRef(false);
  const isManifestReadySol = useRef(false);

  // Data from manifest api
  const [manifestData, setManifestData] = useState('');
  // Earth dates (YYYY-MM-DD) known to have photos, accumulated per visited month
  // from the activity endpoint. Drives which days the DatePicker enables.
  const [activeDates, setActiveDates] = useState(() => new Set());
  // Months (YYYY-MM) already fetched, so navigation doesn't refetch.
  const loadedMonths = useRef(new Set());
  // True while the currently-viewed month's activity is loading.
  const [calendarLoading, setCalendarLoading] = useState(false);
  // Photos fetched from getPhotosByDate() or getPhotosBySol()
  const [fetchedPhotos, setFetchedPhotos] = useState([]);
  //  Date or Sol Picked by user
  const [datePicked, setDatePicked] = useState('');
  const [solPicked, setSolPicked] = useState('');
  // Currently selected camera filter for photo gallery - 0 state returns all - real cameras have unique ids
  const [activeCamera, setActiveCamera] = useState(0);
  const [activeCameraName, setActiveCameraName] = useState('');
  const [numberOfFilteredPhotos, setNumberOfFilteredPhotos] = useState();
  // Photos filtered by selected activeCamera
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  // Photo selected by onClick
  const [selectedImage, setSelectedImage] = useState(null);

  // Base URL for the perseverance-api. Empty = same origin (the Vercel
  // functions); set REACT_APP_API_BASE to the deployed Worker URL, or
  // http://localhost:8787 when running the API locally via `wrangler dev`, to
  // serve every endpoint from the standalone API.
  const apiBase = process.env.REACT_APP_API_BASE || '';

  const apiManifestUrl = `${apiBase}/api/v1/manifests/perseverance`;
  const apiDateBase = `${apiBase}/api/v1/rovers/perseverance/photos?earth_date=`;
  const apiSolBase = `${apiBase}/api/v1/rovers/perseverance/photos?sol=`;
  const apiActivityBase = `${apiBase}/api/v1/rovers/perseverance/activity`;

  // Fetch JSON with a clear error when the endpoint is unreachable or returns
  // HTML (e.g. an SPA 404 fallback) instead of JSON — avoids the cryptic
  // "Unexpected token '<'" crash and lets callers handle failures gracefully.
  const fetchJson = async (url) => {
    const res = await fetch(url);
    const type = res.headers.get('content-type') || '';
    if (!res.ok || !type.includes('application/json')) {
      throw new Error(
        `Expected JSON from ${url} but got ${res.status} (${type || 'no content-type'})`
      );
    }
    return res.json();
  };

  // Fetches all photos by given Earth date
  const getPhotosByDate = async (date) => {
    setImagesPerPage(25);
    if (isManifestReadyDate.current === true) {
      if (date) {
        try {
          const response = await fetchJson(apiDateBase + date);
          setFetchedPhotos(response.photos);
          setFilteredPhotos(response.photos);
          setNumberOfFilteredPhotos(response.photos.length);
          setActiveCamera(0);
          return response;
        } catch (e) {
          console.error('Failed to load photos by date', date, e);
        }
      }
      if (!date) {
        console.log('Loading..Waiting for date from manifest');
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
        try {
          const response = await fetchJson(apiSolBase + sol);
          setFetchedPhotos(response.photos);
          setFilteredPhotos(response.photos);
          setActiveCamera(0);
          return response;
        } catch (e) {
          console.error('Failed to load photos by sol', sol, e);
        }
      }
      if (!sol) {
        console.log('Loading..Waiting for Sol from manifest');
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
      fetchJson(apiManifestUrl)
        .then((response) => {
          setDatePicked(response.photo_manifest.max_date);
          setManifestData(response.photo_manifest);
          isManifestLoaded.current = true;
        })
        .catch((e) => console.error('Failed to load manifest', e));
    }
  }, []);

  useEffect(() => {
    getPhotosByDate(datePicked);
  }, [datePicked]);

  useEffect(() => {
    getPhotosBySol(solPicked);
  }, [solPicked]);

  // Fetch which days have photos for the month containing `monthMoment`, from
  // the activity endpoint. Cached per month so navigation stays cheap and the
  // launch payload stays small — only the visited month is ever fetched.
  const fetchActivityForMonth = async (monthMoment) => {
    const m = moment(monthMoment);
    if (!m.isValid()) return;
    const key = m.format('YYYY-MM');
    if (loadedMonths.current.has(key)) return;
    loadedMonths.current.add(key);

    const from = m.clone().startOf('month').format('YYYY-MM-DD');
    const to = m.clone().endOf('month').format('YYYY-MM-DD');
    setCalendarLoading(true);
    try {
      const data = await fetchJson(`${apiActivityBase}?from=${from}&to=${to}`);
      setActiveDates((prev) => {
        const next = new Set(prev);
        (data.activity || []).forEach((a) => next.add(a.earth_date));
        return next;
      });
    } catch (e) {
      // On failure, forget the month so it can be retried.
      loadedMonths.current.delete(key);
      console.error('Failed to load activity for', key, e);
    } finally {
      setCalendarLoading(false);
    }
  };

  // Prefetch the picked date's month so the calendar opens with the right days
  // enabled (covers initial load, since the view follows the picked date).
  useEffect(() => {
    if (datePicked) fetchActivityForMonth(moment(datePicked));
  }, [datePicked]);

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
    window.addEventListener('scroll', calcLoadMore);
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
    return () => window.removeEventListener('scroll', calcLoadMore);
  };

  // The MUI DatePicker disables a day when this returns true. Until a month's
  // activity has loaded we don't disable anything (the `loading` skeleton masks
  // it); once loaded, disable any day with no photos. Using moment.format avoids
  // the UTC off-by-one that toISOString() caused.
  const shouldDisableDate = (date) => {
    const monthKey = moment(date).format('YYYY-MM');
    if (!loadedMonths.current.has(monthKey)) return false;
    return !activeDates.has(moment(date).format('YYYY-MM-DD'));
  };

  return (
    <div className="app">
      <ThemeProvider theme={DarkTheme}>
        <HomeScreen />
        <Stats manifestData={manifestData} />
        <Container
          id="scroll__down"
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              color: 'secondary',
              fontSize: '.85rem',
              paddingLeft: 2,
              paddingRight: 2,
              m: 1,
              borderBottom: 1,
              borderColor: '#ffffff1a',
              alignmentBaseline: 'bottom',
            }}
          >
            <p className="search__intro">
              Search by Earth Date or <em>Sol</em>
              <Tooltip
                title="A Sol is one solar day on Mars. Sol 0 is the first day for Perseverance on Mars."
                color="info"
              >
                <HelpIcon
                  sx={{
                    fontSize: '1rem',
                    textAlign: 'right',
                    marginLeft: 1,
                    color: '#ffffff40',
                  }}
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
                value={datePicked ? moment(datePicked, 'YYYY-MM-DD') : null}
                onChange={(newDate) => {
                  if (newDate && newDate.isValid()) {
                    setDatePicked(newDate.format('YYYY-MM-DD'));
                  }
                }}
                onOpen={() => fetchActivityForMonth(moment(datePicked))}
                onMonthChange={(month) => fetchActivityForMonth(month)}
                loading={calendarLoading}
                renderLoading={() => <CalendarPickerSkeleton />}
                renderInput={(params) => <TextField {...params} />}
                disableFuture={true}
                shouldDisableDate={shouldDisableDate}
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
        <Footer />
        <ScrollToTop />
      </ThemeProvider>
    </div>
  );
}

export default App;
