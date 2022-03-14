import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import Link from 'next/link';
import { useState } from 'react';
import nav_st from '../styles/NavBar.module.css';

export default function AddTeacherModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function onClose() {
    setIsOpen(false);
  }
  
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus necessitatibus, vitae illum, placeat aliquid, laboriosam enim consequuntur voluptates sequi dolorum asperiores quo vero. Placeat ea voluptas cumque reprehenderit voluptatum, beatae iusto illo quam alias vitae ipsam laboriosam consectetur, ducimus consequatur, tenetur repudiandae nihil eius consequuntur itaque corporis. At error, accusamus illo voluptatem numquam ipsum nesciunt vel, quam fugiat, sequi et.
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost'>
              Agregar
            </Button>
            <Button colorScheme='pink' mr={3} variant='solid' onClick={() => setIsOpen(false)}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}