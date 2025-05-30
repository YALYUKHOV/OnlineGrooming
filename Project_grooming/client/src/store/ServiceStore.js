import { makeAutoObservable } from "mobx";
import { fetchServices } from "../http/serviceAPI";

export default class ServiceStore {
    constructor() {
        this._services = [];
        this._types = [];
        this._selectedType = null;
        this._loading = false;
        this._error = null;

        makeAutoObservable(this);
    }

    async loadServices() {
        try {
            this._loading = true;
            const services = await fetchServices();
            this.setServices(services);
            this.updateTypes(services);
        } catch (error) {
            console.error('Error loading services:', error);
            this._error = error.message;
        } finally {
            this._loading = false;
        }
    }

    setServices(services) {
        this._services = services;
        this.updateTypes(services);
    }

    updateTypes(services) {
        const types = [...new Set(services.map(service => service.category))].filter(Boolean);
        this.setTypes(types);
    }

    setTypes(types) {
        this._types = types;
    }

    setSelectedType(type) {
        this._selectedType = type;
    }

    get services() {
        return this._services;
    }

    get types() {
        return this._types;
    }

    get selectedType() {
        return this._selectedType;
    }

    get filteredServices() {
        if (!this._selectedType) {
            return this._services;
        }
        return this._services.filter(service => service.category === this._selectedType);
    }

    get loading() {
        return this._loading;
    }

    get error() {
        return this._error;
    }
}
    