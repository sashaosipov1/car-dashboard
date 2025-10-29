import axios from 'axios';
import type { Car, UpdatedCar } from '../models/CarInterfaces';

export async function addCar(car: UpdatedCar): Promise<void> {
    try {
        await axios.post(`https://ofc-test-01.tspb.su/test-task/vehicles`, JSON.stringify(car));
    } catch (error: unknown) {
        throw new Error(error);
    }
}

export async function changeCar(car: Car, carId: number): Promise<void> {
    try {
        await axios.put(`https://ofc-test-01.tspb.su/test-task/vehicles/${carId}`, JSON.stringify(car));
    } catch (error: unknown) {
        throw new Error(error);
    }
}

export async function removeCar(carId: number): Promise<void> {
    try {
        await axios.delete(`https://ofc-test-01.tspb.su/test-task/vehicles/${carId}`);
    } catch (error: unknown) {
        throw new Error(error);
    }
}

export async function getCars(): Promise<Car[]> {
    let result: Car[];
    try {
        const response = await axios.get(`https://ofc-test-01.tspb.su/test-task/vehicles`);
        result = response.data;
    } catch (error: unknown) {
        throw new Error(error);
    }

    return result;
}