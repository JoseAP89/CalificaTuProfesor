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

const Facility: NextPage = () => {
    const [teacherModal, setTeacherModal] = useState<boolean>(false);
    const [campusModal, setCampusModal] = useState<boolean>(false);
    const [universityModal, setUniversityModal] = useState<boolean>(false);
    const [httpResponseMessage, setHttpResponseMessage] = useState<HttpResponseMessage|null>(null);

    return (
        <>
            <Head>
                <title>Edificio</title>
            </Head>
            <div className='hero-title'>
                <h1 className=''>
                    Edificio
                </h1>
            </div>

        </>
    )
}

export default Facility;
