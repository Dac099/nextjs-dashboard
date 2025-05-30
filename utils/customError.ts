export class CustomError extends Error {
  public status: number;
  public message: string;
  public details?: string;

  constructor(status: number, message: string, details?: string) {
    super(message);
    this.status = status;
    this.message = message;
    this.details = details;
    this.name = 'CustomError';
    
    // Ensure the prototype chain is correctly set up
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}