const userModel = require('../models/user.model');

module.exports.createUser = async ({firstname, lastname, email, password}) => {
    try{
      
        if(!firstname || !password || !email){
            throw new Error('Missing required fields');
        }

        const user = userModel.create({
            fullName: {
                firstName : firstname,
                lastName : lastname
            },
            email,
            password
        });

        console.log(user, "user.services");
        
        return user;
    }
    catch(error){
        throw new Error(error);
    }
};