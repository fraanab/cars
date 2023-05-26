// import { utilService } from './util.service.js'
import { httpService } from './http.service.js'
import { userService} from './user.service.js'

const vendors = ['Audi', 'BMW', 'Golf', 'Mazda', 'Ferari']
const bodyStyles = ['Coupe', 'Sedan', 'Truck', 'Hatchback'];
const transmissions = ['Automatic', 'Manual', 'Robotic'];
const drivetrains = ['Rear-wheel drive', 'Front-wheel drive', 'All-wheel drive'];
const colors = ['Blue', 'Black', 'Red', 'Yellow', 'Green', 'Gray'];


const CAR_KEY = 'cars'
const CAR_URL = '//localhost:3030/api/car/'

// createDemoData()

async function createDemoData(){
    save(await _createDemoCar1());
    save(await _createDemoCar2());
    save(await _createDemoCar3());
    save(await _createDemoCar4());
    save(await _createDemoCar5());
    save(await _createDemoCar6());
    save(await _createDemoCar7());
    save(await _createDemoCar8());
    save(await _createDemoCar9());
    save(await _createDemoCar10());
    save(await _createDemoCar11());    
    save(await _createDemoCar12());
    save(await _createDemoCar13());
    save(await _createDemoCar14());
    save(await _createDemoCar15());
    save(await _createDemoCar16());
    save(await _createDemoCar17());
    save(await _createDemoCar18());
}
export const carService = {
    query,
    queryUserCars,
    save,
    getEmptyCar,
    getById,
    makeRandomUser,
    getBodyStyleList,
    getVendorList,
    getTransmissionList,
    getDrivetrainList,
    saveComment,
    saveBid,
    saveLike,
    removeLike,
    getLastBid,
    changeTime
}

async function query(filterBy) {
    var currFiletr = JSON.parse(JSON.stringify(filterBy))
    if (!filterBy.name) currFiletr.name = ''
    if (!filterBy.bodyStyles) currFiletr.bodyStyles = 'all'
    if (filterBy.bodyStyles === 'All') currFiletr.bodyStyles = 'all'
    if (!filterBy.vendors || !filterBy.vendors.length) currFiletr.vendors = ['all']
    if (!filterBy.byYears) currFiletr.byYears = [1970, 2021]
    if (!filterBy.sortBy) currFiletr.sortBy = 'ending-soon'

    var queryStr = (!filterBy) ? '' : `?name=${currFiletr.name}&bodyStyles=${currFiletr.bodyStyles}&vendors=${currFiletr.vendors}&years=${currFiletr.byYears}&pageIdx=${currFiletr.pageIdx}&pageSize=${currFiletr.pageSize}&sortBy=${currFiletr.sortBy}`
    const data = await httpService.get(`car${queryStr}`)
    return data
}

async function queryUserCars(userId) {
    if (!userId) userId = ''
    const data = await httpService.get(`car/user/${userId}`)
    return data
}

async function getById(carId) {
    const car = await httpService.get(`car/${carId}`)
    return car
}

async function saveComment(comment) {
    const res = await httpService.post('car/comment', comment)
    return res
}

async function saveBid(bid) {
    return await httpService.post('car/bid', bid)
}

async function saveLike(like) {
    const res = await httpService.post('car/like', like)
    return res
}

async function removeLike(like) {
    return httpService.delete(`car/like/${like.carId}`)
}

async function changeTime(carId) {
    var res =  await httpService.post('car/time', {carId})
    return res
}


async function save(car) {
    if (car._id) {
        return await httpService.put('car', car)
    } else {
        return await httpService.post('car', car)
    }
}

function getLastBid(car) {
    var currCar = JSON.parse(JSON.stringify(car))
    currCar.auction.bids.sort((bid1, bid2) => { return bid2.price - bid1.price })
    if (car.auction.bids.length) return currCar.auction.bids[0].price
    else return currCar.auction.startPrice
}

