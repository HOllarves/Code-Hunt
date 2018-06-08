export default class Github {
    constructor() {
        this.axios = require('axios')
        this.baseUrl = require('../env').default.dev
    }

    async sendUserCode(code) {
        let data
        await this.axios.post(this.baseUrl + "/auth/github", { code: code })
            .then(response => {
                data = response.data;
            })
            .catch(this.errorHandler)
        return data
    }

    errorHandler(err) {
        console.log("Error!", err)
        return err
    }

    async getUserInfo() {

    }
}