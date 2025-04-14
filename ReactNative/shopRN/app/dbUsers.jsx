import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUsers = async () => {
    const users = await AsyncStorage.getItem('users');
    return users ? JSON.parse(users) : [];
};

export const getUsersByEmail = async (email) => {
    const users = await AsyncStorage.getItem('users');
    //get the the user by email
    const user = users ? JSON.parse(users).find(user => user.email === email) : null;
    return user;
};

export const setUsers = async (users) => {
    await AsyncStorage.setItem('users', JSON.stringify(users));
}

export const getIndexUserByEmail = async (email) => {
    const users = await getUsers();
    //get the index of the user by email
    const user = users.find(user => user.email === email);
    return user ? users.indexOf(user) : null;
}


export const setInitialUsers = async () => {
    const existing = await AsyncStorage.getItem('users');
    if (!existing) {
        const users = [
            {
                email: 'john.watson@gmail.com',
                password: '1234',
                cart: [],
                isAdmin: false,
            }
        ];
        await AsyncStorage.setItem('users', JSON.stringify(users));
    }
};

export const addUser = async (user) => {
    const users = await getUsers();
    //check if the user already exists
    const existingUser = users.find(u => u.email === user.email);
    if (existingUser) {
        return { error: 'Already exist' }; // User already exists
    }
    users.push(user);
    await AsyncStorage.setItem('users', JSON.stringify(users));
    return { success: true }; // User added successfully
}

//How to use 

const handleAddUser = async () => {
    const result = await addUser({
        email: 'john.watson@gmail.com',
        password: '1234',
        cart: [],
        isAdmin: false,
    });

    console.log(result); 
};

//fonction to empty the dbUsers
export const emptyDbUsers = async () => {
    await AsyncStorage.removeItem('users');
    await setInitialUsers();
};

//for login
//check if the user exists in the dbUsers
//if exist return the email, if not return false
export const userExist = async (email, password) => {
    const users = await getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        return { email: user.email, isAdmin: user.isAdmin }; // User exists
    }
    return false; // User does not exist
};