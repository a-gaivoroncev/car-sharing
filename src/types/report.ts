interface ICarReport {
  numberOfDays: number;
}

export interface ICarsReport {
  [key: string]: ICarReport
}