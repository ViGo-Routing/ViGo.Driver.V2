import { HubConnectionBuilder } from "@microsoft/signalr";

class SignalRService {
  constructor(token) {
    // console.log(token)
    this.connection = new HubConnectionBuilder()
      .withUrl("https://vigo-api.azurewebsites.net/vigoGpsTrackingHub", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    this.connection.start().catch((err) => console.error(err));
  }
  updateToken(token) {
    console.log("token", token);
    this.connection.stop(); // Dừng kết nối hiện tại
    this.connection = new HubConnectionBuilder()
      .withUrl("https://vigo-api.azurewebsites.net/vigoGpsTrackingHub", {
        accessTokenFactory: () => token, // Cập nhật token mới
      })
      .withAutomaticReconnect()
      .build();

    this.connection.start().catch((err) => console.error(err));
  }
  onReceiveMessage(callback) {
    this.connection.on("ReceiveMessage", (message) => {
      callback(message);
    });
  }
  async sendLocationUpdate(tripId, latitude, longitude) {
    console.log(tripId, latitude, longitude);
    const locationInfo = { latitude: latitude, longitude: longitude };
    this.connection.invoke("SendLocation", tripId, locationInfo);
  }
  sendMessage(message) {
    this.connection.invoke("SendMessage", message);
  }
}

export default new SignalRService();
