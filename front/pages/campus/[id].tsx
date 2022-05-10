import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import TeacherService from '../../_services/teacherService'
import {Campus} from '../../_models/campus'
import noAvailable from '../../public/no_available.jpg'
import CampusInfoStyle from '../../styles/styledComponents/campusInfo'
import { Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react'

const CampusPage = () => {
    const router = useRouter()
    const [campusId, setCampusId] = useState<number|null>(null);
    const [campus, setCampus] = useState<Campus|null>(null);
    const [campusImage, setCampusImage] = useState<any>(null);
    const {id} = router.query;

    useEffect(() => {
        if(!isNaN(Number(id))){
            setCampusId(Number(id));
        }
    }, [id]);

    useEffect(() => {
        if (campusId!=null) {
            if (campusId>0) {
                TeacherService.getCampusInfo(campusId)
                    .then(d =>{
                        let data = d.data;
                        let campus = new Campus(
                            data.campus_id,
                            data.name,
                            data.university_id,
                            data.state_id,
                            data.img_file,
                            data.full_file_name,
                            data.university_name,
                            data.state_name
                        );
                        if (!!!campus.campus_id) {
                            router.push("/404");
                        }
                        if (!!campus && campus.full_file_name!= null) {
                            import(`../../public/campuses/${campus.full_file_name}`).then( img => {
                                setCampusImage(img.default.src);
                            }).catch( err => {
                                console.log("error importing the image. ", err);
                            })   
                        }
                        setCampus(campus);
                    })
                    .catch((err) =>{
                        console.log("error getting the campus info. ", err);
                    });
            } else {
                router.push("/404");
            }
        }
    }, [campusId]);

    return <>
        <Head>
            <title>Campus</title>
        </Head>
        <div className='hero-title'>
            <h1 className=''>
                {'  ' + campus?.name}
            </h1>
        </div>

        <CampusInfoStyle>
            <img className='building-img' src={!!campusImage ? campusImage : noAvailable.src} alt="imagen del campus" />

            <div className='campus-brief-info'>
                <div className='label-brief'>Estado</div>
                <div className='content-brief'>{campus?.state_name}</div>
                <div className='label-brief'>Universidad</div>
                <div className='content-brief'>{campus?.university_name}</div>
            </div>


            <div className='table-title'>Profesores pertenecientes al campus</div>
            <TableContainer className='teachers-table'>
                <Table variant='striped' colorScheme='blue'>
                    <Thead>
                    <Tr>
                        <Th>Profesor</Th>
                        <Th>Materia</Th>
                        <Th isNumeric>Comentarios</Th>
                        <Th isNumeric>Puntaje</Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                    <Tr>
                        <Td>inches</Td>
                        <Td>millimetres (mm)</Td>
                        <Td isNumeric>25</Td>
                        <Td isNumeric>25.4</Td>
                    </Tr>
                    <Tr>
                        <Td>feet</Td>
                        <Td>centimetres (cm)</Td>
                        <Td isNumeric>3</Td>
                        <Td isNumeric>30.48</Td>
                    </Tr>
                    <Tr>
                        <Td>yards</Td>
                        <Td>metres (m)</Td>
                        <Td isNumeric>9</Td>
                        <Td isNumeric>0.91444</Td>
                    </Tr>
                    </Tbody>
                </Table>
            </TableContainer>
        </CampusInfoStyle>
    </>
}

export default CampusPage
