import axios, { AxiosResponse, AxiosResponseHeaders } from 'axios';
import {CampusUniversity} from '../_models/campus';
import { TeacherWithCampus } from '../_models/teacher';
import { Roster } from '../_models/roster';
import {Vessel} from '../_models/vessel'
import NewUniversity from '../_models/newUniversity';
import NewCampus from '../_models/newCampus';

const TeacherService = {
    getNameVessels,
    getCampusWithUniversity,
    getTeacherWithCampus,
    getUniStructures,
    getUniversities,
    getStates,
    addRoster,
    addUniversity,
    addCampus,
}

const backendsrc = "http://localhost:8080"

async function getNameVessels(tableName: string, target: string, numResults: number = 20): Promise<AxiosResponse<Array<Vessel>>>{
    target = target.replaceAll(/\s+/g,"+");
    const url = `${backendsrc}/search-name/${tableName}/${target}/${numResults}`;
    return axios.get(url);
}

async function getCampusWithUniversity(target: String, numResults: number = 20): Promise<AxiosResponse<Array<CampusUniversity>>>{
    target = target.replaceAll(/\s+/g,"+");
    const url = `${backendsrc}/campus/${target}/${numResults}`;
    return axios.get(url);
}

async function getTeacherWithCampus(target: String, numResults: number = 20): Promise<AxiosResponse<Array<TeacherWithCampus>>>{
    target = target.replaceAll(/\s+/g,"+");
    const url = `${backendsrc}/teacher-campus/${target}/${numResults}`;
    return axios.get(url);
}

async function getUniStructures(): Promise<AxiosResponse<Array<Vessel>>>{
    const url = `${backendsrc}/uni-structure`;
    return axios.get(url);
}

async function getStates(): Promise<AxiosResponse<Array<Vessel>>>{
    const url = `${backendsrc}/state`;
    return axios.get(url);
}

async function addRoster(data: Roster): Promise<AxiosResponse<string>>{
    const url = `${backendsrc}/roster`;
    // Default options are marked with *
    return axios.post(url,data);
}

async function addUniversity(data: NewUniversity): Promise<AxiosResponse<string>>{
    const url = `${backendsrc}/university`;
    // Default options are marked with *
    return axios.post(url,data, {
        maxBodyLength: 50_242_880 // 50MiB
    });
}

async function addCampus(data: NewCampus): Promise<AxiosResponse<string>>{
    const url = `${backendsrc}/campus`;
    // Default options are marked with *
    return axios.post(url,data, {
        maxBodyLength: 50_242_880 // 50MiB
    });
}

async function getUniversities(target: String, numResults: number = 20): Promise<AxiosResponse<Array<Vessel>>>{
    target = target.replaceAll(/\s+/g,"+");
    const url = `${backendsrc}/search-name/university/${target}/${numResults}`;
    return axios.get(url);
}

// search-name/university/zam/100
/* async function cleanCache(token : string): Promise<AxiosResponse<string>>{
    const url = `${backendsrc}/api/usuario/clean-cache`;
    // Default options are marked with *
    return axios.delete(url, {params: {token}});
} */

export default TeacherService;