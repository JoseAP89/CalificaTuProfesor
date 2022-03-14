import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { Container, Box, SimpleGrid, Flex,
  Heading, Button, InputGroup, Input, InputRightAddon, InputLeftAddon, IconButton, Select, AlertIcon, Alert, Tabs, TabPanels, Tab, TabList, TabPanel, FormControl, FormLabel, Modal, ModalContent, ModalFooter, ModalBody, ModalCloseButton, ModalHeader, ModalOverlay, useDisclosure
} from '@chakra-ui/react'
import AddItemStyle from '../styles/styledComponents/addItems';
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { Vessel } from '../_models/vessel'
import TeacherService  from '../_services/teacherService'
import Link from 'next/link'
import classroom from '../public/classroom.jpg';

const AddItem: NextPage = () => {

    return (
        <>
            <div className='hero-title'>
                <h1 className=''>
                    Agrega tu profesor, campus o universidad si aun no se encuentra.
                </h1>
            </div>
            <div id='hero-add-item'>
                <div className='button-classroom item-image-bg' >
                    <div className='item-lbl'>
                        <p>Agrega un Profesor</p>
                    </div>
                </div>
                <div className='button-campus item-image-bg' >
                    <div className='item-lbl'>
                        <p>Agrega un Campus</p>
                    </div>
                </div>
                <div className='button-university item-image-bg' >
                    <div className='item-lbl'>
                        <p>Agrega una Universidad</p>
                    </div>
                </div>

            </div>
        </>
    )
}

export default AddItem
