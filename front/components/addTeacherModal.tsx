import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import { Vessel } from '../_models/vessel';
import TeacherService from '../_services/teacherService';

interface Props {
  isOpen: boolean,
  setIsOpen: Function
}

export default function AddTeacherModal(props: Props) {
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const [searchTarget, setSearchTarget] = useState<string>(""); // incomplete target search to be looked up in the DB
  const [selectedOption, setselectedOption] = useState<Vessel | null>(); // completed and selected search word comming forn the DB
  const selectRef = useRef<any>(null);
  const [sourceCampusData, setSourceCampusData] = useState<Array<Vessel> | null>(null);

  useEffect(() => {
    console.log("changing: ", props.isOpen)
  }, [props.isOpen]);

  useEffect(() => {
    // initialization of data
    setSearchTarget("");
    setselectedOption(null);
    if (!!selectRef?.current) {
      selectRef.current.value = "";
    }
  }, []);

  useEffect(() => {
    if (!!selectRef?.current && selectedOption!=null) {
      selectRef.current.value = selectedOption.value;
    }
    
  }, [selectedOption]);

  useEffect(() => {
    if (searchTarget !== "") {
      TeacherService.getCampusWithUniversity(searchTarget, 20)
        .then(resp => {
          let data = resp.data;
          let dataVessel = data.map(campuses => {
            return new Vessel(campuses.campus_id, campuses.name);
          })
          setSourceCampusData(dataVessel);
        })
        .catch(err => {
          console.log("Hubo un error obteniendo los campus con universidades.")
        });

    }
    
  }, [searchTarget]);

  function onClose() {
    props.setIsOpen(false);
  }
  
  return (
    <>
      <Modal isOpen={props.isOpen} onClose={onClose} id='item'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className='item-header'>Agrega a tu Maestro</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form action="" className='add-item-form'>
              <FormControl>
                <FormLabel htmlFor='name'>Nombre</FormLabel>
                <Input id='name' type='text' {...register("name")}/>
              </FormControl>

              <FormControl>
                <FormLabel htmlFor='lastname1'>Apellido Paterno</FormLabel>
                <Input id='lastname1' type='text' {...register("lastname1")}/>
              </FormControl>

              <FormControl>
                <FormLabel htmlFor='lastname2'>Apellido Materno</FormLabel>
                <Input id='lastname2' type='text'  {...register("lastname2")}/>
              </FormControl>

              <FormControl>
                <FormLabel htmlFor='subject'>Materia</FormLabel>
                <Input id='subject' type='text' {...register("subject")} />
              </FormControl>

              <Controller
                name="campus"
                control={control}
                render={({ field }) => 
                  <FormControl>
                    <FormLabel htmlFor='campus'>Campus</FormLabel>
                    <Select 
                      {...field} 
                      ref={selectRef}
                      id='campus'
                      placeholder='selecciona...'
                      isClearable={true}
                      onInputChange={ (val: string) =>{
                        setSearchTarget(val);
                      }}
                      options={
                        sourceCampusData?.map( campus =>{
                          return { value: campus.id, label: campus.value }
                        })
                      } 
                    />
                  </FormControl>
                  }
              />
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue'>
              Agregar
            </Button>
            <Button colorScheme='pink' ml={3} variant='solid' onClick={() => props.setIsOpen(false)}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </>
  )
}