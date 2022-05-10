
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import TeacherService from '../../_services/teacherService'
import Roster from '../../_models/roster'
import noAvailable from '../../public/no_available.jpg'
import CampusInfoStyle from '../../styles/styledComponents/campusInfo'
import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { getDefaultLibFileName } from 'typescript'
import { stringify } from 'querystring'

const RosterPage = () => {
    const router = useRouter()
    const [rosterId, setRosterId] = useState<number|null>(null);
    const [roster, setRoster] = useState<Roster|null>(null);
    const [campusImage, setCampusImage] = useState<any>(null);
    const {id} = router.query;

    useEffect(() => {
        if(!isNaN(Number(id))){
            setRosterId(Number(id));
        }
    }, [id]);

    useEffect(() => {
        if (rosterId!=null) {
            if (rosterId>0) {
                TeacherService.getTeacherInfo(rosterId)
                    .then(d =>{
                        let roster = d.data;
                        if (!!!roster.roster_id) {
                            router.push("/404");
                        }
                        setRoster(roster);
                    })
                    .catch((err) =>{
                        console.log("error getting the teacher info. ", err);
                    });
            } else {
                router.push("/404");
            }
        } 
    }, [rosterId]);

    function getFullName(name:string, lastname1: string, lastname2?:string){
        return `${name} ${lastname1} ${lastname2 ?? ""}`.trim();
    }

    return <>
        <Head>
            <title>Campus</title>
        </Head>
        <div className='hero-title'>
            <h1 className=''>
                {getFullName(roster?.teacher_name as any, roster?.teacher_lastname1 as any, roster?.teacher_lastname2)}
            </h1>
        </div>

        <CampusInfoStyle>
            <img className='building-img' src={!!campusImage ? campusImage : noAvailable.src} alt="imagen del campus" />

            <div className='campus-brief-info'>
                <div className='label-brief'>Materia</div>
                <div className='content-brief'>{roster?.subject_name}</div>
                <div className='label-brief'>Campus</div>
                <div className='content-brief'>{roster?.campus_name}</div>
            </div>


        ...

        </CampusInfoStyle>
    </>
}

export default RosterPage
