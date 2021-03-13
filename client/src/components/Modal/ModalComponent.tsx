import { Button } from '@chakra-ui/button'
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/modal'
import React from 'react'

interface Props {
  onClose: any
  isOpen: boolean
  modalTitle: string
}

const ModalComponent: React.FC<Props> = (props) => {
    return (
      <>
        <Modal onClose={props.onClose} size="full" isOpen={props.isOpen}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{props.modalTitle}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {props.children}
            </ModalBody>
            <ModalFooter>
              <Button onClick={props.onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

export default ModalComponent