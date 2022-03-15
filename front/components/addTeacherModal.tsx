import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import nav_st from '../styles/NavBar.module.css';

interface Props {
  isOpen: boolean,
  setIsOpen: Function
}

export default function AddTeacherModal(props: Props) {

  useEffect(() => {
    console.log("changing: ", props.isOpen)
  }, [props.isOpen]);

  function onClose() {
    props.setIsOpen(false);
  }
  
  return (
    <>
      <Modal isOpen={props.isOpen} onClose={onClose} id='item'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agrega a tu Maestro</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form action="">
              <FormControl>
                <FormLabel htmlFor='nombre'>Nombre</FormLabel>
                <Input id='nombre' type='text' />
              </FormControl>

              <FormControl style={{marginTop:'20px'}}>
                <FormLabel htmlFor='apellido1'>Apellido Paterno</FormLabel>
                <Input id='apellido1' type='text' />
              </FormControl>

              <FormControl style={{marginTop:'20px'}}>
                <FormLabel htmlFor='apellido2'>Apellido Materno</FormLabel>
                <Input id='apellido2' type='text' />
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost'>
              Agregar
            </Button>
            <Button colorScheme='pink' mr={3} variant='solid' onClick={() => props.setIsOpen(false)}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </>
  )
}