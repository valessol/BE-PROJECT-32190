import crypto from "crypto";

class ContenedorMemoria {
  constructor() {
    this.data = [];
  }

  getAllElements() {
    return { message: "success", code: 200, data: this.data };
  }

  findElementById(id) {
    const data = this.getAllElements().data;
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

  uploadElement(element) {
    const id = this.generateId();
    const elementToUpload = {
      ...element,
      id,
      timestamp: Date.now(),
    };
    const data = this.getAllElements().data;
    this.data = [...data, elementToUpload];
    return { message: "success", code: 201, data: this.data };
  }

  updateElementById(id, element) {
    const elementToUpdate = this.findElementById(id).data;
    if (elementToUpdate) {
      const data = this.getAllElements().data;
      const filteredData = data.filter((el) => el.id !== id);
      this.data = [...filteredData, { ...elementToUpdate, ...element }];
      return {
        message: "success",
        code: 200,
        data: { ...elementToUpdate, ...element },
      };
    } else
      return {
        message: "element not found",
        code: 404,
      };
  }

  deleteElementById(id) {
    const elementToDelete = this.findElementById(id).data;
    if (elementToDelete) {
      const data = this.getAllElements().data;
      const updatedData = data.filter((el) => el.id !== id);
      this.data = updatedData;
      return { message: "success", code: 200, data: updatedData };
    } else
      return {
        message: "element not found",
        code: 404,
      };
  }
}

export default ContenedorMemoria;
