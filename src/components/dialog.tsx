import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

type DialogBoxProps = {
  open: boolean,
  handleClose: any
}

 
export function DialogBox(props: DialogBoxProps) {
  const { open, handleClose } = props
  
  return (
    <>
      <Dialog open={open}>
        <DialogHeader>Its a simple dialog.</DialogHeader>
        <DialogBody>
          The key to more success is to have a lot of pillows. Put it this way,
          it took me twenty five years to get these plants, twenty five years of
          blood sweat and tears, and I&apos;m never giving up, I&apos;m just
          getting started. I&apos;m up to something. Fan luv.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            className="mr-1"
            onClick={handleClose}
          >
            <span>Cancel</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
