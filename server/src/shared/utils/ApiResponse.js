export default class ApiResponse{
    constructor(statusCode, message="Success", payload){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400; 
    }
}