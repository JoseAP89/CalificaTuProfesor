import Head from 'next/head'
import { useRouter } from 'next/router'
import { HtmlHTMLAttributes, TextareaHTMLAttributes, useEffect, useState } from 'react'
import Roster from '../../_models/roster'
import TeacherService from '../../_services/teacherService'
import GradeFormStyle from '../../styles/styledComponents/gradeForm';
import { ComponentWithAs, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, Textarea, TextareaProps, Tooltip } from '@chakra-ui/react'
import { Scale } from '../../_models/scale'
import { GradeContainer } from '../../_models/business'

const GradePage = () => {
    const router = useRouter()
    const MAX_COMMENT_LENGTH = 500;
    const [rosterId, setRosterId] = useState<number | null>(null);
    const [teacher, setTeacher] = useState<Roster>();
    const { id } = router.query;
    const [gradeTooltipList, setGradeTooltipList] = useState<boolean[]>([])
    const [scales, setScales] = useState<Scale[]>([])
    const [gradeContainer, setGradeContainer] = useState<GradeContainer[]>([])
    const [comment, setComment] = useState<string>("")


    useEffect(() => {
        TeacherService.getScales().subscribe({
            next: r => {
                let scales = r.data;
                let grades: GradeContainer[] = [];
                let tooltips: boolean[] = [];
                setScales(scales);
                scales.forEach(s => {
                    grades.push(new GradeContainer(0, s.scaleId));
                    tooltips.push(false);
                });
                setGradeContainer(grades);
                setGradeTooltipList(tooltips);
            },
            error: e => {
                console.log("error: ", e);
            }
        });
    }, []);

    useEffect(() => {
        if (!isNaN(Number(id))) {
            setRosterId(Number(id));
        }
    }, [id]);

    useEffect(() => {
        if (rosterId != null && rosterId > 0) {
            TeacherService.getTeacherInfo(rosterId)
                .then(res => {
                    setTeacher(res.data);
                }).catch(e => {
                    console.log("error: ", e);
                }
                );
        }
    }, [rosterId]);

    function getGradeFromGradeContainer(id: number): number {
        if (!!gradeContainer && gradeContainer.length>0) {
            return gradeContainer.find( c => c.scaleId==id)?.grade ?? 0;
        }
        return 0;
    }

    function updateGradeContainer(id: number, grade: number) {
        let gC = gradeContainer.slice();
        for (let index = 0; index < gC.length; index++) {
            const elem: GradeContainer = gC[index];
            if (elem.scaleId == id) {
                elem.grade = grade;
                break;
            }

        }
        setGradeContainer(gC);
    }

    function getGradeTooltipList(id: number): boolean {
        return gradeTooltipList[id - 1];
    }

    function updateGradeTooltipList(id: number, val: boolean) {
        if (!!gradeTooltipList && gradeTooltipList.length>0) {
            let tmp = gradeTooltipList.slice();
            tmp[id - 1] = val;
            setGradeTooltipList(tmp);
            console.log("tooltips:", tmp);
        }
    }

    let handleComment = (e:  any) => {
        let inputValue = e?.target?.value
        setComment(inputValue)
    }

    return <>
        <Head>
            <title>Califica tu profe</title>
        </Head>
        <div className='hero-title'>
            <h1 className=''>
                {(teacher?.teacher_name + ' ' + teacher?.teacher_lastname1 + ' ' + teacher?.teacher_lastname2).toLowerCase()}
            </h1>
        </div>
        <GradeFormStyle>
            <section>
                <div className='section-title'>Califica las habilidades de enseñanza</div>
                {scales.length > 0 &&
                    scales.map(s => {
                        return (
                            <div key={s.scaleId} className="slider-skill-box">
                                <div>{s.name}</div>
                                <Slider
                                    id='slider'
                                    defaultValue={0}
                                    key={s.scaleId}
                                    min={0}
                                    max={5}
                                    colorScheme='teal'
                                    onChange={(v: number) => updateGradeContainer(s.scaleId, v)}
                                    onMouseEnter={() => updateGradeTooltipList(s.scaleId, true)}
                                    onMouseLeave={() => updateGradeTooltipList(s.scaleId, false)}
                                >
                                    <SliderMark value={0} mt='1' ml='-2.5' fontSize='sm'>
                                        0
                                    </SliderMark>
                                    <SliderMark value={1} mt='1' ml='-2.5' fontSize='sm'>
                                        1
                                    </SliderMark>
                                    <SliderMark value={2} mt='1' ml='-2.5' fontSize='sm'>
                                        2
                                    </SliderMark>
                                    <SliderMark value={3} mt='1' ml='-2.5' fontSize='sm'>
                                        3
                                    </SliderMark>
                                    <SliderMark value={4} mt='1' ml='-2.5' fontSize='sm'>
                                        4
                                    </SliderMark>
                                    <SliderMark value={5} mt='1' ml='-4.5' fontSize='sm'>
                                        5
                                    </SliderMark>
                                    <SliderTrack>
                                        <SliderFilledTrack />
                                    </SliderTrack>
                                    <Tooltip
                                        hasArrow
                                        bg='teal.500'
                                        color='white'
                                        placement='top'
                                        isOpen={getGradeTooltipList(s.scaleId)}
                                        label={`${getGradeFromGradeContainer(s.scaleId)}`}
                                    >
                                        <SliderThumb />
                                    </Tooltip>
                                </Slider>
                            </div>
                        )
                    })
                }
            </section>

            <section className='resenia'>
                <div className='section-title'>
                    Escribe una breve reseña de tu experiencia en la materia
                </div>
                <div>
                    Procura escribir con el debido respeto que el profesor requiere, mantengamos este sitio libre de prejuicios, 
                    ofensas y todo aquello que no promueva una crítica constructiva.
                </div>
                <Textarea
                    value={comment}
                    onChange={handleComment}
                    placeholder='Mi opinion sobre el curso es ...'
                    size='sm'
                    className='text-area-box'
                    maxLength={MAX_COMMENT_LENGTH}
                />
                { comment!="" && comment.length<500 && comment.length>0 &&
                    <div className='info-comment-length'>
                        {comment.length}/{MAX_COMMENT_LENGTH} caracteres.
                    </div>
                }
                { comment!="" && comment.length==500 &&
                    <div className='warning-comment-length'>
                        Has alcanzado el máximo de {MAX_COMMENT_LENGTH} caracteres.
                    </div>
                }
            </section>

        </GradeFormStyle>
    </>
}

export default GradePage;