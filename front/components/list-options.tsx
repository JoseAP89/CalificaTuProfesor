import { faBuilding, faPerson, faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TeacherSearch from "../_models/teacherSearch";
import { Vessel } from "../_models/vessel";
import ListOptionsStyled from '../styles/styledComponents/listOptions';
import { useEffect, useState } from "react";
import { type } from "os";

type AAVessel = Vessel[][];

interface Props {
    /// if type is CAMPUS then data is -> [[campus1, university1], ...  ] 
    /// if type is NAME then data is -> [[teacher1, camapus1], ...  ] 
    /// with their respective index positions
    data: AAVessel,
    type: TeacherSearch,
    width: number
}

export default function ListOptions(props: Props) {
    const [data, setdata] = useState<AAVessel>(props.data);
    const [type, settype] = useState<TeacherSearch>(props.type);
    const [searchBarWidth, setsearchBarWidth] = useState<number>(props.width);

    useEffect(() => {
        console.log(props);
        setdata(props.data)
        settype(props.type)
        let w = window.document.querySelector("#full-search-bar");
        if (!!w) {
            console.log(w.clientWidth)
            setsearchBarWidth(w.clientWidth);
            
        }
    }, [props.data, props.type]);

    return (
        <ListOptionsStyled width={searchBarWidth}>
            {
                data.map((v: Array<Vessel>) => {
                    return (
                        <div key={v[0].value + v[1].id} className="list-row">
                            <div className="sub-top-row">
                                <FontAwesomeIcon icon={type == TeacherSearch.NAME ? faPerson : faGraduationCap} className="row-icon"/>
                                <div key={v[0].id} className="main-info-row">
                                    <p>{v[0].value}</p>
                                </div>
                            </div>
                            <div className="sub-bottom-row">
                                <FontAwesomeIcon icon={type == TeacherSearch.NAME ? faGraduationCap : faBuilding} className="row-icon" />
                                <div key={v[1].id} className="secondary-info-row">
                                    <p>{v[1].value}</p>
                                </div>
                            </div>
                        </div>
                    );
                })
            }
        </ListOptionsStyled>
    )
}