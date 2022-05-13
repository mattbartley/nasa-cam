import moment from "moment";

export default function DateSummary({
  fetchedPhotos,
  filteredPhotos,
  activeCamera,
  activeCameraName,
}) {
  // Conditionally render facts from the selected date's mission (Number of photos, camera name, Earth Date & Sol, etc)
  // Converts API-provided YYYY-MM-DD date format for redability (i.e. Jan 1st, 2022) with moment.js
  return (
    <div className="date__summary">
      <h2>
        {fetchedPhotos != ""
          ? moment(fetchedPhotos[0].earth_date).format("MMMM Do, YYYY")
          : ""}
        <em>
          {filteredPhotos[0] === undefined
            ? ""
            : " (Sol:" + filteredPhotos[0].sol + ")"}
        </em>
      </h2>
      <p>
        <strong>Images Returned:</strong> {fetchedPhotos.length}
      </p>
      <p>
        <strong>Camera:</strong> {activeCamera === 0 ? "All" : activeCameraName}
      </p>
    </div>
  );
}
