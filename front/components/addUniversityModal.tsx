import { Button, FormControl, FormHelperText, FormLabel, Input, Modal, ModalBody, ModalCloseButton,
  ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select as ChakraSelect
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import { HttpResponseMessage } from '../_models/httpResponseMessage';
import { Roster } from '../_models/roster';
import { Vessel } from '../_models/vessel';
import TeacherService from '../_services/teacherService';

interface Props {
  isOpen: boolean,
  setIsOpen: Function,
  setHttpResponseMessage: Function
}

interface IFormInputs {
  name: string;
  img_file: File
}

interface OptionCampus {
  value: number;
  label: string;
}

export default function AddUniversityModal(props: Props) {
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<IFormInputs>();
  const [searchTarget, setSearchTarget] = useState<string>(""); // incomplete target search to be looked up in the DB
  const [selectedOption, setselectedOption] = useState<Vessel | null>(); // completed and selected search word comming forn the DB
  const selectRef = useRef<any>(null);

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



  function onClose() {
    props.setIsOpen(false);
  }

  function onSubmit(data: IFormInputs) {
/*     let formData: Roster  =  {
      teacher_name : data.name,
      teacher_lastname1: data.lastname1,
      teacher_lastname2: data.lastname2,
      subject_name: data.subject,
      uni_structure_id: Number(data.uniStructureId),
      campus_id: data.campus.value,
      structure_name: data.structureName,
    } 
    TeacherService.addRoster(formData)
      .then(res => {
        console.log("roster response: ", res);
        const message : HttpResponseMessage = {
          success: true,
          message: "Agregado con exito"
        }
        props.setHttpResponseMessage(message);
      }).catch(err => {
        const message : HttpResponseMessage = {
          success: false,
          message: err.response.data
        }
        props.setHttpResponseMessage(message);
      }).finally(()=>{
        reset();
        onClose();
      });*/
    console.log("form data:", data);
  }
  
  return (
    <>
      <Modal isOpen={props.isOpen} onClose={onClose} id='item'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className='item-header'>Agrega a tu Maestro</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form action="" className='add-item-form' onSubmit={handleSubmit(onSubmit)}>

              <FormControl>
                <FormLabel htmlFor='name'>Nombre de la Universidad</FormLabel>
                <Input id='name' type='text' {...register("name", { required: true })}/>
                <FormHelperText id="email-helper-text">
                  Debe ser el nombre completo, sin acrónimos ni siglas.
                </FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel htmlFor='image-file'>Selecciona una imagen (Opcional)</FormLabel>
                <Input id='image-file' type='file' {...register("img_file", { required: true })}/>
              </FormControl>

              <input type="submit" id="submitFormBtn" hidden/>

            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' type='submit'
              onClick={() =>{
                let sendForm_btn = window.document.querySelector("#submitFormBtn") as HTMLButtonElement;
                if (!!sendForm_btn) {
                  sendForm_btn.click();
                }
              }}>
              Agregar
            </Button>
            <Button colorScheme='pink' ml={3} variant='solid' onClick={() => {
              reset();
              props.setIsOpen(false)}
            }>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </>
  )
}