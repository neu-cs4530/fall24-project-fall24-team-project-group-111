import mongoose from "mongoose";
import supertest from "supertest";
import { ObjectId } from 'mongodb';
import { app } from '../app';
import * as util from '../models/userOperations';
import { saveUser } from "../models/userOperations";
import { User } from "../types";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

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
            mockUser
        }

        saveUserSpy.mockResolvedValueOnce(mockUser)

        const response = await supertest(app).post('/user/addUser').send(mockReqBody);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User created successfully');

    });

    it('should log into an existing user', async () => {

    });
});

describe('userOperations', () => {
    
    beforeEach(() => {
        mockingoose.resetAll();
    });

    describe('saveUser', () => {
        test('saveUser should return the saved user', async () => {
            const mockUser = {
                username: "fakeUser",
                email: "j2002dl@gmail.com",
                password: "fakepassword",
                creationDateTime: new Date('2024-06-03'),
            };

          const result = (await saveUser(mockUser)) as User;

          expect(result._id).toBeDefined;
          expect(result.username).toEqual(mockUser.username);
          expect(result.email).toEqual(mockUser.email);
          expect(result.password).toEqual(mockUser.password);
          expect(result.creationDateTime).toEqual(mockUser.creationDateTime);
        });
    });
});