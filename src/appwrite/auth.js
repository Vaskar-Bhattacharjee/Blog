import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client()    
     account;

    constructor() {
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);  //'66ab0c1c00300941795a'
        this.account = new Account(this.client);
       
    }
    async createAccount({email, password, name}) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // call another method
                return this.login({email, password});
            } else {
               return  userAccount;
            }
        } catch (error) {
            console.log(' Failed to create account:', error);
        }
    }
    async login({ email, password }) {
        try {        
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            console.log('Failed to login:', error);
            throw error; // Rethrow the error so it can be caught in the component
        }
    }
    

    async getCurrentUser() {
        try {
            // First, check if there is a session (user is logged in)
            const session = await this.account.getSession('current');
    
            // If there is a session, proceed to get the user details
            if (session) {
                const user = await this.account.get();
                return user;
            }
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser :: error", error.message);
    
            // If user is not authenticated (likely a guest), handle the error gracefully
            if (error.code === 401) {
                console.log("User is not authenticated or session has expired.");
            } else {
                console.log("An unexpected error occurred.");
            }
        }
    
        return null; // Return null if no session or an error occurred
    }


    // async getCurrentUser() {
    //     try {
    //         const user = await this.account.get();
    //         return user; // Return the user details
    //     } catch (error) {
    //         console.log("Appwrite service :: getCurrentUser :: error", error);

    //     }

    //     return null;
    // }



        // try {
        //    const getUser =  await this.account.get();
        //    if (getUser) {
        //     return getUser;
        //    } else {
        //        return null;
        //    }
        // } catch (error) {
        //    console.log(error); 
        // }

        
    
    async logout() {

        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite serive :: logout :: error", error);
        }
    }
    async passwordRecover(email) {
        try {
            const redirectUrl = "http://localhost:5173/confirm-password";
    
            await this.account.createRecovery(email, redirectUrl);
           
            console.log("Recovery email sent successfully.");
        } catch (error) {
            console.log('Appwrite error::passwordRecover::', error);
            
            console.error("Failed to send recovery email.");
        }
    }
    async updatePassword(newPassword) {
        try {
            const response = await this.account.updatePassword(newPassword);
            console.log('Password updated successfully:', response);
            return response;
        } catch (error) {
            console.error('Error updating password:', error);
            throw error;
        }
    }

    // Fixed the recursive issue here by calling the correct method
    async updateRecovery(userId, secret, newPassword) {
        try {
            const response = await this.account.updateRecovery(userId, secret, newPassword);
            console.log('Password recovery successful:', response);
            return response;
        } catch (error) {
            console.error('Error updating password during recovery:', error);
            throw error;
        }
    }
    
}


const authService = new AuthService()

export default authService