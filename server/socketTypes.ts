export type color = string;
export type uuid = string;

export interface msgCreate {
  msg: string;
  uuid: uuid;
}

export interface message {
  color: color;
  message: string;
}

export type messages = message[];

export interface authCreate {
  uuid: uuid;
  color: color;
}
