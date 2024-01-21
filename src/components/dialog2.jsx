import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

export function DialogBox2(props) {
  const { open, handleClose, body } = props;

  const exportTagsAsJSON = () => {
    if (body.length === 0) {
      setErrorMessage("No meta tags found.");
      return;
    }

    const tagsJSON = JSON.stringify(body, null, 2);

    const blob = new Blob([tagsJSON], { type: "application/json" });

    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = "meta-tags.json";
    anchor.click();
  };

  return (
    <>
      <Dialog open={open} size="xl">
        <DialogHeader>Meta Tag Report</DialogHeader>
        <DialogBody className="h-[400px] overflow-auto">
          {body?.split("\n").map(function (item, i) {
            return (
              <span key={i}>
                {item}
                <br />
              </span>
            );
          })}
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" className="mr-1" onClick={exportTagsAsJSON}>
            <span>Download</span>
          </Button>

          <Button
            variant="text"
            color="red"
            className="mr-1"
            onClick={handleClose}
          >
            <span>Close</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
