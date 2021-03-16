import { Button } from '@chakra-ui/button'
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/modal'
import React from 'react'

interface Props {
  onClose: any
  isOpen: boolean
  modalTitle: string
  modalSize: string
  onSubmit?: any
}

const BaseModal: React.FC<Props> = (props) => {
    return (
      <>
        <Modal onClose={props.onClose} size={props.modalSize} isOpen={props.isOpen}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{props.modalTitle}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {props.children}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="purple" onClick={props.onSubmit}>Save</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

export default BaseModal;