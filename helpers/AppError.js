class AppError extends Error {
    constructor(msg, status) {
        super(msg, status)
        this.name = "AppError"
        this.status = status
    }
}
module.exports = AppError