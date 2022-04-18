import { Button, FormControl, FormHelperText, FormLabel, Input, Modal, ModalBody, ModalCloseButton,
  ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select as ChakraSelect
} from '@chakra-ui/react';
import { read } from 'fs';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import NewUniversity from '../_models/newUniversity';
import { HttpResponseMessage } from '../_models/httpResponseMessage';
import { Vessel } from '../_models/vessel';
import TeacherService from '../_services/teacherService';
import { json } from 'stream/consumers';

interface Props {
  isOpen: boolean,
  setIsOpen: Function,
  setHttpResponseMessage: Function
}

interface IFormInputs {
  name: string;
  img_file: FileList
}

interface OptionCampus {
  value: number;
  label: string;
}

export default function AddUniversityModal(props: Props) {
  const MAX_FILE_SIZE = 4; //MiB
  const ALLOWED_FILE_FORMATS = ["jpeg", "jpg" ,"gif", "bmp", "tiff" , "png", "webp"];
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<IFormInputs>();
  const [previewImg, setPreviewImg] = useState<string | null>();

  function onClose() {
    reset();
    setPreviewImg(null)
    props.setIsOpen(false);
  }

  function onSubmit(data: IFormInputs) {
    let file = data.img_file[0];
    let reader = new FileReader();
    let uni_data = null;
    reader.onload = function () {
      // reader.results contains the base64 string to send to the server
      let file_name = file.name; 
      let pos = file_name.lastIndexOf(".");
      let file_type = file_name.substring(pos+1).toLowerCase();
      let base64_data = window.btoa(reader.result as string);
      uni_data = new NewUniversity(data.name, base64_data, file_type)
      TeacherService.addUniversity(uni_data)
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
          reset();
          setPreviewImg(null)
          onClose();
        });
    }
    reader.readAsBinaryString(file);
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
                {errors.name && 
                  <p className='error-form-msg'>
                    {`Campo requerido.`}
                  </p>
                }
                <FormHelperText id="email-helper-text">
                  Debe ser el nombre completo, sin acrónimos ni siglas.
                </FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel htmlFor='image-file'>Selecciona una imagen (Opcional)</FormLabel>
                <Input id='image-file' type='file' {...register("img_file", { required: true, validate:{
                    fileSize: fs => (fs[0].size/Math.pow(2,20)) <= MAX_FILE_SIZE ,
                    fileFormat: fs => {
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