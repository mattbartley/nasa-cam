export default function SolPicker({
  fetchedPhotos,
  solPicked,
  solPickedRef,
  setSolPicked,
}) {
  const showBySol = (e) => {
    e.preventDefault();
    setSolPicked(solPickedRef.current.value);
  };
  return (
    <form>
      <input
        placeholder={fetchedPhotos != "" ? fetchedPhotos[0].sol : solPicked}
        ref={solPickedRef}
      />
      <button className="sol__btn" onClick={showBySol}>
        Show by Sol
      </button>
    </form>
  );
}
