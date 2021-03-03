import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, useDisclosure } from '@chakra-ui/react';
import React, { useRef } from 'react';

interface Props {
    drawerButtonName: string
    drawerHeaderName: string
}

const SideDrawer: React.FC<Props> = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef<HTMLButtonElement>(null)
  
    return (
      <>
        <Button ref={btnRef} colorScheme="purple" onClick={onOpen}>
          {props.drawerButtonName}
        </Button>
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          {/* <DrawerOverlay> */}
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>{props.drawerHeaderName}</DrawerHeader>
  
              <DrawerBody>
                {props.children}
              </DrawerBody>
  
              <DrawerFooter>
                <Button color="red" variant="outline" mr={3} onClick={onClose}>
                  Cancel
                </Button>
              </DrawerFooter>
            </DrawerContent>
          {/* </DrawerOverlay> */}
        </Drawer>
      </>
    )
}

export default SideDrawer;