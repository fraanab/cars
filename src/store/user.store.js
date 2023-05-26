import { userService } from "../services/user.service";
import { carService } from "../services/car.service";

export const userStore = {
    state: {
        user: userService.getLoggedinUser(),
        msgs: [],
        loginShown: false,
    },
    getters: {
        loggedinUser(state) {
            return state.user
        },
        loginShown({loginShown}) {
            return loginShown
        },
        userMsgs({msgs}) {
            return msgs;
        }
    },
    mutations: {
        toggleLogin(state, {isShown}) {
            state.loginShown = isShown
        },
        setLoggedinUser(state, { user }) {
            state.user = user;
        }
    },
    actions: {
        async getUserMsgs({state}) {
            state.msgs = []           
            if (state.user) { 
                const userCars = await carService.queryUserCars(state.user._id);
                userCars.forEach(car => {
                    car.msgs?.forEach(msg=>{
                        if (msg.by._id !== state.user._id) state.msgs.push(msg)
                    })                
                })
                state.msgs.sort((msg1, msg2) => { return msg2.createdAt - msg1.createdAt })            
            }
        },
        async addUserMsg( {state}, {msg}) {
            //if (msg.type === 'car') state.msgs.unshift(msg)
            // else 
            if (state.user){
                const userCars = await carService.queryUserCars(state.user._id);
                const carFound = userCars.find(car=>{
                    return car._id === msg.carId                
                })
                if (msg.by._id !== state.user._id) {
                    if (carFound) state.msgs.unshift(msg)
                    return carFound
                } else return false
            }
            return false
        },
        async signUp(context, { user }) {
            try {
                const signupedUser = await userService.signUp(user)
                context.commit({ type: 'setLoggedinUser', user: signupedUser })
                return signupedUser
            } catch (err) {
                throw err
            }

        },
        async login(context, { user }) {
            try {
                const loggedinUser = await userService.login(user)
                context.commit({ type: 'setLoggedinUser', user: loggedinUser })
                return loggedinUser
            } catch (err) {
                throw err
            }

        },
        async logout(context) {
            try {
                const logout = await userService.logout()
                context.commit({ type: 'setLoggedinUser', user: null })
                context.state.msgs = []
                return logout
            } catch (err) {
                throw err
            }
        }
    }
}