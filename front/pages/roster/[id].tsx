import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import TeacherService from '../../_services/teacherService'
import Roster from '../../_models/roster'
import RosterInfoStyle from '../../styles/styledComponents/rosterInfo'
import { Button, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faThumbsUp, faThumbsDown, faWarning, faStar } from "@fortawesome/free-solid-svg-icons";
import Star from '../../public/star.svg'
import Link from 'next/link'

const RosterPage = () => {
    const router = useRouter()
    const [rosterId, setRosterId] = useState<number|null>(null);
    const [roster, setRoster] = useState<Roster|null>(null);
    const [campusImage, setCampusImage] = useState<any>(null);
    const {id} = router.query;
    const starHeight = "6rem";

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
            <title>Maestro</title>
        </Head>
        <div className='hero-title'>
            <h1 className=''>
                {getFullName(roster?.teacher_name as any, roster?.teacher_lastname1 as any, roster?.teacher_lastname2)}
            </h1>
        </div>

        <RosterInfoStyle>

            <section className='roster-info-box'>
                <div className='box-info'>
                    <div className='title-box'>DATOS GLOBALES</div>
                    <div className='label-brief'>Calificación General</div>
                    <i data-star="2.7"></i>
                    <div className='label-brief'>{roster?.structure_type?.toLocaleLowerCase()}</div>
                    <div className='content-brief'>{roster?.structure_name}</div>
                    <div className='label-brief'>campus</div>
                    <div className='content-brief'>{roster?.campus_name}</div>
                </div>
                <div className='box-info'>
                    <div className='title-box'>Habilidades</div>
                    <div className='skills-box'>
                        <div className='label-brief'>Claridad</div>
                        <i data-star="0.3" style={{fontSize:"60px",lineHeight:"60px"}}></i>
                        <div className='label-brief'>Competencia</div>
                        <i data-star="0.8" style={{fontSize:"60px",lineHeight:"60px"}}></i>
                        <div className='label-brief'>Expresión</div>
                        <i data-star="1.0" style={{fontSize:"60px",lineHeight:"60px"}}></i>
                        <div className='label-brief'>Métodos</div>
                        <i data-star="1.5" style={{fontSize:"60px",lineHeight:"60px"}}></i>
                        <div className='label-brief'>Modelo</div>
                        <i data-star="2.0" style={{fontSize:"60px",lineHeight:"60px"}}></i>
                        <div className='label-brief'>Organización</div>
                        <i data-star="3.2" style={{fontSize:"60px",lineHeight:"60px"}}></i>
                        <div className='label-brief'>Preparación</div>
                        <i data-star="2.5" style={{fontSize:"60px",lineHeight:"60px"}}></i>
                        <div className='label-brief'>Realidad</div>
                        <i data-star="2.3" style={{fontSize:"60px",lineHeight:"60px"}}></i>
                    </div>
                </div>
            </section>

            <Link href={`/grade/${rosterId}`}>
                <Button colorScheme='blue' variant='outline' className='add-comment-btn'>
                    Calificar
                </Button>
            </Link>


            <section className='comments-container'>
                {
                    [1, 2, 3].map( i => {
                        return (
                            <div className='comment-block' key={i}>
                                <div className='teacher-logo-block'>
                                    <FontAwesomeIcon icon={faUser} className="user-logo"/>
                                </div>
                                <div className='info-block'>
                                    <div className='info-content'>
                                        <div className='info-item'>
                                            <span className='info-title'>Materia:</span> Analisis de algoritmos
                                        </div>
                                    </div>
                                </div>
                                <div className='text-block'>
                                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iure aliquam autem iusto fugit? Nesciunt vero sed molestiae est ad! Sequi temporibus non impedit rem facilis iusto dicta possimus iste blanditiis hic, obcaecati sunt distinctio deleniti tempora dolorem dignissimos consequatur optio consequuntur corporis. Ab nobis totam porro nisi! Consequatur, tenetur quaerat?
                                </div>
                                <div className='buttons-block'>
                                    <FontAwesomeIcon icon={faThumbsUp} className="like-it btn"/>
                                    <FontAwesomeIcon icon={faThumbsDown} className="dislike-it btn"/>
                                    <FontAwesomeIcon icon={faWarning} className="report-it btn"/>
                                </div>
                            </div>
                        );
                    })
                }
            </section>


        ...

        </RosterInfoStyle>
    </>
}

export default RosterPage
