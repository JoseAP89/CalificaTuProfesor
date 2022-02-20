import axios, { AxiosResponse, AxiosResponseHeaders } from 'axios';
import Campus from '../_models/campus';
import {Vessel} from '../_models/vessel'

const TeacherService = {
    getNameVessels,
    getCampusWithUniversity
}

const backendsrc = "http://localhost:8080"

async function getNameVessels(tableName: string, target: string, numResults: number = 20): Promise<AxiosResponse<Array<Vessel>>>{
    target = target.replaceAll(/\s+/g,"+");
    const url = `${backendsrc}/search-name/${tableName}/${target}/${numResults}`;
    return axios.get(url);
}

async function getCampusWithUniversity(target: String, numResults: number): Promise<AxiosResponse<Array<Campus>>>{
    target = target.replaceAll(/\s+/g,"+");
    const url = `${backendsrc}/campus/${target}/${numResults}`;
    return axios.get(url);
}


/* async function addUsuario(data: FormaUsuario): Promise<AxiosResponse<string>>{
    const url = `${backendsrc}/api/usuario`;
    // Default options are marked with *
    return axios.post(url,data);
} */

/* async function cleanCache(token : string): Promise<AxiosResponse<string>>{
    const url = `${backendsrc}/api/usuario/clean-cache`;
    // Default options are marked with *
    return axios.delete(url, {params: {token}});
} */

export default TeacherService;