function getVendorList() {
    var vendors = ["Abarth", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Bugatti", "Cadillac", "Chevrolet", "Chrysler", "Citroën", "Dacia", "Daewoo", "Daihatsu", "Dodge", "Donkervoort", "DS", "Ferrari", "Fiat", "Fisker", "Ford", "Honda", "Hummer", "Hyundai", "Infiniti", "Iveco", "Jaguar", "Jeep", "Kia", "KTM", "Lada", "Lamborghini", "Lancia", "Land Rover", "Landwind", "Lexus", "Lotus", "Maserati", "Maybach", "Mazda", "McLaren", "Mercedes-Benz", "MG", "Mini", "Mitsubishi", "Morgan", "Nissan", "Opel", "Peugeot", "Porsche", "Renault", "Rolls-Royce", "Rover", "Saab", "Seat", "Skoda", "Smart", "SsangYong", "Subaru", "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo"]
    return vendors.map(item => { return { value: item, label: item } })
}

function getBodyStyleList() {
    var bodyStyles = ['All', 'Coupe', 'Convertible', 'Sedan', 'SUV/Crossover', 'Hatchback']
    return bodyStyles.map(item => { return { value: item, label: item } })
}

function getTransmissionList() {
    return transmissions.map(item => { return { value: item, label: item } })
}

function getDrivetrainList() {
    return drivetrains.map(item => { return { value: item, label: item } })
}

function getEmptyCar() {
    return {
        vendor: '',
        model: '',
        bodyStyle: '',
        year: null,
        transmission: '',
        drivetrain: '',
        mileage: 0,
        engine: '',
        exteriorColor: '',
        interiorColor: '',
        desc: '',
        equipments: [],
        owner: {},
        imgUrls: [],
        location: {
            address: '',
            lat: 0,
            lng: 0
        },
        comments: [],
        likes: [],
        msgs: [],
        auction:
        {
            bids: [],
            startPrice: 0,
            status: 'active',
            createdAt: null,
            duration: 1000 * 60 * 60 * 24 * 7
        }
    }
}

function makeRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

async function makeRandomUser() {
    var users = await userService.getUsers();
    const idx = makeRandomInt(0, users.length - 1);
    var minimalUser = {
        _id: users[idx]._id,
        fullname: users[idx].fullname,
        imgUrl: users[idx].imgUrl
    }
    return minimalUser
}

async function _createDemoCar1() {
    const _id = '1'
    const car = {
        vendor: 'BMW',
        model: '550i',
        bodyStyle: 'Sedan',
        year: 2014,
        transmission: 'Automatic',
        drivetrain: '4WD/AWD',
        mileage: 91100,
        engine: '4.4L Turbocharged V8',
        exteriorColor: 'Carbon Black Metallic',
        interiorColor: 'Black',
        desc: 'THIS... is a 2014 BMW 550i xDrive, finished in Carbon Black with a black leather interior.',
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/4.jpg',
            'images/' + _id + '/1.jpg'
        ],
        location: {
            address: 'Chicago, IL 60634',
        },
        fake: true
    }
    return car
}

async function _createDemoCar2() {
    const _id = '2'
    const car = {
        vendor: 'Audi',
        model: 'S6',
        bodyStyle: 'Sedan',
        year: 2008,
        transmission: 'Automatic',
        drivetrain: '4WD/AWD',
        mileage: 135700,
        engine: '5.2L V10',
        exteriorColor: 'Quartz Gray Metallic',
        interiorColor: 'Black',
        desc: 'THIS... is a 2008 Audi S6, finished in Quartz Gray Metallic with a black leather interior.',
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'Martinez, CA 94553',
        },
        fake: true
    }
    return car
}

async function _createDemoCar3() {
    const _id = '3'
    const car = {
        vendor: 'Porsche',
        model: 'Boxster',
        bodyStyle: 'Convertible',
        year: 1998,
        transmission: 'Manual',
        drivetrain: 'Rear-wheel drive',
        mileage: 132300,
        engine: '2.5L Flat-6',
        exteriorColor: 'Guards Red',
        interiorColor: 'Savannah Beige',
        desc: 'THIS... is a 1998 Porsche Boxster, finished in Guards Red with a beige cloth soft top and a Savannah Beige leather interior.',
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'Austin, TX 78750',
        },
        fake: true
    }
    return car
}

async function _createDemoCar4() {
    const _id = '4'
    const car = {
        vendor: 'BMW',
        model: 'M5',
        bodyStyle: 'Sedan',
        year: 2018,
        transmission: 'Automatic',
        drivetrain: '4WD/AWD',
        mileage: 14000,
        engine: '4.4L Turbocharged V8',
        exteriorColor: 'Marina Bay Blue',
        interiorColor: 'Silverstone',
        desc: 'THIS... is a 2018 BMW M5, finished in Marina Bay Blue with a Silverstone full leather interior.',
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'Humble, TX 77346',
        },
        fake: true
    }
    return car
}

