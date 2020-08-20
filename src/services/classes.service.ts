import api from './api';

import { Teacher } from '../components/TeacherItem';
import { environment } from '../environments/environments';

export interface TeacherFilter {
    subject: string;
    week_day: string;
    time: string;
}

const path = environment.apiPathClasses;

export default class ClassesService {

    static async searchTeachers(filter: TeacherFilter): Promise<Teacher[]> {
        const response = await api.get<Teacher[]>(path, { params: filter });

        return response.data;
    }

}