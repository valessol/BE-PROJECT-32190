import fs from "fs";
import crypto from "crypto";

class ContenedorArchivo {
  constructor(dataUrl) {
    this.dataUrl = dataUrl;
  }

  async getAllElements() {
    try {
      const dataFile = await fs.readFileSync(this.dataUrl, "utf-8");
      const data = await JSON.parse(dataFile);
      return data.length
        ? { message: "success", code: 200, data }
        : { message: "empty data", code: 200, data: [] };
    } catch (error) {
      console.log(error);
    }
  }

  async findElementById(id) {
    const response = await this.getAllElements();
    const data = await response.data;
    if (data.length) {
      const element = data.find((el) => el.id === id);
      if (element) {
        return {
          message: "success",
          code: 200,
          data: element,
        };
      } else return { message: "element not found", code: 404 };
    } else return { message: "empty data", code: 404 };
  }

  generateId() {
    return crypto.randomUUID();
  }

  async uploadElement(element) {
    const id = this.generateId();
    const elementToUpload = { ...element, id, timestamp: Date.now() };
    const actualFile = await this.getAllElements();
    const data = await actualFile.data;
    const updatedData = [...data, elementToUpload];
    const response = await fs.promises
      .writeFile(this.dataUrl, JSON.stringify(updatedData))
      .then((res) => {
        return { message: "success", code: 201, data: updatedData };
      })
      .catch((err) => {
        return {
          message: `error, ${err}`,
          code: 500,
        };
      });
    return response;
  }

  async updateElementById(id, element) {
    const elementToUpdateResponse = await this.findElementById(id);
    const elementToUpdate = await elementToUpdateResponse.data;
    if (elementToUpdate) {
      const actualFile = await this.getAllElements();
      const data = await actualFile.data;
      const filteredData = data.filter((el) => el.id !== id);
      const updatedData = [...filteredData, { ...elementToUpdate, ...element }];
      const response = await fs.promises
        .writeFile(this.dataUrl, JSON.stringify(updatedData))
        .then((res) => {
          return { message: "success", code: 201, data: updatedData };
        })
        .catch((err) => {
          return {
            message: `error, ${err}`,
            code: 500,
          };
        });
      return response;
    } else
      return {
        message: "element not found",
        code: 404,
      };
  }

  async deleteElementById(id) {
    const elementToDeleteResponse = await this.findElementById(id);
    const elementToDelete = await elementToDeleteResponse.data;
    if (elementToDelete) {
      const actualFile = await this.getAllElements();
      const data = await actualFile.data;
      const updatedData = data.filter((el) => el.id !== id);
      const response = await fs.promises
        .writeFile(this.dataUrl, JSON.stringify(updatedData))
        .then((res) => {
          return { message: "success", code: 201, data: updatedData };
        })
        .catch((err) => {
          return {
            message: `error, ${err}`,
            code: 500,
          };
        });
      return response;
    } else
      return {
        message: "element not found",
        code: 404,
      };
  }
}

export default ContenedorArchivo;
