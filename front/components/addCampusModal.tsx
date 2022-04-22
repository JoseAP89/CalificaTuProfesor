import { Button, FormControl, FormHelperText, FormLabel, Input, Modal, ModalBody, ModalCloseButton,
  ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select as ChakraSelect
} from '@chakra-ui/react';
import { read } from 'fs';
import Select from 'react-select';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import NewUniversity from '../_models/newUniversity';
import { HttpResponseMessage } from '../_models/httpResponseMessage';
import { Vessel } from '../_models/vessel';
import TeacherService from '../_services/teacherService';
import { json } from 'stream/consumers';
import NewCampus from '../_models/newCampus';

interface Props {
  isOpen: boolean,
  setIsOpen: Function,
  setHttpResponseMessage: Function
}

interface IFormInputs {
  name: string;
  img_file: FileList;
  university: SelectOption;
  state: SelectOption;
}

interface SelectOption {
  value: number;
  label: string;
}

export default function AddCampusModal(props: Props) {
  const MAX_FILE_SIZE = 4; //MiB
  const ALLOWED_FILE_FORMATS = ["jpeg", "jpg" ,"gif", "bmp", "tiff" , "png", "webp"];
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<IFormInputs>();
  const [previewImg, setPreviewImg] = useState<string | null>();
  const selectRef = useRef<any>(null);
  const [sourceUniversityData, setSourceUniversityData] = useState<Array<Vessel> | null>(null);
  const [sourceStateData, setSourceStateData] = useState<Array<Vessel> | null>(null);
  const [searchTarget, setSearchTarget] = useState<string>(""); // incomplete target search to be looked up in the DB
  const [selectedOption, setselectedOption] = useState<Vessel | null>(); // completed and selected search word comming forn the DB

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
    // get states source data
    TeacherService.getStates()
      .then(resp => {
        let data = resp.data;
        setSourceStateData(data);
      })
      .catch(err => {
        console.log("Hubo un error obteniendo los Estados.")
      });
    
  }, []);

  function onClose() {
    reset();
    setPreviewImg(null)
    props.setIsOpen(false);
  }

  useEffect(() => {
    if (searchTarget !== "") {
      TeacherService.getUniversities(searchTarget, 20)
        .then(resp => {
          let data = resp.data;
          setSourceUniversityData(data);
        })
        .catch(err => {
          console.log("Hubo un error obteniendo los campus con universidades.")
        });

    }
    
  }, [searchTarget]);

  function onSubmit(data: IFormInputs) {
    let file = data?.img_file[0];
    let reader = new FileReader();
    let campus_data = null;
    reader.onload = function () {
      // reader.results contains the base64 string to send to the server
      let file_name = file.name; 
      let pos = file_name.lastIndexOf(".");
      let file_type = file_name.substring(pos+1).toLowerCase();
      let base64_data = window.btoa(reader.result as string);
      campus_data= new NewCampus(data.name, data.state.value, data.university.value, base64_data, file_type)
      TeacherService.addCampus(campus_data)
        .then(res => {
          const message : HttpResponseMessage = {
            success: true,
            message: "Agregado con exito"
          }
          props.setHttpResponseMessage(message);
        }).catch(err => {
          const message : HttpResponseMessage = {
            success: false,
            message: err?.response?.data
          }
          console.log("unexpected error:",err);
          props.setHttpResponseMessage(message);
        }).finally(()=>{
          onClose();
          reset();
          setPreviewImg(null)
        });
    }
    if (!!file) {
      reader.readAsBinaryString(file);
    } else {
      campus_data= new NewCampus(data.name, data.state.value, data.university.value, undefined, undefined)
      TeacherService.addCampus(campus_data)
        .then(res => {
          const message : HttpResponseMessage = {
            success: true,
            message: "Agregado con exito"
          }
          props.setHttpResponseMessage(message);
        }).catch(err => {
          const message : HttpResponseMessage = {
            success: false,
            message: err?.response?.data
          }
          console.log("unexpected error:",err);
          props.setHttpResponseMessage(message);
        }).finally(()=>{
          onClose();
          reset();
          setPreviewImg(null)
        });
    }
  }
  
  return (
    <>
      <Modal isOpen={props.isOpen} onClose={onClose} id='item'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className='item-header'>Agrega a tu Campus</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form action="" className='add-item-form' onSubmit={handleSubmit(onSubmit)}>

              <FormControl>
                <FormLabel htmlFor='name'>Nombre del Campus</FormLabel>
                <Input id='name' type='text' {...register("name", { required: true })}/>
                {errors.name && 
                  <p className='error-form-msg'>
                    {`Campo requerido.`}
                  </p>
                }
                <FormHelperText id="email-helper-text">
                  Debe ser el nombre completo, sin acrónimos ni siglas.
                </FormHelperText>
              </FormControl>

              <Controller
                name="university"
                control={control}
                rules={{ required: true }}
                render={({ field }) => 
                  <FormControl>
                    <FormLabel htmlFor='university'>Universidad</FormLabel>
                    <Select 
                      {...field} 
                      ref={selectRef}
                      id='university'
                      placeholder='selecciona...'
                      isClearable={true}
                      onInputChange={ (val: string) =>{
                        setSearchTarget(val);
                      }}
                      options={
                        sourceUniversityData?.map( uni =>{
                          return { value: uni.id, label: uni.value } as any
                        })
                      } 
                    />
                  </FormControl>
                  }
              />

              <Controller
                name="state"
                control={control}
                rules={{ required: true }}
                render={({ field }) => 
                  <FormControl>
                    <FormLabel htmlFor='state'>Estado</FormLabel>
                    <Select 
                      {...field} 
                      id='state'
                      placeholder='selecciona...'
                      isClearable={true}
                      isSearchable={true}
                      options={
                        sourceStateData?.map( state =>{
                          return { value: state.id, label: state.value } as any
                        })
                      } 
                    />
                  </FormControl>
                  }
              />

              <FormControl>
                <FormLabel htmlFor='image-file'>Selecciona una imagen (Opcional)</FormLabel>
                <Input id='image-file' type='file' {...register("img_file", { validate:{
                    fileSize: fs => {
                      if (!!!fs || fs.length<=0) {
                        return true;
                      }
                      return (fs[0].size/Math.pow(2,20)) <= MAX_FILE_SIZE;
                    },
                    fileFormat: fs => {
                      if (!!!fs || fs.length<=0) {
                        return true;
                      }
                      let name = fs[0].name.toLowerCase();
                      let dotPos = name.lastIndexOf(".");
                      let file_format = name.slice(dotPos+1);
                      return ALLOWED_FILE_FORMATS.some(f => f==file_format);
                    }
                  } 
                })}
                  onChange={(event) =>{
                    if(!!event?.target?.files){
                      let file = event.target.files[0];
                      let preview_img = URL.createObjectURL(file.slice());
                      setPreviewImg(preview_img);
                    }
                  }}
                />
                {errors.img_file && errors.img_file.type=="fileSize" &&
                  <p className='error-form-msg'>
                    {`Máximo tamaño de archivo superado. Tamaño debe ser menor a ${MAX_FILE_SIZE} MiB.`}
                  </p>
                }
                {errors.img_file && errors.img_file.type=="fileFormat" &&
                  <p className='error-form-msg'>
                    {`Formato de archivo inválido. Formatos válidos: ${ALLOWED_FILE_FORMATS.join(", ")}.`}
                  </p>
                }
              </FormControl>

              {
                !!previewImg && 
                <div className='preview-img-container'>
                  <label htmlFor="preview-img">Vista Previa:</label>
                  <img src={previewImg} id='preview-img' className='preview-img' alt="preview university image" height={350} width={350}/>
                </div>
              }

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
              props.setIsOpen(false)
              setPreviewImg(null)
            }}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </>
  )
}