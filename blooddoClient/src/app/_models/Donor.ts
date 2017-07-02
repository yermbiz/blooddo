export class Donor {

  warn: any = null;
  constructor(
    public firstName: string,
    public lastName: string,
    public contactNumber: string,
    public email: string,
    public bloodGroup: string,
    public lat: number,
    public lon: number,
    public address: string,
    public ip: string,
    public x: number,
    public y: number

  ) { }

  getJSON() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      contactNumber: this.contactNumber,
      email: this.email,
      bloodGroup: this.bloodGroup,
      lat: this.lat,
      lon: this.lon,
      address: this.address,
      ip: this.ip,
      x: this.x,
      y: this.y
    };
  }

  verify() {
    /* TODO */
    return null;
    // this.warn = 'Email is wrong';
    // return this.warn;
  }
}
