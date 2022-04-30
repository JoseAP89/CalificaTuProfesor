import { faBuilding, faPerson, faGraduationCap, faCircleInfo,
    faBook,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TeacherSearch from "../_models/teacherSearch";
import { Vessel } from "../_models/vessel";
import ListOptionsStyled from '../styles/styledComponents/listOptions';
import { SetStateAction, useEffect, useState } from "react";
import { type } from "os";
import Link from "next/link";

type AAVessel = Vessel[][];

interface Props {
    /// if type is CAMPUS then data is -> [[campus1, university1], ...  ] 
    /// if type is NAME then data is -> [[teacher1, camapus1], ...  ] 
    /// with their respective index positions
    data: AAVessel | null,
    type: TeacherSearch,
    show: Function,
    setOption: Function
}

export default function ListOptions(props: Props) {
    const [data, setdata] = useState<AAVessel | null>(props.data);
    const [type, settype] = useState<TeacherSearch>(props.type);

    useEffect(() => {
        setdata(props.data)
        settype(props.type)
    }, [props.data, props.type]);

    return (
        <ListOptionsStyled >
        {
            data!=null && data.length>0 &&
            data.map((v: Array<Vessel>) => {
                return (
                    <div key={v[0].id} className="list-row"
                        onMouseDown={(e) =>{
                            let valSelected = v[0];
                            props.setOption(valSelected);
                            props.show(false);
                        }}
                    >
                        <div className="sub-top-row">
                            <FontAwesomeIcon icon={type == TeacherSearch.NAME ? faPerson : faBuilding} className="row-icon"/>
                            <div key={v[0].id} className="main-info-row">
                                <p>{v[0].value}</p>
                            </div>
                        </div>
                        { type==TeacherSearch.NAME && v.length>=2 && // subject name
                            <div className="sub-bottom-row">
                                <FontAwesomeIcon icon={faBook} className="row-icon" />
                                <div key={v[2].id} className="secondary-info-row">
                                    <p>{v[2].value}</p>
                                </div>
                            </div>
                        }
                        <div className="sub-bottom-row">
                            <FontAwesomeIcon icon={type == TeacherSearch.NAME ? faBuilding: faGraduationCap } className="row-icon" />
                            <div key={v[1].id} className="secondary-info-row">
                                <p>{v[1].value}</p>
                            </div>
                        </div>
                    </div>
                );
            })
        }
        {
            data!=null && data.length==0 &&
                    <div className="list-row"
                    >
                        <div className="sub-top-row">
                            <FontAwesomeIcon icon={faCircleInfo} className="row-icon"/>
                            <div className="main-info-row">
                                <p>No hay resultados para su búsqueda</p>
                            </div>
                        </div>
                    </div>
        }
        </ListOptionsStyled>
    )
}