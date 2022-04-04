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
  lastname1: string;
  lastname2: string;
  subject: string;
  uniStructureId: number;
  campus: OptionCampus;
  structureName: string,
}

interface OptionCampus {
  value: number;
  label: string;
}

export default function AddTeacherModal(props: Props) {
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<IFormInputs>();
  const [searchTarget, setSearchTarget] = useState<string>(""); // incomplete target search to be looked up in the DB
  const [selectedOption, setselectedOption] = useState<Vessel | null>(); // completed and selected search word comming forn the DB
  const selectRef = useRef<any>(null);
  const [sourceCampusData, setSourceCampusData] = useState<Array<Vessel> | null>(null);
  const [uniStructures, setUniStructures] = useState<Array<Vessel> | null>(null);

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

  useEffect(() => {
    TeacherService.getUniStructures()
      .then(res => {
        let data = res.data;
        setUniStructures(data);
      }).catch(err => {
        console.log("Hubo un error obteniendo las estructuras universitarias.")
      });
  }, []);

  function onClose() {
    props.setIsOpen(false);
  }

  function onSubmit(data: IFormInputs) {
    let formData: Roster  =  {
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
      });
    console.log("form data:", formData);
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
                <FormLabel htmlFor='name'>Nombre</FormLabel>
                <Input id='name' type='text' {...register("name", { required: true })}/>
              </FormControl>

              <FormControl>
                <FormLabel htmlFor='lastname1'>Apellido Paterno</FormLabel>
                <Input id='lastname1' type='text' {...register("lastname1", { required: true })}/>
              </FormControl>

              <FormControl>
                <FormLabel htmlFor='lastname2'>Apellido Materno</FormLabel>
                <Input id='lastname2' type='text'  {...register("lastname2")}/>
              </FormControl>

              <FormControl>
                <FormLabel htmlFor='subject'>Materia</FormLabel>
                <Input id='subject' type='text' {...register("subject", { required: true })} />
              </FormControl>

              <Controller
                name="campus"
                control={control}
                rules={{ required: true }}
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

              <FormControl>
                <FormLabel htmlFor='uni-structure'>Estructura Universitaria</FormLabel>
                <ChakraSelect id='uni-structure' placeholder='Selecciona una opción' 
                  {...register("uniStructureId", { required: true })}
                   >
                  { !!uniStructures && uniStructures.length>0 &&
                    uniStructures.map(structure =>
                      <option key={structure.id} value={structure.id}>{structure.value}</option>
                    )
                  }
                </ChakraSelect>
              </FormControl>

              <FormControl>
                <FormLabel htmlFor='structureName'>Nombre de la estructura universitaria</FormLabel>
                <Input id='structureName' type='text' {...register("structureName", { required: true })}/>
                <FormHelperText style={{fontWeight:"bold"}}>Por ejemplo: Economía, Energía, Mecánica, Derecho, etc.</FormHelperText>
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