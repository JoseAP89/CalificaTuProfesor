import axios, { AxiosResponse, AxiosResponseHeaders } from 'axios';
import {Campus, CampusUniversity} from '../_models/campus';
import { TeacherWithCampus } from '../_models/teacher';
import { Roster } from '../_models/roster';
import {Vessel} from '../_models/vessel'
import NewUniversity from '../_models/newUniversity';
import NewCampus from '../_models/newCampus';

const TeacherService = {
    getCampusWithUniversity,
    getTeacherWithCampus,
    getUniStructures,
    getUniversities,
    getCampusInfo,
    getStates,
    addRoster,
    addUniversity,
    addCampus,
}

const backend_csharp = "https://localhost:7167/api"


/** campus*/

async function getCampusWithUniversity(target: String, numResults: number = 20): Promise<AxiosResponse<Array<CampusUniversity>>>{
    target = target.replaceAll(/\s+/g,"+");
    const url = `${backend_csharp}/campus/university/${target}`;
    return axios.get(url);
}

async function getCampusInfo(campusId: number): Promise<AxiosResponse<Campus>>{
    const url = `${backend_csharp}/campus/info/${campusId}`;
    return axios.get(url);
}

async function addCampus(data: NewCampus): Promise<AxiosResponse<string>>{
    const url = `${backend_csharp}/campus`;
    // Default options are marked with *
    return axios.post(url,data, {
        maxBodyLength: 50_242_880 // 50MiB
    });
}


/** teacher */

async function getTeacherWithCampus(target: String, numResults: number = 20): Promise<AxiosResponse<Array<TeacherWithCampus>>>{
    target = target.replaceAll(/\s+/g,"+");
    const url = `${backend_csharp}/roster/campus/${target}/`;
    return axios.get(url);
}

async function addRoster(data: Roster): Promise<AxiosResponse<string>>{
    const url = `${backend_csharp}/roster`;
    // Default options are marked with *
    return axios.post(url,data);
}

/** uni structure */

async function getUniStructures(): Promise<AxiosResponse<Array<Vessel>>>{
    const url = `${backend_csharp}/unistructure`;
    return axios.get(url);
}

/** university */

async function getUniversities(target: String, numResults: number = 20): Promise<AxiosResponse<Array<Vessel>>>{
    target = target.trim().replaceAll(/\s+/g,"+");
    const url = `${backend_csharp}/university/search/${target}`;
    return axios.get(url);
}

async function addUniversity(data: NewUniversity): Promise<AxiosResponse<string>>{
    const url = `${backend_csharp}/university`;
    // Default options are marked with *
    return axios.post(url,data, {
        maxBodyLength: 50_242_880 // 50MiB
    });
}

/** state */

async function getStates(): Promise<AxiosResponse<Array<Vessel>>>{
    const url = `${backend_csharp}/state`;
    return axios.get(url);
}

export default TeacherService;