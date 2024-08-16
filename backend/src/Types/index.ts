type ContextVariables = {
  decodedPayload: DecodedPayload;
};

type DecodedPayload = {
  id: number;
  username: string;
};

type WebSocketData = {
  username: string;
  userId: number;
  authToken: string;
};

type WebSocketMsg = {
  type: string;
  payload: {
    [key: string]: string | number;
  };
};

export { DecodedPayload, ContextVariables, WebSocketData, WebSocketMsg };
