import { useRef, useState } from "react";

export default function SolPicker({ fetchedPhotos, solPicked, setSolPicked }) {
  const [solInput, setSolInput] = useState("");
  let solForm = useRef(null);

  const showBySol = (e) => {
    e.preventDefault();
    const form = solForm.current;
    setSolPicked(form.value);
    console.log(form.value);
    setSolInput("");
  };

  return (
    <form>
      <input
        placeholder={fetchedPhotos != "" ? fetchedPhotos[0].sol : solPicked}
        ref={solForm}
        value={solInput}
        onChange={(e) => {
          e.preventDefault();
          setSolInput(e.target.value);
        }}
      />
      <button className="sol__btn" onClick={showBySol}>
        Show by Sol
      </button>
    </form>
  );
}
