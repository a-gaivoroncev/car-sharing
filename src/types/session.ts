export interface ICreateSession {
  rentPrice: number;
  dateFromString: string;
  dateToString: string;
  carId: string;
  tariffId: string;
}

export interface ISessionData {
  car_number: string;
  date_from: string;
  date_to: string;
}

export interface IGetSessions {
  session_data: ISessionData;
}
