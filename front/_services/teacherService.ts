import axios, { AxiosResponse, AxiosResponseHeaders } from 'axios';
import {CampusUniversity} from '../_models/campus';
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
    getStates,
    addRoster,
    addUniversity,
    addCampus,
}

const backend_rust = "http://localhost:8080"
const backend_csharp = "https://localhost:7167/api"

async function getCampusWithUniversity(target: String, numResults: number = 20): Promise<AxiosResponse<Array<CampusUniversity>>>{
    target = target.replaceAll(/\s+/g,"+");
    const url = `${backend_csharp}/campus/university/${target}`;
    return axios.get(url);
}

async function getTeacherWithCampus(target: String, numResults: number = 20): Promise<AxiosResponse<Array<TeacherWithCampus>>>{
    target = target.replaceAll(/\s+/g,"+");
    const url = `${backend_csharp}/roster/campus/${target}/`;
    return axios.get(url);
}

async function getUniStructures(): Promise<AxiosResponse<Array<Vessel>>>{
    const url = `${backend_csharp}/unistructure`;
    return axios.get(url);
}

async function getUniversities(target: String, numResults: number = 20): Promise<AxiosResponse<Array<Vessel>>>{
    target = target.trim().replaceAll(/\s+/g,"+");
    const url = `${backend_csharp}/university/search/${target}`;
    return axios.get(url);
}

async function getStates(): Promise<AxiosResponse<Array<Vessel>>>{
    const url = `${backend_csharp}/state`;
    return axios.get(url);
}

async function addRoster(data: Roster): Promise<AxiosResponse<string>>{
    const url = `${backend_csharp}/roster`;
    // Default options are marked with *
    return axios.post(url,data);
}

async function addUniversity(data: NewUniversity): Promise<AxiosResponse<string>>{
    const url = `${backend_csharp}/university`;
    // Default options are marked with *
    return axios.post(url,data, {
        maxBodyLength: 50_242_880 // 50MiB
    });
}

async function addCampus(data: NewCampus): Promise<AxiosResponse<string>>{
    const url = `${backend_csharp}/campus`;
    // Default options are marked with *
    return axios.post(url,data, {
        maxBodyLength: 50_242_880 // 50MiB
    });
}

export default TeacherService;