async function _createDemoCar5() {
    const _id = '5'
    const car = {
        vendor: 'Audi',
        model: 'S5',
        bodyStyle: 'Coupe',
        year: 2013,
        transmission: 'Automatic',
        drivetrain: '4WD/AWD',
        mileage: 87400,
        engine: '3.0L Supercharged V6',
        exteriorColor: 'Ibis White',
        interiorColor: 'Black/Magma Red',
        desc: 'THIS... is a 2013 Audi S5 coupe, finished in Ibis White with a black and Magma Red leather interior.',
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'Clayton, NC 27527',
        },
        fake: true
    }
    return car
}

async function _createDemoCar6() {
    const _id = '6'
    const car = {
        vendor: 'Mercedes-Benz',
        model: 'G550',
        bodyStyle: 'SUV/Crossove',
        year: 2017,
        transmission: 'Automatic',
        drivetrain: '4WD/AWD',
        mileage: 5500,
        engine: '4.0L Turbocharged V8',
        exteriorColor: 'Obsidian Black Metallic',
        interiorColor: 'Black',
        desc: 'THIS... is a 2017 Mercedes-Benz G550 4×4², finished in Obsidian Black with a black interior.',
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'Fort Worth, TX 76108',
        },
        fake: true
    }
    return car
}

async function _createDemoCar7() {
    const _id = '7'
    const car = {
        vendor: 'Tesla',
        model: 'Model Y',
        bodyStyle: 'SUV/Crossove',
        year: 2020,
        transmission: 'Automatic',
        drivetrain: '4WD/AWD',
        mileage: 3400,
        engine: 'Dual Motors',
        exteriorColor: 'Solid Black',
        interiorColor: 'White/Black',
        desc: 'THIS... is a 2020 Tesla Model Y, finished in Solid Black with a white and black interior.',
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'Greensboro, NC 27410',
        },
        fake: true
    }
    return car
}

async function _createDemoCar8() {
    const _id = '8'
    const car = {
        vendor: 'Porsche',
        model: '911',
        bodyStyle: 'Convertible',
        year: 2004,
        transmission: 'Manual',
        drivetrain: '4WD/AWD',
        mileage: 45100,
        engine: '3.6L Flat-6',
        exteriorColor: 'Black',
        interiorColor: 'Black',
        desc: 'THIS... is a 2004 Porsche 911 Carrera 4S Cabriolet, finished in black with a black cloth soft top and a black leather interior.',
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'Santa Barbara, CA 93101',
        },
        fake: true
    }
    return car
}

async function _createDemoCar9() {
    const _id = '9'
    const car = {
        vendor: 'Aston Martin',
        model: 'V8 Vantage',
        bodyStyle: 'Convertible',
        year: 2009,
        transmission: 'Automatic',
        drivetrain: 'Rear-wheel drive',
        mileage: 44500,
        engine: '4.7L V8',
        exteriorColor: 'Titanium Silver Metallic',
        interiorColor: 'Black',
        desc: 'THIS... is a 2009 Aston Martin V8 Vantage Roadster, finished in Titanium Silver Metallic with a black interior.',
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'North Hollywood, CA 91605',
        },
        fake: true
    }
    return car
}

async function _createDemoCar10() {
    const _id = '10'
    const car = {
        vendor: 'Honda',
        model: 'S2000',
        bodyStyle: 'Convertible',
        year: 2001,
        transmission: 'Automatic',
        drivetrain: 'Rear-wheel drive',
        mileage: 94500,
        engine: '2.0L I4',
        exteriorColor: 'Apex Blue Pearl',
        interiorColor: 'Black/Blue',
        desc: 'THIS... is a 2001 Honda S2000, refinished in Apex Blue Pearl with a black leather interior.',
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'Butler, PA 16002',
        },
        fake: true
    }
    return car
}

async function _createDemoCar11() {
    const _id = '11'
    const car = {
        vendor: 'Ferrari',
        model: 'F430',
        bodyStyle: 'Coupe',
        year: 2006,
        transmission: 'Automatic',
        drivetrain: 'Rear-wheel drive',
        mileage: 34500,
        engine: '4.3L 8V',
        exteriorColor: 'Nero B/B',
        interiorColor: 'Cuoio',
        desc: 'THIS… is a 2006 Ferrari F430 Berlinetta, finished in Nero B/B with a Cuoio leather interior.',
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'Jacksonville, FL 32207',
        },
        fake: true
    }
    return car
}

