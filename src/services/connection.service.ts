import api from './api';
import { AxiosResponse } from 'axios';

import { environment } from '../environments/environments';

interface totalConnections {
    total: number;
}

interface newConnection {
    user_id: number;
}

const path = environment.apiPathConnections;

export default class ConnectionService {

    static async getTotalConnections(): Promise<number> {
        const response = await api.get<totalConnections>(path);

        return response.data.total;
    }

    static async addNewConnection(connection: newConnection): Promise<void> {
        await api.post<newConnection, AxiosResponse>(path, connection);
    }
}