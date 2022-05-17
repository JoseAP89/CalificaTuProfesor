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

    function test(): Array<any>{
        let i = 0;
        let obj = [];
        while (i<=5) {
            obj.push(<><i data-star={i} key={i}></i><br /></>)
            i += 0.1;
        }
        return obj;
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

            {
               test().map( x => x)
            }

            <div className='campus-brief-info'>
                <div className='label-brief'>Materia</div>
                <div className='content-brief'>{roster?.subject_name}</div>
                <div className='label-brief'>Campus</div>
                <div className='content-brief'>{roster?.campus_name}</div>
            </div>

            <Button colorScheme='blue' variant='outline' className='add-comment-btn'>
                Agregar comentario
            </Button>


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
