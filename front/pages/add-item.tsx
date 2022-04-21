import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { Container, Box, SimpleGrid, Flex,
  Heading, Button, InputGroup, Input, InputRightAddon, InputLeftAddon, IconButton, Select, AlertIcon, Alert, Tabs, TabPanels, Tab, TabList, TabPanel, FormControl, FormLabel, Modal, ModalContent, ModalFooter, ModalBody, ModalCloseButton, ModalHeader, ModalOverlay, useDisclosure, CloseButton, AlertDescription, AlertTitle
} from '@chakra-ui/react'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { Vessel } from '../_models/vessel'
import TeacherService  from '../_services/teacherService'
import AddTeacherModal from '../components/addTeacherModal';
import AddCampusModal from '../components/addCampusModal';
import { HttpResponseMessage } from '../_models/httpResponseMessage';
import AddUniversityModal from '../components/addUniversityModal';

const AddItem: NextPage = () => {
    const [teacherModal, setTeacherModal] = useState<boolean>(false);
    const [campusModal, setCampusModal] = useState<boolean>(false);
    const [universityModal, setUniversityModal] = useState<boolean>(false);
    const [httpResponseMessage, setHttpResponseMessage] = useState<HttpResponseMessage|null>(null);

    return (
        <>
            <div className='hero-title'>
                <h1 className=''>
                    Agrega tu profesor, campus o universidad si aun no se encuentra.
                </h1>
            </div>

            <div id='hero-add-item'>
                <div className='button-classroom item-image-bg' onClick={()=> setTeacherModal(true)}>
                    <div className='item-lbl'>
                        <p>Agrega un Profesor</p>
                    </div>
                </div>
                <div className='button-campus item-image-bg'  onClick={()=> setCampusModal(true)}>
                    <div className='item-lbl'>
                        <p>Agrega un Campus</p>
                    </div>
                </div>
                <div className='button-university item-image-bg' onClick={()=> setUniversityModal(true)} >
                    <div className='item-lbl'>
                        <p>Agrega una Universidad</p>
                    </div>
                </div>

            </div>

            { !!httpResponseMessage && httpResponseMessage.success &&
                <Alert status='success' className='pop-up-alert'>
                    <AlertIcon />
                    <AlertTitle mr={2}>Operación exitosa!</AlertTitle>
                    <AlertDescription>{httpResponseMessage.message}</AlertDescription>
                    <CloseButton position='absolute' right='8px' top='8px' onClick={()=> setHttpResponseMessage(null)}/>
                </Alert>
            }
            { !!httpResponseMessage && !httpResponseMessage.success &&
                <Alert status='error' className='pop-up-alert' onClick={()=> setHttpResponseMessage(null)}>
                    <AlertIcon />
                    <AlertTitle mr={2}>Error!</AlertTitle>
                    <AlertDescription>{httpResponseMessage.message}</AlertDescription>
                    <CloseButton position='absolute' right='8px' top='8px' />
                </Alert>
            }
            
            <AddCampusModal isOpen={campusModal} setIsOpen={setCampusModal} setHttpResponseMessage={setHttpResponseMessage}/>
            <AddTeacherModal isOpen={teacherModal} setIsOpen={setTeacherModal} setHttpResponseMessage={setHttpResponseMessage}/>
            <AddUniversityModal isOpen={universityModal} setIsOpen={setUniversityModal} setHttpResponseMessage={setHttpResponseMessage}/>
        </>
    )
}

export default AddItem
