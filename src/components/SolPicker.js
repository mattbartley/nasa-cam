import { useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function SolPicker({ fetchedPhotos, solPicked, setSolPicked }) {
  const [solInput, setSolInput] = useState("");
  let solForm = useRef(null);

  const showBySol = (e) => {
    e.preventDefault();
    setSolPicked(solInput);
    setSolInput("");
  };

  return (
    <form>
      <TextField
        id="outlined"
        variant="outlined"
        placeholder={
          fetchedPhotos != ""
            ? fetchedPhotos[0].sol.toString()
            : solPicked.toString()
        }
        ref={solForm}
        value={solInput}
        onChange={(e) => {
          e.preventDefault();
          setSolInput(e.target.value);
        }}
      />

      <Button
        sx={{ m: 1 }}
        variant="outlined"
        size="large"
        onClick={showBySol}
        type="submit"
      >
        Show by Sol
      </Button>
    </form>
  );
}
