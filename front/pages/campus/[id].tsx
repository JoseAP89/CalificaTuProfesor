import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Campus = () => {
    const router = useRouter()
    const [campusId, setCampusId] = useState<Number|null>(null);
    const {id} = router.query;

    useEffect(() => {
        if(!isNaN(Number(id))){
            setCampusId(Number(id));
        }
    }, [id]);

    useEffect(() => {
        console.log("data: ", campusId);
        if (campusId!=null) {
            console.log("data: ", campusId);
            if (campusId>0) {
                // bring campus with uni data form that endpoint                
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
    </>
}

export default Campus
