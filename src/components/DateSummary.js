import moment from "moment";
import "../css/DateSummary.css";
import { Skeleton, Stack } from "@mui/material/";

export default function DateSummary({
  fetchedPhotos,
  filteredPhotos,
  activeCamera,
  activeCameraName,
  numberOfCams,
}) {
  let numberOfImages = 0;
  if (activeCamera === 0) {
    numberOfImages = fetchedPhotos.length;
  } else {
    numberOfImages = numberOfCams;
  }
  // Conditionally render facts from the selected date's mission (Number of photos, camera name, Earth Date & Sol, etc)
  // Converts API-provided YYYY-MM-DD date format for redability (i.e. Jan 1st, 2022) with moment.js
  return (
    <Stack sx={{ alignItems: "center", textAlign: "center" }}>
      <div className="date__summary">
        <div className="selected__date">
          {fetchedPhotos != ""
            ? moment(fetchedPhotos[0].earth_date).format("MMMM Do, YYYY")
            : ""}
          <span className="selected__sol">
            {filteredPhotos[0] === undefined
              ? ""
              : " // Sol " + filteredPhotos[0].sol}
          </span>
        </div>
        <div className="returned__details">
          <div>
            {filteredPhotos.length < 1 ? (
              <Skeleton
                variant="h1"
                width={210}
                sx={{ m: 1, textAlign: "center" }}
              />
            ) : fetchedPhotos.length > 0 ? (
              <>
                Images Returned:{" "}
                <span className="returned__text">{numberOfImages}</span>
              </>
            ) : (
              <span className="returned__empty">No results</span>
            )}
          </div>
        </div>
        <div className="returned__details">
          {fetchedPhotos.length > 0 ? (
            <>
              Current Camera:{" "}
              <span className="returned__text">
                {activeCamera === 0 ? "All" : activeCameraName}
              </span>
            </>
          ) : (
            <Skeleton
              variant="p"
              width={210}
              sx={{ m: 1, textAlign: "center" }}
            />
          )}
        </div>
      </div>
    </Stack>
  );
}