async function _createDemoCar12() {
    const _id = '12'
    const car = {
        vendor: 'Ferrari',
        model: '458',
        bodyStyle: 'Coupe',
        year: 2013,
        transmission: 'Automatic',
        drivetrain: 'Rear-wheel drive',
        mileage: 22500,
        engine: '4.5L 8V',
        exteriorColor: 'Rosso Corsa',
        interiorColor: 'Beige',
        desc: 'THIS... is a 2013 Ferrari 458 Italia, finished in Rosso Corsa with a beige leather interior.',
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'Hayward, CA 94544',
        },
        fake: true
    }
    return car
}

async function _createDemoCar13() {
    const _id = '13'
    const car = {
        vendor: 'Ferrari',
        model: 'Spider',
        bodyStyle: 'Convertible',
        year: 2003,
        transmission: 'Manual',
        drivetrain: 'Rear-wheel drive',
        mileage: 24000,
        engine: '3.6L 8V',
        exteriorColor: 'Grigio Alloy',
        interiorColor: 'Blue',
        desc: 'THIS... is a 2003 Ferrari 360 Spider, finished in Grigio Alloy with a blue leather interior.',
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'Toronto, ON, Canada',
        },
        fake: true
    }
    return car
}

async function _createDemoCar14() {
    const _id = '14'
    const car = {
        vendor: 'Ferrari',
        model: 'FF',
        bodyStyle: 'Hatchback',
        year: 2012,
        transmission: 'Automatic',
        drivetrain: '4WD/AWD',
        mileage: 16800,
        engine: '6.3L V12',
        exteriorColor: 'Grigio Abu Dhabi',
        interiorColor: 'Testa di Moro',
        desc: 'THIS... is a 2012 Ferrari FF, finished in Grigio Abu Dhabi with a Testa di Moro (brown) leather interior.',
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'Rancho Santa Fe, CA 92067',
        },
        fake: true
    }
    return car
}

async function _createDemoCar15() {
    const _id = '15'
    const car = {
        vendor: 'Ferrari',
        model: 'GTC4Lusso',
        bodyStyle: 'Hatchback',
        year: 2019,
        transmission: 'Automatic',
        drivetrain: '4WD/AWD',
        mileage: 1500,
        engine: '6.3L V12',
        exteriorColor: 'Bianco Avus',
        interiorColor: 'Rosso Ferrari',
        desc: 'THIS... is a 2019 Ferrari GTC4Lusso, finished in Bianco Avus with a Rosso Ferrari leather interior.',
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'New Port Richey, FL 34652',
        },
        fake: true
    }
    return car
}

async function _createDemoCar16() {
    const _id = '16'
    const car = {
        vendor: 'Lamborghini',
        model: 'Gallardo',
        bodyStyle: 'Convertible',
        year: 2014,
        transmission: 'Automatic',
        drivetrain: 'Rear-wheel drive',
        mileage: 14000,
        engine: '5.2L V10',
        exteriorColor: 'Nero Noctis',
        interiorColor: 'Nero Perseus',
        desc: 'THIS… is a 2014 Lamborghini Gallardo LP550-2 Spyder, finished in Nero Noctis with a Nero Perseus leather interior.',
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'Asheville, NC 28805',
        },
        fake: true
    }
    return car
}

async function _createDemoCar17() {
    const _id = '17'
    const car = {
        vendor: 'Mazda',
        model: 'MX-5 Miata',
        bodyStyle: 'Convertible',
        year: 1990,
        transmission: 'Manual',
        drivetrain: 'Rear-wheel drive',
        mileage: 38000,
        engine: '1.6L I4',
        exteriorColor: 'Classic Red',
        interiorColor: 'Black',
        desc: 'THIS... is a 1990 Mazda MX-5 Miata, finished in Classic Red with a black interior.',
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'Narberth, PA 19072',
        },
        fake: true
    }
    return car
}

async function _createDemoCar18() {
    const _id = '18'
    const car = {
        vendor: 'Chevrolet',
        model: 'SSR',
        bodyStyle: 'Convertible',
        year: 2005,
        transmission: 'Manual',
        drivetrain: 'Rear-wheel drive',
        mileage: 65100,
        engine: '6.0L V8',
        exteriorColor: 'Smokin Asphalt',
        interiorColor: 'Ebony',
        desc: 'THIS... is a 2005 Chevrolet SSR, finished in Smokin Asphalt with an Ebony interior.',
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'South Londonderry, PA 17015',
        },
        fake: true
    }
    return car
}

