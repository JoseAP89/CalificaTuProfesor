import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import TeacherService from '../../_services/teacherService'
import {Campus} from '../../_models/campus'
import noAvailable from '../../public/no_available.jpg'

const CampusPage = () => {
    const router = useRouter()
    const [campusId, setCampusId] = useState<Number|null>(null);
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
                TeacherService.getCampusInfo(campusId as number)
                    .then(d =>{
                        let data = d.data;
                        let campus = new Campus(
                            data.campus_id,
                            data.name,
                            data.university_id,
                            data.state_id,
                            data.img_file,
                            data.full_file_name
                        );
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
                Agrega tu profesor, campus o universidad si aun no se encuentra.
            </h1>
        </div>
        <p>Post: {campusId}</p>
        {
            !!campus && 
            <>
                <div>Nombre del campus: {campus.name}</div>
            </>
        }
        <img src={!!campusImage?campusImage: noAvailable.src} alt="imagen del campus"  height={330} width={300}/>
    </>
}

export default CampusPage
