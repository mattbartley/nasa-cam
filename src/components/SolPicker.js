import { useRef, useState } from "react";
import { Button, FormGroup, TextField, Box } from "@mui/material/";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

export default function SolPicker({ fetchedPhotos, solPicked, setSolPicked }) {
  const [solInput, setSolInput] = useState("");
  let solForm = useRef(null);

  const showBySol = (e) => {
    e.preventDefault();
    setSolPicked(solInput);
    setSolInput("");
  };

  return (
    <FormGroup row>
      <TextField
        sx={{
          textTransform: "uppercase",
          fieldset: {
            borderTopRightRadius: "0px",
            borderBottomRightRadius: "0px",
          },
        }}
        label="Search Sol"
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
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            setSolPicked(solInput);
            setSolInput("");
            e.preventDefault();
          }
        }}
      />

      <Button
        sx={{
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          paddingLeft: 0,
          paddingRight: 0,
        }}
        variant="outlined"
        size="large"
        onClick={showBySol}
        type="submit"
        disableElevation
      >
        <ArrowCircleRightIcon />
      </Button>
    </FormGroup>
  );
}
