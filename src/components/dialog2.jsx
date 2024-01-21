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

  return (
    <>
      <Dialog open={open} size="xl">
        <DialogHeader>Meta Tag Report</DialogHeader>
        <DialogBody>
          {body.split("\n").map(function (item) {
            return (
              <span>
                {item}
                <br />
              </span>
            );
          })}
        </DialogBody>
        <DialogFooter>
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
