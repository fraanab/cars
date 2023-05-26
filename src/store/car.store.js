import { carService } from "../services/car.service";

export const carStore = {
    state: {
        cars: [],
        carsCount: 0,
  
        filterBy: {
            pageIdx: 0,
            pageSize: Infinity,
        },
        isLoading: false,
    },
    getters: {
        carsCount(state) {
            return state.carsCount
        },
        carsToShow(state) {
            return state.cars
        },
        carsToShowHome(state) {
            var sortCars = JSON.parse(JSON.stringify(state.cars))
            return sortCars.sort((car1, car2) => { return car2.likes.length - car1.likes.length })
        },
        commentsToShow(state) {
            return state.comments
        },
        loading(state) {
            return state.isLoading
        },
        filterBy(state) {
            return state.filterBy
        }
    },
    mutations: {
        setCars(state, { cars }) {
            state.cars = cars;
        },
        setCar(state, { car }) {
            var idx = state.cars.findIndex(currCar => {
                return currCar._id === car._id
            })
            state.cars.splice(idx,1,car);
        },
        setCount(state, { count }) {
            state.carsCount = count;
        },
        addCar(state, { car }) {
            state.cars.unshift(car);
        },
        setFilter(state, { filterBy = {} }) {
            if (filterBy.byYears) state.filterBy.byYears = filterBy.byYears;
            if (filterBy.bodyStyles || filterBy.bodyStyles === '') state.filterBy.bodyStyles = filterBy.bodyStyles;
            if (filterBy.vendors) state.filterBy.vendors = filterBy.vendors;
        },
        setFilterName(state, { name }) {
            state.filterBy.name = name;
        },
        setSort(state, { sortBy }) {
            state.filterBy.sortBy = sortBy
        },
        setLoading(state, { isLoading }) {
            state.isLoading = isLoading
        },
    },
    actions: {
        async loadCars(context) {
            context.commit({ type: 'setLoading', isLoading: true })
            try {
                const data = await carService.query(context.state.filterBy)
                const cars = data[0];
                const count = data[1];
                context.commit({ type: 'setCars', cars });
                context.commit({ type: 'setCount', count });
            } catch (err) {
                console.log('Store: Cannot load cars', err);
                throw new Error('Cannot load cars');
            } finally {
                context.commit({ type: 'setLoading', isLoading: false })
            }
        },
        async saveCar({ commit }, { car }) {
            const type = (car._id) ? 'updateCar' : 'addCar';
            try {
                const savedCar = await carService.save(car)
                commit({ type, car: savedCar })
                return savedCar

            } catch (err) {
                console.log('Store: Cannot save car', err);
                throw new Error('Cannot save car');
            }
        },
        async addComment(context, { comment }) {
            try {
                return await carService.saveComment(comment)
            } catch (err) {
                console.log('Store: Cannot save comment', err);
                throw new Error('Cannot save review');
            }
        },
        async addBid(context, { bid }) {
            try {
                return await carService.saveBid(bid)
            } catch (err) {
                console.log('Store: Cannot save bid', err);
                throw new Error('Cannot save review');
            }
        },
        async addLike(context, { like }) {
            try {
                return await carService.saveLike(like)
            } catch (err) {
                console.log('Store: Cannot save like', err);
                throw new Error('Cannot save like');
            }
        },
        async removeLike(context, { like }) {
            try {
                return await carService.removeLike(like)
            } catch (err) {
                console.log('Store: Cannot save like', err);
                throw new Error('Cannot save like');
            }
        },
    }
}