import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";


 
export function DialogBox(props) {
  const { open, handleClose, body } = props
  
  return (
    <>
      <Dialog open={open} size='xl'>
        <DialogHeader>Meta data Information</DialogHeader>
        <DialogBody className="h-[400px] overflow-auto">
          {JSON.stringify(body)}
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
