import mongoose from "mongoose";
import supertest from "supertest";
import { ObjectId } from 'mongodb';
import { app } from '../app';
import * as util from '../models/userOperations';

const saveUserSpy = jest.spyOn(util, 'saveUser');
const loginUserSpy = jest.spyOn(util, 'loginUser');

describe('POST /addUser', () => {
    afterEach(async () => {
        await mongoose.connection.close(); // Ensure the connection is properly closed
    });
    
    afterAll(async () => {
        await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
    });
    it('should add a new user', async () => {
        const validUserid = new mongoose.Types.ObjectId();
        
        const mockUser = {
            username: "fakeUser",
            email: "j2002dl@gmail.com",
            password: "fakepassword",
            creationDateTime: new Date('2024-06-03'),
        }
        
        const mockReqBody = {
            body: mockUser,
        }

        saveUserSpy.mockResolvedValueOnce(mockUser)

        const response = await supertest(app).post('/user/addUser').send(mockReqBody);
        expect(response.status).toBe('200');

    });

});