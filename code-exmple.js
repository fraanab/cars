async function queryUserCars(userId = '') {
    const criteria = _buildUserCriteria(userId)
    try {
        const collection = await dbService.getCollection('cars')
        return await collection.find(criteria).toArray()
    } catch (err) {
        logger.error('Cannot find users cars', err)
        throw err
    }
}

function _buildUserCriteria(userId) {
    const criteria = {}
        userId = ObjectId(userId)
        criteria.$or = [
            {
                'owner._id': userId
            },
            {
                'likes.by._id': userId
            },
            {
                'auction.bids.by._id': userId
            },
            {
                'comments.by._id': userId
            }
        ]
    return criteria
}

// Getting user last login

async function getUserMsgs({state}) {
    this.newMsgCount = 0;
    const userCars = await carService.queryUserCars(state.user._id);
    userCars.forEach(car => {
        car.msgs?.forEach(msg=>{
            if (msg.by._id !== state.user._id) {
                state.msgs.push(msg)
                if (msg.createdAt > loggedInUser.lastLogin) this.newMsgCount++  
            }
        })                
    })
    state.msgs.sort((msg1, msg2) => { return msg2.createdAt - msg1.createdAt })            
}