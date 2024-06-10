import { Client, Databases } from "node-appwrite";
import Config from "./config/config.js";
import ErrorHandler from "./handlers/errorHandler.js";
import logger from "./utils/logger.js";

const { APPWRITE_ENDPOINT, PROJECT_ID } = Config.APPWRITE;
class ChatController {
  constructor(io) {
    this.io = io;
    this.client = new Client()
      .setEndpoint(APPWRITE_ENDPOINT)
      .setProject(PROJECT_ID);
    this.databases = new Databases(this.client);
  }

  handleConnection(socket) {
    socket.on("join", async ({ roomId }) => {
      socket.join(roomId);
      logger.info(`joining ${roomId}`);
      try {
        const messages = await this.getChatHistory(roomId);
        socket.emit("loadMessages", messages);
      } catch (error) {
        logger.error("Error loading messages:", error);
        socket.emit("error", "Failed to load messages");
      }
    });

    socket.on("sendMessage", async ({ roomId, message }) => {
      try {
        await this.saveMessage(roomId, message);
        logger.info(message);
        // Emitting message only to the specific room
        socket.to(roomId).emit("message", message);
      } catch (error) {
        logger.error("Error sending message:", error);
        socket.emit("error", "Failed to send message");
      }
    });

    socket.on("disconnect", () => {
      logger.info("User disconnected");
    });
  }

  async getChatHistory(roomId) {
    try {
      const result = await this.databases.listDocuments(
        "collections/chat",
        roomId
      );
      return result.documents;
    } catch (error) {
      throw new ErrorHandler(
        500,
        "Error retrieving chat history",
        error.message
      );
    }
  }

  async saveMessage(roomId, message) {
    try {
      await this.databases.createDocument("collections/chat", roomId, message);
    } catch (error) {
      throw new ErrorHandler(500, "Failed to save message", error.message);
    }
  }
}

export default ChatController;
