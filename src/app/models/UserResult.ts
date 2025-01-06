export class   UserResult{
  constructor(
    public id:any,
    public firstname: string,
    public lastname: string,
    public email: string,
    public password: string,
    public phone: string,

    public role: string
  ) {}
}
